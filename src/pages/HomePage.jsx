import { useReveal } from "./pageHooks";
import { PARTNERS } from "./pageData";

export default function PageHome({ go }) {
  useReveal();

  return (
    <>
      <style>{`
        /* =============== AURORA BLOBS & ENHANCEMENTS =============== */
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        @keyframes sway {
          0%, 100% { transform: rotateY(0deg) rotateX(5deg); }
          50% { transform: rotateY(15deg) rotateX(-5deg); }
        }

        @keyframes auroraGlow {
          0%, 100% { opacity: 0.3; filter: blur(80px); }
          50% { opacity: 0.6; filter: blur(100px); }
        }

        @keyframes orbitParticle {
          0% { transform: rotateZ(0deg) translateX(120px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: rotateZ(360deg) translateX(120px); opacity: 0; }
        }

        .sa-aurora-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          mix-blend-mode: screen;
          animation: auroraGlow 8s ease-in-out infinite;
        }

        .sa-aurora-blob.blob1 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59,130,246,0.5) 0%, transparent 70%);
          top: -100px;
          left: 100px;
          animation-delay: 0s;
        }

        .sa-aurora-blob.blob2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%);
          bottom: 100px;
          right: 50px;
          animation-delay: 2s;
        }

        /* Enhance cubes with glow & size */
        .sa-neo-cube {
          box-shadow: 0 0 30px rgba(59,130,246,0.6), inset 0 0 20px rgba(139,92,246,0.4);
          animation: floatY 4s ease-in-out infinite;
          width: 80px !important;
          height: 80px !important;
        }

        .sa-neo-cube.c1 { animation-delay: 0s; box-shadow: 0 0 40px rgba(59,130,246,0.8), inset 0 0 20px rgba(59,130,246,0.5); }
        .sa-neo-cube.c2 { animation-delay: 0.2s; box-shadow: 0 0 35px rgba(139,92,246,0.7), inset 0 0 20px rgba(139,92,246,0.4); }
        .sa-neo-cube.c3 { animation-delay: 0.4s; box-shadow: 0 0 30px rgba(6,182,212,0.6), inset 0 0 20px rgba(6,182,212,0.3); }
        .sa-neo-cube.c4 { animation-delay: 0.6s; box-shadow: 0 0 35px rgba(59,130,246,0.7), inset 0 0 20px rgba(59,130,246,0.4); }
        .sa-neo-cube.c5 { animation-delay: 0.8s; box-shadow: 0 0 40px rgba(139,92,246,0.8), inset 0 0 20px rgba(139,92,246,0.5); }
        .sa-neo-cube.c6 { animation-delay: 1s; box-shadow: 0 0 30px rgba(6,182,212,0.6), inset 0 0 20px rgba(6,182,212,0.3); }
        .sa-neo-cube.c7 { animation-delay: 1.2s; box-shadow: 0 0 35px rgba(59,130,246,0.7), inset 0 0 20px rgba(59,130,246,0.4); }
        .sa-neo-cube.c8 { animation-delay: 1.4s; box-shadow: 0 0 40px rgba(139,92,246,0.8), inset 0 0 20px rgba(139,92,246,0.5); }

        /* Cube cloud sway */
        .sa-cube-cloud {
          animation: sway 8s ease-in-out infinite;
        }

        /* Orbit particles around cluster */
        .sa-orbit-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #3B82F6, #8B5CF6);
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(59,130,246,0.8);
          left: 50%;
          top: 50%;
          margin: -3px 0 0 -3px;
          animation: orbitParticle 6s linear infinite;
        }

        .sa-orbit-particle:nth-child(1) { animation-delay: 0s; }
        .sa-orbit-particle:nth-child(2) { animation-delay: -1.5s; }
        .sa-orbit-particle:nth-child(3) { animation-delay: -3s; }
        .sa-orbit-particle:nth-child(4) { animation-delay: -4.5s; }

        /* =============== TIMELINE SECTION =============== */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .sa-section-histoire {
          background: linear-gradient(135deg, #020817 0%, #0f172a 100%);
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        .sa-histoire-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
        }

        .sa-timeline {
          position: relative;
          padding-left: 60px;
        }

        .sa-timeline::before {
          content: '';
          position: absolute;
          left: 12px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%);
          box-shadow: 0 0 20px rgba(59,130,246,0.6);
        }

        .sa-timeline-item {
          position: relative;
          margin-bottom: 50px;
          animation: slideInLeft 0.8s ease-out;
        }

        .sa-timeline-item:nth-child(1) { animation-delay: 0.1s; }
        .sa-timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .sa-timeline-item:nth-child(3) { animation-delay: 0.3s; }
        .sa-timeline-item:nth-child(4) { animation-delay: 0.4s; }

        .sa-timeline-dot {
          position: absolute;
          left: -48px;
          top: 0;
          width: 24px;
          height: 24px;
          background: #020817;
          border: 3px solid #3B82F6;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(59,130,246,0.8);
          transition: all 0.3s ease;
        }

        .sa-timeline-item:hover .sa-timeline-dot {
          transform: scale(1.4);
          box-shadow: 0 0 30px rgba(59,130,246,1);
          border-color: #8B5CF6;
        }

        .sa-timeline-year {
          font-size: 24px;
          font-weight: 700;
          color: #3B82F6;
          margin-bottom: 8px;
        }

        .sa-timeline-text {
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
        }

        .sa-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .sa-stat-card {
          background: rgba(59,130,246,0.05);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 12px;
          padding: 30px;
          backdrop-filter: blur(10px);
          animation: slideInRight 0.8s ease-out;
          transition: all 0.3s ease;
        }

        .sa-stat-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-stat-card:nth-child(2) { animation-delay: 0.2s; }
        .sa-stat-card:nth-child(3) { animation-delay: 0.3s; }
        .sa-stat-card:nth-child(4) { animation-delay: 0.4s; }

        .sa-stat-card:hover {
          background: rgba(59,130,246,0.1);
          border-color: rgba(139,92,246,0.4);
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(59,130,246,0.1);
        }

        .sa-stat-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .sa-stat-label {
          font-size: 14px;
          color: #94a3b8;
        }

        /* =============== SERVICES SECTION =============== */
        .sa-section-services {
          background: #020817;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        .sa-services-header {
          text-align: center;
          margin-bottom: 60px;
          animation: slideInLeft 0.8s ease-out;
        }

        .sa-services-header h2 {
          font-size: 42px;
          font-weight: 700;
          color: white;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sa-services-header p {
          color: #94a3b8;
          font-size: 16px;
          max-width: 600px;
          margin: 0 auto;
        }

        .sa-services-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
        }

        .sa-service-card {
          background: linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(139,92,246,0.05) 100%);
          border: 1px solid rgba(59,130,246,0.2);
          border-radius: 16px;
          padding: 40px;
          backdrop-filter: blur(10px);
          cursor: pointer;
          animation: slideInLeft 0.8s ease-out;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        .sa-service-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-service-card:nth-child(2) { animation-delay: 0.2s; }
        .sa-service-card:nth-child(3) { animation-delay: 0.3s; }
        .sa-service-card:nth-child(4) { animation-delay: 0.4s; }
        .sa-service-card:nth-child(5) { animation-delay: 0.5s; }
        .sa-service-card:nth-child(6) { animation-delay: 0.6s; }

        .sa-service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(59,130,246,0.2) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .sa-service-card:hover {
          transform: translateY(-12px);
          border-color: rgba(139,92,246,0.5);
          box-shadow: 0 30px 60px rgba(59,130,246,0.15), inset 0 0 40px rgba(59,130,246,0.05);
        }

        .sa-service-card:hover::before {
          opacity: 1;
        }

        .sa-service-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 10px 30px rgba(59,130,246,0.3);
          transition: all 0.3s ease;
        }

        .sa-service-card:hover .sa-service-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 15px 40px rgba(139,92,246,0.4);
        }

        .sa-service-title {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 12px;
        }

        .sa-service-desc {
          font-size: 14px;
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* =============== TEAM SECTION =============== */
        .sa-section-team {
          background: linear-gradient(135deg, #0f172a 0%, #020817 100%);
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
        }

        .sa-team-header {
          text-align: center;
          margin-bottom: 60px;
          animation: slideInRight 0.8s ease-out;
        }

        .sa-team-header h2 {
          font-size: 42px;
          font-weight: 700;
          color: white;
          margin: 0 0 16px 0;
          background: linear-gradient(135deg, #06B6D4, #3B82F6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .sa-team-header p {
          color: #94a3b8;
          font-size: 16px;
        }

        .sa-team-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        .sa-team-card {
          background: linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(6,182,212,0.05) 100%);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(10px);
          text-align: center;
          animation: slideInRight 0.8s ease-out;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
        }

        .sa-team-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-team-card:nth-child(2) { animation-delay: 0.2s; }
        .sa-team-card:nth-child(3) { animation-delay: 0.3s; }
        .sa-team-card:nth-child(4) { animation-delay: 0.4s; }

        .sa-team-card:hover {
          transform: translateY(-16px);
          border-color: rgba(59,130,246,0.6);
          box-shadow: 0 40px 80px rgba(59,130,246,0.2), inset 0 0 40px rgba(139,92,246,0.1);
        }

        .sa-team-avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          font-weight: 700;
          color: white;
          margin: 0 auto 20px;
          box-shadow: 0 15px 40px rgba(59,130,246,0.3);
          transition: all 0.3s ease;
        }

        .sa-team-card:hover .sa-team-avatar {
          transform: scale(1.15);
          box-shadow: 0 20px 60px rgba(139,92,246,0.5);
        }

        .sa-team-name {
          font-size: 20px;
          font-weight: 700;
          color: white;
          margin-bottom: 6px;
        }

        .sa-team-role {
          font-size: 14px;
          color: #06B6D4;
          margin-bottom: 12px;
          font-weight: 600;
        }

        .sa-team-bio {
          font-size: 13px;
          color: #cbd5e1;
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sa-histoire-container {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .sa-services-header h2,
          .sa-team-header h2 {
            font-size: 32px;
          }

          .sa-services-grid {
            grid-template-columns: 1fr;
          }

          .sa-team-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 30px;
          }

          .sa-section-histoire,
          .sa-section-services,
          .sa-section-team {
            padding: 60px 20px;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="sa-hero sa-hero-neo">
        <div className="sa-hero-mesh"></div>
        <div className="sa-hero-dots"></div>
        <div className="sa-hero-line"></div>
        <div className="sa-aurora-blob blob1"></div>
        <div className="sa-aurora-blob blob2"></div>

        <div className="sa-neo-topnav sa-r">
          <button className="sa-neo-navitem on">Fonctionnalites</button>
          <button className="sa-neo-navitem">Integrations</button>
          <button className="sa-neo-navitem">Tarifs</button>
          <button className="sa-neo-navitem">Changelog</button>
          <button className="sa-neo-navcta" onClick={() => go("contact")}>Demander un devis</button>
        </div>

        <div className="sa-hero-inner">
          <div className="sa-hero-pill">
            <div className="sa-pill-dot"><i className="fas fa-star" style={{fontSize:9}}></i></div>
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
          <div className="sa-neo-visual-badge"><i className="fas fa-wave-square"></i> Analyse temps reel</div>
          <div className="sa-cube-cloud">
            <div className="sa-neo-beam b1"></div>
            <div className="sa-neo-beam b2"></div>
            <div className="sa-neo-beam b3"></div>
            <span className="sa-orbit-particle"></span>
            <span className="sa-orbit-particle"></span>
            <span className="sa-orbit-particle"></span>
            <span className="sa-orbit-particle"></span>
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

      {/* PARTNERS MARQUEE */}
      <div className="sa-marquee-outer">
        <h3>Ils nous font confiance</h3>
        <div className="sa-marquee-wrap">
          <div className="sa-marquee-track">
            {[...PARTNERS, ...PARTNERS].map((p, i) => (
              <div className="sa-mpill" key={i}>{p}</div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: HISTOIRE (TIMELINE) */}
      <section className="sa-section-histoire">
        <div className="sa-histoire-container">
          <div className="sa-timeline">
            <div className="sa-timeline-item">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2010</div>
              <div className="sa-timeline-text">Fondation de Smart Archives avec une vision claire de la transformation documentaire</div>
            </div>
            <div className="sa-timeline-item">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2015</div>
              <div className="sa-timeline-text">Lancement de nos services cloud et expansion à travers le continent africain</div>
            </div>
            <div className="sa-timeline-item">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2020</div>
              <div className="sa-timeline-text">Certification ISO 27001 et adoption massive par les institutions publiques</div>
            </div>
            <div className="sa-timeline-item">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2024</div>
              <div className="sa-timeline-text">Leader incontournable de l&apos;archivage numérique en Algérie avec 500+ clients</div>
            </div>
          </div>

          <div className="sa-stats-grid">
            <div className="sa-stat-card">
              <div className="sa-stat-value">500+</div>
              <div className="sa-stat-label">Clients satisfaits</div>
            </div>
            <div className="sa-stat-card">
              <div className="sa-stat-value">1M+</div>
              <div className="sa-stat-label">Documents archivés</div>
            </div>
            <div className="sa-stat-card">
              <div className="sa-stat-value">15+</div>
              <div className="sa-stat-label">Années d&apos;expérience</div>
            </div>
            <div className="sa-stat-card">
              <div className="sa-stat-value">99.9%</div>
              <div className="sa-stat-label">Disponibilité garantie</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: NOS SERVICES */}
      <section className="sa-section-services">
        <div className="sa-services-header">
          <h2>Nos Services</h2>
          <p>Une solution complète pour tous vos besoins en gestion documentaire et archivage</p>
        </div>

        <div className="sa-services-grid">
          <div className="sa-service-card" onClick={() => go("services")}>
            <div className="sa-service-icon"><i className="fas fa-box-archive"></i></div>
            <div className="sa-service-title">Archivage Numérique</div>
            <div className="sa-service-desc">Sécurité maximale avec chiffrement AES-256 et sauvegarde triple redondance en centre de données certifié.</div>
          </div>

          <div className="sa-service-card" onClick={() => go("services")}>
            <div className="sa-service-icon"><i className="fas fa-search"></i></div>
            <div className="sa-service-title">Recherche Instantanée</div>
            <div className="sa-service-desc">Retrouvez vos documents en secondes grâce à notre moteur de recherche full-text et OCR multilingue.</div>
          </div>

          <div className="sa-service-card" onClick={() => go("services")}>
            <div className="sa-service-icon"><i className="fas fa-shield-halved"></i></div>
            <div className="sa-service-title">Sécurité & Conformité</div>
            <div className="sa-service-desc">Conforme aux normes ISO 27001, RGPD et à la loi 18-07 algérienne sur la protection des données.</div>
          </div>

          <div className="sa-service-card" onClick={() => go("services")}>
            <div className="sa-service-icon"><i className="fas fa-chart-line"></i></div>
            <div className="sa-service-title">Tableau de Bord</div>
            <div className="sa-service-desc">Tableaux de bord intuitifs et rapports détaillés pour suivre votre gestion documentaire en temps réel.</div>
          </div>

          <div className="sa-service-card" onClick={() => go("services")}>
            <div className="sa-service-icon"><i className="fas fa-cloud"></i></div>
            <div className="sa-service-title">Stockage Cloud</div>
            <div className="sa-service-desc">Extensible et illimité avec accès multi-appareils et synchronisation instantanée sur tous vos terminaux.</div>
          </div>

          <div className="sa-service-card" onClick={() => go("services")}>
            <div className="sa-service-icon"><i className="fas fa-chalkboard-user"></i></div>
            <div className="sa-service-title">Formations</div>
            <div className="sa-service-desc">Formations certifiantes pour maîtriser nos solutions et optimiser votre productivité documentaire.</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: NOTRE ÉQUIPE */}
      <section className="sa-section-team">
        <div className="sa-team-header">
          <h2>Notre Équipe</h2>
          <p>Des experts passionnés au service de l&apos;excellence</p>
        </div>

        <div className="sa-team-grid">
          <div className="sa-team-card">
            <div className="sa-team-avatar">HN</div>
            <div className="sa-team-name">Dr. Haddad Nabil</div>
            <div className="sa-team-role">Directeur Technique</div>
            <div className="sa-team-bio">Expert en architecture cloud et sécurité informatique avec 20+ ans d&apos;expérience dans l&apos;innovation documentaire.</div>
          </div>

          <div className="sa-team-card">
            <div className="sa-team-avatar">KL</div>
            <div className="sa-team-name">Mme Kaci Lynda</div>
            <div className="sa-team-role">Responsable Formation</div>
            <div className="sa-team-bio">Pédagogue expérimentée certifiée, elle conçoit des formations pratiques et adaptées aux besoins des entreprises.</div>
          </div>

          <div className="sa-team-card">
            <div className="sa-team-avatar">MA</div>
            <div className="sa-team-name">M. Meziane Adel</div>
            <div className="sa-team-role">Cybersécurité</div>
            <div className="sa-team-bio">Spécialiste en cybersécurité ISO 27001 et ethical hacking, garant de la protection de vos données sensibles.</div>
          </div>

          <div className="sa-team-card">
            <div className="sa-team-avatar">BY</div>
            <div className="sa-team-name">M. Benmoussa Yacine</div>
            <div className="sa-team-role">Développeur Full Stack</div>
            <div className="sa-team-bio">Développeur passionné spécialisé en React et Node.js, créateur de solutions web performantes et scalables.</div>
          </div>
        </div>
      </section>
    </>
  );
}
