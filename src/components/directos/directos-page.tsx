'use client';

import { useState } from 'react';
import { Clock, Users, Video, Radio, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AvatarInitials } from '@/components/autodev/avatar-initials';
import { MOCK_LIVES } from '@/lib/mock-data';
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

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

function SessionCard({
  session,
}: {
  session: (typeof MOCK_LIVES)[number];
}) {
  const [registered, setRegistered] = useState(session.isUserRegistered);
  const [waitlisted, setWaitlisted] = useState(session.isWaitlisted);
  const isFull = session.attendeesCount >= session.maxAttendees;
  const fillPercent = Math.round(
    (session.attendeesCount / session.maxAttendees) * 100
  );
  const statusCfg = STATUS_CONFIG[session.status];

  const handleReserve = () => {
    if (isFull) {
      setWaitlisted(true);
    } else {
      setRegistered(true);
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 space-y-4 animate-fade-in-up hover:border-[#10B981]/30 transition-colors">
      {/* Status badge + date */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge className={`${statusCfg.className} border`} variant="outline">
          {session.status === 'live' && (
            <span className="relative flex size-2 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-red opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-terminal-red" />
            </span>
          )}
          {statusCfg.label}
        </Badge>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(session.scheduledAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {formatTime(session.scheduledAt)}
          </span>
        </div>
      </div>

      {/* Title & description */}
      <h3 className="text-base font-semibold text-foreground leading-snug">
        {session.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {session.description}
      </p>

      {/* Host */}
      <div className="flex items-center gap-2">
        <AvatarInitials name={session.hostName} size="sm" />
        <span className="text-sm text-foreground font-medium">
          {session.hostName}
        </span>
      </div>

      {/* Capacity bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {session.attendeesCount}/{session.maxAttendees} cupos
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {formatDuration(session.durationMinutes)}
          </span>
        </div>
        <Progress value={fillPercent} className="h-1.5" />
      </div>

      {/* Action */}
      <div>
        {registered && (
          <Badge className="bg-green-700/30 text-green-400 border border-green-700/50 py-1 px-3">
            ✓ Inscrito
          </Badge>
        )}
        {waitlisted && !registered && (
          <Badge className="bg-amber-700/30 text-amber-400 border border-amber-700/50 py-1 px-3">
            ⏳ En lista de espera
          </Badge>
        )}
        {!registered && !waitlisted && isFull && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReserve}
            className="border-amber-600/40 text-amber-400 hover:bg-amber-600/10"
          >
            Unirse a lista de espera
          </Button>
        )}
        {!registered && !waitlisted && !isFull && session.status === 'scheduled' && (
          <Button
            size="sm"
            onClick={handleReserve}
            className="bg-[#10B981] text-background hover:bg-[#10B981]/90 rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]"
          >
            <Video className="size-4" />
            Reservar cupo
          </Button>
        )}
        {session.status === 'ended' && !registered && !waitlisted && (
          <p className="text-xs text-muted-foreground terminal-text">
            {'// sesión finalizada'}
          </p>
        )}
        {session.status === 'cancelled' && (
          <p className="text-xs text-terminal-error terminal-text">
            {'// sesión cancelada'}
          </p>
        )}
      </div>
    </div>
  );
}

export function DirectosPage() {
  const [localLives] = useState(MOCK_LIVES);
  const hasSessions = localLives.length > 0;

  return (
    <div className="space-y-4">
      {/* Terminal header */}
      <div className="terminal-text flex items-center gap-2 text-sm">
        <span className="text-foreground font-semibold">autodev</span>
        <span className="text-muted-foreground">~/directos</span>
        <span className="animate-blink text-[#10B981]">▊</span>
      </div>

      {hasSessions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 stagger-children">
          {localLives.map((session) => (
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