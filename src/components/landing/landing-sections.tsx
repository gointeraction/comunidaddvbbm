'use client';

import {
  GraduationCap, Package, Users, ArrowRight, Trophy,
  Workflow, Boxes, Bot, Sparkles, Terminal, Code2, Webhook, Zap, Layers, MessageSquare, Star, Eye, Download, MessageCircle
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// ── 1. Beneficios (Por qué) ──
export function BenefitsSection() {
  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="terminal-text text-xs text-[#10B981]">$ cat ~/bbmdev/por-que.md</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="rounded-xl border border-white/10 bg-[#0a0f1a] p-6 hover:border-[#10B981]/30 transition-colors flex flex-col h-full">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5 text-[#10B981]" />
            </div>
            <h3 className="text-gray-100 font-semibold mb-2">Cursos prácticos</h3>
            <p className="text-sm text-gray-500 flex-1 leading-relaxed">
              Rutas paso a paso de automatización e IA. Proyectos reales que terminas y despliegas, no teoría infinita.
            </p>
            <div className="mt-6">
              <span className="terminal-text text-xs text-[#10B981] font-bold">[ 12 cursos disponibles ]</span>
            </div>
          </div>
          {/* Card 2 */}
          <div className="rounded-xl border border-white/10 bg-[#0a0f1a] p-6 hover:border-[#10B981]/30 transition-colors flex flex-col h-full">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-[#10B981]" />
            </div>
            <h3 className="text-gray-100 font-semibold mb-2">Recursos listos</h3>
            <p className="text-sm text-gray-500 flex-1 leading-relaxed">
              Plantillas de n8n/Make, prompts, snippets y archivos descargables que copias, pegas y funcionan.
            </p>
            <div className="mt-6">
              <span className="terminal-text text-xs text-[#10B981] font-bold">[ 16 recursos ]</span>
            </div>
          </div>
          {/* Card 3 */}
          <div className="rounded-xl border border-white/10 bg-[#0a0f1a] p-6 hover:border-[#10B981]/30 transition-colors flex flex-col h-full">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-[#10B981]" />
            </div>
            <h3 className="text-gray-100 font-semibold mb-2">Comunidad activa</h3>
            <p className="text-sm text-gray-500 flex-1 leading-relaxed">
              Foro, gamificación con XP y devs que responden. Aprende acompañado y sube de nivel resolviendo dudas reales.
            </p>
            <div className="mt-6">
              <span className="terminal-text text-xs text-[#10B981] font-bold">[ 239 posts activos ]</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 2. Cursos Destacados ──
export function FeaturedCoursesSection() {
  const { navigate } = useAppStore();
  return (
    <section className="w-full py-12 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="mb-2">
              <span className="terminal-text text-xs text-[#10B981]">$ ls ~/bbmdev/cursos --featured</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-100">Cursos destacados</h2>
          </div>
          <button onClick={() => navigate('cursos')} className="terminal-text text-xs text-[#10B981] hover:underline flex items-center gap-1">
            ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="w-full rounded-xl border border-dashed border-white/20 bg-transparent p-12 flex flex-col items-center justify-center text-center">
          <Sparkles className="w-6 h-6 text-[#10B981]/50 mb-3 animate-pulse" />
          <p className="terminal-text text-sm text-gray-500">
            {'// pronto se publicarán nuevos cursos. '}
            <button onClick={() => navigate('registro')} className="text-[#10B981] hover:underline cursor-pointer">
              crea tu cuenta
            </button>
            {' para enterarte.'}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── 3. Recursos Populares ──
export function PopularResourcesSection() {
  const { resources, navigate } = useAppStore();
  // Tomar top 3 recursos por favoritos
  const topResources = [...resources].sort((a, b) => b.favoritesCount - a.favoritesCount).slice(0, 3);

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <div className="mb-2">
              <span className="terminal-text text-xs text-[#10B981]">$ ls ~/bbmdev/recursos --popular</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-100">Recursos populares</h2>
          </div>
          <button onClick={() => navigate('recursos')} className="terminal-text text-xs text-[#10B981] hover:underline flex items-center gap-1">
            ver todos <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        
        {topResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topResources.map(res => (
              <div key={res.resourceId} className="rounded-xl border border-white/10 bg-[#0a0f1a] overflow-hidden group cursor-pointer hover:border-[#10B981]/40 transition-all" onClick={() => navigate('recursos', { id: res.resourceId })}>
                {/* Thumbnail */}
                <div className="w-full aspect-video bg-gray-900 relative overflow-hidden border-b border-white/10">
                  {res.coverUrl ? (
                    <img src={res.coverUrl} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <Package className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-200 uppercase tracking-wider">
                    {res.type}
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-100 mb-1 line-clamp-1">{res.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">{res.description}</p>
                  {/* Footer */}
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {res.downloadsCount || 0}</span>
                    <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {res.favoritesCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full rounded-xl border border-dashed border-white/20 bg-transparent p-12 flex flex-col items-center justify-center text-center">
            <Package className="w-6 h-6 text-[#10B981]/50 mb-3 animate-pulse" />
            <p className="terminal-text text-sm text-gray-500">
              {'// no hay recursos disponibles todavía.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// ── 4. Stack Tecnológico ──
export function StackSection() {
  const stackItems = [
    { name: 'n8n', icon: Workflow },
    { name: 'Make', icon: Boxes },
    { name: 'ChatGPT / Claude', icon: Bot },
    { name: 'IA & LLMs', icon: Sparkles },
    { name: 'Python', icon: Terminal },
    { name: 'JavaScript', icon: Code2 },
    { name: 'APIs & Webhooks', icon: Webhook },
    { name: 'Automatización', icon: Zap },
    { name: 'Hermes Agentes', icon: MessageSquare },
    { name: 'Ruflo', icon: Layers },
  ];

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <span className="terminal-text text-xs text-[#10B981]">$ bbmdev stack --list # lo que vas a dominar</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0a0f1a] overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-[#0f172a]/50">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <span className="ml-2 text-[10px] text-gray-500 terminal-text">package.json</span>
          </div>
          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-px bg-white/5">
            {stackItems.map((item, i) => (
              <div key={i} className="bg-[#0a0f1a] p-6 flex flex-col items-center justify-center text-center hover:bg-gray-900/80 transition-colors group">
                <item.icon className="w-6 h-6 text-[#10B981] mb-3 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-200 transition-colors">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 5. Actividad y Ranking ──
export function ActivityRankingSection() {
  const { posts, users, navigate } = useAppStore();
  const recentPosts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3);
  const topUsers = [...users].sort((a, b) => b.xp - a.xp).slice(0, 5);

  return (
    <section className="w-full py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <span className="terminal-text text-xs text-[#10B981]">$ tail -f ~/bbmdev/comunidad.log</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Actividad Reciente */}
          <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#0a0f1a] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 bg-[#0f172a]/50 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#10B981]" />
              <span className="terminal-text text-xs text-gray-400">actividad reciente del foro</span>
            </div>
            <div className="flex flex-col divide-y divide-white/5 p-4">
              {recentPosts.length > 0 ? recentPosts.map(post => (
                <div key={post.postId} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded bg-[#10B981]/20 text-[#10B981] flex items-center justify-center text-[10px] font-bold uppercase">
                      {post.authorName.charAt(0)}
                    </div>
                    <span className="text-xs text-[#10B981] font-bold">@{post.authorName.replace(/\s+/g, '').toLowerCase()}</span>
                    <span className="text-xs text-gray-600">· hace {formatDistanceToNow(new Date(post.createdAt), { locale: es })}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-100 mb-1 flex items-center gap-2">
                    🔥 {post.title}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <MessageCircle className="w-3 h-3" /> {post.commentsCount || 0} respuestas
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center text-sm text-gray-500 terminal-text">No hay actividad reciente.</div>
              )}
            </div>
          </div>

          {/* Top Contribuidores */}
          <div className="rounded-xl border border-white/10 bg-[#0a0f1a] overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-white/10 bg-[#0f172a]/50 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FBBF24]" />
              <span className="terminal-text text-xs text-gray-400">top contribuidores</span>
            </div>
            <div className="flex flex-col p-4 flex-1">
              <div className="space-y-4 flex-1">
                {topUsers.length > 0 ? topUsers.map((user, idx) => (
                  <div key={user.uid} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-4 text-center ${idx === 0 ? 'text-[#FBBF24]' : 'text-gray-500'}`}>{idx + 1}</span>
                      <img src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`} alt={user.displayName} className="w-6 h-6 rounded bg-gray-800" />
                      <span className="text-xs font-bold text-gray-200 truncate max-w-[100px]">{user.displayName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 border border-[#10B981]/20 rounded">
                      {user.xp} XP
                    </span>
                  </div>
                )) : (
                  <div className="text-center text-sm text-gray-500 terminal-text py-4">No hay usuarios aún.</div>
                )}
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <button onClick={() => navigate('ranking')} className="terminal-text text-xs text-[#10B981] hover:underline">
                  {'> unirse al ranking'}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── 6. CTA Section ──
export function CTASection() {
  const { navigate } = useAppStore();
  
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-2xl border border-[#10B981]/20 bg-gradient-to-b from-[#0f172a] to-[#0a0f1a] p-10 text-center relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#10B981]/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <span className="terminal-text text-[10px] text-[#10B981] mb-6 block">
              # el siguiente comando es tuyo
            </span>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-100 mb-4 tracking-tight">
              ¿Listo para <span className="text-[#10B981]">ejecutar</span>?
            </h2>
            
            <p className="text-gray-400 text-sm md:text-base mb-8 max-w-lg mx-auto">
              Únete a 675+ developers que ya automatizan su trabajo y aprenden IA en español. Empieza gratis hoy mismo.
            </p>
            
            <div className="inline-flex items-center gap-2 bg-[#030712] border border-white/10 rounded-lg px-4 py-2 mb-8 mx-auto w-fit">
              <span className="text-[#10B981] text-sm font-mono">$</span>
              <span className="text-gray-300 text-sm font-mono">bbmdev init --user= <span className="text-[#FBBF24]">tú</span></span>
              <span className="animate-blink text-[#10B981] text-sm ml-1">▋</span>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('registro')}
                className="terminal-text text-xs text-gray-950 font-semibold bg-[#10B981] px-6 py-3 rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.3)] hover:bg-[#34D399] transition-colors cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                crear cuenta gratis <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => navigate('login')}
                className="terminal-text text-xs text-gray-300 hover:text-white px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
              >
                ya tengo cuenta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
