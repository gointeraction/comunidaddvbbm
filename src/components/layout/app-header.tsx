'use client';

import { useMemo } from 'react';
import { Menu, Bell, Zap, ChevronRight, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/app-store';
import type { Route } from '@/types/autodev';

/* -------------------------------------------------------------------------- */
/*  Route → breadcrumb path mapping                                           */
/* -------------------------------------------------------------------------- */

interface RoutePathEntry {
  label: string;
  paramKey?: string;
}

const ROUTE_PATHS: Partial<Record<Route, RoutePathEntry[]>> = {
  foro: [{ label: 'foro' }],
  'foro-detalle': [
    { label: 'foro' },
    { label: 'post', paramKey: 'postId' },
  ],
  recursos: [{ label: 'recursos' }],
  'recurso-detalle': [
    { label: 'recursos' },
    { label: 'recurso', paramKey: 'resourceId' },
  ],
  cursos: [{ label: 'cursos' }],
  'curso-detalle': [
    { label: 'cursos' },
    { label: 'curso', paramKey: 'courseId' },
  ],
  leccion: [
    { label: 'cursos' },
    { label: 'leccion', paramKey: 'lessonId' },
  ],
  directos: [{ label: 'directos' }],
  miembros: [{ label: 'miembros' }],
  'miembro-perfil': [
    { label: 'miembros' },
    { label: 'perfil', paramKey: 'uid' },
  ],
  ranking: [{ label: 'ranking' }],
  gamificacion: [{ label: 'gamificacion' }],
  perfil: [{ label: 'perfil' }],
  'perfil-editar': [{ label: 'perfil' }, { label: 'editar' }],
  'mis-estadisticas': [{ label: 'perfil' }, { label: 'estadisticas' }],
  notificaciones: [{ label: 'notificaciones' }],
  admin: [{ label: 'admin' }],
};

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

/* -------------------------------------------------------------------------- */
/*  AppHeader                                                                 */
/* -------------------------------------------------------------------------- */

export function AppHeader() {
  const {
    isAuthenticated,
    route,
    routeParams,
    currentUser,
    unreadCount,
    navigate,
    toggleSidebar,
  } = useAppStore();

  const breadcrumbSegments = useMemo(() => {
    const entries = ROUTE_PATHS[route];
    if (!entries) return [];
    return entries.map(entry => {
      const suffix = entry.paramKey ? `/${routeParams[entry.paramKey] || ''}` : '';
      return `${entry.label}${suffix}`;
    });
  }, [route, routeParams]);

  if (!isAuthenticated) return null;

  return (
    <header
      className={`
        sticky top-0 z-30 flex h-14 items-center gap-3
        border-b border-white/10 bg-gray-950/85 backdrop-blur-md px-4
      `}
    >
      {/* ── Mobile hamburger ── */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden size-8 text-gray-400 hover:text-gray-100"
        onClick={toggleSidebar}
        aria-label="Abrir menú"
      >
        <Menu className="size-5" />
      </Button>

      {/* ── Logo (mobile) ── */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-7 h-7 rounded-lg bg-gray-900 border border-[#10B981]/40 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.25)]">
          <Terminal className="w-3.5 h-3.5 text-[#10B981]" />
        </div>
      </div>

      {/* ── Breadcrumb route path ── */}
      <div className="terminal-text hidden md:flex items-center gap-1.5 min-w-0 flex-1">
        <span className="text-[#10B981] font-semibold text-sm">$</span>
        <span className="text-[#10B981] font-semibold text-sm">bbmdev</span>
        <span className="text-gray-500">~</span>
        <span className="text-[#34D399] text-sm truncate">
          /{breadcrumbSegments.join('/')}
        </span>
        <span className="animate-blink text-[#10B981] text-sm hidden sm:inline">▊</span>
      </div>

      {/* ── Right section ── */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative size-8 text-gray-400 hover:text-gray-100"
          onClick={() => navigate('notificaciones')}
          aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} sin leer)` : ''}`}
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[10px] leading-none bg-terminal-red border-0 text-white rounded-full flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>

        <Separator orientation="vertical" className="h-5 bg-white/10" />

        {/* XP badge */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 px-2 py-1 rounded-lg bg-gray-950/80 border border-white/10">
            <Zap className="size-3 text-[#FBBF24]" />
            <span className="terminal-text">{currentUser.xp.toLocaleString()} XP</span>
          </div>
        )}

        {/* User avatar */}
        {currentUser && (
          <button
            onClick={() => navigate('perfil')}
            className="rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#10B981] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
            aria-label="Ir a perfil"
          >
            <Avatar className="size-7 border border-white/10">
              {currentUser.avatarUrl ? (
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
              ) : null}
              <AvatarFallback className="bg-[#10B981]/15 text-[#10B981] text-[10px] font-semibold">
                {getInitials(currentUser.displayName || 'U')}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
      </div>
    </header>
  );
}