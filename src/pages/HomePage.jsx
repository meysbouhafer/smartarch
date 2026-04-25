import { useReveal } from "./pageHooks";
import { PARTNERS } from "./pageData";
import { useEffect } from "react";

export default function PageHome({ go }) {
  useReveal();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('sa-visible');
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.sa-animate').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* =============== DARK MODE COLOR SYSTEM =============== */
        :root {
          --sa-bg-primary: #020817;
          --sa-bg-secondary: #0D1117;
          --sa-bg-card: #0F172A;
          --sa-bg-card-hover: #1E293B;
          --sa-border: rgba(99, 102, 241, 0.15);
          --sa-border-hover: rgba(99, 102, 241, 0.4);
          --sa-text-primary: #F1F5F9;
          --sa-text-secondary: #94A3B8;
          --sa-text-muted: #64748B;
          --sa-accent-blue: #3B82F6;
          --sa-accent-violet: #7C3AED;
          --sa-accent-cyan: #06B6D4;
          --sa-glow-blue: rgba(59, 130, 246, 0.15);
          --sa-glow-violet: rgba(124, 58, 237, 0.15);
        }

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

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes gridFloat {
          0% { transform: translateY(0); opacity: 0.1; }
          50% { opacity: 0.2; }
          100% { transform: translateY(-20px); opacity: 0.1; }
        }

        @keyframes blobPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
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
          background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
          top: -100px;
          left: 100px;
          animation-delay: 0s;
        }

        .sa-aurora-blob.blob2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%);
          bottom: 100px;
          right: 50px;
          animation-delay: 2s;
        }

        /* Enhance cubes with glow & size */
        .sa-neo-cube {
          box-shadow: 0 8px 32px rgba(99,102,241,0.2);
          animation: floatY 4s ease-in-out infinite;
          width: 80px !important;
          height: 80px !important;
          background: linear-gradient(135deg, #FFFFFF 0%, #C7D2FE 50%, #818CF8 100%) !important;
        }

        .sa-neo-cube.c1 { animation-delay: 0s; }
        .sa-neo-cube.c2 { animation-delay: 0.2s; }
        .sa-neo-cube.c3 { animation-delay: 0.4s; }
        .sa-neo-cube.c4 { animation-delay: 0.6s; }
        .sa-neo-cube.c5 { animation-delay: 0.8s; }
        .sa-neo-cube.c6 { animation-delay: 1s; }
        .sa-neo-cube.c7 { animation-delay: 1.2s; }
        .sa-neo-cube.c8 { animation-delay: 1.4s; }

        /* Cube cloud sway */
        .sa-cube-cloud {
          animation: sway 8s ease-in-out infinite;
        }

        /* Orbit particles around cluster */
        .sa-orbit-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #6366F1, #7C3AED);
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(99,102,241,0.6);
          left: 50%;
          top: 50%;
          margin: -3px 0 0 -3px;
          animation: orbitParticle 6s linear infinite;
        }

        /* =============== HERO LAYOUT FIX =============== */
        .sa-hero {
          display: flex;
          flex-direction: row;
          align-items: center;
          min-height: 100vh;
          padding: 0 6%;
          gap: 4rem;
          background: linear-gradient(135deg, #020817 0%, #0a0f2e 50%, #020817 100%);
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
        }

        .sa-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(124, 58, 237, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .sa-hero-inner {
          flex: 1;
          max-width: 50%;
          text-align: left;
          z-index: 2;
          position: relative;
        }

        .sa-hero-visual {
          flex: 1;
          max-width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
          position: relative;
          z-index: 1;
        }

        /* Navigation Bar */
        .sa-neo-topnav {
          position: absolute;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 999px;
          padding: 0.4rem 0.5rem;
          z-index: 100;
        }

        .sa-neo-navitem {
          background: none;
          border: none;
          color: #94A3B8;
          padding: 0.5rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .sa-neo-navitem.on, .sa-neo-navitem:hover {
          background: rgba(99, 102, 241, 0.15);
          color: #F1F5F9;
        }

        .sa-neo-navcta {
          background: linear-gradient(135deg, #6366F1, #7C3AED);
          color: white;
          border: none;
          padding: 0.5rem 1.4rem;
          border-radius: 999px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* =============== TIMELINE SECTION =============== */
        @keyframes drawLine {
          from { stroke-dasharray: 500; stroke-dashoffset: 500; }
          to { stroke-dasharray: 500; stroke-dashoffset: 0; }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes glassShimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .sa-animate {
          opacity: 0;
          transform: translateX(-40px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .sa-animate.sa-visible {
          opacity: 1;
          transform: translateX(0);
        }

        .sa-animate.from-right {
          transform: translateX(40px);
        }

        .sa-animate.from-right.sa-visible {
          transform: translateX(0);
        }

        .sa-timeline-line {
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1s ease;
        }

        .sa-visible .sa-timeline-line {
          transform: scaleY(1);
        }

        .sa-section-histoire {
          background: #020817;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
        }

        .sa-section-histoire::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        .sa-section-histoire::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(45px);
          pointer-events: none;
          z-index: 0;
        }

        .sa-histoire-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          position: relative;
          z-index: 2;
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
          width: 3px;
          background: linear-gradient(to bottom, #3B82F6, #7C3AED);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sa-visible .sa-timeline::before {
          transform: scaleY(1);
        }

        .sa-visible .sa-timeline::before {
          transform: scaleY(1);
        }

        .sa-timeline-item {
          position: relative;
          margin-bottom: 60px;
          opacity: 0;
          transform: translateX(-50px);
          transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sa-animate .sa-timeline-item:nth-child(1) {
          transition-delay: 0.2s;
        }

        .sa-animate .sa-timeline-item:nth-child(2) {
          transition-delay: 0.35s;
        }

        .sa-animate .sa-timeline-item:nth-child(3) {
          transition-delay: 0.5s;
        }

        .sa-animate .sa-timeline-item:nth-child(4) {
          transition-delay: 0.65s;
        }

        .sa-visible .sa-timeline-item {
          opacity: 1;
          transform: translateX(0);
        }

        .sa-timeline-dot {
          position: absolute;
          left: -48px;
          top: 0;
          width: 24px;
          height: 24px;
          background: #020817;
          border: 2px solid #3B82F6;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.6); }
          50% { box-shadow: 0 0 0 8px rgba(99,102,241,0); }
        }

        .sa-timeline-item:hover .sa-timeline-dot {
          transform: scale(1.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
          border-color: #7C3AED;
        }

        .sa-timeline-year {
          font-size: 28px;
          font-weight: 800;
          color: #3B82F6;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }

        .sa-timeline-text {
          color: #94A3B8;
          font-size: 15px;
          line-height: 1.7;
          font-weight: 500;
        }

        .sa-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .sa-stat-card {
          background: #0F172A;
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 32px;
          backdrop-filter: blur(10px);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
          opacity: 0;
          transform: translateX(50px);
        }

        .sa-visible .sa-stat-card {
          opacity: 1;
          transform: translateX(0);
        }

        .sa-visible .sa-stat-card:nth-child(1) {
          transition-delay: 0.4s;
        }

        .sa-visible .sa-stat-card:nth-child(2) {
          transition-delay: 0.5s;
        }

        .sa-visible .sa-stat-card:nth-child(3) {
          transition-delay: 0.6s;
        }

        .sa-visible .sa-stat-card:nth-child(4) {
          transition-delay: 0.7s;
        }

        .sa-stat-card:hover {
          background: #1E293B;
          border-color: rgba(99, 102, 241, 0.5);
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
        }

        .sa-stat-value {
          font-size: 36px;
          font-weight: 900;
          color: #3B82F6;
          margin-bottom: 10px;
          letter-spacing: -1px;
        }

        .sa-stat-label {
          font-size: 15px;
          color: #94A3B8;
          font-weight: 600;
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
          background: linear-gradient(180deg, #6366F1 0%, #7C3AED 50%, #0EA5E9 100%);
          box-shadow: 0 0 20px rgba(99,102,241,0.3);
        }

        .sa-timeline-item {
          position: relative;
          padding-left: 80px;
          padding-bottom: 40px;
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sa-visible .sa-timeline-item {
          opacity: 1;
          transform: translateX(0);
        }

        .sa-visible .sa-timeline-item:nth-child(1) {
          transition-delay: 0.3s;
        }

        .sa-visible .sa-timeline-item:nth-child(2) {
          transition-delay: 0.6s;
        }

        .sa-visible .sa-timeline-item:nth-child(3) {
          transition-delay: 0.9s;
        }

        .sa-visible .sa-timeline-item:nth-child(4) {
          transition-delay: 1.2s;
        }

        .sa-timeline-dot {
          position: absolute;
          left: -48px;
          top: 0;
          width: 24px;
          height: 24px;
          background: #FFFFFF;
          border: 3px solid #6366F1;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(99,102,241,0.4);
          transition: all 0.3s ease;
        }

        .sa-timeline-item:hover .sa-timeline-dot {
          transform: scale(1.4);
          box-shadow: 0 0 30px rgba(99,102,241,0.8);
          border-color: #7C3AED;
        }

        .sa-timeline-year {
          font-size: 24px;
          font-weight: 700;
          color: #6366F1;
          margin-bottom: 8px;
        }

        .sa-timeline-text {
          color: #64748B;
          font-size: 14px;
          line-height: 1.6;
        }

        .sa-stat-card {
          background: #F8FAFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 30px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-shadow: 0 4px 24px rgba(99,102,241,0.08);
        }

        .sa-stat-card:hover {
          background: #FFFFFF;
          border-color: #C7D2FE;
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(99,102,241,0.15);
        }

        .sa-stat-value {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #6366F1, #7C3AED, #0EA5E9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
        }

        .sa-stat-label {
          font-size: 14px;
          color: #64748B;
        }

        /* =============== SERVICES SECTION =============== */
        .sa-section-services {
          background: #0D1117;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
        }

        .sa-section-services::before {
          content: '';
          position: absolute;
          top: -30%;
          left: -8%;
          width: 700px;
          height: 700px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(55px);
          pointer-events: none;
          z-index: 0;
        }

        .sa-section-services::after {
          content: '';
          position: absolute;
          bottom: -25%;
          right: -5%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          z-index: 0;
        }

        .sa-services-header {
          text-align: center;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(-30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 2;
        }

        .sa-animate .sa-services-header {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-services-header h2 {
          font-size: 44px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .sa-services-header p {
          color: #94A3B8;
          font-size: 17px;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 500;
        }

        .sa-services-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 32px;
          position: relative;
          z-index: 2;
        }

        .sa-service-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 20px;
          padding: 44px;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          opacity: 0;
          transform: translateY(40px);
        }

        .sa-animate .sa-service-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-animate .sa-service-card:nth-child(1) { transition-delay: 0.2s; }
        .sa-animate .sa-service-card:nth-child(2) { transition-delay: 0.3s; }
        .sa-animate .sa-service-card:nth-child(3) { transition-delay: 0.4s; }
        .sa-animate .sa-service-card:nth-child(4) { transition-delay: 0.5s; }
        .sa-animate .sa-service-card:nth-child(5) { transition-delay: 0.6s; }
        .sa-animate .sa-service-card:nth-child(6) { transition-delay: 0.7s; }

        .sa-service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .sa-service-card:hover::before {
          left: 100%;
        }

        .sa-service-card:hover {
          transform: translateY(-16px);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.2);
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.5) 100%);
        }

        .sa-service-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          margin-bottom: 28px;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.25);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .sa-service-card:hover .sa-service-icon {
          transform: scale(1.15) rotate(-5deg);
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.4);
        }

        .sa-service-title {
          font-size: 22px;
          font-weight: 800;
          color: #F1F5F9;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
        }

        .sa-service-desc {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.8;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        .sa-animate .sa-service-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-animate .sa-service-card:nth-child(1) {
          transition-delay: 0.2s;
        }

        .sa-animate .sa-service-card:nth-child(2) {
          transition-delay: 0.3s;
        }

        .sa-animate .sa-service-card:nth-child(3) {
          transition-delay: 0.4s;
        }

        .sa-animate .sa-service-card:nth-child(4) {
          transition-delay: 0.5s;
        }

        .sa-animate .sa-service-card:nth-child(5) {
          transition-delay: 0.6s;
        }

        .sa-animate .sa-service-card:nth-child(6) {
          transition-delay: 0.7s;
        }

        .sa-service-card::before {
          content: '';
          position: absolute;
          top: -100%;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, transparent 100%);
          transition: top 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }

        .sa-service-card:hover::before {
          top: 0;
        }

        .sa-service-card:hover {
          transform: translateY(-16px);
          border-color: #C7D2FE;
          box-shadow: 0 30px 60px rgba(99,102,241,0.15);
        }

        .sa-service-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #6366F1, #7C3AED);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          color: white;
          margin-bottom: 28px;
          box-shadow: 0 12px 32px rgba(99,102,241,0.25);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 1;
        }

        .sa-service-card:hover .sa-service-icon {
          transform: scale(1.15) rotate(-5deg);
          box-shadow: 0 16px 40px rgba(99,102,241,0.35);
        }

        .sa-service-title {
          font-size: 22px;
          font-weight: 800;
          color: #1E293B;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 1;
        }

        .sa-service-desc {
          font-size: 15px;
          color: #64748B;
          line-height: 1.8;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        /* =============== TEAM SECTION =============== */
        .sa-section-team {
          background: #020817;
          padding: 80px 40px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid rgba(99, 102, 241, 0.08);
        }

        .sa-section-team::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -12%;
          width: 750px;
          height: 750px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          z-index: 0;
        }

        .sa-section-team::after {
          content: '';
          position: absolute;
          bottom: -35%;
          left: -8%;
          width: 650px;
          height: 650px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(55px);
          pointer-events: none;
          z-index: 0;
        }

        .sa-team-header {
          text-align: center;
          margin-bottom: 80px;
          opacity: 0;
          transform: translateY(-30px);
          transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 2;
        }

        .sa-animate .sa-team-header {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-team-header h2 {
          font-size: 44px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
        }

        .sa-team-header p {
          color: #94A3B8;
          font-size: 17px;
          font-weight: 500;
        }

        .sa-team-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 24px;
          padding: 44px;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 1px rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          opacity: 0;
          transform: translateY(40px);
        }

        .sa-animate .sa-team-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-animate .sa-team-card:nth-child(1) { transition-delay: 0.2s; }
        .sa-animate .sa-team-card:nth-child(2) { transition-delay: 0.35s; }
        .sa-animate .sa-team-card:nth-child(3) { transition-delay: 0.5s; }
        .sa-animate .sa-team-card:nth-child(4) { transition-delay: 0.65s; }

        .sa-team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1));
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .sa-team-card:hover::before {
          opacity: 1;
        }

        .sa-team-card:hover {
          transform: translateY(-20px);
          border-color: rgba(99, 102, 241, 0.5);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.2);
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.5) 100%);
        }

        .sa-team-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6, #7C3AED, #06B6D4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 44px;
          font-weight: 800;
          color: white;
          margin: 0 auto 24px;
          box-shadow: 0 16px 40px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 2;
          letter-spacing: -1px;
        }

        .sa-team-card:hover .sa-team-avatar {
          transform: scale(1.2);
          box-shadow: 0 24px 48px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.15);
        }

        .sa-team-name {
          font-size: 22px;
          font-weight: 800;
          color: #F1F5F9;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 2;
        }

        .sa-team-role {
          font-size: 15px;
          color: #3B82F6;
          margin-bottom: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 2;
        }

        .sa-team-bio {
          font-size: 14px;
          color: #94A3B8;
          line-height: 1.8;
          font-weight: 500;
          position: relative;
          z-index: 2;
        }

        .sa-animate .sa-team-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-animate .sa-team-card:nth-child(1) {
          transition-delay: 0.2s;
        }

        .sa-animate .sa-team-card:nth-child(2) {
          transition-delay: 0.35s;
        }

        .sa-animate .sa-team-card:nth-child(3) {
          transition-delay: 0.5s;
        }

        .sa-animate .sa-team-card:nth-child(4) {
          transition-delay: 0.65s;
        }

        .sa-team-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent, rgba(59, 130, 246, 0.1));
          border-radius: 24px;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .sa-team-card:hover::before {
          opacity: 1;
        }

        .sa-team-card:hover {
          transform: translateY(-20px);
          border-color: rgba(99, 102, 241, 0.4);
          box-shadow: 0 40px 80px rgba(59, 130, 246, 0.2);
        }

        .sa-team-name {
          font-size: 22px;
          font-weight: 800;
          color: #F1F5F9;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 2;
        }

        .sa-team-role {
          font-size: 15px;
          color: #3B82F6;
          margin-bottom: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          z-index: 2;
        }

        .sa-team-bio {
          font-size: 14px;
          color: #94A3B8;
          line-height: 1.8;
          font-weight: 500;
          position: relative;
          z-index: 2;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sa-hero {
            flex-direction: column;
            padding: 60px 20px;
            min-height: auto;
            gap: 2rem;
          }

          .sa-hero-inner {
            max-width: 100%;
            text-align: center;
          }

          .sa-hero-visual {
            max-width: 100%;
            min-height: 400px;
          }

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
      <section className="sa-section-histoire sa-animate">
        <div className="sa-histoire-container">
          <div className="sa-timeline sa-animate">
            <div className="sa-timeline-line"></div>
            <div className="sa-timeline-item sa-animate">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2010</div>
              <div className="sa-timeline-text">Fondation de Smart Archives avec une vision claire de la transformation documentaire</div>
            </div>
            <div className="sa-timeline-item sa-animate">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2015</div>
              <div className="sa-timeline-text">Lancement de nos services cloud et expansion à travers le continent africain</div>
            </div>
            <div className="sa-timeline-item sa-animate">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2020</div>
              <div className="sa-timeline-text">Certification ISO 27001 et adoption massive par les institutions publiques</div>
            </div>
            <div className="sa-timeline-item sa-animate">
              <div className="sa-timeline-dot"></div>
              <div className="sa-timeline-year">2024</div>
              <div className="sa-timeline-text">Leader incontournable de l&apos;archivage numérique en Algérie avec 500+ clients</div>
            </div>
          </div>

          <div className="sa-stats-grid">
            <div className="sa-stat-card sa-animate from-right">
              <div className="sa-stat-value">500+</div>
              <div className="sa-stat-label">Clients satisfaits</div>
            </div>
            <div className="sa-stat-card sa-animate from-right">
              <div className="sa-stat-value">1M+</div>
              <div className="sa-stat-label">Documents archivés</div>
            </div>
            <div className="sa-stat-card sa-animate from-right">
              <div className="sa-stat-value">15+</div>
              <div className="sa-stat-label">Ann��es d&apos;expérience</div>
            </div>
            <div className="sa-stat-card sa-animate from-right">
              <div className="sa-stat-value">99.9%</div>
              <div className="sa-stat-label">Disponibilité garantie</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: NOS SERVICES */}
      <section className="sa-section-services sa-animate">
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
      <section className="sa-section-team sa-animate">
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
