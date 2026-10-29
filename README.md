# T4CTILE by TAKATAK

**App ID Clover (production) :** `SFH7X57N3B5FJ`
**Développeur :** TAKATAK (compte développeur Clover 9KJ25ATT15TTW)
**État au portail :** brouillon (draft) — rien de soumis.
**Dépôt :** takatakca/T4CTILE

## Ce que fait l'app

Interface de commande tactile style grande chaîne + borne libre-service : menu en photos plein écran, gros boutons, branchée sur le vrai menu Clover, paiement sur l'appareil. Fusionne les packages « commande-tactile » et « borne-libre-service ». Jumeaux sandbox : Commande tactile 5YD2CHATX3Q18 · Borne libre-service 3EWA1H7WF0ZET.

## Paliers (doctrine de prix de Matt, 2026-10-28)

Chaque app a SES propres paliers. Base = le nécessaire essentiel · Premium = plus d'avantages · VIP = le full kit, tout ce que Clover offre pour la catégorie.

- **Base 50 $/mois** — parcours borne complet sur le Kiosk (plein écran, démarrage auto) ; menu lu en direct (taxes incluses) ; commande créée dans Clover et imprimée en cuisine ; paiement sur l'appareil associé ; bilingue FR/EN.
- **Premium 100 $/mois** — + photos grand format depuis notre CDN (clé par ID d'article) ; extras et upsells toujours visibles ; fidélité par téléphone à la borne (LOY4LTY) ; retour auto à l'accueil, écran d'attente promotionnel.
- **VIP 150 $/mois** — full kit : vente suggestive pilotée par M4RKETING ; paiement par carte-cadeau REW4RDS scannée ; accessibilité et thèmes par marque ; statistiques de parcours vers le dashboard TAKATAK ; mode tactile comptoir inclus.

Prix facturés via les plans d'abonnement du Clover App Market (à créer au portail — voir DEPLOY.md).

## Permissions Clover visées

Inventory R · Orders R/W · Merchant R · Employees R · Customers R/W

## Structure

- `docs/listing/` — fiche marketplace (description FR/EN) et textes légaux, depuis le package de soumission local (`~/workspace/clover-apps/`)
- `app/api/clover/` — points d'entrée webhook + OAuth (scaffold, même patron que Food Hub)
- `lib/clover/config.ts` — configuration par variables d'environnement (aucun secret dans le code)
- `config/app.config.json` — identité de l'app et paliers
- `DEPLOY.md` — ce qui reste à faire, étape par étape, pour la vague portail

## Le système unique TAKATAK

Cette application fait partie de la suite TAKATAK sur Clover : toutes les apps partagent le même dos d'événements (webhooks Clover), le même **client unique reconnu par son numéro de téléphone** (+ courriel), et les mêmes commandes et paiements Clover. Aucune app ne vit en silo : les données qu'elle produit alimentent les autres apps de la suite (voir « Clover API — Main Stuff — Robot Notepad », section 3, déposé au Drive Opérations et dans `~/workspace/clover-apps/`).


## État du code (2026-10-28)

Application Next.js 16 qui fonctionne (tests verts, build OK). Mise en ligne : `DEPLOY.md` § 5.

**Ce qui marche :**
- **Commun (kit Suite TAKATAK, identique dans les 9 apps)** : connexion Clover OAuth v2 (jetons scellés, rafraîchis
  seuls, supprimés à la désinstallation) · webhook Clover (vérification, X-Clover-Auth, chaque événement une fois) ·
  base PostgreSQL (ou mémoire en dev) · session marchand · paliers Base / Premium / VIP lus depuis la facturation
  Clover (`OWN_MERCHANTS` = VIP) · marchand `RNVTBYMCKXEJ1` en lecture seule · lien Suite TAKATAK avec Food Hub ·
  page d'accueil FR/EN, tableau de bord `/app`, pages légales `/legal/*`, `/api/health`, `/api/cron`, clés d'appareils.
- **Tableau de bord premium (2026-10-29, kit commun)** : menu latéral avec sous-menus (les écrans de cette app,
  Suite TAKATAK, Mon compte, Aide) · Mon compte → Profil, Forfait et facturation, Actions autorisées, Appareils,
  Paiements et dépôts, Sécurité et données (export JSON), Journal d'activité · rôle Clover de la personne (propriétaire,
  administrateur, gérant, employé) vérifié par le serveur pour chaque action sensible, et noté au journal · sélecteur
  des 9 apps de la suite (annuaire Food Hub) · version mobile. Comment tout s'emboîte : `docs/SUITE_KIT.md`.
- Borne web plein écran `/kiosk` (FR/EN, gros boutons, photos Premium, options avec min/max, panier, retour auto à l'accueil)
- Jumelage par clé de borne ; commande vérifiée contre le menu Clover → commande Clover « Borne <nom> · #<n> » + impression cuisine
- Limite 20 commandes / 10 min par borne ; numéros par jour ; écran « prête » alimenté par Food Hub

**Ce qui reste :**
- **Paiement sur l'appareil** (application Android Kiosk + Payments API) : la borne web fait « payer au comptoir ».
- Fidélité à la borne (LOY4LTY), carte-cadeau (REW4RDS), vente suggestive (M4RKETING) — API déjà prêtes dans ces apps.

**Développer :** `npm install` · `npm run dev` · `npm run typecheck` · `npm test` · `npm run build`. Règles pour
les agents : `AGENTS.md` ; journal : `WORKLOG.md`.
