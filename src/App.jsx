import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { retrieveRagContext, buildRagSystemPrompt } from './rag/useRag.js';
import * as XLSX from "xlsx";
import { BtnP } from "./pages/pageUi";
import PageHome from "./pages/HomePage";
import PageServices from "./pages/ServicesPage";
import PageFormations from "./pages/FormationsPage";
import PageLogiciels from "./pages/LogicielsPage";
import PageContact from "./pages/ContactPage";
import StudentPortalPage from "./pages/StudentPortalPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { FORMATIONS, FORMATION_CATEGORY_OPTIONS, FORMATION_LEVEL_OPTIONS, FORMATION_MODE_OPTIONS } from "./pages/pageData";
import {
  isFirebaseAuthConfigured,
  signInWithGoogle,
  signOutGoogle,
  watchAuthState,
} from "./firebaseAuth";

/* ═══════════════════════════════════════════
   GLOBAL STYLES (injected once)
═══════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=Inter:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }

.sa-root {
  --blue: #2563EB; --indigo: #4F46E5; --cyan: #0EA5E9;
  --green: #10B981; --amber: #F59E0B; --red: #EF4444; --violet: #8B5CF6;
  --grad: linear-gradient(135deg, #2563EB, #4F46E5);
  --grad2: linear-gradient(135deg, #0EA5E9, #2563EB);
  --content-max: 1180px;
  --content-wide: 1260px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  isolation: isolate;
  transition: background 0.5s ease, color 0.4s ease;
}

/* ── LIGHT ── */
.sa-root.light {
  --bg: #F7FAFF; --bg2: #FFFFFF; --bg3: #EEF3FF;
  --border: #DDE3F5; --border2: #C4CEEE;
  --t1: #0A0F2C; --t2: #3D4D6A; --t3: #8494B2;
  --blue-bg: rgba(37,99,235,.07); --green-bg: rgba(16,185,129,.08);
  --amber-bg: rgba(245,158,11,.08); --red-bg: rgba(239,68,68,.08); --violet-bg: rgba(139,92,246,.08);
  --s1: 0 1px 4px rgba(37,99,235,.06), 0 1px 2px rgba(0,0,0,.04);
  --s2: 0 4px 16px rgba(37,99,235,.08), 0 1px 3px rgba(0,0,0,.04);
  --s3: 0 8px 32px rgba(37,99,235,.10), 0 2px 8px rgba(0,0,0,.04);
  --s4: 0 20px 60px rgba(37,99,235,.13);
  --sb: 0 8px 28px rgba(37,99,235,.32);
  background:
    radial-gradient(ellipse 120% 74% at 50% -14%, rgba(79,70,229,.13), transparent 60%),
    radial-gradient(ellipse 90% 62% at 6% 94%, rgba(14,165,233,.11), transparent 68%),
    linear-gradient(165deg, #ffffff 0%, #f4f8ff 50%, #edf3ff 100%);
  color: var(--t1);
}

/* ── DARK ── */
.sa-root.dark {
  --bg: #070C18; --bg2: #0D1425; --bg3: #111C30;
  --border: rgba(255,255,255,.07); --border2: rgba(255,255,255,.13);
  --t1: #F1F5F9; --t2: #8B9DB5; --t3: #4B5E75;
  --blue-bg: rgba(37,99,235,.14); --green-bg: rgba(16,185,129,.12);
  --amber-bg: rgba(245,158,11,.12); --red-bg: rgba(239,68,68,.12); --violet-bg: rgba(139,92,246,.12);
  --s1: 0 1px 3px rgba(0,0,0,.3); --s2: 0 4px 16px rgba(0,0,0,.35);
  --s3: 0 8px 32px rgba(0,0,0,.45); --s4: 0 20px 60px rgba(0,0,0,.6);
  --sb: 0 8px 28px rgba(37,99,235,.4);
  background: var(--bg); color: var(--t1);
}

h1,h2,h3,h4,h5 { font-family: 'Bricolage Grotesque', sans-serif; line-height: 1.12; }

/* scrollbar */
.sa-root ::-webkit-scrollbar { width: 4px; }
.sa-root ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

/* ── GLOBAL AMBIENCE ── */
.sa-root::before,
.sa-root::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
.sa-root::before {
  opacity: .9;
  transition: opacity .4s ease;
}
.sa-root.light::before {
  background:
    radial-gradient(ellipse 44% 32% at 80% 10%, rgba(79,70,229,.14), transparent 74%),
    radial-gradient(ellipse 30% 26% at 18% 86%, rgba(14,165,233,.12), transparent 70%),
    radial-gradient(ellipse 24% 18% at 8% 16%, rgba(37,99,235,.09), transparent 70%);
}
.sa-root.dark::before {
  background:
    radial-gradient(ellipse 52% 42% at 82% 8%, rgba(79,70,229,.22), transparent 70%),
    radial-gradient(ellipse 38% 30% at 14% 86%, rgba(14,165,233,.12), transparent 72%),
    radial-gradient(ellipse 30% 22% at 50% 35%, rgba(37,99,235,.10), transparent 76%);
}
.sa-root::after {
  background-image: radial-gradient(rgba(125,145,188,.12) .6px, transparent .6px);
  background-size: 4px 4px;
  opacity: .15;
  mix-blend-mode: soft-light;
}

/* ── CANVAS BG (Three.js cubes) ── */
.sa-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  display: block;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 18%, black 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 18%, black 100%);
}
.sa-root.dark .sa-canvas { opacity: .95; }
.sa-root.light .sa-canvas { opacity: .46; }

/* ── CSS ROTATING CUBES (fallback + decoration) ── */
.sa-cube-fx {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  perspective: 1000px;
  overflow: hidden;
}
.sa-cube-fx-w {
  position: absolute;
  transform-style: preserve-3d;
}
.sa-cube-fx-i {
  --size: 84px;
  position: relative;
  width: var(--size);
  height: var(--size);
  border-radius: 12px;
  transform-style: preserve-3d;
  opacity: .68;
  animation: cubeFxRotate 13s linear infinite;
}
.sa-cube-fx-i,
.sa-cube-fx-i::before,
.sa-cube-fx-i::after {
  border: 1px solid rgba(79,70,229,.24);
  background: linear-gradient(155deg, rgba(255,255,255,.95), rgba(220,231,255,.8));
  box-shadow: 0 12px 28px rgba(37,99,235,.18);
}
.sa-cube-fx-i::before,
.sa-cube-fx-i::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
}
.sa-cube-fx-i::before {
  transform: rotateY(90deg) translateZ(calc(var(--size) / 2));
  filter: brightness(.9);
}
.sa-cube-fx-i::after {
  transform: rotateX(90deg) translateZ(calc(var(--size) / 2));
  filter: brightness(1.05);
}
.sa-root.dark .sa-cube-fx-i,
.sa-root.dark .sa-cube-fx-i::before,
.sa-root.dark .sa-cube-fx-i::after {
  border-color: rgba(129,140,248,.32);
  background: linear-gradient(155deg, rgba(13,20,37,.9), rgba(35,45,72,.74));
  box-shadow: 0 12px 28px rgba(0,0,0,.38);
}
.sa-cube-fx-w.c1 { top: 14%; left: 5%; animation: cubeFxDriftA 9.4s ease-in-out infinite; }
.sa-cube-fx-w.c1 .sa-cube-fx-i { --size: 120px; animation-duration: 16s; }
.sa-cube-fx-w.c2 { top: 62%; left: 12%; animation: cubeFxDriftB 10.8s ease-in-out infinite; }
.sa-cube-fx-w.c2 .sa-cube-fx-i { --size: 82px; animation-duration: 11.6s; }
.sa-cube-fx-w.c3 { top: 24%; left: 34%; animation: cubeFxDriftC 11.2s ease-in-out infinite; }
.sa-cube-fx-w.c3 .sa-cube-fx-i { --size: 66px; animation-duration: 9.8s; }
.sa-cube-fx-w.c4 { top: 12%; right: 8%; animation: cubeFxDriftA 10.2s ease-in-out infinite; }
.sa-cube-fx-w.c4 .sa-cube-fx-i { --size: 98px; animation-duration: 14.2s; }
.sa-cube-fx-w.c5 { top: 48%; right: 20%; animation: cubeFxDriftB 9.6s ease-in-out infinite; }
.sa-cube-fx-w.c5 .sa-cube-fx-i { --size: 74px; animation-duration: 10.8s; }
.sa-cube-fx-w.c6 { bottom: 8%; right: 6%; animation: cubeFxDriftC 11.4s ease-in-out infinite; }
.sa-cube-fx-w.c6 .sa-cube-fx-i { --size: 110px; animation-duration: 17.2s; }
@media(max-width:900px){
  .sa-cube-fx-w.c5,
  .sa-cube-fx-w.c6 { display:none; }
  .sa-cube-fx-i { opacity:.52; }
}



.sa-bg-grid {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background-image: linear-gradient(var(--border) 1px, transparent 1px),
                    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 100% 100% at 50% 0%, black 0%, transparent 75%);
  opacity: 0.3; transition: opacity .5s;
}
.sa-root.dark .sa-bg-grid { opacity: .12; }

/* ── ORBS (light mode only, left side) ── */
.sa-orb {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
  filter: blur(80px); opacity: 0; transition: opacity .6s;
}
.sa-root.light .sa-orb { opacity: 1; }
.sa-orb1 { width:600px;height:600px; background:radial-gradient(circle,rgba(37,99,235,.18) 0%,transparent 70%); top:-200px;left:-150px; animation: orbDrift1 18s ease-in-out infinite; }
.sa-orb2 { width:400px;height:400px; background:radial-gradient(circle,rgba(79,70,229,.12) 0%,transparent 70%); top:30%;left:5%; animation: orbDrift2 22s ease-in-out infinite; }
.sa-orb3 { width:350px;height:350px; background:radial-gradient(circle,rgba(14,165,233,.10) 0%,transparent 70%); bottom:15%;left:15%; animation: orbDrift3 26s ease-in-out infinite; }
.sa-orb4 { width:300px;height:300px; background:radial-gradient(circle,rgba(139,92,246,.08) 0%,transparent 70%); bottom:35%;left:35%; animation: orbDrift4 20s ease-in-out infinite; }

@keyframes orbDrift1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,60px) scale(1.1)}66%{transform:translate(-40px,80px) scale(.95)}}
@keyframes orbDrift2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-60px,80px) scale(1.05)}66%{transform:translate(40px,-60px) scale(1.1)}}
@keyframes orbDrift3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(60px,-40px) scale(1.08)}}
@keyframes orbDrift4{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,50px) scale(.92)}}

/* ── ORBS ── */
.sa-orb {
  position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
  filter: blur(80px); opacity: 0; transition: opacity .6s;
}



/* ── NAVBAR ── */
.sa-nav {
  position: fixed; top: 12px; left: 50%; transform: translateX(-50%); z-index: 900;
  width: calc(100% - 40px); max-width: 1160px; height: 58px;
  display: flex; align-items: center; padding: 0 20px;
  border-radius: 16px; border: 1px solid rgba(255,255,255,.9);
  backdrop-filter: blur(24px) saturate(180%);
  overflow: hidden;
  transition: all .4s cubic-bezier(.4,0,.2,1);
}
.sa-root.light .sa-nav { background: rgba(255,255,255,.8); box-shadow: 0 8px 32px rgba(37,99,235,.10), 0 0 0 1px rgba(37,99,235,.06); border-color: rgba(255,255,255,.95); }
.sa-root.dark  .sa-nav { background: rgba(13,20,37,.85); border-color: rgba(255,255,255,.07); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
.sa-nav.scrolled { top: 0; width: 100%; max-width: 100%; border-radius: 0; border-left: none; border-right: none; border-top: none; backdrop-filter: blur(18px) saturate(165%); }
.sa-nav::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(118deg, rgba(255,255,255,.55) 0%, rgba(255,255,255,.08) 30%, transparent 62%);
  pointer-events: none;
}
.sa-root.dark .sa-nav::before { background: linear-gradient(118deg, rgba(148,163,255,.12) 0%, transparent 65%); }
.sa-nav::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(37,99,235,.5), rgba(79,70,229,.45), transparent);
  pointer-events: none;
  opacity: .65;
}
.sa-nav > * { position: relative; z-index: 1; }

.sa-logo { display:flex; align-items:center; gap:10px; background:none; border:none; cursor:pointer; flex-shrink:0; margin-right: 8px; }
.sa-logo-ring {
  width:36px; height:36px; border-radius:10px; background: var(--grad);
  display:flex; align-items:center; justify-content:center;
  font-family:'Bricolage Grotesque',sans-serif; font-size:13px; font-weight:800; color:#fff;
  box-shadow: var(--sb); position:relative; flex-shrink:0;
}
.sa-logo-ring::after { content:'✦'; position:absolute; top:-4px; right:-4px; font-size:8px; color:#F59E0B; }
.sa-logo-txt { display:flex; flex-direction:column; line-height:1.1; }
.sa-logo-txt b { font-family:'Bricolage Grotesque',sans-serif; font-size:14px; font-weight:800; color:var(--t1); }
.sa-logo-txt span { font-size:9.5px; color:var(--blue); font-weight:600; letter-spacing:.6px; text-transform:uppercase; }

/* nav divider */
.sa-nav-divider { width:1px; height:24px; background:var(--border); margin: 0 12px; flex-shrink:0; }

.sa-nav-links { display:flex; align-items:center; gap:2px; flex:1; justify-content:center; }
.sa-nl { padding:7px 13px; border-radius:9px; font-size:14px; font-weight:500; color:var(--t2); background:none; border:none; cursor:pointer; transition:all .2s; white-space:nowrap; font-family:'Inter',sans-serif; }
.sa-nl:hover { background:var(--bg3); color:var(--t1); }
.sa-nl.on { color:var(--blue); background:var(--blue-bg); font-weight:600; }

.sa-nav-right { display:flex; align-items:center; gap:8px; flex-shrink:0; margin-left:8px; }
.sa-btn-ghost {
  width:36px; height:36px; border-radius:9px; background:var(--bg3); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center; font-size:14px; color:var(--t2);
  cursor:pointer; transition:all .2s; flex-shrink:0;
}
.sa-btn-ghost:hover { border-color:var(--blue); color:var(--blue); transform:scale(1.05); }
.sa-btn-auth {
  height:36px; padding:0 14px; border-radius:9px;
  background:var(--bg2); border:1px solid var(--border);
  color:var(--t1); font-size:13.5px; font-weight:600;
  display:flex; align-items:center; gap:7px;
  cursor:pointer; transition:all .2s ease; white-space:nowrap; font-family:'Inter',sans-serif;
}
.sa-btn-auth:hover { border-color:var(--blue); color:var(--blue); transform:translateY(-1px); box-shadow:var(--s2); }
.sa-user-chip {
  height: 36px;
  max-width: 170px;
  padding: 0 12px;
  border-radius: 9px;
  background: var(--blue-bg);
  border: 1px solid rgba(37,99,235,.26);
  color: var(--blue);
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sa-btn-cta {
  height:36px; padding:0 16px; background:var(--grad); border:none; border-radius:9px;
  color:#fff; font-size:14px; font-weight:600; display:flex; align-items:center; gap:6px;
  box-shadow:var(--sb); cursor:pointer; transition:all .25s cubic-bezier(.4,0,.2,1); white-space:nowrap; font-family:'Inter',sans-serif;
  flex-shrink:0;
}
.sa-btn-cta:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(37,99,235,.38); }

/* ── PAGES ── */
.sa-page { display:none; padding-top:64px; position:relative; z-index:1; min-height:100vh; }
.sa-page.on { display:block; }

/* ── STUDENT SPACE ── */
.sa-student-wrap { padding-top: 36px; }
.sa-student-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}
.sa-student-panel {
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
  background: var(--bg2);
  box-shadow: var(--s2);
}
.sa-student-panel h3 {
  font-size: 19px;
  color: var(--t1);
  margin-bottom: 4px;
}
.sa-student-muted {
  font-size: 13px;
  color: var(--t3);
  margin-bottom: 12px;
}
.sa-student-list {
  display: grid;
  gap: 10px;
}
.sa-student-item {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg3);
  padding: 12px;
  text-align: left;
  display: grid;
  gap: 6px;
  cursor: pointer;
  transition: all .2s;
}
.sa-student-item:hover,
.sa-student-item.on {
  border-color: rgba(37,99,235,.32);
  box-shadow: var(--s2);
}
.sa-course-list {
  list-style: none;
  display: grid;
  gap: 9px;
}
.sa-course-list li {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg3);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.sa-course-list .st {
  font-size: 11px;
  border-radius: 20px;
  padding: 4px 9px;
}
.sa-course-list .st.ok { background: var(--green-bg); color: var(--green); }
.sa-course-list .st.run { background: var(--amber-bg); color: var(--amber); }
.sa-course-list .st.todo { background: var(--blue-bg); color: var(--blue); }
.sa-plan-table {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}
.sa-plan-row {
  display: grid;
  grid-template-columns: .8fr 1fr .6fr;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
  background: var(--bg3);
  font-size: 13px;
}
.sa-plan-row:last-child { border-bottom: none; }
.sa-plan-row b { color: var(--blue); }
.sa-cert-box {
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg3);
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.sa-cert-box small {
  display: block;
  margin-top: 4px;
  color: var(--t3);
}
.sa-cert-box .sa-btn-cta:disabled {
  opacity: .45;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}
.sa-conn-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sa-conn-grid > div {
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg3);
  padding: 10px 12px;
}
.sa-conn-grid label {
  display: block;
  font-size: 11px;
  color: var(--t3);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: .5px;
}
.sa-empty-student {
  border: 1px dashed var(--border2);
  border-radius: 14px;
  background: var(--bg2);
  padding: 30px;
  text-align: center;
  color: var(--t2);
}
@media(max-width:940px) {
  .sa-student-grid { grid-template-columns: 1fr; }
}
@media(max-width:600px) {
  .sa-conn-grid { grid-template-columns: 1fr; }
  .sa-cert-box { flex-direction: column; align-items: stretch; }
}

/* ── ADMIN DASHBOARD ── */
.sa-admin-wrap { padding-top: 30px; }
.sa-admin-welcome {
  border: 1px solid rgba(37,99,235,.3);
  background: linear-gradient(120deg, var(--blue-bg), rgba(79,70,229,.08));
  border-radius: 16px;
  padding: 18px 20px;
  margin-bottom: 16px;
}
.sa-admin-welcome h3 { font-size: 20px; color: var(--t1); margin-bottom: 4px; }
.sa-admin-welcome p { color: var(--t2); font-size: 14px; }
.sa-admin-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}
.sa-admin-stat {
  border: 1px solid var(--border);
  border-radius: 14px;
  background: var(--bg2);
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sa-admin-stat-ico {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--blue-bg);
  color: var(--blue);
}
.sa-admin-stat strong { display: block; color: var(--t1); font-size: 20px; }
.sa-admin-stat span { color: var(--t2); font-size: 12px; }
.sa-admin-stat.amber .sa-admin-stat-ico { background: var(--amber-bg); color: var(--amber); }
.sa-admin-stat.green .sa-admin-stat-ico { background: var(--green-bg); color: var(--green); }
.sa-admin-stat.violet .sa-admin-stat-ico { background: var(--violet-bg); color: var(--violet); }

.sa-admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.sa-admin-card {
  border: 1px solid var(--border);
  border-radius: 16px;
  background: var(--bg2);
  padding: 16px;
  box-shadow: var(--s2);
}
.sa-admin-card h3 { font-size: 18px; color: var(--t1); margin-bottom: 3px; }
.sa-admin-card p { font-size: 13px; color: var(--t3); margin-bottom: 10px; }
.sa-admin-list { display: grid; gap: 10px; max-height: 320px; overflow-y: auto; }
.sa-admin-item {
  border: 1px solid var(--border);
  border-radius: 11px;
  background: var(--bg3);
  padding: 10px 11px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.sa-admin-item strong { display: block; color: var(--t1); font-size: 14px; }
.sa-admin-item span { display: block; color: var(--t2); font-size: 12.5px; margin-top: 2px; }
.sa-admin-item small { display: block; color: var(--t3); font-size: 11.5px; margin-top: 3px; }
.sa-admin-actions { display: flex; gap: 6px; }
.sa-btn-mini {
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg2);
  color: var(--t1);
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.sa-btn-mini:disabled {
  opacity: .5;
  cursor: not-allowed;
}
.sa-btn-mini.ok { border-color: rgba(16,185,129,.35); color: var(--green); background: var(--green-bg); }
.sa-btn-mini.no { border-color: rgba(239,68,68,.35); color: var(--red); background: var(--red-bg); }
.sa-admin-inp {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 9px;
  background: var(--bg3);
  color: var(--t1);
  height: 38px;
  padding: 0 12px;
  outline: none;
}
.sa-admin-inp:focus {
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(37,99,235,.12);
}
.sa-admin-badge {
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
}
.sa-admin-badge.accepted { background: var(--green-bg); color: var(--green); }
.sa-admin-badge.rejected { background: var(--red-bg); color: var(--red); }
.sa-admin-empty {
  border: 1px dashed var(--border2);
  border-radius: 10px;
  background: var(--bg2);
  padding: 16px;
  text-align: center;
  color: var(--t2);
  font-size: 13px;
}
@media(max-width:980px) {
  .sa-admin-stats { grid-template-columns: 1fr 1fr; }
  .sa-admin-grid { grid-template-columns: 1fr; }
}
@media(max-width:520px) {
  .sa-admin-stats { grid-template-columns: 1fr; }
}

/* ── HERO ── */
.sa-hero {
  min-height: calc(100vh - 64px);
  max-width: min(var(--content-wide), calc(100% - 40px));
  margin: 22px auto 0;
  padding: clamp(34px, 4vw, 60px) clamp(20px, 4vw, 56px);
  border-radius: 30px;
  border: 1px solid var(--border);
  display:grid;
  grid-template-columns:minmax(0, 1.04fr) minmax(320px, .96fr);
  align-items:center;
  gap:clamp(24px, 4vw, 62px);
  justify-content:center;
  position:relative;
  overflow:hidden;
  isolation:isolate;
}
.sa-root.light .sa-hero {
  background: linear-gradient(165deg, rgba(255,255,255,.88), rgba(232,238,255,.84));
  box-shadow: 0 24px 70px rgba(37,99,235,.14), inset 0 1px 0 rgba(255,255,255,.8);
}
.sa-root.dark .sa-hero {
  border-color: rgba(255,255,255,.1);
  background: linear-gradient(160deg, rgba(8,13,28,.95), rgba(13,20,37,.9) 45%, rgba(20,21,56,.86));
  box-shadow: 0 28px 90px rgba(0,0,0,.55), 0 0 0 1px rgba(79,70,229,.12) inset;
}
.sa-hero::before {
  content: '';
  position: absolute;
  top: -28%;
  right: -10%;
  width:min(590px,100%);
  height:500px;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
  background:
    radial-gradient(ellipse 90% 82% at 76% 92%, rgba(79,70,229,.28), transparent 66%),
    radial-gradient(ellipse 58% 52% at 22% 18%, rgba(14,165,233,.20), transparent 72%);
}
.sa-root.dark .sa-hero::before {
  background:
    radial-gradient(ellipse 90% 82% at 78% 96%, rgba(124,58,237,.42), transparent 64%),
    radial-gradient(ellipse 60% 50% at 16% 14%, rgba(37,99,235,.24), transparent 72%);
}
.sa-hero::after {
  content:'';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 150px;
  background-image:linear-gradient(rgba(129,140,248,.15) 1px, transparent 1px),linear-gradient(90deg, rgba(129,140,248,.15) 1px, transparent 1px);
  background-size:30px 30px;
  mask-image:linear-gradient(180deg, transparent 0%, black 25%, black 100%);
  opacity:.26;
  box-shadow:0 24px 56px rgba(0,0,0,.5);
  pointer-events:none;
}

.sa-neo-visual-badge {
  position:absolute;
  top:2px;
  right:8px;
  height:30px;
  padding:0 11px;
  border-radius:999px;
  border:1px solid rgba(56,189,248,.35);
  color:#7DD3FC;
  background:rgba(6,30,47,.62);
  font-size:10.5px;
  font-weight:700;
  display:inline-flex;
  align-items:center;
  gap:6px;
  z-index:3;
  box-shadow:0 10px 22px rgba(0,0,0,.3);
  animation:neoPulseBadge 3s ease-in-out infinite;
}
.sa-cube-cloud::after {
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(120deg, transparent, rgba(255,255,255,.22), transparent);
  transform:translateX(-120%);
  animation:neoPanelSweep 7.2s linear infinite;
}
.sa-neo-beam {
  position:absolute;
  width:1px;
  top:8%;
  bottom:12%;
  background:linear-gradient(180deg, transparent, rgba(56,189,248,.65), transparent);
  filter:blur(.4px);
  opacity:.72;
}
.sa-neo-beam.b1 { left:26%; animation:neoBeamDrift 4.8s ease-in-out infinite; }
.sa-neo-beam.b2 { left:57%; animation:neoBeamDrift 6.2s ease-in-out infinite .5s; }
.sa-neo-beam.b3 { left:81%; animation:neoBeamDrift 5.6s ease-in-out infinite 1s; }

.sa-neo-particle {
  position:absolute;
  width:6px;
  height:6px;
  border-radius:50%;
  background:radial-gradient(circle, #E0E7FF 0%, rgba(224,231,255,0) 70%);
  box-shadow:0 0 16px rgba(129,140,248,.65);
  opacity:.85;
}
.sa-neo-particle.p1 { left:10%; top:22%; animation:neoParticleRise 7.5s ease-in-out infinite; }
.sa-neo-particle.p2 { left:28%; top:68%; animation:neoParticleRise 8.3s ease-in-out infinite .9s; }
.sa-neo-particle.p3 { left:42%; top:34%; animation:neoParticleRise 7.2s ease-in-out infinite 1.4s; }
.sa-neo-particle.p4 { left:64%; top:76%; animation:neoParticleRise 9s ease-in-out infinite .7s; }
.sa-neo-particle.p5 { left:72%; top:24%; animation:neoParticleRise 6.8s ease-in-out infinite .4s; }
.sa-neo-particle.p6 { left:88%; top:58%; animation:neoParticleRise 8.6s ease-in-out infinite 1.2s; }

.sa-hero-mesh {
  position:absolute; inset:0; z-index:0; pointer-events:none;
  animation: meshPulse 10s ease-in-out infinite;
}
.sa-root.light .sa-hero-mesh {
  background: radial-gradient(ellipse 55% 55% at 70% 25%,rgba(37,99,235,.14) 0%,transparent 65%),
              radial-gradient(ellipse 40% 40% at 12% 65%,rgba(79,70,229,.10) 0%,transparent 60%),
              radial-gradient(ellipse 30% 30% at 85% 80%,rgba(14,165,233,.09) 0%,transparent 60%);
}
.sa-root.dark .sa-hero-mesh {
  background: radial-gradient(ellipse 60% 50% at 70% 30%,rgba(37,99,235,.22) 0%,transparent 60%),
              radial-gradient(ellipse 40% 40% at 10% 70%,rgba(79,70,229,.15) 0%,transparent 55%),
              radial-gradient(ellipse 30% 30% at 85% 80%,rgba(14,165,233,.10) 0%,transparent 60%);
}
@keyframes meshPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.8;transform:scale(1.04)} }

.sa-hero-dots {
  position:absolute; inset:0; z-index:1; pointer-events:none;
  background-image: radial-gradient(circle, var(--border2) 1.5px, transparent 1.5px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse 80% 90% at 50% 50%, black, transparent);
  animation: dotsPulse 8s ease-in-out infinite;
}
@keyframes dotsPulse { 0%,100%{opacity:.55} 50%{opacity:.3} }
.sa-hero-line {
  position:absolute; bottom:0; left:0; right:0; height:1px; z-index:1; pointer-events:none;
  background: linear-gradient(90deg,transparent,rgba(37,99,235,.35) 30%,rgba(79,70,229,.45) 50%,rgba(37,99,235,.35) 70%,transparent);
  animation: lineGlow 4s ease-in-out infinite;
}
@keyframes lineGlow { 0%,100%{opacity:.5;transform:scaleX(.9)} 50%{opacity:1;transform:scaleX(1)} }

.sa-hero-inner { position:relative; z-index:2; max-width:610px; margin:0 auto; text-align:center; }
.sa-hero-pill {
  display:inline-flex; align-items:center; gap:8px; padding:5px 14px 5px 5px;
  background:rgba(255,255,255,.85); border:1px solid rgba(37,99,235,.2);
  border-radius:99px; margin:0 auto 24px;
  box-shadow: 0 2px 12px rgba(37,99,235,.12), 0 0 0 4px rgba(37,99,235,.04);
  backdrop-filter:blur(8px);
  animation: fadeUp .7s cubic-bezier(.4,0,.2,1) both, pillPop 3s 1.5s ease-in-out infinite;
}
.sa-root.dark .sa-hero-pill { background:rgba(13,20,37,.8); border-color:rgba(255,255,255,.1); box-shadow:0 4px 16px rgba(0,0,0,.3); }
@keyframes pillPop { 0%,100%{box-shadow:0 2px 12px rgba(37,99,235,.12),0 0 0 4px rgba(37,99,235,.04)} 50%{box-shadow:0 2px 20px rgba(37,99,235,.22),0 0 0 8px rgba(37,99,235,.07)} }
.sa-pill-dot { width:22px;height:22px;border-radius:99px;background:var(--grad);display:flex;align-items:center;justify-content:center;font-size:9px;color:#fff; }
.sa-hero-pill span { font-size:13.5px;font-weight:600;color:var(--t2); }
.sa-hero h1 { font-size:clamp(40px,6vw,72px); font-weight:800; color:var(--t1); margin-bottom:22px; animation:fadeUp .7s .08s cubic-bezier(.4,0,.2,1) both; }
.sa-hero h1 em { font-style:normal; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.sa-hero p { font-size:clamp(16px,1.6vw,19px); color:var(--t2); line-height:1.75; max-width:560px; margin:0 auto 34px; animation:fadeUp .7s .16s cubic-bezier(.4,0,.2,1) both; }
.sa-hero-btns { display:flex;justify-content:center;gap:12px;flex-wrap:wrap; animation:fadeUp .7s .24s cubic-bezier(.4,0,.2,1) both; }
.sa-btn-hero { height:48px;padding:0 26px;border-radius:12px;font-size:15px;font-weight:600;display:inline-flex;align-items:center;gap:8px;transition:all .25s cubic-bezier(.4,0,.2,1);border:none;cursor:pointer;font-family:'Inter',sans-serif; }
.sa-btn-hero.primary { background:var(--grad);color:#fff;box-shadow:var(--sb); }
.sa-btn-hero.primary:hover { transform:translateY(-2px);box-shadow:0 14px 40px rgba(37,99,235,.38); }
.sa-btn-hero.secondary { background:var(--bg2);color:var(--t1);border:1px solid var(--border);box-shadow:var(--s1); }
.sa-btn-hero.secondary:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-1px);box-shadow:var(--s2); }

/* Hero visual: rotating cube */
.sa-hero-visual {
  position:relative;
  right:auto;
  top:auto;
  transform:none;
  width:min(500px,100%);
  height:430px;
  z-index:2;
  animation:fadeLeft .9s .2s cubic-bezier(.4,0,.2,1) both;
  margin-inline:auto;
  justify-self:end;
}
.sa-hero-visual::before {
  content:'';
  position:absolute;
  inset:34px 26px 18px;
  border-radius:28px;
  border:1px solid rgba(79,70,229,.24);
  pointer-events:none;
}
.sa-root.light .sa-hero-visual::before {
  background: linear-gradient(160deg, rgba(255,255,255,.55), rgba(232,238,255,.2));
}
.sa-root.dark .sa-hero-visual::before {
  background: linear-gradient(160deg, rgba(79,70,229,.16), rgba(14,165,233,.03));
  border-color: rgba(129,140,248,.3);
}
.sa-hero-visual::after {
  content:'';
  position:absolute;
  left:18px;
  right:18px;
  bottom:0;
  height:120px;
  border-radius:24px;
  background: linear-gradient(180deg, rgba(79,70,229,.2), transparent 80%);
  filter: blur(18px);
  pointer-events:none;
}
.sa-cube-stage {
  --cube-size: 196px;
  position:absolute;
  inset:26px 20px 14px;
  display:flex;
  align-items:center;
  justify-content:center;
  perspective:1200px;
  transform-style:preserve-3d;
  animation:cubeFloat 5.4s ease-in-out infinite;
  isolation:isolate;
}
.sa-cube-shadow {
  position:absolute;
  width:calc(var(--cube-size) + 54px);
  height:56px;
  border-radius:50%;
  bottom:14px;
  background:radial-gradient(ellipse at center, rgba(37,99,235,.34), rgba(37,99,235,.04) 65%, transparent 80%);
  filter:blur(8px);
  z-index:1;
}
.sa-root.dark .sa-cube-shadow {
  background:radial-gradient(ellipse at center, rgba(79,70,229,.36), rgba(13,20,37,.08) 65%, transparent 82%);
}
.sa-cube {
  position:relative;
  width:var(--cube-size);
  height:var(--cube-size);
  transform-style:preserve-3d;
  animation:cubeRotate 16s linear infinite;
  z-index:3;
}
.sa-cube-face {
  position:absolute;
  inset:0;
  border-radius:18px;
  border:1px solid rgba(79,70,229,.22);
  background:linear-gradient(165deg, rgba(255,255,255,.95), rgba(228,236,255,.88));
  box-shadow:0 16px 36px rgba(20,22,45,.22);
  padding:16px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:4px;
  backface-visibility:hidden;
}
.sa-root.dark .sa-cube-face {
  background:linear-gradient(165deg, rgba(15,23,42,.96), rgba(30,41,59,.84));
  border-color:rgba(129,140,248,.34);
  box-shadow:0 16px 36px rgba(0,0,0,.45);
}
.sa-cube-face small {
  font-size:11px;
  font-weight:700;
  letter-spacing:.3px;
  text-transform:uppercase;
  color:var(--t2);
}
.sa-cube-face strong {
  font-family:'Bricolage Grotesque',sans-serif;
  font-size:30px;
  line-height:1;
  font-weight:800;
  background:var(--grad);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
}
.sa-cube-face span {
  font-size:12px;
  color:var(--t2);
  line-height:1.4;
}
.sa-cube-face-front  { transform:translateZ(calc(var(--cube-size) / 2)); }
.sa-cube-face-back   { transform:rotateY(180deg) translateZ(calc(var(--cube-size) / 2)); }
.sa-cube-face-right  { transform:rotateY(90deg) translateZ(calc(var(--cube-size) / 2)); }
.sa-cube-face-left   { transform:rotateY(-90deg) translateZ(calc(var(--cube-size) / 2)); }
.sa-cube-face-top    { transform:rotateX(90deg) translateZ(calc(var(--cube-size) / 2)); }
.sa-cube-face-bottom { transform:rotateX(-90deg) translateZ(calc(var(--cube-size) / 2)); }

.sa-cube-orbit {
  position:absolute;
  padding:7px 12px;
  border-radius:999px;
  font-size:11px;
  font-weight:700;
  display:inline-flex;
  align-items:center;
  gap:6px;
  border:1px solid rgba(37,99,235,.2);
  background:rgba(255,255,255,.86);
  color:var(--t2);
  box-shadow:0 8px 24px rgba(37,99,235,.16);
  z-index:4;
  white-space:nowrap;
}
.sa-root.dark .sa-cube-orbit {
  background:rgba(13,20,37,.85);
  border-color:rgba(129,140,248,.34);
  box-shadow:0 8px 24px rgba(0,0,0,.36);
}
.sa-cube-orbit i { color:var(--blue); }
.sa-cube-orbit-a { top:14%; left:4%; animation:cubeOrbitA 4.5s ease-in-out infinite; }
.sa-cube-orbit-b { top:23%; right:2%; animation:cubeOrbitB 4.8s ease-in-out infinite; }
.sa-cube-orbit-c { bottom:14%; left:14%; animation:cubeOrbitC 5.2s ease-in-out infinite; }

@media(max-width:1200px){
  .sa-hero{grid-template-columns:1fr;text-align:center;padding-top:84px;row-gap:30px;margin-top:14px}
  .sa-hero-inner{margin-inline:auto;text-align:center}
  .sa-hero-pill{margin:0 auto 24px}
  .sa-hero p{margin:0 auto 34px}
  .sa-hero-btns{justify-content:center}
  .sa-hero-visual{justify-self:center;width:min(440px,94%);height:390px}
  .sa-cube-stage{--cube-size:182px}
}
@media(max-width:680px){
  .sa-hero{width:calc(100% - 24px);border-radius:22px;padding:76px 16px 34px}
  .sa-hero-visual{width:min(350px,100%);height:332px}
  .sa-hero-visual::before{inset:30px 12px 18px}
  .sa-cube-stage{--cube-size:148px;inset:30px 8px 14px}
  .sa-cube-face{padding:12px;border-radius:14px}
  .sa-cube-face strong{font-size:24px}
  .sa-cube-face small{font-size:10px}
  .sa-cube-face span{font-size:11px}
  .sa-cube-orbit{font-size:10px;padding:6px 10px}
  .sa-cube-orbit-a{left:0}
  .sa-cube-orbit-b{right:0}
  .sa-cube-orbit-c{left:8%}
}

/* ── HERO NEO (reference style) ── */
.sa-hero-neo {
  min-height: 760px;
  padding-top: 102px;
  grid-template-columns: minmax(0, 1.04fr) minmax(360px, .96fr);
  align-items: end;
  border-color: rgba(129,140,248,.28);
}
.sa-root.light .sa-hero-neo,
.sa-root.dark .sa-hero-neo {
  background:
    radial-gradient(ellipse 92% 74% at 82% 94%, rgba(124,58,237,.43), transparent 64%),
    radial-gradient(ellipse 52% 44% at 16% 12%, rgba(79,70,229,.28), transparent 72%),
    linear-gradient(160deg, #040713 0%, #060a18 44%, #0a1127 100%);
  box-shadow: 0 34px 100px rgba(0,0,0,.66), 0 0 0 1px rgba(129,140,248,.18) inset;
}
.sa-hero-neo::before {
  background: radial-gradient(ellipse 56% 50% at 68% 78%, rgba(124,58,237,.42) 0%, transparent 68%);
  animation: neoBgDrift 14s ease-in-out infinite;
}
.sa-hero-neo::after {
  background:
    linear-gradient(180deg, rgba(124,58,237,.2), transparent 62%),
    radial-gradient(ellipse 80% 45% at 50% 100%, rgba(124,58,237,.22), transparent 70%);
  opacity:.55;
}

.sa-hero-neo .sa-hero-mesh {
  background:
    radial-gradient(ellipse 64% 56% at 72% 80%, rgba(124,58,237,.34) 0%, transparent 66%),
    radial-gradient(ellipse 38% 34% at 12% 20%, rgba(37,99,235,.24) 0%, transparent 68%);
}
.sa-hero-neo .sa-hero-dots {
  background-image: radial-gradient(circle, rgba(129,140,248,.42) 1px, transparent 1px);
  opacity:.34;
}
.sa-hero-neo .sa-hero-line { opacity:.48; }

.sa-neo-topnav {
  position:absolute;
  top:20px;
  left:50%;
  transform:translateX(-50%);
  height:46px;
  padding:4px;
  border-radius:999px;
  border:1px solid rgba(129,140,248,.34);
  background:rgba(9,13,27,.78);
  display:flex;
  align-items:center;
  gap:3px;
  z-index:3;
  box-shadow:0 12px 30px rgba(0,0,0,.4);
  backdrop-filter:blur(14px) saturate(165%);
  overflow:hidden;
}
.sa-neo-topnav::before {
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(118deg, rgba(129,140,248,.22) 0%, transparent 56%);
  pointer-events:none;
}
.sa-neo-topnav > * { position:relative; z-index:1; }
.sa-neo-navitem,
.sa-neo-navcta {
  height:34px;
  border-radius:999px;
  border:none;
  padding:0 14px;
  font-size:12px;
  font-weight:600;
  font-family:'Inter',sans-serif;
  cursor:pointer;
  transition:all .22s ease;
}
.sa-neo-navitem {
  color:#B8C5E2;
  background:transparent;
}
.sa-neo-navitem.on,
.sa-neo-navitem:hover {
  color:#F8FAFF;
  background:rgba(79,70,229,.28);
}
.sa-neo-navcta {
  color:#fff;
  background:linear-gradient(135deg,#7C3AED,#4F46E5);
  box-shadow:0 9px 24px rgba(99,102,241,.42);
}
.sa-neo-navcta:hover { transform:translateY(-1px); }

.sa-hero-neo .sa-hero-inner {
  text-align:left;
  margin:0;
  max-width:560px;
  z-index:2;
}
.sa-hero-neo .sa-hero-pill {
  margin:0 0 22px;
  background:rgba(9,13,27,.76);
  border-color:rgba(129,140,248,.36);
  box-shadow:0 6px 22px rgba(0,0,0,.3);
}
.sa-hero-neo .sa-hero-pill span { color:#B5C2E0; }
.sa-hero-neo h1 {
  color:#F7FAFF;
  font-size:clamp(42px,6vw,72px);
  line-height:1.01;
  letter-spacing:-.6px;
}
.sa-hero-neo p {
  color:#9AA9C8;
  max-width:530px;
  margin:0 0 22px;
}
.sa-hero-neo .sa-hero-leadform {
  width:min(470px,100%);
  height:50px;
  border-radius:12px;
  border:1px solid rgba(129,140,248,.3);
  background:rgba(9,13,27,.8);
  display:grid;
  grid-template-columns:1fr auto;
  align-items:center;
  padding:5px;
  gap:8px;
  box-shadow:0 14px 32px rgba(0,0,0,.36);
}
.sa-hero-neo .sa-hero-leadform input {
  height:100%;
  border:none;
  outline:none;
  border-radius:10px;
  padding:0 13px;
  font-size:14px;
  color:#E7EDFF;
  background:transparent;
}
.sa-hero-neo .sa-hero-leadform input::placeholder { color:#8293BA; }
.sa-hero-neo .sa-hero-leadform button {
  height:38px;
  border:none;
  border-radius:10px;
  padding:0 16px;
  font-size:12.5px;
  font-weight:700;
  color:#fff;
  background:linear-gradient(135deg,#7C3AED,#4F46E5);
  cursor:pointer;
  box-shadow:0 9px 24px rgba(99,102,241,.4);
  transition:transform .2s ease;
}
.sa-hero-neo .sa-hero-leadform button:hover { transform:translateY(-1px); }

.sa-neo-kpis {
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:10px;
  width:min(520px,100%);
  margin-top:14px;
}
.sa-neo-kpis > div {
  border-radius:12px;
  border:1px solid rgba(129,140,248,.25);
  background:rgba(10,16,32,.66);
  padding:10px 12px;
  backdrop-filter:blur(10px);
}
.sa-neo-kpis strong {
  display:block;
  font-family:'Bricolage Grotesque',sans-serif;
  font-size:20px;
  color:#F7FAFF;
  line-height:1;
  margin-bottom:4px;
}
.sa-neo-kpis span {
  font-size:11px;
  color:#9FB0D2;
  font-weight:600;
}

.sa-neo-kpis.sa-neo-kpis-single {
  grid-template-columns:minmax(0,1fr);
  width:min(220px,100%);
}

/* Light-mode fixes for Neo Hero */
.sa-root.light .sa-hero-neo {
  border-color: rgba(37,99,235,.16);
  background:
    radial-gradient(ellipse 84% 64% at 84% 90%, rgba(79,70,229,.22), transparent 68%),
    radial-gradient(ellipse 48% 42% at 14% 10%, rgba(14,165,233,.14), transparent 74%),
    linear-gradient(165deg, rgba(255,255,255,.95) 0%, rgba(243,248,255,.93) 50%, rgba(234,242,255,.9) 100%);
  box-shadow: 0 26px 64px rgba(37,99,235,.16), 0 0 0 1px rgba(255,255,255,.8) inset;
}
.sa-root.light .sa-hero-neo::before {
  background: radial-gradient(ellipse 58% 50% at 70% 80%, rgba(79,70,229,.22) 0%, transparent 70%);
}
.sa-root.light .sa-hero-neo::after {
  background:
    linear-gradient(180deg, rgba(79,70,229,.14), transparent 62%),
    radial-gradient(ellipse 80% 45% at 50% 100%, rgba(79,70,229,.14), transparent 70%);
  opacity:.38;
}
.sa-root.light .sa-hero-neo .sa-hero-mesh {
  background:
    radial-gradient(ellipse 62% 54% at 72% 80%, rgba(79,70,229,.22) 0%, transparent 66%),
    radial-gradient(ellipse 38% 34% at 12% 20%, rgba(37,99,235,.14) 0%, transparent 70%);
}
.sa-root.light .sa-hero-neo .sa-hero-dots {
  background-image: radial-gradient(circle, rgba(79,70,229,.28) 1px, transparent 1px);
  opacity:.2;
}
.sa-root.light .sa-neo-topnav {
  border-color: rgba(37,99,235,.18);
  background: rgba(255,255,255,.9);
  box-shadow: 0 12px 30px rgba(37,99,235,.14);
}
.sa-root.light .sa-neo-topnav::before {
  background: linear-gradient(118deg, rgba(79,70,229,.12) 0%, transparent 62%);
}
.sa-root.light .sa-neo-navitem { color:#4C5E82; }
.sa-root.light .sa-neo-navitem.on,
.sa-root.light .sa-neo-navitem:hover {
  color:#1F2B45;
  background: rgba(79,70,229,.14);
}
.sa-root.light .sa-hero-neo .sa-hero-pill {
  background: rgba(255,255,255,.94);
  border-color: rgba(37,99,235,.2);
  box-shadow: 0 6px 18px rgba(37,99,235,.12);
}
.sa-root.light .sa-hero-neo .sa-hero-pill span { color:var(--t2); }
.sa-root.light .sa-hero-neo h1 { color:var(--t1); }
.sa-root.light .sa-hero-neo p { color:var(--t2); }
.sa-root.light .sa-hero-neo .sa-hero-leadform {
  border-color: rgba(37,99,235,.18);
  background:#fff;
  box-shadow: 0 12px 30px rgba(37,99,235,.12);
}
.sa-root.light .sa-hero-neo .sa-hero-leadform input {
  color:var(--t1);
}
.sa-root.light .sa-hero-neo .sa-hero-leadform input::placeholder {
  color:var(--t3);
}
.sa-root.light .sa-neo-kpis > div {
  border-color: rgba(37,99,235,.18);
  background: #fff;
  box-shadow: 0 8px 18px rgba(37,99,235,.08);
}
.sa-root.light .sa-neo-kpis strong { color:var(--t1); }
.sa-root.light .sa-neo-kpis span { color:var(--t2); }
.sa-root.light .sa-cube-cloud {
  border-color: rgba(79,70,229,.24);
  background:
    radial-gradient(ellipse 90% 80% at 76% 94%, rgba(79,70,229,.22), transparent 62%),
    linear-gradient(165deg, rgba(245,249,255,.96), rgba(230,239,255,.88));
  box-shadow: 0 20px 48px rgba(37,99,235,.16);
}
.sa-root.light .sa-cube-cloud::before {
  background-image: linear-gradient(rgba(79,70,229,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(79,70,229,.14) 1px, transparent 1px);
  opacity:.2;
}
.sa-root.light .sa-cube-shadow-floor {
  background: radial-gradient(ellipse at center, rgba(79,70,229,.2), rgba(79,70,229,0) 68%);
}
.sa-root.light .sa-neo-cube {
  border-color: rgba(79,70,229,.2);
  background: linear-gradient(158deg, #ffffff, #e9f1ff 60%, #d9e6ff 100%);
  box-shadow: 0 14px 26px rgba(37,99,235,.18), inset 0 1px 0 rgba(255,255,255,.95);
  filter: drop-shadow(0 10px 12px rgba(37,99,235,.16));
}
.sa-root.light .sa-neo-cube::before {
  background: linear-gradient(180deg, rgba(255,255,255,.95), rgba(177,196,250,.42));
}
.sa-root.light .sa-neo-cube::after {
  background: linear-gradient(180deg, rgba(151,173,242,.44), rgba(120,144,220,.22));
}

.sa-hero-neo .sa-hero-visual {
  width:min(560px,100%);
  height:470px;
  justify-self:end;
}
.sa-cube-cloud {
  position:absolute;
  inset:22px 16px 10px;
  border-radius:26px;
  border:1px solid rgba(129,140,248,.26);
  background:
    radial-gradient(ellipse 90% 80% at 76% 94%, rgba(124,58,237,.36), transparent 62%),
    linear-gradient(165deg, rgba(7,10,22,.88), rgba(9,14,28,.92));
  overflow:hidden;
  box-shadow:0 20px 48px rgba(0,0,0,.45);
}
.sa-cube-cloud::before {
  content:'';
  position:absolute;
  inset:0;
  background-image:linear-gradient(rgba(129,140,248,.18) 1px, transparent 1px),linear-gradient(90deg, rgba(129,140,248,.18) 1px, transparent 1px);
  background-size:34px 34px;
  mask-image:linear-gradient(180deg, transparent 0%, black 35%, black 100%);
  opacity:.28;
}
.sa-cube-shadow-floor {
  position:absolute;
  left:8%;
  right:8%;
  bottom:6%;
  height:30%;
  background:radial-gradient(ellipse at center, rgba(124,58,237,.42), rgba(124,58,237,0) 68%);
  filter:blur(26px);
}
.sa-neo-cube {
  --size:78px;
  position:absolute;
  width:var(--size);
  height:var(--size);
  border-radius:10px;
  border:1px solid rgba(199,210,254,.24);
  background:linear-gradient(158deg,#0c1327,#1A2742 60%, #243653 100%);
  box-shadow:0 18px 30px rgba(0,0,0,.46), inset 0 1px 0 rgba(255,255,255,.24);
  transform-style:preserve-3d;
  will-change:transform;
  filter:drop-shadow(0 12px 14px rgba(0,0,0,.42));
}
.sa-neo-cube::before {
  content:'';
  position:absolute;
  left:8px;
  right:8px;
  top:-12px;
  height:12px;
  border-radius:6px 6px 2px 2px;
  background:linear-gradient(180deg, rgba(210,220,255,.6), rgba(150,170,255,.22));
  clip-path:polygon(0 100%, 10% 0, 90% 0, 100% 100%);
  opacity:.7;
}
.sa-neo-cube::after {
  content:'';
  position:absolute;
  top:8px;
  right:-12px;
  width:12px;
  bottom:8px;
  border-radius:2px 6px 6px 2px;
  background:linear-gradient(180deg, rgba(140,160,230,.46), rgba(120,140,220,.18));
  clip-path:polygon(0 6%, 100% 0, 100% 100%, 0 94%);
  opacity:.72;
}
.sa-neo-cube.c1 { --size:102px; left:8%;  bottom:8%;  animation:neoCubeA 8.2s ease-in-out infinite; }
.sa-neo-cube.c2 { --size:76px;  left:32%; top:16%;   animation:neoCubeB 7.4s ease-in-out infinite .2s; }
.sa-neo-cube.c3 { --size:92px;  right:18%; top:8%;   animation:neoCubeC 9s ease-in-out infinite .4s; }
.sa-neo-cube.c4 { --size:68px;  right:6%;  top:35%;  animation:neoCubeA 7.6s ease-in-out infinite .8s; }
.sa-neo-cube.c5 { --size:88px;  left:46%;  bottom:24%;animation:neoCubeC 8.7s ease-in-out infinite .5s; }
.sa-neo-cube.c6 { --size:72px;  right:32%; bottom:10%;animation:neoCubeB 7.8s ease-in-out infinite 1.1s; }
.sa-neo-cube.c7 { --size:64px;  left:18%;  top:44%;  animation:neoCubeA 8.4s ease-in-out infinite 1.4s; }
.sa-neo-cube.c8 { --size:82px;  right:10%; bottom:32%;animation:neoCubeC 9.3s ease-in-out infinite 1.7s; }

/* ── SHOWCASE STRIP ── */
.sa-neo-showcase {
  padding:36px max(24px, calc((100vw - var(--content-max)) / 2)) 10px;
}
.sa-neo-show-head {
  max-width:780px;
  margin:0 auto 26px;
  text-align:center;
}
.sa-neo-show-head h3 {
  color:var(--t1);
  font-size:clamp(24px,3.5vw,40px);
  line-height:1.2;
  font-weight:800;
}
.sa-neo-show-grid {
  max-width:var(--content-wide);
  margin:0 auto;
  display:grid;
  grid-template-columns:minmax(220px,.75fr) minmax(0,1.25fr);
  gap:16px;
}
.sa-neo-show-card {
  border-radius:20px;
  border:1px solid var(--border);
  padding:22px;
  position:relative;
  overflow:hidden;
  transition:transform .28s ease, box-shadow .28s ease, border-color .28s ease;
}
.sa-root.light .sa-neo-show-card {
  background:linear-gradient(165deg, rgba(255,255,255,.95), rgba(236,243,255,.78));
  box-shadow:0 14px 40px rgba(37,99,235,.14);
}
.sa-root.dark .sa-neo-show-card {
  background:linear-gradient(165deg, rgba(9,14,28,.9), rgba(16,27,47,.8));
  border-color:rgba(129,140,248,.26);
  box-shadow:0 14px 40px rgba(0,0,0,.45);
}
.sa-neo-show-card::before {
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(118deg, rgba(129,140,248,.2), transparent 54%);
  opacity:.55;
}
.sa-neo-show-card::after {
  content:'';
  position:absolute;
  inset:0;
  pointer-events:none;
  background:linear-gradient(120deg, transparent, rgba(255,255,255,.2), transparent);
  transform:translateX(-140%);
  animation:neoCardSweep 7.5s linear infinite;
}
.sa-neo-show-card:hover {
  transform:translateY(-6px);
  border-color:rgba(129,140,248,.42);
}
.sa-neo-show-card.mini { animation:neoCardFloatA 8.2s ease-in-out infinite; }
.sa-neo-show-card.wide { animation:neoCardFloatB 9.1s ease-in-out infinite .2s; }
.sa-neo-show-card h4 {
  margin-top:14px;
  margin-bottom:8px;
  font-size:18px;
  font-weight:700;
  color:var(--t1);
}
.sa-neo-show-card p {
  color:var(--t2);
  font-size:14px;
  line-height:1.65;
}
.sa-neo-ring {
  width:118px;
  height:118px;
  border-radius:50%;
  margin-top:6px;
  background:
    radial-gradient(circle at 35% 35%, rgba(255,255,255,.95), rgba(160,174,255,.1) 40%),
    conic-gradient(from 0deg, rgba(124,58,237,.8), rgba(37,99,235,.85), rgba(124,58,237,.8));
  box-shadow:0 16px 40px rgba(79,70,229,.35);
  animation:neoRingSpin 8.5s linear infinite;
}
.sa-neo-show-card.wide { padding:16px; }
.sa-neo-dashboard {
  border-radius:14px;
  border:1px solid rgba(129,140,248,.3);
  background:rgba(8,12,24,.82);
  padding:12px;
}
.sa-neo-db-head {
  display:flex;
  gap:5px;
  margin-bottom:10px;
}
.sa-neo-db-head span {
  width:8px;
  height:8px;
  border-radius:50%;
  background:#556089;
}
.sa-neo-db-grid {
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
}
.sa-neo-db-block {
  border-radius:10px;
  border:1px solid rgba(129,140,248,.22);
  background:rgba(17,24,39,.75);
  padding:10px;
}
.sa-neo-db-block label {
  display:block;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.4px;
  color:#93A3C5;
  margin-bottom:6px;
}
.sa-neo-db-block strong {
  display:block;
  font-family:'Bricolage Grotesque',sans-serif;
  font-size:26px;
  line-height:1;
  color:#F8FAFF;
}
.sa-neo-db-block small {
  color:#34D399;
  font-size:11px;
  font-weight:700;
}
.sa-neo-db-chart {
  grid-column:1/-1;
  height:110px;
  border-radius:10px;
  border:1px solid rgba(129,140,248,.2);
  background:
    linear-gradient(180deg, rgba(124,58,237,.22), rgba(124,58,237,0) 70%),
    repeating-linear-gradient(90deg, rgba(129,140,248,.14) 0 1px, transparent 1px 26px),
    linear-gradient(180deg, rgba(79,70,229,.18), rgba(17,24,39,.8));
  position:relative;
  overflow:hidden;
}
.sa-neo-db-chart::before {
  content:'';
  position:absolute;
  inset:auto -20% 0;
  height:78%;
  background:linear-gradient(170deg, rgba(14,165,233,.65), rgba(124,58,237,.4));
  clip-path:polygon(0% 82%, 12% 75%, 25% 79%, 38% 58%, 52% 64%, 65% 48%, 78% 57%, 90% 40%, 100% 52%, 100% 100%, 0 100%);
  opacity:.7;
}
.sa-neo-db-chart::after {
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(120deg, transparent, rgba(255,255,255,.2), transparent);
  transform:translateX(-130%);
  animation:neoChartSweep 4.8s linear infinite;
}

@media(max-width:1200px){
  .sa-hero-neo{grid-template-columns:1fr;row-gap:26px;padding-top:108px}
  .sa-hero-neo .sa-hero-inner{max-width:720px;margin:0 auto;text-align:center}
  .sa-hero-neo .sa-hero-pill{margin:0 auto 20px}
  .sa-hero-neo .sa-hero-leadform{margin:0 auto}
  .sa-neo-kpis{margin:14px auto 0}
  .sa-hero-neo .sa-hero-visual{justify-self:center;width:min(560px,96%);height:430px}
  .sa-neo-topnav{width:min(760px,calc(100% - 26px));justify-content:center;flex-wrap:wrap;height:auto;padding:5px}
  .sa-neo-show-grid{grid-template-columns:1fr;}
}
@media(max-width:680px){
  .sa-hero-neo{padding:92px 14px 32px;min-height:auto}
  .sa-hero-neo h1{font-size:clamp(34px,10vw,46px)}
  .sa-neo-topnav{top:14px;gap:2px}
  .sa-neo-navitem{padding:0 10px;font-size:11px}
  .sa-neo-navitem:nth-child(n+3){display:none}
  .sa-neo-navcta{padding:0 12px;font-size:11px}
  .sa-hero-neo .sa-hero-leadform{height:auto;grid-template-columns:1fr;gap:6px;padding:8px;border-radius:12px}
  .sa-root.dark .sa-hero-neo .sa-hero-leadform input{height:38px;background:rgba(17,24,39,.5)}
  .sa-root.light .sa-hero-neo .sa-hero-leadform input{height:38px;background:#fff}
  .sa-hero-neo .sa-hero-leadform button{width:100%}
  .sa-neo-kpis{grid-template-columns:1fr;gap:6px;width:100%}
  .sa-neo-kpis > div{padding:8px 10px}
  .sa-neo-kpis strong{font-size:18px}
  .sa-neo-visual-badge{top:-2px;right:4px;height:28px;font-size:10px;padding:0 9px}
  .sa-hero-neo .sa-hero-visual{height:320px}
  .sa-cube-cloud{inset:10px 4px 8px;border-radius:18px}
  .sa-neo-beam,.sa-neo-particle{display:none}
  .sa-neo-cube{border-radius:10px}
  .sa-neo-cube.c1{--size:76px}
  .sa-neo-cube.c2{--size:56px}
  .sa-neo-cube.c3{--size:66px}
  .sa-neo-cube.c4{--size:52px}
  .sa-neo-cube.c5{--size:62px}
  .sa-neo-cube.c6{--size:54px}
  .sa-neo-cube.c7{--size:46px}
  .sa-neo-cube.c8{--size:58px}
  .sa-neo-showcase{padding:28px 16px 6px}
  .sa-neo-show-card{padding:16px}
  .sa-neo-ring{width:86px;height:86px}
  .sa-neo-db-block strong{font-size:22px}
}

/* ── STATS ── */
.sa-stats { padding:48px max(24px, calc((100vw - var(--content-max)) / 2)); border-top:1px solid var(--border); border-bottom:1px solid var(--border); backdrop-filter:blur(16px); }
.sa-root.light .sa-stats { background:rgba(255,255,255,.75); }
.sa-root.dark  .sa-stats { background:rgba(13,20,37,.6); }
.sa-stats-grid { display:grid;grid-template-columns:repeat(4,1fr);max-width:980px;margin:0 auto; }
.sa-stat { text-align:center;padding:16px;border-right:1px solid var(--border); }
.sa-stat:last-child { border-right:none; }
.sa-stat-n { font-family:'Bricolage Grotesque',sans-serif;font-size:40px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:6px; }
.sa-stat-l { font-size:13px;color:var(--t3);font-weight:500; }

/* ── SECTION ── */
.sa-sec { padding:96px max(24px, calc((100vw - var(--content-max)) / 2)); }
.sa-sec.alt { border-top:1px solid var(--border); border-bottom:1px solid var(--border); backdrop-filter:blur(12px); }
.sa-root.light .sa-sec.alt { background:rgba(255,255,255,.6); }
.sa-root.dark  .sa-sec.alt { background:rgba(13,20,37,.5); }
.sa-sec-head { text-align:center;max-width:600px;margin:0 auto 64px; }
.sa-sec > .sa-grid,
.sa-sec > .sa-fstrip,
.sa-sec > .sa-stabs,
.sa-sec > .sa-svc-panel.on,
.sa-sec > .sa-filt-row,
.sa-sec > .sa-contact-wrap {
  max-width: var(--content-max);
  margin-left: auto;
  margin-right: auto;
}
.sa-sec > .sa-grid.g3 {
  max-width: var(--content-wide);
}
.sa-tag { display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;padding:4px 14px;border-radius:99px;background:var(--blue-bg);color:var(--blue);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase; }
.sa-sec-head h2 { font-size:clamp(28px,4vw,44px);font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-sec-head h2 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-lead { font-size:17px;color:var(--t2);line-height:1.75; }

/* ── GRID ── */
.sa-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:22px;align-items:stretch; }
.sa-grid.g3 { grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); }

.sa-scard,
.sa-fcard,
.sa-lcard,
.sa-tcard,
.sa-fitem {
  position: relative;
  overflow: hidden;
}

.sa-scard::after,
.sa-fcard::after,
.sa-lcard::after,
.sa-tcard::after,
.sa-fitem::after {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(140deg, rgba(255,255,255,.38), transparent 48%);
  opacity: .23;
}

.sa-root.dark .sa-scard::after,
.sa-root.dark .sa-fcard::after,
.sa-root.dark .sa-lcard::after,
.sa-root.dark .sa-tcard::after,
.sa-root.dark .sa-fitem::after {
  background: linear-gradient(140deg, rgba(129,140,248,.18), transparent 52%);
  opacity: .2;
}

/* ── SERVICE CARD ── */
.sa-scard {
  border:1px solid var(--border); border-radius:18px; padding:28px;
  cursor:pointer; position:relative; overflow:hidden;
  transition:all .35s cubic-bezier(.4,0,.2,1); box-shadow:var(--s1);
  display:flex; flex-direction:column; min-height:320px;
}
.sa-root.light .sa-scard { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-scard { background:var(--bg2); }
.sa-scard::before { content:'';position:absolute;top:0;left:-100%;width:200%;height:2px;background:linear-gradient(90deg,transparent,var(--blue),var(--indigo),transparent);transition:left .5s ease;z-index:2; }
.sa-scard:hover::before { left:0; }
.sa-root.light .sa-scard:hover { background:#fff;border-color:rgba(37,99,235,.25);box-shadow:0 12px 40px rgba(37,99,235,.12);transform:translateY(-7px) scale(1.01); }
.sa-root.dark  .sa-scard:hover { border-color:rgba(37,99,235,.3);box-shadow:var(--s4);transform:translateY(-6px) scale(1.01); }
.sa-scard:hover .sa-sc-icon { transform:scale(1.1) rotate(-4deg); }
.sa-scard > * { position:relative;z-index:1; }
.sa-sc-icon { width:50px;height:50px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:20px;margin-bottom:20px;transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.sa-scard h3 { font-size:18px;font-weight:700;margin-bottom:10px;color:var(--t1); }
.sa-scard p { font-size:14.5px;color:var(--t2);line-height:1.68;flex:1; }
.sa-sc-tags { display:flex;gap:6px;flex-wrap:wrap;margin-top:auto;padding-top:16px; }
.sa-sc-tag { padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;background:var(--bg3);color:var(--t2);border:1px solid var(--border); }
.sa-sc-arr { position:absolute;top:24px;right:24px;width:32px;height:32px;border-radius:99px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--t3);z-index:1;transition:all .25s; }
.sa-scard:hover .sa-sc-arr { background:var(--blue);border-color:var(--blue);color:#fff;transform:rotate(-45deg); }

/* ── FEATURES ── */
.sa-fstrip { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px; }
.sa-fitem { border:1px solid var(--border);border-radius:12px;padding:22px;text-align:center;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);backdrop-filter:blur(8px);display:flex;flex-direction:column;min-height:190px; }
.sa-root.light .sa-fitem { background:rgba(255,255,255,.85); }
.sa-root.dark  .sa-fitem { background:var(--bg2); }
.sa-fitem:hover { transform:translateY(-5px);border-color:rgba(37,99,235,.3); }
.sa-root.light .sa-fitem:hover { background:#fff;box-shadow:0 12px 36px rgba(37,99,235,.13); }
.sa-root.dark  .sa-fitem:hover { box-shadow:var(--s3); }
.sa-fitem:hover .sa-fi-icon { transform:scale(1.15) rotate(-8deg); }
.sa-fi-icon { width:44px;height:44px;border-radius:12px;background:var(--blue-bg);color:var(--blue);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 14px;transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.sa-fitem h4 { font-size:14px;font-weight:700;margin-bottom:6px;color:var(--t1); }
.sa-fitem p { font-size:13.5px;color:var(--t2);line-height:1.65; }

/* ── TESTIMONIALS ── */
.sa-tcard { border:1px solid var(--border);border-radius:18px;padding:28px;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);backdrop-filter:blur(8px);display:flex;flex-direction:column;height:100%; }
.sa-root.light .sa-tcard { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-tcard { background:var(--bg2); }
.sa-tcard:hover { transform:translateY(-5px); }
.sa-root.light .sa-tcard:hover { background:#fff;box-shadow:0 14px 40px rgba(37,99,235,.12);border-color:rgba(37,99,235,.2); }
.sa-root.dark  .sa-tcard:hover { box-shadow:var(--s3); }
.sa-stars { display:flex;gap:3px;margin-bottom:16px; }
.sa-stars i { color:#F59E0B;font-size:13px; }
.sa-tcard > p { font-size:14.5px;color:var(--t2);line-height:1.75;margin-bottom:20px;font-style:italic;flex:1; }
.sa-tauthor { display:flex;align-items:center;gap:12px; }
.sa-tavatar { width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0; }
.sa-tauthor strong { display:block;font-size:13.5px;font-weight:700;color:var(--t1); }
.sa-tauthor span { font-size:12px;color:var(--t3); }

/* ── MARQUEE ── */
.sa-marquee-outer { padding:48px max(24px, calc((100vw - var(--content-max)) / 2));overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);backdrop-filter:blur(12px); }
.sa-root.light .sa-marquee-outer { background:rgba(255,255,255,.65); }
.sa-root.dark  .sa-marquee-outer { background:rgba(13,20,37,.5); }
.sa-marquee-outer h3 { text-align:center;font-size:12px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:2px;margin-bottom:32px; }
.sa-marquee-wrap { position:relative;overflow:hidden; }
.sa-marquee-wrap::before,.sa-marquee-wrap::after { content:'';position:absolute;top:0;bottom:0;width:100px;z-index:1; }
.sa-root.light .sa-marquee-wrap::before { background:linear-gradient(90deg,rgba(240,244,255,1),transparent); }
.sa-root.light .sa-marquee-wrap::after  { background:linear-gradient(-90deg,rgba(240,244,255,1),transparent); }
.sa-root.dark  .sa-marquee-wrap::before { background:linear-gradient(90deg,rgba(7,12,24,1),transparent); }
.sa-root.dark  .sa-marquee-wrap::after  { background:linear-gradient(-90deg,rgba(7,12,24,1),transparent); }
.sa-marquee-track { display:flex;gap:12px;animation:scroll 25s linear infinite;width:max-content; }
.sa-mpill { padding:9px 22px;border:1px solid var(--border);border-radius:10px;font-size:13px;font-weight:600;color:var(--t2);white-space:nowrap;transition:all .2s;cursor:default; }
.sa-root.light .sa-mpill { background:rgba(255,255,255,.8); }
.sa-root.dark  .sa-mpill { background:var(--bg3); }

/* ── PAGE HEADER ── */
.sa-phead { padding:72px max(24px, calc((100vw - var(--content-max)) / 2)) 56px;text-align:center;position:relative;overflow:hidden;border-bottom:1px solid var(--border);backdrop-filter:blur(16px); }
.sa-root.light .sa-phead { background:rgba(255,255,255,.6); }
.sa-root.dark  .sa-phead { background:rgba(13,20,37,.5); }
.sa-phead::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 50%,rgba(37,99,235,.07) 0%,transparent 70%);animation:meshPulse 10s ease-in-out infinite; }
.sa-root.dark .sa-phead::before { background:radial-gradient(ellipse 70% 80% at 50% 50%,rgba(37,99,235,.15) 0%,transparent 70%); }
.sa-phead::after { content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(37,99,235,.3) 30%,rgba(79,70,229,.4) 50%,rgba(37,99,235,.3) 70%,transparent);animation:lineGlow 4s ease-in-out infinite; }
.sa-phead > * { position:relative;z-index:1; }
.sa-phead h1 { font-size:clamp(30px,5vw,54px);font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-phead h1 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-phead p { font-size:17px;color:var(--t2);max-width:620px;margin:0 auto;line-height:1.75; }

/* ── SERVICES PAGE ── */
.sa-stabs { display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:52px; }
.sa-stab { padding:9px 20px;border-radius:10px;border:1px solid var(--border);font-size:14px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);font-family:'Inter',sans-serif; }
.sa-root.light .sa-stab { background:rgba(255,255,255,.85); }
.sa-root.dark  .sa-stab { background:var(--bg2); }
.sa-stab:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-1px); }
.sa-stab.on { background:var(--grad);border-color:transparent;color:#fff;box-shadow:var(--sb); }
.sa-svc-panel { display:none; }
.sa-svc-panel.on { display:grid;grid-template-columns:1fr 1.1fr;gap:48px;align-items:stretch; }
@media(max-width:900px){.sa-svc-panel.on{grid-template-columns:1fr}}
.sa-svc-vis { border:1px solid var(--border);border-radius:24px;padding:40px;text-align:center;box-shadow:var(--s3); }
.sa-root.light .sa-svc-vis { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-svc-vis { background:var(--bg2); }
.sa-svc-vis,.sa-svc-body { height:100%; }
.sa-svc-vis:hover .sa-svc-big-icon { transform:scale(1.08) rotate(-6deg); }
.sa-svc-big-icon { width:96px;height:96px;border-radius:24px;background:var(--blue-bg);color:var(--blue);display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 24px;transition:transform .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 8px 30px rgba(37,99,235,.15); }
.sa-svc-kpis { display:flex;justify-content:center;gap:28px;margin-top:24px; }
.sa-svc-kpi .n { font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-svc-kpi .l { font-size:11px;color:var(--t3);font-weight:500; }
.sa-svc-body h2 { font-size:clamp(24px,3vw,36px);font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-svc-body h2 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-svc-body { display:flex;flex-direction:column; }
.sa-svc-body p { font-size:16px;color:var(--t2);line-height:1.75;margin-bottom:28px; }
.sa-feat-list { list-style:none;display:flex;flex-direction:column;gap:11px;margin-bottom:30px; }
.sa-feat-list li { display:flex;align-items:flex-start;gap:10px;font-size:14.5px;color:var(--t2); }
.sa-feat-list li::before { content:'✓';width:20px;height:20px;font-size:11px;font-weight:700;color:var(--green);display:flex;align-items:center;justify-content:center;border-radius:99px;background:var(--green-bg);flex-shrink:0;margin-top:1px; }
.sa-btn-row { display:flex;gap:12px;flex-wrap:wrap;margin-top:auto; }
.sa-btn-p { height:44px;padding:0 22px;background:var(--grad);color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;display:inline-flex;align-items:center;gap:7px;box-shadow:var(--sb);cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);font-family:'Inter',sans-serif; }
.sa-btn-p:hover { transform:translateY(-2px);box-shadow:0 12px 36px rgba(37,99,235,.35); }
.sa-btn-o { height:44px;padding:0 22px;border:1px solid var(--border);border-radius:10px;font-size:15px;font-weight:500;display:inline-flex;align-items:center;gap:7px;cursor:pointer;transition:all .25s;box-shadow:var(--s1);font-family:'Inter',sans-serif; }
.sa-root.light .sa-btn-o { background:rgba(255,255,255,.9);color:var(--t1); }
.sa-root.dark  .sa-btn-o { background:var(--bg2);color:var(--t1); }
.sa-btn-o:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-1px); }

/* ── FORMATIONS ── */
.sa-filt-row { display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:12px; }
.sa-filt { padding:7px 18px;border-radius:99px;border:1px solid var(--border);font-size:14px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .2s;box-shadow:var(--s1);font-family:'Inter',sans-serif; }
.sa-root.light .sa-filt { background:rgba(255,255,255,.85); }
.sa-root.dark  .sa-filt { background:var(--bg2); }
.sa-filt:hover { border-color:var(--blue);color:var(--blue); }
.sa-filt.on { background:var(--grad);border-color:transparent;color:#fff; }
.sa-sbar { position:relative;max-width:400px;margin:0 auto 52px; }
.sa-sbar input { width:100%;height:46px;padding:0 16px 0 44px;border:1px solid var(--border);border-radius:12px;font-size:15px;color:var(--t1);outline:none;box-shadow:var(--s1);transition:all .2s;font-family:'Inter',sans-serif; }
.sa-root.light .sa-sbar input { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-sbar input { background:var(--bg2); }
.sa-sbar input:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.12); }
.sa-sbar input::placeholder { color:var(--t3); }
.sa-sbar i { position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--t3);font-size:14px; }
.sa-fcard { border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);display:flex;flex-direction:column;height:100%; }
.sa-root.light .sa-fcard { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-fcard { background:var(--bg2); }
.sa-fcard:hover { transform:translateY(-6px); }
.sa-root.light .sa-fcard:hover { box-shadow:0 16px 48px rgba(37,99,235,.13);border-color:rgba(37,99,235,.2); }
.sa-root.dark  .sa-fcard:hover { box-shadow:var(--s4); }
.sa-fcard-top { height:8px; }
.sa-fcat { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:12px; }
.sa-fcard-body { padding:24px;display:flex;flex-direction:column;flex:1; }
.sa-fcard-body h3 { font-size:17px;font-weight:700;margin-bottom:8px;color:var(--t1); }
.sa-fcard-body p { font-size:14px;color:var(--t2);line-height:1.62;margin-bottom:16px; }
.sa-fmeta { display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px; }
.sa-fm { display:flex;align-items:center;gap:5px;font-size:12.5px;color:var(--t3); }
.sa-fm i { color:var(--blue);font-size:11px; }
.sa-fcard-foot { display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--border);margin-top:auto; }
.sa-fprice { font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:800;color:var(--blue); }
.sa-fprice small { font-size:11px;color:var(--t3);font-family:'Inter',sans-serif;font-weight:400; }

/* ── LOGICIELS ── */
.sa-lcard { border:1px solid var(--border);border-radius:24px;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);display:flex;flex-direction:column;height:100%; }
.sa-root.light .sa-lcard { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-lcard { background:var(--bg2); }
.sa-lcard:hover { transform:translateY(-6px); }
.sa-root.light .sa-lcard:hover { box-shadow:0 16px 50px rgba(37,99,235,.13); }
.sa-root.dark  .sa-lcard:hover { box-shadow:var(--s4); }
.sa-lcard-head { padding:28px;border-bottom:1px solid var(--border); }
.sa-root.light .sa-lcard-head { background:linear-gradient(135deg,rgba(37,99,235,.04),rgba(79,70,229,.04)); }
.sa-root.dark  .sa-lcard-head { background:linear-gradient(135deg,rgba(37,99,235,.1),rgba(79,70,229,.08)); }
.sa-lcard-ico { width:54px;height:54px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;margin-bottom:16px;box-shadow:0 8px 24px rgba(37,99,235,.3);transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.sa-lcard:hover .sa-lcard-ico { transform:scale(1.1) rotate(-6deg); }
.sa-lcard-head h3 { font-size:19px;font-weight:700;margin-bottom:6px;color:var(--t1); }
.sa-lcard-head p { font-size:14px;color:var(--t2);line-height:1.65; }
.sa-lcard-body { padding:22px 28px;display:flex;flex-direction:column;flex:1; }
.sa-lfeats { list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:20px; }
.sa-lfeats li { font-size:14px;color:var(--t2);display:flex;align-items:center;gap:8px; }
.sa-lfeats li i { color:var(--green);font-size:11px; }
.sa-lcard-foot { display:flex;align-items:center;justify-content:space-between;margin-top:auto; }
.sa-lprice { font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:700; }
.sa-lprice.contact { color:var(--blue); }
.sa-lprice.paid { color:var(--amber); }
.sa-lprice small { display:block;font-size:11px;color:var(--t3);font-family:'Inter',sans-serif;font-weight:400; }

/* ── CONTACT ── */
.sa-contact-wrap { display:grid;grid-template-columns:1fr 1.25fr;gap:44px;align-items:start; }
@media(max-width:900px){.sa-contact-wrap{grid-template-columns:1fr;gap:30px}}
.sa-cinfo h2 { font-size:32px;font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-cinfo h2 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-cinfo p { font-size:16px;color:var(--t2);line-height:1.75;margin-bottom:36px; }
.sa-citems { display:flex;flex-direction:column;gap:18px; }
.sa-citem { display:flex;align-items:flex-start;gap:14px; }
.sa-citem-ico { width:42px;height:42px;border-radius:12px;background:var(--blue-bg);border:1px solid rgba(37,99,235,.15);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--blue);flex-shrink:0; }
.sa-citem strong { display:block;font-size:13.5px;font-weight:700;margin-bottom:2px;color:var(--t1); }
.sa-citem span { font-size:14px;color:var(--t2); }
.sa-cform { border:1px solid rgba(255,255,255,.95);border-radius:24px;padding:36px;backdrop-filter:blur(20px); }
.sa-root.light .sa-cform { background:rgba(255,255,255,.92);box-shadow:0 8px 40px rgba(37,99,235,.09),0 1px 0 rgba(255,255,255,.8) inset; }
.sa-root.dark  .sa-cform { background:var(--bg2);border-color:var(--border);box-shadow:var(--s3); }
.sa-cform { max-width: 760px; }
.sa-cform h3 { font-size:24px;font-weight:700;margin-bottom:4px;color:var(--t1); }
.sa-cform .sub { font-size:14px;color:var(--t2);margin-bottom:28px; }
.sa-fg { display:flex;flex-direction:column;gap:6px;margin-bottom:16px; }
.sa-fg label { font-size:13px;font-weight:600;color:var(--t2); }
.sa-fg input,.sa-fg select,.sa-fg textarea { padding:11px 14px;border:1px solid var(--border);border-radius:10px;color:var(--t1);font-size:15px;outline:none;transition:all .2s;font-family:'Inter',sans-serif;-webkit-appearance:none; }
.sa-root.light .sa-fg input,.sa-root.light .sa-fg select,.sa-root.light .sa-fg textarea { background:var(--bg3); }
.sa-root.dark  .sa-fg input,.sa-root.dark  .sa-fg select,.sa-root.dark  .sa-fg textarea { background:rgba(255,255,255,.04); }
.sa-fg input:focus,.sa-fg select:focus,.sa-fg textarea:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sa-root.light .sa-fg input:focus,.sa-root.light .sa-fg select:focus,.sa-root.light .sa-fg textarea:focus { background:var(--bg2); }
.sa-fg input::placeholder,.sa-fg textarea::placeholder { color:var(--t3); }
.sa-fg textarea { resize:vertical;min-height:110px; }
.sa-form-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
@media(max-width:520px){.sa-form-row{grid-template-columns:1fr}}
.sa-root.light .sa-fg select { color:#0A0F2C; }
.sa-root.light .sa-fg select option { background:#E8EEFF;color:#0A0F2C; }
.sa-root.dark  .sa-fg select option { background:#0D1425;color:#F1F5F9; }

/* ── MODAL ── */
.sa-overlay { position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .3s cubic-bezier(.4,0,.2,1); }
.sa-overlay.on { opacity:1;pointer-events:all; }
.sa-modal { border:1px solid var(--border);border-radius:24px;width:100%;max-width:560px;padding:32px;transform:translateY(20px) scale(.96);transition:all .35s cubic-bezier(.34,1.56,.64,1);max-height:90vh;overflow-y:auto;box-shadow:var(--s4); }
.sa-root.light .sa-modal { background:var(--bg2); }
.sa-root.dark  .sa-modal { background:var(--bg2); }
.sa-overlay.on .sa-modal { transform:none; }
.sa-mhead { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:26px;gap:12px; }
.sa-mhead h3 { font-size:20px;font-weight:700;color:var(--t1); }
.sa-mhead p { font-size:13px;color:var(--blue);font-weight:600;margin-top:3px; }
.sa-mclose { width:32px;height:32px;border-radius:8px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--t2);cursor:pointer;transition:all .2s;flex-shrink:0; }
.sa-mclose:hover { background:var(--red-bg);border-color:var(--red);color:var(--red); }
.sa-info-box { padding:12px 14px;border-radius:10px;background:var(--blue-bg);border:1px solid rgba(37,99,235,.2);font-size:12.5px;color:var(--t2);line-height:1.6;margin:16px 0; }
.sa-info-box i { color:var(--blue);margin-right:6px; }
.sa-auth-tabs { display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px; }
.sa-auth-tab {
  height:40px;border-radius:10px;border:1px solid var(--border);background:var(--bg3);
  font-size:13.5px;font-weight:700;color:var(--t2);cursor:pointer;transition:all .2s;
}
.sa-auth-tab:hover { border-color:var(--blue);color:var(--blue); }
.sa-auth-tab.on { background:var(--blue-bg);color:var(--blue);border-color:rgba(37,99,235,.28); }
.sa-auth-sep {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0 14px;
  color: var(--t3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .7px;
  text-transform: uppercase;
}
.sa-auth-sep::before,
.sa-auth-sep::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.sa-google-btn {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg2);
  color: var(--t1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all .2s ease;
  font-size: 13.5px;
  font-weight: 700;
  font-family: 'Inter',sans-serif;
}
.sa-google-btn:hover:not(:disabled) {
  border-color: var(--blue);
  color: var(--blue);
  box-shadow: var(--s2);
}
.sa-google-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
}
.sa-google-mark {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #D6DCEB;
  color: #DB4437;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.sa-form-note { font-size:12px;color:var(--t3);line-height:1.6;margin-top:-4px;margin-bottom:14px; }

/* ── TOAST ── */
.sa-toast { position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);z-index:2000;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:var(--s4);opacity:0;transition:all .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none;white-space:nowrap; }
.sa-root.light .sa-toast { background:var(--t1);color:var(--bg); }
.sa-root.dark  .sa-toast { background:#F1F5F9;color:#0A0F2C; }
.sa-toast.suc { background:var(--green)!important;color:#fff!important; }
.sa-toast.err { background:var(--red)!important;color:#fff!important; }
.sa-toast.on { transform:translateX(-50%) translateY(0);opacity:1; }

/* ── FOOTER ── */
.sa-footer { border-top:1px solid var(--border);padding:64px max(24px, calc((100vw - var(--content-max)) / 2)) 32px;position:relative;z-index:1;backdrop-filter:blur(16px); }
.sa-root.light .sa-footer { background:rgba(255,255,255,.75); }
.sa-root.dark  .sa-footer { background:rgba(7,12,24,.85); }
.sa-foot-grid { display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px; }
@media(max-width:900px){.sa-foot-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.sa-foot-grid{grid-template-columns:1fr}}
.sa-foot-brand p { font-size:14px;color:var(--t3);line-height:1.7;margin:16px 0 22px;max-width:320px; }
.sa-socials { display:flex;gap:8px; }
.sa-soc { width:36px;height:36px;border-radius:9px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--t3);cursor:pointer;transition:all .2s;text-decoration:none; }
.sa-soc:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-2px);background:var(--blue-bg); }
.sa-foot-col h5 { font-size:12px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:18px; }
.sa-foot-links { list-style:none;display:flex;flex-direction:column;gap:10px; }
.sa-foot-links a { font-size:14px;color:var(--t2);cursor:pointer;transition:color .2s;text-decoration:none; }
.sa-foot-links a:hover { color:var(--blue); }
.sa-foot-bar { display:flex;align-items:center;justify-content:space-between;padding-top:28px;border-top:1px solid var(--border);font-size:12.5px;color:var(--t3);flex-wrap:wrap;gap:12px; }
.sa-foot-bar a { color:var(--t3);text-decoration:none;transition:color .2s; }
.sa-foot-bar a:hover { color:var(--blue); }

/* ── FAB — BOUTON CHAT ── */
.sa-fab {
  position:fixed; bottom:32px; right:32px; z-index:800;
  display:flex; align-items:center; gap:10px;
  padding:0 20px 0 6px;
  height:54px; border-radius:99px;
  border:none; cursor:pointer;
  background:var(--grad);
  box-shadow:0 8px 32px rgba(37,99,235,.35), 0 2px 8px rgba(0,0,0,.1);
  transition:all .3s cubic-bezier(.34,1.56,.64,1);
  overflow:hidden;
}
.sa-fab::before {
  content:''; position:absolute; inset:0;
  background:radial-gradient(ellipse 80% 120% at 20% 50%, rgba(255,255,255,.18), transparent 65%);
  pointer-events:none;
}
.sa-fab:hover {
  transform:translateY(-3px) scale(1.03);
  box-shadow:0 16px 48px rgba(37,99,235,.45), 0 4px 12px rgba(0,0,0,.12);
}
.sa-fab:active { transform:scale(.97); }

/* avatar inside FAB */
.sa-fab-av {
  width:42px; height:42px; border-radius:50%;
  background:rgba(255,255,255,.18);
  border:1.5px solid rgba(255,255,255,.35);
  display:flex; align-items:center; justify-content:center;
  font-size:18px; color:#fff; flex-shrink:0;
  position:relative;
  transition:transform .35s cubic-bezier(.34,1.56,.64,1);
}
.sa-fab:hover .sa-fab-av { transform:rotate(-12deg) scale(1.05); }
.sa-fab-av-ring {
  position:absolute; inset:-4px; border-radius:50%;
  border:1.5px solid rgba(255,255,255,.3);
  animation:fabRing 2.5s ease-out infinite;
}
@keyframes fabRing{0%{transform:scale(.85);opacity:.7}100%{transform:scale(1.45);opacity:0}}

/* text inside FAB */
.sa-fab-txt { display:flex; flex-direction:column; line-height:1.15; }
.sa-fab-txt strong { font-size:13.5px; font-weight:700; color:#fff; font-family:'Bricolage Grotesque',sans-serif; }
.sa-fab-txt span { font-size:10.5px; color:rgba(255,255,255,.75); display:flex; align-items:center; gap:4px; }
.sa-fab-online { width:6px; height:6px; border-radius:50%; background:#4ade80; animation:statusPulse 2s infinite; }
@keyframes statusPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}

/* badge */
.sa-fab-badge {
  position:absolute; top:6px; right:8px;
  width:18px; height:18px; border-radius:50%;
  background:var(--red); color:#fff; font-size:9px; font-weight:700;
  display:flex; align-items:center; justify-content:center;
  border:2px solid #fff;
  animation:badgePop .4s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes badgePop{from{transform:scale(0)}to{transform:scale(1)}}

/* ── CHAT OVERLAY ── */
.sa-chat-overlay {
  position:fixed; inset:0; z-index:1000;
  background:rgba(0,0,0,.35);
  backdrop-filter:blur(6px);
  display:flex; align-items:center; justify-content:center;
  padding:20px;
  opacity:0; pointer-events:none;
  transition:opacity .3s cubic-bezier(.4,0,.2,1);
}
.sa-chat-overlay.open { opacity:1; pointer-events:all; }

/* ── CHAT CARD (la carte centrée) ── */
.sa-chat-wrap {
  width:100%; max-width:520px;
  height:min(640px, calc(100vh - 80px));
  border-radius:28px; overflow:hidden;
  display:flex; flex-direction:column;
  border:1px solid var(--border);
  box-shadow:0 32px 100px rgba(0,0,0,.22), 0 8px 32px rgba(37,99,235,.15);
  transform:scale(.9) translateY(24px);
  transition:all .4s cubic-bezier(.34,1.56,.64,1);
}
.sa-chat-overlay.open .sa-chat-wrap {
  transform:scale(1) translateY(0);
}
.sa-root.light .sa-chat-wrap { background:#FFFFFF; }
.sa-root.dark  .sa-chat-wrap { background:var(--bg2); }

.sa-chat-head {
  padding:18px 20px; display:flex; align-items:center; gap:13px;
  background:var(--grad); flex-shrink:0; position:relative; overflow:hidden;
}
.sa-chat-head::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 120% at 75% 50%,rgba(255,255,255,.18) 0%,transparent 65%); pointer-events:none; }
.sa-chat-head > * { position:relative; z-index:1; }
.sa-chat-avatar { width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;font-size:19px;color:#fff;flex-shrink:0; }
.sa-chat-head-info { flex:1; }
.sa-chat-head-info strong { display:block;font-size:15px;font-weight:700;color:#fff;font-family:'Bricolage Grotesque',sans-serif; }
.sa-chat-head-info span { font-size:11.5px;color:rgba(255,255,255,.75);display:flex;align-items:center;gap:5px;margin-top:2px; }
.sa-chat-status-dot { width:7px;height:7px;border-radius:50%;background:#4ade80;animation:statusPulse 2s ease-in-out infinite; }
.sa-chat-head-actions { display:flex;gap:6px; }
.sa-chat-icon-btn { width:32px;height:32px;border-radius:9px;background:rgba(255,255,255,.15);border:none;color:#fff;font-size:13px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .2s; }
.sa-chat-icon-btn:hover { background:rgba(255,255,255,.28); }
.sa-chat-powered { padding:7px 20px;font-size:11px;font-weight:600;text-align:center;letter-spacing:.3px;display:flex;align-items:center;justify-content:center;gap:6px;flex-shrink:0; }
.sa-root.light .sa-chat-powered { background:rgba(79,70,229,.06);color:var(--t3);border-bottom:1px solid var(--border); }
.sa-root.dark  .sa-chat-powered { background:rgba(79,70,229,.1);color:var(--t3);border-bottom:1px solid var(--border); }
.sa-chat-powered span { background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;font-weight:700; }
.sa-chat-msgs { flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;scroll-behavior:smooth; }
.sa-chat-msgs::-webkit-scrollbar{width:3px}
.sa-chat-msgs::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px}
.sa-msg { display:flex;gap:10px;align-items:flex-end;animation:msgIn .3s cubic-bezier(.4,0,.2,1) both; }
@keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.sa-msg.user { flex-direction:row-reverse; }
.sa-msg-av { width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0; }
.sa-msg.bot .sa-msg-av { background:var(--grad);color:#fff; }
.sa-msg.user .sa-msg-av { background:var(--bg3);color:var(--blue);border:1px solid var(--border);font-size:11px; }
.sa-msg-group { display:flex;flex-direction:column;max-width:80%; }
.sa-msg.user .sa-msg-group { align-items:flex-end; }
.sa-msg-bubble { max-width:100%;padding:11px 15px;border-radius:18px;font-size:14px;line-height:1.65; }
.sa-msg.bot  .sa-msg-bubble { border-radius:4px 18px 18px 18px;color:var(--t1); }
.sa-root.light .sa-msg.bot .sa-msg-bubble { background:#F4F6FF;border:1px solid var(--border); }
.sa-root.dark  .sa-msg.bot .sa-msg-bubble { background:var(--bg3); }
.sa-msg.user .sa-msg-bubble { border-radius:18px 4px 18px 18px;background:var(--grad);color:#fff; }
.sa-msg-time { font-size:10px;color:var(--t3);margin-top:5px;padding:0 4px; }
.sa-typing { display:flex;gap:4px;align-items:center;padding:13px 15px; }
.sa-typing span { width:7px;height:7px;border-radius:50%;background:var(--blue);display:inline-block;opacity:.4; }
.sa-typing span:nth-child(1){animation:bounce 1.2s .0s ease-in-out infinite}
.sa-typing span:nth-child(2){animation:bounce 1.2s .2s ease-in-out infinite}
.sa-typing span:nth-child(3){animation:bounce 1.2s .4s ease-in-out infinite}
@keyframes bounce{0%,60%,100%{opacity:.4;transform:translateY(0)}30%{opacity:1;transform:translateY(-5px)}}
.sa-chat-suggests { padding:10px 16px 4px;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0;border-top:1px solid var(--border); }
.sa-sug { padding:6px 13px;border-radius:99px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border);transition:all .2s;white-space:nowrap; }
.sa-root.light .sa-sug { background:rgba(255,255,255,.9);color:var(--t2); }
.sa-root.dark  .sa-sug { background:var(--bg3);color:var(--t2); }
.sa-sug:hover { border-color:var(--blue);color:var(--blue);background:var(--blue-bg);transform:translateY(-1px); }
.sa-chat-input-row { padding:14px 16px;display:flex;gap:9px;align-items:flex-end;border-top:1px solid var(--border);flex-shrink:0; }
.sa-chat-input-row textarea { flex:1;border:1.5px solid var(--border);border-radius:14px;padding:11px 15px;font-size:14px;font-family:'Inter',sans-serif;color:var(--t1);resize:none;outline:none;line-height:1.5;max-height:120px;min-height:44px;transition:all .2s; }
.sa-root.light .sa-chat-input-row textarea { background:var(--bg3); }
.sa-root.dark  .sa-chat-input-row textarea { background:rgba(255,255,255,.05); }
.sa-chat-input-row textarea:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sa-chat-input-row textarea::placeholder { color:var(--t3); }
.sa-send-btn { width:44px;height:44px;border-radius:12px;border:none;background:var(--grad);color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:var(--sb);transition:all .25s cubic-bezier(.34,1.56,.64,1); }
.sa-send-btn:hover { transform:scale(1.1) rotate(-8deg);box-shadow:0 8px 24px rgba(37,99,235,.45); }
.sa-send-btn:disabled { opacity:.45;cursor:not-allowed;transform:none; }
.sa-chat-error { margin:0 16px 12px;padding:11px 14px;border-radius:12px;background:var(--red-bg);border:1px solid rgba(239,68,68,.2);font-size:12.5px;color:var(--red);display:flex;align-items:flex-start;gap:8px;line-height:1.55; }
.sa-chat-error i { flex-shrink:0;margin-top:2px; }
@media(max-width:560px){
  .sa-chat-wrap{ border-radius:20px; }
  .sa-fab{ right:16px; bottom:20px; padding:0 14px 0 5px; height:48px; }
  .sa-fab-txt strong{ font-size:12px; }
}

/* ── REVEAL ── */
.sa-r { opacity:0;transform:translateY(28px);transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1); }
.sa-r.v { opacity:1;transform:none; }
.sa-r.d1{transition-delay:.07s} .sa-r.d2{transition-delay:.14s} .sa-r.d3{transition-delay:.21s} .sa-r.d4{transition-delay:.28s} .sa-r.d5{transition-delay:.35s}

/* ── KEYFRAMES ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
@keyframes fadeLeft{from{opacity:0;transform:translateX(36px)}to{opacity:1;transform:none}}
@keyframes cubeRotate{
  0%{transform:rotateX(-18deg) rotateY(0deg)}
  25%{transform:rotateX(-8deg) rotateY(90deg)}
  50%{transform:rotateX(-18deg) rotateY(180deg)}
  75%{transform:rotateX(-8deg) rotateY(270deg)}
  100%{transform:rotateX(-18deg) rotateY(360deg)}
}
@keyframes cubeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes cubeFxRotate{
  0%{transform:rotateX(0deg) rotateY(0deg) rotateZ(0deg)}
  50%{transform:rotateX(180deg) rotateY(220deg) rotateZ(160deg)}
  100%{transform:rotateX(360deg) rotateY(360deg) rotateZ(360deg)}
}
@keyframes cubeFxDriftA{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(12px,-16px,0)}}
@keyframes cubeFxDriftB{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-10px,-12px,0)}}
@keyframes cubeFxDriftC{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(8px,14px,0)}}
@keyframes cubeOrbitA{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes cubeOrbitB{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
@keyframes cubeOrbitC{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes neoBgDrift {
  0%,100%{transform:translate3d(0,0,0) scale(1)}
  50%{transform:translate3d(10px,-8px,0) scale(1.04)}
}
@keyframes neoPulseBadge {
  0%,100%{box-shadow:0 10px 22px rgba(0,0,0,.3), 0 0 0 0 rgba(56,189,248,.0)}
  50%{box-shadow:0 12px 30px rgba(0,0,0,.36), 0 0 0 8px rgba(56,189,248,.0)}
}
@keyframes neoPanelSweep {
  from{transform:translateX(-120%)}
  to{transform:translateX(140%)}
}
@keyframes neoBeamDrift {
  0%,100%{opacity:.32;transform:translateY(0)}
  50%{opacity:.88;transform:translateY(-8px)}
}
@keyframes neoParticleRise {
  0%,100%{transform:translate3d(0,0,0) scale(.8);opacity:.35}
  50%{transform:translate3d(0,-18px,0) scale(1.15);opacity:1}
}
@keyframes neoCubeA {
  0%,100%{transform:translate3d(0,0,0) rotateX(-16deg) rotateY(-22deg) rotateZ(0deg)}
  50%{transform:translate3d(0,-18px,0) rotateX(-12deg) rotateY(14deg) rotateZ(10deg)}
}
@keyframes neoCubeB {
  0%,100%{transform:translate3d(0,0,0) rotateX(-18deg) rotateY(18deg) rotateZ(0deg)}
  50%{transform:translate3d(0,-14px,0) rotateX(-9deg) rotateY(-14deg) rotateZ(-9deg)}
}
@keyframes neoCubeC {
  0%,100%{transform:translate3d(0,0,0) rotateX(-12deg) rotateY(-8deg) rotateZ(0deg)}
  50%{transform:translate3d(0,-16px,0) rotateX(-20deg) rotateY(18deg) rotateZ(12deg)}
}
@keyframes neoRingSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes neoChartSweep { from{transform:translateX(-130%)} to{transform:translateX(150%)} }
@keyframes neoCardSweep { from{transform:translateX(-140%)} to{transform:translateX(160%)} }
@keyframes neoCardFloatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
@keyframes neoCardFloatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
@keyframes float1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(1deg)}}
@keyframes float2{0%,100%{transform:translateY(0) rotate(5deg)}50%{transform:translateY(-8px) rotate(6.5deg)}}
@keyframes float3{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(-2.5deg)}}
@keyframes chatBotFloat{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-12px) rotate(-2deg)}}
@keyframes chatGridDrift{0%{transform:translate3d(0,0,0) rotate(8deg)}100%{transform:translate3d(-26px,-26px,0) rotate(8deg)}}
@keyframes chatScanSweep{0%,100%{transform:translateY(-62%);opacity:0}15%{opacity:.75}55%{opacity:.2}70%{transform:translateY(150%);opacity:0}}
@keyframes chatOrbitSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes msgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes bounce{0%,60%,100%{opacity:.4;transform:translateY(0)}30%{opacity:1;transform:translateY(-5px)}}
@keyframes statusPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.8)}}

/* ── MOBILE NAV ── */
.sa-mnav { position:fixed;inset:0;z-index:950;display:flex;flex-direction:column;padding:24px;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1); }
.sa-root.light .sa-mnav { background:var(--bg2); }
.sa-root.dark  .sa-mnav { background:var(--bg2); }
.sa-mnav.on { transform:none; }
.sa-mnav-head { display:flex;justify-content:space-between;align-items:center;margin-bottom:36px; }
.sa-mnav-links { display:flex;flex-direction:column;gap:4px; }
.sa-mnl { padding:14px 18px;border-radius:12px;font-size:16px;font-weight:600;color:var(--t2);background:none;border:none;text-align:left;cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif; }
.sa-mnl:hover { background:var(--bg3);color:var(--t1); }
.sa-mnl.on { background:var(--blue-bg);color:var(--blue); }
.sa-mnl i { margin-right:12px;width:18px;text-align:center;color:var(--blue); }

@media(max-width:768px){
  .sa-nav-links,.sa-btn-auth,.sa-btn-cta,.sa-user-chip{display:none!important}
  .sa-ham{display:flex!important}
  .sa-hero{padding:56px 16px 46px;min-height:auto}
  .sa-hero h1{font-size:clamp(32px,10vw,46px)}
  .sa-hero p{font-size:16px;max-width:100%}
  .sa-phead{padding:56px 16px 42px}
  .sa-phead p{font-size:15px}
  .sa-stats{padding:34px 16px}
  .sa-sec{padding:72px 16px}
  .sa-stats-grid{grid-template-columns:1fr 1fr}
  .sa-stat:nth-child(2){border-right:none}
  .sa-grid{grid-template-columns:1fr;gap:16px}
  .sa-scard,.sa-fitem,.sa-fcard,.sa-lcard,.sa-tcard{min-height:unset}
  .sa-svc-panel.on{gap:22px}
  .sa-contact-wrap{gap:24px}
  .sa-cinfo h2{font-size:28px}
  .sa-cform{padding:26px}
  .sa-fcard-body{padding:20px}
  .sa-fab{bottom:20px;right:20px}
}
.sa-ham { display:none;flex-direction:column;gap:4.5px;background:none;border:none;padding:8px;cursor:pointer; }
.sa-ham span { display:block;width:20px;height:1.5px;background:var(--t2);border-radius:2px;transition:all .3s; }

/* theme flash */
.sa-tflash { position:fixed;inset:0;z-index:9999;pointer-events:none;transition:background .4s; }
`;

/* ═══════════════════════════════════════════
   THREE.JS CUBES BACKGROUND HOOK
   👉 Change CUBE_COUNT below to adjust number of cubes
═══════════════════════════════════════════ */
const CUBE_COUNT = 10; // ← changer ici

function useThreeCubes(dark) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Load Three.js dynamically
    const script = document.getElementById('threejs-cdn');
    const initScene = () => {
      const THREE = window.THREE;
      if (!THREE) return;

      const W = window.innerWidth, H = window.innerHeight;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.z = 14;

      // Lighting
      const ambient = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambient);
      const dirLight = new THREE.DirectionalLight(0x6366f1, 2.5);
      dirLight.position.set(5, 8, 5);
      scene.add(dirLight);
      const pointLight1 = new THREE.PointLight(0x2563EB, 3, 30);
      pointLight1.position.set(-6, 4, 6);
      scene.add(pointLight1);
      const pointLight2 = new THREE.PointLight(0x8B5CF6, 2, 25);
      pointLight2.position.set(6, -4, 4);
      scene.add(pointLight2);

      // Create cubes — RIGHT SIDE ONLY (x: 2 to 14)
      const cubes = [];
      const COUNT = window.innerWidth < 860 ? Math.max(5, Math.floor(CUBE_COUNT * 0.65)) : CUBE_COUNT;
      for (let i = 0; i < COUNT; i++) {
        const size = Math.random() * 1.4 + 0.5;
        const geo = new THREE.BoxGeometry(size, size, size);

        const darkColor = dark
          ? new THREE.Color().setHSL(0.63 + Math.random() * 0.1, 0.7, 0.15)
          : new THREE.Color().setHSL(0.63 + Math.random() * 0.1, 0.6, 0.55);

        const mat = new THREE.MeshPhongMaterial({
          color: darkColor,
          emissive: dark ? new THREE.Color(0x1a1a4e) : new THREE.Color(0x3b4fd4),
          emissiveIntensity: dark ? 0.4 : 0.15,
          shininess: 120,
          specular: new THREE.Color(0x6366f1),
          transparent: true,
          opacity: dark ? 0.8 : 0.85,
        });

        const edges = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({
          color: dark ? 0x4F46E5 : 0x6366f1,
          transparent: true,
          opacity: dark ? 0.65 : 0.4,
        });
        const wireframe = new THREE.LineSegments(edges, edgeMat);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.add(wireframe);

        // RIGHT SIDE: x between 2 and 13 (right half of screen)
        mesh.position.set(
          2 + Math.random() * 11,           // x: right side only
          (Math.random() - 0.5) * 14,       // y: full height
          (Math.random() - 0.5) * 6 - 1     // z: some depth
        );
        mesh.rotation.set(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );

        const speed = {
          rx: (Math.random() - 0.5) * 0.008,
          ry: (Math.random() - 0.5) * 0.012,
          rz: (Math.random() - 0.5) * 0.006,
          fy: Math.random() * Math.PI * 2,
          fx: Math.random() * Math.PI * 2,
          fz: Math.random() * Math.PI * 2,
          floatSpeed: 0.003 + Math.random() * 0.004,
          floatAmp: 0.3 + Math.random() * 0.6,
          driftX: 0.14 + Math.random() * 0.24,
          driftZ: 0.18 + Math.random() * 0.22,
          baseX: mesh.position.x,
          baseY: mesh.position.y,
          baseZ: mesh.position.z,
        };

        scene.add(mesh);
        cubes.push({ mesh, speed });
      }

      // Subtle purple fog
      scene.fog = new THREE.Fog(dark ? 0x070C18 : 0xF0F4FF, 18, 40);

      let raf;
      const tick = () => {
        cubes.forEach(({ mesh, speed }) => {
          mesh.rotation.x += speed.rx;
          mesh.rotation.y += speed.ry;
          mesh.rotation.z += speed.rz;
          speed.fy += speed.floatSpeed;
          speed.fx += speed.floatSpeed * 0.7;
          speed.fz += speed.floatSpeed * 0.55;
          mesh.position.x = speed.baseX + Math.cos(speed.fx) * speed.driftX;
          mesh.position.y = speed.baseY + Math.sin(speed.fy) * speed.floatAmp;
          mesh.position.z = speed.baseZ + Math.sin(speed.fz) * speed.driftZ;
        });
        // Animate lights
        const t = Date.now() * 0.001;
        pointLight1.position.x = Math.sin(t * 0.4) * 8;
        pointLight1.position.y = Math.cos(t * 0.3) * 5;
        pointLight2.position.x = Math.cos(t * 0.35) * 7;
        pointLight2.position.y = Math.sin(t * 0.45) * 4;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      tick();

      const onResize = () => {
        const w = window.innerWidth, h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose();
      };
    };

    if (window.THREE) {
      const cleanup = initScene();
      return cleanup;
    } else {
      if (!script) {
        const s = document.createElement('script');
        s.id = 'threejs-cdn';
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        s.onload = () => { initScene(); };
        document.head.appendChild(s);
      } else {
        script.addEventListener('load', initScene, { once: true });
      }
    }
  }, [dark]);
  return canvasRef;
}


/* ═══════════════════════════════════════════
   COUNT-UP HOOK
═══════════════════════════════════════════ */
function useCountUp(page) {
  useEffect(() => {
    if(page !== 'home') return;
    let done = false;
    const run = () => {
      if(done) return;
      const els = document.querySelectorAll('.sa-stat-n[data-n]');
      if(!els.length) return;
      if(els[0].getBoundingClientRect().top > window.innerHeight) return;
      done = true;
      els.forEach(el => {
        const target = +el.dataset.n, suf = el.dataset.s || '';
        let cur = 0; const inc = target / (1800/16);
        const t = setInterval(() => { cur += inc; if(cur>=target){cur=target;clearInterval(t);} el.textContent = Math.round(cur) + suf; }, 16);
      });
    };
    run();
    window.addEventListener('scroll', run, {passive:true});
    return () => window.removeEventListener('scroll', run);
  }, [page]);
}

/* Toast */
function Toast({msg, type, show}) {
  return (
    <div className={`sa-toast ${type} ${show?'on':''}`}>
      <i className={`fas ${type==='err'?'fa-exclamation-circle':'fa-check-circle'}`}></i>
      <span>{msg}</span>
    </div>
  );
}

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const ADMIN_MASTER_PASSWORD = import.meta.env.VITE_ADMIN_MASTER_PASSWORD || 'admin123';

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function isAdminUser(user, admins = []) {
  const email = user?.email?.toLowerCase();
  if (email && (ADMIN_EMAILS.includes(email) || admins.some((a) => a.email === email))) return true;
  return user?.providerId === 'local-admin';
}

/* ═══════════════════════════════════════════
   MODAL: AUTH (LOG IN / SIGN IN)
═══════════════════════════════════════════ */
function ModalAuth({open, mode, onClose, onSuccess, onGoogleLogin, googleLoading, onManualLogin}) {
  const [tab, setTab] = useState(mode || 'login');
  const [loginForm, setLoginForm] = useState({id:'',pwd:''});
  const [signupForm, setSignupForm] = useState({nom:'',prenom:'',email:'',tel:'',pwd:''});

  useEffect(() => {
    if (open) setTab(mode || 'login');
  }, [mode, open]);

  const setLogin = k => e => setLoginForm(f => ({...f,[k]:e.target.value}));
  const setSignup = k => e => setSignupForm(f => ({...f,[k]:e.target.value}));

  const submitLogin = () => {
    if(!loginForm.id || !loginForm.pwd){
      onSuccess('Renseignez votre email/telephone et votre mot de passe.','err');
      return;
    }
    const result = onManualLogin(loginForm.id, loginForm.pwd);
    if(!result?.ok){
      onSuccess(result?.message || 'Identifiants invalides.','err');
      return;
    }
    onClose();
    onSuccess(result.message || 'Connexion reussie.','suc');
    setLoginForm({id:'',pwd:''});
  };

  const submitSignup = () => {
    if(!signupForm.nom || !signupForm.prenom || !signupForm.email || !signupForm.tel || !signupForm.pwd){
      onSuccess('Remplissez tous les champs obligatoires pour creer votre compte.','err');
      return;
    }
    const result = onManualLogin(signupForm.email, signupForm.pwd, `${signupForm.prenom} ${signupForm.nom}`, signupForm.tel);
    if(!result?.ok){
      onSuccess(result?.message || 'Inscription impossible.','err');
      return;
    }
    onClose();
    onSuccess(result.message || 'Compte cree et connecte avec succes.','suc');
    setSignupForm({nom:'',prenom:'',email:'',tel:'',pwd:''});
  };

  return (
    <div className={`sa-overlay ${open?'on':''}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sa-modal">
        <div className="sa-mhead">
          <div>
            <h3>Connexion espace client</h3>
            <p>{tab === 'login' ? 'Accedez a votre compte' : 'Creez votre compte en 1 minute'}</p>
          </div>
          <button className="sa-mclose" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="sa-auth-tabs">
          <button className={`sa-auth-tab ${tab==='login'?'on':''}`} onClick={()=>setTab('login')}>
            Log in
          </button>
          <button className={`sa-auth-tab ${tab==='signup'?'on':''}`} onClick={()=>setTab('signup')}>
            Sign in
          </button>
        </div>

        {tab === 'login' ? (
          <>
            <div className="sa-fg">
              <label>Email / telephone / admin *</label>
              <input
                placeholder="email@exemple.com, +213... ou admin@..."
                value={loginForm.id}
                onChange={setLogin('id')}
              />
            </div>
            <div className="sa-fg">
              <label>Mot de passe *</label>
              <input
                type="password"
                placeholder="Votre mot de passe"
                value={loginForm.pwd}
                onChange={setLogin('pwd')}
              />
            </div>
            <BtnP onClick={submitLogin} style={{width:'100%',justifyContent:'center',height:46,borderRadius:10,marginTop:4}}>
              <i className="fas fa-right-to-bracket"></i>Se connecter
            </BtnP>
            <div className="sa-auth-sep">ou</div>
            <button className="sa-google-btn" onClick={onGoogleLogin} disabled={googleLoading}>
              <span className="sa-google-mark">G</span>
              {googleLoading ? 'Connexion Google...' : 'Continuer avec Google'}
            </button>
          </>
        ) : (
          <>
            <div className="sa-form-row">
              <div className="sa-fg"><label>Nom *</label><input placeholder="Nom" value={signupForm.nom} onChange={setSignup('nom')} /></div>
              <div className="sa-fg"><label>Prenom *</label><input placeholder="Prenom" value={signupForm.prenom} onChange={setSignup('prenom')} /></div>
            </div>
            <div className="sa-form-row">
              <div className="sa-fg"><label>Email *</label><input type="email" placeholder="email@exemple.com" value={signupForm.email} onChange={setSignup('email')} /></div>
              <div className="sa-fg"><label>Telephone *</label><input type="tel" placeholder="+213 XX XX XX XX" value={signupForm.tel} onChange={setSignup('tel')} /></div>
            </div>
            <div className="sa-fg"><label>Mot de passe *</label><input type="password" placeholder="8 caracteres minimum" value={signupForm.pwd} onChange={setSignup('pwd')} /></div>
            <p className="sa-form-note">En creant un compte, vous recevrez vos informations de connexion sur votre email.</p>
            <BtnP onClick={submitSignup} style={{width:'100%',justifyContent:'center',height:46,borderRadius:10,marginTop:4}}>
              <i className="fas fa-user-plus"></i>Creer mon compte
            </BtnP>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODAL: INSCRIPTION
═══════════════════════════════════════════ */
function ModalInscription({open, formation, user, onClose, onSuccess, onSubmitInscription}) {
  const getNameParts = (value = '') => {
    const parts = String(value).trim().split(/\s+/).filter(Boolean);
    return {
      nom: parts.slice(1).join(' ') || '',
      prenom: parts[0] || '',
    };
  };

  const buildInitialForm = () => {
    const nameParts = getNameParts(user?.displayName || '');
    return {
      nom: nameParts.nom,
      prenom: nameParts.prenom,
      tel: user?.phoneNumber || '',
      niveau: FORMATION_LEVEL_OPTIONS[0],
      email: user?.email || '',
      statut: 'Etudiant',
    };
  };

  const [form, setForm] = useState(buildInitialForm);
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));

  useEffect(() => {
    if (open) setForm(buildInitialForm());
  }, [open, formation, user?.email, user?.displayName]);

  const submit = () => {
    if(!user?.email){
      onSuccess('Créez ou connectez-vous avec un compte avant de vous inscrire.','err');
      return;
    }
    if(!form.nom||!form.prenom||!form.tel||!form.niveau||!form.statut){
      onSuccess('Remplissez tous les champs obligatoires.','err');
      return;
    }
    onSubmitInscription?.({ ...form, email: user.email, formation });
    onClose();
    onSuccess('Inscription envoyee ! Notre equipe vous recontacte rapidement.','suc');
    setForm(buildInitialForm());
  };
  return (
    <div className={`sa-overlay ${open?'on':''}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sa-modal">
        <div className="sa-mhead">
          <div><h3>Inscription à la formation</h3><p>{formation}</p></div>
          <button className="sa-mclose" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Nom *</label><input placeholder="Nom" value={form.nom} onChange={set('nom')}/></div>
          <div className="sa-fg"><label>Prenom *</label><input placeholder="Prenom" value={form.prenom} onChange={set('prenom')}/></div>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Telephone *</label><input type="tel" placeholder="+213 XX XX XX XX" value={form.tel} onChange={set('tel')}/></div>
          <div className="sa-fg">
            <label>Niveau *</label>
            <select value={form.niveau} onChange={set('niveau')}>
              {FORMATION_LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="sa-fg"><label>Email *</label><input type="email" placeholder="votre@email.com" value={form.email} readOnly /></div>
        <div className="sa-fg">
          <label>Profession *</label>
          <select value={form.statut} onChange={set('statut')}>
            <option>Etudiant</option>
            <option>Employe</option>
            <option>Demandeur de travail</option>
          </select>
        </div>
        <div className="sa-info-box"><i className="fas fa-info-circle"></i>Votre dossier d'inscription sera valide par notre equipe pedagogique sous 24h ouvrables.</div>
        <BtnP onClick={submit} style={{width:'100%',justifyContent:'center',height:46,borderRadius:10}}><i className="fas fa-user-check"></i>Envoyer mon inscription</BtnP>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODAL: DEVIS LOGICIEL
═══════════════════════════════════════════ */
function ModalDevis({open, logiciel, onClose, onSuccess, onSubmitDevis}) {
  const [form, setForm] = useState({nom:'',wilaya:'',commune:'',tel:'',email:'',poste:'',users:'1 - 10 utilisateurs',msg:''});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.nom||!form.wilaya||!form.commune||!form.tel||!form.email){onSuccess('Remplissez tous les champs obligatoires.','err');return;}
    onSubmitDevis?.({ ...form, logiciel });
    onClose(); onSuccess('Demande envoyée ! Notre équipe vous contacte sous 24h.','suc');
    setForm({nom:'',wilaya:'',commune:'',tel:'',email:'',poste:'',users:'1 - 10 utilisateurs',msg:''});
  };
  return (
    <div className={`sa-overlay ${open?'on':''}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sa-modal">
        <div className="sa-mhead">
          <div><h3>Demande de devis</h3><p>{logiciel ? `Logiciel : ${logiciel}` : 'Demande generale'}</p></div>
          <button className="sa-mclose" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Nom complet *</label><input placeholder="Prenom Nom" value={form.nom} onChange={set('nom')}/></div>
          <div className="sa-fg"><label>Wilaya *</label><input placeholder="Ex: Guelma" value={form.wilaya} onChange={set('wilaya')}/></div>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Commune *</label><input placeholder="Votre commune" value={form.commune} onChange={set('commune')}/></div>
          <div className="sa-fg"><label>Numero de telephone *</label><input type="tel" placeholder="+213 XX XX XX XX" value={form.tel} onChange={set('tel')}/></div>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Email *</label><input type="email" placeholder="email@exemple.com" value={form.email} onChange={set('email')}/></div>
          <div className="sa-fg"><label>Poste / Fonction</label><input placeholder="Ex: Responsable archive" value={form.poste} onChange={set('poste')}/></div>
        </div>
        <div className="sa-fg"><label>Nombre d'utilisateurs</label>
          <select value={form.users} onChange={set('users')}>
            <option>1 - 10 utilisateurs</option><option>11 - 50 utilisateurs</option>
            <option>51 - 200 utilisateurs</option><option>200+ utilisateurs</option>
          </select>
        </div>
        <div className="sa-fg"><label>Besoins specifiques</label><textarea placeholder="Decrivez votre projet..." value={form.msg} onChange={set('msg')} style={{minHeight:80}}/></div>
        <BtnP onClick={submit} style={{width:'100%',justifyContent:'center',height:46,borderRadius:10,marginTop:4}}><i className="fas fa-paper-plane"></i>Envoyer ma demande</BtnP>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer({go}) {
  return (
    <footer className="sa-footer">
      <div className="sa-foot-grid">
        <div className="sa-foot-brand">
          <button className="sa-logo" onClick={()=>go('home')}>
            <div className="sa-logo-ring">SA</div>
            <div className="sa-logo-txt"><b>Smart Archives</b><span>Excellence Documentaire</span></div>
          </button>
          <p>Votre partenaire de confiance pour l'archivage, la numérisation, les logiciels métiers et les formations professionnelles en Algérie.</p>
          <div className="sa-socials">
            {[['fab fa-facebook-f','https://www.facebook.com/share/1HHfwmZNXE/'],['fab fa-linkedin-in','#'],['fab fa-x-twitter','#'],['fab fa-whatsapp','https://wa.me/213672040820']].map(([ic,hr],i)=>(
              <a href={hr} target="_blank" rel="noopener noreferrer" className="sa-soc" key={i}><i className={ic}></i></a>
            ))}
          </div>
        </div>
        <div className="sa-foot-col"><h5>Services</h5>
          <ul className="sa-foot-links">
            {['Archivage Physique','Numérisation','Archivage Numérique','Gestion Électronique','Confidentialité'].map(l=><li key={l}><a onClick={()=>go('services')}>{l}</a></li>)}
          </ul>
        </div>
        <div className="sa-foot-col"><h5>Formations</h5>
          <ul className="sa-foot-links">
            {['Bureautique','Développement Web','Cybersécurité','Gestion Documentaire','Management'].map(l=><li key={l}><a onClick={()=>go('formations')}>{l}</a></li>)}
          </ul>
        </div>
        <div className="sa-foot-col"><h5>Contact</h5>
          <ul className="sa-foot-links">
            <li><a><i className="fas fa-location-dot" style={{marginRight:7,color:'var(--blue)'}}></i>Geulma, Algeria</a></li>
            <li><a><i className="fas fa-phone" style={{marginRight:7,color:'var(--blue)'}}></i>037 140 773 / 0672 040 820</a></li>
            <li><a><i className="fas fa-envelope" style={{marginRight:7,color:'var(--blue)'}}></i>smartarchive.rg@gmail.com</a></li>
            <li><a onClick={()=>go('contact')} style={{color:'var(--blue)',fontWeight:600}}>→ Demander un devis</a></li>
          </ul>
        </div>
      </div>
      <div className="sa-foot-bar">
        <span>© 2025 Smart Archives — Tous droits réservés</span>
        <div style={{display:'flex',gap:20}}>
          <a href="#">Politique de confidentialité</a>
          <a href="#">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
  CHATBOT OLLAMA AVEC RECONNAISSANCE VOCALE
═══════════════════════════════════════════ */
const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Smart Archives, une entreprise algérienne spécialisée dans :
- L'archivage physique et numérique de documents
- La numérisation (scan HD, OCR multilingue arabe/français/anglais)
- Les logiciels métiers : SmartCourrier, SmartArchives, SmartBiblio, SmartGED, SmartLearn, SmartContracts
- Les formations professionnelles certifiantes (bureautique, développement web, cybersécurité, gestion documentaire)

Réponds toujours en français. Sois professionnel, concis et bienveillant.
Pour les prix : SmartCourrier=120.000DA/an, SmartArchives=180.000DA/an, SmartBiblio=90.000DA/an, SmartLearn=15.000DA/mois, SmartGED=sur devis, SmartContracts=sur devis.
Les formations vont de 15.000DA à 90.000DA selon le programme.
Encourage l'utilisateur à demander un devis gratuit ou à contacter l'équipe pour des besoins spécifiques.
Réponds de manière conversationnelle avec des réponses courtes (2-4 phrases maximum).`;

const SUGGESTIONS = [
  "💰 Tarifs des logiciels",
  "📚 Formations disponibles",
  "📦 Archivage physique",
  "🔒 Sécurité des données",
  "📞 Demander un devis",
];

const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || 'gemma:2b';
const OLLAMA_API_URL = import.meta.env.VITE_OLLAMA_API_URL || 'http://127.0.0.1:11434/api/chat';
const OLLAMA_API_KEY = import.meta.env.VITE_OLLAMA_API_KEY || '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_GEMINI = !!GEMINI_API_KEY;
const AI_PROVIDER_LABEL = USE_GEMINI ? 'Gemini' : 'Ollama';
const AI_MODEL_LABEL = USE_GEMINI ? GEMINI_MODEL : OLLAMA_MODEL;
const SA_STORAGE_FORMATIONS = 'sa_formations_catalog_v1';
const SA_STORAGE_ADMIN_DATA = 'sa_admin_data_v1';
const SA_STORAGE_ACCOUNTS = 'sa_local_accounts_v1';

const DEFAULT_FORMATION_TOPS = {
  bur: 'linear-gradient(90deg,#2563EB,#4F46E5)',
  dev: 'linear-gradient(90deg,#8B5CF6,#4F46E5)',
  cyb: 'linear-gradient(90deg,#EF4444,#F59E0B)',
  ges: 'linear-gradient(90deg,#10B981,#0EA5E9)',
};

function normalizePhone(value = '') {
  return String(value).replace(/[^\d+]/g, '');
}

function normalizeFormation(formation = {}, fallback = {}) {
  const cat = formation.cat || fallback.cat || 'ges';
  const courses = Array.isArray(formation.courses)
    ? formation.courses
    : Array.isArray(fallback.courses)
      ? fallback.courses
      : [];
  return {
    cat,
    top: formation.top || fallback.top || DEFAULT_FORMATION_TOPS[cat] || DEFAULT_FORMATION_TOPS.ges,
    title: (formation.title || fallback.title || '').trim(),
    desc: formation.desc ?? fallback.desc ?? '',
    dur: formation.dur ?? fallback.dur ?? '',
    lvl: formation.lvl || fallback.lvl || FORMATION_LEVEL_OPTIONS[0],
    fmt: formation.fmt ?? fallback.fmt ?? '',
    prix: String(formation.prix ?? fallback.prix ?? ''),
    mode: formation.mode || fallback.mode || FORMATION_MODE_OPTIONS[0],
    courses,
  };
}

function safeReadStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function safeWriteStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function buildDefaultAdminData() {
  return {
    inscriptions: [],
    devis: [],
    contacts: [],
    admins: (ADMIN_EMAILS.length ? ADMIN_EMAILS : ['admin@smart-archives.dz']).map((email, i) => ({
      id: `adm-${i}`,
      name: email.split('@')[0] || `Admin ${i + 1}`,
      email,
      password: ADMIN_MASTER_PASSWORD,
    })),
    certificates: FORMATIONS.map((f, i) => ({ id: `cert-${i}`, formation: f.title, published: false })),
    planning: FORMATIONS.map((f, i) => ({ id: `plan-${i}`, formation: f.title, pushed: false })),
  };
}

function findLocalAccount(accounts, identifier) {
  const needle = String(identifier || '').trim();
  if (!needle) return null;
  const email = needle.toLowerCase();
  const phone = normalizePhone(needle);
  return accounts.find((account) => {
    if ((account.email || '').toLowerCase() === email) return true;
    if (normalizePhone(account.phone || '') && normalizePhone(account.phone || '') === phone) return true;
    return false;
  }) || null;
}

function Chatbot({ dark }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role:'bot', text:`Bonjour ! 👋 Je suis l'assistant Smart Archives propulsé par **${AI_MODEL_LABEL} via ${AI_PROVIDER_LABEL}**.\n\nComment puis-je vous aider aujourd'hui ? Je dispose d'une base de connaissances complète sur nos services, logiciels et formations pour vous répondre avec précision. ✅ RAG activé`, time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const msgsEnd = useRef(null);
  const taRef = useRef(null);
  const [unread, setUnread] = useState(1);
  
  // États pour la reconnaissance vocale
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileProcessing, setFileProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const fileTypes = '.pdf,.docx,.txt,.csv,.xlsx,.png,.jpg,.jpeg';

  const fileIcon = (name = '') => {
    const ext = name.toLowerCase().split('.').pop() || '';
    if (ext === 'pdf') return 'fa-file-pdf';
    if (ext === 'docx' || ext === 'txt') return 'fa-file-lines';
    if (ext === 'csv' || ext === 'xlsx') return 'fa-table';
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return 'fa-image';
    return 'fa-file';
  };

  const formatSize = (bytes = 0) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB'];
    let value = bytes;
    let idx = 0;
    while (value >= 1024 && idx < units.length - 1) {
      value /= 1024;
      idx += 1;
    }
    return `${value.toFixed(idx === 0 ? 0 : 2)} ${units[idx]}`;
  };

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.lang = 'fr-FR';
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.maxAlternatives = 1;
      
      recognitionInstance.onstart = () => {
        setIsListening(true);
        setError('');
        setTranscript('');
      };
      
      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText;
          } else {
            interimTranscript += transcriptText;
          }
        }
        
        if (finalTranscript) {
          setInput(finalTranscript);
          setTranscript('');
        } else if (interimTranscript) {
          setTranscript(interimTranscript);
          setInput(interimTranscript);
        }
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Erreur reconnaissance vocale:', event.error);
        let errorMsg = '';
        switch(event.error) {
          case 'not-allowed':
            errorMsg = 'Microphone non autorisé. Vérifiez les permissions.';
            break;
          case 'no-speech':
            errorMsg = 'Aucune parole détectée. Réessayez.';
            break;
          case 'audio-capture':
            errorMsg = 'Aucun microphone trouvé.';
            break;
          case 'network':
            errorMsg = 'Erreur réseau. Vérifiez votre connexion.';
            break;
          default:
            errorMsg = `Erreur microphone: ${event.error}`;
        }
        setError(errorMsg);
        setIsListening(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          setInput(transcript);
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      setSpeechSupported(false);
      console.warn('Reconnaissance vocale non supportée par ce navigateur');
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setError('');
      } catch (error) {
        console.error('Erreur démarrage:', error);
        setError('Impossible de démarrer le microphone. Vérifiez les permissions.');
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  useEffect(() => { if(open) { setUnread(0); setTimeout(()=>msgsEnd.current?.scrollIntoView({behavior:'smooth'}),100); } }, [open]);
  useEffect(() => { msgsEnd.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  const autoResize = () => {
    const ta = taRef.current; if(!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const now = () => new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  const buildCsvPreview = (txt = '') => {
    const lines = txt.split(/\r?\n/).filter(Boolean).slice(0, 8);
    if (!lines.length) return '';
    const rows = lines.map((line) => line.split(',').map((c) => c.trim()));
    const header = rows[0] || [];
    if (!header.length) return txt.slice(0, 2000);
    const sep = header.map(() => '---');
    const body = rows.slice(1).map((r) => `| ${r.join(' | ')} |`);
    return [`| ${header.join(' | ')} |`, `| ${sep.join(' | ')} |`, ...body].join('\n');
  };

  const processFileInBrowser = async (file) => {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const meta = {
      name: file.name,
      size: file.size,
      sizeLabel: formatSize(file.size),
      type: file.type,
    };

    if (ext === 'txt') {
      const txt = (await file.text()).trim();
      return {
        fileMeta: meta,
        aiContext: `Contenu du fichier TXT ${file.name}:\n${txt.slice(0, 12000)}`,
      };
    }

    if (ext === 'csv') {
      const txt = await file.text();
      const preview = buildCsvPreview(txt);
      return {
        fileMeta: meta,
        aiContext: `Tableau CSV extrait depuis ${file.name}:\n${preview}`,
      };
    }

    if (ext === 'xlsx') {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' }).slice(0, 8);
      const text = rows.length ? JSON.stringify(rows, null, 2) : 'Aucune donnée tabulaire détectée.';
      return {
        fileMeta: meta,
        aiContext: `Tableau XLSX extrait depuis ${file.name}:\n${text}`,
      };
    }

    if (['png', 'jpg', 'jpeg'].includes(ext)) {
      return {
        fileMeta: meta,
        aiContext: `Image reçue: ${file.name} (${formatSize(file.size)}). Décrivez l'image selon le nom du fichier et la demande utilisateur.`,
      };
    }

    throw new Error('Traitement local non disponible pour ce type. Lancez le serveur API avec npm run server ou npm run dev:full.');
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if((!msg && !selectedFile) || loading || fileProcessing) return;
    setInput(''); setError('');
    setTranscript('');
    if(taRef.current) taRef.current.style.height='42px';

    let processedFile = null;
    if (selectedFile) {
      try {
        setFileProcessing(true);
        const fd = new FormData();
        fd.append('file', selectedFile);
        const res = await fetch(`${API_BASE_URL}/chat/process-file`, {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          throw new Error(errBody.message || 'Echec du traitement du fichier.');
        }
        processedFile = await res.json();
      } catch (e) {
        try {
          processedFile = await processFileInBrowser(selectedFile);
          setError('Serveur fichier indisponible: utilisation du traitement local (TXT/CSV/XLSX/Image).');
        } catch (fallbackError) {
          setError(String(fallbackError?.message || e?.message || 'Traitement de fichier impossible.'));
          setFileProcessing(false);
          return;
        }
      } finally {
        setFileProcessing(false);
      }
    }

    const userMsg = {
      role:'user',
      text: msg || 'Analyse ce fichier.',
      time: now(),
      attachment: processedFile?.fileMeta || (selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        sizeLabel: formatSize(selectedFile.size),
      } : null),
    };
    setMsgs(m=>[...m, userMsg]);
    setLoading(true);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const history = [...msgs, userMsg]
      .filter(m=>m.role!=='bot'||msgs.indexOf(m)>0)
      .map(m=>({role: m.role==='user' ? 'user' : 'assistant', content: m.text}));

    // ── RAG : récupérer le contexte pertinent avant d'appeler le LLM ──
    const { context: ragContext, source: ragSource } = await retrieveRagContext(msg, 4);
    const ragPrompt = buildRagSystemPrompt(ragContext);
    const contextualPrompt = processedFile?.aiContext
      ? `${ragPrompt}\n\nContexte fichier utilisateur:\n${processedFile.aiContext}`
      : ragPrompt;

    try {
      const askOllama = async () => {
        const headers = {
          'Content-Type':'application/json',
        };
        if (OLLAMA_API_KEY) {
          headers.Authorization = `Bearer ${OLLAMA_API_KEY}`;
        }

        const res = await fetch(OLLAMA_API_URL, {
          method:'POST',
          headers,
          body: JSON.stringify({
            model: OLLAMA_MODEL,
            messages: [
              { role: 'system', content: contextualPrompt },
              ...history,
            ],
            stream: false,
            options: {
              temperature:0.4,
              num_predict:512,
            },
          })
        });

        if(!res.ok) {
          const errTxt = await res.text();
          throw new Error(`Erreur Ollama (${res.status}) ${errTxt.slice(0, 180)}`);
        }

        const data = await res.json();
        return (data.message?.content || data.response || '').trim();
      };

      let reply = '';
      let usedFallback = false;

      if (USE_GEMINI) {
        const geminiHistory = history.map((h) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        }));

        const res = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: contextualPrompt }] },
            contents: geminiHistory,
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 512,
            },
          }),
        });

        if (!res.ok) {
          const errTxt = await res.text();
          if ([429, 500, 503].includes(res.status)) {
            try {
              reply = await askOllama();
              usedFallback = true;
            } catch (ollamaErr) {
              throw new Error(`Erreur Gemini (${res.status}) ${errTxt.slice(0, 180)} | Fallback Ollama échoué: ${String(ollamaErr?.message || ollamaErr)}`);
            }
          } else {
            throw new Error(`Erreur Gemini (${res.status}) ${errTxt.slice(0, 180)}`);
          }
        }

        if (!usedFallback) {
          const data = await res.json();
          reply = (data?.candidates?.[0]?.content?.parts || [])
            .map((p) => p?.text || '')
            .join('')
            .trim();
        }
      } else {
        reply = await askOllama();
      }

      reply = reply || "Désolé, je n'ai pas pu générer une réponse.";
      if (usedFallback) {
        reply += "\n\n*(Réponse de secours via Ollama: quota Gemini temporairement atteint.)*";
      }
      setMsgs(m=>[...m, {role:'bot', text:reply, time:now()}]);
    } catch(e) {
      const errMsg = String(e?.message || 'Erreur inconnue');
      if (USE_GEMINI) {
        setError(
          errMsg.includes('429')
            ? "❌ Quota Gemini dépassé pour le moment. Le chatbot peut basculer sur Ollama si disponible."
            :
          errMsg.includes('401') || errMsg.includes('403')
            ? "❌ Clé Gemini invalide ou non autorisée. Vérifiez VITE_GEMINI_API_KEY."
            : `Erreur : ${errMsg}`
        );
        setMsgs(m=>[...m, {role:'bot', text:"Je rencontre un problème avec l'API Gemini. Vérifiez la clé API puis réessayez.", time:now()}]);
      } else {
        setError(errMsg.includes('fetch') || errMsg.includes('Failed')
            ? "❌ Impossible de se connecter à Ollama. Vérifiez que Ollama est lancé et que l'URL API est correcte"
            : `Erreur : ${errMsg}`);
        setMsgs(m=>[...m, {role:'bot', text:"Je rencontre un problème de connexion à Ollama. Vérifiez que le service tourne puis réessayez.", time:now()}]);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMsgs([{role:'bot', text:"Conversation réinitialisée. Comment puis-je vous aider ?", time:now()}]);
    setError('');
    setTranscript('');
  };

  const fmtText = (txt) =>
    txt.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
       .replace(/\*(.*?)\*/g,'<em>$1</em>')
       .replace(/\n/g,'<br/>');

  return (
    <>
      {/* ══ BOUTON CHAT ══ */}
      <button
        onClick={()=>setOpen(o=>!o)}
        style={{
          position:'fixed', bottom:28, right:28, zIndex:800,
          display:'flex', alignItems:'center', gap:10,
          height:52, padding:'0 18px 0 8px',
          borderRadius:99, border:'none', cursor:'pointer',
          background:'linear-gradient(135deg,#2563EB,#4F46E5)',
          boxShadow:'0 8px 28px rgba(37,99,235,.4)',
          transition:'all .25s cubic-bezier(.34,1.56,.64,1)',
          fontFamily:"'Inter',sans-serif",
        }}
        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px) scale(1.04)';e.currentTarget.style.boxShadow='0 14px 40px rgba(37,99,235,.5)';}}
        onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 8px 28px rgba(37,99,235,.4)';}}
      >
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:'rgba(255,255,255,.2)',
          border:'1.5px solid rgba(255,255,255,.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:18, flexShrink:0,
        }}>
          {open ? '✕' : '🤖'}
        </div>
        <div style={{display:'flex', flexDirection:'column', lineHeight:1.2}}>
          <span style={{fontSize:13, fontWeight:700, color:'#fff', fontFamily:"'Bricolage Grotesque',sans-serif"}}>
            {open ? 'Fermer' : 'Assistant IA'}
          </span>
          <span style={{fontSize:10.5, color:'rgba(255,255,255,.75)', display:'flex', alignItems:'center', gap:4}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}></span>
            {loading ? 'Répond…' : `${AI_MODEL_LABEL} · ${speechSupported ? 'Micro 🎤' : 'Texte'}`}
          </span>
        </div>
        {!open && unread > 0 && (
          <div style={{
            position:'absolute', top:4, right:6,
            width:17, height:17, borderRadius:'50%',
            background:'#EF4444', color:'#fff',
            fontSize:9, fontWeight:700,
            display:'flex', alignItems:'center', justifyContent:'center',
            border:'2px solid #fff',
          }}>{unread}</div>
        )}
      </button>

      {/* ══ OVERLAY ══ */}
      <div
        onClick={e=>e.target===e.currentTarget&&setOpen(false)}
        style={{
          position:'fixed', inset:0, zIndex:1000,
          background: open ? 'rgba(0,0,0,.4)' : 'transparent',
          backdropFilter: open ? 'blur(6px)' : 'none',
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:20,
          pointerEvents: open ? 'all' : 'none',
          transition:'background .3s, backdrop-filter .3s',
        }}
      >
        <div style={{
          width:'100%', maxWidth:500,
          height:'min(640px, calc(100vh - 80px))',
          borderRadius:24,
          overflow:'hidden',
          display:'flex', flexDirection:'column',
          position:'relative',
          border:'1px solid var(--border)',
          boxShadow:'0 32px 100px rgba(0,0,0,.25), 0 8px 32px rgba(37,99,235,.15)',
          background: dark
            ? 'linear-gradient(160deg, rgba(13,20,37,.96), rgba(17,28,48,.92))'
            : 'linear-gradient(160deg, rgba(255,255,255,.97), rgba(242,246,255,.92))',
          transform: open ? 'scale(1) translateY(0)' : 'scale(.9) translateY(24px)',
          opacity: open ? 1 : 0,
          transition:'all .4s cubic-bezier(.34,1.56,.64,1)',
          pointerEvents: open ? 'all' : 'none',
        }}>

          {/* BACKGROUND ANIME CHATBOT */}
          <div style={{
            position:'absolute', inset:0, zIndex:0,
            pointerEvents:'none', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', inset:0,
              background: dark
                ? 'radial-gradient(ellipse 130% 100% at 84% 10%, rgba(79,70,229,.20), transparent 54%), radial-gradient(ellipse 100% 90% at 10% 92%, rgba(14,165,233,.16), transparent 56%)'
                : 'radial-gradient(ellipse 130% 100% at 84% 10%, rgba(79,70,229,.16), transparent 54%), radial-gradient(ellipse 100% 90% at 10% 92%, rgba(14,165,233,.13), transparent 56%)',
            }}></div>

            <div style={{
              position:'absolute',
              left:'50%',
              top:'58%',
              width:'88%',
              height:'52%',
              transform:'translate(-50%, -50%)',
              borderRadius:24,
              background: dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.88)',
              border: dark ? '1px solid rgba(255,255,255,.12)' : '1px solid rgba(255,255,255,.95)',
              boxShadow: dark ? '0 16px 42px rgba(0,0,0,.28)' : '0 22px 44px rgba(37,99,235,.15)',
              animation:'float3 7.2s ease-in-out infinite',
            }}></div>

            <div style={{
              position:'absolute',
              left:'50%',
              top:'58%',
              width:'84%',
              height:'46%',
              transform:'translate(-50%, -50%)',
              borderRadius:20,
              border: dark ? '1px dashed rgba(129,167,255,.22)' : '1px dashed rgba(79,70,229,.24)',
              opacity: dark ? 0.55 : 0.65,
              animation:'chatOrbitSpin 24s linear infinite',
            }}></div>

            <div style={{
              position:'absolute', inset:'-130px',
              backgroundImage:'linear-gradient(to right, rgba(79,70,229,.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,.18) 1px, transparent 1px)',
              backgroundSize:'26px 26px',
              opacity: dark ? 0.18 : 0.12,
              transform:'rotate(8deg)',
              animation:'chatGridDrift 18s linear infinite',
            }}></div>

            <div style={{
              position:'absolute', left:'-20%', right:'-20%', top:'-42%',
              height:'54%',
              background: dark
                ? 'linear-gradient(180deg, rgba(37,99,235,0) 0%, rgba(79,70,229,.30) 52%, rgba(14,165,233,0) 100%)'
                : 'linear-gradient(180deg, rgba(37,99,235,0) 0%, rgba(79,70,229,.20) 52%, rgba(14,165,233,0) 100%)',
              filter:'blur(2px)',
              animation:'chatScanSweep 5.8s ease-in-out infinite',
            }}></div>

            <div style={{
              position:'absolute', right:-20, top:88,
              width:132, height:132, borderRadius:'50%',
              background: dark ? 'rgba(79,70,229,.24)' : 'rgba(79,70,229,.17)',
              filter:'blur(4px)',
              animation:'float2 8s ease-in-out infinite',
            }}></div>

            <div style={{
              position:'absolute', left:-18, bottom:120,
              width:104, height:104, borderRadius:'50%',
              background: dark ? 'rgba(14,165,233,.20)' : 'rgba(14,165,233,.14)',
              filter:'blur(3px)',
              animation:'float3 9s ease-in-out infinite',
            }}></div>

            <div style={{
              position:'absolute', right:18, bottom:84,
              width:126, height:140, borderRadius:28,
              border: dark ? '1px solid rgba(129,167,255,.26)' : '1px solid rgba(37,99,235,.20)',
              background: dark ? 'rgba(17,28,48,.56)' : 'rgba(240,244,255,.76)',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              boxShadow: dark ? '0 16px 42px rgba(0,0,0,.36)' : '0 16px 36px rgba(37,99,235,.16)',
              animation:'chatBotFloat 6.5s ease-in-out infinite',
            }}>
              <div style={{display:'flex', gap:8, marginBottom:8, opacity:.75}}>
                <span style={{width:7,height:7,borderRadius:'50%',background: dark ? 'rgba(129,167,255,.75)' : 'rgba(37,99,235,.72)', animation:'statusPulse 1.9s ease-in-out infinite'}}></span>
                <span style={{width:7,height:7,borderRadius:'50%',background: dark ? 'rgba(129,167,255,.75)' : 'rgba(37,99,235,.72)', animation:'statusPulse 1.9s .25s ease-in-out infinite'}}></span>
              </div>
              <i className="fas fa-robot" style={{
                fontSize:54,
                color: dark ? 'rgba(129,167,255,.46)' : 'rgba(37,99,235,.40)',
              }}></i>
              <div style={{
                marginTop:8,
                width:58, height:3, borderRadius:99,
                background: dark ? 'rgba(129,167,255,.45)' : 'rgba(37,99,235,.36)',
              }}></div>
              <div style={{
                position:'absolute', inset:-8, borderRadius:30,
                border: dark ? '1px dashed rgba(129,167,255,.24)' : '1px dashed rgba(37,99,235,.20)',
                animation:'chatOrbitSpin 16s linear infinite',
              }}></div>
            </div>

            <div style={{
              position:'absolute', inset:0,
              background: dark
                ? 'linear-gradient(180deg, rgba(13,20,37,.20) 0%, rgba(13,20,37,.06) 40%, rgba(13,20,37,.34) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.01) 40%, rgba(255,255,255,.30) 100%)',
            }}></div>
          </div>

          <div style={{position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%'}}>

          {/* HEADER */}
          <div style={{
            padding:'16px 18px',
            background:'linear-gradient(135deg,#2563EB,#4F46E5)',
            display:'flex', alignItems:'center', gap:12,
            flexShrink:0, position:'relative', overflow:'hidden',
          }}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 120% at 75% 50%,rgba(255,255,255,.15),transparent 65%)',pointerEvents:'none'}}></div>
            <div style={{
              width:42, height:42, borderRadius:14,
              background:'rgba(255,255,255,.2)',
              border:'1.5px solid rgba(255,255,255,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, flexShrink:0, position:'relative', zIndex:1,
            }}>🤖</div>
            <div style={{flex:1, position:'relative', zIndex:1}}>
              <div style={{fontSize:15, fontWeight:700, color:'#fff', fontFamily:"'Bricolage Grotesque',sans-serif"}}>
                Assistant Smart Archives
              </div>
              <div style={{fontSize:11.5, color:'rgba(255,255,255,.75)', display:'flex', alignItems:'center', gap:5, marginTop:2}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#4ade80',display:'inline-block',
                  animation:'statusPulse 2s infinite'}}></span>
                {loading ? '⌛ En train de réfléchir…' : `En ligne · ${AI_MODEL_LABEL} ${speechSupported ? '· Micro 🎤' : ''}`}
              </div>
            </div>
            <div style={{display:'flex', gap:6, position:'relative', zIndex:1}}>
              <button onClick={clearChat} title="Réinitialiser" style={{
                width:30,height:30,borderRadius:8,background:'rgba(255,255,255,.15)',
                border:'none',color:'#fff',fontSize:14,cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                transition:'background .2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.28)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
              >↺</button>
              <button onClick={()=>setOpen(false)} title="Fermer" style={{
                width:30,height:30,borderRadius:8,background:'rgba(255,255,255,.15)',
                border:'none',color:'#fff',fontSize:16,cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',
                transition:'background .2s',
              }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.28)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
              >✕</button>
            </div>
          </div>

          {/* BADGE POWERED */}
          <div style={{
            padding:'6px 18px', fontSize:11, fontWeight:600, textAlign:'center',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            flexShrink:0, color:'var(--t3)',
            borderBottom:'1px solid var(--border)',
            background:'rgba(79,70,229,.06)',
          }}>
            <span>⚡</span>
            RAG + IA {USE_GEMINI ? 'cloud' : 'locale'} ·&nbsp;
            <span style={{background:'linear-gradient(135deg,#2563EB,#4F46E5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:700}}>
              {AI_MODEL_LABEL}
            </span>
            &nbsp;via {AI_PROVIDER_LABEL} {USE_GEMINI ? 'API' : '· 🔒 Connexion locale'}
            {speechSupported && <span style={{marginLeft:6}}>🎤</span>}
          </div>

          {/* MESSAGES */}
          <div ref={msgsEnd}
            style={{flex:1, overflowY:'auto', padding:'18px 16px', display:'flex', flexDirection:'column', gap:14}}
          >
            {msgs.map((m,i)=>(
              <div key={i} style={{
                display:'flex', gap:9, alignItems:'flex-end',
                flexDirection: m.role==='user' ? 'row-reverse' : 'row',
                animation:'msgIn .3s ease both',
              }}>
                <div style={{
                  width:30,height:30,borderRadius:10,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:14,flexShrink:0,
                  background: m.role==='bot' ? 'linear-gradient(135deg,#2563EB,#4F46E5)' : 'var(--bg3)',
                  border: m.role==='user' ? '1px solid var(--border)' : 'none',
                }}>
                  {m.role==='bot' ? '🤖' : '👤'}
                </div>
                <div style={{
                  display:'flex',flexDirection:'column',maxWidth:'80%',
                  alignItems: m.role==='user' ? 'flex-end' : 'flex-start',
                }}>
                  <div
                    dangerouslySetInnerHTML={{__html:fmtText(m.text)}}
                    style={{
                      padding:'11px 15px',
                      borderRadius: m.role==='bot' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                      fontSize:13.5, lineHeight:1.65,
                      background: m.role==='bot' ? 'var(--bg3)' : 'linear-gradient(135deg,#2563EB,#4F46E5)',
                      color: m.role==='bot' ? 'var(--t1)' : '#fff',
                      border: m.role==='bot' ? '1px solid var(--border)' : 'none',
                      wordBreak:'break-word',
                    }}
                  />
                  {m.attachment && (
                    <div style={{
                      marginTop: 8,
                      border: '1px solid var(--border)',
                      background: 'var(--bg2)',
                      borderRadius: 10,
                      padding: '8px 10px',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'center',
                      fontSize: 12,
                      color: 'var(--t2)',
                    }}>
                      <i className={`fas ${fileIcon(m.attachment.name)}`}></i>
                      <span style={{fontWeight: 600, color: 'var(--t1)'}}>{m.attachment.name}</span>
                      <span style={{fontSize: 11}}>{m.attachment.sizeLabel || formatSize(m.attachment.size)}</span>
                    </div>
                  )}
                  <div style={{fontSize:10,color:'var(--t3)',marginTop:4,padding:'0 4px'}}>{m.time}</div>
                </div>
              </div>
            ))}

            {/* Indicateur de dictée active */}
            {isListening && (
              <div style={{display:'flex', gap:9, alignItems:'flex-end'}}>
                <div style={{width:30,height:30,borderRadius:10,background:'linear-gradient(135deg,#EF4444,#DC2626)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>
                  🎤
                </div>
                <div style={{
                  padding:'11px 15px',
                  borderRadius:'4px 18px 18px 18px',
                  background:'var(--bg3)',
                  border:'1px solid var(--border)',
                  display:'flex',
                  alignItems:'center',
                  gap:8
                }}>
                  <div style={{display:'flex', gap:3}}>
                    {[0,1,2,3].map(j=>(
                      <span key={j} style={{
                        width:3,
                        height:12 + Math.sin(Date.now() / 200 + j) * 4,
                        borderRadius:2,
                        background:'#EF4444',
                        display:'inline-block',
                        animation:`wave 0.8s ease-in-out infinite`,
                        animationDelay: `${j * 0.1}s`
                      }}></span>
                    ))}
                  </div>
                  <span style={{fontSize:13, color:'var(--t2)'}}>
                    {transcript || "Parlez maintenant..."}
                  </span>
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {loading && (
              <div style={{display:'flex',gap:9,alignItems:'flex-end'}}>
                <div style={{width:30,height:30,borderRadius:10,background:'linear-gradient(135deg,#2563EB,#4F46E5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,flexShrink:0}}>🤖</div>
                <div style={{padding:'13px 16px',borderRadius:'4px 18px 18px 18px',background:'var(--bg3)',border:'1px solid var(--border)',display:'flex',gap:5,alignItems:'center'}}>
                  {[0,1,2].map(j=>(
                    <span key={j} style={{
                      width:7,height:7,borderRadius:'50%',background:'#2563EB',display:'inline-block',
                      animation:`bounce 1.2s ${j*.2}s ease-in-out infinite`,opacity:.4,
                    }}></span>
                  ))}
                  {fileProcessing && <span style={{fontSize:12,color:'var(--t2)',marginLeft:6}}>Traitement du fichier…</span>}
                </div>
              </div>
            )}
            <div ref={msgsEnd}></div>
          </div>

          {/* ERREUR */}
          {error && (
            <div style={{
              margin:'0 14px 10px',padding:'10px 14px',borderRadius:12,
              background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',
              fontSize:12.5,color:'#EF4444',lineHeight:1.55,
            }}>⚠️ {error}</div>
          )}

          {/* SUGGESTIONS */}
          {msgs.length <= 2 && !loading && !isListening && (
            <div style={{padding:'8px 14px 4px',display:'flex',flexWrap:'wrap',gap:6,flexShrink:0,borderTop:'1px solid var(--border)'}}>
              {SUGGESTIONS.map((s,i)=>(
                <button key={i} onClick={()=>send(s.replace(/^[^\s]+ /,''))} style={{
                  padding:'5px 12px',borderRadius:99,fontSize:12,fontWeight:600,
                  cursor:'pointer',border:'1px solid var(--border)',
                  background:'var(--bg3)',color:'var(--t2)',
                  transition:'all .2s',whiteSpace:'nowrap',fontFamily:"'Inter',sans-serif",
                }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='#2563EB';e.currentTarget.style.color='#2563EB';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--t2)';}}
                >{s}</button>
              ))}
            </div>
          )}

          {/* INPUT AVEC MICROPHONE */}
          <div style={{
            margin:'10px 14px 14px',
            padding:8,
            display:'flex',
            position:'relative',
            gap:8,
            alignItems:'flex-end',
            border:'1px solid var(--border)',
            borderRadius:16,
            flexShrink:0,
            background: dark ? 'rgba(17,28,48,.78)' : 'rgba(255,255,255,.9)',
            boxShadow: dark ? '0 10px 26px rgba(0,0,0,.24)' : '0 8px 22px rgba(37,99,235,.10)',
            backdropFilter:'blur(10px)',
          }}>
            <input
              ref={fileInputRef}
              type="file"
              accept={fileTypes}
              style={{ display: 'none' }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                if (f.size > 10 * 1024 * 1024) {
                  setError('Fichier trop volumineux. Taille max: 10 MB.');
                  return;
                }
                setSelectedFile(f);
                setError('');
              }}
            />

            <textarea
              ref={taRef}
              placeholder={isListening ? "🎤 Écoute en cours... Parlez maintenant" : (speechSupported ? "Posez votre question ou 🎤 dictez..." : "Posez votre question...")}
              value={input}
              onChange={e=>{setInput(e.target.value);autoResize();}}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              rows={1}
              disabled={loading || isListening}
              style={{
                flex:1, border:'1px solid var(--border)', borderRadius:12,
                padding:'11px 14px', fontSize:14, fontFamily:"'Inter',sans-serif",
                color:'var(--t1)', resize:'none', outline:'none',
                lineHeight:1.5, maxHeight:120, minHeight:46,
                background: dark ? 'rgba(255,255,255,.04)' : 'var(--bg3)',
                boxShadow:'var(--s1)',
                transition:'border-color .2s, box-shadow .2s',
              }}
              onFocus={e=>{e.target.style.borderColor='#2563EB';e.target.style.boxShadow='0 0 0 3px rgba(37,99,235,.14)';}}
              onBlur={e=>{e.target.style.borderColor='var(--border)';e.target.style.boxShadow='var(--s1)';}}
            />

            {selectedFile && (
              <div style={{
                position: 'absolute',
                left: 28,
                right: 150,
                bottom: 72,
                border: '1px solid var(--border)',
                borderRadius: 12,
                background: 'var(--bg2)',
                padding: '6px 9px',
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                color: 'var(--t2)',
              }}>
                <i className={`fas ${fileIcon(selectedFile.name)}`} style={{color:'#2563EB'}}></i>
                <span style={{fontWeight:600,color:'var(--t1)'}}>{selectedFile.name}</span>
                <span>{formatSize(selectedFile.size)}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  style={{marginLeft:'auto',border:'none',background:'transparent',cursor:'pointer',color:'var(--t2)'}}
                >
                  ✕
                </button>
              </div>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || fileProcessing}
              style={{
                width:46,
                height:46,
                borderRadius:12,
                border:'1px solid var(--border)',
                background:'var(--bg3)',
                color:'var(--t2)',
                fontSize:16,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                cursor:'pointer',
                flexShrink:0,
              }}
              title="Joindre un fichier"
            >
              <i className="fas fa-paperclip"></i>
            </button>
            
            {/* BOUTON MICROPHONE */}
            {speechSupported && (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={loading}
                style={{
                  width:46,
                  height:46,
                  borderRadius:12,
                  border:'none',
                  background: isListening
                    ? 'linear-gradient(135deg,#EF4444,#DC2626)'
                    : 'linear-gradient(135deg,#6366F1,#8B5CF6)',
                  color:'#fff',
                  fontSize:18,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink:0,
                  boxShadow: isListening
                    ? '0 0 0 3px rgba(239,68,68,.3)'
                    : '0 4px 16px rgba(99,102,241,.35)',
                  transition:'all .2s',
                  animation: isListening ? 'pulse 1.5s ease-in-out infinite' : 'none',
                }}
                title={isListening ? "Arrêter l'écoute" : "Démarrer la dictée vocale"}
              >
                <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
              </button>
            )}
            
            {/* BOUTON ENVOYER */}
            <button
              onClick={()=>send()}
              disabled={loading || fileProcessing || (!input.trim() && !selectedFile)}
              style={{
                width:46,height:46,borderRadius:12,border:'none',
                background: loading || fileProcessing || (!input.trim() && !selectedFile) ? '#CBD5E1' : 'linear-gradient(135deg,#2563EB,#4F46E5)',
                color:'#fff',fontSize:16,
                display:'flex',alignItems:'center',justifyContent:'center',
                cursor: loading || fileProcessing || (!input.trim() && !selectedFile) ? 'not-allowed' : 'pointer',
                flexShrink:0,
                boxShadow: loading || fileProcessing || (!input.trim() && !selectedFile) ? 'none' : '0 4px 16px rgba(37,99,235,.35)',
                transition:'all .2s',
              }}
            >
              {loading || fileProcessing ? '⌛' : '➤'}
            </button>
          </div>

          {/* Indicateur de support vocal */}
          {!speechSupported && (
            <div style={{
              margin:'0 14px 14px',
              padding:'6px 10px',
              borderRadius:8,
              fontSize:10,
              textAlign:'center',
              color:'var(--t3)',
              background: dark ? 'rgba(0,0,0,.2)' : 'rgba(0,0,0,.05)',
            }}>
              💡 Dictée vocale disponible sur Chrome, Edge ou Safari
            </div>
          )}

        </div>{/* fin contenu chat */}

        </div>{/* fin carte */}
      </div>{/* fin overlay */}

      {/* Animation styles pour le micro */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
        
        @keyframes wave {
          0%, 100% { height: 8px; }
          50% { height: 18px; }
        }
      `}</style>
    </>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function SmartArchives() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState('home');
  const [flash, setFlash] = useState('');
  const [mnavOpen, setMnavOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formationsCatalog, setFormationsCatalog] = useState(() => safeReadStorage(SA_STORAGE_FORMATIONS, FORMATIONS));
  const [adminData, setAdminData] = useState(() => safeReadStorage(SA_STORAGE_ADMIN_DATA, buildDefaultAdminData()));
  const [localAccounts, setLocalAccounts] = useState(() => safeReadStorage(SA_STORAGE_ACCOUNTS, []));
  const [authModal, setAuthModal] = useState({open:false,mode:'login'});
  const [insModal, setInsModal] = useState({open:false,f:''});
  const [dvModal, setDvModal] = useState({open:false,l:''});
  const [pendingInscriptionFormation, setPendingInscriptionFormation] = useState('');
  const [toast, setToast] = useState({msg:'',type:'suc',show:false});
  const canvasRef = useThreeCubes(dark);
  const currentUser = authUser || localUser;
  const isAdmin = isAdminUser(currentUser, adminData.admins);
  const paidEnrollments = useMemo(() => {
    const userEmail = currentUser?.email?.toLowerCase();
    if (!userEmail) return [];
    return adminData.inscriptions.filter(
      (ins) =>
        (ins.email || '').toLowerCase() === userEmail &&
        ins.status === 'accepted' &&
        ins.paymentStatus === 'paid'
    );
  }, [adminData.inscriptions, currentUser]);
  const hasStudentSpaceAccess = isAdmin || paidEnrollments.length > 0;
  const publishedMap = useMemo(() => ({
    certificatesByTitle: Object.fromEntries(adminData.certificates.map((c) => [c.formation, c.published])),
    planningByTitle: Object.fromEntries(adminData.planning.map((p) => [p.formation, p.pushed])),
  }), [adminData]);
  useCountUp(page);

  // inject and refresh styles safely
  useEffect(() => {
    let styleEl = document.getElementById('sa-styles');
    if(!styleEl){
      styleEl = document.createElement('style');
      styleEl.id = 'sa-styles';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = STYLES;

    if(!document.getElementById('sa-fa-link')){
      const link = document.createElement('link');
      link.id = 'sa-fa-link';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
      document.head.appendChild(link);
    }
  }, []);

  // scroll to top on page change
  useEffect(() => { window.scrollTo({top:0,behavior:'smooth'}); }, [page]);

  useEffect(() => {
    const unsubscribe = watchAuthState((user) => {
      setAuthUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SA_STORAGE_FORMATIONS, JSON.stringify(formationsCatalog));
    } catch {}
  }, [formationsCatalog]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SA_STORAGE_ADMIN_DATA, JSON.stringify(adminData));
    } catch {}
  }, [adminData]);

  useEffect(() => {
    safeWriteStorage(SA_STORAGE_ACCOUNTS, localAccounts);
  }, [localAccounts]);

  useEffect(() => {
    setAdminData((prev) => {
      const certificateMap = new Map((prev.certificates || []).map((item) => [String(item.formation || '').toLowerCase(), item]));
      const planningMap = new Map((prev.planning || []).map((item) => [String(item.formation || '').toLowerCase(), item]));
      let changed = false;
      const nextCertificates = formationsCatalog.map((formation) => {
        const key = String(formation.title || '').toLowerCase();
        const existing = certificateMap.get(key);
        if (existing) return existing;
        changed = true;
        return { id: makeId(), formation: formation.title, published: false };
      });
      const nextPlanning = formationsCatalog.map((formation) => {
        const key = String(formation.title || '').toLowerCase();
        const existing = planningMap.get(key);
        if (existing) return existing;
        changed = true;
        return { id: makeId(), formation: formation.title, pushed: false };
      });
      const sameLength = nextCertificates.length === (prev.certificates || []).length && nextPlanning.length === (prev.planning || []).length;
      if (!changed && sameLength) return prev;
      return { ...prev, certificates: nextCertificates, planning: nextPlanning };
    });
  }, [formationsCatalog]);

  const go = useCallback((p) => {
    setPage(p);
    setMnavOpen(false);
    document.querySelectorAll('.sa-r').forEach(el=>el.classList.remove('v'));
    setTimeout(()=>document.querySelectorAll('.sa-r').forEach(el=>{
      if(el.getBoundingClientRect().top<window.innerHeight-50)el.classList.add('v');
    }),100);
  }, []);

  const toggleTheme = () => {
    setFlash(dark?'rgba(240,244,255,.5)':'rgba(7,12,24,.35)');
    setTimeout(()=>setFlash(''),400);
    setDark(d=>!d);
  };

  const showToast = (msg, type='suc') => {
    setToast({msg,type,show:true});
    setTimeout(()=>setToast(t=>({...t,show:false})),4000);
  };

  const openIns = (f) => {
    if (!currentUser) {
      setPendingInscriptionFormation(f);
      setAuthModal({ open: true, mode: 'signup' });
      showToast('Créez un compte avant de vous inscrire.', 'err');
      return;
    }
    setInsModal({open:true,f});
  };
  const openDv  = (l) => setDvModal({open:true,l});
  const openAuth = (mode='login') => setAuthModal({open:true,mode});

  const loginWithAccount = (identifier, name, admin = false) => {
    const simpleName = name || (identifier?.includes('@') ? identifier.split('@')[0] : identifier);
    setLocalUser({
      displayName: simpleName || 'Etudiant',
      email: identifier || '',
      providerId: admin ? 'local-admin' : 'local',
      metadata: { lastSignInTime: new Date().toISOString() },
    });
    setPage(admin ? 'admin' : 'espace');
  };

  const handleUnifiedLogin = (identifier, pwd, name, phone) => {
    const id = (identifier || '').trim();
    const pass = (pwd || '').trim();
    if (!id || !pass) return { ok: false, message: 'Renseignez les identifiants.' };

    const byEmail = adminData.admins.find((a) => a.email.toLowerCase() === id.toLowerCase());
    if (byEmail) {
      if (pass !== byEmail.password) {
        return { ok: false, message: 'Mot de passe admin incorrect.' };
      }
      loginWithAccount(id, byEmail.name || 'Administrateur', true);
      return { ok: true, message: 'Connexion admin reussie.' };
    }

    const matchedAccount = findLocalAccount(localAccounts, id);

    if (name) {
      if (matchedAccount) {
        return { ok: false, message: 'Ce compte existe deja. Connectez-vous avec votre mot de passe.' };
      }

      const displayName = name.trim();
      const email = id.toLowerCase();
      const phone = normalizePhone(id);
      setLocalAccounts((prev) => [
        {
          id: makeId(),
          displayName,
          email,
          phone: phone || id,
          password: pass,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      loginWithAccount(email, displayName, false);
      return { ok: true, message: 'Compte cree. Vous pourrez vous reconnecter plus tard avec ce mot de passe.' };
    }

    if (!matchedAccount) {
      return { ok: false, message: 'Aucun compte trouve. Creez un compte d’abord.' };
    }

    if (matchedAccount.password !== pass) {
      return { ok: false, message: 'Mot de passe incorrect.' };
    }

    loginWithAccount(matchedAccount.email, matchedAccount.displayName || matchedAccount.email, false);
    return { ok: true, message: 'Connexion reussie.' };
  };

  const loginWithGoogle = async () => {
    if (!isFirebaseAuthConfigured()) {
      showToast('Configuration Firebase absente. Verifiez le fichier .env.', 'err');
      return;
    }

    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      const userLabel = res.user?.displayName || res.user?.email || 'Utilisateur';
      setLocalUser(null);
      setAuthModal({open:false,mode:'login'});
      setPage('espace');
      showToast(`Connexion Google reussie: ${userLabel}`, 'suc');
    } catch (error) {
      if (error?.code === 'auth/popup-closed-by-user') {
        showToast('Connexion Google annulee.', 'err');
      } else {
        showToast(error?.message || 'Connexion Google impossible.', 'err');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const logoutGoogle = async () => {
    if (localUser && !authUser) {
      setLocalUser(null);
      showToast('Deconnexion reussie.', 'suc');
      setPage('home');
      return;
    }

    try {
      await signOutGoogle();
      showToast('Deconnexion reussie.', 'suc');
      setPage('home');
    } catch {
      showToast('Erreur de deconnexion.', 'err');
    }
  };

  useEffect(() => {
    if (page === 'espace' && !currentUser) {
      setPage('home');
      setAuthModal({open:true,mode:'login'});
      showToast('Connectez-vous pour acceder a votre espace.', 'err');
    }
  }, [page, currentUser]);

  useEffect(() => {
    if (page === 'espace' && currentUser && !hasStudentSpaceAccess) {
      setPage('home');
      showToast('Espace formation actif uniquement apres validation et paiement.', 'err');
    }
  }, [page, currentUser, hasStudentSpaceAccess]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 'admin' && currentUser && !isAdmin) {
        setPage('home');
        showToast('Acces admin reserve.', 'err');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [page, currentUser, isAdmin]);

  useEffect(() => {
    if (!pendingInscriptionFormation || !currentUser) return;
    setInsModal({open:true,f:pendingInscriptionFormation});
    setPendingInscriptionFormation('');
    setAuthModal({open:false,mode:'login'});
  }, [currentUser, pendingInscriptionFormation]);

  const addInscriptionRequest = (payload) => {
    setAdminData((prev) => ({
      ...prev,
      inscriptions: [{
        id: makeId(),
        ...payload,
        status: 'pending',
        paymentStatus: 'unpaid',
        completed: false,
        certificatePushed: false,
        certificateDownloaded: false,
        createdAt: new Date().toISOString(),
      }, ...prev.inscriptions],
    }));
  };

  const addDevisRequest = (payload) => {
    setAdminData((prev) => ({
      ...prev,
      devis: [{ id: makeId(), ...payload, createdAt: new Date().toISOString() }, ...prev.devis],
    }));
  };

  const addContactRequest = (payload) => {
    setAdminData((prev) => ({
      ...prev,
      contacts: [{ id: makeId(), ...payload, createdAt: new Date().toISOString() }, ...prev.contacts],
    }));
  };

  const acceptInscription = (id) => {
    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((ins) => (ins.id === id ? { ...ins, status: 'accepted' } : ins)),
    }));
    showToast('Inscription acceptee.', 'suc');
  };

  const rejectInscription = (id) => {
    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((ins) => (ins.id === id ? { ...ins, status: 'rejected' } : ins)),
    }));
    showToast('Inscription refusee.', 'err');
  };

  const setPaymentStatus = (id) => {
    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((ins) =>
        ins.id === id ? { ...ins, paymentStatus: ins.paymentStatus === 'paid' ? 'unpaid' : 'paid' } : ins
      ),
    }));
  };

  const toggleCompleted = (id) => {
    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((ins) =>
        ins.id === id ? { ...ins, completed: !ins.completed } : ins
      ),
    }));
  };

  const pushStudentCertificate = (id) => {
    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((ins) => {
        if (ins.id !== id) return ins;
        if (ins.status !== 'accepted' || ins.paymentStatus !== 'paid' || !ins.completed) return ins;
        return { ...ins, certificatePushed: true };
      }),
    }));
    showToast('Certificat etudiant pousse.', 'suc');
  };

  const markCertificateDownloaded = (inscriptionId) => {
    if (!inscriptionId) return;
    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((ins) =>
        ins.id === inscriptionId
          ? {
              ...ins,
              certificateDownloaded: true,
              certificateDownloadedAt: new Date().toISOString(),
            }
          : ins
      ),
    }));
  };

  const addAdmin = ({ name, email, password }) => {
    const mail = (email || '').trim().toLowerCase();
    if (!mail || !password || !name) {
      showToast('Nom, email et mot de passe admin obligatoires.', 'err');
      return;
    }
    setAdminData((prev) => {
      if (prev.admins.some((a) => a.email === mail)) return prev;
      return {
        ...prev,
        admins: [{ id: makeId(), name, email: mail, password }, ...prev.admins],
      };
    });
    showToast('Nouvel admin ajoute.', 'suc');
  };

  const toggleCertificate = (id) => {
    setAdminData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((c) => (c.id === id ? { ...c, published: !c.published } : c)),
    }));
    showToast('Mise a jour certificats effectuee.', 'suc');
  };

  const togglePlanningPush = (id) => {
    setAdminData((prev) => ({
      ...prev,
      planning: prev.planning.map((p) => (p.id === id ? { ...p, pushed: !p.pushed } : p)),
    }));
    showToast('Mise a jour planning effectuee.', 'suc');
  };

  const addFormation = (formation) => {
    const normalized = normalizeFormation(formation);
    const title = normalized.title;
    if (!title) {
      showToast('Titre de formation obligatoire.', 'err');
      return;
    }

    let created = false;
    setFormationsCatalog((prev) => {
      if (prev.some((f) => f.title.toLowerCase() === title.toLowerCase())) {
        return prev;
      }
      created = true;
      return [normalized, ...prev];
    });

    if (!created) {
      showToast('Cette formation existe deja.', 'err');
      return;
    }

    setAdminData((prev) => ({
      ...prev,
      certificates: [{ id: makeId(), formation: title, published: false }, ...prev.certificates],
      planning: [{ id: makeId(), formation: title, pushed: false }, ...prev.planning],
    }));
    showToast('Formation ajoutee et visible sur le site.', 'suc');
  };

  const addFormationCourse = (formationTitle, course) => {
    const targetTitle = (formationTitle || '').trim().toLowerCase();
    const courseTitle = (course?.title || '').trim();
    if (!targetTitle || !courseTitle) {
      showToast('Choisissez une formation et donnez un titre au cours.', 'err');
      return;
    }

    let added = false;
    setFormationsCatalog((prev) => prev.map((formation) => {
      if ((formation.title || '').toLowerCase() !== targetTitle) return formation;
      const existingCourses = Array.isArray(formation.courses) ? formation.courses : [];
      if (existingCourses.some((item) => (item.title || '').toLowerCase() === courseTitle.toLowerCase())) {
        return formation;
      }
      added = true;
      return {
        ...formation,
        courses: [
          {
            id: makeId(),
            title: courseTitle,
            description: (course.description || '').trim(),
            duration: (course.duration || '').trim(),
            level: course.level || FORMATION_LEVEL_OPTIONS[0],
            pdfName: course.pdfName || '',
            pdfData: course.pdfData || '',
            pdfType: course.pdfType || '',
          },
          ...existingCourses,
        ],
      };
    }));

    if (!added) {
      showToast('Ce cours existe déjà pour cette formation ou la formation est introuvable.', 'err');
      return;
    }

    showToast('Cours ajouté à la formation.', 'suc');
  };

  const updateFormationCourse = (formationTitle, courseId, course) => {
    const targetTitle = (formationTitle || '').trim().toLowerCase();
    if (!targetTitle || !courseId) {
      showToast('Formation ou cours introuvable.', 'err');
      return;
    }

    const nextTitle = (course?.title || '').trim();
    if (!nextTitle) {
      showToast('Titre du cours obligatoire.', 'err');
      return;
    }

    let updated = false;
    setFormationsCatalog((prev) => prev.map((formation) => {
      if ((formation.title || '').toLowerCase() !== targetTitle) return formation;
      const nextCourses = (Array.isArray(formation.courses) ? formation.courses : []).map((item) => {
        if (item.id !== courseId) return item;
        updated = true;
        return {
          ...item,
          title: nextTitle,
          description: (course.description || '').trim(),
          duration: (course.duration || '').trim(),
          level: course.level || FORMATION_LEVEL_OPTIONS[0],
          pdfName: course.pdfName || item.pdfName || '',
          pdfData: course.pdfData || item.pdfData || '',
          pdfType: course.pdfType || item.pdfType || '',
        };
      });
      return { ...formation, courses: nextCourses };
    }));

    if (!updated) {
      showToast('Cours introuvable.', 'err');
      return;
    }

    showToast('Cours mis à jour.', 'suc');
  };

  const removeFormationCourse = (formationTitle, courseId) => {
    const targetTitle = (formationTitle || '').trim().toLowerCase();
    if (!targetTitle || !courseId) return;

    setFormationsCatalog((prev) => prev.map((formation) => {
      if ((formation.title || '').toLowerCase() !== targetTitle) return formation;
      return {
        ...formation,
        courses: (Array.isArray(formation.courses) ? formation.courses : []).filter((item) => item.id !== courseId),
      };
    }));
    showToast('Cours supprimé.', 'suc');
  };

  const updateFormation = (previousTitle, formation) => {
    const previousKey = (previousTitle || '').trim().toLowerCase();
    const previousFormation = formationsCatalog.find((item) => (item.title || '').toLowerCase() === previousKey) || {};
    const normalized = normalizeFormation(formation, previousFormation);
    if (!previousKey || !normalized.title) {
      showToast('Titre de formation obligatoire.', 'err');
      return;
    }

    let updated = false;
    setFormationsCatalog((prev) => {
      const exists = prev.some((item) => item.title.toLowerCase() === normalized.title.toLowerCase() && item.title.toLowerCase() !== previousKey);
      if (exists) {
        return prev;
      }

      updated = true;
      return prev.map((item) => (item.title.toLowerCase() === previousKey ? { ...item, ...normalized, courses: Array.isArray(item.courses) ? item.courses : [] } : item));
    });

    if (!updated) {
      showToast('Cette formation existe deja.', 'err');
      return;
    }

    setAdminData((prev) => ({
      ...prev,
      inscriptions: prev.inscriptions.map((item) =>
        (item.formation || '').toLowerCase() === previousKey ? { ...item, formation: normalized.title } : item
      ),
      certificates: prev.certificates.map((item) =>
        item.formation.toLowerCase() === previousKey ? { ...item, formation: normalized.title } : item
      ),
      planning: prev.planning.map((item) =>
        item.formation.toLowerCase() === previousKey ? { ...item, formation: normalized.title } : item
      ),
    }));
    showToast('Formation mise a jour et synchronisee.', 'suc');
  };

  const removeFormation = (title) => {
    const cleanTitle = (title || '').trim().toLowerCase();
    if (!cleanTitle) return;

    setFormationsCatalog((prev) => prev.filter((f) => (f.title || '').toLowerCase() !== cleanTitle));
    setAdminData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => (c.formation || '').toLowerCase() !== cleanTitle),
      planning: prev.planning.filter((p) => (p.formation || '').toLowerCase() !== cleanTitle),
    }));
    showToast('Formation retiree du site.', 'suc');
  };

  // scroll nav
  useEffect(() => {
    const h=()=>document.querySelector('.sa-nav')?.classList.toggle('scrolled',window.scrollY>80);
    window.addEventListener('scroll',h,{passive:true});
    return()=>window.removeEventListener('scroll',h);
  },[]);

  const BASE_PAGES = ['home','services','formations','logiciels','contact'];
  const PAGES = [
    ...BASE_PAGES,
    ...(hasStudentSpaceAccess ? ['espace'] : []),
    ...(isAdmin ? ['admin'] : []),
  ];
  const LABELS = {home:'Accueil',services:'Services',formations:'Formations',logiciels:'Logiciels',contact:'Contact',espace:'Mon espace',admin:'Admin'};
  const ICONS  = {home:'fa-house',services:'fa-box-archive',formations:'fa-graduation-cap',logiciels:'fa-laptop-code',contact:'fa-envelope',espace:'fa-user-graduate',admin:'fa-user-shield'};

  return (
    <div className={`sa-root ${dark?'dark':'light'}`}>
      {/* THEME FLASH */}
      <div className="sa-tflash" style={{background:flash}}></div>

      {/* ANIMATED BACKGROUND */}
      <canvas className="sa-canvas" ref={canvasRef}></canvas>
      <div className="sa-cube-fx" aria-hidden="true">
        <span className="sa-cube-fx-w c1"><span className="sa-cube-fx-i"></span></span>
        <span className="sa-cube-fx-w c2"><span className="sa-cube-fx-i"></span></span>
        <span className="sa-cube-fx-w c3"><span className="sa-cube-fx-i"></span></span>
        <span className="sa-cube-fx-w c4"><span className="sa-cube-fx-i"></span></span>
        <span className="sa-cube-fx-w c5"><span className="sa-cube-fx-i"></span></span>
        <span className="sa-cube-fx-w c6"><span className="sa-cube-fx-i"></span></span>
      </div>
      <div className="sa-bg-grid"></div>
      <div className="sa-orb sa-orb1"></div>
      <div className="sa-orb sa-orb2"></div>
      <div className="sa-orb sa-orb3"></div>
      <div className="sa-orb sa-orb4"></div>

      {/* NAVBAR */}
      <nav className="sa-nav" id="sa-nav">
        <button className="sa-logo" onClick={()=>go('home')}>
          <div className="sa-logo-ring">SA</div>
          <div className="sa-logo-txt"><b>Smart Archives</b><span>Excellence Documentaire</span></div>
        </button>
        <div className="sa-nav-divider"></div>
        <div className="sa-nav-links">
          {PAGES.map(p=><button key={p} className={`sa-nl ${page===p?'on':''}`} onClick={()=>go(p)}>{LABELS[p]}</button>)}
        </div>
        <div className="sa-nav-divider"></div>
        <div className="sa-nav-right">
          <button className="sa-btn-ghost" onClick={toggleTheme} title="Changer le thème">
            <i className={`fas ${dark?'fa-sun':'fa-moon'}`}></i>
          </button>
          {currentUser ? (
            <>
              <div className="sa-user-chip" title={currentUser.email || 'Compte utilisateur'}>
                <i className="fas fa-circle-user"></i>
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'Compte'}
              </div>
              <button className="sa-btn-auth" onClick={logoutGoogle}>
                <i className="fas fa-right-from-bracket"></i>Deconnexion
              </button>
            </>
          ) : (
            <button className="sa-btn-auth" onClick={()=>openAuth('login')}>
              <i className="fas fa-right-to-bracket"></i>Connexion
            </button>
          )}
          <button className="sa-btn-cta" onClick={()=>go('contact')}><i className="fas fa-paper-plane"></i>Devis gratuit</button>
          <button className="sa-ham" onClick={()=>setMnavOpen(true)}><span></span><span></span><span></span></button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div className={`sa-mnav ${mnavOpen?'on':''}`}>
        <div className="sa-mnav-head">
          <button className="sa-logo" onClick={()=>go('home')}>
            <div className="sa-logo-ring">SA</div>
            <div className="sa-logo-txt"><b>Smart Archives</b><span>Excellence Documentaire</span></div>
          </button>
          <button className="sa-btn-ghost" onClick={()=>setMnavOpen(false)}><i className="fas fa-times"></i></button>
        </div>
        <div className="sa-mnav-links">
          {PAGES.map(p=><button key={p} className={`sa-mnl ${page===p?'on':''}`} onClick={()=>go(p)}><i className={`fas ${ICONS[p]}`}></i>{LABELS[p]}</button>)}
        </div>
        <div style={{marginTop:'auto',display:'grid',gap:10}}>
          {currentUser ? (
            <button
              className="sa-btn-o"
              style={{width:'100%',justifyContent:'center',height:50,borderRadius:12,fontSize:15}}
              onClick={async ()=>{
                setMnavOpen(false);
                await logoutGoogle();
              }}
            >
              <i className="fas fa-right-from-bracket"></i>Deconnexion
            </button>
          ) : (
            <button
              className="sa-btn-o"
              style={{width:'100%',justifyContent:'center',height:50,borderRadius:12,fontSize:15}}
              onClick={()=>{setMnavOpen(false);openAuth('login');}}
            >
              <i className="fas fa-right-to-bracket"></i>Connexion
            </button>
          )}
          <button className="sa-btn-cta" style={{width:'100%',justifyContent:'center',height:50,borderRadius:12,fontSize:15}} onClick={()=>go('contact')}>
            <i className="fas fa-paper-plane"></i>Demander un devis
          </button>
        </div>
      </div>

      {/* PAGES */}
      <div className={`sa-page ${page==='home'?'on':''}`}>
        <PageHome go={go}/>
      </div>
      <div className={`sa-page ${page==='services'?'on':''}`}>
        <PageServices go={go}/>
      </div>
      <div className={`sa-page ${page==='formations'?'on':''}`}>
        <PageFormations openIns={openIns} formations={formationsCatalog}/>
      </div>
      <div className={`sa-page ${page==='logiciels'?'on':''}`}>
        <PageLogiciels openDv={openDv}/>
      </div>
      <div className={`sa-page ${page==='contact'?'on':''}`}>
        <PageContact onSuccess={showToast} onSubmitContact={addContactRequest}/>
      </div>
      <div className={`sa-page ${page==='espace'?'on':''}`}>
        <StudentPortalPage
          user={currentUser}
          adminPublished={publishedMap}
          enrollments={paidEnrollments}
          catalog={formationsCatalog}
          onCertificateDownload={markCertificateDownloaded}
        />
      </div>
      <div className={`sa-page ${page==='admin'?'on':''}`}>
        <AdminDashboardPage
          user={currentUser}
          data={adminData}
          formations={formationsCatalog}
          onAcceptInscription={acceptInscription}
          onRejectInscription={rejectInscription}
          onSetPaymentStatus={setPaymentStatus}
          onToggleCompleted={toggleCompleted}
          onPushStudentCertificate={pushStudentCertificate}
          onAddAdmin={addAdmin}
          onAddFormation={addFormation}
          onUpdateFormation={updateFormation}
          onRemoveFormation={removeFormation}
          onAddFormationCourse={addFormationCourse}
          onUpdateFormationCourse={updateFormationCourse}
          onRemoveFormationCourse={removeFormationCourse}
          onToggleCertificate={toggleCertificate}
          onPushPlanning={togglePlanningPush}
        />
      </div>

      {/* FOOTER */}
      <Footer go={go}/>

      {/* CHATBOT AVEC MICROPHONE */}
      <Chatbot dark={dark}/>

      {/* MODALS */}
      <ModalAuth
        open={authModal.open}
        mode={authModal.mode}
        onClose={()=>setAuthModal({open:false,mode:'login'})}
        onSuccess={showToast}
        onGoogleLogin={loginWithGoogle}
        googleLoading={googleLoading}
        onManualLogin={handleUnifiedLogin}
      />
      <ModalInscription
        open={insModal.open}
        formation={insModal.f}
        user={currentUser}
        onClose={()=>setInsModal({open:false,f:''})}
        onSuccess={showToast}
        onSubmitInscription={addInscriptionRequest}
      />
      <ModalDevis
        open={dvModal.open}
        logiciel={dvModal.l}
        onClose={()=>setDvModal({open:false,l:''})}
        onSuccess={showToast}
        onSubmitDevis={addDevisRequest}
      />

      {/* TOAST */}
      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}