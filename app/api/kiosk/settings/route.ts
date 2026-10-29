import { tierAtLeast } from '@/lib/app';
import { isCtx, requireMerchant } from '@/lib/core/guard';
import { fail, ok, readJson } from '@/lib/core/http';
import { saveSettings } from '@/lib/domain/kiosk';

export const dynamic = 'force-dynamic';

// { welcomeFr?, welcomeEn?, idleSeconds?, photoBaseUrl? (Premium) }
export async function PUT(req: Request) {
  const c = await requireMerchant(req);
  if (!isCtx(c)) return c;
  const b = await readJson(req);
  if (!b) return fail('JSON body required');
  const patch: Record<string, unknown> = {};
  for (const k of ['welcomeFr', 'welcomeEn', 'photoBaseUrl']) if (b[k] !== undefined) patch[k] = String(b[k]);
  if (b.idleSeconds !== undefined) patch.idleSeconds = Number(b.idleSeconds);
  const r = await saveSettings(c.merchantId, patch, tierAtLeast(c.tier, 'premium'));
  return r.ok ? ok({ settings: r.settings }) : fail(r.error);
}
