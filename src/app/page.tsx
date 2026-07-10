'use client';

import { useAppStore } from '@/stores/app-store';
import LandingPage from '@/components/landing/landing-page';
import AuthPages from '@/components/auth/auth-pages';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import { AppSidebar as Sidebar } from '@/components/layout/sidebar';
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

function AppRouter() {
  const { route, isAuthenticated, currentUser } = useAppStore();

  // ── Public routes (no auth required) ──────────────
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

  // ── Onboarding gate ───────────────────────────────
  if (currentUser.status === 'onboarding_pending') {
    return <OnboardingWizard />;
  }

  // ── Protected routes (auth + active required) ─────
  const routeMap: Record<string, React.ReactNode> = {
    foro: <ForumPage />,
    'foro-detalle': <ForumPage />,
    recursos: <ResourcesPage />,
    cursos: <CoursesPage />,
    directos: <DirectosPage />,
    miembros: <MembersPage />,
    ranking: <RankingPage />,
    gamificacion: <GamificationPage />,
    perfil: <ProfilePage />,
    'perfil-editar': <ProfilePage />,
    notificaciones: <NotificationsPage />,
    admin: currentUser.role === 'admin' ? <AdminPage /> : <ForumPage />,
  };

  const pageContent = routeMap[route] || <ForumPage />;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {pageContent}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return <AppRouter />;
}