'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Search,
  Filter,
  Globe,
  Share2,
  Calendar,
  Activity,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { TenantAnalyticsData, TenantContact, MemberStatus } from '@/types/tenant-analytics';

// Mock Analytics Data for Demonstration
const MOCK_ANALYTICS: TenantAnalyticsData = {
  mrr: 3450,
  totalMembers: 480,
  trialMembers: 120,
  paidMembers: 360,
  trialToPaidConversionRate: 31.4,
  retentionRateDAUMAU: 44.8,
  engagementRate: 72.3,
  dailyVisitorsAvg: 620,

  trafficSources: [
    { source: 'Búsqueda Orgánica (Google/SEO)', visitors: 1420, signups: 180, percentage: 37.5 },
    { source: 'LinkedIn Post & Bio', visitors: 980, signups: 135, percentage: 28.1 },
    { source: 'Twitter / X Tech Community', visitors: 650, signups: 82, percentage: 17.0 },
    { source: 'YouTube Live Webinars', visitors: 420, signups: 53, percentage: 11.0 },
    { source: 'Directo / Referidos (Word of Mouth)', visitors: 240, signups: 30, percentage: 6.4 },
  ],

  countryBreakdown: [
    { country: 'España', code: 'ES', flag: '🇪🇸', count: 165, percentage: 34.3 },
    { country: 'Colombia', code: 'CO', flag: '🇨🇴', count: 112, percentage: 23.3 },
    { country: 'México', code: 'MX', flag: '🇲🇽', count: 95, percentage: 19.7 },
    { country: 'Estados Unidos', code: 'US', flag: '🇺🇸', count: 48, percentage: 10.0 },
    { country: 'Argentina', code: 'AR', flag: '🇦🇷', count: 35, percentage: 7.3 },
    { country: 'Chile', code: 'CL', flag: '🇨🇱', count: 25, percentage: 5.4 },
  ],

  dailyActivity: [
    { date: 'Lun 21 Jul', visitors: 580, trialActive: 85, paidActive: 290, conversions: 12, conversionRatePercent: 14.1 },
    { date: 'Mar 22 Jul', visitors: 610, trialActive: 92, paidActive: 310, conversions: 15, conversionRatePercent: 16.3 },
    { date: 'Mié 23 Jul', visitors: 690, trialActive: 105, paidActive: 330, conversions: 18, conversionRatePercent: 17.1 },
    { date: 'Jue 24 Jul', visitors: 720, trialActive: 115, paidActive: 345, conversions: 22, conversionRatePercent: 19.1 },
    { date: 'Vie 25 Jul', visitors: 650, trialActive: 100, paidActive: 355, conversions: 16, conversionRatePercent: 16.0 },
  ],

  contacts: [
    { id: 'usr-1', name: 'Carlos Mendoza', email: 'carlos.mendoza@devstudio.io', status: 'paid', country: 'España', countryCode: '🇪🇸', source: 'LinkedIn', joinDate: '2026-07-10', lastActive: 'Hace 5 min', monthlySpend: 49 },
    { id: 'usr-2', name: 'Ana Sofía Rodríguez', email: 'ana.rodriguez@aixlabs.com', status: 'paid', country: 'Colombia', countryCode: '🇨🇴', source: 'Google SEO', joinDate: '2026-07-12', lastActive: 'Hace 1 hora', monthlySpend: 149 },
    { id: 'usr-3', name: 'Mateo Fernández', email: 'mateo.f@gmail.com', status: 'trial', country: 'México', countryCode: '🇲🇽', source: 'YouTube Live', joinDate: '2026-07-22', lastActive: 'Hace 20 min', monthlySpend: 0 },
    { id: 'usr-4', name: 'Laura Gómez', email: 'laura.gomez@techconsult.es', status: 'paid', country: 'España', countryCode: '🇪🇸', source: 'Directo', joinDate: '2026-07-05', lastActive: 'Hace 2 horas', monthlySpend: 49 },
    { id: 'usr-5', name: 'Diego Torres', email: 'diego.torres@automation.co', status: 'trial', country: 'Colombia', countryCode: '🇨🇴', source: 'Twitter / X', joinDate: '2026-07-24', lastActive: 'Ayer', monthlySpend: 0 },
    { id: 'usr-6', name: 'Valentina Rossi', email: 'v.rossi@devlatam.org', status: 'paid', country: 'Argentina', countryCode: '🇦🇷', source: 'LinkedIn', joinDate: '2026-06-18', lastActive: 'Hace 10 min', monthlySpend: 49 },
    { id: 'usr-7', name: 'Gabriel Silva', email: 'gabriel.silva@cloudsolutions.us', status: 'paid', country: 'Estados Unidos', countryCode: '🇺🇸', source: 'Google SEO', joinDate: '2026-07-01', lastActive: 'Hace 30 min', monthlySpend: 149 },
    { id: 'usr-8', name: 'Camila Morales', email: 'camila.morales@outlook.com', status: 'trial', country: 'Chile', countryCode: '🇨🇱', source: 'YouTube Live', joinDate: '2026-07-23', lastActive: 'Hace 4 horas', monthlySpend: 0 },
  ],
};

export function TenantAnalyticsDashboard() {
  const [data] = useState<TenantAnalyticsData>(MOCK_ANALYTICS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'trial' | 'paid'>('all');

  // Filter contacts list
  const filteredContacts = useMemo(() => {
    return data.contacts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.country.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data.contacts, searchTerm, statusFilter]);

  // Export Contacts to CSV Functionality
  const exportToCSV = () => {
    const headers = ['ID,Nombre,Email,Estado,Pais,Fuente,Fecha_Ingreso,Ultima_Actividad,Monto_Mensual_USD\n'];
    const rows = filteredContacts.map(
      (c) => `"${c.id}","${c.name}","${c.email}","${c.status === 'paid' ? 'De Pago' : 'Prueba Gratis'}","${c.country}","${c.source}","${c.joinDate}","${c.lastActive}",${c.monthlySpend}\n`
    );

    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contactos_comunidad_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <Badge variant="outline" className="text-[10px] border-primary/40 text-primary bg-primary/10">
            📊 PANEL DE ANALÍTICA DEL INQUILINO
          </Badge>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Métricas de Crecimiento & Directorio de Contactos
          </h2>
          <p className="text-xs text-gray-400 font-sans">
            Inspecciona las fuentes de adquisición, tasa de conversión, miembros por país y exporta tus contactos a CSV.
          </p>
        </div>

        <Button
          onClick={exportToCSV}
          size="sm"
          className="bg-primary text-gray-950 font-bold text-xs hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer w-full sm:w-auto"
        >
          <Download className="size-4 mr-2" /> Exportar Contactos a CSV
        </Button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0a0f1a]/90 border-white/10">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>MRR de la Comunidad</span>
              <DollarSign className="size-4 text-emerald-400" />
            </div>
            <p className="text-3xl font-bold text-white tracking-tight">${data.mrr.toLocaleString()} USD</p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-sans">
              <ArrowUpRight className="size-3" /> +14.2% respecto al mes anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1a]/90 border-white/10">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Conversión Trial ➔ Pago</span>
              <TrendingUp className="size-4 text-primary" />
            </div>
            <p className="text-3xl font-bold text-emerald-400 tracking-tight">{data.trialToPaidConversionRate}%</p>
            <p className="text-[10px] text-gray-400 font-sans">
              {data.trialMembers} en prueba / {data.paidMembers} miembros de pago
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1a]/90 border-white/10">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Retención DAU / MAU</span>
              <UserCheck className="size-4 text-purple-400" />
            </div>
            <p className="text-3xl font-bold text-purple-300 tracking-tight">{data.retentionRateDAUMAU}%</p>
            <p className="text-[10px] text-purple-400/80 font-sans">
              Retención activa diaria muy superior a la media
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a0f1a]/90 border-white/10">
          <CardContent className="p-5 space-y-2">
            <div className="flex items-center justify-between text-gray-400 text-xs">
              <span>Engagement General</span>
              <Activity className="size-4 text-amber-400" />
            </div>
            <p className="text-3xl font-bold text-amber-300 tracking-tight">{data.engagementRate}%</p>
            <p className="text-[10px] text-amber-400/80 font-sans">
              Miembros participando en foros y quizzes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources & Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources (De dónde llegan) */}
        <Card className="bg-[#0a0f1a]/90 border-white/10">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="size-4 text-primary" /> De Dónde Llegan tus Miembros (Fuentes)
              </h3>
              <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400">Últimos 30 días</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {data.trafficSources.map((src) => (
                <div key={src.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="font-bold">{src.source}</span>
                    <span className="text-gray-400 font-sans">{src.signups} registros ({src.percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${src.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Country Breakdown (Por País) */}
        <Card className="bg-[#0a0f1a]/90 border-white/10">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="size-4 text-primary" /> Distribución Geográfica (Por País)
              </h3>
              <Badge variant="outline" className="text-[10px] border-white/10 text-gray-400">Comunidad Global</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {data.countryBreakdown.map((c) => (
                <div key={c.country} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{c.flag}</span>
                    <span className="font-bold text-white">{c.country}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-sans">{c.count} miembros</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                      {c.percentage}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Activity (Trial vs Paid & Conversiones por día) */}
      <Card className="bg-[#0a0f1a]/90 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="size-4 text-primary" /> Actividad Diaria: Visitantes vs. Conversiones %
            </h3>
            <span className="text-xs text-gray-400 font-sans">Monitoreo de tráfico y altas de pago por día</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400">
                  <th className="p-3">Día / Fecha</th>
                  <th className="p-3">Visitantes Únicos</th>
                  <th className="p-3">Activos en Prueba</th>
                  <th className="p-3">Activos de Pago</th>
                  <th className="p-3">Conversiones a Pago</th>
                  <th className="p-3 text-right">Tasa de Conversión %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.dailyActivity.map((day) => (
                  <tr key={day.date} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-white">{day.date}</td>
                    <td className="p-3 text-gray-300 font-sans">{day.visitors}</td>
                    <td className="p-3 text-blue-400">{day.trialActive}</td>
                    <td className="p-3 text-emerald-400">{day.paidActive}</td>
                    <td className="p-3 font-bold text-white">+{day.conversions}</td>
                    <td className="p-3 text-right font-bold text-primary">{day.conversionRatePercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List & CSV Exporter Section */}
      <Card className="bg-[#0a0f1a]/90 border-white/10">
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="size-4 text-primary" /> Lista de Contactos de la Comunidad
              </h3>
              <p className="text-xs text-gray-400 font-sans">Directorio de miembros para gestión de clientes y seguimiento.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-2.5 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar nombre, email..."
                  className="pl-8 bg-white/5 border-white/10 text-xs text-white w-48"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    statusFilter === 'all' ? 'bg-primary text-gray-950 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('paid')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    statusFilter === 'paid' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  De Pago
                </button>
                <button
                  onClick={() => setStatusFilter('trial')}
                  className={`px-2.5 py-1 rounded cursor-pointer ${
                    statusFilter === 'trial' ? 'bg-blue-500/20 text-blue-400 font-bold' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  En Prueba
                </button>
              </div>

              <Button
                onClick={exportToCSV}
                size="sm"
                variant="outline"
                className="border-white/10 text-gray-300 hover:bg-white/5 text-xs font-mono cursor-pointer"
              >
                <Download className="size-3.5 mr-1.5" /> CSV
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-gray-400 uppercase">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Estado</th>
                  <th className="p-3">País</th>
                  <th className="p-3">Fuente</th>
                  <th className="p-3">Ingreso</th>
                  <th className="p-3 text-right">Monto / Mes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredContacts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No se encontraron contactos que coincidan con los criterios.
                    </td>
                  </tr>
                ) : (
                  filteredContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">{c.name}</td>
                      <td className="p-3 text-gray-300 font-sans">{c.email}</td>
                      <td className="p-3">
                        {c.status === 'paid' ? (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                            De Pago
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px]">
                            En Prueba
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="mr-1.5">{c.countryCode}</span>
                        <span className="text-gray-300">{c.country}</span>
                      </td>
                      <td className="p-3 text-gray-400 font-sans">{c.source}</td>
                      <td className="p-3 text-gray-400 font-sans">{c.joinDate}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {c.monthlySpend > 0 ? `$${c.monthlySpend} USD` : '$0 (Trial)'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
