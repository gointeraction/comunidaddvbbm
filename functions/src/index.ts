import { onDocumentCreated, onDocumentUpdated, onSchedule } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();
const db = getFirestore();

// ── XP Config ─────────────────────────────────────────
const XP = { post: 10, comment: 5, likeReceived: 5, lesson: 50 };

// ── Helpers ───────────────────────────────────────────
async function notify(userId: string, type: string, data: Record<string, unknown>, fromName?: string, target?: string) {
  await db.collection("notifications").add({ userId, type, data, fromUserName: fromName, targetTitle: target, read: false, createdAt: FieldValue.serverTimestamp() });
}

async function unlockAch(userId: string, code: string) {
  const existing = await db.collection("achievements").doc(code).collection("unlocks").doc(userId).get();
  if (existing.exists) return;
  await db.collection("achievements").doc(code).collection("unlocks").doc(userId).set({ unlockedAt: FieldValue.serverTimestamp() });
  const ach = await db.collection("achievements").doc(code).get();
  const bonus = ach.data()?.rarity === "legendary" ? 500 : ach.data()?.rarity === "epic" ? 200 : ach.data()?.rarity === "rare" ? 100 : 50;
  await db.collection("users").doc(userId).update({ xp: FieldValue.increment(bonus) });
  await notify(userId, "achievement_unlocked", { achievementCode: code }, undefined, ach.data()?.title);
}

// ══════════════════════════════════════════════════════
// POST TRIGGERS
// ══════════════════════════════════════════════════════

export const onPostCreated = onDocumentCreated("posts/{postId}", async (event) => {
  const post = event.data?.data();
  if (!post) return;
  await db.collection("users").doc(post.authorId).update({
    xp: FieldValue.increment(XP.post), weeklyXP: FieldValue.increment(XP.post), postsCount: FieldValue.increment(1),
  });
  await db.collection("counters").doc("global").update({ postsCount: FieldValue.increment(1) }).catch(() => {});
  const user = await db.collection("users").doc(post.authorId).get();
  if (user.data()?.postsCount === 1) await unlockAch(post.authorId, "FIRST_POST");
});

// ══════════════════════════════════════════════════════
// COMMENT TRIGGERS
// ══════════════════════════════════════════════════════

export const onCommentCreated = onDocumentCreated("posts/{postId}/comments/{commentId}", async (event) => {
  const comment = event.data?.data();
  if (!comment) return;
  await db.collection("users").doc(comment.authorId).update({
    xp: FieldValue.increment(XP.comment), weeklyXP: FieldValue.increment(XP.comment), commentsCount: FieldValue.increment(1),
  });
  await db.collection("counters").doc("global").update({ commentsCount: FieldValue.increment(1) }).catch(() => {});
  // Notify post author
  const post = await db.collection("posts").doc(event.params.postId).get();
  const postAuthorId = post.data()?.authorId;
  if (postAuthorId && comment.authorId !== postAuthorId) {
    await notify(postAuthorId, "new_comment", { postId: event.params.postId, fromUserId: comment.authorId }, comment.authorName, post.data()?.title);
  }
  const user = await db.collection("users").doc(comment.authorId).get();
  if (user.data()?.commentsCount >= 10) await unlockAch(comment.authorId, "CONVERSATIONALIST");
});

// ══════════════════════════════════════════════════════
// LIKE TRIGGERS
// ══════════════════════════════════════════════════════

export const onPostLiked = onDocumentUpdated("posts/{postId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  if (!before || !after) return;
  const delta = (after.likesCount || 0) - (before.likesCount || 0);
  if (delta > 0) {
    await db.collection("users").doc(after.authorId).update({
      xp: FieldValue.increment(XP.likeReceived), weeklyXP: FieldValue.increment(XP.likeReceived),
    });
    await notify(after.authorId, "new_like", { postId: event.params.postId }, undefined, after.title);
  }
});

// ══════════════════════════════════════════════════════
// WEEKLY RANKING RESET
// ══════════════════════════════════════════════════════

export const weeklyRankingReset = onSchedule("0 0 * * 1", async () => {
  const top = await db.collection("users").where("status", "==", "active").orderBy("weeklyXP", "desc").limit(3).get();
  const rewards = [500, 300, 200];
  for (let i = 0; i < top.docs.length; i++) {
    const bonus = rewards[i];
    await db.collection("users").doc(top.docs[i].id).update({ xp: FieldValue.increment(bonus) });
    await notify(top.docs[i].id, "rank_update", { rank: i + 1, bonusXP: bonus }, undefined, `Puesto #${i + 1} del ranking semanal. +${bonus} XP!`);
  }
  const all = await db.collection("users").where("weeklyXP", ">", 0).get();
  const batch = db.batch();
  all.docs.forEach((d) => batch.update(d.ref, { weeklyXP: 0 }));
  await batch.commit();
});

// ══════════════════════════════════════════════════════
// AUDIT LOG (Callable)
// ══════════════════════════════════════════════════════

export const appendAuditLog = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Must be authenticated");
  const user = await db.collection("users").doc(request.auth.uid).get();
  if (!user.exists || !["admin", "moderador"].includes(user.data()?.role)) {
    throw new HttpsError("permission-denied", "Must be admin or moderator");
  }
  const { action, targetType, targetId, motivo, metadata } = request.data;
  await db.collection("auditLogs").add({
    actorId: request.auth.uid, actorName: user.data()?.displayName, action, targetType, targetId, motivo, metadata: metadata || {}, timestamp: FieldValue.serverTimestamp(),
  });
});
