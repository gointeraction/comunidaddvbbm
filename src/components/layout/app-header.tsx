'use client';

import { useMemo, useEffect } from 'react';
import { Bell, MessageSquare, BookOpen, Package, Radio, Users, Trophy, Shield, Target, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/app-store';
import type { Route } from '@/types/bbmdev';

/* -------------------------------------------------------------------------- */
/*  Navigation links                                                          */
/* -------------------------------------------------------------------------- */

interface NavLink {
  label: string;
  route: Route;
  icon: React.ElementType;
  requiresAuth?: string[]; // Authorized emails (if set, only these can see this link)
}

const NAV_LINKS: NavLink[] = [
  { label: 'foro', route: 'foro', icon: MessageSquare },
  { label: 'cursos', route: 'cursos', icon: BookOpen },
  { label: 'recursos', route: 'recursos', icon: Package },
  { label: 'directos', route: 'directos', icon: Radio, requiresAuth: ['jibohorquez@gmail.com', 'c.moreno.mvv@gmail.com'] },
  { label: 'miembros', route: 'miembros', icon: Users },
  { label: 'ranking', route: 'ranking', icon: Trophy },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
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

/* -------------------------------------------------------------------------- */
/*  AppHeader                                                                 */
/* -------------------------------------------------------------------------- */

export function AppHeader() {
  const {
    isAuthenticated,
    route,
    currentUser,
    unreadCount,
    navigate,
  } = useAppStore();

  const level = currentUser ? getLevelForXP(currentUser.xp) : 1;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const dropdown = document.getElementById('profile-dropdown');
      const menu = document.getElementById('profile-menu');
      if (dropdown && menu && !dropdown.contains(e.target as Node)) {
        menu.classList.add('hidden');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-30 h-14 flex items-center gap-4 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md px-4">
      {/* ── Logo ── */}
      <button
        onClick={() => navigate('foro')}
        className="flex items-center gap-2 shrink-0 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-lg bg-[#10B981]/10 border border-[#10B981]/40 flex items-center justify-center">
          <span className="text-[#10B981] font-bold text-sm font-mono">AD</span>
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-white font-semibold text-sm font-mono tracking-tight">BBMDev_</span>
          <span className="text-gray-500 text-[10px] font-mono uppercase tracking-widest">Community</span>
        </div>
      </button>

      {/* ── Navigation Links ── */}
      <nav className="hidden md:flex items-center gap-1 flex-1">
        {NAV_LINKS.filter(link => {
          // If link requires specific emails, check if current user is authorized
          if (link.requiresAuth && currentUser) {
            return link.requiresAuth.includes(currentUser.email);
          }
          return true;
        }).map((link) => {
          const isActive = route === link.route || route === `${link.route}-detalle`;
          const Icon = link.icon;
          return (
            <button
              key={link.route}
              onClick={() => navigate(link.route)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className="size-3.5" />
              <span className="font-mono text-xs">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Right Section ── */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button
          onClick={() => navigate('notificaciones')}
          className="relative p-1.5 rounded-md text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
          aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
        >
          <Bell className="size-4.5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[9px] leading-none bg-[#EF4444] border-0 text-white rounded-full flex items-center justify-center font-bold">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </button>

        {/* Level & XP indicator */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-xs font-mono text-gray-300">
                Lvl {level} <span className="text-gray-500">•</span> <span className="text-[#10B981]">{currentUser.weeklyXP}xp</span>
              </span>
            </div>
            {/* XP progress bar */}
            <div className="w-16 h-1.5 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#10B981] transition-all"
                style={{ width: `${Math.min((currentUser.weeklyXP / 500) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* User avatar dropdown */}
        {currentUser && (
          <div className="relative" id="profile-dropdown">
            <button
              onClick={() => {
                const el = document.getElementById('profile-dropdown');
                const menu = document.getElementById('profile-menu');
                if (el && menu) {
                  menu.classList.toggle('hidden');
                }
              }}
              className="rounded-full transition-opacity hover:opacity-80 cursor-pointer"
              aria-label="Menu de perfil"
            >
              <Avatar className="size-8 border-2 border-[#10B981]">
                {currentUser.avatarUrl ? (
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
                ) : null}
                <AvatarFallback className="bg-[#10B981] text-white text-xs font-bold font-mono">
                  {getInitials(currentUser.displayName || 'U')}
                </AvatarFallback>
              </Avatar>
            </button>

            {/* Dropdown menu */}
            <div
              id="profile-menu"
              className="hidden absolute right-0 top-full mt-2 w-72 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50"
            >
              {/* User info header */}
              <div className="px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 border-2 border-[#10B981]">
                    {currentUser.avatarUrl ? (
                      <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
                    ) : null}
                    <AvatarFallback className="bg-[#10B981] text-white text-sm font-bold font-mono">
                      {getInitials(currentUser.displayName || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{currentUser.displayName}</p>
                    <p className="text-xs text-gray-500 truncate font-mono">{currentUser.email}</p>
                  </div>
                </div>

                {/* Level info */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-mono text-[#10B981]">Lvl {level}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-400">
                    {level <= 3 ? 'Novato' : level <= 7 ? 'Explorador' : level <= 11 ? 'Experto' : 'Maestro'}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">{currentUser.xp} XP</span>
                </div>

                {/* XP progress bar */}
                <div className="mt-2">
                  <div className="w-full h-1.5 rounded-full bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#10B981] transition-all"
                      style={{ width: `${Math.min((currentUser.xp / ((level + 1) * 500)) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1 font-mono">
                    {Math.max(0, ((level + 1) * 500) - currentUser.xp)} XP para Lvl {level + 1}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2">
                <button
                  onClick={() => { navigate('perfil'); document.getElementById('profile-menu')?.classList.add('hidden'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-gray-500">👤</span> Mi Perfil
                </button>
                <button
                  onClick={() => { navigate('perfil'); document.getElementById('profile-menu')?.classList.add('hidden'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-gray-500">📊</span> Mis Estadisticas
                </button>
                <button
                  onClick={() => { navigate('ranking'); document.getElementById('profile-menu')?.classList.add('hidden'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-gray-500">🏆</span> Ranking
                </button>
                <button
                  onClick={() => { navigate('perfil-editar'); document.getElementById('profile-menu')?.classList.add('hidden'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span className="text-gray-500">⚙️</span> Configuracion
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-white/10 py-2">
                <button
                  onClick={async () => { await useAppStore.getState().logout(); document.getElementById('profile-menu')?.classList.add('hidden'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <span className="text-red-500">🚪</span> logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
