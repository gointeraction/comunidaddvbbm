'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { 
  MessageSquare, GraduationCap, Package, Trophy, ArrowRight,
  Workflow, Boxes, Bot, Sparkles, Terminal, Code2, Webhook, Zap, Layers,
  Download, Eye, Users, Shield, Rocket, MessageCircle, Star, Image as ImageIcon
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import type { Counters } from '@/types/bbmdev';
import { 
  BenefitsSection, FeaturedCoursesSection, PopularResourcesSection,
  StackSection, ActivityRankingSection, CTASection 
} from './landing-sections';

// ── Interactive Terminal Component ──────────────────────
function InteractiveTerminal() {
  const [lines, setLines] = useState<Array<{ text: string; type: 'command' | 'output' }>>([]);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const charIndexRef = useRef(0);

  const commands = [
    {
      cmd: '$ bbmdev init',
      output: [
        { text: '> Inicializando BBMDev v2.0...', type: 'output' as const },
        { text: '> ✓ Comunidad de desarrolladores cargada', type: 'output' as const },
        { text: '> ✓ Foro activo: 1,247 publicaciones', type: 'output' as const },
        { text: '> ✓ Cursos disponibles: 12 módulos', type: 'output' as const },
        { text: '> ✓ Sistema de rankings activo', type: 'output' as const },
        { text: '> Listo. Bienvenido a BBMDev.', type: 'output' as const },
      ],
    },
    {
      cmd: '$ ver cursos --gratis',
      output: [
        { text: '> [1] Automatización con n8n ─── Principiante ─── 8 lecciones', type: 'output' as const },
        { text: '> [2] Claude AI para Developers ── Intermedio ── 12 lecciones', type: 'output' as const },
        { text: '> [3] Next.js 16 Full-Stack ───── Avanzado ─── 15 lecciones', type: 'output' as const },
        { text: '> ... y 9 cursos más disponibles', type: 'output' as const },
      ],
    },
  ];

  const typeCommand = useCallback((cmd: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsTyping(true);
      setCurrentText('');
      charIndexRef.current = 0;

      const interval = setInterval(() => {
        charIndexRef.current++;
        setCurrentText(cmd.slice(0, charIndexRef.current));
        if (charIndexRef.current >= cmd.length) {
          clearInterval(interval);
          setIsTyping(false);
          resolve();
        }
      }, 40);
    });
  }, []);

  const addOutputLines = useCallback((outputLines: Array<{ text: string; type: 'command' | 'output' }>, delay: number = 120): Promise<void> => {
    return new Promise((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < outputLines.length) {
          const item = outputLines[i];
          if (item) {
            setLines((prev) => [...prev, { text: item.text, type: item.type || 'output' }]);
          }
          i++;
        } else {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }, []);

  useEffect(() => {
    const runSequence = async () => {
      await typeCommand(commands[0].cmd);
      setLines((prev) => [...prev, { text: commands[0].cmd, type: 'command' }]);
      setCurrentText('');

      await addOutputLines(commands[0].output);

      await new Promise((r) => setTimeout(r, 1000));
      await typeCommand(commands[1].cmd);
      setLines((prev) => [...prev, { text: commands[1].cmd, type: 'command' }]);
      setCurrentText('');

      await addOutputLines(commands[1].output);
    };

    const timeout = setTimeout(runSequence, 800);
    return () => clearTimeout(timeout);
  }, [typeCommand, addOutputLines]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-gray-900/80 backdrop-blur shadow-2xl shadow-black/60">
      {/* Top bar — semáforo + title */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-950/60 border-b border-white/10">
        <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
        <div className="w-3 h-3 rounded-full bg-[#FBBF24]" />
        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
        <span className="ml-2 text-xs text-gray-500 terminal-text">developer@bbmdev: ~/community</span>
      </div>
      {/* Terminal body */}
      <div className="bg-gray-900/80 p-4 min-h-[220px] max-h-[300px] overflow-y-auto custom-scrollbar">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`animate-slide-in terminal-text text-sm leading-relaxed ${
              line.type === 'command' ? 'text-gray-100' : 'text-gray-400'
            }`}
          >
            {line.type === 'command' && (
              <span className="text-[#10B981]">$ </span>
            )}
            {line.text.includes('✓') ? (
              <>
                {line.text.replace('✓', '')}
                <span className="text-[#10B981]">✓</span>
              </>
            ) : (
              line.text
            )}
          </div>
        ))}
        {/* Current typing line */}
        {isTyping && (
          <div className="terminal-text text-sm text-gray-100">
            <span className="text-[#10B981]">$ </span>
            {currentText}
            <span className="animate-blink text-[#10B981]">▋</span>
          </div>
        )}
        {/* Idle cursor after done */}
        {!isTyping && lines.length > 0 && (
          <div className="terminal-text text-sm text-gray-100">
            <span className="text-[#10B981]">$ </span>
            <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} text-[#10B981] transition-opacity`}>▋</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Animated Counter ───────────────────────────────────
function AnimatedCounter({ value, label }: { value: number; label: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <div className="flex flex-col items-center gap-1 px-3 py-4">
      <span className="text-3xl sm:text-4xl font-bold font-mono text-[#10B981] tabular-nums">
        {display.toLocaleString()}
      </span>
      <span className="font-mono text-xs text-gray-500">
        [ {label} ]
      </span>
    </div>
  );
}

// ── Feature Card ───────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <div
      className="animate-fade-in-up rounded-xl border border-white/10 bg-gray-900/40 p-6 group hover:border-[#10B981]/40 hover:bg-gray-900/70 transition-all duration-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.35)]"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-4 group-hover:bg-[#10B981]/20 transition-colors">
        <Icon className="w-5 h-5 text-[#10B981] group-hover:scale-110 transition-transform" />
      </div>
      <h3 className="text-gray-100 font-semibold mb-2 terminal-text">{title}</h3>
      <p className="text-sm text-gray-500 terminal-text leading-relaxed">{description}</p>
    </div>
  );
}

// ── Landing Page ───────────────────────────────────────
export default function LandingPage() {
  const { navigate, counters } = useAppStore();

  // Nav scroll effect
  useEffect(() => {
    const nav = document.getElementById('landing-nav');
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add('bg-gray-950/85', 'backdrop-blur-md', 'border-b', 'border-white/10');
        nav.classList.remove('bg-transparent');
      } else {
        nav.classList.remove('bg-gray-950/85', 'backdrop-blur-md', 'border-b', 'border-white/10');
        nav.classList.add('bg-transparent');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const counterItems: { key: keyof Counters; label: string }[] = [
    { key: 'developersCount', label: 'developers' },
    { key: 'postsCount', label: 'posts' },
    { key: 'commentsCount', label: 'comments' },
    { key: 'coursesCount', label: 'cursos' },
    { key: 'resourcesCount', label: 'recursos' },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden flex flex-col bg-[#030712]">
      {/* Glow blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#10B981]/10 blur-[160px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

      <main className="relative flex-1">
        {/* ── Sticky Nav ── */}
        <nav className="fixed top-0 inset-x-0 z-50 bg-transparent transition-all duration-300" id="landing-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-900 border border-[#10B981]/40 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.25)]">
                <span className="terminal-text text-[#10B981] text-sm font-semibold">~</span>
              </div>
              <span className="terminal-text text-sm">
                <span className="text-[#10B981] font-semibold">~/</span>
                <span className="text-gray-100">bbmdev</span>
                <span className="animate-blink text-[#10B981]">▋</span>
              </span>
            </div>

            {/* Nav links + CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('login')}
                className="hidden sm:inline-flex terminal-text text-xs text-gray-400 hover:text-gray-100 hover:bg-white/5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer border border-white/10"
              >
                login
              </button>
              <button
                onClick={() => navigate('registro')}
                className="terminal-text text-xs text-gray-950 font-semibold bg-[#10B981] px-4 py-1.5 rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] hover:bg-[#34D399] transition-colors cursor-pointer"
              >
                $ registro
              </button>
            </div>
          </div>
        </nav>

        {/* ── Section 1: Hero with Interactive Terminal ── */}
        <section className="relative w-full grid-bg pt-28 pb-16 md:pt-36 md:pb-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold terminal-text animate-glow text-gray-100 mb-3 tracking-tight">
              BBMDev
            </h1>
            {/* Slogan */}
            <p className="terminal-text text-[#6EE7B7] text-sm md:text-base mb-2 animate-fade-in-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              Aprende a automatizar como un developer de verdad.
            </p>
            {/* Subtitle */}
            <p className="terminal-text text-gray-500 text-xs md:text-sm mb-10 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              bbmdev ~/comunidad
            </p>
            {/* Terminal */}
            <div className="animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
              <InteractiveTerminal />
            </div>
          </div>
        </section>

        {/* ── Section 2: Dynamic Counters ── */}
        <section className="w-full py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-xl border border-white/10 bg-gray-900/40 overflow-hidden">
              {/* Stats command header */}
              <div className="bg-gray-950/50 border-b border-white/10 px-4 py-2.5">
                <span className="terminal-text text-xs text-gray-500">
                  $ bbmdev stats --live
                </span>
              </div>
              <div className="flex flex-wrap justify-center divide-x divide-white/10">
                {counterItems.map((item) => (
                  <AnimatedCounter
                    key={item.key}
                    value={counters[item.key]}
                    label={item.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Features Grid ── */}
        <section className="w-full py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-100 terminal-text mb-8 text-center">
              <span className="text-gray-500">{'// '}</span>
              ¿Qué encontrarás aquí?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureCard
                icon={MessageSquare}
                title="Foro"
                description="$ foro list — Pregunta, comparte y colabora con +600 developers activos."
                delay={0}
              />
              <FeatureCard
                icon={GraduationCap}
                title="Cursos"
                description="$ cursos --all — Aprende automatización, IA y webapps desde cero."
                delay={60}
              />
              <FeatureCard
                icon={Package}
                title="Recursos"
                description="$ recursos download — Skills, plugins y herramientas listas para usar."
                delay={120}
              />
              <FeatureCard
                icon={Trophy}
                title="Ranking"
                description="$ ranking top — Compite, gana XP y escala posiciones cada semana."
                delay={180}
              />
            </div>
          </div>
        </section>

        <BenefitsSection />
        <FeaturedCoursesSection />
        <PopularResourcesSection />
        <StackSection />
        <ActivityRankingSection />
        <CTASection />
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 px-4 border-t border-white/10">
        <p className="text-center text-xs terminal-text text-gray-500">
          {'// BBMDev v2.0 — built for developers, by developers'}
        </p>
      </footer>
    </div>
  );
}