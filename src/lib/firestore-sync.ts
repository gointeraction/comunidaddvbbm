'use client';

import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
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
import {
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_RESOURCES,
  MOCK_COURSES,
  MOCK_LESSONS,
  MOCK_LIVES,
  MOCK_RANKING,
  MOCK_MISSIONS,
  MOCK_ACHIEVEMENTS,
  MOCK_NOTIFICATIONS,
  MOCK_AUDIT_LOGS,
  MOCK_COUNTERS,
  MOCK_GAMIFICATION_CONFIG,
} from '@/lib/mock-data';

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
  } catch (error: any) {
    console.warn('>[Firestore Sync] Aviso al conectar (usando estado local hasta reconectar):', error?.message || error);
  }
}

/**
 * Siembra los datos de toda la comunidad en Firestore.
 */
export async function seedFirestoreData() {
  if (!db) return;
  try {
    for (const u of MOCK_USERS) await setDoc(doc(db, 'users', u.uid), u);
    for (const p of MOCK_POSTS) await setDoc(doc(db, 'posts', p.postId), p);
    for (const r of MOCK_RESOURCES) await setDoc(doc(db, 'resources', r.resourceId), r);
    for (const c of MOCK_COURSES) await setDoc(doc(db, 'courses', c.courseId), c);
    // Seed lessons as subcollections under courses
    for (const [courseId, lessons] of Object.entries(MOCK_LESSONS)) {
      for (const lesson of lessons) {
        await setDoc(doc(db, `courses/${courseId}/lessons`, lesson.lessonId), lesson);
      }
    }
    for (const l of MOCK_LIVES) await setDoc(doc(db, 'liveSessions', l.liveId), l);
    for (const m of MOCK_MISSIONS) await setDoc(doc(db, 'missions', m.missionId), m);
    for (const a of MOCK_ACHIEVEMENTS) await setDoc(doc(db, 'achievements', a.achievementId), a);
    for (const n of MOCK_NOTIFICATIONS) await setDoc(doc(db, 'notifications', n.notifId), n);
    for (const log of MOCK_AUDIT_LOGS) await setDoc(doc(db, 'auditLogs', log.logId), log);
    await setDoc(doc(db, 'counters', 'global'), MOCK_COUNTERS as any);
    await setDoc(doc(db, 'gamificationConfig', 'main'), MOCK_GAMIFICATION_CONFIG as any);
    console.info('>[Firestore Sync] ✓ Sembrado completo de todas las colecciones en Firestore.');
  } catch (err: any) {
    console.warn('>[Firestore Sync] Error durante sembrado en Firestore:', err?.message || err);
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
