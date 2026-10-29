import { tierAtLeast } from '@/lib/app';
import { readMenu } from '@/lib/clover/menu';
import { isCtx, requireMerchantOrDevice } from '@/lib/core/guard';
import { fail, ok } from '@/lib/core/http';
import { getSettings, kioskMenu } from '@/lib/domain/kiosk';

export const dynamic = 'force-dynamic';

// The kiosk's menu (live Clover menu, available items only) and its screen settings. Kiosk device key or merchant.
export async function GET(req: Request) {
  const c = await requireMerchantOrDevice(req, 'base');
  if (!isCtx(c)) return c;
  const [m, s] = await Promise.all([readMenu(c.merchantId), getSettings(c.merchantId)]);
  if (!m.ok) return fail(m.error, 502);
  return ok({ menu: kioskMenu(m.menu, tierAtLeast(c.tier, 'premium') ? s.photoBaseUrl : null), settings: { welcomeFr: s.welcomeFr, welcomeEn: s.welcomeEn, idleSeconds: s.idleSeconds }, merchant: c.merchant.name });
}
