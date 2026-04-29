import { useReveal } from "./pageHooks";
import { PARTNERS } from "./pageData";
import { useEffect, useState } from "react";

export default function PageHome({ go }) {
  const [openChatbot, setOpenChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', text: 'Bonjour 👋 Je suis Smart Archives AI. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages([
      ...chatMessages,
      { type: 'user', text: chatInput },
      { type: 'bot', text: 'Merci pour votre question. Notre équipe vous répondra bientôt.' }
    ]);
    setChatInput('');
  };

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

        html.light-theme {
          --sa-bg-primary: #F7FAFF;
          --sa-bg-secondary: #FFFFFF;
          --sa-bg-card: #F8FAFF;
          --sa-bg-card-hover: #FFFFFF;
          --sa-border: rgba(99, 102, 241, 0.2);
          --sa-border-hover: rgba(99, 102, 241, 0.5);
          --sa-text-primary: #0A0F2C;
          --sa-text-secondary: #3D4D6A;
          --sa-text-muted: #8494B2;
          --sa-accent-blue: #2563EB;
          --sa-accent-violet: #7C3AED;
          --sa-accent-cyan: #0EA5E9;
          --sa-glow-blue: rgba(37, 99, 235, 0.15);
          --sa-glow-violet: rgba(124, 58, 237, 0.12);
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

        /* =============== HERO PREMIUM DESIGN =============== */
        .sa-hero {
          display: flex;
          flex-direction: row;
          align-items: center;
          min-height: 100vh;
          padding: 0 6%;
          gap: 4rem;
          background: linear-gradient(135deg, #020817 0%, #0a0f2e 40%, #0f1729 70%, #020817 100%);
          position: relative;
          overflow: hidden;
          border-bottom: 2px solid rgba(99, 102, 241, 0.12);
          transition: background 0.5s ease;
        }

        .sa-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          animation: glow 8s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1.2; }
        }

        .sa-hero::after {
          content: '';
          position: absolute;
          bottom: -30%;
          left: -10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(50px);
          pointer-events: none;
          animation: glow 10s ease-in-out infinite reverse;
        }

        html.light-theme .sa-hero {
          background: linear-gradient(135deg, #ffffff 0%, #f8faff 40%, #f0f5ff 70%, #ffffff 100%);
          border-bottom: 2px solid rgba(99, 102, 241, 0.15);
        }

        html.light-theme .sa-hero::before {
          background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
        }

        html.light-theme .sa-hero::after {
          background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%);
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
        .sa-hero-left {
          flex: 1;
          position: relative;
          z-index: 2;
        }

        .sa-hero-title {
          font-size: 64px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 24px 0;
          line-height: 1.1;
          letter-spacing: -2px;
          text-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          animation: titleGlow 3s ease-in-out infinite;
        }

        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); }
          50% { text-shadow: 0 20px 60px rgba(59, 130, 246, 0.4); }
        }

        html.light-theme .sa-hero-title {
          color: #0A0F2C;
          text-shadow: 0 5px 20px rgba(37, 99, 235, 0.1);
        }

        .sa-hero-subtitle {
          font-size: 20px;
          color: #94A3B8;
          margin: 0 0 24px 0;
          line-height: 1.7;
          font-weight: 500;
          animation: fadeInUp 0.8s ease-out 0.2s both;
          max-width: 600px;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        html.light-theme .sa-hero-subtitle {
          color: #3D4D6A;
        }

        .sa-hero-cta {
          display: flex;
          gap: 16px;
          animation: fadeInUp 0.8s ease-out 0.4s both;
          flex-wrap: wrap;
        }

        .sa-hero-btn {
          padding: 16px 32px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          letter-spacing: -0.5px;
        }

        .sa-hero-btn-primary {
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          color: white;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
        }

        .sa-hero-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.4);
        }

        .sa-hero-btn-secondary {
          background: rgba(99, 102, 241, 0.1);
          color: #3B82F6;
          border: 1.5px solid rgba(99, 102, 241, 0.3);
          backdrop-filter: blur(10px);
        }

        .sa-hero-btn-secondary:hover {
          background: rgba(99, 102, 241, 0.2);
          border-color: rgba(99, 102, 241, 0.6);
          transform: translateY(-3px);
        }

        html.light-theme .sa-hero-btn-primary {
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.25);
        }

        html.light-theme .sa-hero-btn-primary:hover {
          box-shadow: 0 20px 60px rgba(37, 99, 235, 0.35);
        }

        html.light-theme .sa-hero-btn-secondary {
          background: rgba(37, 99, 235, 0.08);
          color: #2563EB;
          border-color: rgba(37, 99, 235, 0.25);
        }

        html.light-theme .sa-hero-btn-secondary:hover {
          background: rgba(37, 99, 235, 0.15);
          border-color: rgba(37, 99, 235, 0.5);
        }

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

        /* =============== TIMELINE SECTION PREMIUM =============== */
        .sa-histoire-container {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .sa-timeline {
          position: relative;
          padding: 20px 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
        }

        .sa-timeline-line {
          display: none;
        }

        @media (max-width: 768px) {
          .sa-timeline-line {
            display: none;
          }
        }

        .sa-timeline-item {
          margin-bottom: 0;
          position: relative;
          opacity: 0;
          transform: translateY(30px);
          animation: timelineSlideIn 0.8s ease-out forwards;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .sa-timeline-item:hover {
          border-color: rgba(99, 102, 241, 0.6);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.2);
          transform: translateY(0);
        }

        @keyframes timelineSlideIn {
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        .sa-timeline-item:nth-child(1) { animation-delay: 0.2s; }
        .sa-timeline-item:nth-child(2) { animation-delay: 0.4s; }
        .sa-timeline-item:nth-child(3) { animation-delay: 0.6s; }
        .sa-timeline-item:nth-child(4) { animation-delay: 0.8s; }

        .sa-timeline-dot {
          position: static;
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          border-radius: 50%;
          transform: none;
          box-shadow: 0 0 0 3px rgba(15, 23, 42, 1), 0 0 12px rgba(59, 130, 246, 0.5);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          margin-right: 12px;
        }

        .sa-timeline-item:hover .sa-timeline-dot {
          width: 16px;
          height: 16px;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 1), 0 0 24px rgba(59, 130, 246, 0.8);
        }

        @media (max-width: 768px) {
          .sa-timeline-dot {
            position: static;
          }
        }

        .sa-timeline-year {
          position: static;
          font-size: 16px;
          font-weight: 900;
          color: #3B82F6;
          transform: none;
          background: none;
          padding: 0;
          border-radius: 0;
          transition: color 0.3s ease;
          display: inline-block;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .sa-timeline-item:hover .sa-timeline-year {
          color: #7C3AED;
        }

        html.light-theme .sa-timeline-year {
          background: none;
          color: #2563EB;
        }

        html.light-theme .sa-timeline-item:hover .sa-timeline-year {
          color: #7C3AED;
        }

        @media (max-width: 768px) {
          .sa-timeline-year {
            position: static;
          }
        }

        .sa-timeline-text {
          margin-left: 0;
          padding: 0;
          background: none;
          border: none;
          border-radius: 0;
          color: #94A3B8;
          font-size: 14px;
          line-height: 1.6;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .sa-timeline-item:hover .sa-timeline-text {
          border: none;
          background: none;
          box-shadow: none;
          color: #F1F5F9;
        }

        html.light-theme .sa-timeline-text {
          background: none;
          border: none;
          color: #3D4D6A;
        }

        html.light-theme .sa-timeline-item:hover .sa-timeline-text {
          border: none;
          background: none;
          color: #0A0F2C;
        }

        @media (max-width: 768px) {
          .sa-timeline-text {
            margin-left: 0;
          }
        }

        .sa-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-top: 32px;
          position: relative;
          z-index: 2;
        }

        .sa-stat-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.3);
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          opacity: 0;
          transform: translateX(-30px);
        }

        .sa-visible .sa-stat-card {
          opacity: 1;
          transform: translateX(0);
        }

        .sa-stat-card:nth-child(1) { animation-delay: 0.3s; }
        .sa-stat-card:nth-child(2) { animation-delay: 0.35s; }
        .sa-stat-card:nth-child(3) { animation-delay: 0.4s; }
        .sa-stat-card:nth-child(4) { animation-delay: 0.45s; }

        html.light-theme .sa-stat-card {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(124, 58, 237, 0.06) 100%);
          border-color: rgba(37, 99, 235, 0.2);
        }

        .sa-stat-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.8);
          box-shadow: 0 16px 48px rgba(59, 130, 246, 0.25), inset 0 0 1px rgba(255, 255, 255, 0.1);
        }

        html.light-theme .sa-stat-card:hover {
          border-color: rgba(37, 99, 235, 0.6);
          box-shadow: 0 16px 48px rgba(37, 99, 235, 0.12), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-stat-value {
          font-size: 28px;
          font-weight: 900;
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 8px 0;
          letter-spacing: -1px;
        }

        .sa-stat-label {
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-stat-label {
          color: #3D4D6A;
        }

        .sa-stat-card:hover .sa-stat-label {
          color: #F1F5F9;
        }

        html.light-theme .sa-stat-card:hover .sa-stat-label {
          color: #0A0F2C;
        }

        /* =============== HISTOIRE SECTION PREMIUM =============== */
        .sa-section-histoire {
          background: linear-gradient(135deg, #020817 0%, #0A0F2E 50%, #020817 100%);
          padding: 70px 40px;
          position: relative;
          overflow: hidden;
          border-top: 2px solid rgba(99, 102, 241, 0.12);
          border-bottom: 2px solid rgba(99, 102, 241, 0.12);
          transition: background 0.5s ease;
        }

        html.light-theme .sa-section-histoire {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 50%, #FFFFFF 100%);
          border-top: 1px solid rgba(99, 102, 241, 0.12);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }

        .sa-section-histoire::before {
          content: '';
          position: absolute;
          top: -20%;
          right: 10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .sa-section-histoire::after {
          content: '';
          position: absolute;
          bottom: -10%;
          left: 5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .sa-histoire-title {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 40px;
          position: relative;
          z-index: 2;
        }

        .sa-histoire-title h2 {
          font-size: 48px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -1px;
          transition: color 0.3s ease;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        html.light-theme .sa-histoire-title h2 {
          color: #0A0F2C;
        }

        .sa-histoire-title p {
          font-size: 16px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
          line-height: 1.6;
          text-align: center;
        }

        html.light-theme .sa-histoire-title p {
          color: #3D4D6A;
        }

        /* =============== CHATBOT GLASSMORPHIC SECTION =============== */
        .sa-section-chatbot {
          background: #020817;
          padding: 70px 40px;
          position: relative;
          overflow: hidden;
          border-top: 2px solid rgba(99, 102, 241, 0.12);
          border-bottom: 2px solid rgba(99, 102, 241, 0.12);
          transition: background 0.5s ease;
        }

        html.light-theme .sa-section-chatbot {
          background: #FFFFFF;
          border-top: 1px solid rgba(99, 102, 241, 0.12);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }

        .sa-chatbot-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .sa-chatbot-title {
          text-align: center;
          margin-bottom: 48px;
        }

        .sa-chatbot-title h2 {
          font-size: 40px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -1px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-chatbot-title h2 {
          color: #0A0F2C;
        }

        .sa-chatbot-title p {
          font-size: 17px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-chatbot-title p {
          color: #3D4D6A;
        }

        .sa-chatbot-wrapper {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.3);
          border-radius: 20px;
          padding: 24px;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 0 1px rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          height: 500px;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(40px);
        }

        html.light-theme .sa-chatbot-wrapper {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-visible .sa-chatbot-wrapper {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-chatbot-wrapper:hover {
          border-color: rgba(99, 102, 241, 0.6);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.15);
        }

        html.light-theme .sa-chatbot-wrapper:hover {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 20px 60px rgba(37, 99, 235, 0.15), inset 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .sa-chatbot-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 16px;
          padding-right: 8px;
        }

        .sa-chatbot-messages::-webkit-scrollbar {
          width: 6px;
        }

        .sa-chatbot-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .sa-chatbot-messages::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }

        .sa-chatbot-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        .sa-chat-message {
          display: flex;
          gap: 12px;
          animation: chatSlideIn 0.4s ease-out;
        }

        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sa-chat-message.bot {
          justify-content: flex-start;
        }

        .sa-chat-message.user {
          justify-content: flex-end;
        }

        .sa-chat-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sa-chat-avatar.bot-avatar {
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          color: white;
          font-size: 18px;
        }

        .sa-chat-content {
          max-width: 60%;
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
        }

        .sa-chat-message.bot .sa-chat-content {
          background: rgba(99, 102, 241, 0.15);
          color: #F1F5F9;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .sa-chat-message.user .sa-chat-content {
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .sa-chat-message.bot .sa-chat-content p,
        .sa-chat-message.user .sa-chat-content p {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
        }

        html.light-theme .sa-chat-message.bot .sa-chat-content {
          background: rgba(37, 99, 235, 0.1);
          color: #0A0F2C;
          border-color: rgba(37, 99, 235, 0.2);
        }

        html.light-theme .sa-chat-message.user .sa-chat-content {
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.2);
        }

        .sa-chatbot-input-area {
          display: flex;
          gap: 8px;
          border-top: 1px solid rgba(99, 102, 241, 0.15);
          padding-top: 16px;
        }

        .sa-chatbot-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.4);
          color: #F1F5F9;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .sa-chatbot-input:focus {
          border-color: rgba(99, 102, 241, 0.6);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .sa-chatbot-input::placeholder {
          color: #64748B;
        }

        html.light-theme .sa-chatbot-input {
          background: rgba(248, 250, 255, 0.5);
          color: #0A0F2C;
          border-color: rgba(37, 99, 235, 0.2);
        }

        html.light-theme .sa-chatbot-input:focus {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.15);
        }

        html.light-theme .sa-chatbot-input::placeholder {
          color: #8494B2;
        }

        .sa-chatbot-send {
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .sa-chatbot-send:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
        }

        .sa-chatbot-send:active {
          transform: scale(0.95);
        }

        /* =============== FEATURES SECTION PREMIUM =============== */
        .sa-section-features {
          background: linear-gradient(135deg, #0D1117 0%, #0F1729 50%, #0D1117 100%);
          padding: 70px 40px;
          position: relative;
          overflow: hidden;
          border-top: 2px solid rgba(99, 102, 241, 0.12);
          border-bottom: 2px solid rgba(99, 102, 241, 0.12);
          transition: background 0.5s ease;
        }

        html.light-theme .sa-section-features {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 50%, #FFFFFF 100%);
          border-top: 1px solid rgba(99, 102, 241, 0.12);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }

        .sa-features-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 28px;
          position: relative;
          z-index: 2;
        }

        .sa-services-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 28px;
          position: relative;
          z-index: 2;
        }

        .sa-team-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 28px;
          position: relative;
          z-index: 2;
        }

        .sa-histoire-title {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 28px;
          position: relative;
          z-index: 2;
        }

        .sa-features-header h2,
        .sa-services-header h2,
        .sa-team-header h2,
        .sa-histoire-title h2 {
          font-size: 46px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 10px 0;
          letter-spacing: -1.5px;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        html.light-theme .sa-features-header h2,
        html.light-theme .sa-services-header h2,
        html.light-theme .sa-team-header h2,
        html.light-theme .sa-histoire-title h2 {
          color: #0A0F2C;
        }

        .sa-features-header p,
        .sa-services-header p,
        .sa-team-header p,
        .sa-histoire-title p {
          font-size: 15px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
          line-height: 1.6;
          text-align: center;
          letter-spacing: -0.2px;
        }

        html.light-theme .sa-features-header p,
        html.light-theme .sa-services-header p,
        html.light-theme .sa-team-header p,
        html.light-theme .sa-histoire-title p {
          color: #3D4D6A;
        }

        html.light-theme .sa-features-header h2 {
          color: #0A0F2C;
        }

        .sa-features-header p {
          font-size: 16px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
          line-height: 1.6;
          text-align: center;
        }

        html.light-theme .sa-features-header p {
          color: #3D4D6A;
        }

        .sa-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 18px;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .sa-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 18px;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .sa-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .sa-feature-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.4);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.15);
          opacity: 0;
          transform: translateY(30px);
        }

        .sa-visible .sa-feature-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-feature-card:nth-child(2) { animation-delay: 0.15s; }
        .sa-feature-card:nth-child(3) { animation-delay: 0.2s; }
        .sa-feature-card:nth-child(4) { animation-delay: 0.25s; }
        .sa-feature-card:nth-child(5) { animation-delay: 0.3s; }
        .sa-feature-card:nth-child(6) { animation-delay: 0.35s; }

        html.light-theme .sa-feature-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15), inset 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .sa-feature-card:hover {
          transform: translateY(-10px);
          border-color: rgba(99, 102, 241, 0.9);
          box-shadow: 0 28px 72px rgba(59, 130, 246, 0.45), inset 0 0 1px rgba(255, 255, 255, 0.2);
        }

        html.light-theme .sa-feature-card:hover {
          border-color: rgba(37, 99, 235, 0.7);
          box-shadow: 0 28px 72px rgba(37, 99, 235, 0.25), inset 0 0 1px rgba(37, 99, 235, 0.2);
        }

        .sa-feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
          pointer-events: none;
        }

        .sa-feature-card:hover::before {
          opacity: 1;
        }

        .sa-feature-icon {
          font-size: 48px;
          margin-bottom: 16px;
          display: inline-block;
          animation: floatingIcon 3s ease-in-out infinite;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sa-feature-card:hover .sa-feature-icon {
          animation: rotatingIcon 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: scale(1.2);
        }

        .sa-feature-card h3 {
          font-size: 18px;
          font-weight: 800;
          color: #F1F5F9;
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-feature-card h3 {
          color: #0A0F2C;
        }

        .sa-feature-card p {
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.6;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-feature-card p {
          color: #3D4D6A;
        }

        .sa-visible .sa-feature-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-feature-card:nth-child(2) { animation-delay: 0.2s; }
        .sa-feature-card:nth-child(3) { animation-delay: 0.3s; }
        .sa-feature-card:nth-child(4) { animation-delay: 0.15s; }
        .sa-feature-card:nth-child(5) { animation-delay: 0.25s; }
        .sa-feature-card:nth-child(6) { animation-delay: 0.35s; }

        html.light-theme .sa-feature-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.1), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-feature-card:hover {
          transform: translateY(-12px);
          border-color: rgba(99, 102, 241, 0.8);
          box-shadow: 0 30px 80px rgba(59, 130, 246, 0.4), inset 0 0 1px rgba(255, 255, 255, 0.2);
        }

        html.light-theme .sa-feature-card:hover {
          border-color: rgba(37, 99, 235, 0.6);
          box-shadow: 0 30px 80px rgba(37, 99, 235, 0.2), inset 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .sa-feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 18px;
          pointer-events: none;
        }

        .sa-feature-card:hover::before {
          opacity: 1;
        }

        .sa-feature-icon {
          font-size: 56px;
          margin-bottom: 24px;
          display: inline-block;
          animation: floatingIcon 3s ease-in-out infinite;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes floatingIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .sa-feature-card:hover .sa-feature-icon {
          animation: rotatingIcon 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: scale(1.15);
        }

        @keyframes rotatingIcon {
          0% { transform: rotate(0) scale(1.15); }
          50% { transform: rotate(15deg) scale(1.25); }
          100% { transform: rotate(0) scale(1.15); }
        }

        .sa-feature-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-feature-card h3 {
          color: #0A0F2C;
        }

        .sa-feature-card p {
          font-size: 14px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.8;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-feature-card p {
          color: #3D4D6A;
        }

        html.light-theme .sa-section-features {
          background: #FFFFFF;
          border-top: 1px solid rgba(99, 102, 241, 0.12);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }

        .sa-features-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 60px;
        }

        .sa-features-header h2 {
          font-size: 44px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 16px 0;
          letter-spacing: -1px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-features-header h2 {
          color: #0A0F2C;
        }

        .sa-features-header p {
          font-size: 17px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-features-header p {
          color: #3D4D6A;
        }

        .sa-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .sa-feature-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0.3) 100%);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
          opacity: 0;
          transform: translateY(40px);
        }

        .sa-visible .sa-feature-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-feature-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-feature-card:nth-child(2) { animation-delay: 0.2s; }
        .sa-feature-card:nth-child(3) { animation-delay: 0.3s; }
        .sa-feature-card:nth-child(4) { animation-delay: 0.4s; }
        .sa-feature-card:nth-child(5) { animation-delay: 0.5s; }
        .sa-feature-card:nth-child(6) { animation-delay: 0.6s; }

        html.light-theme .sa-feature-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .sa-feature-card:hover {
          transform: translateY(-16px);
          border-color: rgba(99, 102, 241, 0.6);
          box-shadow: 0 30px 80px rgba(59, 130, 246, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.1);
        }

        html.light-theme .sa-feature-card:hover {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 30px 80px rgba(37, 99, 235, 0.15), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
          display: inline-block;
          animation: floatingIcon 3s ease-in-out infinite;
        }

        @keyframes floatingIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .sa-feature-card:hover .sa-feature-icon {
          animation: rotatingIcon 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes rotatingIcon {
          0% { transform: rotate(0) scale(1); }
          50% { transform: rotate(10deg) scale(1.1); }
          100% { transform: rotate(0) scale(1); }
        }

        .sa-feature-card h3 {
          font-size: 20px;
          font-weight: 800;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-feature-card h3 {
          color: #0A0F2C;
        }

        .sa-feature-card p {
          font-size: 14px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.7;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-feature-card p {
          color: #3D4D6A;
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
          transition: color 0.3s ease;
        }

        html.light-theme .sa-timeline-year {
          color: #2563EB;
        }

        .sa-timeline-text {
          color: #94A3B8;
          font-size: 15px;
          line-height: 1.7;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-timeline-text {
          color: #3D4D6A;
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

        /* =============== SERVICES SECTION PREMIUM =============== */
        .sa-section-services {
          background: linear-gradient(135deg, #0D1117 0%, #0F1729 50%, #0D1117 100%);
          padding: 70px 40px;
          position: relative;
          overflow: hidden;
          border-top: 2px solid rgba(99, 102, 241, 0.12);
          border-bottom: 2px solid rgba(99, 102, 241, 0.12);
          transition: background 0.5s ease;
        }

        html.light-theme .sa-section-services {
          background: linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 50%, #FFFFFF 100%);
          border-top: 1px solid rgba(99, 102, 241, 0.12);
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }

        .sa-section-services::before {
          content: '';
          position: absolute;
          bottom: 0;
          right: -20%;
          width: 600px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .sa-section-services::after {
          content: '';
          position: absolute;
          top: -10%;
          left: 10%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          filter: blur(40px);
          pointer-events: none;
        }

        .sa-services-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 40px;
          position: relative;
          z-index: 2;
        }

        .sa-services-header h2 {
          font-size: 48px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -1px;
          transition: color 0.3s ease;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        html.light-theme .sa-services-header h2 {
          color: #0A0F2C;
        }

        .sa-services-header p {
          font-size: 16px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
          line-height: 1.6;
          text-align: center;
        }

        html.light-theme .sa-services-header p {
          color: #3D4D6A;
        }

        .sa-services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .sa-service-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.5) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.4);
          border-radius: 16px;
          padding: 32px;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.15);
          opacity: 0;
          transform: translateY(30px);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sa-visible .sa-service-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-service-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-service-card:nth-child(2) { animation-delay: 0.15s; }
        .sa-service-card:nth-child(3) { animation-delay: 0.2s; }
        .sa-service-card:nth-child(4) { animation-delay: 0.25s; }
        .sa-service-card:nth-child(5) { animation-delay: 0.3s; }
        .sa-service-card:nth-child(6) { animation-delay: 0.35s; }

        html.light-theme .sa-service-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.15), inset 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .sa-service-card:hover {
          transform: translateY(-10px);
          border-color: rgba(99, 102, 241, 0.9);
          box-shadow: 0 28px 72px rgba(59, 130, 246, 0.45), inset 0 0 1px rgba(255, 255, 255, 0.2);
        }

        html.light-theme .sa-service-card:hover {
          border-color: rgba(37, 99, 235, 0.7);
          box-shadow: 0 28px 72px rgba(37, 99, 235, 0.25), inset 0 0 1px rgba(37, 99, 235, 0.2);
        }

        .sa-service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
          pointer-events: none;
        }

        .sa-service-card:hover::before {
          opacity: 1;
        }

        .sa-service-icon {
          font-size: 40px;
          color: #3B82F6;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          width: fit-content;
        }

        .sa-service-card:hover .sa-service-icon {
          transform: scale(1.2);
          color: #7C3AED;
        }

        .sa-service-title {
          font-size: 18px;
          font-weight: 800;
          color: #F1F5F9;
          margin: 0;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-service-title {
          color: #0A0F2C;
        }

        .sa-service-desc {
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.6;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-service-desc {
          color: #3D4D6A;
        }

        .sa-visible .sa-service-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-service-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-service-card:nth-child(2) { animation-delay: 0.15s; }
        .sa-service-card:nth-child(3) { animation-delay: 0.2s; }
        .sa-service-card:nth-child(4) { animation-delay: 0.25s; }
        .sa-service-card:nth-child(5) { animation-delay: 0.3s; }
        .sa-service-card:nth-child(6) { animation-delay: 0.35s; }

        html.light-theme .sa-service-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.1), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-service-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 102, 241, 0.8);
          box-shadow: 0 24px 64px rgba(59, 130, 246, 0.35), inset 0 0 1px rgba(255, 255, 255, 0.2);
        }

        html.light-theme .sa-service-card:hover {
          border-color: rgba(37, 99, 235, 0.6);
          box-shadow: 0 24px 64px rgba(37, 99, 235, 0.18), inset 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .sa-service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 16px;
          pointer-events: none;
        }

        .sa-service-card:hover::before {
          opacity: 1;
        }

        .sa-service-icon {
          font-size: 40px;
          color: #3B82F6;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
          width: fit-content;
        }

        .sa-service-card:hover .sa-service-icon {
          transform: scale(1.2);
          color: #7C3AED;
        }

        .sa-service-title {
          font-size: 18px;
          font-weight: 800;
          color: #F1F5F9;
          margin: 0;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-service-title {
          color: #0A0F2C;
        }

        .sa-service-desc {
          font-size: 14px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.6;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-service-desc {
          color: #3D4D6A;
        }

        html.light-theme .sa-section-services {
          background: #FFFFFF;
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
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
          transition: color 0.3s ease;
        }

        html.light-theme .sa-services-header h2 {
          color: #0A0F2C;
        }

        .sa-services-header p {
          color: #94A3B8;
          font-size: 17px;
          max-width: 700px;
          margin: 0 auto;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-services-header p {
          color: #3D4D6A;
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

        html.light-theme .sa-service-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1), inset 0 0 1px rgba(37, 99, 235, 0.1);
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
          transition: color 0.3s ease;
        }

        html.light-theme .sa-service-title {
          color: #0A0F2C;
        }

        .sa-service-desc {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.8;
          font-weight: 500;
          position: relative;
          z-index: 1;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-service-desc {
          color: #3D4D6A;
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
        /* =============== TEAM SECTION PREMIUM =============== */
        .sa-section-team {
          background: #020817;
          padding: 70px 40px;
          position: relative;
          overflow: hidden;
          border-bottom: 2px solid rgba(99, 102, 241, 0.12);
          transition: background 0.5s ease;
        }

        html.light-theme .sa-section-team {
          background: #FFFFFF;
          border-bottom: 1px solid rgba(99, 102, 241, 0.12);
        }

        .sa-team-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 40px;
          position: relative;
          z-index: 2;
        }

        .sa-team-header h2 {
          font-size: 48px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -1px;
          transition: color 0.3s ease;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-align: center;
        }

        html.light-theme .sa-team-header h2 {
          color: #0A0F2C;
        }

        .sa-team-header p {
          font-size: 16px;
          color: #94A3B8;
          margin: 0;
          transition: color 0.3s ease;
          line-height: 1.6;
          text-align: center;
        }

        html.light-theme .sa-team-header p {
          color: #3D4D6A;
        }

        .sa-team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .sa-team-card {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.3);
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2), inset 0 0 1px rgba(255, 255, 255, 0.1);
          opacity: 0;
          transform: translateY(30px);
        }

        .sa-visible .sa-team-card {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-team-card:nth-child(1) { animation-delay: 0.1s; }
        .sa-team-card:nth-child(2) { animation-delay: 0.15s; }
        .sa-team-card:nth-child(3) { animation-delay: 0.2s; }

        html.light-theme .sa-team-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 12px 40px rgba(37, 99, 235, 0.1), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-team-card:hover {
          transform: translateY(-8px);
          border-color: rgba(99, 102, 241, 0.8);
          box-shadow: 0 24px 64px rgba(59, 130, 246, 0.35), inset 0 0 1px rgba(255, 255, 255, 0.2);
        }

        html.light-theme .sa-team-card:hover {
          border-color: rgba(37, 99, 235, 0.6);
          box-shadow: 0 24px 64px rgba(37, 99, 235, 0.18), inset 0 0 1px rgba(37, 99, 235, 0.15);
        }

        .sa-team-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6, #7C3AED);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: 800;
          margin: 0 auto 16px;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .sa-team-card:hover .sa-team-avatar {
          transform: scale(1.1);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
        }

        .sa-team-name {
          font-size: 18px;
          font-weight: 800;
          color: #F1F5F9;
          margin: 0 0 6px 0;
          letter-spacing: -0.5px;
          transition: color 0.3s ease;
        }

        html.light-theme .sa-team-name {
          color: #0A0F2C;
        }

        .sa-team-role {
          font-size: 13px;
          font-weight: 700;
          color: #3B82F6;
          margin: 0 0 10px 0;
          transition: color 0.3s ease;
        }

        .sa-team-card:hover .sa-team-role {
          color: #7C3AED;
        }

        .sa-team-bio {
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
          line-height: 1.5;
          transition: color 0.3s ease;
          min-height: 45px;
        }

        html.light-theme .sa-team-bio {
          color: #3D4D6A;
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
          border: 2px solid rgba(99, 102, 241, 0.25);
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
          overflow: hidden;
        }

        .sa-team-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1), transparent 70%);
          animation: shimmerTeam 3s infinite;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes shimmerTeam {
          0% { transform: translate(-100%, -100%); }
          100% { transform: translate(100%, 100%); }
        }

        html.light-theme .sa-team-card {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1), inset 0 0 1px rgba(37, 99, 235, 0.1);
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

        @keyframes borderGlow {
          0% { border-color: rgba(59, 130, 246, 0.3); }
          50% { border-color: rgba(124, 58, 237, 0.8); }
          100% { border-color: rgba(59, 130, 246, 0.3); }
        }

        .sa-team-card:hover {
          transform: translateY(-20px);
          animation: borderGlow 2s ease-in-out infinite;
          box-shadow: 0 30px 80px rgba(59, 130, 246, 0.4), inset 0 0 1px rgba(255, 255, 255, 0.2), 0 0 40px rgba(59, 130, 246, 0.2);
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(20, 30, 60, 0.5) 100%);
        }

        .sa-team-card:hover::before {
          opacity: 1;
        }

        html.light-theme .sa-team-card:hover {
          border-color: rgba(37, 99, 235, 0.6);
          box-shadow: 0 30px 80px rgba(37, 99, 235, 0.2), inset 0 0 1px rgba(37, 99, 235, 0.15), 0 0 40px rgba(37, 99, 235, 0.15);
          background: linear-gradient(135deg, rgba(248, 250, 255, 1) 0%, rgba(240, 248, 255, 0.9) 100%);
        }

        .sa-team-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 50%, #06B6D4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          color: white;
          margin: 0 auto 28px;
          box-shadow: 0 20px 50px rgba(59, 130, 246, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.15);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          z-index: 2;
          letter-spacing: -1px;
          border: 3px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }

        .sa-team-avatar::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2), transparent 70%);
          animation: avatarShimmer 3s infinite;
          opacity: 0;
        }

        @keyframes avatarShimmer {
          0% { transform: translateX(-100%); }
          50% { opacity: 1; }
          100% { transform: translateX(100%); }
        }

        .sa-team-card:hover .sa-team-avatar {
          transform: scale(1.25) rotate(5deg);
          box-shadow: 0 30px 70px rgba(59, 130, 246, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2), 0 0 50px rgba(124, 58, 237, 0.3);
        }

        .sa-team-card:hover .sa-team-avatar::before {
          animation: avatarShimmer 1.5s infinite;
          opacity: 1;
        }

        html.light-theme .sa-team-avatar {
          box-shadow: 0 20px 50px rgba(37, 99, 235, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.2);
        }

        html.light-theme .sa-team-card:hover .sa-team-avatar {
          box-shadow: 0 30px 70px rgba(37, 99, 235, 0.3), inset 0 0 30px rgba(255, 255, 255, 0.25), 0 0 50px rgba(37, 99, 235, 0.2);
        }

        .sa-team-name {
          font-size: 24px;
          font-weight: 900;
          color: #F1F5F9;
          margin: 0 0 12px 0;
          letter-spacing: -0.5px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        html.light-theme .sa-team-name {
          color: #0A0F2C;
        }

        .sa-team-card:hover .sa-team-name {
          color: #3B82F6;
        }

        html.light-theme .sa-team-card:hover .sa-team-name {
          color: #2563EB;
        }

        .sa-team-role {
          font-size: 13px;
          color: #3B82F6;
          margin: 0 0 4px 0;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        html.light-theme .sa-team-role {
          color: #2563EB;
        }

        .sa-team-card:hover .sa-team-role {
          color: #7C3AED;
        }

        html.light-theme .sa-team-card:hover .sa-team-role {
          color: #7C3AED;
        }

        .sa-team-bio {
          font-size: 15px;
          color: #94A3B8;
          line-height: 1.8;
          font-weight: 500;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        html.light-theme .sa-team-bio {
          color: #3D4D6A;
        }

        .sa-team-socials {
          display: flex;
          gap: 12px;
          justify-content: center;
          position: relative;
          z-index: 2;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-top: 20px;
        }

        .sa-team-card:hover .sa-team-socials {
          opacity: 1;
          transform: translateY(0);
        }

        .sa-team-social-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(124, 58, 237, 0.2));
          border: 1px solid rgba(99, 102, 241, 0.3);
          color: #3B82F6;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .sa-team-social-btn:hover {
          transform: scale(1.15);
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(124, 58, 237, 0.4));
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          color: #7C3AED;
        }

        html.light-theme .sa-team-social-btn {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(124, 58, 237, 0.1));
          color: #2563EB;
        }

        html.light-theme .sa-team-social-btn:hover {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(124, 58, 237, 0.2));
          color: #7C3AED;
        }

        /* =============== FLOATING CHATBOT BUTTON =============== */
        .sa-chatbot-float-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sa-chatbot-float-btn:hover {
          transform: scale(1.12);
          box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5);
        }

        .sa-chatbot-float-btn:active {
          transform: scale(0.95);
        }

        /* =============== CHATBOT MODAL GLASSMORPHIC =============== */
        .sa-chatbot-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sa-chatbot-modal {
          position: fixed;
          bottom: 100px;
          right: 28px;
          width: 420px;
          height: 600px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 100%);
          border: 1.5px solid rgba(99, 102, 241, 0.4);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3), inset 0 0 1px rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 1001;
        }

        @keyframes slideInUp {
          from { 
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        html.light-theme .sa-chatbot-modal {
          background: linear-gradient(135deg, rgba(248, 250, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 25px 80px rgba(37, 99, 235, 0.15), inset 0 0 1px rgba(37, 99, 235, 0.1);
        }

        .sa-chatbot-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(99, 102, 241, 0.15);
        }

        .sa-chatbot-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #F1F5F9;
        }

        html.light-theme .sa-chatbot-modal-header h3 {
          color: #0A0F2C;
        }

        .sa-chatbot-close-btn {
          background: none;
          border: none;
          color: #94A3B8;
          font-size: 18px;
          cursor: pointer;
          transition: color 0.3s ease;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sa-chatbot-close-btn:hover {
          color: #F1F5F9;
        }

        .sa-chatbot-modal-messages {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
        }

        .sa-chatbot-modal-messages::-webkit-scrollbar {
          width: 6px;
        }

        .sa-chatbot-modal-messages::-webkit-scrollbar-track {
          background: transparent;
        }

        .sa-chatbot-modal-messages::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 3px;
        }

        .sa-chatbot-modal-messages::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        .sa-chatbot-modal-input {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid rgba(99, 102, 241, 0.15);
        }

        .sa-chatbot-modal-input .sa-chatbot-input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.4);
          color: #F1F5F9;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
        }

        .sa-chatbot-modal-input .sa-chatbot-input:focus {
          border-color: rgba(99, 102, 241, 0.6);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
        }

        .sa-chatbot-modal-input .sa-chatbot-input::placeholder {
          color: #64748B;
        }

        html.light-theme .sa-chatbot-modal-input .sa-chatbot-input {
          background: rgba(248, 250, 255, 0.5);
          color: #0A0F2C;
          border-color: rgba(37, 99, 235, 0.2);
        }

        html.light-theme .sa-chatbot-modal-input .sa-chatbot-input:focus {
          border-color: rgba(37, 99, 235, 0.5);
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.15);
        }

        html.light-theme .sa-chatbot-modal-input .sa-chatbot-input::placeholder {
          color: #8494B2;
        }

        .sa-chatbot-modal-input .sa-chatbot-send {
          width: 44px;
          height: 44px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #3B82F6 0%, #7C3AED 100%);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .sa-chatbot-modal-input .sa-chatbot-send:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
        }

        .sa-chatbot-modal-input .sa-chatbot-send:active {
          transform: scale(0.95);
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .sa-chatbot-modal {
            width: calc(100vw - 32px);
            height: 500px;
            bottom: 90px;
            right: 16px;
          }

          .sa-chatbot-float-btn {
            width: 52px;
            height: 52px;
            font-size: 20px;
          }
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
            <div className="sa-pill-dot"><i className="fas fa-rocket" style={{fontSize:9}}></i></div>
            <span>🎯 Transformez votre gestion documentaire</span>
          </div>
          <h1 className="sa-hero-title">
            Archivage Intelligent.<br />
            <em style={{background: "linear-gradient(135deg, #3B82F6, #7C3AED)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontStyle: "normal"}}>Solutions Numériques.</em>
          </h1>
          <p className="sa-hero-subtitle">
            Découvrez Smart Archives: la plateforme complète pour moderniser votre archivage. Formations, logiciels et services intégrés pour votre succès.
          </p>
          <div className="sa-hero-cta">
            <button className="sa-hero-btn sa-hero-btn-primary" onClick={() => go("contact")}>
              <i className="fas fa-zap"></i> Commencer Maintenant
            </button>
            <button className="sa-hero-btn sa-hero-btn-secondary" onClick={() => go("formations")}>
              <i className="fas fa-play-circle"></i> Découvrir nos formations
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "flex", gap: "32px", marginTop: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(59, 130, 246, 0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3B82F6", fontSize: "18px", fontWeight: "700" }}>+10</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9" }}>Formations</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Professionnelles</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(124, 58, 237, 0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#7C3AED", fontSize: "18px", fontWeight: "700" }}>5</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9" }}>Logiciels</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Spécialisés</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "44px", height: "44px", background: "rgba(6, 182, 212, 0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4", fontSize: "18px", fontWeight: "700" }}>24/7</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#F1F5F9" }}>Support</div>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Réactif</div>
              </div>
            </div>
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

      {/* PREMIUM FEATURES SECTION */}
      <section className="sa-section-features">
        <div className="sa-features-header">
          <h2>Pourquoi choisir Smart Archives ?</h2>
          <p>Une solution complète et intégrée pour moderniser votre gestion documentaire</p>
        </div>
        <div className="sa-features-grid">
          <div className="sa-feature-card">
            <div className="sa-feature-icon">📚</div>
            <h3>Formations Complètes</h3>
            <p>Maîtrisez les meilleurs pratiques d'archivage avec nos formations certifiées et adaptées à tous les niveaux.</p>
          </div>
          <div className="sa-feature-card">
            <div className="sa-feature-icon">💻</div>
            <h3>Logiciels Performants</h3>
            <p>Des solutions cloud-ready, sécurisées et conformes aux normes ISO pour votre tranquillité.</p>
          </div>
          <div className="sa-feature-card">
            <div className="sa-feature-icon">��</div>
            <h3>Sécurité Maximale</h3>
            <p>Chiffrement bout en bout, conformité RGPD, et authentification multi-facteurs intégrée.</p>
          </div>
          <div className="sa-feature-card">
            <div className="sa-feature-icon">⚡</div>
            <h3>Haute Performance</h3>
            <p>Infrastructure cloud scalable capable de traiter millions de documents en temps réel.</p>
          </div>
          <div className="sa-feature-card">
            <div className="sa-feature-icon">🤖</div>
            <h3>IA Intégrée</h3>
            <p>Reconnaissance documentaire automatique, indexation intelligente et recherche sémantique avancée.</p>
          </div>
          <div className="sa-feature-card">
            <div className="sa-feature-icon">🌍</div>
            <h3>Support Global</h3>
            <p>Équipe support 24/7 multilingue, documentation complète et communauté active.</p>
          </div>
        </div>
      </section>

      {/* SECTION 1: HISTOIRE (TIMELINE) */}
      <section className="sa-section-histoire sa-animate">
        <div className="sa-histoire-container">
          <div className="sa-histoire-title">
            <h2>Notre Parcours</h2>
            <p>Plus de 15 ans d'expertise en archivage numérique et transformation documentaire</p>
          </div>

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
              <div className="sa-stat-label">Années d&apos;expérience</div>
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
            <div className="sa-team-socials">
              <button className="sa-team-social-btn" title="LinkedIn"><i className="fab fa-linkedin"></i></button>
              <button className="sa-team-social-btn" title="Twitter"><i className="fab fa-twitter"></i></button>
              <button className="sa-team-social-btn" title="Email"><i className="fas fa-envelope"></i></button>
            </div>
          </div>

          <div className="sa-team-card">
            <div className="sa-team-avatar">KL</div>
            <div className="sa-team-name">Mme Kaci Lynda</div>
            <div className="sa-team-role">Responsable Formation</div>
            <div className="sa-team-bio">Pédagogue expérimentée certifiée, elle conçoit des formations pratiques et adaptées aux besoins des entreprises.</div>
            <div className="sa-team-socials">
              <button className="sa-team-social-btn" title="LinkedIn"><i className="fab fa-linkedin"></i></button>
              <button className="sa-team-social-btn" title="Twitter"><i className="fab fa-twitter"></i></button>
              <button className="sa-team-social-btn" title="Email"><i className="fas fa-envelope"></i></button>
            </div>
          </div>

          <div className="sa-team-card">
            <div className="sa-team-avatar">MA</div>
            <div className="sa-team-name">M. Meziane Adel</div>
            <div className="sa-team-role">Cybersécurité</div>
            <div className="sa-team-bio">Spécialiste en cybersécurité ISO 27001 et ethical hacking, garant de la protection de vos données sensibles.</div>
            <div className="sa-team-socials">
              <button className="sa-team-social-btn" title="LinkedIn"><i className="fab fa-linkedin"></i></button>
              <button className="sa-team-social-btn" title="Twitter"><i className="fab fa-twitter"></i></button>
              <button className="sa-team-social-btn" title="Email"><i className="fas fa-envelope"></i></button>
            </div>
          </div>

          <div className="sa-team-card">
            <div className="sa-team-avatar">BY</div>
            <div className="sa-team-name">M. Benmoussa Yacine</div>
            <div className="sa-team-role">Développeur Full Stack</div>
            <div className="sa-team-bio">Développeur passionné spécialisé en React et Node.js, créateur de solutions web performantes et scalables.</div>
            <div className="sa-team-socials">
              <button className="sa-team-social-btn" title="LinkedIn"><i className="fab fa-linkedin"></i></button>
              <button className="sa-team-social-btn" title="Twitter"><i className="fab fa-twitter"></i></button>
              <button className="sa-team-social-btn" title="Email"><i className="fas fa-envelope"></i></button>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING CHATBOT BUTTON */}
      <button 
        className="sa-chatbot-float-btn"
        onClick={() => setOpenChatbot(!openChatbot)}
        title="Assistant IA"
      >
        <i className="fas fa-robot"></i>
      </button>

      {/* CHATBOT MODAL GLASSMORPHIC */}
      {openChatbot && (
        <div className="sa-chatbot-modal-overlay" onClick={() => setOpenChatbot(false)}>
          <div className="sa-chatbot-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sa-chatbot-modal-header">
              <h3>Assistant IA</h3>
              <button className="sa-chatbot-close-btn" onClick={() => setOpenChatbot(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="sa-chatbot-modal-messages">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`sa-chat-message ${msg.type}`}>
                  {msg.type === 'bot' && (
                    <div className="sa-chat-avatar bot-avatar">
                      <i className="fas fa-robot"></i>
                    </div>
                  )}
                  <div className="sa-chat-content">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sa-chatbot-modal-input">
              <input
                type="text"
                placeholder="Votre question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSend()}
                className="sa-chatbot-input"
              />
              <button 
                className="sa-chatbot-send"
                onClick={handleChatSend}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
