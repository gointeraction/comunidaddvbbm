'use client';

import { Shield, Diamond, Zap } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function RulesPage() {
  const navigate = useAppStore(s => s.navigate);

  const rules = [
    {
      id: '01',
      title: 'Sé amable y cortés',
      content: 'Estamos todos juntos para crear un entorno acogedor. Las discusiones sanas son bienvenidas, pero la toxicidad, el desprecio y los ataques personales no tienen lugar aquí. Critica ideas, no personas.',
    },
    {
      id: '02',
      title: 'Aporta calidad',
      content: 'Antes de preguntar, busca si ya se respondió. Al pedir ayuda, incluye contexto: qué intentas lograr, qué probaste y qué error obtuviste. Las respuestas de bajo esfuerzo o fuera de tema diluyen el valor de la comunidad.',
    },
    {
      id: '03',
      title: 'Nada de spam ni autopromoción',
      content: 'La autopromoción solo se permite en los canales designados. Los mensajes directos no solicitados para vender servicios, los enlaces de afiliados encubiertos y el contenido repetitivo resultarán en moderación o expulsión.',
    },
    {
      id: '04',
      title: 'Privacidad y confianza',
      content: 'Lo que se comparte en espacios de miembros se queda en la comunidad. No publiques datos personales de otros (capturas con información sensible, correos, teléfonos) sin su consentimiento. Respeta el anonimato de quien lo prefiera.',
    },
    {
      id: '05',
      title: 'Atribución y propiedad',
      content: 'Comparte código y recursos de los que tengas derecho. Da crédito a los autores originales y respeta sus licencias. No publiques material pirata ni contenido premium de terceros.',
    },
    {
      id: '06',
      title: 'Contenido seguro y legal',
      content: 'Prohibido el contenido ilegal, malware, exploits con fines maliciosos, o material que ponga en riesgo a otros. La seguridad ofensiva y el hacking se discuten solo con fines educativos y éticos.',
    },
    {
      id: '07',
      title: 'Moderación y consecuencias',
      content: 'El equipo modera de forma proporcional. Según la gravedad y reincidencia, las acciones pueden incluir:\n\n- Aviso: para faltas leves o primeras infracciones.\n- Eliminación de contenido: de lo que incumpla estas reglas.\n- Silencio temporal: restricción de publicar por un periodo.\n- Expulsión: baneo permanente ante faltas graves o reincidencia.\n\nLas decisiones buscan proteger a la comunidad, no castigar. Si crees que hubo un error, puedes apelar escribiéndonos.',
    },
    {
      id: '08',
      title: 'Cómo reportar',
      content: 'Si ves contenido o comportamiento que infringe estas reglas, repórtalo al equipo en soporte@bbmintelligen.com. Trataremos tu reporte con discreción y la mayor rapidez posible. Gracias por ayudar a mantener este espacio sano.',
    }
  ];

  const sidebarLinks = [
    { id: '01', title: 'Sé amable' },
    { id: '02', title: 'Calidad' },
    { id: '03', title: 'No spam' },
    { id: '04', title: 'Privacidad' },
    { id: '05', title: 'Atribución' },
    { id: '06', title: 'Contenido seguro' },
    { id: '07', title: 'Consecuencias' },
    { id: '08', title: 'Cómo reportar' },
  ];

  const highlights = [
    {
      icon: <Shield className="size-5 text-blue-400" />,
      title: '01 · Respeto radical',
      desc: 'Cero tolerancia al acoso, racismo o discriminación. Tratamos a los novatos con la paciencia con la que nos gustaría ser tratados.'
    },
    {
      icon: <Diamond className="size-5 text-emerald-400" />,
      title: '02 · Aporta valor',
      desc: 'No hagas spam ni vendas sin permiso. Si pides ayuda, explica qué intentaste. Comparte tus descubrimientos.'
    },
    {
      icon: <Zap className="size-5 text-purple-400" />,
      title: '03 · Acción > teoría',
      desc: 'Valoramos lo que construyes, no solo lo que dices. Comparte tus proyectos aunque estén incompletos. El feedback es oro.'
    }
  ];

  const renderContent = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4 list-disc text-muted-foreground">{line.replace('- ', '')}</li>;
      }
      if (line === '') return <br key={idx} />;
      return <p key={idx} className="text-muted-foreground leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="space-y-12 animate-fade-in-up pb-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto pt-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Shield className="size-6 text-primary" />
        </div>
        <div className="font-mono text-sm text-[#10B981]">
          <span className="text-green-500">$</span> cat ./code-of-conduct.md
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Reglas de Convivencia
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Para mantener esta comunidad valiosa, segura y libre de ruido,
          todos aceptamos seguir estos principios al unirnos.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-500 mt-4">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          última actualización: julio 2026
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((h, i) => (
          <div key={i} className="glass-card rounded-xl p-6 border-border/50 bg-[#0a0f1a]/80 backdrop-blur-sm hover:border-[#10B981]/50 transition-all duration-500 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:-translate-y-1 relative group overflow-hidden text-center flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
            <div className="relative z-10 space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                {h.icon}
              </div>
              <h3 className="font-mono font-bold text-white text-sm">{h.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-2 hidden md:block">
          <div className="font-mono text-xs text-[#10B981] mb-4">{'// código detallado'}</div>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map(link => (
              <a
                key={link.id}
                href={`#rule-${link.id}`}
                className="text-sm font-mono text-muted-foreground hover:text-white px-3 py-2 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
              >
                {link.id} · {link.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-3 glass-card rounded-xl p-8 md:p-12 border-border/50 bg-[#0a0f1a]/80 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-10 z-0" />
          <div className="relative z-10 space-y-12">
            
            <div className="text-lg md:text-xl text-white leading-relaxed font-medium">
              Estas normas aplican a todos los espacios de la comunidad: foro, comentarios, recursos y mensajes. Forman parte de nuestros <span onClick={() => navigate('terminos')} className="text-[#10B981] underline cursor-pointer hover:text-[#34D399]">Términos de Servicio</span>.
            </div>

            {rules.map(r => (
              <div key={r.id} id={`rule-${r.id}`} className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {r.id}. {r.title}
                </h2>
                <div className="text-base">
                  {renderContent(r.content)}
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}
