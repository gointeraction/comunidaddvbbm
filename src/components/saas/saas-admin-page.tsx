'use client';

import { useState } from 'react';
import { useTenantStore } from '@/stores/tenant-store';
import { useAppStore } from '@/stores/app-store';
import {
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function SaaSAdminPage() {
  const { currentTenant, tenants, metrics, switchTenant, createTenant } = useTenantStore();
  const navigate = useAppStore((s) => s.navigate);

  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [plan, setPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');

  const handleCreate = () => {
    if (!name.trim() || !subdomain.trim()) return;
    createTenant({
      tenantId: subdomain.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name.trim(),
      subdomain: subdomain.trim(),
      customDomain: customDomain.trim() || null,
      logoUrl: null,
      plan,
      theme: {
        primaryColor,
        secondaryColor: primaryColor,
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
    setName('');
    setSubdomain('');
    setCustomDomain('');
    setOpenModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-1">
            <Shield className="size-4" />
            <span>SAAS SUPER-ADMIN PORTAL</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gestión Multi-Inquilino & Marcas Blancas
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Comunidad Activa: <span className="text-white font-semibold">{currentTenant.name}</span> ({currentTenant.subdomain})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('foro')}
            variant="outline"
            className="border-white/10 text-gray-300 font-mono text-xs hover:bg-white/5"
          >
            ← Ir a la App
          </Button>

          <Dialog open={openModal} onOpenChange={setOpenModal}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-gray-950 hover:bg-primary/90 font-mono font-semibold text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Plus className="size-4 mr-1.5" /> Nueva Comunidad
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f172a] border-white/10 text-white font-mono max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base text-primary">
                  <Sparkles className="size-5" /> Aprovisionar Nueva Comunidad SaaS
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Nombre de la Comunidad *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ej: Acme AI Hub"
                    className="bg-white/5 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Subdominio *</label>
                  <div className="flex items-center">
                    <Input
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

                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Dominio Personalizado (opcional)</label>
                  <Input
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="ej: comunidad.acmelab.ai"
                    className="bg-white/5 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Plan SaaS</label>
                    <select
                      value={plan}
                      onChange={(e: any) => setPlan(e.target.value)}
                      className="w-full bg-[#0a0f1a] border border-white/10 rounded-lg p-2 text-xs text-white font-mono"
                    >
                      <option value="starter">Starter ($49/m)</option>
                      <option value="pro">Pro ($149/m)</option>
                      <option value="enterprise">Enterprise ($499/m)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Color Primario</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                      />
                      <span className="text-xs text-gray-300 font-mono">{primaryColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={() => setOpenModal(false)}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!name.trim() || !subdomain.trim()}
                  className="bg-primary text-gray-950 font-semibold text-xs hover:bg-primary/90"
                >
                  Aprovisionar Comunidad
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial & Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'MRR (Ingreso Mensual)', value: `$${metrics.mrr.toLocaleString()}`, change: '+14% / mes', icon: DollarSign, color: 'text-emerald-400' },
          { label: 'ARR (Ingreso Anual)', value: `$${metrics.arr.toLocaleString()}`, change: 'Proyectado', icon: ArrowUpRight, color: 'text-cyan-400' },
          { label: 'Comunidades Clientes', value: metrics.totalCommunities, change: `${metrics.activeCommunities} activas`, icon: Building2, color: 'text-purple-400' },
          { label: 'Miembros Globales', value: metrics.totalMembers.toLocaleString(), change: 'Chun 1.2%', icon: Users, color: 'text-amber-400' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-[#0a0f1a]/80 border-white/10 backdrop-blur-sm">
            <CardContent className="p-5 font-mono">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`size-5 ${stat.color}`} />
                <span className="text-[10px] text-gray-500">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hosted Communities List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
            <Layers className="size-5 text-primary" /> Comunidades Alojadas (White-Label)
          </h2>
          <span className="text-xs text-gray-400 font-mono">Haz clic en una comunidad para cambiar la marca activa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tenants.map((t) => {
            const isSelected = currentTenant.tenantId === t.tenantId;
            return (
              <div
                key={t.tenantId}
                onClick={() => switchTenant(t.tenantId)}
                className={`glass-card rounded-xl p-5 border transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : 'border-white/10 bg-[#0a0f1a]/80 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: t.theme.primaryColor }}
                    />
                    <span className="text-sm font-bold text-white truncate">{t.name}</span>
                  </div>
                  {isSelected && (
                    <Badge className="bg-primary text-gray-950 text-[10px] px-2 py-0">
                      Activo
                    </Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                  <p className="truncate">Subdominio: <span className="text-gray-200">{t.subdomain}.bbmdev.io</span></p>
                  {t.customDomain && (
                    <p className="truncate">Dominio: <span className="text-primary">{t.customDomain}</span></p>
                  )}
                  <p>Plan: <span className="uppercase text-amber-400 font-semibold">{t.plan}</span></p>
                </div>

                <Button
                  size="sm"
                  variant={isSelected ? 'default' : 'outline'}
                  className={`w-full text-xs font-mono ${
                    isSelected
                      ? 'bg-primary text-gray-950 font-semibold hover:bg-primary/90'
                      : 'border-white/10 text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {isSelected ? '✓ Marca Activa Aplicada' : 'Simular Marca de Comunidad'}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
