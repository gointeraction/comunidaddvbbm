'use client';

import { useMemo } from 'react';
import {
  MessageSquare,
  Package,
  GraduationCap,
  Radio,
  Users,
  Trophy,
  Target,
  User,
  Bell,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  Terminal,
  PanelLeftClose,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/app-store';
import type { Route } from '@/types/autodev';

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface NavItem {
  label: string;
  route: Route;
  icon: React.ComponentType<{ className?: string }>;
  prefixMatch?: boolean;
}

interface BottomNavItem {
  label: string;
  route?: Route;
  icon: React.ComponentType<{ className?: string }>;
  action?: () => void;
  adminOnly?: boolean;
  badge?: () => React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Navigation config                                                         */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS: NavItem[] = [
  { label: 'Foro', route: 'foro', icon: MessageSquare, prefixMatch: true },
  { label: 'Recursos', route: 'recursos', icon: Package, prefixMatch: true },
  { label: 'Cursos', route: 'cursos', icon: GraduationCap, prefixMatch: true },
  { label: 'Directos', route: 'directos', icon: Radio },
  { label: 'Miembros', route: 'miembros', icon: Users, prefixMatch: true },
  { label: 'Ranking', route: 'ranking', icon: Trophy },
  { label: 'Gamificación', route: 'gamificacion', icon: Target },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function isActive(currentRoute: Route, itemRoute: Route, prefixMatch?: boolean): boolean {
  if (prefixMatch) {
    return currentRoute === itemRoute || currentRoute.startsWith(itemRoute + '-');
  }
  return currentRoute === itemRoute;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function levelLabel(levelNumber: number): string {
  if (levelNumber >= 20) return 'Leyenda';
  if (levelNumber >= 15) return 'Élite';
  if (levelNumber >= 10) return 'Veterano';
  if (levelNumber >= 5) return 'Avanzado';
  return 'Novato';
}

/* -------------------------------------------------------------------------- */
/*  Sidebar content (shared between desktop & mobile)                         */
/* -------------------------------------------------------------------------- */

function SidebarContent() {
  const { route, navigate, currentUser, unreadCount, logout, toggleSidebar } = useAppStore();

  const bottomItems: BottomNavItem[] = useMemo(() => {
    const items: BottomNavItem[] = [
      {
        label: 'Perfil',
        route: 'perfil',
        icon: User,
      },
      {
        label: 'Notificaciones',
        route: 'notificaciones',
        icon: Bell,
        badge: () =>
          unreadCount > 0 ? (
            <Badge className="ml-auto h-5 min-w-5 px-1.5 text-[10px] bg-terminal-red border-0 text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          ) : null,
      },
    ];
    if (currentUser?.role === 'admin') {
      items.push({
        label: 'Admin',
        route: 'admin',
        icon: Settings,
      });
    }
    items.push({
      label: 'Cerrar sesión',
      icon: LogOut,
      action: logout,
    });
    return items;
  }, [currentUser?.role, unreadCount, logout]);

  const handleNavClick = (item: NavItem | BottomNavItem) => {
    if ('action' in item && item.action) {
      item.action();
    } else if ('route' in item && item.route) {
      navigate(item.route);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* ── Logo / Brand ── */}
      <div className="flex-shrink-0 px-4 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-900 border border-[#10B981]/40 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.25)]">
            <Terminal className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="terminal-text text-sm leading-relaxed">
            <span className="text-[#10B981] font-semibold">~/</span>
            <span className="text-gray-100">bbmdev</span>
            <span className="animate-blink text-[#10B981]">▋</span>
          </div>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-100 hover:bg-white/5 transition-colors cursor-pointer"
          title="Ocultar menú lateral"
          aria-label="Ocultar menú lateral"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      <Separator className="bg-white/10" />

      {/* ── Current user info ── */}
      {currentUser && (
        <div className="flex-shrink-0 px-4 py-3">
          <button
            onClick={() => navigate('perfil')}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-white/5"
          >
            <Avatar className="size-9 border border-white/10">
              {currentUser.avatarUrl ? (
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.displayName} />
              ) : null}
              <AvatarFallback className="bg-[#10B981]/15 text-[#10B981] text-xs font-semibold">
                {getInitials(currentUser.displayName || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-100 truncate">
                {currentUser.displayName || 'Usuario'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Zap className="size-3 text-[#FBBF24]" />
                <span className="terminal-text">{currentUser.xp.toLocaleString()} XP</span>
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] border-[#10B981]/30 text-[#10B981]"
                >
                  Lv.{currentUser.levelNumber} {levelLabel(currentUser.levelNumber)}
                </Badge>
              </div>
            </div>
          </button>
        </div>
      )}

      <Separator className="bg-white/10" />

      {/* ── Main Navigation ── */}
      <ScrollArea className="flex-1 px-2 py-2 custom-scrollbar">
        <nav className="flex flex-col gap-0.5" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => {
            const active = isActive(route, item.route, item.prefixMatch);
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => navigate(item.route)}
                className={`
                  group relative flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-white/5 text-[#10B981]'
                      : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                {/* Left accent border for active */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#10B981]" />
                )}
                <Icon className={`size-4 shrink-0 ${active ? 'text-[#10B981]' : ''}`} />
                <span className="truncate">{item.label}</span>
                <ChevronRight
                  className={`ml-auto size-3 opacity-0 transition-opacity group-hover:opacity-50 ${active ? 'opacity-50' : ''}`}
                />
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-white/10" />

      {/* ── Bottom Section ── */}
      <div className="flex-shrink-0 px-2 py-2">
        <nav className="flex flex-col gap-0.5" aria-label="Acciones de usuario">
          {bottomItems.map((item) => {
            const active = item.route ? isActive(route, item.route) : false;
            const Icon = item.icon;
            const isLogout = item.label === 'Cerrar sesión';

            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item)}
                className={`
                  group relative flex items-center gap-3 rounded-lg px-3 py-2.5
                  text-sm font-medium transition-colors
                  ${
                    active
                      ? 'bg-white/5 text-[#10B981]'
                      : isLogout
                        ? 'text-terminal-red/70 hover:bg-terminal-red/10 hover:text-terminal-red'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-100'
                  }
                `}
                aria-current={active ? 'page' : undefined}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-[#10B981]" />
                )}
                <Icon className={`size-4 shrink-0 ${active ? 'text-[#10B981]' : ''}`} />
                <span className="truncate">{item.label}</span>
                {item.badge && item.badge()}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Sidebar Export                                                       */
/* -------------------------------------------------------------------------- */

export function AppSidebar() {
  const { isAuthenticated, sidebarOpen, setSidebarOpen } = useAppStore();

  if (!isAuthenticated) return null;

  return (
    <>
      {/* ── Desktop: Fixed sidebar ── */}
      <aside
        className={`
          hidden md:flex flex-col fixed inset-y-0 left-0 z-40
          w-[260px] border-r border-white/10
          bg-[#030712] transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Sidebar"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile: Sheet ── */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-[280px] bg-[#030712] border-r border-white/10 p-0"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navegación</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Spacer so page content doesn't overlap desktop sidebar */}
      <div
        className={`
          hidden md:block flex-shrink-0
          transition-all duration-300
          ${sidebarOpen ? 'w-[260px]' : 'w-0'}
        `}
      />
    </>
  );
}