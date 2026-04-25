/**
 * ════════════════════════════════════════════════
 *  Smart Archives — Base de Connaissances RAG
 *  Chaque "chunk" = un extrait de document que
 *  le moteur de recherche sémantique peut retrouver.
 * ════════════════════════════════════════════════
 */

export const KNOWLEDGE_CHUNKS = [

  // ─────────────────────────────────────────
  //  ENTREPRISE — PRÉSENTATION
  // ─────────────────────────────────────────
  {
    id: "company-overview",
    category: "entreprise",
    title: "Présentation Smart Archives",
    content: `Smart Archives est une entreprise algérienne basée à Guelma, spécialisée dans la gestion documentaire professionnelle.
Elle accompagne les entreprises, administrations et institutions dans :
- L'archivage physique et numérique de leurs documents
- La numérisation (scan HD, OCR multilingue arabe/français/anglais)
- Le déploiement de logiciels métiers (SmartCourrier, SmartArchives, SmartBiblio, SmartGED, SmartLearn, SmartContracts)
- Les formations professionnelles certifiantes

Téléphone : 037 140 773 / 0672 040 820
Email : smartarchive.rg@gmail.com
Adresse : Guelma, Algérie
Réseaux : Facebook, WhatsApp disponibles`,
    tags: ["présentation", "contact", "entreprise", "guelma", "algérie"],
  },

  {
    id: "company-stats",
    category: "entreprise",
    title: "Chiffres clés Smart Archives",
    content: `Chiffres clés de Smart Archives :
- Plus de 500 clients satisfaits en Algérie
- Plus de 2 millions de documents archivés
- 15 ans d'expérience dans l'archivage documentaire
- Équipe de 30+ experts certifiés
- Présence dans 10+ wilayas algériennes
Partenaires : Sonatrach, Algérie Telecom, BNA, Sonelgaz, Air Algérie, CNEP-Banque, Ministère de l'Éducation, Université d'Alger, CNAS, Saidal`,
    tags: ["statistiques", "chiffres", "partenaires", "expérience"],
  },

  // ─────────────────────────────────────────
  //  SERVICES
  // ─────────────────────────────────────────
  {
    id: "service-archivage-physique",
    category: "services",
    title: "Service Archivage Physique",
    content: `Service d'Archivage Physique Professionnel :
Description : Prise en charge complète, transport, classement et conservation de vos documents d'entreprise.
Caractéristiques :
- Plus de 10 000 m² de stockage sécurisé
- Certification ISO
- Surveillance 24h/24 - 7j/7
Prestations incluses :
- Collecte et transport sécurisé de vos archives
- Tri, classement et inventaire complet
- Stockage en entrepôts climatisés et sécurisés
- Système de traçabilité et suivi en ligne
- Récupération rapide sur demande en 24h
- Destruction sécurisée certifiée
- Rapport d'inventaire mensuel détaillé`,
    tags: ["archivage", "physique", "stockage", "documents", "entrepôt", "classement"],
  },

  {
    id: "service-numerisation",
    category: "services",
    title: "Service Numérisation",
    content: `Service de Numérisation de Documents :
Description : Transformation des documents papier en actifs numériques exploitables.
Performances :
- Résolution jusqu'à 600 DPI
- OCR multilingue : Arabe, Français, Anglais
- Précision : 99.9%
Prestations incluses :
- Scan haute résolution jusqu'à 600 DPI
- OCR multilingue (Arabe, Français, Anglais)
- Indexation automatique et manuelle
- Export en PDF/A, TIFF, JPEG, Word
- Contrôle qualité image par image
- Métadonnées et classification automatique
- Livraison sur clé USB, disque dur ou cloud`,
    tags: ["numérisation", "scan", "ocr", "pdf", "digitalisation", "documents"],
  },

  {
    id: "service-archivage-numerique",
    category: "services",
    title: "Service Archivage Numérique Cloud",
    content: `Service d'Archivage Numérique Cloud :
Description : Solution cloud garantissant sécurité, pérennité et accessibilité des documents.
Garanties :
- Chiffrement AES-256 bit
- Disponibilité 99.9% (SLA garanti)
- Triple redondance des sauvegardes
Prestations incluses :
- Hébergement en Algérie sur serveurs certifiés
- Chiffrement AES-256 bit de toutes les données
- Sauvegardes automatiques triple redondance
- Accès web et application mobile
- Gestion des droits d'accès par utilisateur
- Historique des accès et audit trail
- SLA 99.9% de disponibilité garantie`,
    tags: ["cloud", "numérique", "sécurité", "chiffrement", "aes", "sauvegarde"],
  },

  {
    id: "service-ged",
    category: "services",
    title: "Service GED — Gestion Électronique de Documents",
    content: `Service GED (Gestion Électronique de Documents) :
Description : Dématérialisation, organisation et circulation intelligente des documents.
Points forts :
- 100% sans papier
- Intégrations via API
- Signature électronique certifiée
Prestations incluses :
- Workflows de validation configurables sans code
- Gestion des versions de documents
- Signatures électroniques certifiées
- Recherche full-text dans le contenu
- Intégration ERP via API REST
- Tableaux de bord et statistiques avancées
- Notifications et alertes automatiques`,
    tags: ["ged", "workflow", "signature électronique", "dématérialisation", "erp"],
  },

  {
    id: "service-confidentialite",
    category: "services",
    title: "Service Confidentialité et Sécurité",
    content: `Service Confidentialité et Protection des Données :
Description : Protocoles conformes aux réglementations algériennes et internationales.
Certifications :
- NDA systématique
- ISO 27001
- Conformité Loi algérienne 18-07
Mesures de sécurité :
- Accès biométrique aux locaux de stockage
- Vidéosurveillance 24h/24 - 7j/7
- Accord de confidentialité NDA systématique
- Personnel habilité et certifié
- Chiffrement bout-en-bout de toutes communications
- Destruction certifiée conforme RGPD / Loi 18-07
- Audit de sécurité annuel par tiers certifié`,
    tags: ["confidentialité", "sécurité", "nda", "iso 27001", "rgpd", "loi 18-07"],
  },

  // ─────────────────────────────────────────
  //  LOGICIELS — TARIFS
  // ─────────────────────────────────────────
  {
    id: "logiciel-smartcourrier",
    category: "logiciels",
    title: "SmartCourrier — Logiciel de gestion du courrier",
    content: `SmartCourrier — Logiciel de Gestion du Courrier :
Prix : 120 000 DA / an (licence annuelle)
Cible : Administrations et entreprises
Description : Gestion complète du courrier entrant, sortant et interne.
Fonctionnalités :
- Enregistrement et numérotation automatique du courrier
- Circuit de validation configurable
- Suivi et traçabilité complète
- Interface bilingue Arabe/Français
Pour demander un devis ou une démonstration, contacter Smart Archives.`,
    tags: ["smartcourrier", "courrier", "logiciel", "120000", "administration", "tracabilité"],
  },

  {
    id: "logiciel-smartarchives",
    category: "logiciels",
    title: "SmartArchives — Logiciel de gestion des archives",
    content: `SmartArchives — Logiciel de Gestion des Archives :
Prix : 180 000 DA / an (licence annuelle)
Description : Gestion des archives physiques et numériques avec recherche intelligente.
Fonctionnalités :
- Plan de classement personnalisable
- QR code et codes-barres intégrés
- Recherche full-text et métadonnées
- Module de numérisation intégré
C'est le logiciel le plus complet pour la gestion documentaire professionnelle.`,
    tags: ["smartarchives", "archives", "logiciel", "180000", "qr code", "classement"],
  },

  {
    id: "logiciel-smartbiblio",
    category: "logiciels",
    title: "SmartBiblio — Logiciel de gestion de bibliothèque",
    content: `SmartBiblio — Système de Gestion de Bibliothèque :
Prix : 90 000 DA / an (licence annuelle)
Cible : Établissements scolaires, universités, centres de documentation
Fonctionnalités :
- Catalogage MARC21 / Dublin Core
- Gestion des prêts et retours
- OPAC — Catalogue en ligne accessible au public
- Statistiques de fréquentation`,
    tags: ["smartbiblio", "bibliothèque", "opac", "90000", "marc21", "prêts"],
  },

  {
    id: "logiciel-smartged",
    category: "logiciels",
    title: "SmartGED — Plateforme GED collaborative",
    content: `SmartGED — Plateforme GED Collaborative :
Prix : Sur devis (selon volume et nombre d'utilisateurs)
Description : Solution GED avec workflows, signatures électroniques et gestion de versions.
Fonctionnalités :
- Workflows sans code configurables
- Signature électronique certifiée
- Collaboration en temps réel
- API REST pour intégrations ERP
Pour obtenir un devis personnalisé, contacter Smart Archives au 037 140 773 ou 0672 040 820.`,
    tags: ["smartged", "ged", "workflow", "signature", "api", "devis", "collaboration"],
  },

  {
    id: "logiciel-smartlearn",
    category: "logiciels",
    title: "SmartLearn — LMS de gestion des formations",
    content: `SmartLearn — LMS (Learning Management System) :
Prix : 15 000 DA / mois (SaaS, abonnement mensuel)
Description : LMS complet pour la gestion des formations en ligne et en présentiel.
Fonctionnalités :
- Catalogue de formations en ligne
- Suivi de progression des apprenants
- Certificats numériques automatiques
- Dashboard formateur avancé`,
    tags: ["smartlearn", "lms", "elearning", "formation", "15000", "saas", "certificats"],
  },

  {
    id: "logiciel-smartcontracts",
    category: "logiciels",
    title: "SmartContracts — Gestion du cycle de vie des contrats",
    content: `SmartContracts — Gestion du Cycle de Vie des Contrats :
Prix : Sur devis (selon besoins)
Description : Création, négociation, signature et suivi des contrats.
Fonctionnalités :
- Modèles de contrats personnalisables
- Alertes d'échéance automatiques
- Signature électronique avancée
- Archivage automatique des contrats
Pour un devis, contacter Smart Archives.`,
    tags: ["smartcontracts", "contrats", "signature", "devis", "archivage", "alertes"],
  },

  {
    id: "logiciels-comparaison-prix",
    category: "logiciels",
    title: "Comparaison des prix de tous les logiciels",
    content: `Récapitulatif des tarifs des logiciels Smart Archives :
| Logiciel        | Prix                    | Type          |
|-----------------|-------------------------|---------------|
| SmartCourrier   | 120 000 DA / an         | Licence       |
| SmartArchives   | 180 000 DA / an         | Licence       |
| SmartBiblio     | 90 000 DA / an          | Licence       |
| SmartGED        | Sur devis               | Sur mesure    |
| SmartLearn      | 15 000 DA / mois        | SaaS          |
| SmartContracts  | Sur devis               | Sur mesure    |
Pour tout devis ou démonstration : 037 140 773 / 0672 040 820`,
    tags: ["tarifs", "prix", "logiciels", "comparaison", "devis"],
  },

  // ─────────────────────────────────────────
  //  FORMATIONS — DÉTAIL
  // ─────────────────────────────────────────
  {
    id: "formation-office-expert",
    category: "formations",
    title: "Formation Microsoft Office Expert",
    content: `Formation Microsoft Office Expert :
Catégorie : Bureautique
Prix : 25 000 DA
Durée : 40 heures
Niveau : Tous niveaux
Mode : Présentiel / En ligne
Formateur : Dr. Haddad Nabil
Contenu : Word, Excel, PowerPoint et Outlook au niveau professionnel.
Certification Microsoft incluse à la fin de la formation.`,
    tags: ["office", "word", "excel", "powerpoint", "outlook", "microsoft", "bureautique", "25000"],
  },

  {
    id: "formation-excel-bi",
    category: "formations",
    title: "Formation Excel Avancé & Business Intelligence",
    content: `Formation Excel Avancé & Business Intelligence :
Catégorie : Bureautique
Prix : 30 000 DA
Durée : 30 heures
Niveau : Intermédiaire
Mode : Présentiel
Formateur : Mme Kaci Lynda
Contenu : Tableaux croisés dynamiques (TCD), Power Query, macros VBA et création de dashboards professionnels.`,
    tags: ["excel", "tcd", "power query", "vba", "dashboard", "business intelligence", "30000"],
  },

  {
    id: "formation-saisie-frappe",
    category: "formations",
    title: "Formation Saisie & Frappe Rapide",
    content: `Formation Saisie & Frappe Rapide :
Catégorie : Bureautique
Prix : 15 000 DA
Durée : 20 heures
Niveau : Débutant
Mode : Présentiel
Formateur : Mme Bouzid Fatima
Contenu : Vitesse de frappe, saisie de données et compétences secrétariat.`,
    tags: ["saisie", "frappe", "secrétariat", "débutant", "bureautique", "15000"],
  },

  {
    id: "formation-fullstack",
    category: "formations",
    title: "Formation Développement Web Full Stack",
    content: `Formation Développement Web Full Stack :
Catégorie : Développement
Prix : 65 000 DA
Durée : 120 heures
Niveau : Débutant
Mode : Présentiel / En ligne
Formateur : M. Benmoussa Yacine
Contenu : HTML, CSS, JavaScript, React.js et Node.js.
De zéro au développeur full stack complet.`,
    tags: ["développement web", "html", "css", "javascript", "react", "nodejs", "fullstack", "65000"],
  },

  {
    id: "formation-python-datascience",
    category: "formations",
    title: "Formation Python & Data Science",
    content: `Formation Python & Data Science :
Catégorie : Développement
Prix : 55 000 DA
Durée : 80 heures
Niveau : Débutant / Intermédiaire
Mode : En ligne
Formateur : Dr. Rais Sofiane
Contenu : Programmation Python, Pandas, visualisation de données et introduction au Machine Learning.`,
    tags: ["python", "data science", "pandas", "machine learning", "visualisation", "55000"],
  },

  {
    id: "formation-cybersecurite",
    category: "formations",
    title: "Formation Cybersécurité Fondamentaux",
    content: `Formation Cybersécurité Fondamentaux :
Catégorie : Cybersécurité
Prix : 70 000 DA
Durée : 60 heures
Niveau : Intermédiaire
Mode : Présentiel
Formateur : M. Meziane Adel
Contenu : Protection des systèmes, réseaux sécurisés, gestion des incidents et conformité réglementaire.`,
    tags: ["cybersécurité", "sécurité", "réseaux", "incidents", "70000"],
  },

  {
    id: "formation-ethical-hacking",
    category: "formations",
    title: "Formation Ethical Hacking & Pentest",
    content: `Formation Ethical Hacking & Tests d'Intrusion :
Catégorie : Cybersécurité
Prix : 90 000 DA
Durée : 80 heures
Niveau : Avancé
Mode : Présentiel
Formateur : M. Meziane Adel
Contenu : Tests d'intrusion (pentest), audit de sécurité et rédaction de rapports professionnels.`,
    tags: ["ethical hacking", "pentest", "intrusion", "audit", "sécurité", "avancé", "90000"],
  },

  {
    id: "formation-ged-archives",
    category: "formations",
    title: "Formation Gestion Documentaire & Archives",
    content: `Formation Gestion Documentaire & Archives :
Catégorie : Gestion
Prix : 35 000 DA
Durée : 35 heures
Niveau : Tous niveaux
Mode : Présentiel
Formateur : Mme Belhadj Samira
Contenu : Normes d'archivage, plan de classement, numérisation et GED.`,
    tags: ["gestion documentaire", "archives", "classement", "ged", "normes", "35000"],
  },

  {
    id: "formation-management-projet",
    category: "formations",
    title: "Formation Management de Projet",
    content: `Formation Management de Projet :
Catégorie : Gestion
Prix : 45 000 DA
Durée : 45 heures
Niveau : Intermédiaire
Mode : Présentiel / En ligne
Formateur : Dr. Ouali Mounir
Contenu : Méthodes agiles et traditionnelles, MS Project, planification et gestion d'équipe.`,
    tags: ["management", "projet", "agile", "ms project", "planification", "45000"],
  },

  {
    id: "formations-comparaison-prix",
    category: "formations",
    title: "Récapitulatif de toutes les formations et tarifs",
    content: `Récapitulatif des formations Smart Archives :
| Formation                          | Prix       | Durée | Niveau        |
|------------------------------------|------------|-------|---------------|
| Microsoft Office Expert            | 25 000 DA  | 40h   | Tous niveaux  |
| Excel Avancé & BI                  | 30 000 DA  | 30h   | Intermédiaire |
| Saisie & Frappe Rapide             | 15 000 DA  | 20h   | Débutant      |
| Développement Web Full Stack       | 65 000 DA  | 120h  | Débutant      |
| Python & Data Science              | 55 000 DA  | 80h   | Débutant/Int. |
| Cybersécurité Fondamentaux         | 70 000 DA  | 60h   | Intermédiaire |
| Ethical Hacking & Pentest          | 90 000 DA  | 80h   | Avancé        |
| Gestion Documentaire & Archives    | 35 000 DA  | 35h   | Tous niveaux  |
| Management de Projet               | 45 000 DA  | 45h   | Intermédiaire |

Les formations vont de 15 000 DA à 90 000 DA.
La formation la moins chère est "Saisie & Frappe Rapide" à 15 000 DA.
La plus chère est "Ethical Hacking & Pentest" à 90 000 DA.`,
    tags: ["tarifs", "formations", "prix", "liste", "comparaison", "durée"],
  },

  // ─────────────────────────────────────────
  //  FAQ
  // ─────────────────────────────────────────
  {
    id: "faq-devis",
    category: "faq",
    title: "Comment demander un devis ?",
    content: `Pour demander un devis Smart Archives :
1. Remplir le formulaire de contact sur la page "Contact" du site
2. Appeler directement : 037 140 773 ou 0672 040 820
3. Envoyer un email à : smartarchive.rg@gmail.com
4. Via WhatsApp : 0672 040 820
Le devis est gratuit et la réponse est garantie sous 24 heures ouvrables.`,
    tags: ["devis", "contact", "gratuit", "formulaire", "téléphone", "email"],
  },

  {
    id: "faq-inscription-formation",
    category: "faq",
    title: "Comment s'inscrire à une formation ?",
    content: `Pour s'inscrire à une formation Smart Archives :
1. Créer un compte sur le site (bouton "Connexion" > "Sign in")
2. Aller sur la page "Formations"
3. Cliquer sur "S'inscrire" sur la formation choisie
4. Remplir le dossier d'inscription (nom, prénom, téléphone, niveau, email, profession)
5. L'inscription sera validée par l'équipe pédagogique sous 24h ouvrables
6. Après validation et paiement, accès à "Mon Espace" étudiant avec les cours et certificats`,
    tags: ["inscription", "formation", "compte", "dossier", "validation", "paiement"],
  },

  {
    id: "faq-espace-etudiant",
    category: "faq",
    title: "Qu'est-ce que l'espace étudiant ?",
    content: `L'Espace Étudiant Smart Archives (accessible après inscription validée et paiement) :
Fonctionnalités :
- Voir toutes vos formations inscrites et leur statut
- Accéder au planning des sessions
- Télécharger vos certificats numériques (après validation de la formation)
- Contacter l'équipe support
Accès : Connexion > "Mon Espace" dans le menu de navigation.
Conditions : Inscription acceptée par l'admin ET paiement validé.`,
    tags: ["espace étudiant", "certificats", "planning", "connexion", "paiement"],
  },

  {
    id: "faq-differents-types-archivage",
    category: "faq",
    title: "Quelle différence entre archivage physique et numérique ?",
    content: `Différence entre archivage physique et archivage numérique :

Archivage Physique :
- Documents papier stockés dans des entrepôts sécurisés
- Idéal pour les originaux légaux et documents officiels
- Tri, classement, inventaire et destruction sécurisée
- Récupération physique sur demande en 24h

Archivage Numérique :
- Documents stockés sur serveurs cloud sécurisés en Algérie
- Accessible depuis n'importe quel appareil (web, mobile)
- Chiffrement AES-256 bit
- Idéal pour le quotidien et l'accès rapide

Smart Archives propose les deux services et peut combiner les deux (hybride).`,
    tags: ["archivage physique", "archivage numérique", "différence", "cloud", "papier"],
  },

  {
    id: "faq-securite-donnees",
    category: "faq",
    title: "Comment Smart Archives protège-t-elle les données ?",
    content: `Protection des données chez Smart Archives :
- Chiffrement AES-256 bit pour toutes les données numériques
- Accès biométrique aux locaux de stockage physique
- Vidéosurveillance 24h/24 - 7j/7
- NDA (Accord de Confidentialité) systématique signé avec chaque client
- Certification ISO 27001
- Conformité à la loi algérienne 18-07 sur la protection des données
- Conformité RGPD pour les données européennes
- Audit de sécurité annuel par un tiers certifié
- Sauvegardes triple redondance`,
    tags: ["sécurité", "données", "chiffrement", "iso", "rgpd", "confidentialité", "nda"],
  },
];

/**
 * Recherche simple par mots-clés (TF-IDF léger côté serveur)
 * Retourne les chunks les plus pertinents pour une requête donnée.
 *
 * @param {string} query - La question de l'utilisateur
 * @param {number} topK  - Nombre de résultats à retourner (défaut: 4)
 * @returns {Array}      - Les chunks triés par pertinence
 */
export function retrieveChunks(query, topK = 4) {
  if (!query || !query.trim()) return [];

  const normalise = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ");

  const queryWords = normalise(query).split(/\s+/).filter((w) => w.length > 2);

  if (!queryWords.length) return KNOWLEDGE_CHUNKS.slice(0, topK);

  const scored = KNOWLEDGE_CHUNKS.map((chunk) => {
    const haystack = normalise(
      `${chunk.title} ${chunk.content} ${(chunk.tags || []).join(" ")}`
    );

    let score = 0;

    for (const word of queryWords) {
      // Correspondance dans le titre → poids 3
      if (normalise(chunk.title).includes(word)) score += 3;

      // Correspondance dans les tags → poids 2
      if ((chunk.tags || []).some((t) => normalise(t).includes(word))) score += 2;

      // Correspondance dans le contenu → poids 1 par occurrence
      const matches = haystack.match(new RegExp(word, "g"));
      if (matches) score += matches.length;
    }

    // Bonus si la catégorie est mentionnée
    if (queryWords.some((w) => chunk.category.includes(w))) score += 2;

    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}

/**
 * Formate les chunks récupérés en contexte prêt pour le LLM.
 */
export function formatContext(chunks) {
  if (!chunks.length) return "";
  return chunks
    .map(
      (c, i) =>
        `--- Source ${i + 1}: ${c.title} (${c.category}) ---\n${c.content}`
    )
    .join("\n\n");
}
