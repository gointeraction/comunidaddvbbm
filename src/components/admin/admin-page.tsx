'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  BarChart3,
  ScrollText,
  Search,
  EyeOff,
  Ban,
  ChevronDown,
  UserCog,
  Radio,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AvatarInitials } from '@/components/autodev/avatar-initials';
import { useAppStore } from '@/stores/app-store';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, doc, getDoc, updateDoc } from 'firebase/firestore';
import type { UserRole, Post, AuditLog } from '@/types/autodev';
import { Lock } from 'lucide-react';

// ── Authorized emails for admin access ──
const AUTHORIZED_EMAILS = ['jibohorquez@gmail.com', 'c.moreno.mvv@gmail.com'];

type AdminTab = 'users' | 'moderation' | 'metrics' | 'audit' | 'directos';

const TABS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: 'users', label: 'Usuarios', icon: Users },
  { id: 'moderation', label: 'Moderación', icon: Shield },
  { id: 'metrics', label: 'Métricas', icon: BarChart3 },
  { id: 'audit', label: 'Auditoría', icon: ScrollText },
  { id: 'directos', label: 'Directos', icon: Radio },
];

const ROLE_LABELS: Record<UserRole, string> = {
  member: 'Member',
  autor: 'Autor',
  moderador: 'Moderador',
  admin: 'Admin',
};

const ROLE_COLORS: Record<UserRole, string> = {
  member: 'bg-slate-700/60 text-slate-300',
  autor: 'bg-blue-700/40 text-blue-300',
  moderador: 'bg-amber-700/40 text-amber-300',
  admin: 'bg-red-700/40 text-red-300',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-700/30 text-green-400',
  onboarding_pending: 'bg-amber-700/30 text-amber-400',
  suspended: 'bg-red-700/30 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Activo',
  onboarding_pending: 'Onboarding',
  suspended: 'Suspendido',
};

const METRIC_BARS = [
  { label: 'Lun', value: 78 },
  { label: 'Mar', value: 65 },
  { label: 'Mié', value: 90 },
  { label: 'Jue', value: 82 },
  { label: 'Vie', value: 95 },
  { label: 'Sáb', value: 40 },
  { label: 'Dom', value: 30 },
];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// ── Users Tab ────────────────────────────────────────────
function UsersTab() {
  const users = useAppStore((s) => s.users);
  const changeUserRole = useAppStore((s) => s.changeUserRole);
  const [search, setSearch] = useState('');
  const [suspendDialog, setSuspendDialog] = useState<string | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendDuration, setSuspendDuration] = useState('7d');

  const filtered = users.filter(
    (u) => u.displayName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Buscar usuarios..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-background/50" />
      </div>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Usuario</TableHead>
                <TableHead className="text-xs text-muted-foreground">Email</TableHead>
                <TableHead className="text-xs text-muted-foreground">Rol</TableHead>
                <TableHead className="text-xs text-muted-foreground">Estado</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">Posts</TableHead>
                <TableHead className="text-xs text-muted-foreground text-right">XP</TableHead>
                <TableHead className="text-xs text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.uid} className="border-border">
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[140px]">
                      <AvatarInitials name={user.displayName} size="sm" level={user.role} />
                      <span className="text-sm font-medium truncate">{user.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Select value={user.role} onValueChange={(v) => changeUserRole(user.uid, v)}>
                      <SelectTrigger size="sm" className="w-[120px] h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (
                          <SelectItem key={r} value={r} className="text-xs">{ROLE_LABELS[r]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Badge className={`${STATUS_COLORS[user.status]} text-xs`}>{STATUS_LABELS[user.status]}</Badge></TableCell>
                  <TableCell className="text-sm text-right">{user.postsCount}</TableCell>
                  <TableCell className="text-sm text-right text-[#10B981] font-medium">{user.xp.toLocaleString()}</TableCell>
                  <TableCell>
                    {user.status === 'active' && user.role !== 'admin' && (
                      <Button variant="ghost" size="sm" className="text-terminal-error hover:text-terminal-error hover:bg-terminal-error/10 h-7 text-xs" onClick={() => setSuspendDialog(user.uid)}>
                        <Ban className="size-3" /> Suspender
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {suspendDialog && (
        <div className="glass-card rounded-xl p-5 space-y-4 border-terminal-error/30 animate-fade-in-up">
          <div className="flex items-center gap-2"><Ban className="size-5 text-terminal-error" /><h3 className="text-sm font-semibold">Suspender usuario</h3></div>
          <div className="space-y-3">
            <Select value={suspendDuration} onValueChange={setSuspendDuration}>
              <SelectTrigger size="sm" className="w-full h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">1 día</SelectItem>
                <SelectItem value="3d">3 días</SelectItem>
                <SelectItem value="7d">7 días</SelectItem>
                <SelectItem value="30d">30 días</SelectItem>
              </SelectContent>
            </Select>
            <Textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} placeholder="Motivo de la suspensión..." rows={2} className="bg-background/50 text-sm min-h-[60px]" />
            <div className="flex gap-2">
              <Button size="sm" className="bg-terminal-error text-white hover:bg-terminal-error/90" onClick={() => setSuspendDialog(null)}>
                <Ban className="size-3" /> Confirmar
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setSuspendDialog(null); setSuspendReason(''); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Moderation Tab ───────────────────────────────────────
function ModerationTab() {
  const posts = useAppStore((s) => s.posts);
  const [hideDialog, setHideDialog] = useState<string | null>(null);
  const [hideReason, setHideReason] = useState('');

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="terminal-text text-sm"><span className="terminal-prompt">$</span> <span className="terminal-path">~/moderacion/posts-recientes</span></h3>
        <div className="glass-card rounded-xl overflow-hidden divide-y divide-border">
          {posts.filter(p => !p.hidden).slice(0, 5).map((post, idx) => (
            <div key={`${post.postId}-${idx}`} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{post.title}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{post.authorName}</span><span>·</span><span>{formatTimestamp(post.createdAt)}</span><span>·</span><span>{post.likesCount} likes</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-terminal-amber hover:text-terminal-amber hover:bg-terminal-amber/10 h-8 text-xs" onClick={() => setHideDialog(post.postId)}>
                <EyeOff className="size-3" /> Ocultar
              </Button>
            </div>
          ))}
        </div>
      </div>
      {hideDialog && (
        <div className="glass-card rounded-xl p-5 space-y-4 border-terminal-amber/30 animate-fade-in-up">
          <div className="flex items-center gap-2"><EyeOff className="size-5 text-terminal-amber" /><h3 className="text-sm font-semibold">Ocultar post</h3></div>
          <Textarea value={hideReason} onChange={(e) => setHideReason(e.target.value)} placeholder="Razón..." rows={2} className="bg-background/50 text-sm min-h-[60px]" />
          <div className="flex gap-2">
            <Button size="sm" className="bg-terminal-amber text-background hover:bg-terminal-amber/90" onClick={() => setHideDialog(null)}>Ocultar</Button>
            <Button variant="outline" size="sm" onClick={() => { setHideDialog(null); setHideReason(''); }}>Cancelar</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Metrics Tab ──────────────────────────────────────────
function MetricsTab() {
  const counters = useAppStore((s) => s.counters);
  const maxBarValue = Math.max(...METRIC_BARS.map((b) => b.value));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'DAU', value: '142', sub: 'Daily Active Users', color: 'text-[#10B981]' },
          { label: 'Posts/Día', value: '23', sub: 'Promedio semanal', color: 'text-terminal-green' },
          { label: 'Descargas', value: '1.8K', sub: 'Total recursos', color: 'text-terminal-amber' },
          { label: 'Retención D7', value: '68%', sub: 'Usuarios activos +7d', color: 'text-terminal-purple' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 opacity-0 animate-fade-in-up">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-medium text-foreground">Actividad semanal — Posts por día</h3>
        <div className="flex items-end gap-2 h-40">
          {METRIC_BARS.map((bar) => (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">{bar.value}</span>
              <div className="w-full rounded-t-md bg-[#10B981]/70 transition-all hover:bg-[#10B981]" style={{ height: `${(bar.value / maxBarValue) * 100}%`, minHeight: '4px' }} />
              <span className="text-xs text-muted-foreground">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Contadores de la plataforma</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'Devs', value: counters.developersCount },
            { label: 'Posts', value: counters.postsCount },
            { label: 'Comments', value: counters.commentsCount },
            { label: 'Cursos', value: counters.coursesCount },
            { label: 'Recursos', value: counters.resourcesCount },
          ].map((c) => (
            <div key={c.label} className="text-center">
              <p className="text-lg font-bold text-[#10B981]">{c.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Audit Table ──────────────────────────────────────────
function AuditTable({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground">Fecha</TableHead>
              <TableHead className="text-xs text-muted-foreground">Actor</TableHead>
              <TableHead className="text-xs text-muted-foreground">Acción</TableHead>
              <TableHead className="text-xs text-muted-foreground">Target</TableHead>
              <TableHead className="text-xs text-muted-foreground">Razón</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.logId} className="border-border">
                <TableCell className="text-xs text-muted-foreground">{formatTimestamp(log.timestamp)}</TableCell>
                <TableCell className="text-sm font-medium">{log.actorName}</TableCell>
                <TableCell><Badge variant="outline" className="text-xs border-border">{log.action}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.targetType}:{log.targetId}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{log.motivo || '—'}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 terminal-text terminal-comment text-sm">{'// sin registros'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── Audit Tab ────────────────────────────────────────────
function AuditTab() {
  const auditLogs = useAppStore((s) => s.auditLogs);
  return (
    <div className="space-y-3">
      <h3 className="terminal-text text-sm"><span className="terminal-prompt">$</span> <span className="terminal-path">~/admin/auditoria</span></h3>
      <AuditTable logs={auditLogs} />
    </div>
  );
}

// ── Directos Tab (RF-048) ────────────────────────────────
function DirectosTab() {
  const liveSessions = useAppStore((s) => s.liveSessions);

  async function handleCancelSession(sessionId: string) {
    try {
      await updateDoc(doc(db, 'liveSessions', sessionId), { status: 'cancelled' });
      useAppStore.setState((prev) => ({
        liveSessions: prev.liveSessions.map((s: any) =>
          s.liveId === sessionId ? { ...s, status: 'cancelled' } : s
        ),
      }));
    } catch (e) {
      console.warn('Error cancelling session:', e);
    }
  }

  const SESSION_STATUS_COLORS: Record<string, string> = {
    scheduled: 'bg-green-700/30 text-green-400',
    live: 'bg-red-700/30 text-red-400',
    ended: 'bg-gray-700/30 text-gray-400',
    cancelled: 'bg-yellow-700/30 text-yellow-400',
  };

  return (
    <div className="space-y-4">
      <h3 className="terminal-text text-sm"><span className="terminal-prompt">$</span> <span className="terminal-path">~/admin/directos</span></h3>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground">Título</TableHead>
                <TableHead className="text-xs text-muted-foreground">Estado</TableHead>
                <TableHead className="text-xs text-muted-foreground">Fecha</TableHead>
                <TableHead className="text-xs text-muted-foreground">Inscritos</TableHead>
                <TableHead className="text-xs text-muted-foreground">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveSessions.map((session: any) => (
                <TableRow key={session.liveId} className="border-border">
                  <TableCell className="text-sm font-medium">{session.title}</TableCell>
                  <TableCell>
                    <Badge className={`${SESSION_STATUS_COLORS[session.status] || 'bg-gray-700/30 text-gray-400'} text-xs`}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {session.scheduledAt ? formatTimestamp(session.scheduledAt) : '—'}
                  </TableCell>
                  <TableCell className="text-sm">{session.registeredUsers?.length || 0}</TableCell>
                  <TableCell>
                    {session.status === 'scheduled' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-terminal-error hover:text-terminal-error hover:bg-terminal-error/10 h-7 text-xs"
                        onClick={() => handleCancelSession(session.liveId)}
                      >
                        <XCircle className="size-3" /> Cancelar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {liveSessions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 terminal-text terminal-comment text-sm">{'// sin sesiones programadas'}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ──────────────────────────────────────
export function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const currentUser = useAppStore((s) => s.currentUser);
  const isAuthorized = currentUser && AUTHORIZED_EMAILS.includes(currentUser.email);

  if (!isAuthorized) {
    return (
      <div className="space-y-4">
        <div className="font-mono text-xs"><span className="text-white font-semibold">bbmdev</span> <span className="text-gray-500">~/admin</span></div>
        <div className="border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center bg-white/5">
          <Lock className="size-12 text-gray-600" />
          <p className="text-gray-400 text-sm font-mono">Acceso restringido</p>
          <p className="text-gray-600 text-xs font-mono">Solo los administradores pueden acceder a este panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="font-mono text-xs">
        <span className="text-white font-semibold">bbmdev</span>
        <span className="text-gray-500">~/admin</span>
        <Badge className="bg-red-500/20 text-red-400 border border-red-500/40 text-xs ml-2">ADMIN</Badge>
      </div>
      <div className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
            <tab.icon className="size-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="animate-fade-in-up" key={activeTab}>
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'moderation' && <ModerationTab />}
        {activeTab === 'metrics' && <MetricsTab />}
        {activeTab === 'audit' && <AuditTab />}
        {activeTab === 'directos' && <DirectosTab />}
      </div>
    </div>
  );
}
