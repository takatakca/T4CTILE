# PACKAGE DE SOUMISSION — TAKATAK — Borne libre-service

**Application :** TAKATAK — Borne libre-service
**Développeur :** TAKATAK (TAKATAK Marketing, Montréal, Québec, Canada)
**Contact soutien :** takatak.ca@gmail.com · +1 450-999-4999
**État du package :** Brouillon local préparé le 2026-10-24 — rien n'est publié ni soumis.
**Documents liés :** `legal/politique-confidentialite.md`, `legal/privacy-policy.md`, `legal/conditions-utilisation.md`, `legal/terms.md`, `video-script.md`
**Base technique :** prototype `~/workspace/kiosque-tactile/` (voir son README et son ARCHITECTURE)

---

## Nom de l'application (fiche marketplace)

**TAKATAK — Borne libre-service**

## Accroche (tagline)

FR : « Votre propre interface de borne libre-service, branchée sur le menu Clover que vous avez déjà. »
EN : "Your own self-service kiosk interface, plugged into the Clover menu you already have."

## Description complète

### FR

TAKATAK — Borne libre-service donne au marchand sa **propre interface de borne**, publiée par TAKATAK, qui se branche directement sur le compte Clover qu'il utilise déjà.

**Aucun deuxième menu à maintenir**
- L'application lit **le menu existant du marchand dans Clover** : items, prix, catégories, modificateurs et taxes. Un prix changé au comptoir est changé à la borne — il n'y a aucune copie du menu à synchroniser à la main.
- Les commandes passées à la borne entrent dans Clover exactement comme celles du comptoir et s'impriment en cuisine selon la configuration du marchand.

**Pensée pour le kiosque Clover du marchand**
- L'interface est conçue pour l'écran tactile du kiosque libre-service Clover que le marchand possède déjà : gros boutons, photos des items, parcours rapide de la commande au paiement.
- Le paiement se fait sur l'appareil Clover, comme au comptoir — l'application ne manipule jamais les numéros de carte.

**Parcours client**
1. « Touchez pour commander » — accueil plein écran.
2. Menu par catégories, photos et prix en temps réel depuis Clover.
3. Options et modificateurs tels que définis dans le menu du marchand (les groupes obligatoires en premier).
4. Panier avec taxes calculées selon les taux Clover de chaque item.
5. Paiement sur l'appareil, confirmation avec numéro de commande.

**Bilingue** français / anglais, interface adaptée aux restaurants à service rapide.

### EN

TAKATAK — Borne libre-service gives the merchant **its own kiosk interface**, published by TAKATAK, plugged directly into the Clover account it already uses.

**No second menu to maintain**
- The App reads **the merchant's existing Clover menu**: items, prices, categories, modifiers and taxes. Change a price at the counter and it changes at the kiosk — there is no menu copy to sync by hand.
- Kiosk orders enter Clover exactly like counter orders and print in the kitchen according to the merchant's setup.

**Built for the merchant's Clover kiosk**
- The interface is designed for the touchscreen of the Clover self-service kiosk the merchant already owns: big buttons, item photos, a fast path from order to payment.
- Payment happens on the Clover device, just like at the counter — the App never handles card numbers.

**Customer flow**
1. "Touch to order" — full-screen home.
2. Menu by category, with photos and live prices from Clover.
3. Options and modifiers exactly as defined in the merchant's menu (required groups first).
4. Cart with taxes computed from each item's Clover tax rates.
5. Payment on the device, confirmation with an order number.

**Bilingual** French / English interface, designed for quick-service restaurants.

## Catégorie suggérée

**Self-service / Kiosk ordering (Borne libre-service / Commande)** — catégorie exacte à confirmer dans la liste du portail (voir « À CONFIRMER AU PORTAIL »).

## Fonctionnalités

- Lecture en direct du menu Clover du marchand (items, prix, catégories, modificateurs, taxes) — aucun menu dupliqué
- Interface tactile plein écran adaptée au kiosque Clover : gros cibles tactiles, photos d'items
- Création des commandes dans Clover avec impression en cuisine comme au comptoir
- Calcul des taxes selon les taux Clover de chaque item (TPS/TVQ au Québec)
- Paiement délégué à l'appareil Clover (tapotement, puce, NIP)
- Confirmation à l'écran avec numéro de commande
- Écran d'attente « Touchez pour commander » avec retour automatique à l'accueil
- Interface bilingue français / anglais
- Arrimage optionnel avec TAKATAK Fidélité (identification par téléphone) — application distincte

## Permissions Clover demandées

| Permission | Justification |
|---|---|
| Inventaire (Inventory) — lecture | Afficher le menu existant du marchand : items, prix, catégories, modificateurs. |
| Commandes (Orders) — lecture + écriture | Créer la commande de la borne et ses lignes, puis la suivre jusqu'à la confirmation. |
| Paiements (Payments) — écriture | Déclencher le paiement sur l'appareil et le rattacher à la commande de la borne. |
| Marchand (Merchant) — lecture | Lire les informations du marchand et les taux de taxe pour l'affichage et le calcul des totaux. |
| Clients (Customers) — lecture + écriture | Attacher le client à la commande quand il s'identifie à la borne (ex. fidélité par téléphone), et seulement dans ce cas. |

L'application ne demande **pas** l'accès aux numéros de carte : le paiement est traité par l'appareil/passerelle Clover.

## Tarification

> **PROPOSITION — prix à approuver par Matt. Aucun prix n'est final tant qu'il n'a pas été approuvé.**

- **Lancement : gratuit** — utilisation par les marchands TAKATAK et pilotes, sans frais d'application au départ.
- Évolution possible (à décider par Matt) : frais mensuel par borne si l'application est offerte à des marchands externes.

Contrairement à TAKATAK Fidélité (qui a son propre plan payant), aucun plan tarifaire séparé n'est proposé pour cette application pour le moment.

## Soutien

- Courriel : takatak.ca@gmail.com
- Téléphone : +1 450-999-4999
- URL de soutien (placeholder, hébergement à confirmer) : https://takatak.ca/apps/borne-libre-service/soutien
- URL politique de confidentialité (placeholder) : https://takatak.ca/apps/borne-libre-service/confidentialite
- URL conditions d'utilisation (placeholder) : https://takatak.ca/apps/borne-libre-service/conditions

## Instructions de test pour l'équipe de révision Clover

1. Installer l'application sur le marchand sandbox fourni et l'ouvrir sur l'appareil kiosque (ou l'émulateur d'appareil) associé.
2. L'écran d'accueil « Touchez pour commander » s'affiche. Toucher l'écran : le menu affiché doit être celui du marchand sandbox (vérifier un item et son prix contre le tableau de bord du marchand).
3. Choisir une catégorie, ajouter un item avec une option obligatoire, puis un deuxième item au panier.
4. Vérifier le panier : sous-total, TPS et TVQ selon les taux du marchand, total.
5. Confirmer et payer avec une carte de test Clover sur l'appareil.
6. L'écran de confirmation affiche le numéro de commande ; la commande apparaît dans Clover (section Commandes du marchand) et s'imprime comme une commande de comptoir.
7. Attendre sur l'écran de confirmation : retour automatique à l'accueil, panier vidé.

## Liste de contrôle de soumission

| Élément | État |
|---|---|
| Nom + accroche + description FR/EN | ✅ Prêt (ce document) |
| Liste des permissions + justifications | ✅ Prêt (ce document) |
| Politique de confidentialité FR + EN | ✅ Brouillon prêt (`legal/`) — à approuver par Matt |
| Conditions d'utilisation FR + EN | ✅ Brouillon prêt (`legal/`) — à approuver par Matt |
| Script de vidéo de démonstration | ✅ Prêt (`video-script.md`) |
| Prototype fonctionnel de l'interface | ✅ Fait (v0, `~/workspace/kiosque-tactile/`) — reste à brancher sur l'API |
| Vidéo de démonstration (fichier) | ⏳ À tourner depuis le prototype, puis valider format/durée au portail |
| Icône de l'application | ⏳ À produire — dimensions et format à confirmer au portail |
| Captures d'écran marketplace | ⏳ À capturer du prototype (accueil, menu, panier, confirmation) — nombre/format à confirmer au portail |
| URL publique de la politique de confidentialité | ⏳ Brouillon prêt, hébergement à mettre en ligne |
| URL publique des conditions | ⏳ Brouillon prêt, hébergement à mettre en ligne |
| Plan tarifaire | ⏳ PROPOSITION (gratuit au lancement) — en attente d'approbation de Matt |
| Marchand sandbox + accès réviseur | ⏳ En attente du compte développeur (voir ci-dessous) |
| Application créée dans le Developer Dashboard | ⏳ En attente de l'accès au portail développeur |
| Branchement API réel (menu/commandes/paiement) | ⏳ Étape de développement après la création de l'application au portail |

## À CONFIRMER AU PORTAIL

- Si une application qui roule sur l'appareil kiosque Clover exige une certification d'appareil ou un type d'application particulier (app « device » vs semi-intégration)
- Liste exacte des catégories disponibles pour une application de borne libre-service
- Dimensions, format et poids exigés pour l'icône et les captures d'écran
- Exigences de la vidéo de démonstration (obligatoire ou non, format, durée maximale, hébergement)
- Structure exacte des plans tarifaires acceptés et part de revenus éventuelle de Clover/Fiserv
- Exigences de l'équipe de révision : marchand sandbox dédié, appareil de test ou émulateur accepté, délais de revue
- Champs obligatoires exacts de la fiche (courriel de soutien, URL de soutien, pays desservis)

## Points qui relèvent de Matt uniquement

- Approuver le modèle tarifaire (gratuit au lancement ou frais par borne)
- Approuver les textes légaux avant publication (idéalement avec un avis juridique)
- Choisir l'hébergement des pages publiques (politique, conditions, soutien)
- Fournir l'accès au compte développeur Clover pour créer l'application et le marchand sandbox
- Confirmer l'appareil cible du pilote (kiosque Clover existant) et l'emplacement du pilote
