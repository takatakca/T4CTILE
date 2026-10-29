import { tierAtLeast } from '@/lib/app';
import { cloverConfig } from '@/lib/clover/config';
import { money, pick } from '@/lib/core/i18n';
import type { PageCtx } from '@/lib/core/page';
import { getSettings, recentOrders } from '@/lib/domain/kiosk';
import { ApiForm } from './ApiForm';
import { DeviceKeys } from './DeviceKeys';
import { Card, Stat } from './ui';

// T4CTILE dashboard: kiosks (pairing keys), today's kiosk orders, screen settings.
export async function Panel({ ctx }: { ctx: PageCtx }) {
  const { lang, merchantId, tier } = ctx;
  if (!merchantId) return null;
  const [s, orders] = await Promise.all([getSettings(merchantId), recentOrders(merchantId)]);
  const total = orders.reduce((t, o) => t + (o.totalCents ?? o.estimateCents), 0);
  const base = cloverConfig.appBaseUrl || '';
  return (
    <>
      <div className="grid">
        <Stat label={pick(lang, 'Commandes borne (24 h)', 'Kiosk orders (24 h)')} value={orders.length} note={money(total, lang)} />
        <Stat label={pick(lang, 'Prêtes', 'Ready')} value={orders.filter((o) => o.ready).length} note={pick(lang, 'via Food Hub', 'via Food Hub')} />
      </div>
      <DeviceKeys merchantId={merchantId} lang={lang} kind="kiosk" title={pick(lang, 'Bornes', 'Kiosks')}
        hint={pick(lang, `Créez une clé, puis ouvrez sur la borne : ${base}/kiosk?key=<la clé>. La borne la garde ; retirez la clé pour la déjumeler.`, `Create a key, then open on the kiosk: ${base}/kiosk?key=<the key>. The kiosk keeps it; revoke the key to unpair it.`)} />
      <Card title={pick(lang, 'Écran', 'Screen')}>
        <ApiForm action="/api/kiosk/settings" method="PUT" fields={[
          { name: 'welcomeFr', label: pick(lang, 'Accueil (français)', 'Welcome (French)'), defaultValue: s.welcomeFr },
          { name: 'welcomeEn', label: pick(lang, 'Accueil (anglais)', 'Welcome (English)'), defaultValue: s.welcomeEn },
          { name: 'idleSeconds', label: pick(lang, 'Retour à l’accueil après (s)', 'Back to welcome after (s)'), type: 'number', defaultValue: String(s.idleSeconds) },
          ...(tierAtLeast(tier, 'premium') ? [{ name: 'photoBaseUrl', label: pick(lang, 'Photos (adresse https, <ID article>.jpg)', 'Photos (https address, <item ID>.jpg)'), type: 'url' as const, defaultValue: s.photoBaseUrl ?? '' }] : []),
        ]} submit={pick(lang, 'Enregistrer', 'Save')} />
      </Card>
      <Card title={pick(lang, 'Dernières commandes', 'Latest orders')}>
        {orders.length === 0 ? <p className="muted">—</p> : (
          <table><thead><tr><th>#</th><th>{pick(lang, 'Borne', 'Kiosk')}</th><th>Total</th><th>{pick(lang, 'Statut', 'Status')}</th></tr></thead>
            <tbody>{orders.slice(0, 30).map((o) => <tr key={o.cloverOrderId}><td>{o.number}</td><td>{o.device}</td><td>{money(o.totalCents ?? o.estimateCents, lang)}</td><td>{o.ready ? pick(lang, 'Prête', 'Ready') : pick(lang, 'En préparation', 'Preparing')}</td></tr>)}</tbody></table>
        )}
      </Card>
    </>
  );
}
