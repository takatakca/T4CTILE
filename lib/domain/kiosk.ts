// T4CTILE — self-service kiosk / touch ordering on the merchant's real Clover menu.
//  - A kiosk is a device key (kind "kiosk") made in the dashboard; the kiosk page keeps it on the screen.
//  - The order is checked against the live Clover menu, created in Clover (title "Borne <name> · #<n>") and printed
//    on the order printer. This web kiosk does not take cards: the customer pays at the counter (paying on the device
//    is the Android kiosk app's job, with Clover's Payments API — next step).
//  - "Ready" comes from Food Hub (TAKATAK Suite) when the kitchen marks the order ready: the waiting screen shows it.
import { createCloverOrder, printOrder, readMenu, validateCart, type CartLine, type Menu } from '../clover/menu';
import { getStore } from '../core/store';
import { localDate } from '../core/time';

export interface KioskSettings { welcomeFr: string; welcomeEn: string; idleSeconds: number; photoBaseUrl: string | null }
export const DEFAULTS: KioskSettings = { welcomeFr: 'Touchez pour commander', welcomeEn: 'Touch to order', idleSeconds: 90, photoBaseUrl: null };
export interface KioskOrder { number: number; device: string; cloverOrderId: string; totalCents: number | null; estimateCents: number; ready: boolean; at: string }
export const ORDERS = 'kiosk_orders';
const settingsKey = (mid: string) => `m:${mid}:kiosk:settings`;
const MAX_ORDERS_PER_10_MIN = 20;

export async function getSettings(mid: string): Promise<KioskSettings> {
  return { ...DEFAULTS, ...((await getStore().getKv<Partial<KioskSettings>>(settingsKey(mid))) ?? {}) };
}

export async function saveSettings(mid: string, s: Partial<KioskSettings>, premium: boolean): Promise<{ ok: true; settings: KioskSettings } | { ok: false; error: string }> {
  const next = { ...(await getSettings(mid)), ...s };
  next.welcomeFr = String(next.welcomeFr ?? '').slice(0, 80) || DEFAULTS.welcomeFr;
  next.welcomeEn = String(next.welcomeEn ?? '').slice(0, 80) || DEFAULTS.welcomeEn;
  if (!Number.isInteger(next.idleSeconds) || next.idleSeconds < 20 || next.idleSeconds > 600) return { ok: false, error: 'Idle time: 20 to 600 seconds.' };
  if (next.photoBaseUrl) {
    if (!premium) return { ok: false, error: 'Large photos are part of the Premium plan.' };
    try { if (new URL(next.photoBaseUrl).protocol !== 'https:') return { ok: false, error: 'Photo address must be https.' }; } catch { return { ok: false, error: 'Photo address is not valid.' }; }
    next.photoBaseUrl = next.photoBaseUrl.replace(/\/+$/, '');
  } else next.photoBaseUrl = null;
  await getStore().setKv(settingsKey(mid), next);
  return { ok: true, settings: next };
}

/** What the kiosk screen needs: categories and items (price, options), photo addresses for Premium. */
export function kioskMenu(menu: Menu, photoBaseUrl: string | null) {
  return {
    categories: menu.categories.map((c) => ({ id: c.id, name: c.name, itemIds: c.itemIds.filter((id) => menu.items[id]?.available && menu.items[id]?.priceType !== 'VARIABLE') })).filter((c) => c.itemIds.length),
    items: Object.fromEntries(Object.values(menu.items).filter((i) => i.available && i.priceType !== 'VARIABLE').map((i) => [i.id, {
      id: i.id, name: i.name, priceCents: i.priceCents, taxPct: i.taxPct, photo: photoBaseUrl ? `${photoBaseUrl}/${i.id}.jpg` : null,
      groups: i.groups.map((g) => ({ id: g.id, name: g.name, min: g.min, max: g.max, modifiers: g.modifiers.filter((m) => m.available).map((m) => ({ id: m.id, name: m.name, priceCents: m.priceCents })) })),
    }])),
  };
}

async function nextNumber(mid: string): Promise<number> {
  const key = `m:${mid}:kiosk:counter:${localDate()}`;
  const n = ((await getStore().getKv<number>(key)) ?? 0) + 1;
  await getStore().setKv(key, n);
  return n;
}

async function rateLimited(mid: string, device: string): Promise<boolean> {
  const key = `m:${mid}:kiosk:rate:${device}:${Math.floor(Date.now() / 600_000)}`;
  const n = ((await getStore().getKv<number>(key)) ?? 0) + 1;
  await getStore().setKv(key, n);
  return n > MAX_ORDERS_PER_10_MIN;
}

export async function placeOrder(mid: string, deviceName: string, lines: CartLine[]): Promise<{ ok: true; order: KioskOrder } | { ok: false; error: string; status?: number }> {
  if (await rateLimited(mid, deviceName)) return { ok: false, error: 'Too many orders from this kiosk: wait a few minutes.', status: 429 };
  const m = await readMenu(mid);
  if (!m.ok) return { ok: false, error: m.error, status: 502 };
  const v = validateCart(m.menu, lines);
  if (!v.ok) return { ok: false, error: v.error, status: 422 };
  const number = await nextNumber(mid);
  const r = await createCloverOrder(mid, lines, { title: `Borne ${deviceName} · #${number}`, note: 'Payer au comptoir / Pay at counter — T4CTILE' });
  if (!r.ok) return { ok: false, error: r.error, status: 502 };
  await printOrder(mid, r.orderId).catch(() => false);
  const order: KioskOrder = { number, device: deviceName, cloverOrderId: r.orderId, totalCents: r.totalCents, estimateCents: v.subtotalCents + v.taxCents, ready: false, at: new Date().toISOString() };
  await getStore().put(ORDERS, `${mid}:${r.orderId}`, mid, order, order.at);
  return { ok: true, order };
}

/** Food Hub says the kitchen marked a Clover order ready: show its number on the waiting screen. */
export async function markReadyFromSuite(cloverOrderId: string | null | undefined, merchantId: string | null | undefined, status: string): Promise<boolean> {
  if (!cloverOrderId || !merchantId || !['ready', 'dispatched', 'completed'].includes(status)) return false;
  const d = await getStore().get<KioskOrder>(ORDERS, `${merchantId}:${cloverOrderId}`);
  if (!d || d.data.ready) return false;
  await getStore().put(ORDERS, d.id, d.merchantId, { ...d.data, ready: true }, d.at);
  return true;
}

export async function recentOrders(mid: string, minutes = 60 * 24): Promise<KioskOrder[]> {
  return (await getStore().list<KioskOrder>(ORDERS, { merchantId: mid, since: new Date(Date.now() - minutes * 60_000).toISOString(), limit: 500 })).map((d) => d.data);
}
