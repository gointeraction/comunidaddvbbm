'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Trophy, Crown, Medal, MessageSquare, ThumbsUp, Target, Rocket, Zap } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────
function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function getLevelForXP(xp: number): number {
  if (xp >= 5000) return 15;
  if (xp >= 4000) return 13;
  if (xp >= 3000) return 11;
  if (xp >= 2000) return 9;
  if (xp >= 1000) return 7;
  if (xp >= 500) return 5;
  if (xp >= 200) return 3;
  if (xp >= 50) return 2;
  return 1;
}

function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return `${monday.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} → ${sunday.toLocaleDateString('es-ES', opts)}`;
}

// ── Component ────────────────────────────────────────────
export default function RankingPage() {
  const { currentUser, users, gamificationConfig } = useAppStore();
  const userLevel = currentUser ? getLevelForXP(currentUser.xp) : 1;

  const ranking = useMemo(() => {
    return [...users]
      .sort((a, b) => (b.weeklyXP || 0) - (a.weeklyXP || 0))
      .map((user, idx) => ({
        uid: user.uid,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        xp: user.weeklyXP || 0,
        rank: idx + 1,
        level: user.level,
        postsCount: user.postsCount || 0,
        commentsCount: user.commentsCount || 0,
      }));
  }, [users]);

  const userRank = currentUser ? ranking.find(r => r.uid === currentUser.uid) : null;

  const top3 = useMemo(() => ranking.slice(0, 3), [ranking]);
  const rest = useMemo(() => ranking.slice(3), [ranking]);

  // Reorder for podium: #2, #1, #3
  const podiumOrder = useMemo(() => {
    if (top3.length < 3) return top3;
    return [top3[1], top3[0], top3[2]];
  }, [top3]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="font-mono text-xs text-gray-500 flex items-center gap-2">
            <span className="text-[#10B981]">$</span> bbmdev leaderboard --week
            <span className="animate-blink text-[#10B981]">▋</span>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" />
            <h1 className="text-2xl font-bold text-white">Leaderboard Semanal</h1>
          </div>
          <p className="text-sm text-gray-500">Compite con la comunidad · {getWeekRange()}</p>
        </div>
        {/* User position badge */}
        {userRank && (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] font-mono text-gray-500">posicion</p>
              <p className="text-2xl font-bold text-[#10B981]">#{userRank.rank}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-gray-500">XP</p>
              <p className="text-2xl font-bold text-[#10B981]">{currentUser?.weeklyXP || 0}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Podium + List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Podium */}
          {podiumOrder.length > 0 && (
            <div className="flex items-end justify-center gap-4 pt-4">
              {podiumOrder.map((entry) => {
                const isCenter = entry.rank === 1;
                const medalColors: Record<number, { bg: string; border: string; text: string; glow: string }> = {
                  1: { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-400', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]' },
                  2: { bg: 'bg-gray-400', border: 'border-gray-300', text: 'text-gray-300', glow: 'shadow-[0_0_15px_rgba(156,163,175,0.2)]' },
                  3: { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-500', glow: 'shadow-[0_0_15px_rgba(217,119,6,0.2)]' },
                };
                const mc = medalColors[entry.rank] || medalColors[3];

                return (
                  <div key={entry.uid} className={`flex-1 max-w-[220px] ${isCenter ? 'mb-4' : ''}`}>
                    {/* Medal badge */}
                    <div className="flex justify-center mb-2">
                      <div className={`w-8 h-8 rounded-full ${mc.bg} flex items-center justify-center text-xs font-bold text-black`}>
                        {entry.rank}
                      </div>
                    </div>
                    {/* Avatar */}
                    <div className={`mx-auto ${isCenter ? 'w-28 h-28' : 'w-20 h-20'} rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center ${mc.glow} border-2 ${mc.border}`}>
                      <span className={`${isCenter ? 'text-3xl' : 'text-xl'} font-bold text-white`}>{getInitials(entry.displayName)}</span>
                    </div>
                    {/* Name */}
                    <p className="text-center text-sm font-semibold text-white mt-2 truncate">{entry.displayName}</p>
                    {/* XP */}
                    <div className={`mt-3 border border-white/10 rounded-lg p-3 text-center ${isCenter ? 'border-yellow-400/40 bg-yellow-400/5' : 'bg-white/5'}`}>
                      <p className={`text-xl font-bold ${mc.text}`}>{entry.xp}</p>
                      <p className="text-[10px] font-mono text-gray-500">XP</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Ranking List */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-[#10B981]">🏆</span>
                <span className="font-mono text-sm text-white">$ ls <span className="text-gray-500">--rank</span></span>
              </div>
              <span className="text-[10px] font-mono text-gray-600">reset: lunes</span>
            </div>

            <div className="divide-y divide-white/5">
              {rest.map((entry, idx) => {
                const isCurrentUser = currentUser?.uid === entry.uid;
                const level = getLevelForXP(entry.xp);
                return (
                  <div key={entry.uid} className={`flex items-center gap-4 px-4 py-3 ${isCurrentUser ? 'bg-[#10B981]/5' : idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'} hover:bg-white/5 transition-colors`}>
                    {/* Rank */}
                    <span className={`w-8 text-center font-bold text-sm ${entry.rank <= 3 ? 'text-[#10B981]' : 'text-gray-500'}`}>{entry.rank}</span>
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-white">{getInitials(entry.displayName)}</span>
                    </div>
                    {/* Name + Level */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{entry.displayName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">Nv.{level}</span>
                      </div>
                      {/* Stats */}
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <MessageSquare className="size-2.5" /> {entry.postsCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <MessageSquare className="size-2.5" /> {entry.commentsCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <ThumbsUp className="size-2.5" /> 0
                        </span>
                      </div>
                    </div>
                    {/* XP Bar */}
                    <div className="w-32 hidden sm:block">
                      <div className="w-full h-1.5 rounded-full bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-[#10B981] transition-all" style={{ width: `${Math.min((entry.xp / (top3[0]?.xp || 1)) * 100, 100)}%` }} />
                      </div>
                    </div>
                    {/* XP */}
                    <span className="text-sm font-bold text-[#10B981] w-12 text-right">{entry.xp}</span>
                    <span className="text-[10px] text-gray-500">XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* XP Rules */}
          <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <span className="font-mono text-sm text-white flex items-center gap-2">
                <span className="text-green-500">⊙</span> $ man xp
              </span>
            </div>
            <div className="divide-y divide-white/5">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2"><MessageSquare className="size-3.5 text-[#10B981]" /> crear post</span>
                <span className="text-sm font-mono text-[#10B981]">+{gamificationConfig.postXP}</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2"><MessageSquare className="size-3.5 text-[#10B981]" /> comentar</span>
                <span className="text-sm font-mono text-[#10B981]">+{gamificationConfig.commentXP}</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2"><Target className="size-3.5 text-[#10B981]" /> completar leccion</span>
                <span className="text-sm font-mono text-[#10B981]">+{gamificationConfig.taskXP}</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2"><Zap className="size-3.5 text-yellow-500" /> ganar badge</span>
                <span className="text-sm font-mono text-yellow-500">+$var</span>
              </div>
            </div>
          </div>

          {/* Weekly Rewards */}
          <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/10">
              <span className="text-xs font-mono text-gray-500">{'// premios semanales'}</span>
            </div>
            <div className="divide-y divide-white/5">
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-300 flex items-center gap-2">🏆 puesto 1</span>
                <span className="text-sm font-mono text-[#10B981]">+{gamificationConfig.weeklyRewards.top1} XP</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-300 flex items-center gap-2">🥈 top 3</span>
                <span className="text-sm font-mono text-[#10B981]">+{gamificationConfig.weeklyRewards.top2} XP</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm text-gray-300 flex items-center gap-2">🥉 top 10</span>
                <span className="text-sm font-mono text-[#10B981]">+{gamificationConfig.weeklyRewards.top3} XP</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="border border-[#10B981]/30 rounded-xl bg-[#10B981]/5 p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-3">
              <Rocket className="text-[#10B981]" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">{'¡sube al top!'}</h3>
            <p className="text-[10px] text-gray-500 mb-4">Participa activamente y gana XP para aparecer en el leaderboard.</p>
            <button className="w-full py-2.5 bg-[#10B981] text-gray-950 rounded-lg text-sm font-mono font-semibold hover:bg-[#34D399] transition-colors cursor-pointer shadow-[0_0_22px_rgba(16,185,129,0.3)]">
              {'>'} ir al foro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
