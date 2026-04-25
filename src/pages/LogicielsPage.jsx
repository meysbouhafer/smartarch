import { LOGICIELS } from "./pageData";
import { useReveal } from "./pageHooks";
import { BtnP } from "./pageUi";

export default function PageLogiciels({ openDv }) {
  useReveal();

  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{ margin: "0 auto 16px" }}>
          Logiciels
        </div>
        <h1>
          Nos Solutions <em>Logicielles</em>
        </h1>
        <p>Logiciels metiers sur mesure pour les entreprises algeriennes exigeantes.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-grid g3">
          {LOGICIELS.map((l, i) => (
            <div className={`sa-lcard sa-r d${i % 5}`} key={i}>
              <div className="sa-lcard-head">
                <div className="sa-lcard-ico" style={{ background: l.grad }}>
                  <i className={`fas ${l.ico}`}></i>
                </div>
                <h3>{l.title}</h3>
                <p>{l.desc}</p>
              </div>
              <div className="sa-lcard-body">
                <ul className="sa-lfeats">
                  {l.feats.map((f, j) => (
                    <li key={j}>
                      <i className="fas fa-check-circle"></i>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="sa-lcard-foot">
                  <div>
                    <div className={`sa-lprice ${l.priceType}`}>
                      {l.price}
                      <small>{l.priceSub}</small>
                    </div>
                  </div>
                  <BtnP onClick={() => openDv(l.title)} style={{ height: 36, padding: "0 16px", fontSize: 13 }}>
                    <i className="fas fa-paper-plane"></i>Devis
                  </BtnP>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
