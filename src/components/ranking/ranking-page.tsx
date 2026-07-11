'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import type { ExperienceLevel } from '@/types/autodev';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal, Zap, MessageSquare, ThumbsUp, Target, TrendingUp, Rocket } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────

const LEVEL_BADGE_STYLES: Record<ExperienceLevel, string> = {
  principiante: 'bg-gray-700 text-gray-300 border-gray-600',
  intermedio: 'bg-green-900/50 text-green-300 border-green-700',
  avanzado: 'bg-blue-900/50 text-blue-300 border-blue-700',
};

const MEDAL_STYLES: Record<number, { border: string; glow: string; bg: string; text: string; icon: typeof Crown }> = {
  1: { border: 'border-gold/40', glow: 'shadow-gold/10 shadow-lg', bg: 'bg-gold/10', text: 'text-gold', icon: Crown },
  2: { border: 'border-silver/40', glow: 'shadow-silver/10 shadow-lg', bg: 'bg-silver/10', text: 'text-silver', icon: Medal },
  3: { border: 'border-bronze/40', glow: 'shadow-bronze/10 shadow-lg', bg: 'bg-bronze/10', text: 'text-bronze', icon: Medal },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_GRADIENTS: Record<ExperienceLevel, string> = {
  principiante: 'from-gray-600 to-gray-700',
  intermedio: 'from-green-700 to-green-800',
  avanzado: 'from-blue-600 to-blue-700',
};

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  const yearOpts: Intl.DateTimeFormatOptions = { year: 'numeric' };
  const start = monday.toLocaleDateString('es-ES', opts);
  const end = sunday.toLocaleDateString('es-ES', { ...opts, year: 'numeric' });
  return `${start} → ${end}`;
}

// ── Component ────────────────────────────────────────────

export default function RankingPage() {
  const { currentUser, ranking, gamificationConfig } = useAppStore();

  const top3 = useMemo(() => ranking.slice(0, 3), [ranking]);
  const rest = useMemo(() => ranking.slice(3), [ranking]);

  // Reorder for podium: #2, #1, #3
  const podiumOrder = useMemo(() => {
    if (top3.length < 3) return top3;
    return [top3[1], top3[0], top3[2]];
  }, [top3]);

  const podiumSizes = ['md:first', 'md:order-2 md:scale-110 md:z-10', 'md:last'];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Terminal Header */}
      <div className="terminal-text text-sm">
        <span className="terminal-prompt">autodev</span>{' '}
        <span className="terminal-path">~/ranking</span>
        <span className="animate-blink ml-1">█</span>
      </div>

      {/* Period Indicator */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-[#10B981]" />
            <div>
              <p className="text-foreground font-medium text-sm">
                Ranking Semanal
              </p>
              <p className="text-muted-foreground text-xs terminal-text">
                {getWeekRange()}
              </p>
            </div>
          </div>
          <p className="terminal-text text-xs terminal-comment">
            # Se reinicia cada lunes
          </p>
        </div>
      </div>

      {/* XP Rules Panel */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="terminal-text text-sm font-semibold mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-terminal-amber" />
          <span className="text-terminal-amber">Reglas de XP</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* XP Sources */}
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Fuentes de XP</p>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-terminal-green" />
                Post
              </span>
              <span className="text-terminal-green font-bold">+{gamificationConfig.postXP} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-[#10B981]" />
                Tarea
              </span>
              <span className="text-[#10B981] font-bold">+{gamificationConfig.taskXP} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-terminal-purple" />
                Comentario
              </span>
              <span className="text-terminal-purple font-bold">+{gamificationConfig.commentXP} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="text-muted-foreground flex items-center gap-2">
                <ThumbsUp className="h-3.5 w-3.5 text-terminal-amber" />
                Like recibido
              </span>
              <span className="text-terminal-amber font-bold">+{gamificationConfig.likeReceivedXP} XP</span>
            </div>
          </div>

          {/* Weekly Rewards */}
          <div className="space-y-2.5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Recompensas Semanales</p>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="flex items-center gap-2">
                <Crown className="h-3.5 w-3.5 text-gold" />
                <span className="text-foreground">Top 1</span>
              </span>
              <span className="text-gold font-bold">+{gamificationConfig.weeklyRewards.top1} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="flex items-center gap-2">
                <Medal className="h-3.5 w-3.5 text-silver" />
                <span className="text-foreground">Top 2</span>
              </span>
              <span className="text-silver font-bold">+{gamificationConfig.weeklyRewards.top2} XP</span>
            </div>
            <div className="flex items-center justify-between text-sm py-1.5 px-3 rounded-lg bg-secondary/50">
              <span className="flex items-center gap-2">
                <Medal className="h-3.5 w-3.5 text-bronze" />
                <span className="text-foreground">Top 3</span>
              </span>
              <span className="text-bronze font-bold">+{gamificationConfig.weeklyRewards.top3} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {podiumOrder.length >= 3 && (
        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-4 md:gap-6 pt-4">
          {podiumOrder.map((entry, idx) => {
            const style = MEDAL_STYLES[entry.rank];
            const sizeClass = podiumSizes[idx];
            const isCenter = entry.rank === 1;
            const IconComp = style.icon;

            return (
              <div
                key={entry.uid}
                className={`${sizeClass} flex-1 max-w-[280px] w-full transition-transform duration-300`}
              >
                <div
                  className={`glass-card rounded-xl p-5 text-center border ${style.border} ${style.glow} relative`}
                >
                  {/* Rank badge */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${style.bg} rounded-full px-3 py-1 border ${style.border}`}>
                    <span className={`font-bold text-sm ${style.text} flex items-center gap-1`}>
                      {isCenter && <IconComp className="h-4 w-4" />}
                      #{entry.rank}
                    </span>
                  </div>

                  <div className="pt-4 space-y-3">
                    {/* Avatar */}
                    <div className={`mx-auto w-20 h-20 md:${isCenter ? 'w-24 h-24' : 'w-20 h-20'} rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[entry.level]} flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg`}>
                      {getInitials(entry.displayName)}
                    </div>

                    {/* Name */}
                    <div>
                      <p className="text-foreground font-bold text-lg truncate">
                        {entry.displayName}
                      </p>
                      <Badge className={`${LEVEL_BADGE_STYLES[entry.level]} border text-[10px] uppercase tracking-wider mt-1`}>
                        {entry.level}
                      </Badge>
                    </div>

                    {/* XP */}
                    <div className={`text-2xl md:text-3xl font-bold ${style.text} terminal-text`}>
                      {entry.xp} <span className="text-sm text-muted-foreground font-normal">XP</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leaderboard Table */}
      {rest.length > 0 && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="terminal-text text-sm font-semibold flex items-center gap-2">
              <span className="text-[#10B981]">$</span>
              <span className="text-foreground">Leaderboard</span>
            </h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs text-muted-foreground font-medium terminal-text px-4 py-3 w-16">
                    #
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium terminal-text px-4 py-3">
                    Miembro
                  </th>
                  <th className="text-left text-xs text-muted-foreground font-medium terminal-text px-4 py-3 hidden sm:table-cell">
                    Nivel
                  </th>
                  <th className="text-right text-xs text-muted-foreground font-medium terminal-text px-4 py-3 w-24">
                    XP
                  </th>
                </tr>
              </thead>
              <tbody>
                {rest.map((entry, idx) => {
                  const isCurrentUser = currentUser?.uid === entry.uid;
                  return (
                    <tr
                      key={entry.uid}
                      className={`border-b border-border/50 transition-colors ${
                        isCurrentUser
                          ? 'bg-[#10B981]/5'
                          : idx % 2 === 0
                          ? 'bg-transparent'
                          : 'bg-secondary/20'
                      } hover:bg-secondary/40`}
                    >
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${isCurrentUser ? 'text-[#10B981]' : 'text-muted-foreground'} terminal-text`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[entry.level]} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                            {getInitials(entry.displayName)}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-[#10B981]' : 'text-foreground'}`}>
                              {entry.displayName}
                              {isCurrentUser && (
                                <span className="text-xs text-[#10B981] ml-2">(tú)</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge className={`${LEVEL_BADGE_STYLES[entry.level]} border text-[10px] uppercase tracking-wider`}>
                          {entry.level}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-sm font-bold terminal-text ${isCurrentUser ? 'text-[#10B981]' : 'text-foreground'}`}>
                          {entry.xp}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">XP</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center py-6">
        <p className="text-muted-foreground text-sm mb-3 terminal-text">
          <span className="terminal-comment">#</span> Participa activamente para subir en el ranking
        </p>
        <Button className="bg-[#10B981] text-background hover:bg-[#10B981]/90 font-semibold gap-2">
          <Rocket className="h-4 w-4" />
          ¡Sube al top!
        </Button>
      </div>
    </div>
  );
}