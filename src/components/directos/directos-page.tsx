'use client';

import { useState, useEffect } from 'react';
import { Clock, Users, Video, Radio, Calendar, Lock, Plus, Edit3, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AvatarInitials } from '@/components/bbmdev/avatar-initials';
import type { LiveStatus } from '@/types/bbmdev';
import { useAppStore } from '@/stores/app-store';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

// ── Authorized emails ──
const AUTHORIZED_EMAILS = ['jibohorquez@gmail.com', 'c.moreno.mvv@gmail.com'];

// ── Status Config ──
const STATUS_CONFIG: Record<LiveStatus, { label: string; className: string }> = {
  scheduled: { label: 'Programado', className: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40' },
  live: { label: 'En vivo', className: 'bg-red-500/20 text-red-400 border-red-500/40' },
  ended: { label: 'Finalizado', className: 'bg-gray-500/20 text-gray-400 border-gray-500/40' },
  cancelled: { label: 'Cancelado', className: 'bg-red-900/30 text-red-400 border-red-800/40' },
};

// ── Helpers ──
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

// ══════════════════════════════════════════════════════════════
// YouTube Player Component
// ══════════════════════════════════════════════════════════════
function YouTubePlayer({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Live Stream"
      />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Live Room Modal
// ══════════════════════════════════════════════════════════════
function LiveRoomModal({ open, onClose, session }: { open: boolean; onClose: () => void; session: any }) {
  if (!open) return null;

  const youTubeId = session?.streamUrl ? extractYouTubeId(session.streamUrl) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-[#0a0f1a] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0f172a]">
          <div className="flex items-center gap-2">
            {session?.status === 'live' && <span className="size-2 rounded-full bg-red-500 animate-pulse" />}
            <span className="text-sm font-mono text-white">{session?.title}</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white cursor-pointer">✕</button>
        </div>

        {/* Video/Stream */}
        <div className="flex-1 bg-black flex items-center justify-center min-h-[400px]">
          {youTubeId ? (
            <YouTubePlayer videoId={youTubeId} />
          ) : session?.streamUrl ? (
            <a href={session.streamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#10B981] hover:underline">
              <ExternalLink className="size-4" /> Abrir stream en YouTube
            </a>
          ) : (
            <div className="text-center text-gray-600">
              <Radio className="size-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-mono">Esperando transmisión...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Session Card
// ══════════════════════════════════════════════════════════════
function SessionCard({ session, onEdit }: { session: any; onEdit: (s: any) => void }) {
  const currentUser = useAppStore((s) => s.currentUser);
  const [registered, setRegistered] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const isAuthorized = currentUser && AUTHORIZED_EMAILS.includes(currentUser.email);
  const statusInfo = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.scheduled;
  const fillPercent = Math.min(100, Math.round(((session.attendeesCount || 0) / (session.maxAttendees || 1)) * 100));
  const youTubeId = session.streamUrl ? extractYouTubeId(session.streamUrl) : null;

  return (
    <>
      <LiveRoomModal open={roomOpen} onClose={() => setRoomOpen(false)} session={session} />
      <div className="glass-card rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
        {/* YouTube Preview */}
        {youTubeId && session.status === 'live' ? (
          <YouTubePlayer videoId={youTubeId} />
        ) : youTubeId ? (
          <a href={session.streamUrl} target="_blank" rel="noopener noreferrer" className="block h-32 bg-gradient-to-br from-red-900/30 to-black flex items-center justify-center gap-2 hover:from-red-900/50 transition-colors">
            <ExternalLink className="size-4 text-red-400" />
            <span className="text-sm font-mono text-red-400">Ver en YouTube</span>
          </a>
        ) : (
          <div className="h-32 bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 flex items-center justify-center">
            <Radio className="size-8 text-[#10B981]/30" />
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Status + Edit */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={`${statusInfo.className} text-[10px] font-mono`}>
              {session.status === 'live' && <span className="size-1.5 rounded-full bg-red-500 animate-pulse mr-1" />}
              {statusInfo.label}
            </Badge>
            {isAuthorized && (
              <button onClick={() => onEdit(session)} className="text-gray-500 hover:text-[#10B981] transition-colors cursor-pointer">
                <Edit3 className="size-3.5" />
              </button>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="font-semibold text-white text-sm line-clamp-1">{session.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">{session.description}</p>
          </div>

          {/* Date & Duration */}
          <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
            <span className="flex items-center gap-1"><Calendar className="size-3" /> {formatDate(session.scheduledAt)}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" /> {formatDuration(session.durationMinutes)}</span>
          </div>

          {/* Host */}
          <div className="flex items-center gap-2">
            <AvatarInitials name={session.hostName || 'Host'} size="sm" />
            <span className="text-xs text-gray-400">{session.hostName}</span>
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>{session.attendeesCount || 0}/{session.maxAttendees} cupos</span>
              <span>{fillPercent}%</span>
            </div>
            <Progress value={fillPercent} className="h-1 bg-gray-800 [&>div]:bg-[#10B981]" />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            {session.status === 'live' ? (
              <div className="flex gap-2 w-full">
                <Button size="sm" onClick={() => setRoomOpen(true)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-mono text-xs cursor-pointer">
                  <Video className="size-3.5 mr-1 animate-pulse" /> Unirse al directo
                </Button>
                {session.streamUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-mono text-xs border-white/10 text-gray-400 hover:border-[#10B981]/40 hover:text-[#10B981] cursor-pointer"
                    onClick={() => window.open(session.streamUrl, '_blank')}
                  >
                    <ExternalLink className="size-3.5" />
                  </Button>
                )}
              </div>
            ) : session.status === 'scheduled' ? (
              <div className="flex gap-2 w-full">
                <Button size="sm" variant={registered ? 'outline' : 'default'} onClick={() => setRegistered(!registered)} className={`flex-1 font-mono text-xs cursor-pointer ${registered ? 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10' : 'bg-[#10B981] text-black hover:bg-[#10B981]/90'}`}>
                  {registered ? '✓ Registrado' : 'Registrarse'}
                </Button>
                {session.streamUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-mono text-xs border-white/10 text-gray-400 hover:border-[#10B981]/40 hover:text-[#10B981] cursor-pointer"
                    onClick={() => {
                      if (youTubeId) {
                        setRoomOpen(true);
                      } else {
                        window.open(session.streamUrl, '_blank');
                      }
                    }}
                  >
                    <ExternalLink className="size-3.5 mr-1" /> Ver
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button size="sm" disabled className="flex-1 font-mono text-xs opacity-50">Finalizada</Button>
                {session.streamUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-mono text-xs border-white/10 text-gray-400 hover:border-[#10B981]/40 hover:text-[#10B981] cursor-pointer"
                    onClick={() => window.open(session.streamUrl, '_blank')}
                  >
                    <ExternalLink className="size-3.5 mr-1" /> Ver Grabación
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// Create/Edit Live Session Dialog
// ══════════════════════════════════════════════════════════════
function LiveSessionDialog({ open, onOpenChange, editSession }: { open: boolean; onOpenChange: (o: boolean) => void; editSession?: any }) {
  const currentUser = useAppStore((s) => s.currentUser);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [maxAttendees, setMaxAttendees] = useState('50');
  const [streamUrl, setStreamUrl] = useState('');
  const [status, setStatus] = useState<LiveStatus>('scheduled');

  useEffect(() => {
    if (editSession) {
      setTitle(editSession.title || '');
      setDescription(editSession.description || '');
      if (editSession.scheduledAt) {
        const d = new Date(editSession.scheduledAt);
        setScheduledDate(d.toISOString().split('T')[0]);
        setScheduledTime(d.toTimeString().slice(0, 5));
      }
      setDuration(String(editSession.durationMinutes || 60));
      setMaxAttendees(String(editSession.maxAttendees || 50));
      setStreamUrl(editSession.streamUrl || '');
      setStatus(editSession.status || 'scheduled');
    } else {
      setTitle(''); setDescription(''); setScheduledDate(''); setScheduledTime('');
      setDuration('60'); setMaxAttendees('50'); setStreamUrl(''); setStatus('scheduled');
    }
  }, [editSession, open]);

  const handleSave = async () => {
    if (!title.trim() || !scheduledDate || !scheduledTime) return;
    const scheduledAt = new Date(scheduledDate + 'T' + scheduledTime + ':00').toISOString();
    const data = {
      title: title.trim(),
      description: description.trim(),
      scheduledAt,
      durationMinutes: parseInt(duration),
      maxAttendees: parseInt(maxAttendees),
      streamUrl: streamUrl.trim() || null,
      status,
    };
    try {
      if (editSession?.liveId) {
        await updateDoc(doc(db, 'liveSessions', editSession.liveId), data);
      } else {
        await addDoc(collection(db, 'liveSessions'), {
          ...data,
          hostId: currentUser?.uid || '',
          hostName: currentUser?.displayName || 'Organizador',
          attendeesCount: 0,
          createdAt: new Date().toISOString(),
        });
      }
      onOpenChange(false);
    } catch (err) {
      console.warn('Error saving live session:', err);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 ${open ? '' : 'hidden'}`}>
      <div className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="text-[#10B981]" /> {editSession ? 'Editar Directo' : 'Crear Directo'}
          </h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-white cursor-pointer">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#10B981]">Titulo *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo del directo..." className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#10B981]">Descripcion</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripcion..." rows={2} className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-[#10B981]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#10B981]">Fecha *</label>
              <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#10B981]">Hora *</label>
              <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#10B981]">Duracion (min)</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#10B981]">Cupo maximo</label>
              <Input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono text-[#10B981]">URL de YouTube</label>
            <Input value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} placeholder="https://youtube.com/watch?v=... o https://youtu.be/..." className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
            <span className="text-[10px] text-gray-600 font-mono">Pega el enlace del directo de YouTube para embeber el video</span>
          </div>
          {editSession && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#10B981]">Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as LiveStatus)} className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white font-mono text-sm cursor-pointer">
                <option value="scheduled">Programado</option>
                <option value="live">En vivo</option>
                <option value="ended">Finalizado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-white/10">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-gray-400 hover:text-white">Cancelar</Button>
          <Button onClick={handleSave} disabled={!title.trim() || !scheduledDate || !scheduledTime} className="flex-1 bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] disabled:opacity-40">
            {editSession ? 'Guardar Cambios' : '+ Crear Directo'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Main Page
// ══════════════════════════════════════════════════════════════
export function DirectosPage() {
  const liveSessions = useAppStore((s) => s.liveSessions);
  const currentUser = useAppStore((s) => s.currentUser);
  const isAuthorized = currentUser && AUTHORIZED_EMAILS.includes(currentUser.email);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSession, setEditSession] = useState<any>(null);

  // Filter: hide sessions older than 1 day from scheduled time
  const visibleSessions = liveSessions.filter((session) => {
    if (session.status === 'ended' || session.status === 'cancelled') {
      const scheduledTime = new Date(session.scheduledAt).getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (Date.now() - scheduledTime > oneDayMs) return false;
    }
    return true;
  });

  const handleEdit = (session: any) => {
    setEditSession(session);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditSession(null);
    setDialogOpen(true);
  };

  if (!isAuthorized) {
    return (
      <div className="space-y-4">
        <div className="font-mono text-xs"><span className="text-white font-semibold">bbmdev</span> <span className="text-gray-500">~/directos</span></div>
        <div className="border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center bg-white/5">
          <Lock className="size-12 text-gray-600" />
          <p className="text-gray-400 text-sm font-mono">Acceso restringido</p>
          <p className="text-gray-600 text-xs font-mono">Solo los organizadores pueden gestionar directos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <LiveSessionDialog open={dialogOpen} onOpenChange={setDialogOpen} editSession={editSession} />

      <div className="flex items-center justify-between">
        <div className="font-mono text-xs"><span className="text-white font-semibold">bbmdev</span> <span className="text-gray-500">~/directos</span></div>
        <Button onClick={handleCreate} className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]">
          <Plus className="size-4 mr-1.5" /> Nuevo Directo
        </Button>
      </div>

      {visibleSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleSessions.map((session, i) => (
            <SessionCard key={session.liveId || `live-${i}`} session={session} onEdit={handleEdit} />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center bg-white/5">
          <Radio className="size-12 text-gray-600/30" />
          <p className="text-gray-500 text-sm font-mono">{'// PRÓXIMOS'}</p>
          <p className="text-gray-600 text-xs font-mono">Crea tu primer directo para comenzar</p>
        </div>
      )}
    </div>
  );
}
