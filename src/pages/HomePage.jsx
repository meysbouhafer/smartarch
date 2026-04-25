import { useReveal } from "./pageHooks";
import { PARTNERS } from "./pageData";

export default function PageHome({ go }) {
  useReveal();

  return (
    <>
      {/* HERO */}
      <section className="sa-hero sa-hero-neo">
        <div className="sa-hero-mesh"></div>
        <div className="sa-hero-dots"></div>
        <div className="sa-hero-line"></div>

        <div className="sa-neo-topnav sa-r">
          <button className="sa-neo-navitem on">Fonctionnalites</button>
          <button className="sa-neo-navitem">Integrations</button>
          <button className="sa-neo-navitem">Tarifs</button>
          <button className="sa-neo-navitem">Changelog</button>
          <button className="sa-neo-navcta" onClick={() => go("contact")}>
            Demander un devis
          </button>
        </div>

        <div className="sa-hero-inner">
          <div className="sa-hero-pill">
            <div className="sa-pill-dot">
              <i className="fas fa-star" style={{ fontSize: 9 }}></i>
            </div>
            <span>Dernieres integrations d archivage en ligne</span>
          </div>
          <h1>
            Elevez vos performances<br />
            d <em>archivage</em>.
          </h1>
          <p>
            Debloquez le plein potentiel de votre gestion documentaire avec une
            plateforme unifiee: classement, OCR, recherche instantanee et suivi
            intelligent.
          </p>
          <div className="sa-hero-leadform">
            <input type="email" placeholder="Votre email professionnel" />
            <button onClick={() => go("contact")}>Rejoindre la liste</button>
          </div>
        </div>

        <div className="sa-hero-visual">
          <div className="sa-neo-visual-badge">
            <i className="fas fa-wave-square"></i>
            Analyse temps reel
          </div>
          <div className="sa-cube-cloud">
            <div className="sa-neo-beam b1"></div>
            <div className="sa-neo-beam b2"></div>
            <div className="sa-neo-beam b3"></div>
            <span className="sa-neo-particle p1"></span>
            <span className="sa-neo-particle p2"></span>
            <span className="sa-neo-particle p3"></span>
            <span className="sa-neo-particle p4"></span>
            <span className="sa-neo-particle p5"></span>
            <span className="sa-neo-particle p6"></span>
            <div className="sa-cube-shadow-floor"></div>
            <div className="sa-neo-cube c1"></div>
            <div className="sa-neo-cube c2"></div>
            <div className="sa-neo-cube c3"></div>
            <div className="sa-neo-cube c4"></div>
            <div className="sa-neo-cube c5"></div>
            <div className="sa-neo-cube c6"></div>
            <div className="sa-neo-cube c7"></div>
            <div className="sa-neo-cube c8"></div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <div className="sa-marquee-outer">
        <h3>Ils nous font confiance</h3>
        <div className="sa-marquee-wrap">
          <div className="sa-marquee-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div className="sa-mpill" key={i}>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
