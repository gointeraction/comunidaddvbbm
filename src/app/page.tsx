'use client';

import { useEffect, lazy, Suspense } from 'react';
import { useAppStore } from '@/stores/app-store';
import type { Route } from '@/types/bbmdev';
import LandingPage from '@/components/landing/landing-page';

// Lazy-loaded page components (code splitting)
const AuthPages = lazy(() => import('@/components/auth/auth-pages'));
const OnboardingWizard = lazy(() => import('@/components/onboarding/onboarding-wizard'));
const ForumPage = lazy(() => import('@/components/forum/forum-page'));
const ResourcesPage = lazy(() => import('@/components/resources/resources-page'));
const CoursesPage = lazy(() => import('@/components/courses/courses-page'));
const MembersPage = lazy(() => import('@/components/members/members-page'));
const RankingPage = lazy(() => import('@/components/ranking/ranking-page'));
const GamificationPage = lazy(() => import('@/components/gamification/gamification-page'));
const ProfilePage = lazy(() => import('@/components/profile/profile-page').then(m => ({ default: m.ProfilePage })));
const DirectosPage = lazy(() => import('@/components/directos/directos-page').then(m => ({ default: m.DirectosPage })));
const NotificationsPage = lazy(() => import('@/components/notifications/notifications-page').then(m => ({ default: m.NotificationsPage })));
const RulesPage = lazy(() => import('@/components/rules/rules-page').then(m => ({ default: m.RulesPage })));
const PrivacyPage = lazy(() => import('@/components/privacy/privacy-page').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('@/components/terms/terms-page').then(m => ({ default: m.TermsPage })));
const AdminPage = lazy(() => import('@/components/admin/admin-page').then(m => ({ default: m.AdminPage })));
const AppHeader = lazy(() => import('@/components/layout/app-header').then(m => ({ default: m.AppHeader })));

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center">
        <div className="terminal-text text-sm mb-4">
          <span className="text-[#10B981]">bbmdev</span>{' '}
          <span className="text-gray-500">~/</span>
          <span className="animate-blink text-[#10B981]">▋</span>
        </div>
        <p className="text-xs text-gray-600 terminal-text">Cargando...</p>
      </div>
    </div>
  );
}

const VALID_ROUTES = new Set<string>([
  'login', 'registro', 'recuperar-contrasena', 'onboarding', 'foro',
  'foro-detalle', 'recursos', 'recurso-detalle', 'cursos', 'curso-detalle',
  'leccion', 'directos', 'miembros', 'miembro-perfil', 'ranking', 'perfil',
  'perfil-editar', 'mis-estadisticas', 'gamificacion', 'notificaciones',
  'reglas', 'privacidad', 'terminos', 'admin'
]);

function AppRouter() {
  const { route, isAuthenticated, currentUser, isLoading, initAuth } = useAppStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/^\//, '');
      if (VALID_ROUTES.has(pathname) && pathname !== route) {
        useAppStore.setState({ route: pathname as Route });
      }
    }

    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/^\//, '');
      const targetRoute = VALID_ROUTES.has(pathname) ? (pathname as Route) : 'landing';
      useAppStore.setState({ route: targetRoute });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Only init auth when not on landing page
    if (route !== 'landing') {
      initAuth();
    }
  }, [initAuth, route]);

  // Show landing immediately — no auth check needed
  if (route === 'landing' && !isAuthenticated) {
    return <LandingPage />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Public routes
  if (!isAuthenticated || !currentUser) {
    switch (route) {
      case 'login':
      case 'registro':
      case 'recuperar-contrasena':
        return <Suspense fallback={<LoadingScreen />}><AuthPages /></Suspense>;
      default:
        return <LandingPage />;
    }
  }

  // Onboarding gate
  if (currentUser.status === 'onboarding_pending') {
    return <Suspense fallback={<LoadingScreen />}><OnboardingWizard /></Suspense>;
  }

  // Protected routes
  const routeMap: Record<string, React.ReactNode> = {
    foro: <Suspense fallback={<LoadingScreen />}><ForumPage /></Suspense>,
    'foro-detalle': <Suspense fallback={<LoadingScreen />}><ForumPage /></Suspense>,
    recursos: <Suspense fallback={<LoadingScreen />}><ResourcesPage /></Suspense>,
    'recurso-detalle': <Suspense fallback={<LoadingScreen />}><ResourcesPage /></Suspense>,
    cursos: <Suspense fallback={<LoadingScreen />}><CoursesPage /></Suspense>,
    directos: <Suspense fallback={<LoadingScreen />}><DirectosPage /></Suspense>,
    miembros: <Suspense fallback={<LoadingScreen />}><MembersPage /></Suspense>,
    'miembro-perfil': <Suspense fallback={<LoadingScreen />}><MembersPage /></Suspense>,
    ranking: <Suspense fallback={<LoadingScreen />}><RankingPage /></Suspense>,
    gamificacion: <Suspense fallback={<LoadingScreen />}><GamificationPage /></Suspense>,
    reglas: <Suspense fallback={<LoadingScreen />}><RulesPage /></Suspense>,
    privacidad: <Suspense fallback={<LoadingScreen />}><PrivacyPage /></Suspense>,
    terminos: <Suspense fallback={<LoadingScreen />}><TermsPage /></Suspense>,
    perfil: <Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense>,
    'perfil-editar': <Suspense fallback={<LoadingScreen />}><ProfilePage /></Suspense>,
    notificaciones: <Suspense fallback={<LoadingScreen />}><NotificationsPage /></Suspense>,
    admin: currentUser.role === 'admin' ? <Suspense fallback={<LoadingScreen />}><AdminPage /></Suspense> : <Suspense fallback={<LoadingScreen />}><ForumPage /></Suspense>,
  };

  const pageContent = routeMap[route] || <Suspense fallback={<LoadingScreen />}><ForumPage /></Suspense>;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <AppHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {pageContent}
      </main>
    </div>
  );
}

export default function Home() {
  return <AppRouter />;
}
