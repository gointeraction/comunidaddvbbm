'use client';

import { useState, useMemo } from 'react';
import { MOCK_USERS, MOCK_POSTS } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import type { User, ExperienceLevel } from '@/types/autodev';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, UserCheck, MessageSquare, FileText, ChevronRight, Search } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────

const LEVEL_COLORS: Record<ExperienceLevel, string> = {
  principiante: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  intermedio: 'bg-green-500/20 text-green-300 border-green-500/30',
  avanzado: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const AVATAR_COLORS: Record<ExperienceLevel, string> = {
  principiante: 'bg-gray-600',
  intermedio: 'bg-green-700',
  avanzado: 'bg-blue-600',
};

const LEVEL_BADGE_STYLES: Record<ExperienceLevel, string> = {
  principiante: 'bg-gray-700 text-gray-300 border-gray-600',
  intermedio: 'bg-green-900/50 text-green-300 border-green-700',
  avanzado: 'bg-blue-900/50 text-blue-300 border-blue-700',
};

const ROLE_LABELS: Record<string, string> = {
  member: 'Miembro',
  autor: 'Autor',
  moderador: 'Moderador',
  admin: 'Admin',
};

const ROLE_BADGE: Record<string, string> = {
  member: 'bg-secondary text-muted-foreground border-border',
  autor: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30',
  moderador: 'bg-terminal-purple/10 text-terminal-purple border-terminal-purple/30',
  admin: 'bg-terminal-amber/10 text-terminal-amber border-terminal-amber/30',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function relativeDate(dateStr: string) {
  const now = Date.now();
  const d = new Date(dateStr).getTime();
  const diff = now - d;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes}m`;
  if (hours < 24) return `hace ${hours}h`;
  if (days < 30) return `hace ${days}d`;
  if (months < 12) return `hace ${months}m`;
  return `hace ${years}a`;
}

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

const INTEREST_LABELS: Record<string, string> = {
  automatizacion: 'Automatización',
  ia: 'IA',
  webapps: 'WebApps',
  comunidad: 'Comunidad',
};

// ── Component ────────────────────────────────────────────

export default function MembersPage() {
  const { navigate, currentUser, posts } = useAppStore();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<'todos' | ExperienceLevel>('todos');
  const [sortMode, setSortMode] = useState<'recientes' | 'activos' | 'todos'>('recientes');
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  // Merge MOCK_USERS with posts from store
  const allPosts = posts.length > 0 ? posts : MOCK_POSTS;

  const filteredUsers = useMemo(() => {
    let users = MOCK_USERS.filter(u => u.status === 'active');

    // Level filter
    if (levelFilter !== 'todos') {
      users = users.filter(u => u.level === levelFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      users = users.filter(
        u =>
          u.displayName.toLowerCase().includes(q) ||
          u.interests.some(i => INTEREST_LABELS[i]?.toLowerCase().includes(q)) ||
          u.bio.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortMode === 'recientes') {
      users = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortMode === 'activos') {
      users = [...users].sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());
    }

    return users;
  }, [levelFilter, search, sortMode]);

  const activeToday = MOCK_USERS.filter(u => {
    const lastActive = new Date(u.lastActiveAt).getTime();
    const now = Date.now();
    return now - lastActive < 86400000 && u.status === 'active';
  }).length;

  const selectedUser = selectedUid ? MOCK_USERS.find(u => u.uid === selectedUid) ?? null : null;

  const userPosts = useMemo(() => {
    if (!selectedUser) return [];
    return allPosts.filter(p => p.authorId === selectedUser.uid).slice(0, 5);
  }, [selectedUser, allPosts]);

  // ── Profile View ──
  if (selectedUser) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Terminal Header */}
        <div className="terminal-text text-sm">
          <span className="terminal-prompt">autodev</span>{' '}
          <span className="terminal-path">~/miembros/{selectedUser.displayName.toLowerCase().replace(/\s+/g, '-')}</span>
          <span className="animate-blink ml-1">█</span>
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground gap-2"
          onClick={() => setSelectedUid(null)}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        {/* Profile Card */}
        <div className="glass-card rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <div
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full ${AVATAR_COLORS[selectedUser.level]} flex items-center justify-center text-3xl md:text-4xl font-bold text-white shrink-0 shadow-lg`}
            >
              {getInitials(selectedUser.displayName)}
            </div>

            <div className="flex-1 space-y-4 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground truncate">
                  {selectedUser.displayName}
                </h2>
                <Badge className={`${LEVEL_BADGE_STYLES[selectedUser.level]} border text-xs uppercase tracking-wider`}>
                  {selectedUser.level}
                </Badge>
                <Badge className={`${ROLE_BADGE[selectedUser.role]} border text-xs uppercase tracking-wider`}>
                  {ROLE_LABELS[selectedUser.role]}
                </Badge>
                {currentUser?.uid === selectedUser.uid && (
                  <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30 border text-xs">
                    Tú
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-2xl">
                {selectedUser.bio}
              </p>

              {/* Interests */}
              <div className="flex flex-wrap gap-2">
                {selectedUser.interests.map(interest => (
                  <Badge key={interest} variant="outline" className="text-xs border-border text-muted-foreground">
                    {INTEREST_LABELS[interest] ?? interest}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[#10B981] font-bold text-lg">{selectedUser.xp}</span>
                  <span className="text-muted-foreground">XP</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-terminal-green" />
                  <span className="text-foreground font-medium">{selectedUser.postsCount}</span>
                  <span className="text-muted-foreground">posts</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-terminal-purple" />
                  <span className="text-foreground font-medium">{selectedUser.commentsCount}</span>
                  <span className="text-muted-foreground">comentarios</span>
                </div>
                <div className="w-px bg-border" />
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-terminal-amber font-bold text-lg">Nv. {selectedUser.levelNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="terminal-text text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-[#10B981]">$</span> Actividad reciente
          </h3>
          {userPosts.length > 0 ? (
            <div className="space-y-3">
              {userPosts.map(post => (
                <button
                  key={post.postId}
                  className="w-full text-left p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-transparent hover:border-border transition-colors group"
                  onClick={() => navigate('foro-detalle', { postId: post.postId })}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-foreground text-sm font-medium group-hover:text-[#10B981] transition-colors truncate">
                        {post.title}
                      </p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {relativeDate(post.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> {post.commentsCount}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="terminal-comment text-sm py-4 text-center">
              <span className="terminal-text">#</span> Sin posts recientes
            </div>
          )}
        </div>

        {/* Joined */}
        <div className="terminal-text text-xs terminal-comment">
          # Miembro desde {formatShortDate(selectedUser.createdAt)}
        </div>
      </div>
    );
  }

  // ── Members List View ──
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Terminal Header */}
      <div className="terminal-text text-sm">
        <span className="terminal-prompt">autodev</span>{' '}
        <span className="terminal-path">~/miembros</span>
        <span className="animate-blink ml-1">█</span>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2 glass-card rounded-lg px-4 py-2">
          <Users className="h-4 w-4 text-[#10B981]" />
          <span className="text-muted-foreground">Total:</span>
          <span className="text-foreground font-bold">{MOCK_USERS.filter(u => u.status === 'active').length}</span>
        </div>
        <div className="flex items-center gap-2 glass-card rounded-lg px-4 py-2">
          <UserCheck className="h-4 w-4 text-terminal-green" />
          <span className="text-muted-foreground">Activos hoy:</span>
          <span className="text-terminal-green font-bold">{activeToday}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, interés o bio..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border focus:border-[#10B981]/50 font-mono text-sm h-10"
          />
        </div>

        {/* Level + Sort Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Level Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1 terminal-text">Nivel:</span>
            {([
              ['todos', 'Todos'],
              ['principiante', 'Principiante'],
              ['intermedio', 'Intermedio'],
              ['avanzado', 'Avanzado'],
            ] as const).map(([val, label]) => (
              <Button
                key={val}
                variant={levelFilter === val ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-8 px-3 ${
                  levelFilter === val
                    ? 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setLevelFilter(val)}
              >
                {label}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-border hidden sm:block" />

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground mr-1 terminal-text">Ordenar:</span>
            {([
              ['recientes', 'Recientes'],
              ['activos', 'Más activos'],
              ['todos', 'Todos'],
            ] as const).map(([val, label]) => (
              <Button
                key={val}
                variant={sortMode === val ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-8 px-3 ${
                  sortMode === val
                    ? 'bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/20 border border-[#10B981]/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setSortMode(val)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {filteredUsers.map(user => (
          <div
            key={user.uid}
            className={`glass-card rounded-xl p-5 hover:border-[#10B981]/30 transition-all duration-200 group animate-fade-in-up ${
              currentUser?.uid === user.uid ? 'ring-1 ring-[#10B981]/20' : ''
            }`}
          >
            {/* Top row: avatar + name */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-12 h-12 rounded-full ${AVATAR_COLORS[user.level]} flex items-center justify-center text-sm font-bold text-white shrink-0`}
              >
                {getInitials(user.displayName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-foreground font-semibold truncate">
                    {user.displayName}
                  </span>
                  <Badge className={`${LEVEL_BADGE_STYLES[user.level]} border text-[10px] uppercase tracking-wider px-1.5 py-0`}>
                    {user.level}
                  </Badge>
                  {currentUser?.uid === user.uid && (
                    <span className="text-[10px] text-[#10B981] terminal-text">tú</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Se unió {relativeDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Interests */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {user.interests.map(interest => (
                <span
                  key={interest}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border"
                >
                  {INTEREST_LABELS[interest] ?? interest}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span className="text-foreground font-medium">{user.postsCount}</span> posts
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span className="text-foreground font-medium">{user.commentsCount}</span> comentarios
              </span>
            </div>

            {/* Action */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-[#10B981] hover:text-[#10B981] hover:bg-[#10B981]/10 border border-transparent hover:border-[#10B981]/20 gap-1.5"
              onClick={() => setSelectedUid(user.uid)}
            >
              Ver perfil
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground terminal-text text-sm">
            <span className="terminal-comment">#</span> No se encontraron miembros con los filtros actuales
          </p>
        </div>
      )}
    </div>
  );
}