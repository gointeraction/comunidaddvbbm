'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  BookOpen,
  Radio,
  Cpu,
  Trophy,
  Users,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SaaSBillingModal } from '@/components/saas/saas-billing-modal';

export function SaaSLandingPage() {
  const navigate = useAppStore((s) => s.navigate);
  const [billingOpen, setBillingOpen] = useState(false);

  return (
    <div className="space-y-16 py-6 animate-fade-in-up font-mono">
      <SaaSBillingModal open={billingOpen} onOpenChange={setBillingOpen} />

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-8">
        <Badge variant="outline" className="px-4 py-1 border-primary/40 text-primary bg-primary/10 text-xs">
          <Sparkles className="size-3.5 mr-1.5" /> PLATAFORMA SAAS WHITE-LABEL PARA DESARROLLADORES & IA
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
          Lanza Tu Propia Comunidad de <span className="text-primary">Desarrolladores & IA</span> en Minutos
        </h1>

        <p className="text-base sm:text-lg text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed">
          La solución B2B marca blanca todo en uno: Foro, Cursos, Directos en vivo, Servidores MCP, Gamificación e Identidad de desarrollador bajo tu propio dominio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button
            size="lg"
            onClick={() => setBillingOpen(true)}
            className="bg-primary text-gray-950 hover:bg-primary/90 font-bold text-sm px-8 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            Comenzar Prueba Gratuita <ArrowRight className="size-4 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('saas-admin')}
            className="border-white/10 text-white hover:bg-white/5 font-bold text-sm px-8"
          >
            <Shield className="size-4 mr-2 text-primary" /> Ver Portal Super-Admin
          </Button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Todo lo que Necesita tu Comunidad Técnica</h2>
          <p className="text-xs text-gray-400 font-sans">Infraestructura completa lista para desplegar en tu subdominio o dominio propio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, title: 'Foro & Discusiones', desc: 'Feed dinámico con resaltado de código, etiquetas antispam y moderación de contenido.' },
            { icon: BookOpen, title: 'Cursos & Quizzes', desc: 'Lecciones paso a paso con evaluaciones interactivas y certificados con firma digital.' },
            { icon: Radio, title: 'Directos en Vivo & Chat', desc: 'Transmisiones integradas con YouTube Live y sala de chat interactiva en tiempo real.' },
            { icon: Cpu, title: 'Marketplace de MCP & Skills', desc: 'Repositorio comunitario de Servidores MCP y Skills copiables en 1 solo clic.' },
            { icon: Trophy, title: 'Gamificación & Leaderboard', desc: 'Sistema de niveles, XP acumulada y semanal, misiones e insignias por rareza.' },
            { icon: Building2, title: 'Marca Blanca Personalizable', desc: 'Logotipo, paleta de colores CSS dinámica y subdominio personalizado adaptados a tu marca.' },
          ].map((f) => (
            <Card key={f.title} className="bg-[#0a0f1a]/80 border-white/10 hover:border-primary/40 transition-all backdrop-blur-sm">
              <CardContent className="p-6 space-y-3">
                <f.icon className="size-8 text-primary mb-2" />
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* B2B Pricing Section */}
      <div className="space-y-6 border-t border-white/10 pt-12">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">Planes Simples</Badge>
          <h2 className="text-2xl font-bold text-white">Elige el Plan Perfecto para tu Organización</h2>
          <p className="text-xs text-gray-400 font-sans">Sin costos ocultos. Actualiza o cancela en cualquier momento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { name: 'Starter', price: 49, desc: 'Para comunidades emergentes y startups.', btn: 'Elegir Starter' },
            { name: 'Pro', price: 149, desc: 'Para empresas de software y academias.', popular: true, btn: 'Comenzar con Pro' },
            { name: 'Enterprise', price: 499, desc: 'Para grandes organizaciones con SSO.', btn: 'Contactar Ventas' },
          ].map((p) => (
            <Card key={p.name} className={`bg-[#0a0f1a]/90 border transition-all relative ${p.popular ? 'border-primary shadow-[0_0_25px_rgba(16,185,129,0.25)]' : 'border-white/10'}`}>
              <CardContent className="p-6 space-y-4">
                {p.popular && (
                  <Badge className="bg-primary text-gray-950 text-[10px] font-bold absolute -top-3 right-4">MÁS POPULAR</Badge>
                )}
                <h3 className="text-xl font-bold text-white">{p.name}</h3>
                <p className="text-xs text-gray-400 font-sans">{p.desc}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">${p.price}</span>
                  <span className="text-xs text-gray-400">/ mes</span>
                </div>
                <Button
                  onClick={() => setBillingOpen(true)}
                  className={`w-full text-xs font-semibold ${p.popular ? 'bg-primary text-gray-950 hover:bg-primary/90' : 'border border-white/10 text-white hover:bg-white/5'}`}
                >
                  {p.btn}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
