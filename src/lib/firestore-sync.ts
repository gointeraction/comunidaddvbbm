'use client';

import { getDb } from '@/lib/firebase';
const getDbLazy = () => getDb();
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  onSnapshot,
  increment,
  query,
  orderBy,
} from 'firebase/firestore';
import { useAppStore } from '@/stores/app-store';
import { limit } from 'firebase/firestore';
// Seed data defined inline (no longer imported from mock-data.ts)

const SEED_DATA = {
  posts: [
    { postId: 'p-001', authorName: 'Carlos Dev', authorLevel: 'avanzado', title: 'Mi primer workflow en n8n para automatizar mi inbox', content: 'Hoy logré automatizar completamente mi bandeja de entrada usando n8n + Claude AI.', tags: ['automatizacion', 'ia'], likesCount: 24, likedByUser: false, commentsCount: 8, hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
    { postId: 'p-002', authorName: 'Lucia AI', authorLevel: 'intermedio', title: 'Tutorial: Crear un RAG pipeline con Claude y Pinecone', content: 'Tutorial completo sobre cómo construir un pipeline RAG desde cero usando Claude API y Pinecone.', tags: ['ia'], likesCount: 31, likedByUser: true, commentsCount: 14, hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date(Date.now() - 604800000).toISOString() },
    { postId: 'p-003', authorName: 'Pedro MCP', authorLevel: 'avanzado', title: 'Nuevo MCP Server para control de bases de datos PostgreSQL', content: 'Desarrollé un MCP Server que permite a Claude interactuar directamente con PostgreSQL.', tags: ['ia', 'automatizacion'], likesCount: 18, likedByUser: false, commentsCount: 6, hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString() },
  ],
  resources: [
    { resourceId: 'r-001', authorName: 'Carlos Dev', title: 'n8n Inbox Automation Workflow', description: 'Workflow completo de n8n para automatizar la clasificación y respuesta de emails usando Claude AI.', type: 'Plugin', level: 'Intermedio', coverUrl: '', content: '# n8n Inbox Automation', externalUrl: null, downloadsCount: 87, favoritesCount: 34, isFavorited: true, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
    { resourceId: 'r-002', authorName: 'Pedro MCP', title: 'MCP Server — PostgreSQL Controller', description: 'MCP Server que permite a Claude interactuar con bases de datos PostgreSQL.', type: 'MCP Server', level: 'Avanzado', coverUrl: '', content: '# PostgreSQL MCP Server', externalUrl: 'https://github.com/pedromcp/postgres-mcp', downloadsCount: 142, favoritesCount: 56, isFavorited: false, createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date(Date.now() - 604800000).toISOString() },
  ],
  courses: [
    { courseId: 'c-001', authorName: 'Carlos Dev', title: 'Automatización con n8n: De Cero a Producción', description: 'Aprende a crear flujos de automatización profesionales con n8n.', coverUrl: '', durationMinutes: 420, lessonsCount: 8, enrolledCount: 156, isEnrolled: true, progress: 62, createdAt: '2026-03-01T10:00:00Z' },
  ],
  lessons: {
    'c-001': [
      { lessonId: 'l-001', courseId: 'c-001', title: 'Introducción a n8n', content: '# ¿Qué es n8n?', order: 1, xpReward: 50, isCompleted: true },
      { lessonId: 'l-002', courseId: 'c-001', title: 'Instalación y configuración', content: '# Instalación', order: 2, xpReward: 50, isCompleted: true },
    ],
  },
  lives: [
    { liveId: 'lv-001', title: 'Workshop: Automatiza tu primer flujo n8n en vivo', description: 'Sesión en vivo donde construiremos un workflow de automatización completo desde cero.', hostName: 'Carlos Dev', scheduledAt: new Date(Date.now() + 604800000).toISOString(), durationMinutes: 90, maxAttendees: 50, attendeesCount: 32, status: 'scheduled', streamUrl: null, isUserRegistered: false, isWaitlisted: false, createdAt: new Date(Date.now() - 604800000).toISOString() },
  ],
  missions: [
    { missionId: 'm-001', title: 'Completa tu perfil', description: 'Agrega foto de perfil, biografía y al menos 1 interés.', xpReward: 100, tasks: [{ id: 't1', type: 'avatar', label: 'Subir foto', target: 1 }, { id: 't2', type: 'bio', label: 'Escribir bio', target: 1 }, { id: 't3', type: 'interest', label: 'Seleccionar intereses', target: 1 }], progress: { t1: 0, t2: 1, t3: 1 }, completed: false, completedAt: null },
    { missionId: 'm-002', title: 'Comenta en 3 posts', description: 'Deja comentarios significativos en al menos 3 posts.', xpReward: 100, tasks: [{ id: 't4', type: 'comment', label: 'Comentar', target: 3 }], progress: { t4: 2 }, completed: false, completedAt: null },
  ],
  achievements: [
    { achievementId: 'ach-001', code: 'FIRST_POST', title: 'Primer Post', description: 'Publica tu primer post', iconUrl: '', rarity: 'common', criteria: { type: 'post_count', threshold: 1 } },
    { achievementId: 'ach-002', code: 'COMMENTER_10', title: 'Comentarista', description: 'Deja 10 comentarios', iconUrl: '', rarity: 'common', criteria: { type: 'comment_count', threshold: 10 } },
  ],
  counters: { developersCount: 619, postsCount: 1247, commentsCount: 3856, coursesCount: 12, resourcesCount: 89 },
  gamificationConfig: { postXP: 10, commentXP: 5, taskXP: 15, likeReceivedXP: 5, weeklyRewards: { top1: 100, top2: 50, top3: 25 } },
};

let isSyncInitialized = false;
let unsubscribers: (() => void)[] = [];

// ── Rate Limiter Helper ──
const lastCall: Record<string, number> = {};
export function throttle(key: string, ms: number = 1000): boolean {
  const now = Date.now();
  if (lastCall[key] && now - lastCall[key] < ms) return false;
  lastCall[key] = now;
  return true;
}

/**
 * Inicializa la sincronización en tiempo real o carga desde Firestore.
 * Si las colecciones están vacías, siembra automáticamente los datos iniciales de la comunidad en Firestore.
 */
export function cleanupFirestoreSync() {
  unsubscribers.forEach(unsub => unsub());
  unsubscribers = [];
  isSyncInitialized = false;
}

export async function initFirestoreSync() {
  if (typeof window === 'undefined' || !getDbLazy()) return;
  if (isSyncInitialized) return;
  isSyncInitialized = true;

  try {
    // Quick check: just see if posts collection has any docs (minimal read)
    const postsCheck = await getDocs(query(collection(getDbLazy(), 'posts'), limit(1)));
    if (postsCheck.empty) {
      console.info('>[Firestore Sync] Sembrando datos iniciales...');
      await seedFirestoreData();
    }

    // Only subscribe to essential collections on initial load
    // Defer non-essential listeners (missions, achievements, counters)
    const essentialCollections = [
      { name: 'posts', limit: 50 },
      { name: 'resources', limit: 50 },
      { name: 'courses', limit: 50 },
      { name: 'liveSessions', limit: 20 },
      { name: 'notifications', limit: 50 },
    ];

    for (const col of essentialCollections) {
      unsubscribers.push(onSnapshot(
        query(collection(getDbLazy(), col.name), limit(col.limit)),
        (snap) => {
          const data = snap.docs.map((d) => d.data() as any);
          if (data.length > 0) useAppStore.setState({ [col.name]: data });
        },
        () => {}
      ));
    }

    // Users listener (lighter - only sync current user)
    unsubscribers.push(onSnapshot(
      collection(getDbLazy(), 'users'),
      (snap) => {
        const users = snap.docs.map((d) => d.data() as any);
        if (users.length > 0) {
          useAppStore.setState({ users });
          const { currentUser } = useAppStore.getState();
          if (currentUser) {
            const updated = users.find((u: any) => u.uid === currentUser.uid);
            if (updated) useAppStore.setState({ currentUser: updated });
          }
        }
      },
      () => {}
    ));

    // Deferred: missions, achievements, counters (load after 2s)
    setTimeout(() => {
      unsubscribers.push(onSnapshot(
        collection(getDbLazy(), 'missions'),
        (snap) => {
          const missions = snap.docs.map((d) => d.data() as any);
          if (missions.length > 0) useAppStore.setState({ missions });
        },
        () => {}
      ));

      unsubscribers.push(onSnapshot(
        collection(getDbLazy(), 'achievements'),
        (snap) => {
          const achievements = snap.docs.map((d) => d.data() as any);
          if (achievements.length > 0) useAppStore.setState({ achievements });
        },
        () => {}
      ));

      unsubscribers.push(onSnapshot(
        collection(getDbLazy(), 'counters'),
        (snap) => {
          const docs = snap.docs.map((d) => d.data() as any);
          if (docs.length > 0) {
            const merged = docs.reduce((acc, d) => ({ ...acc, ...d }), {});
            useAppStore.setState({ counters: merged });
          }
        },
        () => {}
      ));
    }, 2000);

  } catch (error: any) {
    console.warn('>[Firestore Sync] Error:', error?.message || error);
  }
}

/**
 * Siembra datos comunitarios en Firestore.
 * NOTA: No siembra usuarios (ellos se registran via Firebase Auth).
 * Los posts se crean con authorId del usuario actual.
 */
export async function seedFirestoreData() {
  if (!getDbLazy()) return;
  const { currentUser } = useAppStore.getState();
  const authorId = currentUser?.uid || 'system';
  const authorName = currentUser?.displayName || 'Sistema';
  const authorLevel = currentUser?.level || 'avanzado';

  try {
    // Seed posts with current user as author
    for (const p of SEED_DATA.posts) {
      await setDoc(doc(getDbLazy(), 'posts', p.postId), { ...p, authorId, authorName, authorLevel });
    }
    // Seed resources
    for (const r of SEED_DATA.resources) {
      await setDoc(doc(getDbLazy(), 'resources', r.resourceId), { ...r, authorId, authorName });
    }
    // Seed courses
    for (const c of SEED_DATA.courses) {
      await setDoc(doc(getDbLazy(), 'courses', c.courseId), { ...c, authorId, authorName });
    }
    // Seed lessons
    for (const [courseId, lessons] of Object.entries(SEED_DATA.lessons)) {
      for (const lesson of lessons) {
        await setDoc(doc(getDbLazy(), `courses/${courseId}/lessons`, lesson.lessonId), lesson);
      }
    }
    // Seed live sessions
    for (const l of SEED_DATA.lives) {
      await setDoc(doc(getDbLazy(), 'liveSessions', l.liveId), { ...l, hostId: authorId, hostName: authorName });
    }
    // Seed missions
    for (const m of SEED_DATA.missions) await setDoc(doc(getDbLazy(), 'missions', m.missionId), m);
    // Seed achievements
    for (const a of SEED_DATA.achievements) await setDoc(doc(getDbLazy(), 'achievements', a.achievementId), a);
    // Seed counters
    await setDoc(doc(getDbLazy(), 'counters', 'global'), SEED_DATA.counters as any);
    // Seed gamification config
    await setDoc(doc(getDbLazy(), 'gamificationConfig', 'main'), SEED_DATA.gamificationConfig as any);
    console.info('>[Firestore Sync] ✓ Sembrado completo en Firestore.');
  } catch (err: any) {
    console.warn('>[Firestore Sync] Error durante sembrado:', err?.message || err);
  }
}

// ── CRUD Helpers contra Firestore ──

export async function createPostInFirestore(post: any) {
  if (!getDbLazy()) return;
  try {
    await setDoc(doc(getDbLazy(), 'posts', post.postId), post);
  } catch (e: any) {
    console.warn('Error al guardar post en Firestore:', e?.message || e);
  }
}

export async function likePostInFirestore(postId: string, likedByUser: boolean) {
  if (!getDbLazy()) return;
  if (!throttle(`like-${postId}`, 500)) return;
  try {
    const delta = likedByUser ? -1 : 1;
    await updateDoc(doc(getDbLazy(), 'posts', postId), {
      likesCount: increment(delta),
    });
  } catch (e: any) {
    console.warn('Error al dar like en Firestore:', e?.message || e);
  }
}

export async function createCommentInFirestore(postId: string, comment: any) {
  if (!getDbLazy()) return;
  if (!throttle(`comment-${postId}`, 1000)) return;
  try {
    await setDoc(doc(getDbLazy(), `posts/${postId}/comments`, comment.commentId), comment);
    await updateDoc(doc(getDbLazy(), 'posts', postId), {
      commentsCount: increment(1),
    });
  } catch (e: any) {
    console.warn('Error al guardar comentario en Firestore:', e?.message || e);
  }
}

export async function saveUserInFirestore(user: any) {
  if (!getDbLazy()) return;
  try {
    await setDoc(doc(getDbLazy(), 'users', user.uid), user, { merge: true });
  } catch (e: any) {
    console.warn('Error al guardar usuario en Firestore:', e?.message || e);
  }
}

export async function markNotifReadInFirestore(notifId: string) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'notifications', notifId), { read: true });
  } catch (e: any) {
    console.warn('Error al marcar notificación en Firestore:', e?.message || e);
  }
}

export async function upvoteResourceInFirestore(resourceId: string, delta: number) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'resources', resourceId), {
      upvotes: increment(delta),
    });
  } catch (e: any) {
    console.warn('Error al votar recurso en Firestore:', e?.message || e);
  }
}

export async function createResourceInFirestore(resource: any) {
  if (!getDbLazy()) return;
  try {
    await setDoc(doc(getDbLazy(), 'resources', resource.resourceId), resource);
  } catch (e: any) {
    console.warn('Error al crear recurso en Firestore:', e?.message || e);
  }
}

export async function incrementViewCount(resourceId: string) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'resources', resourceId), {
      viewsCount: increment(1),
    });
  } catch (e: any) {
    // If viewsCount field doesn't exist, initialize it
    try {
      await updateDoc(doc(getDbLazy(), 'resources', resourceId), {
        viewsCount: 1,
      });
    } catch (e2: any) {
      console.warn('Error al contar vistas:', e2?.message || e2);
    }
  }
}

export async function deletePostFromFirestore(postId: string) {
  if (!getDbLazy()) return;
  try {
    await deleteDoc(doc(getDbLazy(), 'posts', postId));
  } catch (e: any) {
    console.warn('Error al eliminar post en Firestore:', e?.message || e);
  }
}

export async function changeRoleInFirestore(uid: string, newRole: string) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'users', uid), { role: newRole });
  } catch (e: any) {
    console.warn('Error al cambiar rol en Firestore:', e?.message || e);
  }
}

export async function sendLiveChatMessageInFirestore(liveId: string, message: any) {
  if (!getDbLazy()) return;
  try {
    await setDoc(doc(getDbLazy(), `liveSessions/${liveId}/chat`, message.id), message);
  } catch (e: any) {
    console.warn('Error al enviar chat en vivo en Firestore:', e?.message || e);
  }
}

export async function claimXPInFirestore(uid: string, xpReward: number) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'users', uid), {
      xp: increment(xpReward),
      weeklyXP: increment(xpReward),
    });
  } catch (e: any) {
    console.warn('Error al reclamar XP en Firestore:', e?.message || e);
  }
}

export async function markLessonCompletedInFirestore(uid: string, completedLessons: string[]) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'users', uid), { completedLessons });
  } catch (e: any) {
    console.warn('Error al guardar lección completada en Firestore:', e?.message || e);
  }
}

// ── RF-020: Edit Post (within 30 min) ──────────────────
export async function editPostInFirestore(postId: string, data: { title: string; content: string; tags: string[] }) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'posts', postId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.warn('Error al editar post en Firestore:', e?.message || e);
  }
}

// ── RF-021: Delete Own Post ────────────────────────────
export async function deleteOwnPostFromFirestore(postId: string) {
  if (!getDbLazy()) return;
  try {
    await deleteDoc(doc(getDbLazy(), 'posts', postId));
  } catch (e: any) {
    console.warn('Error al eliminar post en Firestore:', e?.message || e);
  }
}

// ── RF-030: Enroll in Course ───────────────────────────
export async function enrollInCourseFirestore(courseId: string, userId: string) {
  if (!getDbLazy()) return;
  try {
    await setDoc(doc(getDbLazy(), `courses/${courseId}/enrollments`, userId), {
      userId,
      enrolledAt: new Date().toISOString(),
    });
    await updateDoc(doc(getDbLazy(), 'courses', courseId), {
      enrolledCount: increment(1),
    });
  } catch (e: any) {
    console.warn('Error al inscribirse en curso:', e?.message || e);
  }
}

// ── RF-031: Mark Lesson Complete ───────────────────────
export async function markLessonCompleteFirestore(courseId: string, lessonId: string, userId: string) {
  if (!getDbLazy()) return;
  try {
    await setDoc(doc(getDbLazy(), `courses/${courseId}/lessons/${lessonId}/completions`, userId), {
      userId,
      completedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.warn('Error al marcar lección completada:', e?.message || e);
  }
}

// ── RF-LAND-02: Update Counters ────────────────────────
export async function updateCountersFirestore(field: string, delta: number = 1) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'counters', 'global'), {
      [field]: increment(delta),
    });
  } catch (e: any) {
    // If counters doc doesn't exist, create it
    try {
      await setDoc(doc(getDbLazy(), 'counters', 'global'), {
        developersCount: 0, postsCount: 0, commentsCount: 0, coursesCount: 0, resourcesCount: 0,
        [field]: increment(delta),
      });
    } catch (e2: any) {
      console.warn('Error al actualizar contadores:', e2?.message || e2);
    }
  }
}

// ── RF-041: Increment Download Count ───────────────────
export async function incrementDownloadCountFirestore(resourceId: string) {
  if (!getDbLazy()) return;
  try {
    await updateDoc(doc(getDbLazy(), 'resources', resourceId), {
      downloadsCount: increment(1),
    });
  } catch (e: any) {
    console.warn('Error al incrementar descargas:', e?.message || e);
  }
}

// ── RF-043: Toggle Favorite ────────────────────────────
export async function toggleFavoriteFirestore(resourceId: string, userId: string) {
  if (!getDbLazy()) return;
  try {
    const favRef = doc(getDbLazy(), `resources/${resourceId}/favorites/${userId}`);
    const favSnap = await getDoc(favRef);
    if (favSnap.exists()) {
      await deleteDoc(favRef);
      await updateDoc(doc(getDbLazy(), 'resources', resourceId), {
        favoritesCount: increment(-1),
      });
    } else {
      await setDoc(favRef, {
        userId,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(doc(getDbLazy(), 'resources', resourceId), {
        favoritesCount: increment(1),
      });
    }
  } catch (e: any) {
    console.warn('Error al toggle favorito:', e?.message || e);
  }
}
