import { tierAtLeast } from '@/lib/app';
import { cloverConfig } from '@/lib/clover/config';
import { listDeviceKeys } from '@/lib/core/devices';
import { money, pick } from '@/lib/core/i18n';
import type { PageCtx } from '@/lib/core/page';
import { getSettings, recentOrders, type KioskOrder } from '@/lib/domain/kiosk';
import { ApiForm } from './ApiForm';
import { DeviceKeys } from './DeviceKeys';
import { Icon } from './icons';
import { Badge, Card, Empty, Stat } from './ui';

// T4CTILE screens (lib/domain `sections`): overview, orders, paired kiosks, welcome screen.
export async function Panel({ ctx, section }: { ctx: PageCtx; section: string; query?: Record<string, string> }) {
  const { lang, merchantId } = ctx;
  const base = cloverConfig.appBaseUrl || '';
  switch (section) {
    case '': return <Overview ctx={ctx} />;
    case 'orders': return <OrdersCard lang={lang} orders={await recentOrders(merchantId!)} limit={200} />;
    case 'devices': return <DeviceKeys merchantId={merchantId!} lang={lang} kind="kiosk" title={pick(lang, 'Bornes jumelées', 'Paired kiosks')}
      hint={pick(lang, `Créez une clé, puis ouvrez sur la borne : ${base}/kiosk?key=<la clé>. La borne la garde ; retirez la clé pour la déjumeler.`, `Create a key, then open on the kiosk: ${base}/kiosk?key=<the key>. The kiosk keeps it; revoke the key to unpair it.`)} canManage={ctx.can('account.devices')} />;
    case 'screen': return <Screen ctx={ctx} />;
    default: return null;
  }
}

function OrdersCard({ lang, orders, limit, title }: { lang: 'fr' | 'en'; orders: KioskOrder[]; limit: number; title?: string }) {
  const time = (iso: string) => new Date(iso).toLocaleTimeString(lang === 'en' ? 'en-CA' : 'fr-CA', { hour: '2-digit', minute: '2-digit' });
  return (
    <Card title={title ?? pick(lang, 'Commandes des bornes (24 h)', 'Kiosk orders (24 h)')} icon="list" right={<Badge>{orders.length}</Badge>}>
      {orders.length === 0 ? <Empty icon="kiosk">{pick(lang, 'Aucune commande aux bornes depuis 24 heures.', 'No kiosk order in the last 24 hours.')}</Empty> : (
        <div className="table-wrap"><table><thead><tr><th>#</th><th>{pick(lang, 'Heure', 'Time')}</th><th>{pick(lang, 'Borne', 'Kiosk')}</th><th className="right">Total</th><th>{pick(lang, 'État', 'Status')}</th></tr></thead>
          <tbody>{orders.slice(0, limit).map((o) => <tr key={o.cloverOrderId}><td><strong>{o.number}</strong></td><td>{time(o.at)}</td><td>{o.device}</td><td className="right">{money(o.totalCents ?? o.estimateCents, lang)}</td>
            <td>{o.ready ? <Badge tone="ok">{pick(lang, 'Prête', 'Ready')}</Badge> : <Badge>{pick(lang, 'En préparation', 'Preparing')}</Badge>}</td></tr>)}</tbody></table></div>
      )}
    </Card>
  );
}

async function Overview({ ctx }: { ctx: PageCtx }) {
  const { lang, merchantId } = ctx;
  const [orders, kiosks, s] = await Promise.all([recentOrders(merchantId!), listDeviceKeys(merchantId!, 'kiosk'), getSettings(merchantId!)]);
  const total = orders.reduce((t, o) => t + (o.totalCents ?? o.estimateCents), 0);
  const steps: Array<[boolean, string, string, string]> = [
    [kiosks.length > 0, 'Jumeler une borne', 'Pair a kiosk', '/app/devices'],
    [s.welcomeFr !== 'Touchez pour commander' || s.welcomeEn !== 'Touch to order', 'Personnaliser l’accueil', 'Personalize the welcome', '/app/screen'],
    [!!s.photoBaseUrl, 'Ajouter les photos (Premium)', 'Add the photos (Premium)', '/app/screen'],
  ];
  return (
    <>
      <div className="grid">
        <Stat label={pick(lang, 'Commandes (24 h)', 'Orders (24 h)')} value={orders.length} note={money(total, lang)} />
        <Stat label={pick(lang, 'Panier moyen', 'Average order')} value={orders.length ? money(Math.round(total / orders.length), lang) : '—'} />
        <Stat label={pick(lang, 'Prêtes', 'Ready')} value={orders.filter((o) => o.ready).length} note={pick(lang, 'selon Food Hub', 'from Food Hub')} />
        <Stat label={pick(lang, 'Bornes jumelées', 'Paired kiosks')} value={kiosks.length} />
      </div>
      {steps.some(([done]) => !done) && (
        <Card title={pick(lang, 'Mise en route', 'Getting started')} icon="spark">
          <ul className="checks steps">{steps.map(([done, fr, en, href]) => <li key={fr} className={done ? 'is-done' : ''}><Icon name={done ? 'check' : 'chevron'} size={16} />{done ? pick(lang, fr, en) : <a href={href}>{pick(lang, fr, en)}</a>}</li>)}</ul>
        </Card>
      )}
      <OrdersCard lang={lang} orders={orders} limit={10} title={pick(lang, 'Dernières commandes', 'Latest orders')} />
    </>
  );
}

async function Screen({ ctx }: { ctx: PageCtx }) {
  const { lang, merchantId, tier } = ctx;
  const s = await getSettings(merchantId!);
  if (!ctx.can('kiosk.settings')) return <Card title={pick(lang, 'Écran', 'Screen')} icon="screen"><p className="muted">{pick(lang, 'Votre rôle ne permet pas de changer l’écran des bornes.', 'Your role cannot change the kiosk screen.')}</p></Card>;
  return (
    <Card title={pick(lang, 'Écran des bornes', 'Kiosk screen')} icon="screen" sub={pick(lang, 'S’applique à toutes les bornes à leur prochain retour à l’accueil.', 'Applies to every kiosk at its next return to the welcome screen.')}>
      <ApiForm action="/api/kiosk/settings" method="PUT" fields={[
        { name: 'welcomeFr', label: pick(lang, 'Accueil (français)', 'Welcome (French)'), defaultValue: s.welcomeFr },
        { name: 'welcomeEn', label: pick(lang, 'Accueil (anglais)', 'Welcome (English)'), defaultValue: s.welcomeEn },
        { name: 'idleSeconds', label: pick(lang, 'Retour à l’accueil après (s)', 'Back to welcome after (s)'), type: 'number', defaultValue: String(s.idleSeconds) },
        ...(tierAtLeast(tier, 'premium') ? [{ name: 'photoBaseUrl', label: pick(lang, 'Photos (adresse https, <ID article>.jpg)', 'Photos (https address, <item ID>.jpg)'), type: 'url' as const, defaultValue: s.photoBaseUrl ?? '' }] : []),
      ]} submit={pick(lang, 'Enregistrer', 'Save')} done={pick(lang, 'Enregistré.', 'Saved.')} />
      {!tierAtLeast(tier, 'premium') && <p className="muted small">{pick(lang, 'Photos grand format : forfait Premium.', 'Large photos: Premium plan.')}</p>}
    </Card>
  );
}
