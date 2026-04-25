import { useState } from "react";
import { SERVICES } from "./pageData";
import { useReveal } from "./pageHooks";
import { BtnO, BtnP } from "./pageUi";

export default function PageServices({ go }) {
  const [active, setActive] = useState("s1");
  useReveal();
  const svc = SERVICES.find((s) => s.id === active);

  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{ margin: "0 auto 16px" }}>
          Nos Services
        </div>
        <h1>
          Solutions <em>sur mesure</em>
          <br />
          pour votre entreprise
        </h1>
        <p>De l'archivage physique a la transformation digitale complete.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-stabs">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              className={`sa-stab ${active === s.id ? "on" : ""}`}
              onClick={() => setActive(s.id)}
            >
              <i className={`fas ${s.icon}`} style={{ marginRight: 7 }}></i>
              {s.label}
            </button>
          ))}
        </div>
        {svc && (
          <div className="sa-svc-panel on" key={active}>
            <div className="sa-svc-vis">
              <div className="sa-svc-big-icon" style={{ background: svc.iconCls, color: svc.iconCol }}>
                <i className={`fas ${svc.icon}`}></i>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "var(--t1)" }}>
                {svc.label}
              </h3>
              <div className="sa-svc-kpis">
                {svc.kpis.map((k, i) => (
                  <div className="sa-svc-kpi" key={i}>
                    <div className="n">{k.n}</div>
                    <div className="l">{k.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sa-svc-body">
              <div className="sa-tag" style={{ marginBottom: 18 }}>
                Service complet
              </div>
              <h2>
                <em>{svc.title}</em>
              </h2>
              <p>{svc.body}</p>
              <ul className="sa-feat-list">
                {svc.feats.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="sa-btn-row">
                <BtnP onClick={() => go("contact")}>
                  <i className="fas fa-paper-plane"></i>Demander un devis
                </BtnP>
                <BtnO>
                  <i className="fas fa-phone"></i>Nous appeler
                </BtnO>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
