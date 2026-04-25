import cors from "cors";
import express from "express";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import bcrypt from "bcryptjs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { parse as parseCsv } from "csv-parse/sync";
import * as XLSX from "xlsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT_DIR, "server", "data");
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");
const DB_PATH = path.join(DATA_DIR, "db.json");

const app = express();
const PORT = Number(process.env.PORT || 8787);

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_CHAT_EXT = [".pdf", ".docx", ".txt", ".csv", ".xlsx", ".png", ".jpg", ".jpeg"];
const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMIN_EMAILS || "admin@smart-archives.dz")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const defaults = {
  admins: [
    {
      id: "admin-root",
      name: "Super Admin",
      email: SUPER_ADMIN_EMAILS[0] || "admin@smart-archives.dz",
      role: "Super Admin",
      status: "Active",
      passwordHash: bcrypt.hashSync("admin123", 10),
      createdAt: new Date().toISOString(),
    },
  ],
  courses: [],
};

const db = new Low(new JSONFile(DB_PATH), defaults);

async function ensureSetup() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await db.read();
  db.data ||= defaults;
  db.data.admins ||= defaults.admins;
  db.data.courses ||= [];
  await db.write();
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function sanitizeAdmin(admin) {
  const { passwordHash, ...safe } = admin;
  return safe;
}

function getRequester(req) {
  return {
    email: (req.header("x-user-email") || "").toLowerCase(),
    role: req.header("x-user-role") || "Admin",
  };
}

function requireSuperAdmin(req, res, next) {
  const requester = getRequester(req);
  if (requester.role !== "Super Admin") {
    res.status(403).json({ message: "Action réservée au Super Admin." });
    return;
  }
  next();
}

function rowsToMarkdownTable(rows, maxRows = 8) {
  if (!rows.length) return "Aucune donnée tabulaire détectée.";
  const headers = Object.keys(rows[0] || {});
  if (!headers.length) return "Aucune colonne détectée.";

  const head = `| ${headers.join(" | ")} |`;
  const sep = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.slice(0, maxRows).map((row) => {
    const cells = headers.map((h) => String(row[h] ?? "").replace(/\|/g, "\\|"));
    return `| ${cells.join(" | ")} |`;
  });

  return [head, sep, ...body].join("\n");
}

async function extractFileContent(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_CHAT_EXT.includes(ext)) {
    throw new Error("Type de fichier non supporté.");
  }

  const meta = {
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
    sizeLabel: formatBytes(file.size),
    extension: ext,
  };

  if (ext === ".pdf") {
    const parsed = await pdfParse(file.buffer);
    const text = (parsed.text || "").trim();
    if (!text) throw new Error("Impossible d'extraire le texte du PDF.");
    return {
      fileMeta: meta,
      extractedText: text.slice(0, 12000),
      aiContext: `Contenu extrait du PDF ${meta.name}:\n${text.slice(0, 12000)}`,
    };
  }

  if (ext === ".docx") {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    const text = (parsed.value || "").trim();
    if (!text) throw new Error("Impossible d'extraire le texte du DOCX.");
    return {
      fileMeta: meta,
      extractedText: text.slice(0, 12000),
      aiContext: `Contenu extrait du DOCX ${meta.name}:\n${text.slice(0, 12000)}`,
    };
  }

  if (ext === ".txt") {
    const text = file.buffer.toString("utf-8").trim();
    if (!text) throw new Error("Le fichier TXT est vide.");
    return {
      fileMeta: meta,
      extractedText: text.slice(0, 12000),
      aiContext: `Contenu du fichier TXT ${meta.name}:\n${text.slice(0, 12000)}`,
    };
  }

  if (ext === ".csv") {
    const records = parseCsv(file.buffer.toString("utf-8"), {
      columns: true,
      skip_empty_lines: true,
    });
    const markdown = rowsToMarkdownTable(records);
    return {
      fileMeta: meta,
      extractedText: markdown,
      aiContext: `Tableau CSV extrait depuis ${meta.name}:\n${markdown}`,
    };
  }

  if (ext === ".xlsx") {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "" });
    const markdown = rowsToMarkdownTable(rows);
    return {
      fileMeta: meta,
      extractedText: markdown,
      aiContext: `Tableau XLSX extrait depuis ${meta.name}:\n${markdown}`,
    };
  }

  if ([".png", ".jpg", ".jpeg"].includes(ext)) {
    const imageSummary = `Image reçue: ${meta.name} (${meta.sizeLabel}). Analyse visuelle non activée côté serveur, utilisez le nom du fichier et la demande utilisateur.`;
    return {
      fileMeta: meta,
      extractedText: imageSummary,
      aiContext: imageSummary,
    };
  }

  throw new Error("Type de fichier non supporté.");
}

const chatUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

const courseUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9._-]/g, "");
      cb(null, `${Date.now()}-${safeName}`);
    },
  }),
  limits: { fileSize: MAX_FILE_SIZE },
});

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/chat/process-file", chatUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Aucun fichier reçu." });
      return;
    }

    const payload = await extractFileContent(req.file);
    res.json(payload);
  } catch (error) {
    const message = String(error?.message || "Echec du traitement du fichier.");
    const status = message.toLowerCase().includes("support") ? 415 : 422;
    res.status(status).json({ message });
  }
});

app.get("/api/admin/admins", async (_req, res) => {
  await db.read();
  const admins = db.data.admins.map(sanitizeAdmin);
  res.json(admins);
});

app.post("/api/admin/admins", requireSuperAdmin, async (req, res) => {
  await db.read();
  const { fullName, email, password, role, status } = req.body || {};

  if (!fullName || !email || !password || !role || !status) {
    res.status(400).json({ message: "Tous les champs admin sont obligatoires." });
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (db.data.admins.some((admin) => admin.email === normalizedEmail)) {
    res.status(409).json({ message: "Cet email admin existe déjà." });
    return;
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const newAdmin = {
    id: `adm-${Date.now()}`,
    name: String(fullName).trim(),
    email: normalizedEmail,
    passwordHash,
    role,
    status,
    createdAt: new Date().toISOString(),
  };

  db.data.admins.unshift(newAdmin);
  await db.write();
  res.status(201).json(sanitizeAdmin(newAdmin));
});

app.patch("/api/admin/admins/:id", requireSuperAdmin, async (req, res) => {
  await db.read();
  const { id } = req.params;
  const index = db.data.admins.findIndex((admin) => admin.id === id);
  if (index < 0) {
    res.status(404).json({ message: "Admin introuvable." });
    return;
  }

  const target = db.data.admins[index];
  const next = {
    ...target,
    name: req.body?.fullName ?? target.name,
    role: req.body?.role ?? target.role,
    status: req.body?.status ?? target.status,
  };

  db.data.admins[index] = next;
  await db.write();
  res.json(sanitizeAdmin(next));
});

app.delete("/api/admin/admins/:id", requireSuperAdmin, async (req, res) => {
  await db.read();
  const requester = getRequester(req);
  const target = db.data.admins.find((admin) => admin.id === req.params.id);

  if (!target) {
    res.status(404).json({ message: "Admin introuvable." });
    return;
  }

  if (target.email === requester.email) {
    res.status(400).json({ message: "Suppression de votre propre compte interdite." });
    return;
  }

  db.data.admins = db.data.admins.filter((admin) => admin.id !== req.params.id);
  await db.write();
  res.json({ ok: true });
});

app.get("/api/admin/courses", async (req, res) => {
  await db.read();
  const q = String(req.query.q || "").toLowerCase();
  const category = String(req.query.category || "all");
  const status = String(req.query.status || "all");

  const items = db.data.courses.filter((course) => {
    const qMatch = !q || `${course.title} ${course.instructor}`.toLowerCase().includes(q);
    const catMatch = category === "all" || course.category === category;
    const statusMatch = status === "all" || course.status === status;
    return qMatch && catMatch && statusMatch;
  });

  res.json(items);
});

app.post("/api/admin/courses", courseUpload.single("thumbnail"), async (req, res) => {
  await db.read();
  const payload = JSON.parse(req.body.payload || "{}");

  if (!payload.title || !payload.category || !payload.instructor || !payload.level || !payload.status) {
    res.status(400).json({ message: "Les champs essentiels du cours sont obligatoires." });
    return;
  }

  const thumbnailUrl = req.file ? `/uploads/${req.file.filename}` : payload.thumbnailUrl || "";
  const now = new Date().toISOString();
  const item = {
    id: `course-${Date.now()}`,
    ...payload,
    thumbnailUrl,
    createdAt: now,
    updatedAt: now,
  };

  db.data.courses.unshift(item);
  await db.write();
  res.status(201).json(item);
});

app.put("/api/admin/courses/:id", courseUpload.single("thumbnail"), async (req, res) => {
  await db.read();
  const idx = db.data.courses.findIndex((course) => course.id === req.params.id);
  if (idx < 0) {
    res.status(404).json({ message: "Cours introuvable." });
    return;
  }

  const payload = JSON.parse(req.body.payload || "{}");
  const current = db.data.courses[idx];
  const thumbnailUrl = req.file ? `/uploads/${req.file.filename}` : payload.thumbnailUrl || current.thumbnailUrl || "";

  const next = {
    ...current,
    ...payload,
    thumbnailUrl,
    updatedAt: new Date().toISOString(),
  };

  db.data.courses[idx] = next;
  await db.write();
  res.json(next);
});

app.delete("/api/admin/courses/:id", async (req, res) => {
  await db.read();
  const target = db.data.courses.find((course) => course.id === req.params.id);
  if (!target) {
    res.status(404).json({ message: "Cours introuvable." });
    return;
  }

  db.data.courses = db.data.courses.filter((course) => course.id !== req.params.id);
  await db.write();
  res.json({ ok: true });
});

ensureSetup()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to start API server", error);
    process.exit(1);
  });
