# PACKAGE DE SOUMISSION — TAKATAK — Commande tactile

**Application :** TAKATAK — Commande tactile
**Développeur :** TAKATAK (TAKATAK Marketing, Montréal, Québec, Canada)
**Contact soutien :** takatak.ca@gmail.com · +1 450-999-4999
**État du package :** Brouillon local préparé le 2026-10-24 — rien n'est publié ni soumis.
**Documents liés :** `legal/politique-confidentialite.md`, `legal/privacy-policy.md`, `legal/conditions-utilisation.md`, `legal/terms.md`, `video-script.md`
**Base technique :** prototype `~/workspace/kiosque-tactile/` (parcours et écrans partagés avec la borne ; cette application-ci est l'interface de commande tactile autonome, distincte de l'interface publiée pour le kiosque du marchand)

---

## Nom de l'application (fiche marketplace)

**TAKATAK — Commande tactile**

## Accroche (tagline)

FR : « Le menu tactile style grande chaîne : photos plein écran, gros boutons, commande en moins d'une minute. »
EN : "The big-chain style touch menu: full-screen photos, big buttons, ordered in under a minute."

## Description complète

### FR

TAKATAK — Commande tactile est une application d'interface de commande pour écrans tactiles, dans l'esprit des bornes des grandes chaînes : le client voit le menu en photos plein écran, touche, choisit ses options et paie — sans file au comptoir.

**Une interface pensée pour le tactile, pas une caisse rapetissée**
- Catégories toujours visibles, grille d'items avec **photos en grand format** et prix nets.
- Gros boutons et zones tactiles généreuses, lisibles à bout de bras, utilisables par tous les clients, y compris sans expérience.
- Les options s'enchaînent dans l'ordre du service : groupes obligatoires d'abord (grandeur, cuisson, choix inclus), extras ensuite — comme le marchand les a définis dans son menu Clover.

**Branchée sur le vrai menu Clover**
- Items, prix, modificateurs et taxes lus en direct dans le compte Clover du marchand : aucun menu parallèle à entretenir.
- La commande est créée dans Clover et suit le même chemin que les commandes du comptoir (impression en cuisine incluse).
- Le paiement se fait sur le terminal Clover associé à l'écran ; l'application ne voit jamais les numéros de carte.

**Pour le marchand**
- Réduit la file au comptoir aux heures de pointe.
- Panier moyen bonifié par la présentation photo et les extras toujours visibles.
- Bilingue français / anglais, retour automatique à l'écran d'accueil après chaque commande.

### EN

TAKATAK — Commande tactile is a touchscreen ordering interface app in the spirit of the big chains' kiosks: the customer sees the menu in full-screen photos, taps, picks options and pays — no counter line.

**An interface designed for touch, not a shrunken register**
- Always-visible categories, an item grid with **large-format photos** and clear prices.
- Big buttons and generous touch targets, readable at arm's length, usable by every customer, experienced or not.
- Options flow in serving order: required groups first (size, cooking, included choices), extras after — exactly as the merchant defined them in its Clover menu.

**Plugged into the real Clover menu**
- Items, prices, modifiers and taxes read live from the merchant's Clover account: no parallel menu to maintain.
- The order is created in Clover and follows the same path as counter orders (kitchen printing included).
- Payment happens on the Clover terminal paired with the screen; the App never sees card numbers.

**For the merchant**
- Shortens the counter line at peak hours.
- Higher average ticket thanks to photo presentation and always-visible extras.
- Bilingual French / English, automatic return to the home screen after each order.

## Catégorie suggérée

**Ordering / Menu display (Commande / Affichage de menu), avec mention « tactile »** — catégorie exacte à confirmer dans la liste du portail (voir « À CONFIRMER AU PORTAIL »).

## Fonctionnalités

- Interface tactile plein écran façon grande chaîne : photos grand format, catégories illustrées
- Gros boutons et cibles tactiles accessibles, contraste élevé
- Parcours d'options ordonné : groupes obligatoires en premier, extras ensuite
- Lecture en direct du menu Clover du marchand (items, prix, modificateurs, taxes)
- Création de la commande dans Clover, impression en cuisine comme au comptoir
- Taxes calculées selon les taux Clover de chaque item (TPS/TVQ au Québec)
- Paiement sur le terminal Clover associé (tapotement, puce, NIP)
- Confirmation avec numéro de commande et retour automatique à l'accueil (minuterie)
- Interface bilingue français / anglais
- Mode invité : aucun compte client requis pour commander

## Permissions Clover demandées

| Permission | Justification |
|---|---|
| Inventaire (Inventory) — lecture | Afficher le menu du marchand en plein écran : items, photos, prix, catégories, modificateurs. |
| Commandes (Orders) — lecture + écriture | Créer la commande tactile et ses lignes, puis confirmer sa réception par le marchand. |
| Paiements (Payments) — écriture | Déclencher le paiement sur le terminal associé et le rattacher à la commande tactile. |
| Marchand (Merchant) — lecture | Lire les informations du marchand et les taux de taxe pour l'affichage et le calcul des totaux. |
| Clients (Customers) — lecture | Uniquement pour rattacher la commande quand un client s'identifie volontairement à l'écran (ex. fidélité) ; la commande invitée n'exige aucun accès client. |

L'application ne demande **pas** l'accès aux numéros de carte : le paiement est traité par le terminal/passerelle Clover.

## Tarification

> **PROPOSITION — prix à approuver par Matt. Aucun prix n'est final tant qu'il n'a pas été approuvé.**

- **Lancement : gratuit** — pilotes et marchands TAKATAK, sans frais d'application au départ.
- Évolution possible (à décider par Matt) : frais mensuel par écran tactile si l'application est offerte à des marchands externes.

Aucun plan tarifaire séparé n'est proposé pour cette application pour le moment (le plan payant séparé demandé par Matt concerne TAKATAK Fidélité).

## Soutien

- Courriel : takatak.ca@gmail.com
- Téléphone : +1 450-999-4999
- URL de soutien (placeholder, hébergement à confirmer) : https://takatak.ca/apps/commande-tactile/soutien
- URL politique de confidentialité (placeholder) : https://takatak.ca/apps/commande-tactile/confidentialite
- URL conditions d'utilisation (placeholder) : https://takatak.ca/apps/commande-tactile/conditions

## Instructions de test pour l'équipe de révision Clover

1. Installer l'application sur le marchand sandbox fourni et l'ouvrir sur l'écran tactile (ou l'appareil/émulateur associé).
2. L'écran d'accueil « Touchez pour commander » s'affiche en plein écran. Toucher : les catégories et les items affichés correspondent au menu du marchand sandbox (vérifier un item et son prix contre le tableau de bord).
3. Sélectionner un item avec options : les groupes obligatoires sont présentés en premier ; compléter les choix requis, ajouter un extra payant, valider la quantité.
4. Ouvrir le panier : vérifier sous-total, TPS et TVQ selon les taux du marchand, total.
5. Payer avec une carte de test Clover sur le terminal associé.
6. L'écran de confirmation affiche le numéro de commande ; la commande est visible dans la section Commandes du marchand Clover et s'imprime comme une commande de comptoir.
7. Après le délai affiché, l'application revient à l'accueil avec un panier vide.

## Liste de contrôle de soumission

| Élément | État |
|---|---|
| Nom + accroche + description FR/EN | ✅ Prêt (ce document) |
| Liste des permissions + justifications | ✅ Prêt (ce document) |
| Politique de confidentialité FR + EN | ✅ Brouillon prêt (`legal/`) — à approuver par Matt |
| Conditions d'utilisation FR + EN | ✅ Brouillon prêt (`legal/`) — à approuver par Matt |
| Script de vidéo de démonstration | ✅ Prêt (`video-script.md`) |
| Prototype fonctionnel de l'interface | ✅ Fait (v0, `~/workspace/kiosque-tactile/`) — écrans d'options/modificateurs à compléter en v1 |
| Vidéo de démonstration (fichier) | ⏳ À tourner depuis le prototype, puis valider format/durée au portail |
| Icône de l'application | ⏳ À produire — dimensions et format à confirmer au portail |
| Captures d'écran marketplace | ⏳ À capturer du prototype (accueil, menu photos, options, panier, confirmation) — nombre/format à confirmer au portail |
| URL publique de la politique de confidentialité | ⏳ Brouillon prêt, hébergement à mettre en ligne |
| URL publique des conditions | ⏳ Brouillon prêt, hébergement à mettre en ligne |
| Plan tarifaire | ⏳ PROPOSITION (gratuit au lancement) — en attente d'approbation de Matt |
| Marchand sandbox + accès réviseur | ⏳ En attente du compte développeur (voir ci-dessous) |
| Application créée dans le Developer Dashboard | ⏳ En attente de l'accès au portail développeur |
| Branchement API réel (menu/commandes/paiement) | ⏳ Étape de développement après la création de l'application au portail |

## À CONFIRMER AU PORTAIL

- Comment Clover distingue une « application d'interface tactile » d'une application de borne : type d'application, exigences d'appareil ou de semi-intégration (terminal associé) applicables
- Liste exacte des catégories disponibles pour une application de commande tactile
- Dimensions, format et poids exigés pour l'icône et les captures d'écran
- Exigences de la vidéo de démonstration (obligatoire ou non, format, durée maximale, hébergement)
- Structure exacte des plans tarifaires acceptés et part de revenus éventuelle de Clover/Fiserv
- Exigences de l'équipe de révision : marchand sandbox dédié, terminal de test ou émulateur accepté, délais de revue
- Champs obligatoires exacts de la fiche (courriel de soutien, URL de soutien, pays desservis)

## Points qui relèvent de Matt uniquement

- Approuver le modèle tarifaire (gratuit au lancement ou frais par écran)
- Approuver les textes légaux avant publication (idéalement avec un avis juridique)
- Choisir l'hébergement des pages publiques (politique, conditions, soutien)
- Fournir l'accès au compte développeur Clover pour créer l'application et le marchand sandbox
- Confirmer le matériel cible du pilote (écran tactile + terminal Clover associé) et l'emplacement
