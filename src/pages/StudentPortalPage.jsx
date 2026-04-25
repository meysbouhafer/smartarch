import { useEffect, useMemo, useState } from "react";
import { jsPDF } from "jspdf";
import { CAT_CLS, CAT_LBL, FORMATIONS } from "./pageData";
import { useReveal } from "./pageHooks";

function makeSeed(email = "") {
  return email.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 37);
}

function pickStudentFormations(user, catalog = FORMATIONS) {
  if (!catalog.length) return [];
  const seed = makeSeed(user?.email || user?.displayName || "etudiant");
  const first = seed % catalog.length;
  const second = (seed + 3) % catalog.length;
  const idxList = first === second ? [first, (second + 1) % catalog.length] : [first, second];

  const buildCourses = (formation, progress) => {
    if (Array.isArray(formation?.courses) && formation.courses.length) {
      return formation.courses.map((item, index) => ({
        title: item.title || `Cours ${index + 1}`,
        status: item.status || (progress >= 80 ? "Valide" : "Planifie"),
      }));
    }

    return [
      { title: "Introduction", status: "Valide" },
      { title: "Methode et bonnes pratiques", status: "En cours" },
      { title: "Atelier pratique", status: progress >= 75 ? "Valide" : "Planifie" },
      { title: "Evaluation finale", status: progress >= 90 ? "Valide" : "Planifie" },
    ];
  };

  return idxList.map((idx, i) => {
    const f = catalog[idx];
    const progress = 64 + ((seed + i * 11) % 34);

    return {
      id: `${idx}-${i}`,
      ...f,
      progress,
      certReady: progress >= 80,
      courses: buildCourses(f, progress),
      planning: [
        { day: "Lundi", time: "09:00 - 12:00", type: "Cours" },
        { day: "Mercredi", time: "13:30 - 16:00", type: "TP" },
        { day: "Samedi", time: "10:00 - 12:00", type: "Coaching" },
      ],
    };
  });
}

function formatLastLogin(user) {
  const value = user?.metadata?.lastSignInTime;
  if (!value) return "Session active (sans cookies)";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Session active (sans cookies)";
  return d.toLocaleString("fr-FR");
}

export default function StudentPortalPage({
  user,
  adminPublished,
  enrollments = [],
  catalog = FORMATIONS,
  onCertificateDownload,
}) {
  useReveal();

  const buildStudentCourses = (formation, progress, completed) => {
    if (Array.isArray(formation?.courses) && formation.courses.length) {
      return formation.courses.map((item, index) => ({
        title: item.title || `Cours ${index + 1}`,
        status: item.status || (completed ? "Valide" : progress >= 75 ? "En cours" : "Planifie"),
      }));
    }

    return [
      { title: "Introduction", status: "Valide" },
      { title: "Methode et bonnes pratiques", status: completed ? "Valide" : "En cours" },
      { title: "Atelier pratique", status: completed ? "Valide" : "Planifie" },
      { title: "Evaluation finale", status: completed ? "Valide" : "Planifie" },
    ];
  };

  const formations = useMemo(() => {
    if (enrollments.length) {
      return enrollments.map((ins, i) => {
        const base =
          catalog.find((f) => f.title === ins.formation) ||
          catalog[i % catalog.length] ||
          FORMATIONS[i % FORMATIONS.length];
        const safeBase = base || {
          cat: "ges",
          title: ins.formation || "Formation",
          desc: "Formation ajoutee par administration",
          dur: "-",
          lvl: "-",
          fmt: "-",
          prix: "-",
          mode: "Presentiel",
          top: "linear-gradient(90deg,#2563EB,#4F46E5)",
        };
        const progress = ins.completed ? 100 : 72;
        return {
          id: ins.id || `${ins.formation}-${i}`,
          ...safeBase,
          title: ins.formation || safeBase.title,
          progress,
          certReady: !!ins.certificatePushed,
          certificateDownloaded: !!ins.certificateDownloaded,
          paymentStatus: ins.paymentStatus || "unpaid",
          courses: buildStudentCourses(base, progress, ins.completed),
          planning: [
            { day: "Lundi", time: "09:00 - 12:00", type: "Cours" },
            { day: "Mercredi", time: "13:30 - 16:00", type: "TP" },
            { day: "Samedi", time: "10:00 - 12:00", type: "Coaching" },
          ],
        };
      });
    }

    return pickStudentFormations(user, catalog);
  }, [user, enrollments, catalog]);
  const [activeId, setActiveId] = useState(formations[0]?.id || "");

  useEffect(() => {
    setActiveId(formations[0]?.id || "");
  }, [formations]);

  const active = formations.find((f) => f.id === activeId) || formations[0];
  const isCertPublished =
    adminPublished?.certificatesByTitle?.[active?.title] !== undefined
      ? !!adminPublished.certificatesByTitle[active?.title]
      : active?.certReady;
  const isPlanningPublished =
    adminPublished?.planningByTitle?.[active?.title] !== undefined
      ? !!adminPublished.planningByTitle[active?.title]
      : true;

  const downloadCertificate = (formation) => {
    const fullName = user?.displayName || user?.email || "Etudiant";
    const doc = new jsPDF();
    const dateLabel = new Date().toLocaleDateString("fr-FR");

    doc.setFillColor(245, 247, 255);
    doc.rect(12, 12, 186, 273, "F");
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.8);
    doc.rect(16, 16, 178, 265);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(24);
    doc.text("CERTIFICAT DE REUSSITE", 105, 50, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text("Ce certificat est delivre a", 105, 74, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(fullName, 105, 90, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(`Formation: ${formation.title}`, 25, 120);
    doc.text(`Niveau: ${formation.lvl}`, 25, 132);
    doc.text(`Progression: ${formation.progress}%`, 25, 144);
    doc.text(`Date: ${dateLabel}`, 25, 156);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(11);
    doc.text("Smart Archives - Geulma", 25, 178);
    doc.text("Validation administrative numerique", 25, 186);

    doc.save(`certificat-${formation.title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
    onCertificateDownload?.(formation.id);
  };

  if (!active) {
    return (
      <section className="sa-sec">
        <div className="sa-empty-student sa-r v">Aucune formation active pour le moment.</div>
      </section>
    );
  }

  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{ margin: "0 auto 16px" }}>
          Espace Etudiant
        </div>
        <h1>
          Tableau de bord <em>personnel</em>
          <br />
          formations & certificats
        </h1>
        <p>Consultez vos cours, votre planning et telechargez vos certificats depuis votre compte.</p>
      </div>

      <section className="sa-sec sa-student-wrap">
        <div className="sa-student-grid">
          <div className="sa-student-panel sa-r d1 v">
            <h3>Mes formations inscrites</h3>
            <div className="sa-student-list">
              {formations.map((f) => (
                <button
                  key={f.id}
                  className={`sa-student-item ${active.id === f.id ? "on" : ""}`}
                  onClick={() => setActiveId(f.id)}
                >
                  <span className="sa-fcat" style={{ background: CAT_CLS[f.cat].bg, color: CAT_CLS[f.cat].col }}>
                    {CAT_LBL[f.cat]}
                  </span>
                  <strong>{f.title}</strong>
                  <small>
                    {f.progress}% valide{f.paymentStatus ? ` · ${f.paymentStatus === "paid" ? "Paye" : "Non paye"}` : ""}
                    {f.certificateDownloaded ? " · Certificat telecharge" : ""}
                  </small>
                </button>
              ))}
            </div>
          </div>

          <div className="sa-student-panel sa-r d2 v">
            <h3>{active.title}</h3>
            <p className="sa-student-muted">Cours de la formation</p>
            <ul className="sa-course-list">
              {active.courses.map((c, i) => (
                <li key={i}>
                  <span>{c.title}</span>
                  {c.pdfData && c.pdfName ? (
                    <a
                      href={c.pdfData}
                      download={c.pdfName}
                      style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none" }}
                    >
                      PDF
                    </a>
                  ) : null}
                  <b className={`st ${c.status === "Valide" ? "ok" : c.status === "En cours" ? "run" : "todo"}`}>
                    {c.status}
                  </b>
                </li>
              ))}
            </ul>
          </div>

          <div className="sa-student-panel sa-r d3 v">
            <h3>Planning des cours</h3>
            <p className="sa-student-muted">Prochaines seances de {active.title}</p>
            {isPlanningPublished ? (
              <div className="sa-plan-table">
                {active.planning.map((p, i) => (
                  <div key={i} className="sa-plan-row">
                    <span>{p.day}</span>
                    <span>{p.time}</span>
                    <b>{p.type}</b>
                  </div>
                ))}
              </div>
            ) : (
              <div className="sa-empty-student">Le planning n'est pas encore publie par l'administration.</div>
            )}
          </div>

          <div className="sa-student-panel sa-r d4 v">
            <h3>Certificat</h3>
            <p className="sa-student-muted">Recuperation depuis votre compte</p>
            <div className="sa-cert-box">
              <div>
                <strong>{active.title}</strong>
                <small>
                  {isCertPublished
                    ? "Certificat disponible"
                    : "Le certificat sera disponible apres publication admin"}
                </small>
                {active.certificateDownloaded ? <small>Statut: deja telecharge</small> : null}
              </div>
              <button
                className="sa-btn-cta"
                style={{ height: 40, borderRadius: 10 }}
                disabled={!isCertPublished}
                onClick={() => downloadCertificate(active)}
              >
                <i className="fas fa-download"></i>Telecharger
              </button>
            </div>
          </div>

          <div className="sa-student-panel sa-r d5 v">
            <h3>Informations de connexion</h3>
            <p className="sa-student-muted">Session sans cookies (memoire locale uniquement)</p>
            <div className="sa-conn-grid">
              <div>
                <label>Nom</label>
                <strong>{user?.displayName || "Etudiant"}</strong>
              </div>
              <div>
                <label>Email / Identifiant</label>
                <strong>{user?.email || "Compte local"}</strong>
              </div>
              <div>
                <label>Fournisseur</label>
                <strong>{user?.providerId === "local" ? "Compte personnel" : "Google"}</strong>
              </div>
              <div>
                <label>Derniere connexion</label>
                <strong>{formatLastLogin(user)}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
