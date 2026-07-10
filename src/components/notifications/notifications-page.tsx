'use client';

import { useState } from 'react';
import {
  MessageSquare,
  Heart,
  Trophy,
  Target,
  TrendingUp,
  Radio,
  CheckCheck,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/app-store';
import type { NotificationType } from '@/types/autodev';

type FilterMode = 'all' | 'unread';

const ICON_MAP: Record<NotificationType, React.ElementType> = {
  new_comment: MessageSquare,
  new_like: Heart,
  mention: MessageSquare,
  mission_completed: Target,
  rank_update: TrendingUp,
  directo_reminder: Radio,
  achievement_unlocked: Trophy,
};

const ICON_COLOR_MAP: Record<NotificationType, string> = {
  new_comment: 'text-[#10B981]',
  new_like: 'text-terminal-red',
  mention: 'text-terminal-purple',
  mission_completed: 'text-terminal-green',
  rank_update: 'text-terminal-amber',
  directo_reminder: 'text-terminal-amber',
  achievement_unlocked: 'text-gold',
};

function getNotificationDescription(n: {
  type: NotificationType;
  fromUserName?: string;
}): string {
  switch (n.type) {
    case 'new_comment':
      return (n.fromUserName || 'Alguien') + ' comentó en tu post';
    case 'new_like':
      return (n.fromUserName || 'Alguien') + ' dio like a tu post';
    case 'mention':
      return (n.fromUserName || 'Alguien') + ' te mencionó en un comentario';
    case 'achievement_unlocked':
      return 'Desbloqueaste un nuevo logro';
    case 'mission_completed':
      return 'Completaste una misión';
    case 'rank_update':
      return 'Actualización de ranking semanal';
    case 'directo_reminder':
      return 'Recordatorio de sesión en vivo';
    default:
      return 'Nueva notificación';
  }
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days}d`;
  const weeks = Math.floor(days / 7);
  return `hace ${weeks}sem`;
}

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useAppStore();
  const [filter, setFilter] = useState<FilterMode>('all');

  const filtered =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="space-y-4">
      {/* Terminal header */}
      <div className="terminal-text flex items-center gap-2 text-sm">
        <span className="text-foreground font-semibold">autodev</span>
        <span className="text-muted-foreground">~/notificaciones</span>
        <span className="animate-blink text-[#10B981]">▊</span>
      </div>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-[#10B981]" />
            <span className="text-sm font-medium text-foreground">
              Notificaciones
            </span>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
              {unreadCount} sin leer
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Filter buttons */}
          <div className="flex rounded-md border border-border overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-border ${
                filter === 'unread'
                  ? 'bg-[#10B981]/20 text-[#10B981]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              No leídas
            </button>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-[#10B981]"
            >
              <CheckCheck className="size-3.5" />
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      {/* Notification list */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <Bell className="size-8 text-muted-foreground/30 mx-auto mb-3" />
            <p className="terminal-text terminal-comment text-sm">
              {filter === 'unread'
                ? '// no hay notificaciones sin leer'
                : '// no hay notificaciones'}
            </p>
          </div>
        ) : (
          filtered.map((notif, idx) => {
            const Icon = ICON_MAP[notif.type] || Bell;
            const iconColor = ICON_COLOR_MAP[notif.type] || 'text-muted-foreground';
            const isUnread = !notif.read;

            return (
              <button
                key={notif.notifId}
                onClick={() => markAsRead(notif.notifId)}
                className={`w-full text-left rounded-lg p-4 transition-all animate-slide-in flex items-start gap-3 group hover:bg-secondary/50 ${
                  isUnread
                    ? 'border-l-2 border-[#10B981] bg-[#10B981]/[0.03]'
                    : 'border-l-2 border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ animationDelay: `${idx * 40}ms`, animationFillMode: 'backwards' }}
              >
                <div
                  className={`mt-0.5 rounded-full p-2 ${isUnread ? 'bg-secondary' : 'bg-secondary/50'}`}
                >
                  <Icon className={`size-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p
                    className={`text-sm leading-snug ${
                      isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {notif.fromUserName ? (
                      <>
                        <span className={isUnread ? 'text-[#10B981] font-semibold' : 'text-muted-foreground'}>
                          {notif.fromUserName}
                        </span>{' '}
                        {getNotificationDescription(notif).replace(notif.fromUserName + ' ', '')}
                      </>
                    ) : (
                      getNotificationDescription(notif)
                    )}
                  </p>
                  {notif.targetTitle && (
                    <p className="text-xs text-muted-foreground truncate">
                      → {notif.targetTitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/60">
                    {relativeTime(notif.createdAt)}
                  </p>
                </div>
                {isUnread && (
                  <div className="mt-2 size-2 rounded-full bg-[#10B981] shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}