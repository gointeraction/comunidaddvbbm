'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useTenantStore } from '@/stores/tenant-store';
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
  Lock,
  CreditCard,
  Check,
  Star,
  DollarSign,
  Briefcase,
  GraduationCap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export function SaaSLandingPage() {
  const navigate = useAppStore((s) => s.navigate);
  const { createTenant } = useTenantStore();

  // Interactive White-Label Demo state
  const [demoName, setDemoName] = useState('Mi Empresa AI');
  const [demoColor, setDemoColor] = useState('#10B981');

  // Checkout Payment Gateway State
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [communityName, setCommunityName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim() || !subdomain.trim() || !adminEmail.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Automatically provision the new community in the tenant store!
      createTenant({
        tenantId: subdomain.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: communityName.trim(),
        subdomain: subdomain.trim(),
        customDomain: null,
        logoUrl: null,
        plan: selectedPlan,
        theme: {
          primaryColor: demoColor,
          secondaryColor: demoColor,
          backgroundColor: '#090d16',
          cardColor: '#0f172a',
        },
        features: {
          courses: true,
          resources: true,
          liveSessions: true,
          gamification: true,
        },
      });

      setTimeout(() => {
        setPaymentSuccess(false);
        navigate('foro');
      }, 2500);
    }, 1800);
  };

  return (
    <div className="space-y-20 py-8 font-mono animate-fade-in-up max-w-6xl mx-auto">
      {/* 1. HERO SECTION */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <Badge variant="outline" className="px-4 py-1.5 border-primary/40 text-primary bg-primary/10 text-xs tracking-wider">
          <Sparkles className="size-3.5 mr-1.5" /> PLATAFORMA SAAS WHITE-LABEL NATIVA PARA DESARROLLADORES E IA
        </Badge>

        <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
          La Primera Plataforma de Comunidad <span className="text-primary">Marca Blanca</span> Diseñada para Tech e IA
        </h1>

        <p className="text-base sm:text-lg text-gray-300 font-sans max-w-3xl mx-auto leading-relaxed">
          Reemplaza Skool y Circle con una solución completa bajo tu propio dominio: Foro de código, Cursos con Quizzes, Directos en vivo, Servidores MCP en 1 clic, Certificados por Hash y Gamificación.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a href="#checkout-section">
            <Button
              size="lg"
              className="bg-primary text-gray-950 hover:bg-primary/90 font-bold text-sm px-8 py-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              Activar Mi Comunidad Ahora <ArrowRight className="size-4 ml-2" />
            </Button>
          </a>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('saas-admin')}
            className="border-white/10 text-white hover:bg-white/5 font-bold text-sm px-8 py-6 cursor-pointer"
          >
            <Shield className="size-4 mr-2 text-primary" /> Probar Portal Super-Admin
          </Button>
        </div>

        {/* Social Proof badges */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-gray-400 border-t border-white/10 mt-8">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Cero marca de terceros</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> Dominio Propio Personalizado</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-primary" /> 99.9% Uptime Garantizado</span>
        </div>
      </div>

      {/* 2. DEMO INTERACTIVA DE MARCA BLANCA (LIVE BRANDING PREVIEW) */}
      <Card className="bg-[#0a0f1a]/90 border-primary/30 shadow-[0_0_35px_rgba(16,185,129,0.15)] overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-primary font-bold uppercase tracking-wider">⚡ Prueba en Vivo</span>
              <h2 className="text-xl font-bold text-white">Simulador de Marca Blanca e Identidad Visual</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Color Primario:</span>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <input
                  type="color"
                  value={demoColor}
                  onChange={(e) => setDemoColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
                <span className="text-xs text-white font-mono">{demoColor}</span>
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-white/10 p-6 bg-[#030712] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: demoColor }} />
                <span className="font-bold text-white text-base">{demoName || 'Tu Marca'}</span>
                <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400">tucomunidad.com</Badge>
              </div>
              <Button size="sm" style={{ backgroundColor: demoColor, color: '#030712' }} className="font-bold text-xs">
                + Nuevo Post
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-1">
                <p className="text-gray-400">💬 Foro Activo</p>
                <p className="font-bold text-white">1,240 Publicaciones</p>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-1">
                <p className="text-gray-400">🎓 Lecciones con Quizzes</p>
                <p className="font-bold text-white">18 Cursos Disponibles</p>
              </div>
              <div className="p-3 rounded-lg border border-white/10 bg-white/5 space-y-1">
                <p className="text-gray-400">⚡ Servidores MCP</p>
                <p className="font-bold text-white">1-Click Config Copy</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. PUNTOS DE DOLOR RESUELTOS POR VERTICAL */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">Solución Multisectorial</Badge>
          <h2 className="text-3xl font-bold text-white">¿Qué Problemas Resuelve para tu Negocio?</h2>
          <p className="text-xs text-gray-400 font-sans max-w-xl mx-auto">Diseñado estratégicamente para convertir la interacción en ingresos recurrentes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vertical 1: Consultorías */}
          <Card className="bg-[#0a0f1a]/80 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 w-fit">
                <Briefcase className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">1. Consultorías & Asesorías Técnicas</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                <strong className="text-white">Punto de dolor:</strong> Vender tiempo linealmente y perder la IP de soluciones en correos dispersos.
              </p>
              <p className="text-xs text-emerald-400 font-sans leading-relaxed">
                <strong className="text-white">Multiplicador:</strong> Transforma proyectos en <strong className="text-emerald-400">Retainers Recurrentes ($99-$299/m)</strong> entregando a tus clientes un repositorio de MCPs copiables en 1 clic y asesoría en foro VIP.
              </p>
            </CardContent>
          </Card>

          {/* Vertical 2: Agencias / Revendedores */}
          <Card className="bg-[#0a0f1a]/80 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 w-fit">
                <DollarSign className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">2. Agencias & Revendedores (VARs)</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                <strong className="text-white">Punto de dolor:</strong> Bajos márgenes al revender software de terceros donde el cliente termina relacionándose con la marca ajena.
              </p>
              <p className="text-xs text-purple-300 font-sans leading-relaxed">
                <strong className="text-white">Multiplicador:</strong> Recompone el modelo revendiendo comunidades Marca Blanca por <strong className="text-purple-300">$299 - $599/m con un 60-70% de margen neto</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Vertical 3: Academias & Bootcamps */}
          <Card className="bg-[#0a0f1a]/80 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 w-fit">
                <GraduationCap className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">3. Academias & Bootcamps de IA</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                <strong className="text-white">Punto de dolor:</strong> Deserción en cursos de video grabados (&gt;85%) y certificados de papel no verificables.
              </p>
              <p className="text-xs text-amber-300 font-sans leading-relaxed">
                <strong className="text-white">Multiplicador:</strong> Lecciones con <strong className="text-amber-300">Quizzes de Verificación obligatorios</strong>, gamificación por XP y emisión de <strong className="text-amber-300">Certificados por Hash público (/verificar/[hash])</strong>.
              </p>
            </CardContent>
          </Card>

          {/* Vertical 4: Equipos de Desarrollo */}
          <Card className="bg-[#0a0f1a]/80 border-white/10">
            <CardContent className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 w-fit">
                <Cpu className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-white">4. Equipos de Software Empresarial</h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                <strong className="text-white">Punto de dolor:</strong> Onboarding de nuevos programadores lento que tarda semanas en configurar entornos e IDEs.
              </p>
              <p className="text-xs text-cyan-300 font-sans leading-relaxed">
                <strong className="text-white">Multiplicador:</strong> Reduce el tiempo de onboarding de semanas a <strong className="text-cyan-300">5 minutos</strong> compartiendo la biblioteca de servidores MCP y Skills corporativas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. MATRIZ COMPARATIVA DIRECTA (BBMDev vs Skool vs Circle) */}
      <div className="space-y-6 border-t border-white/10 pt-12">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">Comparativa Directa</Badge>
          <h2 className="text-2xl font-bold text-white">¿Por Qué BBMDev Invalida a Skool y Circle?</h2>
        </div>

        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0f1a]/90">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400 uppercase">
                  <th className="p-4">Característica Clave</th>
                  <th className="p-4 text-emerald-400 font-bold bg-emerald-500/10">🚀 BBMDev SaaS</th>
                  <th className="p-4 text-gray-400">🟣 Circle.so</th>
                  <th className="p-4 text-gray-400">🟡 Skool</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { feature: 'Dominio Propio (Custom Domain)', bbm: '🟢 Incluido', circle: '🟡 Planes Caros', skool: '🔴 No permitido' },
                  { feature: 'Marca Blanca Absoluta (Cero marca de terceros)', bbm: '🟢 100% Tu Marca', circle: '🟡 Parcial', skool: '🔴 Sin Marca Blanca' },
                  { feature: 'Copia Configs MCP & Skills en 1-Click', bbm: '🟢 Nativo (Único)', circle: '🔴 No disponible', skool: '🔴 No disponible' },
                  { feature: 'Quizzes & Validación de Lecciones', bbm: '🟢 Evaluación Activa', circle: '🟡 Básico', skool: '🔴 Solo Video Pasivo' },
                  { feature: 'Certificados Verificables por Hash (/verificar)', bbm: '🟢 Nativo', circle: '🔴 Vía Terceros', skool: '🔴 No disponible' },
                  { feature: 'Chat en Vivo en Directos', bbm: '🟢 Nativo Firestore', circle: '🟢 Nativo', skool: '🔴 Solo Comentarios' },
                  { feature: 'Precio de Entrada Mensual', bbm: '🟢 $49 USD / mes', circle: '🔴 $99 - $399 USD', skool: '🔴 $99 USD / mes' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="p-4 font-bold text-white">{row.feature}</td>
                    <td className="p-4 font-bold text-emerald-400 bg-emerald-500/5">{row.bbm}</td>
                    <td className="p-4 text-gray-300">{row.circle}</td>
                    <td className="p-4 text-gray-300">{row.skool}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. PASARELA DE PAGO INTEGRADA (STRIPE CHECKOUT DIRECTO) */}
      <div id="checkout-section" className="space-y-8 border-t border-white/10 pt-12">
        <div className="text-center space-y-2">
          <Badge className="bg-primary text-gray-950 font-bold text-xs">PASARELA DE PAGO SEGURA</Badge>
          <h2 className="text-3xl font-bold text-white">Activa tu Comunidad en 1 Minuto</h2>
          <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">Selecciona tu plan, configura tu subdominio e ingresa tus datos de facturación.</p>
        </div>

        {paymentSuccess ? (
          <Card className="bg-emerald-500/10 border-emerald-500/40 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="size-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto animate-bounce">
              <Check className="size-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">¡Comunidad Aprovisionada con Éxito!</h3>
            <p className="text-xs text-gray-300 font-sans">
              Tu comunidad <strong className="text-white">{communityName}</strong> se ha activado bajo el plan <strong className="text-primary uppercase">{selectedPlan}</strong>. Redirigiendo a tu panel...
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Plan Selector Column */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>1.</span> Selecciona tu Plan SaaS
              </h3>

              {[
                { id: 'starter', name: 'Starter', price: 49, desc: 'Hasta 500 miembros activos' },
                { id: 'pro', name: 'Pro', price: 149, desc: 'Hasta 5,000 miembros + Dominio Propio', popular: true },
                { id: 'enterprise', name: 'Enterprise', price: 499, desc: 'Miembros ilimitados + SSO + Webhooks' },
              ].map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id as any)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-1 relative ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                        : 'border-white/10 bg-[#0a0f1a]/80 hover:border-white/20'
                    }`}
                  >
                    {p.popular && (
                      <Badge className="bg-primary text-gray-950 text-[9px] font-bold absolute top-3 right-3">
                        MÁS POPULAR
                      </Badge>
                    )}
                    <div className="flex items-baseline justify-between">
                      <p className="font-bold text-white text-base">{p.name}</p>
                      <p className="text-lg font-bold text-emerald-400">${p.price} <span className="text-xs text-gray-400 font-normal">/m</span></p>
                    </div>
                    <p className="text-xs text-gray-400 font-sans">{p.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Checkout Form Column */}
            <div className="lg:col-span-2">
              <Card className="bg-[#0a0f1a]/90 border-white/10">
                <CardContent className="p-6">
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                      <span>2.</span> Datos de tu Comunidad & Facturación
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Nombre de la Comunidad *</label>
                        <Input
                          required
                          value={communityName}
                          onChange={(e) => setCommunityName(e.target.value)}
                          placeholder="ej: Acme Tech Hub"
                          className="bg-white/5 border-white/10 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-gray-400">Subdominio Deseado *</label>
                        <div className="flex items-center">
                          <Input
                            required
                            value={subdomain}
                            onChange={(e) => setSubdomain(e.target.value)}
                            placeholder="acme"
                            className="bg-white/5 border-white/10 text-xs text-white rounded-r-none"
                          />
                          <span className="bg-white/10 px-3 py-2 border border-l-0 border-white/10 text-xs text-gray-400 rounded-r-lg">
                            .bbmdev.io
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Correo Electrónico del Administrador *</label>
                      <Input
                        required
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="admin@tuempresa.com"
                        className="bg-white/5 border-white/10 text-xs text-white"
                      />
                    </div>

                    {/* Credit Card Section */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 font-bold flex items-center gap-1.5">
                          <CreditCard className="size-4 text-primary" /> Datos de Tarjeta de Crédito / Débito
                        </span>
                        <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                          <Lock className="size-3" /> SSL 256-bit Stripe
                        </span>
                      </div>

                      <Input
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 •••• •••• 8892"
                        className="bg-white/5 border-white/10 text-xs text-white font-mono"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          required
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                          placeholder="MM / AA"
                          className="bg-white/5 border-white/10 text-xs text-white font-mono"
                        />
                        <Input
                          required
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          className="bg-white/5 border-white/10 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs">
                        <span className="text-gray-400">Total a Pagar Ahora: </span>
                        <strong className="text-emerald-400 text-base font-bold">
                          ${selectedPlan === 'starter' ? 49 : selectedPlan === 'pro' ? 149 : 499} USD
                        </strong>
                      </div>

                      <Button
                        type="submit"
                        disabled={isProcessing}
                        className="bg-primary text-gray-950 font-bold text-xs px-8 py-5 hover:bg-primary/90 shadow-[0_0_25px_rgba(16,185,129,0.3)] w-full sm:w-auto cursor-pointer"
                      >
                        {isProcessing ? (
                          'Procesando en Stripe...'
                        ) : (
                          <>
                            <Lock className="size-3.5 mr-2" /> Pagar y Aprovisionar en 1 Clic
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
