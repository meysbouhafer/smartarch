import { useEffect, useMemo, useState } from "react";
import RagAdminPanel from "./RagAdminPanel.jsx";
import "./admin.css";
import { CAT_CLS, CAT_LBL, FORMATION_CATEGORY_OPTIONS, FORMATION_LEVEL_OPTIONS, FORMATION_MODE_OPTIONS, LOGICIELS, COLLABORATEURS } from "./pageData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";
const THEME_KEY = "sa_admin_theme_v1";

const defaultAdminForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "Admin",
  status: "Active",
};

const defaultCourseForm = {
  title: "",
  category: "bur",
  description: "",
  instructor: "",
  duration: "",
  level: FORMATION_LEVEL_OPTIONS[0],
  price: "0",
  mode: FORMATION_MODE_OPTIONS[0],
  top: "",
  status: "Published",
  coursesText: "",
};

const defaultLogicielForm = {
  title: "",
  ico: "fa-software",
  grad: "linear-gradient(135deg,#2563EB,#4F46E5)",
  desc: "",
  feats: "",
  price: "",
  priceSub: "/ an - licence",
  priceType: "paid",
};

const defaultCollaborateurForm = {
  name: "",
  role: "",
  bio: "",
  avatar: "",
};

const FORMATION_TOPS = {
  bur: "linear-gradient(90deg,#2563EB,#4F46E5)",
  dev: "linear-gradient(90deg,#8B5CF6,#4F46E5)",
  cyb: "linear-gradient(90deg,#EF4444,#F59E0B)",
  ges: "linear-gradient(90deg,#10B981,#0EA5E9)",
};

function formatDate(input) {
  if (!input) return "-";
  try {
    return new Date(input).toLocaleDateString("fr-FR");
  } catch {
    return "-";
  }
}

function formatPrice(course) {
  const value = course?.prix ?? course?.price ?? 0;
  if (Number(value) === 0) return "Gratuit";
  return `${Number(String(value).replace(/\s/g, "") || 0).toLocaleString("fr-FR")} DA`;
}

function mapUserRole(user, admins) {
  const email = (user?.email || "").toLowerCase();
  const match = admins.find((item) => item.email === email);
  if (match?.role) return match.role;
  return "Super Admin";
}

export default function AdminDashboardPage({
  user,
  data,
  formations,
  onAcceptInscription,
  onRejectInscription,
  onSetPaymentStatus,
  onAddFormation,
  onUpdateFormation,
  onRemoveFormation,
  onAddFormationCourse,
  onUpdateFormationCourse,
  onRemoveFormationCourse,
}) {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) === "dark";
    } catch {
      return false;
    }
  });

  const [toast, setToast] = useState({ type: "success", message: "" });
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [admins, setAdmins] = useState([]);

  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminForm, setAdminForm] = useState(defaultAdminForm);

  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(defaultCourseForm);
  const [courseFilters, setCourseFilters] = useState({ q: "", category: "all" });
  const [selectedFormationCourseTitle, setSelectedFormationCourseTitle] = useState("");
  const [editingFormationCourse, setEditingFormationCourse] = useState(null);
  const [formationCourseForm, setFormationCourseForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: FORMATION_LEVEL_OPTIONS[0],
    pdfName: "",
    pdfData: "",
    pdfType: "",
  });

  // Logiciels states
  const [logiciels, setLogiciels] = useState(LOGICIELS);
  const [openLogicielModal, setOpenLogicielModal] = useState(false);
  const [editingLogiciel, setEditingLogiciel] = useState(null);
  const [logicielForm, setLogicielForm] = useState(defaultLogicielForm);

  // Collaborateurs states
  const [collaborateurs, setCollaborateurs] = useState(COLLABORATEURS);
  const [openCollabModal, setOpenCollabModal] = useState(false);
  const [editingCollab, setEditingCollab] = useState(null);
  const [collabForm, setCollabForm] = useState(defaultCollaborateurForm);

  const requesterRole = useMemo(() => mapUserRole(user, admins), [user, admins]);
  const isSuperAdmin = requesterRole === "Super Admin";

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("admin-dark", isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch {
      // ignore storage errors
    }
    return () => root.classList.remove("admin-dark");
  }, [isDark]);

  useEffect(() => {
    const timer = setTimeout(() => setToast({ type: "success", message: "" }), 3500);
    return () => clearTimeout(timer);
  }, [toast.message]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    if (!selectedFormationCourseTitle && formations[0]?.title) {
      setSelectedFormationCourseTitle(formations[0].title);
    }
  }, [formations, selectedFormationCourseTitle]);

  async function api(path, options = {}) {
    const headers = {
      "x-user-email": user?.email || "",
      "x-user-role": requesterRole,
      ...(options.headers || {}),
    };
    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || "Erreur serveur");
    }
    if (response.status === 204) return null;
    return response.json();
  }

  async function fetchAdmins() {
    try {
      setLoadingAdmins(true);
      const list = await api("/admin/admins");
      setAdmins(list || []);
    } catch {
      setAdmins(
        (data.admins || []).map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          role: "Admin",
          status: "Active",
          createdAt: item.createdAt || new Date().toISOString(),
        }))
      );
    } finally {
      setLoadingAdmins(false);
    }
  }

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function resetAdminForm() {
    setAdminForm(defaultAdminForm);
    setEditingAdmin(null);
  }

  function resetCourseForm() {
    setCourseForm(defaultCourseForm);
    setEditingCourse(null);
  }

  function parseCoursesText(text) {
    return String(text || "")
      .split(/\r?\n|;/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((title, index) => ({
        id: `${Date.now()}-${index}`,
        title,
        description: "",
        duration: "",
        level: FORMATION_LEVEL_OPTIONS[0],
        pdfName: "",
        pdfData: "",
        pdfType: "",
      }));
  }

  function resetFormationCourseForm() {
    setFormationCourseForm({
      title: "",
      description: "",
      duration: "",
      level: FORMATION_LEVEL_OPTIONS[0],
      pdfName: "",
      pdfData: "",
      pdfType: "",
    });
    setEditingFormationCourse(null);
  }

  function readPdfAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Lecture du PDF impossible."));
      reader.readAsDataURL(file);
    });
  }

  function validateAdminForm() {
    if (!adminForm.fullName.trim()) return "Nom complet obligatoire.";
    if (!/^\S+@\S+\.\S+$/.test(adminForm.email.trim())) return "Email invalide.";
    if (!editingAdmin) {
      if (adminForm.password.length < 8 || !/[A-Z]/.test(adminForm.password) || !/\d/.test(adminForm.password)) {
        return "Mot de passe faible (8+ caractères, 1 majuscule, 1 chiffre).";
      }
      if (adminForm.password !== adminForm.confirmPassword) return "Les mots de passe ne correspondent pas.";
    }
    return "";
  }

  async function submitAdmin(event) {
    event.preventDefault();
    if (!isSuperAdmin) {
      showToast("Seul un Super Admin peut gérer les administrateurs.", "error");
      return;
    }

    const validationError = validateAdminForm();
    if (validationError) {
      showToast(validationError, "error");
      return;
    }

    try {
      if (editingAdmin) {
        await api(`/admin/admins/${editingAdmin.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: adminForm.fullName,
            role: adminForm.role,
            status: adminForm.status,
          }),
        });
        showToast("Admin mis à jour.");
      } else {
        await api("/admin/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminForm),
        });
        showToast("Nouveau compte admin créé.");
      }

      await fetchAdmins();
      setOpenAdminModal(false);
      resetAdminForm();
    } catch (error) {
      showToast(String(error.message || "Impossible d'enregistrer cet admin."), "error");
    }
  }

  async function deleteAdmin(target) {
    if (!isSuperAdmin) {
      showToast("Seul un Super Admin peut supprimer un admin.", "error");
      return;
    }
    if (target.email === (user?.email || "").toLowerCase()) {
      showToast("Suppression de votre propre compte interdite.", "error");
      return;
    }
    if (!window.confirm("Supprimer cet administrateur ?")) return;
    try {
      await api(`/admin/admins/${target.id}`, { method: "DELETE" });
      await fetchAdmins();
      showToast("Administrateur supprimé.");
    } catch (error) {
      showToast(String(error.message || "Suppression impossible."), "error");
    }
  }

  async function submitCourse(event) {
    event.preventDefault();
    if (!courseForm.title.trim() || !courseForm.category || !courseForm.instructor.trim() || !courseForm.description.trim()) {
      showToast("Titre, catégorie, description et instructeur sont obligatoires.", "error");
      return;
    }

    const payload = {
      title: courseForm.title.trim(),
      cat: courseForm.category,
      desc: courseForm.description.trim(),
      dur: courseForm.duration.trim(),
      lvl: courseForm.level,
      fmt: courseForm.instructor.trim(),
      prix: String(courseForm.price || "0"),
      mode: courseForm.mode,
      top: FORMATION_TOPS[courseForm.category] || FORMATION_TOPS.ges,
      courses: parseCoursesText(courseForm.coursesText),
    };

    try {
      if (editingCourse) {
        onUpdateFormation?.(editingCourse.title, payload);
        showToast("Formation mise à jour.");
      } else {
        onAddFormation?.(payload);
        showToast("Nouvelle formation créée.");
      }

      setOpenCourseModal(false);
      resetCourseForm();
    } catch (error) {
      showToast(String(error.message || "Enregistrement impossible."), "error");
    }
  }

  async function deleteCourse(course) {
    if (!window.confirm(`Supprimer la formation "${course.title}" ?`)) return;
    onRemoveFormation?.(course.title);
    showToast("Formation supprimée.");
  }

  function openEditAdmin(admin) {
    setEditingAdmin(admin);
    setAdminForm({
      fullName: admin.name,
      email: admin.email,
      password: "",
      confirmPassword: "",
      role: admin.role,
      status: admin.status,
    });
    setOpenAdminModal(true);
  }

  function openEditCourse(course) {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || "",
      category: course.cat || "bur",
      description: course.desc || "",
      instructor: course.fmt || "",
      duration: course.dur || "",
      level: course.lvl || FORMATION_LEVEL_OPTIONS[0],
      price: String(course.prix || "0"),
      mode: course.mode || FORMATION_MODE_OPTIONS[0],
      top: course.top || "",
      status: course.status || "Published",
      coursesText: Array.isArray(course.courses) ? course.courses.map((item) => item.title).join("\n") : "",
    });
    setOpenCourseModal(true);
  }

  const selectedFormation = useMemo(
    () => formations.find((item) => item.title === selectedFormationCourseTitle) || formations[0] || null,
    [formations, selectedFormationCourseTitle]
  );

  function openEditFormationCourse(course) {
    setEditingFormationCourse(course);
    setFormationCourseForm({
      title: course.title || "",
      description: course.description || "",
      duration: course.duration || "",
      level: course.level || FORMATION_LEVEL_OPTIONS[0],
      pdfName: course.pdfName || "",
      pdfData: course.pdfData || "",
      pdfType: course.pdfType || "",
    });
  }

  async function submitFormationCourse(event) {
    event.preventDefault();
    if (!selectedFormation?.title) {
      showToast("Choisissez d'abord une formation.", "error");
      return;
    }
    if (!formationCourseForm.title.trim()) {
      showToast("Titre du cours obligatoire.", "error");
      return;
    }

    const payload = {
      title: formationCourseForm.title.trim(),
      description: formationCourseForm.description.trim(),
      duration: formationCourseForm.duration.trim(),
      level: formationCourseForm.level,
      pdfName: formationCourseForm.pdfName,
      pdfData: formationCourseForm.pdfData,
      pdfType: formationCourseForm.pdfType,
    };

    if (editingFormationCourse) {
      onUpdateFormationCourse?.(selectedFormation.title, editingFormationCourse.id, payload);
      showToast("Cours mis à jour.");
    } else {
      onAddFormationCourse?.(selectedFormation.title, payload);
      showToast("Cours ajouté à la formation.");
    }

    resetFormationCourseForm();
  }

  function removeFormationCourse(course) {
    if (!selectedFormation?.title) return;
    onRemoveFormationCourse?.(selectedFormation.title, course.id);
  }

  const visibleFormations = useMemo(() => {
    const q = courseFilters.q.trim().toLowerCase();
    return (formations || []).filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const desc = String(item.desc || "").toLowerCase();
      const instructor = String(item.fmt || "").toLowerCase();
      const level = String(item.lvl || "").toLowerCase();
      const categoryMatch = courseFilters.category === "all" || item.cat === courseFilters.category;
      const searchMatch = !q || `${title} ${desc} ${instructor} ${level}`.includes(q);
      return categoryMatch && searchMatch;
    });
  }, [formations, courseFilters.q, courseFilters.category]);

  const stats = useMemo(
    () => ({
      pending: data.inscriptions.filter((item) => item.status === "pending").length,
      accepted: data.inscriptions.filter((item) => item.status === "accepted").length,
      paid: data.inscriptions.filter((item) => item.paymentStatus === "paid").length,
      admins: admins.length,
      courses: formations.length,
    }),
    [data.inscriptions, admins.length, formations.length]
  );

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-logo">SA</div>
          <div>
            <h2>Smart Archives</h2>
            <span>Panneau Admin</span>
          </div>
        </div>

        <nav className="admin-nav">
          {[
            ["dashboard", "fa-house", "Dashboard"],
            ["clients", "fa-user-graduate", "Clients inscrits"],
            ["demos", "fa-video", "Demandes de demo"],
            ["admins", "fa-users", "Users / Admins"],
            ["courses", "fa-book-open", "Courses / Formations"],
            ["logiciels", "fa-software", "Gestion Logiciels"],
            ["collaborateurs", "fa-user-tie", "Collaborateurs"],
            ["settings", "fa-gear", "Settings"],
            ["rag", "fa-brain", "Base RAG"],
            ["logout", "fa-right-from-bracket", "Logout"],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              type="button"
              className={`admin-nav-item ${activeNav === key ? "active" : ""}`}
              onClick={() => {
                if (key === "logout") {
                  window.location.reload();
                  return;
                }
                setActiveNav(key);
                setSidebarOpen(false);
              }}
            >
              <i className={`fas ${icon}`}></i>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="icon-btn mobile-only" onClick={() => setSidebarOpen((value) => !value)}>
            <i className="fas fa-bars"></i>
          </button>

          <div className="admin-title-group">
            <h1>Administration</h1>
            <p>{user?.displayName || "Admin"} - {requesterRole}</p>
          </div>

          <button className="icon-btn" onClick={() => setIsDark((value) => !value)}>
            <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
          </button>
        </header>

        {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        {activeNav === "dashboard" && (
          <section className="admin-content-grid">
            <div className="stat-grid">
              <article className="card stat">
                <h3>En attente</h3>
                <strong>{stats.pending}</strong>
              </article>
              <article className="card stat">
                <h3>Acceptés</h3>
                <strong>{stats.accepted}</strong>
              </article>
              <article className="card stat">
                <h3>Paiements OK</h3>
                <strong>{stats.paid}</strong>
              </article>
              <article className="card stat">
                <h3>Admins</h3>
                <strong>{stats.admins}</strong>
              </article>
              <article className="card stat">
                <h3>Cours</h3>
                <strong>{stats.courses}</strong>
              </article>
            </div>

            <div className="card">
              <h3>Formations front office</h3>
              <div className="formation-list">
                {formations.map((item) => (
                  <div key={item.title} className="formation-row">
                    <span>{item.title}</span>
                    <button onClick={() => onRemoveFormation(item.title)}>Supprimer</button>
                  </div>
                ))}
              </div>
              <button
                className="primary-btn"
                onClick={() => onAddFormation({ title: `Nouvelle formation ${Date.now()}`, desc: "Description" })}
              >
                Ajouter une formation rapide
              </button>
            </div>

            <div className="card">
              <h3>Cours dans une formation existante</h3>
              <div className="filter-row" style={{ marginBottom: 12 }}>
                <select
                  value={selectedFormationCourseTitle}
                  onChange={(event) => setSelectedFormationCourseTitle(event.target.value)}
                >
                  <option value="">Choisir une formation</option>
                  {formations.map((item) => (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {selectedFormation ? (
                <>
                  <form className="modal-form" onSubmit={submitFormationCourse}>
                    <input
                      placeholder="Titre du cours"
                      value={formationCourseForm.title}
                      onChange={(event) => setFormationCourseForm((prev) => ({ ...prev, title: event.target.value }))}
                    />
                    <textarea
                      placeholder="Description du cours"
                      value={formationCourseForm.description}
                      onChange={(event) => setFormationCourseForm((prev) => ({ ...prev, description: event.target.value }))}
                    />
                    <div className="grid-2">
                      <input
                        placeholder="Durée"
                        value={formationCourseForm.duration}
                        onChange={(event) => setFormationCourseForm((prev) => ({ ...prev, duration: event.target.value }))}
                      />
                      <select
                        value={formationCourseForm.level}
                        onChange={(event) => setFormationCourseForm((prev) => ({ ...prev, level: event.target.value }))}
                      >
                        {FORMATION_LEVEL_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid-2">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          try {
                            const pdfData = await readPdfAsDataUrl(file);
                            setFormationCourseForm((prev) => ({
                              ...prev,
                              pdfName: file.name,
                              pdfData,
                              pdfType: file.type || "application/pdf",
                            }));
                          } catch {
                            showToast("Impossible de charger le PDF.", "error");
                          }
                        }}
                      />
                      <input placeholder="Nom du PDF" value={formationCourseForm.pdfName} readOnly />
                    </div>
                    <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
                      {editingFormationCourse && (
                        <button
                          type="button"
                          onClick={resetFormationCourseForm}
                        >
                          Annuler la modification
                        </button>
                      )}
                      <button type="submit">{editingFormationCourse ? "Mettre à jour le cours" : "Ajouter le cours"}</button>
                    </div>
                  </form>

                  <div className="formation-list" style={{ marginTop: 16 }}>
                    {(selectedFormation.courses || []).length ? (
                      selectedFormation.courses.map((course) => (
                        <div key={course.id} className="formation-row">
                          <div>
                            <strong>{course.title}</strong>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>
                              {course.level} {course.duration ? `· ${course.duration}` : ""}
                            </div>
                            {course.pdfName && <div style={{ fontSize: 12, opacity: 0.7 }}>PDF: {course.pdfName}</div>}
                          </div>
                          <div className="table-actions">
                            <button onClick={() => openEditFormationCourse(course)}>Edit</button>
                            <button onClick={() => removeFormationCourse(course)}>Supprimer</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p style={{ opacity: 0.7 }}>Aucun cours ajouté pour cette formation.</p>
                    )}
                  </div>
                </>
              ) : (
                <p style={{ opacity: 0.7 }}>Sélectionnez une formation pour ajouter ses cours.</p>
              )}
            </div>
          </section>
        )}

        {activeNav === "clients" && (
          <section className="card">
            <div className="card-head">
              <h3>Clients inscrits</h3>
              <span>{data.inscriptions.length} inscription(s)</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Formation</th>
                    <th>Statut</th>
                    <th>Paiement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.inscriptions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.prenom} {item.nom}</td>
                      <td>{item.email}</td>
                      <td>{item.formation}</td>
                      <td>{item.status}</td>
                      <td>{item.paymentStatus}</td>
                      <td>
                        <div className="table-actions">
                          <button onClick={() => onAcceptInscription(item.id)}>Valider</button>
                          <button onClick={() => onRejectInscription(item.id)}>Refuser</button>
                          <button onClick={() => onSetPaymentStatus(item.id)}>Paiement</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeNav === "demos" && (
          <section className="card">
            <div className="card-head">
              <h3>Demandes de demo</h3>
              <span>{data.devis.length} demande(s)</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Service</th>
                    <th>Utilisateurs</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.devis.map((item) => (
                    <tr key={item.id}>
                      <td>{item.nom}</td>
                      <td>{item.email}</td>
                      <td>{item.logiciel || item.service || "-"}</td>
                      <td>{item.users || "-"}</td>
                      <td>{item.msg || "-"}</td>
                      <td>{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeNav === "admins" && (
          <section className="card">
            <div className="card-head">
              <h3>Gestion des administrateurs</h3>
              <button
                className="primary-btn"
                disabled={!isSuperAdmin}
                onClick={() => {
                  resetAdminForm();
                  setOpenAdminModal(true);
                }}
              >
                Add New Admin
              </button>
            </div>

            {loadingAdmins ? (
              <div className="loading">Chargement des admins...</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admins.map((admin) => (
                      <tr key={admin.id}>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        <td>{admin.role}</td>
                        <td>{admin.status}</td>
                        <td>{formatDate(admin.createdAt)}</td>
                        <td>
                          <div className="table-actions">
                            <button disabled={!isSuperAdmin} onClick={() => openEditAdmin(admin)}>Edit</button>
                            <button
                              disabled={!isSuperAdmin}
                              onClick={async () => {
                                try {
                                  await api(`/admin/admins/${admin.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      status: admin.status === "Active" ? "Inactive" : "Active",
                                      fullName: admin.name,
                                      role: admin.role,
                                    }),
                                  });
                                  fetchAdmins();
                                } catch {
                                  showToast("Impossible de modifier le statut.", "error");
                                }
                              }}
                            >
                              Deactivate
                            </button>
                            <button disabled={!isSuperAdmin} onClick={() => deleteAdmin(admin)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeNav === "courses" && (
          <section className="card">
            <div className="card-head stacked-mobile">
              <h3>Gestion des formations</h3>
              <div className="filter-row">
                <input
                  value={courseFilters.q}
                  placeholder="Rechercher une formation"
                  onChange={(event) => setCourseFilters((prev) => ({ ...prev, q: event.target.value }))}
                />
                <select
                  value={courseFilters.category}
                  onChange={(event) => setCourseFilters((prev) => ({ ...prev, category: event.target.value }))}
                >
                  <option value="all">Toutes catégories</option>
                  {FORMATION_CATEGORY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <button
                  className="primary-btn"
                  onClick={() => {
                    resetCourseForm();
                    setOpenCourseModal(true);
                  }}
                >
                  Add New Formation
                </button>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Instructor</th>
                    <th>Level</th>
                    <th>Price</th>
                    <th>Mode</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFormations.length ? (
                    visibleFormations.map((course) => (
                      <tr key={course.title}>
                        <td>{course.title}</td>
                        <td>
                          <span className="sa-fcat" style={{ background: CAT_CLS[course.cat]?.bg, color: CAT_CLS[course.cat]?.col }}>
                            {CAT_LBL[course.cat] || course.cat}
                          </span>
                        </td>
                        <td>{course.fmt}</td>
                        <td>{course.lvl}</td>
                        <td>{formatPrice(course)}</td>
                        <td>{course.mode}</td>
                        <td>
                          <div className="table-actions">
                            <button onClick={() => openEditCourse(course)}>Edit</button>
                            <button onClick={() => showToast(course.desc || "Aucune description.")}>View</button>
                            <button onClick={() => deleteCourse(course)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7">Aucune formation trouvée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeNav === "rag" && (
          <section className="card" style={{background:"transparent",border:"none",boxShadow:"none",padding:0}}>
            <RagAdminPanel />
          </section>
        )}

        {activeNav === "settings" && (
          <section className="card">
            <h3>Paramètres</h3>
            <p>Le thème sombre/clair est automatiquement sauvegardé dans localStorage.</p>
          </section>
        )}

        {activeNav === "logiciels" && (
          <section className="admin-content-grid">
            <div className="card">
              <h3>Gestion des Logiciels</h3>
              <div className="software-list" style={{ maxHeight: "600px", overflowY: "auto" }}>
                {logiciels.map((software, idx) => (
                  <div key={idx} className="software-row" style={{
                    padding: "16px",
                    marginBottom: "12px",
                    background: "var(--bg-secondary, #f5f5f5)",
                    borderRadius: "8px",
                    border: "1px solid var(--border-color, #ddd)",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: "0 0 8px 0", fontWeight: 700 }}>{software.title}</h4>
                        <p style={{ margin: "0 0 8px 0", color: "var(--text-muted, #666)", fontSize: "14px" }}>{software.desc}</p>
                        <p style={{ margin: "8px 0", color: "var(--accent, #2563eb)", fontWeight: 600 }}>{software.price} {software.priceSub}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="secondary-btn" onClick={() => {
                          setEditingLogiciel(idx);
                          setLogicielForm({
                            title: software.title,
                            ico: software.ico,
                            grad: software.grad,
                            desc: software.desc,
                            feats: software.feats.join("\n"),
                            price: software.price,
                            priceSub: software.priceSub,
                            priceType: software.priceType,
                          });
                          setOpenLogicielModal(true);
                        }}>Modifier</button>
                        <button className="danger-btn" onClick={() => {
                          if (confirm(`Supprimer "${software.title}" ?`)) {
                            setLogiciels(logiciels.filter((_, i) => i !== idx));
                            setToast({ type: "success", message: `Logiciel "${software.title}" supprimé` });
                          }
                        }}>Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="primary-btn" style={{ marginTop: "16px" }} onClick={() => {
                setEditingLogiciel(null);
                setLogicielForm(defaultLogicielForm);
                setOpenLogicielModal(true);
              }}>
                Ajouter un logiciel
              </button>
            </div>
          </section>
        )}

        {activeNav === "collaborateurs" && (
          <section className="admin-content-grid">
            <div className="card">
              <h3>Gestion des Collaborateurs</h3>
              <div className="collaborators-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                {collaborateurs.map((collab) => (
                  <div key={collab.id} className="collaborator-card" style={{
                    padding: "20px",
                    background: "var(--bg-secondary, #f5f5f5)",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color, #ddd)",
                    textAlign: "center",
                  }}>
                    <div style={{
                      width: "80px",
                      height: "80px",
                      background: "linear-gradient(135deg, #3B82F6, #7C3AED)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "32px",
                      fontWeight: 700,
                      margin: "0 auto 16px",
                    }}>
                      {collab.avatar}
                    </div>
                    <h4 style={{ margin: "0 0 4px 0", fontWeight: 700 }}>{collab.name}</h4>
                    <p style={{ margin: "0 0 8px 0", color: "var(--accent, #2563eb)", fontWeight: 600, fontSize: "14px" }}>{collab.role}</p>
                    <p style={{ margin: "0 0 12px 0", color: "var(--text-muted, #666)", fontSize: "13px" }}>{collab.bio}</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="secondary-btn" style={{ flex: 1 }} onClick={() => {
                        setEditingCollab(collab.id);
                        setCollabForm({
                          name: collab.name,
                          role: collab.role,
                          bio: collab.bio,
                          avatar: collab.avatar,
                        });
                        setOpenCollabModal(true);
                      }}>Modifier</button>
                      <button className="danger-btn" style={{ flex: 1 }} onClick={() => {
                        if (confirm(`Supprimer "${collab.name}" ?`)) {
                          setCollaborateurs(collaborateurs.filter(c => c.id !== collab.id));
                          setToast({ type: "success", message: `Collaborateur "${collab.name}" supprimé` });
                        }
                      }}>Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="primary-btn" style={{ marginTop: "16px" }} onClick={() => {
                setEditingCollab(null);
                setCollabForm(defaultCollaborateurForm);
                setOpenCollabModal(true);
              }}>
                Ajouter un collaborateur
              </button>
            </div>
          </section>
        )}
      </div>

      {openAdminModal && (
        <div className="modal-overlay" onClick={() => setOpenAdminModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>{editingAdmin ? "Modifier Admin" : "Add New Admin"}</h3>
            <form onSubmit={submitAdmin} className="modal-form">
              <input
                placeholder="Full Name"
                value={adminForm.fullName}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
              <input
                placeholder="Email"
                value={adminForm.email}
                disabled={Boolean(editingAdmin)}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, email: event.target.value }))}
              />
              {!editingAdmin && (
                <>
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminForm.password}
                    onChange={(event) => setAdminForm((prev) => ({ ...prev, password: event.target.value }))}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={adminForm.confirmPassword}
                    onChange={(event) => setAdminForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                  />
                </>
              )}
              <select
                value={adminForm.role}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option>Super Admin</option>
                <option>Admin</option>
              </select>
              <select
                value={adminForm.status}
                onChange={(event) => setAdminForm((prev) => ({ ...prev, status: event.target.value }))}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setOpenAdminModal(false)}>Annuler</button>
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {openCourseModal && (
        <div className="modal-overlay" onClick={() => setOpenCourseModal(false)}>
          <div className="modal large" onClick={(event) => event.stopPropagation()}>
            <h3>{editingCourse ? "Modifier formation" : "Add New Formation"}</h3>
            <form onSubmit={submitCourse} className="modal-form">
              <input
                placeholder="Title"
                value={courseForm.title}
                onChange={(event) => setCourseForm((prev) => ({ ...prev, title: event.target.value }))}
              />
              <div className="grid-2">
                <select
                  value={courseForm.category}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, category: event.target.value }))}
                >
                  {FORMATION_CATEGORY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Instructor Name"
                  value={courseForm.instructor}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, instructor: event.target.value }))}
                />
                <input
                  placeholder="Duration"
                  value={courseForm.duration}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, duration: event.target.value }))}
                />
                <select
                  value={courseForm.level}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, level: event.target.value }))}
                >
                  {FORMATION_LEVEL_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  value={courseForm.mode}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, mode: event.target.value }))}
                >
                  {FORMATION_MODE_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Price"
                  value={courseForm.price}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, price: event.target.value }))}
                />
                <textarea
                  placeholder="Description"
                  value={courseForm.description}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, description: event.target.value }))}
                />
                <textarea
                  placeholder="Cours / leçons initiaux (une ligne par cours)"
                  value={courseForm.coursesText}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, coursesText: event.target.value }))}
                />
                <select
                  value={courseForm.status}
                  onChange={(event) => setCourseForm((prev) => ({ ...prev, status: event.target.value }))}
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setOpenCourseModal(false)}>Annuler</button>
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Logiciel */}
      {openLogicielModal && (
        <div className="modal-overlay" onClick={() => setOpenLogicielModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>{editingLogiciel !== null ? "Modifier Logiciel" : "Ajouter Logiciel"}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingLogiciel !== null) {
                const updated = [...logiciels];
                updated[editingLogiciel] = {
                  ...logicielForm,
                  feats: logicielForm.feats.split("\n").filter(f => f.trim()),
                };
                setLogiciels(updated);
                setToast({ type: "success", message: "Logiciel modifié" });
              } else {
                setLogiciels([...logiciels, {
                  ...logicielForm,
                  feats: logicielForm.feats.split("\n").filter(f => f.trim()),
                }]);
                setToast({ type: "success", message: "Logiciel ajouté" });
              }
              setOpenLogicielModal(false);
              setLogicielForm(defaultLogicielForm);
            }} className="modal-form">
              <input
                placeholder="Titre du logiciel"
                value={logicielForm.title}
                onChange={(e) => setLogicielForm({...logicielForm, title: e.target.value})}
                required
              />
              <input
                placeholder="Icône (ex: fa-software)"
                value={logicielForm.ico}
                onChange={(e) => setLogicielForm({...logicielForm, ico: e.target.value})}
              />
              <input
                placeholder="Gradient CSS (ex: linear-gradient(135deg,#2563EB,#4F46E5))"
                value={logicielForm.grad}
                onChange={(e) => setLogicielForm({...logicielForm, grad: e.target.value})}
              />
              <textarea
                placeholder="Description"
                value={logicielForm.desc}
                onChange={(e) => setLogicielForm({...logicielForm, desc: e.target.value})}
                required
              />
              <textarea
                placeholder="Fonctionnalités (une par ligne)"
                value={logicielForm.feats}
                onChange={(e) => setLogicielForm({...logicielForm, feats: e.target.value})}
              />
              <input
                placeholder="Prix (ex: 120 000 DA ou Sur devis)"
                value={logicielForm.price}
                onChange={(e) => setLogicielForm({...logicielForm, price: e.target.value})}
              />
              <input
                placeholder="Sous-titre prix (ex: / an - licence)"
                value={logicielForm.priceSub}
                onChange={(e) => setLogicielForm({...logicielForm, priceSub: e.target.value})}
              />
              <select
                value={logicielForm.priceType}
                onChange={(e) => setLogicielForm({...logicielForm, priceType: e.target.value})}
              >
                <option value="paid">Payant</option>
                <option value="contact">Sur devis</option>
                <option value="free">Gratuit</option>
              </select>
              <div className="modal-actions">
                <button type="button" onClick={() => setOpenLogicielModal(false)}>Annuler</button>
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Collaborateur */}
      {openCollabModal && (
        <div className="modal-overlay" onClick={() => setOpenCollabModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <h3>{editingCollab ? "Modifier Collaborateur" : "Ajouter Collaborateur"}</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingCollab) {
                setCollaborateurs(collaborateurs.map(c => 
                  c.id === editingCollab ? {...c, ...collabForm} : c
                ));
                setToast({ type: "success", message: "Collaborateur modifié" });
              } else {
                setCollaborateurs([...collaborateurs, {
                  id: Date.now().toString(),
                  ...collabForm,
                }]);
                setToast({ type: "success", message: "Collaborateur ajouté" });
              }
              setOpenCollabModal(false);
              setCollabForm(defaultCollaborateurForm);
            }} className="modal-form">
              <input
                placeholder="Nom complet"
                value={collabForm.name}
                onChange={(e) => setCollabForm({...collabForm, name: e.target.value})}
                required
              />
              <input
                placeholder="Rôle/Titre"
                value={collabForm.role}
                onChange={(e) => setCollabForm({...collabForm, role: e.target.value})}
                required
              />
              <textarea
                placeholder="Biographie"
                value={collabForm.bio}
                onChange={(e) => setCollabForm({...collabForm, bio: e.target.value})}
                required
              />
              <input
                placeholder="Avatar (initiales, ex: HN)"
                value={collabForm.avatar}
                onChange={(e) => setCollabForm({...collabForm, avatar: e.target.value})}
                maxLength="2"
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setOpenCollabModal(false)}>Annuler</button>
                <button type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  );
}
