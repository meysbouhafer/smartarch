import { useState } from "react";
import { CAT_CLS, CAT_LBL, FORMATIONS } from "./pageData";
import { useReveal } from "./pageHooks";
import { BtnP } from "./pageUi";

export default function PageFormations({ openIns, formations = FORMATIONS }) {
  const [flt, setFlt] = useState("all");
  const [srch, setSrch] = useState("");
  useReveal();

  const list = formations.filter(
    (f) =>
      (flt === "all" || f.cat === flt) &&
      (f.title.toLowerCase().includes(srch) || f.desc.toLowerCase().includes(srch))
  );

  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{ margin: "0 auto 16px" }}>
          Formations
        </div>
        <h1>
          Formations <em>Certifiantes</em>
          <br />
          & Professionnelles
        </h1>
        <p>Developpez vos competences avec nos experts certifies.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-filt-row">
          {[
            ["all", "Toutes"],
            ["bur", "Bureautique"],
            ["dev", "Developpement"],
            ["cyb", "Cybersecurite"],
            ["ges", "Gestion"],
          ].map(([k, l]) => (
            <button key={k} className={`sa-filt ${flt === k ? "on" : ""}`} onClick={() => setFlt(k)}>
              {l}
            </button>
          ))}
        </div>
        <div className="sa-sbar">
          <i className="fas fa-search"></i>
          <input
            placeholder="Rechercher une formation..."
            value={srch}
            onChange={(e) => setSrch(e.target.value.toLowerCase())}
          />
        </div>
        <div className="sa-grid">
          {list.length ? (
            list.map((f, i) => (
              <div className={`sa-fcard sa-r d${i % 5}`} key={i}>
                <div className="sa-fcard-top" style={{ background: f.top }}></div>
                <div className="sa-fcard-body">
                  <span className="sa-fcat" style={{ background: CAT_CLS[f.cat].bg, color: CAT_CLS[f.cat].col }}>
                    {CAT_LBL[f.cat]}
                  </span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="sa-fmeta">
                    <span className="sa-fm">
                      <i className="fas fa-clock"></i>
                      {f.dur}
                    </span>
                    <span className="sa-fm">
                      <i className="fas fa-signal"></i>
                      {f.lvl}
                    </span>
                    <span className="sa-fm">
                      <i className="fas fa-user-tie"></i>
                      {f.fmt}
                    </span>
                    <span className="sa-fm">
                      <i className={`fas fa-${f.mode.includes("ligne") ? "wifi" : "building"}`}></i>
                      {f.mode}
                    </span>
                  </div>
                  <div className="sa-fcard-foot">
                    <div className="sa-fprice">
                      {f.prix} DA<small>/pers.</small>
                    </div>
                    <BtnP
                      onClick={() => openIns(f.title + " - " + f.prix + " DA")}
                      style={{ height: 36, padding: "0 16px", fontSize: 13 }}
                    >
                      <i className="fas fa-graduation-cap"></i>S'inscrire
                    </BtnP>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 64, color: "var(--t3)" }}>
              <i className="fas fa-search" style={{ fontSize: 36, display: "block", marginBottom: 14, opacity: 0.4 }}></i>
              Aucune formation trouvee.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
