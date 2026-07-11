'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import LandingPage from '@/components/landing/landing-page';
import AuthPages from '@/components/auth/auth-pages';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import { AppHeader } from '@/components/layout/app-header';
import ForumPage from '@/components/forum/forum-page';
import ResourcesPage from '@/components/resources/resources-page';
import CoursesPage from '@/components/courses/courses-page';
import MembersPage from '@/components/members/members-page';
import RankingPage from '@/components/ranking/ranking-page';
import GamificationPage from '@/components/gamification/gamification-page';
import { ProfilePage } from '@/components/profile/profile-page';
import { DirectosPage } from '@/components/directos/directos-page';
import { NotificationsPage } from '@/components/notifications/notifications-page';
import { AdminPage } from '@/components/admin/admin-page';

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

function AppRouter() {
  const { route, isAuthenticated, currentUser, isLoading, initAuth } = useAppStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Public routes
  if (!isAuthenticated || !currentUser) {
    switch (route) {
      case 'login':
      case 'registro':
      case 'recuperar-contrasena':
        return <AuthPages />;
      default:
        return <LandingPage />;
    }
  }

  // Onboarding gate
  if (currentUser.status === 'onboarding_pending') {
    return <OnboardingWizard />;
  }

  // Protected routes
  const routeMap: Record<string, React.ReactNode> = {
    foro: <ForumPage />,
    'foro-detalle': <ForumPage />,
    recursos: <ResourcesPage />,
    'recurso-detalle': <ResourcesPage />,
    cursos: <CoursesPage />,
    directos: <DirectosPage />,
    miembros: <MembersPage />,
    'miembro-perfil': <MembersPage />,
    ranking: <RankingPage />,
    gamificacion: <GamificationPage />,
    perfil: <ProfilePage />,
    'perfil-editar': <ProfilePage />,
    notificaciones: <NotificationsPage />,
    admin: currentUser.role === 'admin' ? <AdminPage /> : <ForumPage />,
  };

  const pageContent = routeMap[route] || <ForumPage />;

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
