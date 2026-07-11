'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, Users, Video, Radio, Calendar, Send, MessageSquare, X, Lock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AvatarInitials } from '@/components/autodev/avatar-initials';
import type { LiveStatus } from '@/types/autodev';
import { useAppStore } from '@/stores/app-store';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendLiveChatMessageInFirestore } from '@/lib/firestore-sync';

// ── Authorized emails for creating live sessions ──
const AUTHORIZED_EMAILS = [
  'jibohorquez@gmail.com',
  'c.moreno.mvv@gmail.com',
];

const STATUS_CONFIG: Record<
  LiveStatus,
  { label: string; className: string }
> = {
  scheduled: {
    label: 'Programado',
    className: 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40',
  },
  live: {
    label: 'En vivo',
    className: 'bg-terminal-red/20 text-terminal-red border-terminal-red/40',
  },
  ended: {
    label: 'Finalizado',
    className: 'bg-slate-700/60 text-slate-400 border-slate-600/40',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-900/30 text-red-400 border-red-800/40',
  },
};


function formatSpanishDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
    const timePart = d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${datePart} · ${timePart}`;
  } catch {
    return isoString;
  }
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

function LiveRoomModal({
  open,
  onClose,
  session,
}: {
  open: boolean;
  onClose: () => void;
  session: any;
}) {
  const { currentUser } = useAppStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !db) return;
    const q = query(collection(db, `liveSessions/${session.liveId}/chat`), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const msgs = snap.docs.map((d) => d.data());
        setMessages(msgs);
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      },
      (err) => console.warn('Live chat snapshot err:', err.message)
    );
    return () => unsub();
  }, [open, session.liveId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const msg = {
      id: 'msg-' + Date.now() + Math.random().toString(36).slice(2, 6),
      userId: currentUser?.uid || 'anon',
      userName: currentUser?.displayName || 'Desarrollador BBM',
      userAvatarUrl: currentUser?.avatarUrl || null,
      content: inputMsg.trim(),
      createdAt: new Date().toISOString(),
    };
    sendLiveChatMessageInFirestore(session.liveId, msg);
    setInputMsg('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="glass-card w-full max-w-6xl h-[88vh] rounded-2xl border border-[#10B981]/40 flex flex-col lg:flex-row overflow-hidden shadow-2xl shadow-[#10B981]/10">
        {/* Left: Video Player Embed / Stage */}
        <div className="flex-1 bg-black/90 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-terminal-red animate-ping" />
              <Badge className="bg-terminal-red text-white font-mono text-xs">EN VIVO</Badge>
              <span className="text-sm font-semibold text-gray-200 truncate">{session.title}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
              <X className="size-5" />
            </Button>
          </div>

          <div className="my-auto py-12 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Radio className="size-10 text-[#10B981] animate-pulse" />
            </div>
            <div className="space-y-1 max-w-lg">
              <h3 className="text-lg font-bold text-white">{session.title}</h3>
              <p className="text-xs text-gray-400">{session.description}</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-[#10B981] border-[#10B981]/30 bg-[#10B981]/5">
              Ponente: {session.speakerName} ({session.speakerRole})
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-3 font-mono">
            <span>+{session.xpReward} XP por asistencia</span>
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <Users className="size-3.5" />
              Sala comunitaria conectada a Firestore
            </span>
          </div>
        </div>

        {/* Right: Live Chat */}
        <div className="w-full lg:w-96 flex flex-col bg-gray-950/80 h-1/2 lg:h-full">
          <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-[#10B981]" />
              <span className="font-semibold text-sm text-gray-200">Chat en Vivo</span>
            </div>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {messages.length} msgs
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 gap-2 p-4">
                <MessageSquare className="size-8 opacity-30" />
                <p>No hay mensajes aún en esta sala de chat.</p>
                <p className="text-[10px] font-mono text-[#10B981]">¡Sé el primero en saludar a la comunidad!</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.userId === currentUser?.uid;
                return (
                  <div key={m.id} className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <AvatarInitials name={m.userName} className="size-6 shrink-0 text-[10px]" />
                    <div
                      className={`max-w-[80%] rounded-xl px-3 py-2 ${isMe
                          ? 'bg-[#10B981] text-black font-medium rounded-tr-none'
                          : 'bg-white/10 text-gray-200 rounded-tl-none'
                        }`}
                    >
                      {!isMe && <p className="text-[10px] font-bold text-[#10B981] mb-0.5">{m.userName}</p>}
                      <p className="leading-relaxed break-words">{m.content}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex items-center gap-2 bg-gray-950">
            <Input
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Escribe en el chat en vivo..."
              className="h-9 text-xs bg-white/5 border-white/10 focus:border-[#10B981]"
            />
            <Button type="submit" size="icon" className="size-9 bg-[#10B981] hover:bg-[#10B981]/90 text-black shrink-0 cursor-pointer">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SessionCard({
  session,
}: {
  session: {
    liveId: string;
    title: string;
    description: string;
    scheduledAt: string;
    durationMinutes: number;
    speakerName: string;
    speakerRole: string;
    attendeesCount: number;
    maxAttendees: number;
    status: LiveStatus;
    xpReward: number;
  };
}) {
  const [registered, setRegistered] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  const statusInfo = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.scheduled;
  const fillPercent = Math.min(
    100,
    Math.round((session.attendeesCount / session.maxAttendees) * 100)
  );

  return (
    <>
      <LiveRoomModal open={roomOpen} onClose={() => setRoomOpen(false)} session={session} />
      <div className="glass-card rounded-xl p-5 flex flex-col justify-between gap-4 border border-border/60 hover:border-border transition-colors">
        <div className="space-y-3">
          {/* Top: Status badge & XP */}
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className={`${statusInfo.className} text-[11px] font-mono uppercase tracking-wider`}
            >
              {session.status === 'live' && (
                <span className="size-1.5 rounded-full bg-terminal-red animate-ping mr-1.5" />
              )}
              {statusInfo.label}
            </Badge>

            <Badge
              variant="outline"
              className="text-[11px] font-mono border-terminal-amber/30 text-terminal-amber bg-terminal-amber/5"
            >
              +{session.xpReward} XP
            </Badge>
          </div>

          {/* Title & description */}
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground text-base line-clamp-2 leading-snug">
              {session.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {session.description}
            </p>
          </div>

          {/* Date & Duration */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              <span>{formatSpanishDate(session.scheduledAt)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="size-3.5 text-muted-foreground" />
              <span>{formatDuration(session.durationMinutes)}</span>
            </div>
          </div>

          {/* Speaker */}
          <div className="flex items-center gap-2 pt-1">
            <AvatarInitials
              name={session.speakerName}
              className="size-7 text-[10px] bg-secondary text-foreground"
            />
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {session.speakerName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">
                {session.speakerRole}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/40">
          {/* Attendees progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Users className="size-3 text-muted-foreground" />
                <span>
                  {session.attendeesCount + (registered ? 1 : 0)}/
                  {session.maxAttendees}
                </span>
              </span>
              <span>{fillPercent}% lleno</span>
            </div>
            <Progress
              value={fillPercent}
              className="h-1.5 bg-secondary [&>div]:bg-[#10B981]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {session.status === 'live' ? (
              <Button
                size="sm"
                onClick={() => setRoomOpen(true)}
                className="w-full bg-terminal-red hover:bg-terminal-red/90 text-white font-mono text-xs shadow-lg shadow-terminal-red/20 cursor-pointer"
              >
                <Video className="size-3.5 mr-1.5 animate-pulse" />
                Unirse Ahora
              </Button>
            ) : session.status === 'scheduled' ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={registered ? 'outline' : 'default'}
                  onClick={() => setRegistered(!registered)}
                  className={`flex-1 font-mono text-xs cursor-pointer ${registered
                      ? 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                >
                  {registered ? '✓ Registrado' : 'Registrarse'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRoomOpen(true)}
                  className="font-mono text-xs border-border hover:border-[#10B981]/40 text-gray-300 hover:text-[#10B981] cursor-pointer shrink-0"
                  title="Entrar a Sala Previa y Chat"
                >
                  <MessageSquare className="size-3.5 mr-1" />
                  Sala/Chat
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                disabled
                className="w-full font-mono text-xs opacity-50"
              >
                Sesión finalizada
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Create Live Session Dialog ──────────────────────────
function CreateLiveSessionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const currentUser = useAppStore((s) => s.currentUser);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [maxAttendees, setMaxAttendees] = useState('50');

  const handleCreate = async () => {
    if (!title.trim() || !scheduledDate || !scheduledTime) return;
    const scheduledAt = new Date(scheduledDate + 'T' + scheduledTime + ':00').toISOString();
    try {
      await addDoc(collection(db, 'liveSessions'), {
        title: title.trim(),
        description: description.trim(),
        hostId: currentUser?.uid || '',
        hostName: currentUser?.displayName || 'Organizador',
        scheduledAt,
        durationMinutes: parseInt(duration),
        maxAttendees: parseInt(maxAttendees),
        status: 'scheduled',
        streamUrl: null,
        createdAt: new Date().toISOString(),
      });
      setTitle(''); setDescription(''); setScheduledDate(''); setScheduledTime('');
      setDuration('60'); setMaxAttendees('50');
      onOpenChange(false);
    } catch (err) {
      console.warn('Error creating live session:', err);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${open ? '' : 'hidden'}`}>
      <div className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Radio className="text-[#10B981]" /> Crear Directo
          </h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-white cursor-pointer">✕</button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#10B981]">Titulo *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo del directo..." className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-mono text-[#10B981]">Descripcion</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripcion del directo..." rows={3} className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-[#10B981]/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-[#10B981]">Fecha *</label>
              <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-[#10B981]">Hora *</label>
              <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-[#10B981]">Duracion (min)</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-[#10B981]">Cupo maximo</label>
              <Input type="number" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} className="bg-transparent border border-white/10 text-white font-mono text-sm focus:border-[#10B981]/50" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-gray-400 hover:text-white">Cancelar</Button>
          <Button onClick={handleCreate} disabled={!title.trim() || !scheduledDate || !scheduledTime} className="flex-1 bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] disabled:opacity-40">
            <Plus className="size-4 mr-1.5" /> Crear Directo
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DirectosPage() {
  const liveSessions = useAppStore((s) => s.liveSessions);
  const currentUser = useAppStore((s) => s.currentUser);
  const hasSessions = liveSessions.length > 0;
  const [dialogOpen, setDialogOpen] = useState(false);

  const isAuthorized = currentUser && AUTHORIZED_EMAILS.includes(currentUser.email);

  if (!isAuthorized) {
    return (
      <div className="space-y-4">
        <div className="terminal-text flex items-center gap-2 text-sm">
          <span className="text-foreground font-semibold">bbmdev</span>
          <span className="text-muted-foreground">~/directos</span>
          <span className="animate-blink text-[#10B981]">▊</span>
        </div>
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center">
          <Lock className="size-12 text-gray-600" />
          <div className="space-y-2">
            <p className="text-gray-400 text-sm font-mono">Acceso restringido</p>
            <p className="text-gray-600 text-xs font-mono">Solo los organizadores pueden gestionar directos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CreateLiveSessionDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Terminal header + Create button */}
      <div className="flex items-center justify-between">
        <div className="terminal-text flex items-center gap-2 text-sm">
          <span className="text-foreground font-semibold">bbmdev</span>
          <span className="text-muted-foreground">~/directos</span>
          <span className="animate-blink text-[#10B981]">▊</span>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]">
          <Plus className="size-4 mr-1.5" /> Nuevo Directo
        </Button>
      </div>

      {hasSessions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {liveSessions.map((session, index) => (
            <SessionCard key={session.liveId || `live-${index}`} session={session} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center animate-fade-in-up">
          <div className="relative">
            <Radio className="size-12 text-muted-foreground/30" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-40" />
              <span className="relative inline-flex rounded-full size-3 bg-[#10B981]/60" />
            </span>
          </div>
          <div className="space-y-2">
            <p className="terminal-text terminal-comment text-sm">{'// PRÓXIMOS'}</p>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Próximamente anunciaremos nuevas sesiones en vivo sobre automatización, n8n, WhatsApp e IA
            </p>
            <p className="terminal-text terminal-comment text-xs mt-2">Miembros gratis, cupo limitado</p>
          </div>
        </div>
      )}
    </div>
  );
}