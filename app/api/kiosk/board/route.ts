import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { ok } from '@/lib/core/http';
import { recentOrders } from '@/lib/domain/kiosk';

export const dynamic = 'force-dynamic';

// Waiting screen: numbers in preparation and ready (last 90 minutes).
export async function GET(req: Request) {
  const c = await requireMerchantOrDevice(req);
  if (!isCtx(c)) return c;
  const orders = await recentOrders(c.merchantId, 90);
  return ok({ preparing: orders.filter((o) => !o.ready).map((o) => o.number), ready: orders.filter((o) => o.ready).map((o) => o.number) });
}
