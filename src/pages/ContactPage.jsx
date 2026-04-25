import { useState } from "react";
import { useReveal } from "./pageHooks";
import { BtnP } from "./pageUi";

export default function PageContact({ onSuccess, onSubmitContact }) {
  const [form, setForm] = useState({
    nom: "",
    wilaya: "",
    commune: "",
    tel: "",
    email: "",
    poste: "",
    users: "1 - 10 utilisateurs",
    service: "",
    msg: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useReveal();

  const submit = () => {
    if (!form.nom || !form.wilaya || !form.commune || !form.tel || !form.email) {
      onSuccess("Remplissez tous les champs obligatoires.", "err");
      return;
    }
    onSubmitContact?.({ ...form });
    onSuccess("Demande de devis envoyee ! Reponse sous 24h.", "suc");
    setForm({
      nom: "",
      wilaya: "",
      commune: "",
      tel: "",
      email: "",
      poste: "",
      users: "1 - 10 utilisateurs",
      service: "",
      msg: "",
    });
  };

  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{ margin: "0 auto 16px" }}>
          Contact
        </div>
        <h1>
          Parlons de <em>votre projet</em>
        </h1>
        <p>Notre equipe vous repond sous 24h pour votre devis personnalise.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-contact-wrap">
          <div className="sa-cinfo">
            <div className="sa-tag" style={{ marginBottom: 20 }}>
              Contactez-nous
            </div>
            <h2>
              Nous sommes <em>a votre ecoute</em>
            </h2>
            <p>
              Archivage, formation ou logiciel - nos experts vous accompagnent dans
              chaque projet.
            </p>
            <div className="sa-citems">
              {[
                {
                  ico: "fa-location-dot",
                  t: "Adresse",
                  v: "Cité Bon Accueil, rue Oumadour Ibrahim N-16B N-01, Geulma, Algeria 2400",
                },
                {
                  ico: "fa-phone",
                  t: "Telephone",
                  v: "037 140 773 / 0672 040 820 (WhatsApp)",
                },
                { ico: "fa-envelope", t: "Email", v: "smartarchive.rg@gmail.com" },
                { ico: "fa-clock", t: "Horaires", v: "Dim - Jeu : 08h00 - 17h00" },
              ].map((c, i) => (
                <div className="sa-citem" key={i}>
                  <div className="sa-citem-ico">
                    <i className={`fas ${c.ico}`}></i>
                  </div>
                  <div>
                    <strong>{c.t}</strong>
                    <span>{c.v}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="sa-cform">
            <h3>Demander un devis gratuit</h3>
            <p className="sub">Reponse garantie sous 24h ouvrables.</p>
            <div className="sa-form-row">
              <div className="sa-fg">
                <label>Nom complet *</label>
                <input placeholder="Votre nom" value={form.nom} onChange={set("nom")} />
              </div>
              <div className="sa-fg">
                <label>Wilaya *</label>
                <input placeholder="Ex: Guelma" value={form.wilaya} onChange={set("wilaya")} />
              </div>
            </div>
            <div className="sa-form-row">
              <div className="sa-fg">
                <label>Commune *</label>
                <input
                  placeholder="Votre commune"
                  value={form.commune}
                  onChange={set("commune")}
                />
              </div>
              <div className="sa-fg">
                <label>Numero de telephone *</label>
                <input
                  type="tel"
                  placeholder="+213 XX XX XX XX"
                  value={form.tel}
                  onChange={set("tel")}
                />
              </div>
            </div>
            <div className="sa-form-row">
              <div className="sa-fg">
                <label>Email *</label>
                <input
                  type="email"
                  placeholder="email@exemple.com"
                  value={form.email}
                  onChange={set("email")}
                />
              </div>
              <div className="sa-fg">
                <label>Poste / Fonction</label>
                <input
                  placeholder="Ex: Responsable administratif"
                  value={form.poste}
                  onChange={set("poste")}
                />
              </div>
            </div>
            <div className="sa-form-row">
              <div className="sa-fg">
                <label>Nombre d'utilisateurs du logiciel</label>
                <select value={form.users} onChange={set("users")}>
                  <option>1 - 10 utilisateurs</option>
                  <option>11 - 50 utilisateurs</option>
                  <option>51 - 200 utilisateurs</option>
                  <option>200+ utilisateurs</option>
                </select>
              </div>
              <div className="sa-fg">
                <label>Service souhaite</label>
                <select value={form.service} onChange={set("service")}>
                  <option value="">Choisir un service...</option>
                  {[
                    "Archivage Physique",
                    "Numerisation de documents",
                    "Archivage Numerique / Cloud",
                    "Gestion Electronique (GED)",
                    "Formation professionnelle",
                    "Logiciel metier",
                    "Autre",
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sa-fg">
              <label>Details du besoin</label>
              <textarea placeholder="Decrivez votre besoin..." value={form.msg} onChange={set("msg")} />
            </div>
            <BtnP
              onClick={submit}
              style={{
                width: "100%",
                justifyContent: "center",
                height: 48,
                borderRadius: 12,
                fontSize: 15,
                marginTop: 4,
              }}
            >
              <i className="fas fa-paper-plane"></i>Envoyer ma demande
            </BtnP>
          </div>
        </div>
      </section>
    </>
  );
}
