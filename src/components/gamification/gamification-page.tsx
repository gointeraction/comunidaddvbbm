'use client';

import { useState, useMemo } from 'react';
import { MOCK_MISSIONS, MOCK_ACHIEVEMENTS, MOCK_USER_ACHIEVEMENTS } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import type { Achievement, AchievementRarity } from '@/types/autodev';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Zap, CheckCircle2, Circle, Lock, Trophy, ChevronDown, ChevronUp,
  Star, Shield, Flame, Gem, ScrollText, Target,
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────

const RARITY_CONFIG: Record<AchievementRarity, { label: string; cssClass: string; bgClass: string; gradient: string; icon: typeof Star }> = {
  common: { label: 'Común', cssClass: 'rarity-common', bgClass: 'rarity-bg-common', gradient: 'from-gray-500 to-gray-600', icon: Star },
  rare: { label: 'Raro', cssClass: 'rarity-rare', bgClass: 'rarity-bg-rare', gradient: 'from-blue-500 to-blue-600', icon: Shield },
  epic: { label: 'Épico', cssClass: 'rarity-epic', bgClass: 'rarity-bg-epic', gradient: 'from-purple-500 to-purple-600', icon: Flame },
  legendary: { label: 'Legendario', cssClass: 'rarity-legendary', bgClass: 'rarity-bg-legendary', gradient: 'from-amber-400 to-amber-600', icon: Gem },
};

const ACHIEVEMENT_ICONS: Record<string, string> = {
  FIRST_POST: '📝',
  COMMENTER_10: '💬',
  TOP_10_WEEKLY: '🏆',
  ACTIVE_30: '🔥',
  RESOURCE_AUTHOR: '📦',
  MENTOR: '🧠',
  WEEKLY_CHAMPION: '👑',
  COURSE_MASTER: '🎓',
};

function relativeDate(dateStr: string) {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'hoy';
  if (days === 1) return 'ayer';
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  return `hace ${months} mes${months > 1 ? 'es' : ''}`;
}

function getXPForLevel(level: number): number {
  return level * 500;
}

// ── Component ────────────────────────────────────────────

export default function GamificationPage() {
  const { currentUser } = useAppStore();
  const [achievementFilter, setAchievementFilter] = useState<'todos' | 'desbloqueados' | AchievementRarity>('todos');
  const [completedExpanded, setCompletedExpanded] = useState(false);

  // Current user data (fallback)
  const user = currentUser ?? {
    xp: 0,
    levelNumber: 1,
  };

  const currentLevelXP = getXPForLevel(user.levelNumber);
  const nextLevelXP = getXPForLevel(user.levelNumber + 1);
  const xpInLevel = user.xp - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  const progressPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  // Missions
  const activeMissions = useMemo(() => MOCK_MISSIONS.filter(m => !m.completed), []);
  const completedMissions = useMemo(() => MOCK_MISSIONS.filter(m => m.completed), []);

  // Achievements
  const unlockedIds = useMemo(
    () => new Set(MOCK_USER_ACHIEVEMENTS.map(ua => ua.achievementId)),
    []
  );

  const filteredAchievements = useMemo(() => {
    let list = MOCK_ACHIEVEMENTS;

    if (achievementFilter === 'desbloqueados') {
      list = list.filter(a => unlockedIds.has(a.achievementId));
    } else if (achievementFilter !== 'todos') {
      list = list.filter(a => a.rarity === achievementFilter);
    }

    // Sort: unlocked first, then by rarity
    return [...list].sort((a, b) => {
      const aUnlocked = unlockedIds.has(a.achievementId) ? 0 : 1;
      const bUnlocked = unlockedIds.has(b.achievementId) ? 0 : 1;
      if (aUnlocked !== bUnlocked) return aUnlocked - bUnlocked;
      const rarityOrder: Record<AchievementRarity, number> = { legendary: 0, epic: 1, rare: 2, common: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });
  }, [achievementFilter, unlockedIds]);

  const unlockedCount = unlockedIds.size;
  const totalCount = MOCK_ACHIEVEMENTS.length;

  // Achievement filter tabs
  const filterTabs: Array<{ value: 'todos' | 'desbloqueados' | AchievementRarity; label: string }> = [
    { value: 'todos', label: 'Todos' },
    { value: 'desbloqueados', label: 'Desbloqueados' },
    { value: 'common', label: 'Comunes' },
    { value: 'rare', label: 'Raros' },
    { value: 'epic', label: 'Épicos' },
    { value: 'legendary', label: 'Legendarios' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Terminal Header */}
      <div className="terminal-text text-sm">
        <span className="terminal-prompt">autodev</span>{' '}
        <span className="terminal-path">~/gamificacion</span>
        <span className="animate-blink ml-1">█</span>
      </div>

      {/* XP Progress Panel */}
      <div className="glass-card rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {/* Level Circle */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(30,41,59,0.8)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke="#10B981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#10B981] terminal-text">{user.levelNumber}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Nivel</span>
              </div>
            </div>
          </div>

          {/* XP Bar + Info */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-terminal-amber" />
                Progreso de Nivel
              </h3>
              <span className="terminal-text text-sm text-muted-foreground">
                <span className="text-[#10B981] font-bold">{user.xp}</span> XP total
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Nivel {user.levelNumber}</span>
                <span>Nivel {user.levelNumber + 1}</span>
              </div>
              <Progress value={progressPercent} className="h-3 bg-secondary [&>div]:bg-[#10B981]" />
            </div>

            <p className="text-sm text-muted-foreground">
              Necesitas <span className="text-[#10B981] font-bold">{xpNeeded - xpInLevel} XP</span> más para el nivel{' '}
              <span className="text-foreground font-medium">{user.levelNumber + 1}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Active Missions */}
      <div className="space-y-3">
        <h3 className="terminal-text text-sm font-semibold flex items-center gap-2">
          <Target className="h-4 w-4 text-terminal-green" />
          <span className="text-terminal-green">Misiones Activas</span>
          <span className="text-xs text-muted-foreground font-normal ml-1">({activeMissions.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMissions.map(mission => {
            const totalTasks = mission.tasks.length;
            const completedTasks = mission.tasks.reduce((acc, t) => {
              const progress = mission.progress[t.id] ?? 0;
              return acc + Math.min(progress, t.target);
            }, 0);
            const allDone = completedTasks >= totalTasks;

            return (
              <div
                key={mission.missionId}
                className={`glass-card rounded-xl p-5 border transition-colors ${
                  allDone
                    ? 'border-terminal-green/30 bg-terminal-green/5'
                    : 'border-border hover:border-[#10B981]/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-foreground font-semibold text-sm truncate">{mission.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{mission.description}</p>
                  </div>
                  <Badge className="bg-terminal-amber/10 text-terminal-amber border-terminal-amber/30 border text-xs shrink-0">
                    +{mission.xpReward} XP
                  </Badge>
                </div>

                {/* Task list */}
                <div className="space-y-2">
                  {mission.tasks.map(task => {
                    const progress = mission.progress[task.id] ?? 0;
                    const isDone = progress >= task.target;
                    const taskPercent = Math.min(100, Math.round((progress / task.target) * 100));

                    return (
                      <div key={task.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className={`flex items-center gap-1.5 ${isDone ? 'text-terminal-green' : 'text-muted-foreground'}`}>
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Circle className="h-3.5 w-3.5" />
                            )}
                            {task.label}
                          </span>
                          <span className="terminal-text text-muted-foreground">
                            {progress}/{task.target}
                          </span>
                        </div>
                        {!isDone && (
                          <Progress value={taskPercent} className="h-1.5 bg-secondary [&>div]:bg-[#10B981]/60" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Status */}
                {allDone && (
                  <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-terminal-green font-medium bg-terminal-green/10 rounded-lg py-1.5 border border-terminal-green/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Misión completada
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activeMissions.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <Target className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground terminal-text">
              <span className="terminal-comment">#</span> No hay misiones activas
            </p>
          </div>
        )}
      </div>

      {/* Completed Missions */}
      {completedMissions.length > 0 && (
        <div className="space-y-3">
          <button
            className="flex items-center gap-2 text-sm w-full text-left group"
            onClick={() => setCompletedExpanded(!completedExpanded)}
          >
            <CheckCircle2 className="h-4 w-4 text-terminal-green/60" />
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Misiones Completadas
            </span>
            <Badge variant="secondary" className="text-xs">{completedMissions.length}</Badge>
            {completedExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground ml-auto" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
            )}
          </button>

          {completedExpanded && (
            <div className="space-y-2 animate-fade-in-up">
              {completedMissions.map(mission => (
                <div
                  key={mission.missionId}
                  className="glass-card rounded-lg p-3 flex items-center justify-between opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-terminal-green/60 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground/80 font-medium">{mission.title}</p>
                      <p className="text-xs text-muted-foreground">+{mission.xpReward} XP</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground terminal-text">
                    {mission.completedAt ? relativeDate(mission.completedAt) : ''}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Achievements */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="terminal-text text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4 text-terminal-amber" />
            <span className="text-terminal-amber">Logros</span>
            <span className="text-xs text-muted-foreground font-normal ml-1">
              ({unlockedCount}/{totalCount})
            </span>
          </h3>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {filterTabs.map(tab => {
            const isActive = achievementFilter === tab.value;
            return (
              <Button
                key={tab.value}
                variant="ghost"
                size="sm"
                className={`text-xs h-8 px-3 ${
                  isActive
                    ? 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/30'
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                }`}
                onClick={() => setAchievementFilter(tab.value)}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filteredAchievements.map(achievement => {
            const isUnlocked = unlockedIds.has(achievement.achievementId);
            const userAch = isUnlocked
              ? MOCK_USER_ACHIEVEMENTS.find(ua => ua.achievementId === achievement.achievementId)
              : null;
            const rarity = RARITY_CONFIG[achievement.rarity];

            return (
              <div
                key={achievement.achievementId}
                className={`glass-card rounded-xl p-4 transition-all duration-200 animate-fade-in-up ${
                  isUnlocked
                    ? `border-2 ${rarity.cssClass} hover:scale-[1.02]`
                    : 'border-border opacity-50 hover:opacity-70'
                }`}
              >
                {/* Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked
                        ? `bg-gradient-to-br ${rarity.gradient} shadow-lg`
                        : 'bg-secondary'
                    }`}
                  >
                    {isUnlocked ? (
                      <span>{ACHIEVEMENT_ICONS[achievement.code] ?? '🏅'}</span>
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Badge
                      className={`${rarity.cssClass} ${rarity.bgClass} border text-[10px] uppercase tracking-wider mb-1`}
                    >
                      {rarity.label}
                    </Badge>
                    <h4 className={`text-sm font-semibold truncate ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h4>
                  </div>
                </div>

                {/* Description */}
                <p className={`text-xs mb-3 ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                  {achievement.description}
                </p>

                {/* Status */}
                {isUnlocked && userAch ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-terminal-green flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Desbloqueado
                    </span>
                    <span className="text-muted-foreground terminal-text">
                      {relativeDate(userAch.unlockedAt)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    <Lock className="h-3 w-3" />
                    Bloqueado
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="glass-card rounded-xl p-8 text-center">
            <Trophy className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground terminal-text">
              <span className="terminal-comment">#</span> No se encontraron logros con este filtro
            </p>
          </div>
        )}
      </div>
    </div>
  );
}