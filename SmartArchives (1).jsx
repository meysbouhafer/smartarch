import { useState, useEffect, useRef, useCallback } from "react";

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
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
  transition: background 0.5s ease, color 0.4s ease;
}

/* ── LIGHT ── */
.sa-root.light {
  --bg: #F0F4FF; --bg2: #FFFFFF; --bg3: #E8EEFF;
  --border: #DDE3F5; --border2: #C4CEEE;
  --t1: #0A0F2C; --t2: #3D4D6A; --t3: #8494B2;
  --blue-bg: rgba(37,99,235,.07); --green-bg: rgba(16,185,129,.08);
  --amber-bg: rgba(245,158,11,.08); --red-bg: rgba(239,68,68,.08); --violet-bg: rgba(139,92,246,.08);
  --s1: 0 1px 4px rgba(37,99,235,.06), 0 1px 2px rgba(0,0,0,.04);
  --s2: 0 4px 16px rgba(37,99,235,.08), 0 1px 3px rgba(0,0,0,.04);
  --s3: 0 8px 32px rgba(37,99,235,.10), 0 2px 8px rgba(0,0,0,.04);
  --s4: 0 20px 60px rgba(37,99,235,.13);
  --sb: 0 8px 28px rgba(37,99,235,.32);
  background: var(--bg); color: var(--t1);
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

/* ── CANVAS BG (Three.js cubes — right side) ── */
.sa-canvas {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  display: block;
  /* Fade: cubes visible on right, invisible on left */
  -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 30%, black 55%, black 100%);
  mask-image: linear-gradient(to right, transparent 0%, transparent 30%, black 55%, black 100%);
}
.sa-root.dark  .sa-canvas { opacity: 1; }
.sa-root.light .sa-canvas { opacity: 0.5; }

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
  transition: all .4s cubic-bezier(.4,0,.2,1);
}
.sa-root.light .sa-nav { background: rgba(255,255,255,.8); box-shadow: 0 8px 32px rgba(37,99,235,.10), 0 0 0 1px rgba(37,99,235,.06); border-color: rgba(255,255,255,.95); }
.sa-root.dark  .sa-nav { background: rgba(13,20,37,.85); border-color: rgba(255,255,255,.07); box-shadow: 0 8px 32px rgba(0,0,0,.4); }
.sa-nav.scrolled { top: 0; width: 100%; max-width: 100%; border-radius: 0; border-left: none; border-right: none; border-top: none; }

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
.sa-nl { padding:7px 13px; border-radius:9px; font-size:13px; font-weight:500; color:var(--t2); background:none; border:none; cursor:pointer; transition:all .2s; white-space:nowrap; font-family:'Inter',sans-serif; }
.sa-nl:hover { background:var(--bg3); color:var(--t1); }
.sa-nl.on { color:var(--blue); background:var(--blue-bg); font-weight:600; }

.sa-nav-right { display:flex; align-items:center; gap:8px; flex-shrink:0; margin-left:8px; }
.sa-btn-ghost {
  width:36px; height:36px; border-radius:9px; background:var(--bg3); border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center; font-size:14px; color:var(--t2);
  cursor:pointer; transition:all .2s; flex-shrink:0;
}
.sa-btn-ghost:hover { border-color:var(--blue); color:var(--blue); transform:scale(1.05); }
.sa-btn-cta {
  height:36px; padding:0 16px; background:var(--grad); border:none; border-radius:9px;
  color:#fff; font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px;
  box-shadow:var(--sb); cursor:pointer; transition:all .25s cubic-bezier(.4,0,.2,1); white-space:nowrap; font-family:'Inter',sans-serif;
  flex-shrink:0;
}
.sa-btn-cta:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(37,99,235,.38); }

/* ── PAGES ── */
.sa-page { display:none; padding-top:64px; position:relative; z-index:1; min-height:100vh; }
.sa-page.on { display:block; }

/* ── HERO ── */
.sa-hero {
  min-height: calc(100vh - 64px);
  max-width: min(var(--content-wide, 1260px), calc(100% - 40px));
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
  width: min(620px, 52vw);
  aspect-ratio: 1 / 1;
  border-radius: 999px;
  pointer-events: none;
  z-index: 0;
}
.sa-root.light .sa-hero::before {
  background: radial-gradient(circle, rgba(79,70,229,.22) 0%, rgba(14,165,233,.14) 38%, transparent 72%);
}
.sa-root.dark .sa-hero::before {
  background: radial-gradient(circle, rgba(79,70,229,.35) 0%, rgba(37,99,235,.2) 44%, transparent 74%);
}
.sa-hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 150px;
  background: linear-gradient(180deg, rgba(79,70,229,.06), transparent 62%);
  pointer-events: none;
  z-index: 0;
}
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
.sa-hero-pill span { font-size:12.5px;font-weight:600;color:var(--t2); }
.sa-hero h1 { font-size:clamp(40px,6vw,72px); font-weight:800; color:var(--t1); margin-bottom:22px; animation:fadeUp .7s .08s cubic-bezier(.4,0,.2,1) both; }
.sa-hero h1 em { font-style:normal; background:var(--grad); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.sa-hero p { font-size:17px; color:var(--t2); line-height:1.75; max-width:560px; margin:0 auto 34px; animation:fadeUp .7s .16s cubic-bezier(.4,0,.2,1) both; }
.sa-hero-btns { display:flex;justify-content:center;gap:12px;flex-wrap:wrap; animation:fadeUp .7s .24s cubic-bezier(.4,0,.2,1) both; }
.sa-btn-hero { height:48px;padding:0 26px;border-radius:12px;font-size:15px;font-weight:600;display:inline-flex;align-items:center;gap:8px;transition:all .25s cubic-bezier(.4,0,.2,1);border:none;cursor:pointer;font-family:'Inter',sans-serif; }
.sa-btn-hero.primary { background:var(--grad);color:#fff;box-shadow:var(--sb); }
.sa-btn-hero.primary:hover { transform:translateY(-2px);box-shadow:0 14px 40px rgba(37,99,235,.38); }
.sa-btn-hero.secondary { background:var(--bg2);color:var(--t1);border:1px solid var(--border);box-shadow:var(--s1); }
.sa-btn-hero.secondary:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-1px);box-shadow:var(--s2); }

/* Hero floating cards */
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
@media(max-width:1080px){
  .sa-hero{grid-template-columns:1fr;text-align:center;padding-top:84px;row-gap:30px;margin-top:14px}
  .sa-hero-inner{margin-inline:auto;text-align:center}
  .sa-hero-pill{margin:0 auto 24px}
  .sa-hero p{margin:0 auto 34px}
  .sa-hero-btns{justify-content:center}
  .sa-hero-visual{justify-self:center;width:min(440px,94%);height:390px}
}
@media(max-width:680px){
  .sa-hero{width:calc(100% - 24px);border-radius:22px;padding:76px 16px 34px}
  .sa-hero-visual{width:min(350px,100%);height:332px}
  .sa-hero-visual::before{inset:30px 12px 18px}
  .sa-hv-a{width:246px;top:44px;left:8px}
  .sa-hv-b{width:176px;top:8px;right:2px}
  .sa-hv-c{width:170px;bottom:14px;left:0}
}
.sa-hv-card {
  position:absolute;
  background:linear-gradient(165deg, rgba(255,255,255,.96), rgba(240,244,255,.9));
  border:1px solid rgba(221,227,245,.95);
  border-radius:18px;
  padding:20px;
  box-shadow:0 22px 48px rgba(20,22,45,.18);
  backdrop-filter:blur(16px);
}
.sa-root.dark .sa-hv-card {
  background:linear-gradient(165deg, rgba(13,20,37,.95), rgba(19,31,53,.86));
  border-color:rgba(129,140,248,.2);
  box-shadow:0 22px 48px rgba(0,0,0,.44);
}
.sa-hv-a { width:310px;top:64px;left:18px;animation:float1 5s ease-in-out infinite; }
.sa-hv-b { width:220px;top:12px;right:20px;animation:float2 5.5s ease-in-out infinite; }
.sa-hv-c { width:212px;bottom:20px;left:14px;animation:float3 6s ease-in-out infinite; }
.sa-hv-icon { width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;margin-bottom:12px; }
.sa-hv-card h4 { font-size:13.5px;font-weight:700;margin-bottom:4px;color:var(--t1); }
.sa-hv-card p { font-size:12px;color:var(--t2); }
.sa-hv-big { font-family:'Bricolage Grotesque',sans-serif;font-size:32px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-hv-badge { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;margin-top:8px; }
.sa-hv-badge.up { background:var(--green-bg);color:var(--green); }
.sa-hv-badge.blue { background:var(--blue-bg);color:var(--blue); }

/* ── STATS ── */
.sa-stats { padding:48px max(24px,4%); border-top:1px solid var(--border); border-bottom:1px solid var(--border); backdrop-filter:blur(16px); }
.sa-root.light .sa-stats { background:rgba(255,255,255,.75); }
.sa-root.dark  .sa-stats { background:rgba(13,20,37,.6); }
.sa-stats-grid { display:grid;grid-template-columns:repeat(4,1fr);max-width:900px;margin:0 auto; }
.sa-stat { text-align:center;padding:16px;border-right:1px solid var(--border); }
.sa-stat:last-child { border-right:none; }
.sa-stat-n { font-family:'Bricolage Grotesque',sans-serif;font-size:40px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:6px; }
.sa-stat-l { font-size:13px;color:var(--t3);font-weight:500; }

/* ── SECTION ── */
.sa-sec { padding:96px max(24px,4%); }
.sa-sec.alt { border-top:1px solid var(--border); border-bottom:1px solid var(--border); backdrop-filter:blur(12px); }
.sa-root.light .sa-sec.alt { background:rgba(255,255,255,.6); }
.sa-root.dark  .sa-sec.alt { background:rgba(13,20,37,.5); }
.sa-sec-head { text-align:center;max-width:600px;margin:0 auto 64px; }
.sa-tag { display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;padding:4px 14px;border-radius:99px;background:var(--blue-bg);color:var(--blue);font-size:12px;font-weight:700;letter-spacing:.5px;text-transform:uppercase; }
.sa-sec-head h2 { font-size:clamp(28px,4vw,44px);font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-sec-head h2 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-lead { font-size:16px;color:var(--t2);line-height:1.75; }

/* ── GRID ── */
.sa-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px; }
.sa-grid.g3 { grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); }

/* ── SERVICE CARD ── */
.sa-scard {
  border:1px solid var(--border); border-radius:18px; padding:28px;
  cursor:pointer; position:relative; overflow:hidden;
  transition:all .35s cubic-bezier(.4,0,.2,1); box-shadow:var(--s1);
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
.sa-scard h3 { font-size:17px;font-weight:700;margin-bottom:10px;color:var(--t1); }
.sa-scard p { font-size:13.5px;color:var(--t2);line-height:1.65; }
.sa-sc-tags { display:flex;gap:6px;flex-wrap:wrap;margin-top:16px; }
.sa-sc-tag { padding:3px 10px;border-radius:99px;font-size:11px;font-weight:600;background:var(--bg3);color:var(--t2);border:1px solid var(--border); }
.sa-sc-arr { position:absolute;top:24px;right:24px;width:32px;height:32px;border-radius:99px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--t3);z-index:1;transition:all .25s; }
.sa-scard:hover .sa-sc-arr { background:var(--blue);border-color:var(--blue);color:#fff;transform:rotate(-45deg); }

/* ── FEATURES ── */
.sa-fstrip { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px; }
.sa-fitem { border:1px solid var(--border);border-radius:12px;padding:22px;text-align:center;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);backdrop-filter:blur(8px); }
.sa-root.light .sa-fitem { background:rgba(255,255,255,.85); }
.sa-root.dark  .sa-fitem { background:var(--bg2); }
.sa-fitem:hover { transform:translateY(-5px);border-color:rgba(37,99,235,.3); }
.sa-root.light .sa-fitem:hover { background:#fff;box-shadow:0 12px 36px rgba(37,99,235,.13); }
.sa-root.dark  .sa-fitem:hover { box-shadow:var(--s3); }
.sa-fitem:hover .sa-fi-icon { transform:scale(1.15) rotate(-8deg); }
.sa-fi-icon { width:44px;height:44px;border-radius:12px;background:var(--blue-bg);color:var(--blue);display:flex;align-items:center;justify-content:center;font-size:18px;margin:0 auto 14px;transition:transform .3s cubic-bezier(.34,1.56,.64,1); }
.sa-fitem h4 { font-size:14px;font-weight:700;margin-bottom:6px;color:var(--t1); }
.sa-fitem p { font-size:12.5px;color:var(--t2);line-height:1.6; }

/* ── TESTIMONIALS ── */
.sa-tcard { border:1px solid var(--border);border-radius:18px;padding:28px;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);backdrop-filter:blur(8px); }
.sa-root.light .sa-tcard { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-tcard { background:var(--bg2); }
.sa-tcard:hover { transform:translateY(-5px); }
.sa-root.light .sa-tcard:hover { background:#fff;box-shadow:0 14px 40px rgba(37,99,235,.12);border-color:rgba(37,99,235,.2); }
.sa-root.dark  .sa-tcard:hover { box-shadow:var(--s3); }
.sa-stars { display:flex;gap:3px;margin-bottom:16px; }
.sa-stars i { color:#F59E0B;font-size:13px; }
.sa-tcard > p { font-size:14px;color:var(--t2);line-height:1.75;margin-bottom:20px;font-style:italic; }
.sa-tauthor { display:flex;align-items:center;gap:12px; }
.sa-tavatar { width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0; }
.sa-tauthor strong { display:block;font-size:13.5px;font-weight:700;color:var(--t1); }
.sa-tauthor span { font-size:12px;color:var(--t3); }

/* ── MARQUEE ── */
.sa-marquee-outer { padding:48px max(24px,4%);overflow:hidden;border-top:1px solid var(--border);border-bottom:1px solid var(--border);backdrop-filter:blur(12px); }
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
.sa-phead { padding:72px max(24px,4%) 56px;text-align:center;position:relative;overflow:hidden;border-bottom:1px solid var(--border);backdrop-filter:blur(16px); }
.sa-root.light .sa-phead { background:rgba(255,255,255,.6); }
.sa-root.dark  .sa-phead { background:rgba(13,20,37,.5); }
.sa-phead::before { content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 50% 50%,rgba(37,99,235,.07) 0%,transparent 70%);animation:meshPulse 10s ease-in-out infinite; }
.sa-root.dark .sa-phead::before { background:radial-gradient(ellipse 70% 80% at 50% 50%,rgba(37,99,235,.15) 0%,transparent 70%); }
.sa-phead::after { content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(37,99,235,.3) 30%,rgba(79,70,229,.4) 50%,rgba(37,99,235,.3) 70%,transparent);animation:lineGlow 4s ease-in-out infinite; }
.sa-phead > * { position:relative;z-index:1; }
.sa-phead h1 { font-size:clamp(30px,5vw,54px);font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-phead h1 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-phead p { font-size:16px;color:var(--t2);max-width:520px;margin:0 auto;line-height:1.75; }

/* ── SERVICES PAGE ── */
.sa-stabs { display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:52px; }
.sa-stab { padding:9px 20px;border-radius:10px;border:1px solid var(--border);font-size:13.5px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1);font-family:'Inter',sans-serif; }
.sa-root.light .sa-stab { background:rgba(255,255,255,.85); }
.sa-root.dark  .sa-stab { background:var(--bg2); }
.sa-stab:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-1px); }
.sa-stab.on { background:var(--grad);border-color:transparent;color:#fff;box-shadow:var(--sb); }
.sa-svc-panel { display:none; }
.sa-svc-panel.on { display:grid;grid-template-columns:1fr 1.1fr;gap:64px;align-items:center; }
@media(max-width:900px){.sa-svc-panel.on{grid-template-columns:1fr}}
.sa-svc-vis { border:1px solid var(--border);border-radius:24px;padding:40px;text-align:center;box-shadow:var(--s3); }
.sa-root.light .sa-svc-vis { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-svc-vis { background:var(--bg2); }
.sa-svc-vis:hover .sa-svc-big-icon { transform:scale(1.08) rotate(-6deg); }
.sa-svc-big-icon { width:96px;height:96px;border-radius:24px;background:var(--blue-bg);color:var(--blue);display:flex;align-items:center;justify-content:center;font-size:40px;margin:0 auto 24px;transition:transform .3s cubic-bezier(.34,1.56,.64,1);box-shadow:0 8px 30px rgba(37,99,235,.15); }
.sa-svc-kpis { display:flex;justify-content:center;gap:28px;margin-top:24px; }
.sa-svc-kpi .n { font-family:'Bricolage Grotesque',sans-serif;font-size:26px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-svc-kpi .l { font-size:11px;color:var(--t3);font-weight:500; }
.sa-svc-body h2 { font-size:clamp(24px,3vw,36px);font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-svc-body h2 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-svc-body p { font-size:15px;color:var(--t2);line-height:1.75;margin-bottom:28px; }
.sa-feat-list { list-style:none;display:flex;flex-direction:column;gap:11px;margin-bottom:30px; }
.sa-feat-list li { display:flex;align-items:flex-start;gap:10px;font-size:14px;color:var(--t2); }
.sa-feat-list li::before { content:'✓';width:20px;height:20px;font-size:11px;font-weight:700;color:var(--green);display:flex;align-items:center;justify-content:center;border-radius:99px;background:var(--green-bg);flex-shrink:0;margin-top:1px; }
.sa-btn-row { display:flex;gap:12px;flex-wrap:wrap; }
.sa-btn-p { height:44px;padding:0 22px;background:var(--grad);color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;display:inline-flex;align-items:center;gap:7px;box-shadow:var(--sb);cursor:pointer;transition:all .25s cubic-bezier(.4,0,.2,1);font-family:'Inter',sans-serif; }
.sa-btn-p:hover { transform:translateY(-2px);box-shadow:0 12px 36px rgba(37,99,235,.35); }
.sa-btn-o { height:44px;padding:0 22px;border:1px solid var(--border);border-radius:10px;font-size:14px;font-weight:500;display:inline-flex;align-items:center;gap:7px;cursor:pointer;transition:all .25s;box-shadow:var(--s1);font-family:'Inter',sans-serif; }
.sa-root.light .sa-btn-o { background:rgba(255,255,255,.9);color:var(--t1); }
.sa-root.dark  .sa-btn-o { background:var(--bg2);color:var(--t1); }
.sa-btn-o:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-1px); }

/* ── FORMATIONS ── */
.sa-filt-row { display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-bottom:12px; }
.sa-filt { padding:7px 18px;border-radius:99px;border:1px solid var(--border);font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;transition:all .2s;box-shadow:var(--s1);font-family:'Inter',sans-serif; }
.sa-root.light .sa-filt { background:rgba(255,255,255,.85); }
.sa-root.dark  .sa-filt { background:var(--bg2); }
.sa-filt:hover { border-color:var(--blue);color:var(--blue); }
.sa-filt.on { background:var(--grad);border-color:transparent;color:#fff; }
.sa-sbar { position:relative;max-width:400px;margin:0 auto 52px; }
.sa-sbar input { width:100%;height:44px;padding:0 16px 0 44px;border:1px solid var(--border);border-radius:12px;font-size:14px;color:var(--t1);outline:none;box-shadow:var(--s1);transition:all .2s;font-family:'Inter',sans-serif; }
.sa-root.light .sa-sbar input { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-sbar input { background:var(--bg2); }
.sa-sbar input:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.12); }
.sa-sbar input::placeholder { color:var(--t3); }
.sa-sbar i { position:absolute;left:15px;top:50%;transform:translateY(-50%);color:var(--t3);font-size:14px; }
.sa-fcard { border:1px solid var(--border);border-radius:18px;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1); }
.sa-root.light .sa-fcard { background:rgba(255,255,255,.9); }
.sa-root.dark  .sa-fcard { background:var(--bg2); }
.sa-fcard:hover { transform:translateY(-6px); }
.sa-root.light .sa-fcard:hover { box-shadow:0 16px 48px rgba(37,99,235,.13);border-color:rgba(37,99,235,.2); }
.sa-root.dark  .sa-fcard:hover { box-shadow:var(--s4); }
.sa-fcard-top { height:8px; }
.sa-fcat { display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:12px; }
.sa-fcard-body { padding:22px; }
.sa-fcard-body h3 { font-size:16px;font-weight:700;margin-bottom:8px;color:var(--t1); }
.sa-fcard-body p { font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:16px; }
.sa-fmeta { display:flex;gap:14px;flex-wrap:wrap;margin-bottom:16px; }
.sa-fm { display:flex;align-items:center;gap:5px;font-size:12px;color:var(--t3); }
.sa-fm i { color:var(--blue);font-size:11px; }
.sa-fcard-foot { display:flex;align-items:center;justify-content:space-between;padding-top:14px;border-top:1px solid var(--border); }
.sa-fprice { font-family:'Bricolage Grotesque',sans-serif;font-size:20px;font-weight:800;color:var(--blue); }
.sa-fprice small { font-size:11px;color:var(--t3);font-family:'Inter',sans-serif;font-weight:400; }

/* ── LOGICIELS ── */
.sa-lcard { border:1px solid var(--border);border-radius:24px;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:var(--s1); }
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
.sa-lcard-head h3 { font-size:18px;font-weight:700;margin-bottom:6px;color:var(--t1); }
.sa-lcard-head p { font-size:13px;color:var(--t2);line-height:1.6; }
.sa-lcard-body { padding:22px 28px; }
.sa-lfeats { list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:20px; }
.sa-lfeats li { font-size:13px;color:var(--t2);display:flex;align-items:center;gap:8px; }
.sa-lfeats li i { color:var(--green);font-size:11px; }
.sa-lcard-foot { display:flex;align-items:center;justify-content:space-between; }
.sa-lprice { font-family:'Bricolage Grotesque',sans-serif;font-size:15px;font-weight:700; }
.sa-lprice.contact { color:var(--blue); }
.sa-lprice.paid { color:var(--amber); }
.sa-lprice small { display:block;font-size:11px;color:var(--t3);font-family:'Inter',sans-serif;font-weight:400; }

/* ── CONTACT ── */
.sa-contact-wrap { display:grid;grid-template-columns:1fr 1.5fr;gap:64px;align-items:start; }
@media(max-width:900px){.sa-contact-wrap{grid-template-columns:1fr}}
.sa-cinfo h2 { font-size:32px;font-weight:800;margin-bottom:14px;color:var(--t1); }
.sa-cinfo h2 em { font-style:normal;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
.sa-cinfo p { font-size:15px;color:var(--t2);line-height:1.75;margin-bottom:36px; }
.sa-citems { display:flex;flex-direction:column;gap:18px; }
.sa-citem { display:flex;align-items:flex-start;gap:14px; }
.sa-citem-ico { width:42px;height:42px;border-radius:12px;background:var(--blue-bg);border:1px solid rgba(37,99,235,.15);display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--blue);flex-shrink:0; }
.sa-citem strong { display:block;font-size:13.5px;font-weight:700;margin-bottom:2px;color:var(--t1); }
.sa-citem span { font-size:13px;color:var(--t2); }
.sa-cform { border:1px solid rgba(255,255,255,.95);border-radius:24px;padding:36px;backdrop-filter:blur(20px); }
.sa-root.light .sa-cform { background:rgba(255,255,255,.92);box-shadow:0 8px 40px rgba(37,99,235,.09),0 1px 0 rgba(255,255,255,.8) inset; }
.sa-root.dark  .sa-cform { background:var(--bg2);border-color:var(--border);box-shadow:var(--s3); }
.sa-cform h3 { font-size:22px;font-weight:700;margin-bottom:4px;color:var(--t1); }
.sa-cform .sub { font-size:13.5px;color:var(--t2);margin-bottom:28px; }
.sa-fg { display:flex;flex-direction:column;gap:6px;margin-bottom:16px; }
.sa-fg label { font-size:12.5px;font-weight:600;color:var(--t2); }
.sa-fg input,.sa-fg select,.sa-fg textarea { padding:11px 14px;border:1px solid var(--border);border-radius:10px;color:var(--t1);font-size:14px;outline:none;transition:all .2s;font-family:'Inter',sans-serif;-webkit-appearance:none; }
.sa-root.light .sa-fg input,.sa-root.light .sa-fg select,.sa-root.light .sa-fg textarea { background:var(--bg3); }
.sa-root.dark  .sa-fg input,.sa-root.dark  .sa-fg select,.sa-root.dark  .sa-fg textarea { background:rgba(255,255,255,.04); }
.sa-fg input:focus,.sa-fg select:focus,.sa-fg textarea:focus { border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1); }
.sa-root.light .sa-fg input:focus,.sa-root.light .sa-fg select:focus,.sa-root.light .sa-fg textarea:focus { background:var(--bg2); }
.sa-fg input::placeholder,.sa-fg textarea::placeholder { color:var(--t3); }
.sa-fg textarea { resize:vertical;min-height:110px; }
.sa-form-row { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
@media(max-width:520px){.sa-form-row{grid-template-columns:1fr}}

/* ── MODAL ── */
.sa-overlay { position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.4);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .3s cubic-bezier(.4,0,.2,1); }
.sa-overlay.on { opacity:1;pointer-events:all; }
.sa-modal { border:1px solid var(--border);border-radius:24px;width:100%;max-width:500px;padding:32px;transform:translateY(20px) scale(.96);transition:all .35s cubic-bezier(.34,1.56,.64,1);max-height:90vh;overflow-y:auto;box-shadow:var(--s4); }
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

/* ── TOAST ── */
.sa-toast { position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(80px);z-index:2000;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:var(--s4);opacity:0;transition:all .4s cubic-bezier(.34,1.56,.64,1);pointer-events:none;white-space:nowrap; }
.sa-root.light .sa-toast { background:var(--t1);color:var(--bg); }
.sa-root.dark  .sa-toast { background:#F1F5F9;color:#0A0F2C; }
.sa-toast.suc { background:var(--green)!important;color:#fff!important; }
.sa-toast.err { background:var(--red)!important;color:#fff!important; }
.sa-toast.on { transform:translateX(-50%) translateY(0);opacity:1; }

/* ── FOOTER ── */
.sa-footer { border-top:1px solid var(--border);padding:64px max(24px,4%) 32px;position:relative;z-index:1;backdrop-filter:blur(16px); }
.sa-root.light .sa-footer { background:rgba(255,255,255,.75); }
.sa-root.dark  .sa-footer { background:rgba(7,12,24,.85); }
.sa-foot-grid { display:grid;grid-template-columns:1.8fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px; }
@media(max-width:900px){.sa-foot-grid{grid-template-columns:1fr 1fr}}
@media(max-width:560px){.sa-foot-grid{grid-template-columns:1fr}}
.sa-foot-brand p { font-size:13.5px;color:var(--t3);line-height:1.7;margin:16px 0 22px;max-width:280px; }
.sa-socials { display:flex;gap:8px; }
.sa-soc { width:36px;height:36px;border-radius:9px;background:var(--bg3);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--t3);cursor:pointer;transition:all .2s;text-decoration:none; }
.sa-soc:hover { border-color:var(--blue);color:var(--blue);transform:translateY(-2px);background:var(--blue-bg); }
.sa-foot-col h5 { font-size:12px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:1px;margin-bottom:18px; }
.sa-foot-links { list-style:none;display:flex;flex-direction:column;gap:10px; }
.sa-foot-links a { font-size:13.5px;color:var(--t2);cursor:pointer;transition:color .2s;text-decoration:none; }
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
@keyframes float1{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-12px) rotate(1deg)}}
@keyframes float2{0%,100%{transform:translateY(0) rotate(5deg)}50%{transform:translateY(-8px) rotate(6.5deg)}}
@keyframes float3{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-10px) rotate(-2.5deg)}}
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
  .sa-nav-links,.sa-btn-cta{display:none!important}
  .sa-ham{display:flex!important}
  .sa-stats-grid{grid-template-columns:1fr 1fr}
  .sa-stat:nth-child(2){border-right:none}
  .sa-grid{grid-template-columns:1fr}
  .sa-fab{bottom:20px;right:20px}
}
.sa-ham { display:none;flex-direction:column;gap:4.5px;background:none;border:none;padding:8px;cursor:pointer; }
.sa-ham span { display:block;width:20px;height:1.5px;background:var(--t2);border-radius:2px;transition:all .3s; }

/* theme flash */
.sa-tflash { position:fixed;inset:0;z-index:9999;pointer-events:none;transition:background .4s; }
`;

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const FORMATIONS = [
  {cat:'bur',top:'linear-gradient(90deg,#2563EB,#4F46E5)',title:'Microsoft Office Expert',desc:'Word, Excel, PowerPoint et Outlook au niveau professionnel. Certification Microsoft.',dur:'40h',lvl:'Tous niveaux',fmt:'Dr. Haddad Nabil',prix:'25 000',mode:'Présentiel / En ligne'},
  {cat:'bur',top:'linear-gradient(90deg,#0EA5E9,#2563EB)',title:'Excel Avancé & Business Intelligence',desc:'TCD, Power Query, macros VBA et dashboards professionnels.',dur:'30h',lvl:'Intermédiaire',fmt:'Mme Kaci Lynda',prix:'30 000',mode:'Présentiel'},
  {cat:'bur',top:'linear-gradient(90deg,#10B981,#0EA5E9)',title:'Saisie & Frappe Rapide',desc:'Vitesse de frappe, saisie de données et compétences secrétariat.',dur:'20h',lvl:'Débutant',fmt:'Mme Bouzid Fatima',prix:'15 000',mode:'Présentiel'},
  {cat:'dev',top:'linear-gradient(90deg,#8B5CF6,#4F46E5)',title:'Développement Web Full Stack',desc:'HTML, CSS, JavaScript, React.js et Node.js — de zéro au dev full stack.',dur:'120h',lvl:'Débutant',fmt:'M. Benmoussa Yacine',prix:'65 000',mode:'Présentiel / En ligne'},
  {cat:'dev',top:'linear-gradient(90deg,#4F46E5,#8B5CF6)',title:'Python & Data Science',desc:'Programmation Python, Pandas, visualisation et intro au Machine Learning.',dur:'80h',lvl:'Débutant / Intermédiaire',fmt:'Dr. Rais Sofiane',prix:'55 000',mode:'En ligne'},
  {cat:'cyb',top:'linear-gradient(90deg,#EF4444,#F59E0B)',title:'Cybersécurité Fondamentaux',desc:'Protection des systèmes, réseaux sécurisés, gestion des incidents et conformité.',dur:'60h',lvl:'Intermédiaire',fmt:'M. Meziane Adel',prix:'70 000',mode:'Présentiel'},
  {cat:'cyb',top:'linear-gradient(90deg,#DC2626,#EF4444)',title:'Ethical Hacking & Pentest',desc:'Tests d\'intrusion, audit de sécurité et rapports professionnels.',dur:'80h',lvl:'Avancé',fmt:'M. Meziane Adel',prix:'90 000',mode:'Présentiel'},
  {cat:'ges',top:'linear-gradient(90deg,#10B981,#0EA5E9)',title:'Gestion Documentaire & Archives',desc:'Normes d\'archivage, plan de classement, numérisation et GED.',dur:'35h',lvl:'Tous niveaux',fmt:'Mme Belhadj Samira',prix:'35 000',mode:'Présentiel'},
  {cat:'ges',top:'linear-gradient(90deg,#10B981,#4F46E5)',title:'Management de Projet',desc:'Méthodes agiles et traditionnelles, MS Project, planification.',dur:'45h',lvl:'Intermédiaire',fmt:'Dr. Ouali Mounir',prix:'45 000',mode:'Présentiel / En ligne'},
];
const CAT_LBL = {bur:'Bureautique',dev:'Développement',cyb:'Cybersécurité',ges:'Gestion'};
const CAT_CLS = {bur:{bg:'var(--blue-bg)',col:'var(--blue)'},dev:{bg:'var(--violet-bg)',col:'var(--violet)'},cyb:{bg:'var(--red-bg)',col:'var(--red)'},ges:{bg:'var(--green-bg)',col:'var(--green)'}};

const PARTNERS = ['Sonatrach','Algérie Télécom','BNA','Sonelgaz','Air Algérie','CNEP-Banque','Ministère de l\'Education','Université d\'Alger','CNAS','Saidal','APC Blida'];

const SERVICES = [
  {id:'s1',label:'Archivage Physique',icon:'fa-box-archive',iconCls:'var(--blue-bg)',iconCol:'var(--blue)',kpis:[{n:'10K+',l:'m² stockage'},{n:'ISO',l:'Certifié'},{n:'24/7',l:'Surveillance'}],title:'Archivage Physique Professionnel',body:'Notre service d\'archivage physique propose une solution complète pour la prise en charge, le transport, le classement et la conservation de vos documents d\'entreprise.',feats:['Collecte et transport sécurisé de vos archives','Tri, classement et inventaire complet','Stockage en entrepôts climatisés et sécurisés','Système de traçabilité et suivi en ligne','Récupération rapide sur demande en 24h','Destruction sécurisée certifiée','Rapport d\'inventaire mensuel détaillé']},
  {id:'s2',label:'Numérisation',icon:'fa-scanner-image',iconCls:'rgba(14,165,233,.1)',iconCol:'var(--cyan)',kpis:[{n:'600dpi',l:'Résolution'},{n:'OCR',l:'AR/FR/EN'},{n:'99.9%',l:'Précision'}],title:'Vos archives digitalisées',body:'Transformez vos documents papier en actifs numériques exploitables grâce à nos technologies de scan et d\'OCR multilingue de pointe.',feats:['Scan haute résolution jusqu\'à 600 DPI','OCR multilingue (Arabe, Français, Anglais)','Indexation automatique et manuelle','Export en PDF/A, TIFF, JPEG, Word','Contrôle qualité image par image','Métadonnées et classification automatique','Livraison sur clé USB, disque dur ou cloud']},
  {id:'s3',label:'Archivage Numérique',icon:'fa-cloud-arrow-up',iconCls:'var(--amber-bg)',iconCol:'var(--amber)',kpis:[{n:'AES',l:'256-bit'},{n:'99.9%',l:'Uptime'},{n:'3x',l:'Backup'}],title:'Toujours disponible, toujours sécurisé',body:'Notre solution cloud garantit la sécurité, la pérennité et l\'accessibilité de vos documents depuis n\'importe quel appareil.',feats:['Hébergement en Algérie sur serveurs certifiés','Chiffrement AES-256 bit de toutes les données','Sauvegardes automatiques triple redondance','Accès web et application mobile','Gestion des droits d\'accès par utilisateur','Historique des accès et audit trail','SLA 99.9% de disponibilité garantie']},
  {id:'s4',label:'GED',icon:'fa-diagram-project',iconCls:'var(--green-bg)',iconCol:'var(--green)',kpis:[{n:'100%',l:'Sans papier'},{n:'API',l:'Intégrations'},{n:'eSign',l:'Certifiée'}],title:'Automatisez vos flux documentaires',body:'Notre solution GED vous permet de dématérialiser, organiser et faire circuler vos documents de façon intelligente.',feats:['Workflows de validation configurables sans code','Gestion des versions de documents','Signatures électroniques certifiées','Recherche full-text dans le contenu','Intégration ERP via API REST','Tableaux de bord et statistiques avancées','Notifications et alertes automatiques']},
  {id:'s5',label:'Confidentialité',icon:'fa-shield-halved',iconCls:'var(--violet-bg)',iconCol:'var(--violet)',kpis:[{n:'NDA',l:'Systématique'},{n:'ISO',l:'27001'},{n:'Loi',l:'18-07'}],title:'Vos données 100% protégées',body:'La confidentialité de vos informations est notre priorité absolue. Protocoles conformes aux réglementations algériennes et internationales.',feats:['Accès biométrique aux locaux de stockage','Vidéosurveillance 24h/24 — 7j/7','Accord de confidentialité NDA systématique','Personnel habilité et certifié','Chiffrement bout-en-bout de toutes communications','Destruction certifiée conforme RGPD / Loi 18-07','Audit de sécurité annuel par tiers certifié']},
];

const LOGICIELS = [
  {title:'SmartCourrier',ico:'fa-envelope-open-text',grad:'linear-gradient(135deg,#2563EB,#4F46E5)',desc:'Gestion complète du courrier entrant, sortant et interne pour administrations et entreprises.',feats:['Enregistrement et numérotation automatique','Circuit de validation configurable','Suivi et traçabilité complète','Interface bilingue AR/FR'],price:'120 000 DA',priceSub:'/ an — licence',priceType:'paid'},
  {title:'SmartArchives',ico:'fa-boxes-stacked',grad:'linear-gradient(135deg,#10B981,#0EA5E9)',desc:'Gestion des archives physiques et numériques avec recherche intelligente et QR codes.',feats:['Plan de classement personnalisable','QR code et codes-barres','Recherche full-text et métadonnées','Module de numérisation intégré'],price:'180 000 DA',priceSub:'/ an — licence',priceType:'paid'},
  {title:'SmartBiblio',ico:'fa-book-open',grad:'linear-gradient(135deg,#8B5CF6,#4F46E5)',desc:'Système de gestion de bibliothèque et centre de documentation pour établissements.',feats:['Catalogage MARC21 / Dublin Core','Gestion des prêts et retours','OPAC — Catalogue en ligne','Statistiques de fréquentation'],price:'90 000 DA',priceSub:'/ an — licence',priceType:'paid'},
  {title:'SmartGED',ico:'fa-diagram-project',grad:'linear-gradient(135deg,#F59E0B,#EF4444)',desc:'Plateforme GED collaborative avec workflows, signatures électroniques et versioning.',feats:['Workflows sans code configurables','Signature électronique certifiée','Collaboration en temps réel','API REST pour intégrations'],price:'Sur devis',priceSub:'Selon volume & utilisateurs',priceType:'contact'},
  {title:'SmartLearn',ico:'fa-graduation-cap',grad:'linear-gradient(135deg,#0EA5E9,#8B5CF6)',desc:'LMS complet pour la gestion des formations en ligne et présentiel avec certificats.',feats:['Catalogue de formations en ligne','Suivi de progression apprenants','Certificats numériques automatiques','Dashboard formateur avancé'],price:'15 000 DA',priceSub:'/ mois — SaaS',priceType:'paid'},
  {title:'SmartContracts',ico:'fa-file-contract',grad:'linear-gradient(135deg,#10B981,#F59E0B)',desc:'Gestion du cycle de vie des contrats : création, négociation, signature et suivi.',feats:['Modèles de contrats personnalisables','Alertes d\'échéance automatiques','Signature électronique avancée','Archivage automatique'],price:'Sur devis',priceSub:'Selon besoins',priceType:'contact'},
];


/* ═══════════════════════════════════════════
   THREE.JS CUBES BACKGROUND HOOK
   👉 Change CUBE_COUNT below to adjust number of cubes
═══════════════════════════════════════════ */
const CUBE_COUNT = 7; // ← changer ici

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
      const COUNT = CUBE_COUNT;
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
          floatSpeed: 0.003 + Math.random() * 0.004,
          floatAmp: 0.3 + Math.random() * 0.6,
          baseY: mesh.position.y,
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
          mesh.position.y = speed.baseY + Math.sin(speed.fy) * speed.floatAmp;
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
   REVEAL HOOK
═══════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const check = () => document.querySelectorAll('.sa-r:not(.v)').forEach(el => { if(el.getBoundingClientRect().top < window.innerHeight - 50) el.classList.add('v'); });
    check();
    window.addEventListener('scroll', check, {passive:true});
    return () => window.removeEventListener('scroll', check);
  }, []);
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

/* ═══════════════════════════════════════════
   SMALL COMPONENTS
═══════════════════════════════════════════ */
const Tag = ({children}) => <div className="sa-tag"><i className="fas fa-bolt" style={{fontSize:10}}></i>{children}</div>;

const BtnP = ({children, onClick, style}) => <button className="sa-btn-p" onClick={onClick} style={style}>{children}</button>;
const BtnO = ({children, onClick}) => <button className="sa-btn-o" onClick={onClick}>{children}</button>;

const FormField = ({label, type='text', id, placeholder, value, onChange}) => (
  <div className="sa-fg">
    <label>{label}</label>
    {type==='textarea'
      ? <textarea id={id} placeholder={placeholder} value={value} onChange={onChange}/>
      : type==='select'
        ? <select id={id} value={value} onChange={onChange}>{placeholder}</select>
        : <input type={type} id={id} placeholder={placeholder} value={value} onChange={onChange}/>
    }
  </div>
);

/* Toast */
function Toast({msg, type, show}) {
  return (
    <div className={`sa-toast ${type} ${show?'on':''}`}>
      <i className={`fas ${type==='err'?'fa-exclamation-circle':'fa-check-circle'}`}></i>
      <span>{msg}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODAL: INSCRIPTION
═══════════════════════════════════════════ */
function ModalInscription({open, formation, onClose, onSuccess}) {
  const [form, setForm] = useState({nom:'',email:'',tel:'',pwd:'',carte:''});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.nom||!form.email||!form.tel){onSuccess('Remplissez tous les champs obligatoires.','err');return;}
    onClose(); onSuccess('Inscription réussie ! Identifiants envoyés par email sous 24h.','suc');
    setForm({nom:'',email:'',tel:'',pwd:'',carte:''});
  };
  return (
    <div className={`sa-overlay ${open?'on':''}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sa-modal">
        <div className="sa-mhead">
          <div><h3>Inscription à la formation</h3><p>{formation}</p></div>
          <button className="sa-mclose" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Nom complet *</label><input placeholder="Prénom Nom" value={form.nom} onChange={set('nom')}/></div>
          <div className="sa-fg"><label>Téléphone *</label><input type="tel" placeholder="+213 XX XX XX XX" value={form.tel} onChange={set('tel')}/></div>
        </div>
        <div className="sa-fg"><label>Email *</label><input type="email" placeholder="votre@email.com" value={form.email} onChange={set('email')}/></div>
        <div className="sa-fg"><label>Mot de passe (espace personnel) *</label><input type="password" placeholder="Mot de passe sécurisé" value={form.pwd} onChange={set('pwd')}/></div>
        <div className="sa-fg"><label>N° Carte Dahabia / CIB</label><input placeholder="XXXX XXXX XXXX XXXX" value={form.carte} onChange={set('carte')} maxLength={19}/></div>
        <div className="sa-info-box"><i className="fas fa-info-circle"></i>Après confirmation, vous recevrez vos identifiants par email. L'accès sera activé sous 24h après validation.</div>
        <BtnP onClick={submit} style={{width:'100%',justifyContent:'center',height:46,borderRadius:10}}><i className="fas fa-check-circle"></i>Confirmer l'inscription</BtnP>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MODAL: DEVIS LOGICIEL
═══════════════════════════════════════════ */
function ModalDevis({open, logiciel, onClose, onSuccess}) {
  const [form, setForm] = useState({nom:'',ent:'',email:'',tel:'',users:'1 – 10 utilisateurs',msg:''});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if(!form.nom||!form.email){onSuccess('Remplissez tous les champs obligatoires.','err');return;}
    onClose(); onSuccess('Demande envoyée ! Notre équipe vous contacte sous 24h.','suc');
    setForm({nom:'',ent:'',email:'',tel:'',users:'1 – 10 utilisateurs',msg:''});
  };
  return (
    <div className={`sa-overlay ${open?'on':''}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="sa-modal">
        <div className="sa-mhead">
          <div><h3>Demande de devis</h3><p>Logiciel : {logiciel}</p></div>
          <button className="sa-mclose" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Nom complet *</label><input placeholder="Prénom Nom" value={form.nom} onChange={set('nom')}/></div>
          <div className="sa-fg"><label>Entreprise *</label><input placeholder="Organisation" value={form.ent} onChange={set('ent')}/></div>
        </div>
        <div className="sa-form-row">
          <div className="sa-fg"><label>Email *</label><input type="email" placeholder="email@exemple.com" value={form.email} onChange={set('email')}/></div>
          <div className="sa-fg"><label>Téléphone</label><input type="tel" placeholder="+213 XX XX XX XX" value={form.tel} onChange={set('tel')}/></div>
        </div>
        <div className="sa-fg"><label>Nombre d'utilisateurs</label>
          <select value={form.users} onChange={set('users')}>
            <option>1 – 10 utilisateurs</option><option>11 – 50 utilisateurs</option>
            <option>51 – 200 utilisateurs</option><option>200+ utilisateurs</option>
          </select>
        </div>
        <div className="sa-fg"><label>Besoins spécifiques</label><textarea placeholder="Décrivez votre projet…" value={form.msg} onChange={set('msg')} style={{minHeight:80}}/></div>
        <BtnP onClick={submit} style={{width:'100%',justifyContent:'center',height:46,borderRadius:10,marginTop:4}}><i className="fas fa-paper-plane"></i>Envoyer ma demande</BtnP>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PAGE: HOME
═══════════════════════════════════════════ */
function PageHome({go, openIns}) {
  useReveal();
  return (
    <>
      {/* HERO */}
      <section className="sa-hero">
        <div className="sa-hero-mesh"></div>
        <div className="sa-hero-dots"></div>
        <div className="sa-hero-line"></div>
        <div className="sa-hero-inner">
          <div className="sa-hero-pill">
            <div className="sa-pill-dot"><i className="fas fa-star" style={{fontSize:9}}></i></div>
            <span>Référence #1 en Gestion Documentaire en Algérie</span>
          </div>
          <h1>Archivage <em>intelligent</em>,<br/>formations <em>certifiantes</em></h1>
          <p>Smart Archives transforme votre gestion documentaire — archivage physique & numérique, numérisation, logiciels métiers et formations professionnelles.</p>
          <div className="sa-hero-btns">
            <button className="sa-btn-hero primary" onClick={()=>go('contact')}><i className="fas fa-rocket"></i>Demander un devis</button>
            <button className="sa-btn-hero secondary" onClick={()=>go('services')}><i className="fas fa-play-circle"></i>Nos services</button>
          </div>
        </div>
        <div className="sa-hero-visual">
          <div className="sa-hv-card sa-hv-a">
            <div className="sa-hv-icon" style={{background:'var(--blue-bg)',color:'var(--blue)'}}><i className="fas fa-box-archive"></i></div>
            <h4>Documents archivés</h4>
            <div className="sa-hv-big">50K+</div>
            <p>Sécurisés & accessibles 24/7</p>
            <span className="sa-hv-badge up"><i className="fas fa-arrow-up" style={{fontSize:9}}></i>+18% ce mois</span>
          </div>
          <div className="sa-hv-card sa-hv-b">
            <div className="sa-hv-icon" style={{background:'var(--violet-bg)',color:'var(--violet)'}}><i className="fas fa-users-graduate"></i></div>
            <h4>Apprenants formés</h4>
            <div className="sa-hv-big" style={{fontSize:24}}>1 200+</div>
            <span className="sa-hv-badge blue">Certifiés</span>
          </div>
          <div className="sa-hv-card sa-hv-c">
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
              <div className="sa-hv-icon" style={{width:32,height:32,borderRadius:8,margin:0,fontSize:13,background:'var(--green-bg)',color:'var(--green)'}}><i className="fas fa-shield-halved"></i></div>
              <h4 style={{fontSize:12.5}}>Sécurité certifiée</h4>
            </div>
            <p style={{color:'var(--green)',fontWeight:700}}>✓ ISO — Conforme Loi 18-07</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="sa-stats">
        <div className="sa-stats-grid">
          {[{n:500,s:'+',l:'Clients satisfaits'},{n:50,s:'K+',l:'Documents archivés'},{n:15,s:' ans',l:"Années d'expérience"},{n:98,s:'%',l:'Taux de satisfaction'}].map((s,i)=>(
            <div className={`sa-stat sa-r d${i}`} key={i}>
              <div className="sa-stat-n" data-n={s.n} data-s={s.s}>0</div>
              <div className="sa-stat-l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="sa-sec">
        <div className="sa-sec-head sa-r"><Tag>Nos Services</Tag>
          <h2>Une offre <em>complète</em><br/>pour votre entreprise</h2>
          <p className="sa-lead">De l'archivage physique à la digitalisation totale, nous couvrons 100% de vos besoins.</p>
        </div>
        <div className="sa-grid">
          {[
            {ico:'fa-box-archive',cl:'var(--blue-bg)',col:'var(--blue)',t:'Archivage Physique',d:'Collecte, classement et stockage sécurisé dans nos entrepôts climatisés et certifiés.',tags:['Stockage','Classement','Sécurité'],p:'services'},
            {ico:'fa-scanner-image',cl:'rgba(14,165,233,.1)',col:'var(--cyan)',t:'Numérisation',d:'Conversion HD de vos archives papier en fichiers indexés avec OCR multilingue.',tags:['Scan HD','OCR AR/FR','PDF/A'],p:'services'},
            {ico:'fa-cloud-arrow-up',cl:'var(--amber-bg)',col:'var(--amber)',t:'Archivage Numérique',d:'Hébergement sécurisé sur serveurs algériens, accès 24/7 et triple redondance.',tags:['Cloud','AES-256','99.9% SLA'],p:'services'},
            {ico:'fa-diagram-project',cl:'var(--green-bg)',col:'var(--green)',t:'Gestion Électronique',d:'Solution GED complète pour automatiser vos workflows documentaires.',tags:['GED','Workflow','Signatures'],p:'services'},
            {ico:'fa-graduation-cap',cl:'var(--violet-bg)',col:'var(--violet)',t:'Formations Pro',d:'Programmes certifiants : bureautique, dev web, cybersécurité, gestion documentaire.',tags:['Certifiant','Présentiel','En ligne'],p:'formations'},
            {ico:'fa-laptop-code',cl:'var(--red-bg)',col:'var(--red)',t:'Logiciels Métiers',d:'Suite complète : courrier, archives, bibliothèque, GED et LMS. Conçus pour l\'Algérie.',tags:['SaaS','Bilingue','Support'],p:'logiciels'},
          ].map((c,i)=>(
            <div className={`sa-scard sa-r d${i}`} key={i} onClick={()=>go(c.p)}>
              <div className="sa-sc-arr"><i className="fas fa-arrow-right"></i></div>
              <div className="sa-sc-icon" style={{background:c.cl,color:c.col}}><i className={`fas ${c.ico}`}></i></div>
              <h3>{c.t}</h3><p>{c.d}</p>
              <div className="sa-sc-tags">{c.tags.map(t=><span className="sa-sc-tag" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="sa-sec alt">
        <div className="sa-sec-head sa-r"><Tag>Pourquoi nous choisir</Tag>
          <h2>Tout ce dont vous avez <em>besoin</em></h2>
        </div>
        <div className="sa-fstrip">
          {[
            {ico:'fa-file-invoice-dollar',t:'Devis en ligne',d:'Obtenez un devis personnalisé en quelques minutes.'},
            {ico:'fa-calendar-check',t:'Planification',d:'Planifiez collectes et formations selon vos dispo.'},
            {ico:'fa-magnifying-glass',t:'Recherche avancée',d:'Retrouvez tout document en quelques secondes.'},
            {ico:'fa-upload',t:'Upload sécurisé',d:'Déposez vos fichiers via portail chiffré SSL.'},
            {ico:'fa-chart-line',t:'Suivi temps réel',d:'Dashboard de suivi de vos projets en direct.'},
          ].map((f,i)=>(
            <div className={`sa-fitem sa-r d${i}`} key={i}>
              <div className="sa-fi-icon"><i className={`fas ${f.ico}`}></i></div>
              <h4>{f.t}</h4><p>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sa-sec">
        <div className="sa-sec-head sa-r"><Tag>Témoignages</Tag>
          <h2>Ils nous font <em>confiance</em></h2>
        </div>
        <div className="sa-grid g3">
          {[
            {av:'KA',grad:'linear-gradient(135deg,#2563EB,#4F46E5)',q:'"Smart Archives a transformé notre gestion documentaire. Professionnalisme exemplaire, résultats au-delà de nos attentes."',name:'Karim Amrani',role:'Directeur, Sonatrach',stars:5},
            {av:'SB',grad:'linear-gradient(135deg,#8B5CF6,#2563EB)',q:'"Les formations en cybersécurité ont réellement élevé le niveau de toute notre équipe IT. Formateurs excellents."',name:'Sara Benali',role:'DSI, BNA',stars:5},
            {av:'MO',grad:'linear-gradient(135deg,#10B981,#0EA5E9)',q:'"SmartCourrier a simplifié tout notre quotidien administratif. Interface intuitive, support ultra réactif."',name:'Mourad Ouali',role:"Chef de projet, Algérie Télécom",stars:4.5},
          ].map((t,i)=>(
            <div className={`sa-tcard sa-r d${i}`} key={i}>
              <div className="sa-stars">{[1,2,3,4,5].map(s=><i key={s} className={`fas fa-star${s<=Math.floor(t.stars)?'':s-.5===t.stars?'-half-alt':''}`}></i>)}</div>
              <p>{t.q}</p>
              <div className="sa-tauthor">
                <div className="sa-tavatar" style={{background:t.grad}}>{t.av}</div>
                <div><strong>{t.name}</strong><span>{t.role}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS */}
      <div className="sa-marquee-outer">
        <h3>Ils nous font confiance</h3>
        <div className="sa-marquee-wrap">
          <div className="sa-marquee-track">
            {[...PARTNERS,...PARTNERS].map((p,i)=><div className="sa-mpill" key={i}>{p}</div>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   PAGE: SERVICES
═══════════════════════════════════════════ */
function PageServices({go}) {
  const [active, setActive] = useState('s1');
  useReveal();
  const svc = SERVICES.find(s=>s.id===active);
  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{margin:'0 auto 16px'}}>Nos Services</div>
        <h1>Solutions <em>sur mesure</em><br/>pour votre entreprise</h1>
        <p>De l'archivage physique à la transformation digitale complète.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-stabs">
          {SERVICES.map(s=>(
            <button key={s.id} className={`sa-stab ${active===s.id?'on':''}`} onClick={()=>setActive(s.id)}>
              <i className={`fas ${s.icon}`} style={{marginRight:7}}></i>{s.label}
            </button>
          ))}
        </div>
        {svc && (
          <div className="sa-svc-panel on" key={active}>
            <div className="sa-svc-vis">
              <div className="sa-svc-big-icon" style={{background:svc.iconCls,color:svc.iconCol}}><i className={`fas ${svc.icon}`}></i></div>
              <h3 style={{fontSize:20,fontWeight:700,marginBottom:8,color:'var(--t1)'}}>{svc.label}</h3>
              <div className="sa-svc-kpis">
                {svc.kpis.map((k,i)=><div className="sa-svc-kpi" key={i}><div className="n">{k.n}</div><div className="l">{k.l}</div></div>)}
              </div>
            </div>
            <div className="sa-svc-body">
              <div className="sa-tag" style={{marginBottom:18}}>Service complet</div>
              <h2><em>{svc.title}</em></h2>
              <p>{svc.body}</p>
              <ul className="sa-feat-list">{svc.feats.map((f,i)=><li key={i}>{f}</li>)}</ul>
              <div className="sa-btn-row">
                <BtnP onClick={()=>go('contact')}><i className="fas fa-paper-plane"></i>Demander un devis</BtnP>
                <BtnO><i className="fas fa-phone"></i>Nous appeler</BtnO>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════
   PAGE: FORMATIONS
═══════════════════════════════════════════ */
function PageFormations({openIns}) {
  const [flt, setFlt] = useState('all');
  const [srch, setSrch] = useState('');
  useReveal();
  const list = FORMATIONS.filter(f=>(flt==='all'||f.cat===flt)&&(f.title.toLowerCase().includes(srch)||f.desc.toLowerCase().includes(srch)));
  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{margin:'0 auto 16px'}}>Formations</div>
        <h1>Formations <em>Certifiantes</em><br/>& Professionnelles</h1>
        <p>Développez vos compétences avec nos experts certifiés.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-filt-row">
          {[['all','Toutes'],['bur','Bureautique'],['dev','Développement'],['cyb','Cybersécurité'],['ges','Gestion']].map(([k,l])=>(
            <button key={k} className={`sa-filt ${flt===k?'on':''}`} onClick={()=>setFlt(k)}>{l}</button>
          ))}
        </div>
        <div className="sa-sbar">
          <i className="fas fa-search"></i>
          <input placeholder="Rechercher une formation…" value={srch} onChange={e=>setSrch(e.target.value.toLowerCase())}/>
        </div>
        <div className="sa-grid">
          {list.length ? list.map((f,i)=>(
            <div className={`sa-fcard sa-r d${i%5}`} key={i}>
              <div className="sa-fcard-top" style={{background:f.top}}></div>
              <div className="sa-fcard-body">
                <span className="sa-fcat" style={{background:CAT_CLS[f.cat].bg,color:CAT_CLS[f.cat].col}}>{CAT_LBL[f.cat]}</span>
                <h3>{f.title}</h3><p>{f.desc}</p>
                <div className="sa-fmeta">
                  <span className="sa-fm"><i className="fas fa-clock"></i>{f.dur}</span>
                  <span className="sa-fm"><i className="fas fa-signal"></i>{f.lvl}</span>
                  <span className="sa-fm"><i className="fas fa-user-tie"></i>{f.fmt}</span>
                  <span className="sa-fm"><i className={`fas fa-${f.mode.includes('ligne')?'wifi':'building'}`}></i>{f.mode}</span>
                </div>
                <div className="sa-fcard-foot">
                  <div className="sa-fprice">{f.prix} DA<small>/pers.</small></div>
                  <BtnP onClick={()=>openIns(f.title+' — '+f.prix+' DA')} style={{height:36,padding:'0 16px',fontSize:13}}>
                    <i className="fas fa-graduation-cap"></i>S'inscrire
                  </BtnP>
                </div>
              </div>
            </div>
          )) : (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:64,color:'var(--t3)'}}>
              <i className="fas fa-search" style={{fontSize:36,display:'block',marginBottom:14,opacity:.4}}></i>
              Aucune formation trouvée.
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════
   PAGE: LOGICIELS
═══════════════════════════════════════════ */
function PageLogiciels({openDv}) {
  useReveal();
  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{margin:'0 auto 16px'}}>Logiciels</div>
        <h1>Nos Solutions <em>Logicielles</em></h1>
        <p>Logiciels métiers sur mesure pour les entreprises algériennes exigeantes.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-grid g3">
          {LOGICIELS.map((l,i)=>(
            <div className={`sa-lcard sa-r d${i%5}`} key={i}>
              <div className="sa-lcard-head">
                <div className="sa-lcard-ico" style={{background:l.grad}}><i className={`fas ${l.ico}`}></i></div>
                <h3>{l.title}</h3><p>{l.desc}</p>
              </div>
              <div className="sa-lcard-body">
                <ul className="sa-lfeats">{l.feats.map((f,j)=><li key={j}><i className="fas fa-check-circle"></i>{f}</li>)}</ul>
                <div className="sa-lcard-foot">
                  <div><div className={`sa-lprice ${l.priceType}`}>{l.price}<small>{l.priceSub}</small></div></div>
                  <BtnP onClick={()=>openDv(l.title)} style={{height:36,padding:'0 16px',fontSize:13}}>
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

/* ═══════════════════════════════════════════
   PAGE: CONTACT
═══════════════════════════════════════════ */
function PageContact({onSuccess}) {
  const [form, setForm] = useState({nom:'',ent:'',email:'',tel:'',service:'',msg:''});
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}));
  useReveal();
  const submit = () => {
    if(!form.nom||!form.email||!form.tel){onSuccess('Remplissez tous les champs obligatoires.','err');return;}
    onSuccess('Message envoyé ! Réponse sous 24h.','suc');
    setForm({nom:'',ent:'',email:'',tel:'',service:'',msg:''});
  };
  return (
    <>
      <div className="sa-phead">
        <div className="sa-tag" style={{margin:'0 auto 16px'}}>Contact</div>
        <h1>Parlons de <em>votre projet</em></h1>
        <p>Notre équipe vous répond sous 24h pour votre devis personnalisé.</p>
      </div>
      <section className="sa-sec">
        <div className="sa-contact-wrap">
          <div className="sa-cinfo">
            <div className="sa-tag" style={{marginBottom:20}}>Contactez-nous</div>
            <h2>Nous sommes <em>à votre écoute</em></h2>
            <p>Archivage, formation ou logiciel — nos experts vous accompagnent dans chaque projet.</p>
            <div className="sa-citems">
              {[
                {ico:'fa-location-dot',t:'Adresse',v:'Rue des Archives, Blida 09000, Algérie'},
                {ico:'fa-phone',t:'Téléphone',v:'+213 25 XX XX XX / +213 770 XX XX XX'},
                {ico:'fa-envelope',t:'Email',v:'contact@smart-archives.dz'},
                {ico:'fa-clock',t:'Horaires',v:'Dim – Jeu : 08h00 – 17h00'},
              ].map((c,i)=>(
                <div className="sa-citem" key={i}>
                  <div className="sa-citem-ico"><i className={`fas ${c.ico}`}></i></div>
                  <div><strong>{c.t}</strong><span>{c.v}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="sa-cform">
            <h3>Demander un devis gratuit</h3>
            <p className="sub">Réponse garantie sous 24h ouvrables.</p>
            <div className="sa-form-row">
              <div className="sa-fg"><label>Prénom & Nom *</label><input placeholder="Votre nom" value={form.nom} onChange={set('nom')}/></div>
              <div className="sa-fg"><label>Entreprise</label><input placeholder="Nom de l'entreprise" value={form.ent} onChange={set('ent')}/></div>
            </div>
            <div className="sa-form-row">
              <div className="sa-fg"><label>Email *</label><input type="email" placeholder="email@exemple.com" value={form.email} onChange={set('email')}/></div>
              <div className="sa-fg"><label>Téléphone *</label><input type="tel" placeholder="+213 XX XX XX XX" value={form.tel} onChange={set('tel')}/></div>
            </div>
            <div className="sa-fg"><label>Service souhaité</label>
              <select value={form.service} onChange={set('service')}>
                <option value="">Choisir un service…</option>
                {['Archivage Physique','Numérisation de documents','Archivage Numérique / Cloud','Gestion Électronique (GED)','Formation professionnelle','Logiciel métier','Autre'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="sa-fg"><label>Message</label><textarea placeholder="Décrivez votre besoin…" value={form.msg} onChange={set('msg')}/></div>
            <BtnP onClick={submit} style={{width:'100%',justifyContent:'center',height:48,borderRadius:12,fontSize:15,marginTop:4}}>
              <i className="fas fa-paper-plane"></i>Envoyer ma demande
            </BtnP>
          </div>
        </div>
      </section>
    </>
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
            {[['fab fa-facebook-f','#'],['fab fa-linkedin-in','#'],['fab fa-x-twitter','#'],['fab fa-whatsapp','#']].map(([ic,hr],i)=>(
              <a href={hr} className="sa-soc" key={i}><i className={ic}></i></a>
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
            <li><a><i className="fas fa-location-dot" style={{marginRight:7,color:'var(--blue)'}}></i>Blida, Algérie</a></li>
            <li><a><i className="fas fa-phone" style={{marginRight:7,color:'var(--blue)'}}></i>+213 25 XX XX XX</a></li>
            <li><a><i className="fas fa-envelope" style={{marginRight:7,color:'var(--blue)'}}></i>contact@smart-archives.dz</a></li>
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
  CHATBOT GEMINI
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

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function Chatbot({ dark }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role:'bot', text:"Bonjour ! 👋 Je suis l'assistant Smart Archives propulsé par **Google Gemini**.\n\nComment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos services, logiciels ou formations.", time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}) }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const msgsEnd = useRef(null);
  const taRef = useRef(null);
  const [unread, setUnread] = useState(1);

  useEffect(() => { if(open) { setUnread(0); setTimeout(()=>msgsEnd.current?.scrollIntoView({behavior:'smooth'}),100); } }, [open]);
  useEffect(() => { msgsEnd.current?.scrollIntoView({behavior:'smooth'}); }, [msgs]);

  const autoResize = () => {
    const ta = taRef.current; if(!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  };

  const now = () => new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  const send = async (text) => {
    const msg = text || input.trim();
    if(!msg || loading) return;
    setInput(''); setError('');
    if(taRef.current) taRef.current.style.height='42px';

    const userMsg = {role:'user', text:msg, time:now()};
    setMsgs(m=>[...m, userMsg]);
    setLoading(true);

    // Build history for Gemini
    const history = [...msgs, userMsg]
      .filter(m=>m.role!=='bot'||msgs.indexOf(m)>0) // skip welcome
      .map(m=>({role: m.role==='user'?'user':'model', parts:[{ text:m.text }]}));

    try {
      if (!API_KEY) {
        throw new Error('VITE_GEMINI_API_KEY manquante');
      }

      const res = await fetch(API_URL, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts:[{ text:SYSTEM_PROMPT }],
          },
          contents: history,
          generationConfig: {
            temperature:0.4,
            maxOutputTokens:512,
          },
        })
      });

      if(!res.ok) {
        const errTxt = await res.text();
        throw new Error(`Erreur Gemini (${res.status}) ${errTxt.slice(0, 180)}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts
        ?.map((p)=>p.text)
        ?.filter(Boolean)
        ?.join('\n')
        ?.trim() || "Désolé, je n'ai pas pu générer une réponse.";
      setMsgs(m=>[...m, {role:'bot', text:reply, time:now()}]);
    } catch(e) {
      const errMsg = String(e?.message || 'Erreur inconnue');
      setError(errMsg.includes('VITE_GEMINI_API_KEY')
        ? "❌ Clé API Gemini manquante. Ajoutez VITE_GEMINI_API_KEY dans votre fichier .env"
        : errMsg.includes('fetch') || errMsg.includes('Failed')
          ? "❌ Impossible de se connecter à Gemini. Vérifiez internet et votre clé API Google"
          : `Erreur : ${errMsg}`);
      setMsgs(m=>[...m, {role:'bot', text:"Je rencontre un problème de connexion à Gemini. Vérifiez votre configuration API puis réessayez.", time:now()}]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMsgs([{role:'bot', text:"Conversation réinitialisée. Comment puis-je vous aider ?", time:now()}]);
    setError('');
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
        {/* avatar */}
        <div style={{
          width:36, height:36, borderRadius:'50%',
          background:'rgba(255,255,255,.2)',
          border:'1.5px solid rgba(255,255,255,.4)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:18, flexShrink:0,
        }}>
          {open ? '✕' : '🤖'}
        </div>
        {/* texte */}
        <div style={{display:'flex', flexDirection:'column', lineHeight:1.2}}>
          <span style={{fontSize:13, fontWeight:700, color:'#fff', fontFamily:"'Bricolage Grotesque',sans-serif"}}>
            {open ? 'Fermer' : 'Assistant IA'}
          </span>
          <span style={{fontSize:10.5, color:'rgba(255,255,255,.75)', display:'flex', alignItems:'center', gap:4}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#4ade80',display:'inline-block'}}></span>
            {loading ? 'Répond…' : 'Gemini · En ligne'}
          </span>
        </div>
        {/* badge */}
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
        {/* ══ CARTE CHAT ══ */}
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

          {/* ─ BACKGROUND ANIME CHATBOT ─ */}
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
              animation:'float2 8.5s ease-in-out infinite',
            }}></div>

            <div style={{
              position:'absolute', inset:'-130px',
              backgroundImage:'linear-gradient(to right, rgba(79,70,229,.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,.18) 1px, transparent 1px)',
              backgroundSize:'26px 26px',
              opacity: dark ? 0.18 : 0.12,
              transform:'rotate(8deg)',
              animation:'float1 14s ease-in-out infinite',
            }}></div>

            <div style={{
              position:'absolute', inset:0,
              background: dark
                ? 'linear-gradient(180deg, rgba(13,20,37,.20) 0%, rgba(13,20,37,.06) 40%, rgba(13,20,37,.34) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,.10) 0%, rgba(255,255,255,.01) 40%, rgba(255,255,255,.30) 100%)',
            }}></div>
          </div>

          <div style={{position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%'}}>

          {/* ─ HEADER ─ */}
          <div style={{
            padding:'16px 18px',
            background:'linear-gradient(135deg,#2563EB,#4F46E5)',
            display:'flex', alignItems:'center', gap:12,
            flexShrink:0, position:'relative', overflow:'hidden',
          }}>
            <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 120% at 75% 50%,rgba(255,255,255,.15),transparent 65%)',pointerEvents:'none'}}></div>
            {/* avatar */}
            <div style={{
              width:42, height:42, borderRadius:14,
              background:'rgba(255,255,255,.2)',
              border:'1.5px solid rgba(255,255,255,.4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:20, flexShrink:0, position:'relative', zIndex:1,
            }}>🤖</div>
            {/* info */}
            <div style={{flex:1, position:'relative', zIndex:1}}>
              <div style={{fontSize:15, fontWeight:700, color:'#fff', fontFamily:"'Bricolage Grotesque',sans-serif"}}>
                Assistant Smart Archives
              </div>
              <div style={{fontSize:11.5, color:'rgba(255,255,255,.75)', display:'flex', alignItems:'center', gap:5, marginTop:2}}>
                <span style={{width:7,height:7,borderRadius:'50%',background:'#4ade80',display:'inline-block',
                  animation:'statusPulse 2s infinite'}}></span>
                {loading ? '⌛ En train de réfléchir…' : 'En ligne · Propulsé par Gemini'}
              </div>
            </div>
            {/* actions */}
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

          {/* ─ BADGE POWERED ─ */}
          <div style={{
            padding:'6px 18px', fontSize:11, fontWeight:600, textAlign:'center',
            display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            flexShrink:0, color:'var(--t3)',
            borderBottom:'1px solid var(--border)',
            background:'rgba(79,70,229,.06)',
          }}>
            <span>⚡</span>
            IA cloud ·&nbsp;
            <span style={{background:'linear-gradient(135deg,#2563EB,#4F46E5)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',fontWeight:700}}>
              Google Gemini
            </span>
            &nbsp;via Google AI API · 🔒 Connexion sécurisée
          </div>

          {/* ─ MESSAGES ─ */}
          <div ref={msgsEnd}
            style={{flex:1, overflowY:'auto', padding:'18px 16px', display:'flex', flexDirection:'column', gap:14}}
          >
            {msgs.map((m,i)=>(
              <div key={i} style={{
                display:'flex', gap:9, alignItems:'flex-end',
                flexDirection: m.role==='user' ? 'row-reverse' : 'row',
                animation:'msgIn .3s ease both',
              }}>
                {/* avatar */}
                <div style={{
                  width:30,height:30,borderRadius:10,
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:14,flexShrink:0,
                  background: m.role==='bot' ? 'linear-gradient(135deg,#2563EB,#4F46E5)' : 'var(--bg3)',
                  border: m.role==='user' ? '1px solid var(--border)' : 'none',
                }}>
                  {m.role==='bot' ? '🤖' : '👤'}
                </div>
                {/* bubble group */}
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
                  <div style={{fontSize:10,color:'var(--t3)',marginTop:4,padding:'0 4px'}}>{m.time}</div>
                </div>
              </div>
            ))}

            {/* typing indicator */}
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
                </div>
              </div>
            )}
            <div ref={msgsEnd}></div>
          </div>

          {/* ─ ERREUR ─ */}
          {error && (
            <div style={{
              margin:'0 14px 10px',padding:'10px 14px',borderRadius:12,
              background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.2)',
              fontSize:12.5,color:'#EF4444',lineHeight:1.55,
            }}>⚠️ {error}</div>
          )}

          {/* ─ SUGGESTIONS ─ */}
          {msgs.length <= 2 && !loading && (
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

          {/* ─ INPUT ─ */}
          <div style={{
            margin:'10px 14px 14px',
            padding:8,
            display:'flex',
            gap:8,
            alignItems:'flex-end',
            border:'1px solid var(--border)',
            borderRadius:16,
            flexShrink:0,
            background: dark ? 'rgba(17,28,48,.78)' : 'rgba(255,255,255,.9)',
            boxShadow: dark ? '0 10px 26px rgba(0,0,0,.24)' : '0 8px 22px rgba(37,99,235,.10)',
            backdropFilter:'blur(10px)',
          }}>
            <textarea
              ref={taRef}
              placeholder="Posez votre question…"
              value={input}
              onChange={e=>{setInput(e.target.value);autoResize();}}
              onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}}
              rows={1}
              disabled={loading}
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
            <button
              onClick={()=>send()}
              disabled={loading||!input.trim()}
              style={{
                width:46,height:46,borderRadius:12,border:'none',
                background: loading||!input.trim() ? '#CBD5E1' : 'linear-gradient(135deg,#2563EB,#4F46E5)',
                color:'#fff',fontSize:16,
                display:'flex',alignItems:'center',justifyContent:'center',
                cursor: loading||!input.trim() ? 'not-allowed' : 'pointer',
                flexShrink:0,
                boxShadow: loading||!input.trim() ? 'none' : '0 4px 16px rgba(37,99,235,.35)',
                transition:'all .2s',
              }}
            >
              {loading ? '⌛' : '➤'}
            </button>
          </div>

        </div>{/* fin contenu chat */}

        </div>{/* fin carte */}
      </div>{/* fin overlay */}
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
  const [insModal, setInsModal] = useState({open:false,f:''});
  const [dvModal, setDvModal] = useState({open:false,l:''});
  const [toast, setToast] = useState({msg:'',type:'suc',show:false});
  const canvasRef = useThreeCubes(dark);
  useCountUp(page);

  // inject styles once
  useEffect(() => {
    if(!document.getElementById('sa-styles')){
      const s = document.createElement('style');
      s.id='sa-styles'; s.textContent=STYLES;
      document.head.appendChild(s);
    }
    const link = document.createElement('link');
    link.rel='stylesheet';link.href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(link);
  }, []);

  // scroll to top on page change
  useEffect(() => { window.scrollTo({top:0,behavior:'smooth'}); }, [page]);

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

  const openIns = (f) => setInsModal({open:true,f});
  const openDv  = (l) => setDvModal({open:true,l});

  // scroll nav
  useEffect(() => {
    const h=()=>document.querySelector('.sa-nav')?.classList.toggle('scrolled',window.scrollY>80);
    window.addEventListener('scroll',h,{passive:true});
    return()=>window.removeEventListener('scroll',h);
  },[]);

  const PAGES = ['home','services','formations','logiciels','contact'];
  const LABELS = {home:'Accueil',services:'Services',formations:'Formations',logiciels:'Logiciels',contact:'Contact'};
  const ICONS  = {home:'fa-house',services:'fa-box-archive',formations:'fa-graduation-cap',logiciels:'fa-laptop-code',contact:'fa-envelope'};

  return (
    <div className={`sa-root ${dark?'dark':'light'}`}>
      {/* THEME FLASH */}
      <div className="sa-tflash" style={{background:flash}}></div>

      {/* ANIMATED BACKGROUND */}
      <canvas className="sa-canvas" ref={canvasRef}></canvas>
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
        <div style={{marginTop:'auto'}}>
          <button className="sa-btn-cta" style={{width:'100%',justifyContent:'center',height:50,borderRadius:12,fontSize:15}} onClick={()=>go('contact')}>
            <i className="fas fa-paper-plane"></i>Demander un devis
          </button>
        </div>
      </div>

      {/* PAGES */}
      <div className={`sa-page ${page==='home'?'on':''}`}>
        <PageHome go={go} openIns={openIns}/>
      </div>
      <div className={`sa-page ${page==='services'?'on':''}`}>
        <PageServices go={go}/>
      </div>
      <div className={`sa-page ${page==='formations'?'on':''}`}>
        <PageFormations openIns={openIns}/>
      </div>
      <div className={`sa-page ${page==='logiciels'?'on':''}`}>
        <PageLogiciels openDv={openDv}/>
      </div>
      <div className={`sa-page ${page==='contact'?'on':''}`}>
        <PageContact onSuccess={showToast}/>
      </div>

      {/* FOOTER */}
      <Footer go={go}/>

      {/* CHATBOT GEMINI */}
      <Chatbot dark={dark}/>

      {/* MODALS */}
      <ModalInscription open={insModal.open} formation={insModal.f} onClose={()=>setInsModal({open:false,f:''})} onSuccess={showToast}/>
      <ModalDevis open={dvModal.open} logiciel={dvModal.l} onClose={()=>setDvModal({open:false,l:''})} onSuccess={showToast}/>

      {/* TOAST */}
      <Toast msg={toast.msg} type={toast.type} show={toast.show}/>
    </div>
  );
}
