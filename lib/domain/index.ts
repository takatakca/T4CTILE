// T4CTILE's side of the shared shell: hooks, menu sections, authorized actions, device kinds, what each plan adds.
// Food Hub's "ready" for a kiosk order lights its number on the waiting screen.
import type { AppHooks } from '../hooks';
import type { AppAction, AppSection, DeviceKind, TierFeatures } from '../nav';
import { markReadyFromSuite } from './kiosk';

export const hooks: AppHooks = {
  async onSuiteEvent(e) {
    if (e.type !== 'order.status_changed') return;
    const o = e.data?.order ?? {};
    await markReadyFromSuite(o.cloverOrderId, o.cloverMerchantId, String(o.status ?? ''));
  },
};

export const sections: AppSection[] = [
  { slug: '', fr: 'Vue d’ensemble', en: 'Overview', icon: 'chart', hintFr: 'Commandes des bornes des dernières 24 heures et mise en route.', hintEn: 'Kiosk orders of the last 24 hours and setup.' },
  { slug: 'orders', fr: 'Commandes', en: 'Orders', icon: 'list', hintFr: 'Chaque commande passée à une borne, son numéro et son état.', hintEn: 'Every order placed at a kiosk, its number and status.' },
  { slug: 'kiosks', fr: 'Bornes', en: 'Kiosks', icon: 'kiosk', hub: true, hintFr: 'Jumeler les bornes et régler leur écran.', hintEn: 'Pair the kiosks and set up their screen.' },
  { slug: 'devices', parent: 'kiosks', fr: 'Bornes jumelées', en: 'Paired kiosks', icon: 'device', hintFr: 'Une clé par borne ; retirez-la pour déjumeler.', hintEn: 'One key per kiosk; revoke it to unpair.' },
  { slug: 'screen', parent: 'kiosks', fr: 'Écran d’accueil', en: 'Welcome screen', icon: 'screen', hintFr: 'Message d’accueil, retour automatique, photos.', hintEn: 'Welcome message, auto return, photos.' },
];

export const actions: AppAction[] = [
  { key: 'kiosk.settings', fr: 'Régler l’écran des bornes', en: 'Set up the kiosk screen', min: 'manager' },
];

export const deviceKinds: DeviceKind[] = [{ kind: 'kiosk', fr: 'Borne T4CTILE', en: 'T4CTILE kiosk' }];

export const tierFeatures: TierFeatures = {
  base: [
    ['Borne plein écran sur le vrai menu Clover, taxes incluses', 'Full-screen kiosk on the real Clover menu, taxes included'],
    ['Commande créée dans Clover et billet imprimé en cuisine', 'Order created in Clover and ticket printed in the kitchen'],
    ['Français et anglais, gros boutons, options avec minimum et maximum', 'French and English, big buttons, options with minimum and maximum'],
    ['Numéro « prête » allumé quand Food Hub le dit', '“Ready” number lit when Food Hub says so'],
  ],
  premium: [
    ['Photos grand format des articles', 'Large item photos'],
    ['Bientôt : fidélité par téléphone à la borne (LOY4LTY)', 'Coming: loyalty by phone at the kiosk (LOY4LTY)'],
  ],
  vip: [
    ['Bientôt : paiement par carte-cadeau REW4RDS, vente suggestive M4RKETING, thèmes par marque', 'Coming: REW4RDS gift-card payment, M4RKETING upsells, brand themes'],
  ],
};
