// T4CTILE: kiosk order → checked → Clover order + kitchen print, numbers per day, rate limit, ready from Food Hub.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { kioskMenu, placeOrder, recentOrders, saveSettings } from '@/lib/domain/kiosk';
import { readMenu } from '@/lib/clover/menu';
import { hooks } from '@/lib/domain';
import { connect, fakeClover, MID } from './helpers';

let calls: ReturnType<typeof fakeClover>;
let n = 0;
beforeEach(async () => {
  n = 0;
  calls = fakeClover([(u) => u.pathname.endsWith('/items') ? { elements: [{ id: 'ITEMSODA0001', name: 'Soda', price: 250, priceType: 'FIXED', categories: { elements: [{ id: 'CATMAIN00001' }] }, taxRates: { elements: [{ rate: 500000 }, { rate: 997500 }] } }, { id: 'ITEMOFF00001', name: 'Off', price: 100, available: false, categories: { elements: [{ id: 'CATMAIN00001' }] } }] }
    : u.pathname.endsWith('/categories') ? { elements: [{ id: 'CATMAIN00001', name: 'Boissons' }] }
      : u.pathname.endsWith('/atomic_order/orders') ? { id: `ORDER000000${++n}`, total: 575 }
        : u.pathname.endsWith('/print_event') ? { id: 'PRINT' } : undefined]);
  await connect();
});
afterEach(() => vi.unstubAllGlobals());

describe('kiosk', () => {
  it('shows only orderable items; photos only with a photo address', async () => {
    const m = await readMenu(MID);
    if (!m.ok) throw new Error(m.error);
    const k = kioskMenu(m.menu, 'https://cdn.example.ca/p');
    expect(Object.keys(k.items)).toEqual(['ITEMSODA0001']);
    expect(k.items.ITEMSODA0001.photo).toBe('https://cdn.example.ca/p/ITEMSODA0001.jpg');
  });

  it('creates the Clover order, prints it, numbers it, and lights it when Food Hub says ready', async () => {
    const a = await placeOrder(MID, 'Entrée', [{ itemId: 'ITEMSODA0001', quantity: 2 }]);
    const b = await placeOrder(MID, 'Entrée', [{ itemId: 'ITEMSODA0001', quantity: 1 }]);
    expect(a).toMatchObject({ ok: true, order: { number: 1, cloverOrderId: 'ORDER0000001' } });
    expect(b).toMatchObject({ ok: true, order: { number: 2 } });
    const order = calls.find((c) => c.path.endsWith('/atomic_order/orders'))!.body;
    expect(order.orderCart.title).toBe('Borne Entrée · #1');
    expect(calls.filter((c) => c.path.endsWith('/print_event'))).toHaveLength(2);
    expect(await placeOrder(MID, 'Entrée', [{ itemId: 'ITEMOFF00001', quantity: 1 }])).toMatchObject({ ok: false, status: 422 });
    await hooks.onSuiteEvent!({ id: 'e', type: 'order.status_changed', createdAt: '', source: 'foodhub', data: { order: { cloverOrderId: 'ORDER0000001', cloverMerchantId: MID, status: 'ready' } } });
    const recent = await recentOrders(MID);
    expect(recent.find((o) => o.number === 1)?.ready).toBe(true);
    expect(recent.find((o) => o.number === 2)?.ready).toBe(false);
  });

  it('limits a kiosk to 20 orders per 10 minutes', async () => {
    for (let i = 0; i < 20; i++) expect((await placeOrder(MID, 'K', [{ itemId: 'ITEMSODA0001', quantity: 1 }])).ok).toBe(true);
    expect(await placeOrder(MID, 'K', [{ itemId: 'ITEMSODA0001', quantity: 1 }])).toMatchObject({ ok: false, status: 429 });
  });

  it('validates screen settings; photos are Premium', async () => {
    expect(await saveSettings(MID, { idleSeconds: 5 }, true)).toMatchObject({ ok: false });
    expect(await saveSettings(MID, { photoBaseUrl: 'https://cdn.example.ca/p/' }, false)).toMatchObject({ ok: false });
    expect(await saveSettings(MID, { photoBaseUrl: 'https://cdn.example.ca/p/' }, true)).toMatchObject({ ok: true, settings: { photoBaseUrl: 'https://cdn.example.ca/p' } });
  });
});
