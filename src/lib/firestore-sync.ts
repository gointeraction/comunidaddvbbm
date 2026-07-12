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
import { limit } from 'firebase/firestore';
import { limit } from 'firebase/firestore';


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
    // Import useAppStore dynamically to break circular dependency
    const { useAppStore } = await import('@/stores/app-store');

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
