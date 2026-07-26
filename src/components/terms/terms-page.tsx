'use client';

import { FileText } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function TermsPage() {
  const navigate = useAppStore(s => s.navigate);

  const terms = [
    {
      id: '01',
      title: 'Aceptación de los términos',
      content: (
        <p className="text-muted-foreground leading-relaxed">
          Al registrarte o utilizar el servicio confirmas que has leído, entendido y aceptado estos términos, así como nuestra <span onClick={() => navigate('privacidad')} className="text-[#10B981] underline cursor-pointer hover:text-[#34D399]">Política de Privacidad</span> y las <span onClick={() => navigate('reglas')} className="text-[#10B981] underline cursor-pointer hover:text-[#34D399]">Reglas de Convivencia</span>, que forman parte de este acuerdo.
        </p>
      ),
    },
    {
      id: '02',
      title: 'Descripción del servicio',
      content: 'BBMDev Community es una plataforma de aprendizaje y comunidad enfocada en desarrollo, automatización e IA. Ofrecemos un foro, cursos, recursos descargables y un sistema de gamificación. Algunas funciones son gratuitas y otras requieren una membresía de pago.',
    },
    {
      id: '03',
      title: 'Tu cuenta',
      content: '- Debes proporcionar información veraz y mantenerla actualizada.\n- Eres responsable de la seguridad de tu contraseña y de toda la actividad de tu cuenta.\n- Una cuenta es personal e intransferible; no la compartas ni la vendas.\n- Debes tener la edad legal requerida en tu jurisdicción para usar el servicio.',
    },
    {
      id: '04',
      title: 'Uso aceptable',
      content: 'Te comprometes a usar la comunidad para su propósito: aprendizaje y colaboración profesional. Está prohibido:\n\n- Publicar contenido ilegal, dañino, difamatorio, de odio o que infrinja derechos de terceros.\n- Spam, autopromoción no autorizada o mensajes comerciales no solicitados.\n- Acosar, suplantar identidades o recopilar datos de otros usuarios sin consentimiento.\n- Intentar vulnerar, sobrecargar o dañar la infraestructura (scraping abusivo, exploits, DoS).\n- Subir malware o eludir los controles de acceso y las membresías.',
    },
    {
      id: '05',
      title: 'Tu contenido',
      content: 'El contenido que publicas (posts, comentarios, recursos) sigue siendo tuyo. Al publicarlo, nos otorgas una licencia mundial, no exclusiva y gratuita para alojarlo, mostrarlo y distribuirlo dentro de la plataforma con el fin de operar el servicio. Eres responsable de tener los derechos sobre lo que compartes y puedes eliminarlo cuando quieras.',
    },
    {
      id: '06',
      title: 'Propiedad intelectual',
      content: 'El contenido educativo, la marca, el diseño y el software de BBMDev son propiedad de la plataforma o de sus licenciantes, y se ofrecen para tu uso personal y no comercial. No puedes copiar, revender ni redistribuir el material premium sin autorización.',
    },
    {
      id: '07',
      title: 'Pagos y membresías',
      content: '- Los pagos se procesan de forma segura a través de Stripe.\n- Las suscripciones se renuevan automáticamente hasta que las canceles; puedes hacerlo en cualquier momento desde tu perfil.\n- Al cancelar, conservas el acceso hasta el final del periodo ya pagado; no se cobran periodos posteriores.\n- Las compras individuales de cursos otorgan acceso de por vida a ese curso, salvo terminación de cuenta por incumplimiento.\n- Los reembolsos se evalúan caso por caso conforme a la ley aplicable.',
    },
    {
      id: '08',
      title: 'Suspensión y terminación',
      content: 'Nos reservamos el derecho de suspender o cerrar cuentas que infrinjan estos términos o las reglas de la comunidad, con o sin previo aviso según la gravedad. Puedes eliminar tu cuenta cuando quieras; ciertos datos podrán conservarse según la ley.',
    },
    {
      id: '09',
      title: 'Descargo de garantías',
      content: 'El servicio se ofrece “tal cual” y “según disponibilidad”. No garantizamos que esté libre de errores o interrupciones, ni que el contenido educativo se ajuste a un fin específico. El uso de la información de la comunidad es bajo tu propio criterio y riesgo.',
    },
    {
      id: '10',
      title: 'Limitación de responsabilidad',
      content: 'En la máxima medida permitida por la ley, BBMDev Community no será responsable de daños indirectos, incidentales o derivados (pérdida de datos, beneficios o oportunidades) por el uso o la imposibilidad de uso del servicio. Nuestra responsabilidad total se limita al importe que hayas pagado en los últimos 12 meses.',
    },
    {
      id: '11',
      title: 'Cambios en los términos',
      content: 'Podemos actualizar estos términos. Si los cambios son sustanciales, te avisaremos. El uso continuado tras la entrada en vigor implica tu aceptación de la nueva versión.',
    },
    {
      id: '12',
      title: 'Ley aplicable y contacto',
      content: 'Estos términos se rigen por la legislación aplicable en la jurisdicción de operación de BBMDev. Para cualquier consulta legal, escríbenos a legal@bbmintelligen.com.',
    }
  ];

  const sidebarLinks = [
    { id: '01', title: 'Aceptación' },
    { id: '02', title: 'El servicio' },
    { id: '03', title: 'Tu cuenta' },
    { id: '04', title: 'Uso aceptable' },
    { id: '05', title: 'Tu contenido' },
    { id: '06', title: 'Propiedad intelectual' },
    { id: '07', title: 'Pagos y membresías' },
    { id: '08', title: 'Terminación' },
    { id: '09', title: 'Garantías' },
    { id: '10', title: 'Responsabilidad' },
    { id: '11', title: 'Cambios' },
    { id: '12', title: 'Ley aplicable' },
  ];

  const renderContent = (content: string | React.ReactNode) => {
    if (typeof content !== 'string') return content;
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('- ')) {
        const parts = line.replace('- ', '').split(':');
        if (parts.length > 1) {
          return (
            <li key={idx} className="ml-4 list-disc text-muted-foreground mb-2">
              <span className="font-bold text-white">{parts[0]}:</span>
              {parts.slice(1).join(':')}
            </li>
          );
        }
        return <li key={idx} className="ml-4 list-disc text-muted-foreground mb-2">{line.replace('- ', '')}</li>;
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
          <FileText className="size-6 text-primary" />
        </div>
        <div className="font-mono text-sm text-[#10B981]">
          <span className="text-green-500">$</span> cat ./terms.md
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Términos de Servicio
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Las reglas del juego para mantener la comunidad sana, justa y
          operativa. Al usar BBMDev, aceptas estos términos.
        </p>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-500 mt-4">
          <span className="w-2 h-2 rounded-full bg-gray-500" />
          última actualización: julio 2026
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start pt-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-2 hidden md:block">
          <div className="font-mono text-xs text-[#10B981] mb-4">{'// índice'}</div>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map(link => (
              <a
                key={link.id}
                href={`#section-${link.id}`}
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
            
            <div className="text-lg text-white leading-relaxed font-medium">
              Al acceder y usar BBMDev Community aceptas estos Términos de Servicio. Nuestro objetivo es simple: <span className="font-bold">aprender y construir juntos en un entorno respetuoso.</span> Si no estás de acuerdo, por favor no uses la plataforma.
            </div>

            {terms.map(p => (
              <div key={p.id} id={`section-${p.id}`} className="space-y-4 scroll-mt-24">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {p.id}. {p.title}
                </h2>
                <div className="text-base">
                  {renderContent(p.content)}
                </div>
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}
