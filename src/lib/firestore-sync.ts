'use client';

import { db } from '@/lib/firebase';
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

/**
 * Inicializa la sincronización en tiempo real o carga desde Firestore.
 * Si las colecciones están vacías, siembra automáticamente los datos iniciales de la comunidad en Firestore.
 */
export async function initFirestoreSync() {
  if (typeof window === 'undefined' || isSyncInitialized || !db) return;
  isSyncInitialized = true;

  try {
    const postsSnap = await getDocs(collection(db, 'posts'));
    if (postsSnap.empty) {
      console.info('>[Firestore Sync] Colección posts vacía. Sembrando datos en Firestore...');
      await seedFirestoreData();
    } else {
      console.info('>[Firestore Sync] Conectando escuchas en tiempo real con Firestore...');
    }

    // Suscribirse a posts
    onSnapshot(
      query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
      (snap) => {
        const posts = snap.docs.map((d) => d.data() as any);
        if (posts.length > 0) useAppStore.setState({ posts });
      },
      (err) => console.warn('>[Firestore Sync] Posts snapshot err:', err.message)
    );

    // Suscribirse a users
    onSnapshot(
      collection(db, 'users'),
      (snap) => {
        const users = snap.docs.map((d) => d.data() as any);
        if (users.length > 0) {
          useAppStore.setState({ users });
          // Sincronizar currentUser con datos actualizados de Firestore
          const { currentUser } = useAppStore.getState();
          if (currentUser) {
            const updated = users.find((u: any) => u.uid === currentUser.uid);
            if (updated) useAppStore.setState({ currentUser: updated });
          }
        }
      },
      (err) => console.warn('>[Firestore Sync] Users snapshot err:', err.message)
    );

    // Suscribirse a courses
    onSnapshot(
      collection(db, 'courses'),
      (snap) => {
        const courses = snap.docs.map((d) => d.data() as any);
        if (courses.length > 0) useAppStore.setState({ courses });
      },
      (err) => console.warn('>[Firestore Sync] Courses err:', err.message)
    );

    // Suscribirse a resources
    onSnapshot(
      collection(db, 'resources'),
      (snap) => {
        const resources = snap.docs.map((d) => d.data() as any);
        if (resources.length > 0) useAppStore.setState({ resources });
      },
      (err) => console.warn('>[Firestore Sync] Resources err:', err.message)
    );

    // Suscribirse a liveSessions
    onSnapshot(
      collection(db, 'liveSessions'),
      (snap) => {
        const liveSessions = snap.docs.map((d) => d.data() as any);
        if (liveSessions.length > 0) useAppStore.setState({ liveSessions });
      },
      (err) => console.warn('>[Firestore Sync] LiveSessions err:', err.message)
    );

    // Suscribirse a notifications
    onSnapshot(
      collection(db, 'notifications'),
      (snap) => {
        const notifications = snap.docs.map((d) => d.data() as any);
        if (notifications.length > 0) {
          useAppStore.setState({
            notifications,
            unreadCount: notifications.filter((n: any) => !n.read).length,
          });
        }
      },
      (err) => console.warn('>[Firestore Sync] Notifications err:', err.message)
    );

    // Suscribirse a missions & achievements
    onSnapshot(
      collection(db, 'missions'),
      (snap) => {
        const missions = snap.docs.map((d) => d.data() as any);
        if (missions.length > 0) useAppStore.setState({ missions });
      },
      () => {}
    );

    onSnapshot(
      collection(db, 'achievements'),
      (snap) => {
        const achievements = snap.docs.map((d) => d.data() as any);
        if (achievements.length > 0) useAppStore.setState({ achievements });
      },
      () => {}
    );

    // RF-LAND-02: Suscribirse a counters
    onSnapshot(
      collection(db, 'counters'),
      (snap) => {
        const docs = snap.docs.map((d) => d.data() as any);
        if (docs.length > 0) {
          // Merge all counter documents
          const merged = docs.reduce((acc, d) => ({ ...acc, ...d }), {});
          useAppStore.setState({ counters: merged });
        }
      },
      () => {}
    );

    // Suscribirse a live chat (per live session)
    const livesSnap = await getDocs(collection(db, 'liveSessions'));
    for (const liveDoc of livesSnap.docs) {
      onSnapshot(
        collection(db, `liveSessions/${liveDoc.id}/chat`),
        (snap) => {
          const messages = snap.docs.map((d) => ({ ...d.data(), liveId: liveDoc.id }));
          if (messages.length > 0) {
            const { chatMessages } = useAppStore.getState();
            const others = chatMessages.filter((m: any) => m.liveId !== liveDoc.id);
            useAppStore.setState({ chatMessages: [...others, ...messages] });
          }
        },
        () => {}
      );
    }

    // Suscribirse a userAchievements
    onSnapshot(
      collection(db, 'userAchievements'),
      (snap) => {
        const userAchievements = snap.docs.map((d) => d.data() as any);
        if (userAchievements.length > 0) {
          useAppStore.setState({ userAchievements } as any);
        }
      },
      () => {}
    );
  } catch (error: any) {
    console.warn('>[Firestore Sync] Aviso al conectar (usando estado local hasta reconectar):', error?.message || error);
  }
}

/**
 * Siembra datos comunitarios en Firestore.
 * NOTA: No siembra usuarios (ellos se registran via Firebase Auth).
 * Los posts se crean con authorId del usuario actual.
 */
export async function seedFirestoreData() {
  if (!db) return;
  const { currentUser } = useAppStore.getState();
  const authorId = currentUser?.uid || 'system';
  const authorName = currentUser?.displayName || 'Sistema';
  const authorLevel = currentUser?.level || 'avanzado';

  try {
    // Seed posts with current user as author
    for (const p of SEED_DATA.posts) {
      await setDoc(doc(db, 'posts', p.postId), { ...p, authorId, authorName, authorLevel });
    }
    // Seed resources
    for (const r of SEED_DATA.resources) {
      await setDoc(doc(db, 'resources', r.resourceId), { ...r, authorId, authorName });
    }
    // Seed courses
    for (const c of SEED_DATA.courses) {
      await setDoc(doc(db, 'courses', c.courseId), { ...c, authorId, authorName });
    }
    // Seed lessons
    for (const [courseId, lessons] of Object.entries(SEED_DATA.lessons)) {
      for (const lesson of lessons) {
        await setDoc(doc(db, `courses/${courseId}/lessons`, lesson.lessonId), lesson);
      }
    }
    // Seed live sessions
    for (const l of SEED_DATA.lives) {
      await setDoc(doc(db, 'liveSessions', l.liveId), { ...l, hostId: authorId, hostName: authorName });
    }
    // Seed missions
    for (const m of SEED_DATA.missions) await setDoc(doc(db, 'missions', m.missionId), m);
    // Seed achievements
    for (const a of SEED_DATA.achievements) await setDoc(doc(db, 'achievements', a.achievementId), a);
    // Seed counters
    await setDoc(doc(db, 'counters', 'global'), SEED_DATA.counters as any);
    // Seed gamification config
    await setDoc(doc(db, 'gamificationConfig', 'main'), SEED_DATA.gamificationConfig as any);
    console.info('>[Firestore Sync] ✓ Sembrado completo en Firestore.');
  } catch (err: any) {
    console.warn('>[Firestore Sync] Error durante sembrado:', err?.message || err);
  }
}

// ── CRUD Helpers contra Firestore ──

export async function createPostInFirestore(post: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'posts', post.postId), post);
  } catch (e: any) {
    console.warn('Error al guardar post en Firestore:', e?.message || e);
  }
}

export async function likePostInFirestore(postId: string, likedByUser: boolean) {
  if (!db) return;
  try {
    const delta = likedByUser ? -1 : 1;
    await updateDoc(doc(db, 'posts', postId), {
      likesCount: increment(delta),
    });
  } catch (e: any) {
    console.warn('Error al dar like en Firestore:', e?.message || e);
  }
}

export async function createCommentInFirestore(postId: string, comment: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, `posts/${postId}/comments`, comment.commentId), comment);
    await updateDoc(doc(db, 'posts', postId), {
      commentsCount: increment(1),
    });
  } catch (e: any) {
    console.warn('Error al guardar comentario en Firestore:', e?.message || e);
  }
}

export async function saveUserInFirestore(user: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'users', user.uid), user, { merge: true });
  } catch (e: any) {
    console.warn('Error al guardar usuario en Firestore:', e?.message || e);
  }
}

export async function markNotifReadInFirestore(notifId: string) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'notifications', notifId), { read: true });
  } catch (e: any) {
    console.warn('Error al marcar notificación en Firestore:', e?.message || e);
  }
}

export async function upvoteResourceInFirestore(resourceId: string, delta: number) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'resources', resourceId), {
      upvotes: increment(delta),
    });
  } catch (e: any) {
    console.warn('Error al votar recurso en Firestore:', e?.message || e);
  }
}

export async function createResourceInFirestore(resource: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, 'resources', resource.resourceId), resource);
  } catch (e: any) {
    console.warn('Error al crear recurso en Firestore:', e?.message || e);
  }
}

export async function deletePostFromFirestore(postId: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (e: any) {
    console.warn('Error al eliminar post en Firestore:', e?.message || e);
  }
}

export async function changeRoleInFirestore(uid: string, newRole: string) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'users', uid), { role: newRole });
  } catch (e: any) {
    console.warn('Error al cambiar rol en Firestore:', e?.message || e);
  }
}

export async function sendLiveChatMessageInFirestore(liveId: string, message: any) {
  if (!db) return;
  try {
    await setDoc(doc(db, `liveSessions/${liveId}/chat`, message.id), message);
  } catch (e: any) {
    console.warn('Error al enviar chat en vivo en Firestore:', e?.message || e);
  }
}

export async function claimXPInFirestore(uid: string, xpReward: number) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'users', uid), {
      xp: increment(xpReward),
      weeklyXP: increment(xpReward),
    });
  } catch (e: any) {
    console.warn('Error al reclamar XP en Firestore:', e?.message || e);
  }
}

export async function markLessonCompletedInFirestore(uid: string, completedLessons: string[]) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'users', uid), { completedLessons });
  } catch (e: any) {
    console.warn('Error al guardar lección completada en Firestore:', e?.message || e);
  }
}

// ── RF-020: Edit Post (within 30 min) ──────────────────
export async function editPostInFirestore(postId: string, data: { title: string; content: string; tags: string[] }) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'posts', postId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.warn('Error al editar post en Firestore:', e?.message || e);
  }
}

// ── RF-021: Delete Own Post ────────────────────────────
export async function deleteOwnPostFromFirestore(postId: string) {
  if (!db) return;
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (e: any) {
    console.warn('Error al eliminar post en Firestore:', e?.message || e);
  }
}

// ── RF-030: Enroll in Course ───────────────────────────
export async function enrollInCourseFirestore(courseId: string, userId: string) {
  if (!db) return;
  try {
    await setDoc(doc(db, `courses/${courseId}/enrollments`, userId), {
      userId,
      enrolledAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, 'courses', courseId), {
      enrolledCount: increment(1),
    });
  } catch (e: any) {
    console.warn('Error al inscribirse en curso:', e?.message || e);
  }
}

// ── RF-031: Mark Lesson Complete ───────────────────────
export async function markLessonCompleteFirestore(courseId: string, lessonId: string, userId: string) {
  if (!db) return;
  try {
    await setDoc(doc(db, `courses/${courseId}/lessons/${lessonId}/completions`, userId), {
      userId,
      completedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    console.warn('Error al marcar lección completada:', e?.message || e);
  }
}

// ── RF-LAND-02: Update Counters ────────────────────────
export async function updateCountersFirestore(field: string, delta: number = 1) {
  if (!db) return;
  try {
    await updateDoc(doc(db, 'counters', 'global'), {
      [field]: increment(delta),
    });
  } catch (e: any) {
    // If counters doc doesn't exist, create it
    try {
      await setDoc(doc(db, 'counters', 'global'), {
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
  if (!db) return;
  try {
    await updateDoc(doc(db, 'resources', resourceId), {
      downloadsCount: increment(1),
    });
  } catch (e: any) {
    console.warn('Error al incrementar descargas:', e?.message || e);
  }
}

// ── RF-043: Toggle Favorite ────────────────────────────
export async function toggleFavoriteFirestore(resourceId: string, userId: string) {
  if (!db) return;
  try {
    const favRef = doc(db, `resources/${resourceId}/favorites/${userId}`);
    const favSnap = await getDoc(favRef);
    if (favSnap.exists()) {
      await deleteDoc(favRef);
      await updateDoc(doc(db, 'resources', resourceId), {
        favoritesCount: increment(-1),
      });
    } else {
      await setDoc(favRef, {
        userId,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(doc(db, 'resources', resourceId), {
        favoritesCount: increment(1),
      });
    }
  } catch (e: any) {
    console.warn('Error al toggle favorito:', e?.message || e);
  }
}
