import { deviceFromKey } from '@/lib/core/devices';
import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import type { CartLine } from '@/lib/clover/menu';
import { placeOrder } from '@/lib/domain/kiosk';

export const dynamic = 'force-dynamic';

// { lines: [{ itemId, quantity, modifierIds? }] } → Clover order + kitchen ticket; answers the order number.
export async function POST(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b || !Array.isArray(b.lines)) return fail('{ lines: [...] } required');
  const device = await deviceFromKey(req.headers.get('authorization'));
  const r = await placeOrder(c.merchantId, device?.name ?? 'Test', b.lines as CartLine[]);
  return r.ok ? ok({ number: r.order.number, totalCents: r.order.totalCents ?? r.order.estimateCents }) : fail(r.error, r.status ?? 400);
}
