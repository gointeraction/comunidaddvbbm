import { create } from 'zustand';
import type {
  Route,
  User,
  Notification,
  Post,
  Resource,
  Course,
  LiveSession,
  RankingEntry,
  Mission,
  Achievement,
  AuditLog,
  Counters,
  GamificationConfig,
} from '@/types/autodev';
import {
  CURRENT_USER,
  MOCK_NOTIFICATIONS,
  MOCK_POSTS,
  MOCK_USERS,
  MOCK_RESOURCES,
  MOCK_COURSES,
  MOCK_LIVES,
  MOCK_RANKING,
  MOCK_MISSIONS,
  MOCK_ACHIEVEMENTS,
  MOCK_AUDIT_LOGS,
  MOCK_COUNTERS,
  MOCK_GAMIFICATION_CONFIG,
} from '@/lib/mock-data';
import {
  saveUserInFirestore,
  createPostInFirestore,
  likePostInFirestore,
  createCommentInFirestore,
  markNotifReadInFirestore,
} from '@/lib/firestore-sync';

interface AppState {
  // Navigation
  route: Route;
  routeParams: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;

  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: (googleUser?: { uid?: string; email: string; displayName: string; avatarUrl?: string }) => void;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  completeOnboarding: (data: { displayName: string; interests: string[]; level: string; bio: string }) => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notifId: string) => void;
  markAllAsRead: () => void;

  // Forum
  posts: Post[];
  selectedPostId: string | null;
  createPost: (title: string, content: string, tags: string[]) => void;
  likePost: (postId: string) => void;
  createComment: (postId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;

  // Community & Platform Collections (Sincronizadas con Firestore en tiempo real)
  users: User[];
  resources: Resource[];
  courses: Course[];
  liveSessions: LiveSession[];
  ranking: RankingEntry[];
  missions: Mission[];
  achievements: Achievement[];
  auditLogs: AuditLog[];
  counters: Counters;
  gamificationConfig: GamificationConfig;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Navigation ──
  route: 'landing',
  routeParams: {},
  navigate: (route, params = {}) => set({ route, routeParams: params }),

  // ── Auth ──
  currentUser: null,
  isAuthenticated: false,
  login: (_email, _password) => {
    // Sincronizar usuario autenticado con Firestore
    const u = CURRENT_USER;
    saveUserInFirestore(u);
    set({ currentUser: u, isAuthenticated: true, route: 'foro' });
    return true;
  },
  loginWithGoogle: (googleUser) => {
    const defaultGoogleUser = {
      uid: googleUser?.uid || ('u-google-' + Date.now()),
      email: googleUser?.email || 'dev.google@bbmdev.dev',
      displayName: googleUser?.displayName || 'Google Developer',
      avatarUrl: googleUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    const newUser: User = {
      ...CURRENT_USER,
      uid: defaultGoogleUser.uid,
      email: defaultGoogleUser.email,
      displayName: defaultGoogleUser.displayName,
      avatarUrl: defaultGoogleUser.avatarUrl,
      status: 'active',
      xp: 120,
      weeklyXP: 45,
      levelNumber: 2,
      postsCount: 1,
      commentsCount: 3,
      bio: 'Desarrollador conectado a través de Google Workspace e integraciones Cloud en Firestore.',
      interests: ['automatizacion', 'ia', 'webapps'],
      role: 'member',
    };
    saveUserInFirestore(newUser);
    set({ currentUser: newUser, isAuthenticated: true, route: 'foro' });
  },
  register: (_email, _password) => {
    const newUser: User = {
      ...CURRENT_USER,
      uid: 'u-new-' + Date.now(),
      email: _email,
      status: 'onboarding_pending',
      xp: 0,
      weeklyXP: 0,
      levelNumber: 0,
      postsCount: 0,
      commentsCount: 0,
      displayName: '',
      bio: '',
      interests: [],
      role: 'member',
    };
    saveUserInFirestore(newUser);
    set({ currentUser: newUser, isAuthenticated: true, route: 'onboarding' });
    return true;
  },
  logout: () => set({ currentUser: null, isAuthenticated: false, route: 'landing' }),
  completeOnboarding: (data) => {
    const user = get().currentUser;
    if (!user) return;
    const updatedUser: User = {
      ...user,
      displayName: data.displayName,
      interests: data.interests as User['interests'],
      level: data.level as User['level'],
      bio: data.bio,
      status: 'active',
      xp: 50,
      levelNumber: 1,
    };
    saveUserInFirestore(updatedUser);
    set({
      currentUser: updatedUser,
      route: 'foro',
    });
  },

  // ── Notifications ──
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
  markAsRead: (notifId) => {
    markNotifReadInFirestore(notifId);
    const notifications = get().notifications.map(n =>
      n.notifId === notifId ? { ...n, read: true } : n
    );
    set({ notifications, unreadCount: notifications.filter(n => !n.read).length });
  },
  markAllAsRead: () => {
    const notifications = get().notifications.map(n => ({ ...n, read: true }));
    set({ notifications, unreadCount: 0 });
  },

  // ── Forum ──
  posts: MOCK_POSTS,
  selectedPostId: null,
  createPost: (title, content, tags) => {
    const user = get().currentUser;
    if (!user) return;
    const newPost: Post = {
      postId: 'p-' + Date.now(),
      authorId: user.uid,
      authorName: user.displayName || 'Anónimo',
      authorLevel: user.level,
      authorAvatarUrl: user.avatarUrl,
      title, content, tags,
      likesCount: 0, likedByUser: false, commentsCount: 0,
      hidden: false, hiddenReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createPostInFirestore(newPost);
    set({ posts: [newPost, ...get().posts] });
  },
  likePost: (postId) => {
    const post = get().posts.find(p => p.postId === postId);
    if (post) {
      likePostInFirestore(postId, post.likedByUser);
    }
    const posts = get().posts.map(p => {
      if (p.postId !== postId) return p;
      if (p.likedByUser) return { ...p, likedByUser: false, likesCount: p.likesCount - 1 };
      return { ...p, likedByUser: true, likesCount: p.likesCount + 1 };
    });
    set({ posts });
  },
  createComment: (postId, content) => {
    const user = get().currentUser;
    if (!user) return;
    const comment = {
      commentId: 'c-' + Date.now(),
      postId,
      authorId: user.uid,
      authorName: user.displayName || 'Anónimo',
      authorAvatarUrl: user.avatarUrl,
      content,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };
    createCommentInFirestore(postId, comment);
    const posts = get().posts.map(p => {
      if (p.postId !== postId) return p;
      return { ...p, commentsCount: p.commentsCount + 1 };
    });
    set({ posts });
  },
  likeComment: (_postId, _commentId) => { /* placeholder */ },

  // ── Community Collections (Inicializadas con datos base y sincronizadas vía Firestore) ──
  users: MOCK_USERS,
  resources: MOCK_RESOURCES,
  courses: MOCK_COURSES,
  liveSessions: MOCK_LIVES,
  ranking: MOCK_RANKING,
  missions: MOCK_MISSIONS,
  achievements: MOCK_ACHIEVEMENTS,
  auditLogs: MOCK_AUDIT_LOGS,
  counters: MOCK_COUNTERS,
  gamificationConfig: MOCK_GAMIFICATION_CONFIG,

  // ── Sidebar ──
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));