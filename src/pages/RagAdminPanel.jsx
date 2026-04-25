/**
 * RagAdminPanel v2 — CRUD complet, persiste dans knowledgeBase.js
 */
import { useState, useEffect, useCallback } from "react";

const RAG_BASE = (import.meta.env.VITE_API_BASE_URL || "/api") + "/rag";

const CAT_COLORS = {
  entreprise: { bg:"rgba(37,99,235,.12)",  col:"#2563EB", label:"Entreprise", icon:"🏢" },
  services:   { bg:"rgba(16,185,129,.12)", col:"#10B981", label:"Services",   icon:"📦" },
  logiciels:  { bg:"rgba(245,158,11,.12)", col:"#F59E0B", label:"Logiciels",  icon:"💻" },
  formations: { bg:"rgba(139,92,246,.12)", col:"#8B5CF6", label:"Formations", icon:"🎓" },
  faq:        { bg:"rgba(14,165,233,.12)", col:"#0EA5E9", label:"FAQ",        icon:"❓" },
};
const EMPTY_FORM = { id:"", category:"faq", title:"", content:"", tags:"" };

function Badge({ cat }) {
  const c = CAT_COLORS[cat] || { bg:"rgba(100,100,100,.1)", col:"#888", label:cat };
  return <span style={{ padding:"2px 9px", borderRadius:99, fontSize:11, fontWeight:700,
    background:c.bg, color:c.col, textTransform:"uppercase", letterSpacing:".4px" }}>{c.label||cat}</span>;
}

function Card({ children, style }) {
  return <div style={{ border:"1.5px solid var(--border)", borderRadius:16, 
    background:"linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%)",
    backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
    padding:20, boxShadow:"0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 1px rgba(255, 255, 255, 0.1)",
    transition:"all 0.3s ease", ...style, 
    _hover: { borderColor:"rgba(99, 102, 241, 0.6)", boxShadow:"0 20px 60px rgba(59, 130, 246, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.15)" }
  }}>{children}</div>;
}

function Btn({ children, onClick, variant="primary", disabled, small, style }) {
  const base = { height:small?30:40, padding:small?"0 11px":"0 18px", borderRadius:small?8:10,
    border:"none", cursor:disabled?"not-allowed":"pointer", fontSize:small?11.5:13.5, fontWeight:700,
    display:"inline-flex", alignItems:"center", gap:6, opacity:disabled?.5:1,
    transition:"all .2s", fontFamily:"'Inter',sans-serif", whiteSpace:"nowrap", ...style };
  const V = {
    primary: { background:"linear-gradient(135deg,#2563EB,#4F46E5)", color:"#fff", boxShadow:"0 4px 14px rgba(37,99,235,.28)" },
    ghost:   { background:"var(--bg3)", color:"var(--t1)", border:"1px solid var(--border)" },
    danger:  { background:"rgba(239,68,68,.1)", color:"#EF4444", border:"1px solid rgba(239,68,68,.25)" },
    amber:   { background:"rgba(245,158,11,.1)", color:"#F59E0B", border:"1px solid rgba(245,158,11,.25)" },
  };
  return <button style={{ ...base, ...V[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Field({ label, value, onChange, placeholder, multiline, rows=4, readOnly }) {
  const s = { width:"100%", border:"1px solid var(--border)", borderRadius:10, background:"var(--bg3)",
    color:readOnly?"var(--t3)":"var(--t1)", padding:"10px 13px", fontSize:14, outline:"none",
    fontFamily:"'Inter',sans-serif", boxSizing:"border-box", opacity:readOnly?.7:1 };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:12 }}>
      {label && <label style={{ fontSize:12, fontWeight:600, color:"var(--t2)" }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={onChange} placeholder={placeholder}
            rows={rows} readOnly={readOnly} style={{ ...s, resize:"vertical", minHeight:80 }} />
        : <input value={value} onChange={onChange} placeholder={placeholder}
            readOnly={readOnly} style={s} />}
    </div>
  );
}

function Alert({ type, text }) {
  const S = { ok:{ bg:"rgba(16,185,129,.1)", b:"rgba(16,185,129,.25)", c:"#10B981" },
              err:{ bg:"rgba(239,68,68,.1)",  b:"rgba(239,68,68,.25)",  c:"#EF4444" },
              warn:{ bg:"rgba(245,158,11,.1)", b:"rgba(245,158,11,.25)", c:"#F59E0B" } };
  const s = S[type]||S.warn;
  return <div style={{ padding:"10px 14px", borderRadius:10, fontSize:13, marginBottom:12,
    background:s.bg, border:`1px solid ${s.b}`, color:s.c }}>{text}</div>;
}

/* ── Formulaire Ajouter / Modifier ── */
function ChunkForm({ initial, onSave, onCancel, loading }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(
    initial ? { ...initial, tags:(initial.tags||[]).join(", ") } : EMPTY_FORM
  );
  const set = k => e => setForm(f=>({ ...f, [k]:e.target.value }));

  const handleSave = () => {
    const payload = { ...form,
      id: form.id.trim().toLowerCase().replace(/\s+/g,"-"),
      tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) };
    onSave(payload);
  };

  return (
    <div style={{ border:"1px solid var(--blue)", borderRadius:14, padding:20,
      background:"rgba(37,99,235,.04)", marginBottom:20 }}>
      <h4 style={{ fontSize:15, color:"var(--t1)", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}>
        {isEdit ? "✏️ Modifier le chunk" : "➕ Nouveau chunk"}
        {isEdit && <span style={{ fontSize:12, color:"var(--t3)", fontWeight:400 }}>— ID : {initial.id}</span>}
      </h4>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <Field label="ID unique *" value={form.id} onChange={set("id")}
          placeholder="ex: faq-horaires" readOnly={isEdit} />
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"var(--t2)", display:"block", marginBottom:5 }}>Catégorie *</label>
          <select value={form.category} onChange={set("category")} style={{
            width:"100%", height:40, padding:"0 12px", borderRadius:10,
            border:"1px solid var(--border)", background:"var(--bg3)", color:"var(--t1)", fontSize:14 }}>
            {Object.entries(CAT_COLORS).map(([k,v])=>(
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Field label="Titre *" value={form.title} onChange={set("title")} placeholder="Ex: Horaires d'ouverture" />
      <Field label="Contenu *" value={form.content} onChange={set("content")}
        placeholder="Information complète que le chatbot doit connaître..." multiline rows={6} />
      <Field label="Tags (séparés par virgule)" value={form.tags} onChange={set("tags")}
        placeholder="horaires, ouverture, contact" />
      <div style={{ display:"flex", gap:10, marginTop:4 }}>
        <Btn onClick={handleSave} disabled={loading || !form.id.trim() || !form.title.trim() || !form.content.trim()}>
          {loading ? "⌛ Sauvegarde..." : isEdit ? "💾 Enregistrer" : "➕ Ajouter"}
        </Btn>
        <Btn variant="ghost" onClick={onCancel} disabled={loading}>Annuler</Btn>
      </div>
    </div>
  );
}

/* ── Testeur ── */
function RagTester({ serverOk }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topK, setTopK] = useState(4);
  const QUICK = ["tarifs logiciels","formation cybersécurité","archivage physique","comment s'inscrire","sécurité données"];

  const test = async () => {
    if (!query.trim() || !serverOk) return;
    setLoading(true); setResults(null);
    try {
      const res = await fetch(`${RAG_BASE}/retrieve`, { method:"POST",
        headers:{"Content-Type":"application/json"}, body:JSON.stringify({ query:query.trim(), topK }) });
      setResults(await res.json());
    } catch { setResults({ error:"Serveur indisponible." }); }
    finally { setLoading(false); }
  };

  return (
    <Card style={{ marginBottom:20 }}>
      <h3 style={{ fontSize:16, color:"var(--t1)", marginBottom:4 }}>🔍 Tester la recherche RAG</h3>
      <p style={{ fontSize:13, color:"var(--t3)", marginBottom:14 }}>Simulez une question et vérifiez quels chunks sont injectés dans le LLM.</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
        {QUICK.map(q=><button key={q} onClick={()=>setQuery(q)} style={{ padding:"4px 11px", borderRadius:99,
          fontSize:12, fontWeight:600, border:"1px solid var(--border)", background:"var(--bg3)",
          color:"var(--t2)", cursor:"pointer", fontFamily:"'Inter',sans-serif" }}>{q}</button>)}
      </div>
      <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
        <div style={{ flex:1 }}>
          <Field label="Question de test" value={query} onChange={e=>setQuery(e.target.value)}
            placeholder="Ex: Quel est le prix de SmartArchives ?" />
        </div>
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:12, fontWeight:600, color:"var(--t2)", display:"block", marginBottom:5 }}>Top K</label>
          <select value={topK} onChange={e=>setTopK(+e.target.value)} style={{
            height:40, padding:"0 10px", borderRadius:10, border:"1px solid var(--border)",
            background:"var(--bg3)", color:"var(--t1)", fontSize:14 }}>
            {[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div style={{ marginBottom:12 }}><Btn onClick={test} disabled={loading||!query.trim()||!serverOk}>{loading?"⌛":"🔍"} Tester</Btn></div>
      </div>
      {!serverOk && <Alert type="warn" text="⚠️ Serveur hors ligne — lancez npm run dev:full" />}
      {results?.error && <Alert type="err" text={`❌ ${results.error}`} />}
      {results && !results.error && (
        <div style={{ marginTop:14 }}>
          <div style={{ fontSize:13, color:"var(--t2)", marginBottom:10 }}>
            ✅ <strong>{results.total}</strong> chunk(s) pour <em>"{results.query}"</em>
          </div>
          {results.chunks.map((chunk,i)=>(
            <div key={chunk.id} style={{ border:"1px solid var(--border)", borderRadius:12, marginBottom:10, overflow:"hidden" }}>
              <div style={{ padding:"10px 14px", background:"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ width:22, height:22, borderRadius:"50%", background:"var(--grad)", color:"#fff",
                    fontSize:11, fontWeight:800, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>{i+1}</span>
                  <strong style={{ fontSize:13.5, color:"var(--t1)" }}>{chunk.title}</strong>
                </div>
                <Badge cat={chunk.category} />
              </div>
              <pre style={{ padding:"12px 14px", fontSize:12, color:"var(--t2)", lineHeight:1.6,
                whiteSpace:"pre-wrap", margin:0, fontFamily:"'Inter',sans-serif" }}>
                {(chunk.content||"").slice(0,300)}{(chunk.content||"").length>300?"…":""}
              </pre>
            </div>
          ))}
          <details>
            <summary style={{ fontSize:12, color:"var(--blue)", cursor:"pointer", fontWeight:600 }}>Voir le contexte injecté dans le LLM →</summary>
            <pre style={{ marginTop:10, padding:14, borderRadius:10, fontSize:11.5, background:"var(--bg3)",
              border:"1px solid var(--border)", color:"var(--t2)", whiteSpace:"pre-wrap", lineHeight:1.6, overflow:"auto" }}>
              {results.context}
            </pre>
          </details>
        </div>
      )}
    </Card>
  );
}

/* ── Liste CRUD ── */
function ChunkList({ chunks, onRefresh, serverOk }) {
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [editChunk, setEditChunk] = useState(null);
  const [showAdd, setShowAdd]     = useState(false);
  const [deleteId, setDeleteId]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [msg, setMsg]             = useState(null);

  const cats = ["all",...new Set(chunks.map(c=>c.category))];
  const filtered = chunks.filter(c=>{
    const ok = catFilter==="all" || c.category===catFilter;
    const q = search.toLowerCase();
    return ok && (!q || c.title.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
      || (c.tags||[]).some(t=>t.toLowerCase().includes(q)));
  });

  const flash = (type,text) => { setMsg({type,text}); setTimeout(()=>setMsg(null),5000); };

  const handleAdd = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch(`${RAG_BASE}/knowledge`,{ method:"POST",
        headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("ok",`✅ Chunk "${payload.title}" ajouté et sauvegardé dans knowledgeBase.js (${data.total} chunks).`);
      setShowAdd(false); onRefresh();
    } catch(e){ flash("err",`❌ ${e.message}`); } finally { setLoading(false); }
  };

  const handleEdit = async (payload) => {
    setLoading(true);
    try {
      const res = await fetch(`${RAG_BASE}/knowledge/${encodeURIComponent(payload.id)}`,{ method:"PUT",
        headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("ok",`✅ "${payload.title}" modifié et sauvegardé dans knowledgeBase.js.`);
      setEditChunk(null); onRefresh();
    } catch(e){ flash("err",`❌ ${e.message}`); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${RAG_BASE}/knowledge/${encodeURIComponent(id)}`,{ method:"DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      flash("ok",`🗑️ Chunk "${id}" supprimé de knowledgeBase.js (${data.total} restants).`);
      setDeleteId(null); onRefresh();
    } catch(e){ flash("err",`❌ ${e.message}`); } finally { setLoading(false); }
  };

  return (
    <Card>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, flexWrap:"wrap", gap:10 }}>
        <div>
          <h3 style={{ fontSize:16, color:"var(--t1)", marginBottom:2 }}>📚 Base — {chunks.length} chunks</h3>
          <p style={{ fontSize:12, color:"var(--t3)", margin:0 }}>
            Modifications sauvegardées dans <code style={{ background:"var(--bg3)", padding:"1px 5px", borderRadius:4 }}>server/rag/knowledgeBase.js</code>
          </p>
        </div>
        <Btn onClick={()=>{ setShowAdd(true); setEditChunk(null); }} disabled={!serverOk||showAdd}>➕ Nouveau chunk</Btn>
      </div>

      {msg && <Alert type={msg.type} text={msg.text} />}
      {showAdd && !editChunk && <ChunkForm initial={null} onSave={handleAdd} onCancel={()=>setShowAdd(false)} loading={loading} />}

      {/* Filtres */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..."
          style={{ flex:1, minWidth:180, height:36, padding:"0 12px", borderRadius:10,
            border:"1px solid var(--border)", background:"var(--bg3)", color:"var(--t1)", fontSize:13, outline:"none" }} />
        {cats.map(cat=>(
          <button key={cat} onClick={()=>setCatFilter(cat)} style={{
            height:36, padding:"0 12px", borderRadius:10, fontSize:12, fontWeight:700,
            cursor:"pointer", border:"1px solid var(--border)", fontFamily:"'Inter',sans-serif",
            background: catFilter===cat ? (CAT_COLORS[cat]?.bg||"var(--blue-bg)") : "var(--bg3)",
            color: catFilter===cat ? (CAT_COLORS[cat]?.col||"var(--blue)") : "var(--t2)" }}>
            {cat==="all" ? "Tous" : (CAT_COLORS[cat]?.icon+" "+CAT_COLORS[cat]?.label||cat)}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div style={{ display:"flex", flexDirection:"column", gap:8, maxHeight:560, overflowY:"auto" }}>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:28, color:"var(--t3)", fontSize:13 }}>Aucun chunk.</div>}
        {filtered.map(chunk=>(
          <div key={chunk.id}>
            {editChunk?.id===chunk.id ? (
              <ChunkForm initial={editChunk} onSave={handleEdit} onCancel={()=>setEditChunk(null)} loading={loading} />
            ) : (
              <div style={{ border:`1px solid ${deleteId===chunk.id?"rgba(239,68,68,.4)":"var(--border)"}`, borderRadius:12, overflow:"hidden", transition:"border-color .2s" }}>
                {/* header */}
                <div style={{ padding:"10px 14px", background:"var(--bg3)", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                    <Badge cat={chunk.category} />
                    <span style={{ fontSize:13.5, fontWeight:600, color:"var(--t1)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{chunk.title}</span>
                    <span style={{ fontSize:10, color:"var(--t3)", fontFamily:"monospace", flexShrink:0 }}>#{chunk.id}</span>
                  </div>
                  {deleteId===chunk.id ? (
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:12, color:"#EF4444", fontWeight:600 }}>Confirmer ?</span>
                      <Btn small variant="danger" onClick={()=>handleDelete(chunk.id)} disabled={loading}>🗑️ Oui</Btn>
                      <Btn small variant="ghost" onClick={()=>setDeleteId(null)}>Non</Btn>
                    </div>
                  ) : (
                    <div style={{ display:"flex", gap:6 }}>
                      <Btn small variant="amber" onClick={()=>{ setEditChunk(chunk); setShowAdd(false); }} disabled={!serverOk||loading}>✏️ Modifier</Btn>
                      <Btn small variant="danger" onClick={()=>setDeleteId(chunk.id)} disabled={!serverOk||loading}>🗑️</Btn>
                    </div>
                  )}
                </div>
                {/* body */}
                <div style={{ padding:"10px 14px" }}>
                  <p style={{ fontSize:12.5, color:"var(--t2)", lineHeight:1.6, margin:"0 0 8px" }}>
                    {(chunk.content||"").slice(0,180)}{(chunk.content||"").length>180?"…":""}
                  </p>
                  {chunk.tags?.length>0 && (
                    <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                      {chunk.tags.map(t=><span key={t} style={{ padding:"2px 7px", borderRadius:99, fontSize:10,
                        fontWeight:600, background:"var(--bg3)", color:"var(--t3)", border:"1px solid var(--border)" }}>#{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ── Stats bar ── */
function StatsBar({ chunks, serverOk }) {
  const by = Object.keys(CAT_COLORS).reduce((a,cat)=>({ ...a, [cat]:chunks.filter(c=>c.category===cat).length }),{});
  return (
    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:10, marginBottom:20 }}>
      <Card style={{ display:"flex", alignItems:"center", gap:10, padding:14 }}>
        <div style={{ width:34, height:34, borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
          background:serverOk?"rgba(16,185,129,.12)":"rgba(239,68,68,.12)" }}>{serverOk?"🟢":"🔴"}</div>
        <div>
          <div style={{ fontSize:11, color:"var(--t3)" }}>Serveur RAG</div>
          <div style={{ fontSize:13, fontWeight:700, color:serverOk?"#10B981":"#EF4444" }}>{serverOk?"En ligne":"Hors ligne"}</div>
        </div>
      </Card>
      <Card style={{ display:"flex", alignItems:"center", gap:10, padding:14 }}>
        <div style={{ width:34, height:34, borderRadius:9, background:"rgba(37,99,235,.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🧠</div>
        <div>
          <div style={{ fontSize:11, color:"var(--t3)" }}>Total</div>
          <div style={{ fontSize:22, fontWeight:800, color:"var(--t1)" }}>{chunks.length}</div>
        </div>
      </Card>
      {Object.entries(CAT_COLORS).map(([cat,c])=>(
        <Card key={cat} style={{ display:"flex", alignItems:"center", gap:8, padding:14 }}>
          <div style={{ width:34, height:34, borderRadius:9, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{c.icon}</div>
          <div>
            <div style={{ fontSize:11, color:"var(--t3)" }}>{c.label}</div>
            <div style={{ fontSize:20, fontWeight:800, color:"var(--t1)" }}>{by[cat]||0}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── COMPOSANT PRINCIPAL ── */
export default function RagAdminPanel() {
  const [chunks, setChunks]     = useState([]);
  const [serverOk, setServerOk] = useState(false);
  const [tab, setTab]           = useState("base");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`${RAG_BASE}/knowledge`);
      if (res.ok) { const d = await res.json(); setChunks(d.chunks||[]); setServerOk(true); }
      else setServerOk(false);
    } catch { setServerOk(false); }
  }, []);

  useEffect(()=>{ load(); }, [load]);

  return (
    <div style={{ padding:"24px 0", maxWidth:940, margin:"0 auto" }}>
      <div style={{ border:"1px solid rgba(37,99,235,.28)", background:"linear-gradient(120deg,rgba(37,99,235,.08),rgba(79,70,229,.06))",
        borderRadius:16, padding:"18px 22px", marginBottom:20 }}>
        <h2 style={{ fontSize:20, color:"var(--t1)", marginBottom:6, fontFamily:"'Bricolage Grotesque',sans-serif" }}>
          🧠 Administration RAG — Base de Connaissances Chatbot
        </h2>
        <p style={{ fontSize:13.5, color:"var(--t2)", margin:0, lineHeight:1.6 }}>
          Toute modification est <strong>écrite directement</strong> dans{" "}
          <code style={{ background:"var(--bg3)", padding:"2px 6px", borderRadius:4 }}>server/rag/knowledgeBase.js</code>{" "}
          et persiste après redémarrage.
        </p>
      </div>

      <StatsBar chunks={chunks} serverOk={serverOk} />

      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
        {[{ id:"base", label:"📚 Base de connaissances" },{ id:"tester", label:"🔍 Tester le RAG" }].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{
            padding:"9px 18px", borderRadius:10, fontSize:13.5, fontWeight:600, cursor:"pointer",
            border:"1px solid var(--border)", fontFamily:"'Inter',sans-serif", transition:"all .2s",
            background: tab===t.id ? "linear-gradient(135deg,#2563EB,#4F46E5)" : "var(--bg2)",
            color: tab===t.id ? "#fff" : "var(--t2)",
            boxShadow: tab===t.id ? "0 4px 14px rgba(37,99,235,.28)" : "var(--s1)" }}>{t.label}</button>
        ))}
        <button onClick={load} style={{ marginLeft:"auto", padding:"9px 14px", borderRadius:10, fontSize:13, fontWeight:600,
          cursor:"pointer", border:"1px solid var(--border)", background:"var(--bg2)", color:"var(--t2)", fontFamily:"'Inter',sans-serif" }}>
          🔄 Actualiser
        </button>
      </div>

      {tab==="base"   && <ChunkList chunks={chunks} onRefresh={load} serverOk={serverOk} />}
      {tab==="tester" && <RagTester serverOk={serverOk} />}
    </div>
  );
}
