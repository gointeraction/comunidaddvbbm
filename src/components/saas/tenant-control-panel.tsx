'use client';

import { useState } from 'react';
import { useTenantStore } from '@/stores/tenant-store';
import type { SubscriptionStatus, SaaSPlan } from '@/types/saas';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  AlertTriangle,
  Mail,
  RefreshCw,
  Power,
  TrendingUp,
  HardDrive,
  Users,
  CreditCard,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; className: string; icon: any }> = {
  active: { label: '🟢 Activo / Al día', className: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: ShieldCheck },
  past_due: { label: '🟡 Moroso / Pago Fallido', className: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: AlertTriangle },
  trialing: { label: '🔵 Prueba Gratuita', className: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: TrendingUp },
  suspended: { label: '🔴 Suspendido / Bloqueado', className: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: ShieldAlert },
  canceled: { label: '⚪ Cancelado', className: 'bg-gray-500/20 text-gray-400 border-gray-500/40', icon: Power },
};

export function TenantControlPanel() {
  const { tenants, suspendTenant, reactivateTenant, updateTenantPlan } = useTenantStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTenants = tenants.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(search.toLowerCase()) ||
      (t.customDomain && t.customDomain.toLowerCase().includes(search.toLowerCase()));

    const status = t.subscription?.status || (t.active ? 'active' : 'suspended');
    const matchesStatus = statusFilter === 'all' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#10B981] text-gray-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <span>✓ {toastMessage}</span>
        </div>
      )}

      {/* Control Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0a0f1a]/80 border-emerald-500/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-gray-400">COMUNIDADES AL DÍA</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {tenants.filter((t) => (t.subscription?.status || 'active') === 'active').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1a]/80 border-amber-500/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-gray-400">PAGOS FALLIDOS (MOROSOS)</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {tenants.filter((t) => t.subscription?.status === 'past_due').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1a]/80 border-rose-500/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-gray-400">COMUNIDADES SUSPENDIDAS</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">
              {tenants.filter((t) => !t.active || t.subscription?.status === 'suspended').length}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1a]/80 border-blue-500/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-gray-400">MIEMBROS ADMINISTRADOS</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">
              {tenants.reduce((acc, t) => acc + (t.usage?.membersCount || 0), 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0f1a]/80 p-4 border border-white/10 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="size-4 text-gray-500 absolute left-3 top-2.5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, subdominio..."
            className="pl-9 bg-white/5 border-white/10 text-xs text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'active', label: '🟢 Al día' },
            { id: 'past_due', label: '🟡 Morosos' },
            { id: 'suspended', label: '🔴 Suspendidos' },
          ].map((f) => (
            <Button
              key={f.id}
              size="sm"
              variant={statusFilter === f.id ? 'default' : 'outline'}
              onClick={() => setStatusFilter(f.id)}
              className={`text-xs px-3 py-1 font-mono ${
                statusFilter === f.id
                  ? 'bg-primary text-gray-950 font-bold'
                  : 'border-white/10 text-gray-400 hover:bg-white/5'
              }`}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tenant Command Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0a0f1a]/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[11px] text-gray-400 uppercase">
                <th className="p-4">Comunidad / Inquilino</th>
                <th className="p-4">Estado Financiero</th>
                <th className="p-4">Plan & Cobro</th>
                <th className="p-4">Uso de Miembros</th>
                <th className="p-4">Almacenamiento</th>
                <th className="p-4 text-right">Acciones de Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500 font-mono">
                    No se encontraron comunidades con los criterios seleccionados.
                  </td>
                </tr>
              ) : (
                filteredTenants.map((t) => {
                  const statusKey = t.subscription?.status || (t.active ? 'active' : 'suspended');
                  const statusInfo = STATUS_CONFIG[statusKey] || STATUS_CONFIG.active;
                  const membersPercent = t.usage ? Math.min(100, Math.round((t.usage.membersCount / t.usage.membersLimit) * 100)) : 0;
                  const storagePercent = t.usage ? Math.min(100, Math.round((t.usage.storageUsedMB / t.usage.storageLimitMB) * 100)) : 0;

                  return (
                    <tr key={t.tenantId} className="hover:bg-white/5 transition-colors">
                      {/* Name & Subdomain */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: t.theme.primaryColor }}
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{t.name}</p>
                            <p className="text-[10px] text-gray-400">{t.subdomain}.bbmdev.io</p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <Badge variant="outline" className={`${statusInfo.className} text-[10px] font-mono`}>
                          {statusInfo.label}
                        </Badge>
                      </td>

                      {/* Plan & Amount */}
                      <td className="p-4">
                        <p className="font-bold text-white uppercase">{t.plan}</p>
                        <p className="text-[10px] text-emerald-400 font-bold">${t.subscription?.monthlyAmount || 49} / mes</p>
                      </td>

                      {/* Members Usage */}
                      <td className="p-4 min-w-[140px]">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-gray-400">{t.usage?.membersCount || 0} miembros</span>
                          <span className="text-gray-500">{membersPercent}%</span>
                        </div>
                        <Progress value={membersPercent} className="h-1.5" />
                      </td>

                      {/* Storage Usage */}
                      <td className="p-4 min-w-[140px]">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-gray-400">{t.usage?.storageUsedMB || 0} MB</span>
                          <span className="text-gray-500">{storagePercent}%</span>
                        </div>
                        <Progress value={storagePercent} className="h-1.5" />
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 text-right space-x-2">
                        {t.active && statusKey !== 'suspended' ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              suspendTenant(t.tenantId);
                              triggerToast(`Comunidad "${t.name}" suspendida`);
                            }}
                            className="bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] px-2.5 py-1"
                          >
                            🔴 Suspender
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              reactivateTenant(t.tenantId);
                              triggerToast(`Comunidad "${t.name}" reactivada`);
                            }}
                            className="bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-[10px] px-2.5 py-1 font-bold"
                          >
                            🟢 Reactivar
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            triggerToast(`Recordatorio de cobro enviado a ${t.subscription?.ownerEmail || 'admin'}`);
                          }}
                          className="border-white/10 text-gray-300 hover:bg-white/5 text-[10px] px-2.5 py-1"
                        >
                          📧 Cobrar
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
