'use client';

import { useState } from 'react';
import { useTenantStore } from '@/stores/tenant-store';
import { Check, Sparkles, Zap, Shield, CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SaaSPlanOption {
  id: 'starter' | 'pro' | 'enterprise';
  name: string;
  price: number;
  description: string;
  badge?: string;
  features: string[];
}

const PLANS: SaaSPlanOption[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    description: 'Ideal para comunidades en crecimiento y proyectos emergentes.',
    features: [
      'Hasta 500 miembros activos',
      'Foro de discusión e interacción',
      'Biblioteca de recursos y tutoriales',
      'Gamificación (XP y Niveles básico)',
      'Subdominio tucomunidad.bbmdev.io',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    description: 'La opción recomendada para empresas y academias de tecnología.',
    badge: 'MÁS POPULAR',
    features: [
      'Hasta 5,000 miembros activos',
      'Cursos con lecciones y Quizzes',
      'Directos en vivo con YouTube Live',
      'Marketplace de Servidores MCP & Skills',
      'Dominio personalizado (comunidad.tudominio.com)',
      'Soporte prioritario 24/7',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    description: 'Para grandes organizaciones con necesidades de seguridad avanzadas.',
    features: [
      'Miembros ilimitados',
      'Autenticación SSO (SAML / OAuth / Okta)',
      'Integración con GitHub & Webhooks API',
      'Certificados de finalización con firma digital',
      'SLA garantizado del 99.9%',
      'Gestor de cuenta dedicado',
    ],
  },
];

export function SaaSBillingModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { currentTenant } = useTenantStore();
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>(currentTenant.plan || 'pro');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0a0f1a] border-white/10 text-white font-mono max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg text-primary border-b border-white/10 pb-3">
            <span className="flex items-center gap-2">
              <Sparkles className="size-5" /> Planes y Facturación SaaS B2B
            </span>
            <span className="text-xs text-gray-400 font-normal">
              Inquilino: <strong className="text-white">{currentTenant.name}</strong>
            </span>
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-12 text-center space-y-3">
            <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="size-6" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Suscripción Actualizada con Éxito!</h3>
            <p className="text-xs text-gray-400">Tu plan ha sido actualizado a <span className="text-primary uppercase font-bold">{selectedPlan}</span>.</p>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* Grid de Planes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((p) => {
                const isCurrent = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative ${
                      isCurrent
                        ? 'border-primary bg-primary/10 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {p.badge && (
                      <Badge className="absolute -top-2.5 right-4 bg-primary text-gray-950 text-[9px] font-bold">
                        {p.badge}
                      </Badge>
                    )}

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-base font-bold text-white">{p.name}</h4>
                        <p className="text-[11px] text-gray-400 mt-1 leading-snug">{p.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-white">${p.price}</span>
                        <span className="text-xs text-gray-400">/ mes</span>
                      </div>

                      <div className="space-y-2 border-t border-white/10 pt-3">
                        {p.features.map((f, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                            <Check className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(p.id);
                      }}
                      className={`w-full mt-6 text-xs font-mono font-semibold ${
                        isCurrent
                          ? 'bg-primary text-gray-950 hover:bg-primary/90'
                          : 'border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {isCurrent ? 'Plan Seleccionado' : 'Elegir Plan'}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Simulación de Checkout Stripe */}
            <div className="border border-white/10 rounded-xl p-4 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary">
                  <CreditCard className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Facturación Segura vía Stripe Connect</p>
                  <p className="text-[11px] text-gray-400">Procesado con cifrado SSL bancario de 256 bits.</p>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={processing}
                className="bg-primary text-gray-950 font-semibold text-xs hover:bg-primary/90 shadow-[0_0_20px_rgba(16,185,129,0.3)] w-full sm:w-auto"
              >
                {processing ? (
                  'Procesando en Stripe...'
                ) : (
                  <>
                    <Lock className="size-3.5 mr-1.5" /> Suscribirse a Plan {selectedPlan.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
