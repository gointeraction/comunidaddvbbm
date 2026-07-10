import { create } from 'zustand';
import type { Route, User, Notification, Post } from '@/types/autodev';
import { CURRENT_USER, MOCK_NOTIFICATIONS, MOCK_POSTS } from '@/lib/mock-data';

interface AppState {
  // Navigation
  route: Route;
  routeParams: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;

  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
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
    set({ currentUser: CURRENT_USER, isAuthenticated: true, route: 'foro' });
    return true;
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
    set({ currentUser: newUser, isAuthenticated: true, route: 'onboarding' });
    return true;
  },
  logout: () => set({ currentUser: null, isAuthenticated: false, route: 'landing' }),
  completeOnboarding: (data) => {
    const user = get().currentUser;
    if (!user) return;
    set({
      currentUser: {
        ...user,
        displayName: data.displayName,
        interests: data.interests as User['interests'],
        level: data.level as User['level'],
        bio: data.bio,
        status: 'active',
        xp: 50,
        levelNumber: 1,
      },
      route: 'foro',
    });
  },

  // ── Notifications ──
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
  markAsRead: (notifId) => {
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
    set({ posts: [newPost, ...get().posts] });
  },
  likePost: (postId) => {
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
    const posts = get().posts.map(p => {
      if (p.postId !== postId) return p;
      return { ...p, commentsCount: p.commentsCount + 1 };
    });
    set({ posts });
  },
  likeComment: (_postId, _commentId) => { /* placeholder */ },

  // ── Sidebar ──
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));