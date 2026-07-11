'use client';

import { useState } from 'react';
import { Clock, Users, Video, Radio, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AvatarInitials } from '@/components/autodev/avatar-initials';
import type { LiveStatus } from '@/types/autodev';

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
  const statusInfo = STATUS_CONFIG[session.status] ?? STATUS_CONFIG.scheduled;
  const fillPercent = Math.min(
    100,
    Math.round((session.attendeesCount / session.maxAttendees) * 100)
  );

  return (
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

        {/* Action Button */}
        {session.status === 'live' ? (
          <Button
            size="sm"
            className="w-full bg-terminal-red hover:bg-terminal-red/90 text-white font-mono text-xs shadow-lg shadow-terminal-red/20"
          >
            <Video className="size-3.5 mr-1.5 animate-pulse" />
            Unirse Ahora
          </Button>
        ) : session.status === 'scheduled' ? (
          <Button
            size="sm"
            variant={registered ? 'outline' : 'default'}
            onClick={() => setRegistered(!registered)}
            className={`w-full font-mono text-xs ${
              registered
                ? 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {registered ? '✓ Registrado (Cancelar)' : 'Registrarse'}
          </Button>
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
  );
}

export function DirectosPage() {
  const liveSessions = useAppStore((s) => s.liveSessions);
  const hasSessions = liveSessions.length > 0;

  return (
    <div className="space-y-4">
      {/* Terminal header */}
      <div className="terminal-text flex items-center gap-2 text-sm">
        <span className="text-foreground font-semibold">bbmdev</span>
        <span className="text-muted-foreground">~/directos</span>
        <span className="animate-blink text-[#10B981]">▊</span>
      </div>

      {hasSessions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {liveSessions.map((session) => (
            <SessionCard key={session.liveId} session={session} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center gap-4 text-center animate-fade-in-up">
          <div className="relative">
            <Radio className="size-12 text-muted-foreground/30" />
            <span className="absolute -top-1 -right-1 flex size-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-40" />
              <span className="relative inline-flex rounded-full size-3 bg-[#10B981]/60" />
            </span>
          </div>
          <div className="space-y-2">
            <p className="terminal-text terminal-comment text-sm">
              {'// PRÓXIMOS'}
            </p>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Próximamente anunciaremos nuevas sesiones en vivo sobre
              automatización, n8n, WhatsApp e IA
            </p>
            <p className="terminal-text terminal-comment text-xs mt-2">
              Miembros gratis, cupo limitado
            </p>
          </div>
        </div>
      )}
    </div>
  );
}