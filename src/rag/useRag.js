/**
 * ════════════════════════════════════════════════
 *  Smart Archives — Hook RAG Frontend
 *
 *  Avant chaque appel au LLM, ce hook :
 *  1. Envoie la question au serveur RAG (/api/rag/retrieve)
 *  2. Reçoit les chunks de la base de connaissances les plus pertinents
 *  3. Retourne un contexte formaté à injecter dans le system prompt
 *
 *  Si le serveur est indisponible → fallback sur la base locale intégrée.
 * ════════════════════════════════════════════════
 */

const RAG_API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/rag/retrieve`
  : "/api/rag/retrieve";

// ─────────────────────────────────────────────
//  BASE LOCALE FALLBACK (miroir allégé du serveur)
//  Utilisée si le serveur Express est arrêté.
// ─────────────────────────────────────────────
const LOCAL_KB = [
  {
    id: "company-overview",
    title: "Présentation Smart Archives",
    content: `Smart Archives — Guelma, Algérie. Tél : 037 140 773 / 0672 040 820. Email : smartarchive.rg@gmail.com.
Spécialisée en : archivage physique/numérique, numérisation (OCR AR/FR/EN), logiciels métiers, formations certifiantes.`,
    tags: ["présentation", "contact", "guelma"],
  },
  {
    id: "logiciels-prix",
    title: "Tarifs logiciels",
    content: `SmartCourrier : 120 000 DA/an | SmartArchives : 180 000 DA/an | SmartBiblio : 90 000 DA/an | SmartGED : Sur devis | SmartLearn : 15 000 DA/mois | SmartContracts : Sur devis`,
    tags: ["tarifs", "logiciels", "prix"],
  },
  {
    id: "formations-prix",
    title: "Tarifs formations",
    content: `Formations de 15 000 DA à 90 000 DA : Office Expert 25 000 DA, Excel BI 30 000 DA, Frappe 15 000 DA, Full Stack 65 000 DA, Python 55 000 DA, Cybersécurité 70 000 DA, Ethical Hacking 90 000 DA, Gestion Doc 35 000 DA, Management 45 000 DA`,
    tags: ["formations", "prix", "tarifs"],
  },
  {
    id: "services",
    title: "Services Smart Archives",
    content: `1. Archivage Physique (10 000 m², ISO, 24/7) 2. Numérisation (600 DPI, OCR multilingue) 3. Archivage Numérique Cloud (AES-256, 99.9% uptime) 4. GED (workflows, signature électronique) 5. Confidentialité (ISO 27001, Loi 18-07)`,
    tags: ["services", "archivage", "numérisation", "ged"],
  },
];

function normalise(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ");
}

function localRetrieve(query, topK = 3) {
  const words = normalise(query)
    .split(/\s+/)
    .filter((w) => w.length > 2);
  if (!words.length) return LOCAL_KB.slice(0, topK);

  const scored = LOCAL_KB.map((chunk) => {
    const hay = normalise(`${chunk.title} ${chunk.content} ${(chunk.tags || []).join(" ")}`);
    let score = 0;
    for (const w of words) {
      if (normalise(chunk.title).includes(w)) score += 3;
      if ((chunk.tags || []).some((t) => normalise(t).includes(w))) score += 2;
      const m = hay.match(new RegExp(w, "g"));
      if (m) score += m.length;
    }
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((s) => s.chunk);
}

function formatContext(chunks) {
  return chunks
    .map((c, i) => `--- Source ${i + 1}: ${c.title} ---\n${c.content}`)
    .join("\n\n");
}

// ─────────────────────────────────────────────
//  Fonction principale : récupérer le contexte RAG
// ─────────────────────────────────────────────

/**
 * @param {string} query - La question de l'utilisateur
 * @param {number} topK  - Nombre de chunks à récupérer (défaut: 4)
 * @returns {{ context: string, chunks: Array, source: 'server'|'local' }}
 */
export async function retrieveRagContext(query, topK = 4) {
  if (!query || !query.trim()) {
    return { context: "", chunks: [], source: "none" };
  }

  // 1. Essayer le serveur d'abord
  try {
    const res = await fetch(RAG_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query.trim(), topK }),
      signal: AbortSignal.timeout(3000), // timeout 3s
    });

    if (res.ok) {
      const data = await res.json();
      return {
        context: data.context || "",
        chunks: data.chunks || [],
        source: "server",
      };
    }
  } catch {
    // Serveur indisponible → on utilise le fallback local
  }

  // 2. Fallback local
  const chunks = localRetrieve(query, topK);
  return {
    context: formatContext(chunks),
    chunks,
    source: "local",
  };
}

/**
 * Construit le system prompt enrichi avec le contexte RAG.
 * À injecter dans chaque appel au LLM.
 *
 * @param {string} ragContext - Le contexte récupéré par retrieveRagContext()
 * @returns {string}
 */
export function buildRagSystemPrompt(ragContext) {
  const BASE_PROMPT = `Tu es l'assistant virtuel de Smart Archives, entreprise algérienne basée à Guelma.
Réponds toujours en français. Sois professionnel, concis et bienveillant.
Utilise UNIQUEMENT les informations fournies dans le contexte ci-dessous pour répondre.
Si tu ne trouves pas l'information dans le contexte, dis-le honnêtement et propose de contacter Smart Archives.
Encourage l'utilisateur à demander un devis gratuit ou à appeler le 0672 040 820 pour des besoins spécifiques.
Réponds de manière conversationnelle (2-4 phrases maximum sauf si une liste est plus claire).`;

  if (!ragContext || !ragContext.trim()) return BASE_PROMPT;

  return `${BASE_PROMPT}

════════════════════════════════════
CONTEXTE (base de connaissances Smart Archives) :
${ragContext}
════════════════════════════════════

Réponds uniquement en te basant sur ce contexte.`;
}
