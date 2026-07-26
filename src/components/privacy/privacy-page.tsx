'use client';

import { Shield } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function PrivacyPage() {
  const policies = [
    {
      id: '01',
      title: 'Responsable del tratamiento',
      content: 'BBMDev Community (“nosotros”, “la plataforma”) es responsable del tratamiento de los datos personales que nos facilitas al registrarte y usar el servicio. Para cualquier consulta sobre privacidad puedes escribirnos a privacy@bbmintelligen.com.',
    },
    {
      id: '02',
      title: 'Qué datos recopilamos',
      content: 'Solo pedimos lo estrictamente necesario para que la comunidad funcione:\n\n- Identidad básica: nombre de usuario, correo electrónico y contraseña (almacenada cifrada con hashing, nunca en texto plano).\n- Perfil público: foto, biografía, nivel/XP y enlaces que decidas añadir.\n- Actividad: publicaciones, comentarios, reacciones, progreso en cursos y recursos guardados.\n- Datos de pago: si te suscribes, el pago lo procesa Stripe; nosotros no almacenamos los datos de tu tarjeta.\n- Datos técnicos: dirección IP, tipo de navegador y registros de acceso, usados para seguridad y prevención de abuso.',
    },
    {
      id: '03',
      title: 'Para qué usamos tus datos',
      content: 'Usamos tus datos exclusivamente para fines legítimos:\n\n- Mantener tu sesión y autenticarte de forma segura.\n- Mostrarte contenido relevante y notificarte respuestas a tu actividad.\n- Gestionar tu membresía y procesar pagos.\n- Mejorar la plataforma mediante estadísticas agregadas y anónimas.\n- Cumplir obligaciones legales y proteger la seguridad de la comunidad.\n\nNunca vendemos, alquilamos ni cedemos tus datos personales a anunciantes o terceros con fines comerciales.',
    },
    {
      id: '04',
      title: 'Cookies y rastreo',
      content: 'Utilizamos cookies esenciales para mantener tu sesión iniciada y proteger los formularios (CSRF). No usamos cookies publicitarias invasivas ni rastreadores de terceros que te sigan por internet. Para entender el uso del sitio empleamos analítica respetuosa con la privacidad y anonimizada.',
    },
    {
      id: '05',
      title: 'Con quién compartimos datos',
      content: 'Solo compartimos datos con proveedores que nos ayudan a operar, actuando como encargados del tratamiento y bajo contrato:\n\n- Stripe — procesamiento de pagos.\n- Proveedor de email — envío de correos transaccionales (verificación, restablecimiento).\n- Hosting y almacenamiento — infraestructura y archivos (p. ej. almacenamiento de objetos para imágenes/adjuntos).\n\nTambién podríamos divulgar datos si la ley lo exige o para proteger derechos, seguridad y la integridad de la plataforma.',
    },
    {
      id: '06',
      title: 'Retención de datos',
      content: 'Conservamos tus datos mientras tu cuenta esté activa. Si la eliminas, borramos o anonimizamos tu información personal en un plazo razonable, salvo lo que debamos conservar por obligaciones legales o contables.',
    },
    {
      id: '07',
      title: 'Seguridad',
      content: 'Aplicamos medidas técnicas y organizativas razonables: cifrado en tránsito (HTTPS), contraseñas con hashing, control de acceso y límites de subida. Ningún sistema es 100% infalible, pero trabajamos para minimizar riesgos y responder con rapidez ante incidentes.',
    },
    {
      id: '08',
      title: 'Tus derechos',
      content: 'Tienes control total sobre tus datos. Puedes ejercer en cualquier momento tu derecho de:\n\n- Acceso: ver la información asociada a tu cuenta desde tu perfil.\n- Rectificación: editar tus datos cuando quieras.\n- Supresión (“derecho al olvido”): solicitar la eliminación completa de tu cuenta y datos.\n- Portabilidad: solicitar una copia de tus datos en un formato legible.\n- Oposición y limitación: oponerte a ciertos tratamientos.\n\nPara ejercerlos, escríbenos a privacy@bbmintelligen.com.',
    },
    {
      id: '09',
      title: 'Menores de edad',
      content: 'La plataforma está dirigida a personas mayores de edad (o que cuenten con el consentimiento de su tutor según su jurisdicción). No recopilamos conscientemente datos de menores; si detectamos lo contrario, eliminaremos la cuenta.',
    },
    {
      id: '10',
      title: 'Cambios a esta política',
      content: 'Podemos actualizar esta política para reflejar cambios legales o del servicio. Si los cambios son sustanciales, te avisaremos por la plataforma o por email. La fecha de “última actualización” indica la versión vigente.',
    },
    {
      id: '11',
      title: 'Contacto',
      content: '¿Dudas sobre privacidad o tus datos? Escríbenos a privacy@bbmintelligen.com y te responderemos lo antes posible.',
    }
  ];

  const sidebarLinks = [
    { id: '01', title: 'Responsable' },
    { id: '02', title: 'Qué recopilamos' },
    { id: '03', title: 'Para qué' },
    { id: '04', title: 'Cookies' },
    { id: '05', title: 'Terceros' },
    { id: '06', title: 'Retención' },
    { id: '07', title: 'Seguridad' },
    { id: '08', title: 'Tus derechos' },
    { id: '09', title: 'Menores' },
    { id: '10', title: 'Cambios' },
    { id: '11', title: 'Contacto' },
  ];

  const renderContent = (content: string) => {
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
          <Shield className="size-6 text-primary" />
        </div>
        <div className="font-mono text-sm text-[#10B981]">
          <span className="text-green-500">$</span> cat ./privacy.md
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Política de Privacidad
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Tus datos son tuyos. No los vendemos. Esta política explica con
          transparencia qué hacemos (y qué no) con tu información.
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
              En BBMDev Community creemos que la privacidad es un derecho, no una opción. 
              Operamos con un principio simple: <span className="font-bold">recopilamos lo mínimo, lo usamos solo para lo que prometemos, y nunca lo vendemos.</span>
            </div>

            {policies.map(p => (
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
