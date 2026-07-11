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
  saveUserInFirestore,
  createPostInFirestore,
  likePostInFirestore,
  createCommentInFirestore,
  markNotifReadInFirestore,
  upvoteResourceInFirestore,
  deletePostFromFirestore,
  changeRoleInFirestore,
  claimXPInFirestore,
  markLessonCompletedInFirestore,
  editPostInFirestore,
  deleteOwnPostFromFirestore,
  enrollInCourseFirestore,
  markLessonCompleteFirestore,
  initFirestoreSync,
} from '@/lib/firestore-sync';
import {
  onAuthChange,
  loginWithEmail,
  registerWithEmail,
  logoutFirebase,
  getUserProfile,
} from '@/lib/firebase';

// ── RF-028: Filtro de palabras prohibidas ──
const BLOCKED_WORDS = ['spam', 'hack', 'crack', 'xxx'];

interface AppState {
  // Navigation
  route: Route;
  routeParams: Record<string, string>;
  navigate: (route: Route, params?: Record<string, string>) => void;

  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  initAuth: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (googleUser?: { uid?: string; email: string; displayName: string; avatarUrl?: string }) => void;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  completeOnboarding: (data: { displayName: string; interests: string[]; level: string; bio: string }) => void;
  clearAuthError: () => void;

  // Notifications
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notifId: string) => void;
  markAllAsRead: () => void;

  // Forum
  posts: Post[];
  selectedPostId: string | null;
  createPost: (title: string, content: string, tags: string[]) => void;
  editPost: (postId: string, title: string, content: string, tags: string[]) => void;
  deleteOwnPost: (postId: string) => void;
  likePost: (postId: string) => void;
  createComment: (postId: string, content: string) => void;
  likeComment: (postId: string, commentId: string) => void;

  // Community & Platform Collections
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

  // Synced actions
  updateProfile: (data: Partial<User>) => void;
  upvoteResource: (resourceId: string, delta?: number) => void;
  deletePostByAdmin: (postId: string) => void;
  changeUserRole: (uid: string, newRole: string) => void;
  claimMissionReward: (missionId: string, xpReward: number) => void;
  markLessonCompleted: (courseId: string, lessonId: string) => void;
  enrollInCourse: (courseId: string) => void;
  markLessonCompleteInCourse: (courseId: string, lessonId: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ── Navigation ──
  route: 'landing',
  routeParams: {},
  navigate: (route, params = {}) => set({ route, routeParams: params }),

  // ── Auth (Firebase-backed) ──
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  initAuth: () => {
    onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          if (userProfile) {
            set({ currentUser: userProfile, isAuthenticated: true, isLoading: false });
            // Initialize Firestore sync after auth
            initFirestoreSync();
            // Navigate based on status
            if (userProfile.status === 'onboarding_pending') {
              set({ route: 'onboarding' });
            }
          } else {
            // User exists in Firebase Auth but not in Firestore — create doc
            const newUser: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Developer',
              avatarUrl: firebaseUser.photoURL,
              interests: [],
              level: 'principiante',
              bio: '',
              role: 'member',
              status: 'onboarding_pending',
              suspendedUntil: null,
              xp: 0,
              weeklyXP: 0,
              levelNumber: 0,
              postsCount: 0,
              commentsCount: 0,
              fcmToken: null,
              pushEnabled: true,
              emailNotifications: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              lastActiveAt: new Date().toISOString(),
            };
            saveUserInFirestore(newUser);
            set({ currentUser: newUser, isAuthenticated: true, isLoading: false, route: 'onboarding' });
          }
        } catch {
          set({ currentUser: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        set({ currentUser: null, isAuthenticated: false, isLoading: false });
      }
    });
  },

  login: async (email, password) => {
    try {
      set({ authError: null });
      await loginWithEmail(email, password);
      // Auth state observer will handle the rest
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'auth/invalid-credential';
      set({ authError: msg });
      return false;
    }
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

  register: async (email, password) => {
    try {
      set({ authError: null });
      await registerWithEmail(email, password, '');
      // Auth state observer will handle the rest
      return true;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'auth/email-already-in-use';
      set({ authError: msg });
      return false;
    }
  },

  logout: async () => {
    await logoutFirebase();
    set({ currentUser: null, isAuthenticated: false, route: 'landing' });
  },

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

  clearAuthError: () => set({ authError: null }),

  // ── Notifications (from Firestore) ──
  notifications: [],
  unreadCount: 0,
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

  // ── Forum (from Firestore) ──
  posts: [],
  selectedPostId: null,
  createPost: (title, content, tags) => {
    const user = get().currentUser;
    if (!user) return;
    // RF-028: Check for blocked words
    const text = (title + ' ' + content).toLowerCase();
    if (BLOCKED_WORDS.some(w => text.includes(w))) return;
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
  // RF-020: Edit post (within 30 min)
  editPost: (postId, title, content, tags) => {
    editPostInFirestore(postId, { title, content, tags });
    const posts = get().posts.map(p =>
      p.postId === postId ? { ...p, title, content, tags, updatedAt: new Date().toISOString() } : p
    );
    set({ posts });
  },
  // RF-021: Delete own post
  deleteOwnPost: (postId) => {
    const user = get().currentUser;
    const post = get().posts.find(p => p.postId === postId);
    if (!user || !post || post.authorId !== user.uid) return;
    deleteOwnPostFromFirestore(postId);
    set({ posts: get().posts.filter(p => p.postId !== postId) });
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

  // ── Community Collections (from Firestore) ──
  users: [],
  resources: [],
  courses: [],
  liveSessions: [],
  ranking: [],
  missions: [],
  achievements: [],
  auditLogs: [],
  counters: { developersCount: 0, postsCount: 0, commentsCount: 0, coursesCount: 0, resourcesCount: 0 },
  gamificationConfig: { postXP: 10, commentXP: 5, taskXP: 15, likeReceivedXP: 5, weeklyRewards: { top1: 100, top2: 50, top3: 25 } },

  // ── Sidebar ──
  sidebarOpen: true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // ── Synced Actions ──
  updateProfile: (data) => {
    const user = get().currentUser;
    if (!user) return;
    const updatedUser = { ...user, ...data };
    saveUserInFirestore(updatedUser);
    const users = get().users.map(u => u.uid === user.uid ? updatedUser : u);
    set({ currentUser: updatedUser, users });
  },

  upvoteResource: (resourceId, delta = 1) => {
    upvoteResourceInFirestore(resourceId, delta);
    const resources = get().resources.map(r =>
      r.resourceId === resourceId ? { ...r, upvotes: r.upvotes + delta } : r
    );
    set({ resources });
  },

  deletePostByAdmin: (postId) => {
    deletePostFromFirestore(postId);
    const posts = get().posts.filter(p => p.postId !== postId);
    set({ posts });
  },

  changeUserRole: (uid, newRole) => {
    changeRoleInFirestore(uid, newRole);
    const users = get().users.map(u => u.uid === uid ? { ...u, role: newRole as any } : u);
    let currentUser = get().currentUser;
    if (currentUser && currentUser.uid === uid) {
      currentUser = { ...currentUser, role: newRole as any };
    }
    set({ users, currentUser });
  },

  claimMissionReward: (missionId, xpReward) => {
    const user = get().currentUser;
    if (!user) return;
    claimXPInFirestore(user.uid, xpReward);
    const updatedUser = {
      ...user,
      xp: user.xp + xpReward,
      weeklyXP: user.weeklyXP + xpReward,
    };
    const users = get().users.map(u => u.uid === user.uid ? updatedUser : u);
    const missions = get().missions.map(m =>
      m.missionId === missionId ? { ...m, claimed: true } : m
    );
    set({ currentUser: updatedUser, users, missions });
  },

  markLessonCompleted: (courseId, lessonId) => {
    const user = get().currentUser;
    if (!user) return;
    const currentCompleted = (user as any).completedLessons || [];
    if (currentCompleted.includes(lessonId)) return;
    const newCompleted = [...currentCompleted, lessonId];
    markLessonCompletedInFirestore(user.uid, newCompleted);
    // RF-033: Award XP for completing a lesson
    claimXPInFirestore(user.uid, 50);
    const updatedUser = { ...user, completedLessons: newCompleted, xp: user.xp + 50, weeklyXP: user.weeklyXP + 50 } as any;
    set({ currentUser: updatedUser });
  },

  // RF-030: Enroll in course (Firestore)
  enrollInCourse: (courseId) => {
    const user = get().currentUser;
    if (!user) return;
    enrollInCourseFirestore(courseId, user.uid);
    const courses = get().courses.map(c =>
      c.courseId === courseId ? { ...c, isEnrolled: true, enrolledCount: c.enrolledCount + 1 } : c
    );
    set({ courses });
  },

  // RF-031: Mark lesson complete in course (Firestore)
  markLessonCompleteInCourse: (courseId, lessonId) => {
    const user = get().currentUser;
    if (!user) return;
    markLessonCompleteFirestore(courseId, lessonId, user.uid);
  },
}));
