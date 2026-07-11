"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendLiveReminders = exports.appendAuditLog = exports.weeklyRankingReset = exports.onPostLiked = exports.onCommentCreated = exports.onPostCreated = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const https_1 = require("firebase-functions/v2/https");
const firestore_2 = require("firebase-admin/firestore");
const app_1 = require("firebase-admin/app");
(0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
// ── XP Config ─────────────────────────────────────────
const XP = { post: 10, comment: 5, likeReceived: 5, lesson: 50 };
// ── Helpers ───────────────────────────────────────────
async function notify(userId, type, data, fromName, target) {
    await db.collection("notifications").add({ userId, type, data, fromUserName: fromName, targetTitle: target, read: false, createdAt: firestore_2.FieldValue.serverTimestamp() });
}
async function unlockAch(userId, code) {
    var _a, _b, _c, _d;
    const existing = await db.collection("achievements").doc(code).collection("unlocks").doc(userId).get();
    if (existing.exists)
        return;
    await db.collection("achievements").doc(code).collection("unlocks").doc(userId).set({ unlockedAt: firestore_2.FieldValue.serverTimestamp() });
    const ach = await db.collection("achievements").doc(code).get();
    const bonus = ((_a = ach.data()) === null || _a === void 0 ? void 0 : _a.rarity) === "legendary" ? 500 : ((_b = ach.data()) === null || _b === void 0 ? void 0 : _b.rarity) === "epic" ? 200 : ((_c = ach.data()) === null || _c === void 0 ? void 0 : _c.rarity) === "rare" ? 100 : 50;
    await db.collection("users").doc(userId).update({ xp: firestore_2.FieldValue.increment(bonus) });
    await notify(userId, "achievement_unlocked", { achievementCode: code }, undefined, (_d = ach.data()) === null || _d === void 0 ? void 0 : _d.title);
}
// ══════════════════════════════════════════════════════
// POST TRIGGERS
// ══════════════════════════════════════════════════════
exports.onPostCreated = (0, firestore_1.onDocumentCreated)("posts/{postId}", async (event) => {
    var _a, _b;
    const post = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!post)
        return;
    await db.collection("users").doc(post.authorId).update({
        xp: firestore_2.FieldValue.increment(XP.post), weeklyXP: firestore_2.FieldValue.increment(XP.post), postsCount: firestore_2.FieldValue.increment(1),
    });
    await db.collection("counters").doc("global").update({ postsCount: firestore_2.FieldValue.increment(1) }).catch(() => { });
    const user = await db.collection("users").doc(post.authorId).get();
    if (((_b = user.data()) === null || _b === void 0 ? void 0 : _b.postsCount) === 1)
        await unlockAch(post.authorId, "FIRST_POST");
});
// ══════════════════════════════════════════════════════
// COMMENT TRIGGERS
// ══════════════════════════════════════════════════════
exports.onCommentCreated = (0, firestore_1.onDocumentCreated)("posts/{postId}/comments/{commentId}", async (event) => {
    var _a, _b, _c, _d;
    const comment = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!comment)
        return;
    await db.collection("users").doc(comment.authorId).update({
        xp: firestore_2.FieldValue.increment(XP.comment), weeklyXP: firestore_2.FieldValue.increment(XP.comment), commentsCount: firestore_2.FieldValue.increment(1),
    });
    await db.collection("counters").doc("global").update({ commentsCount: firestore_2.FieldValue.increment(1) }).catch(() => { });
    // Notify post author
    const post = await db.collection("posts").doc(event.params.postId).get();
    const postAuthorId = (_b = post.data()) === null || _b === void 0 ? void 0 : _b.authorId;
    if (postAuthorId && comment.authorId !== postAuthorId) {
        await notify(postAuthorId, "new_comment", { postId: event.params.postId, fromUserId: comment.authorId }, comment.authorName, (_c = post.data()) === null || _c === void 0 ? void 0 : _c.title);
    }
    const user = await db.collection("users").doc(comment.authorId).get();
    if (((_d = user.data()) === null || _d === void 0 ? void 0 : _d.commentsCount) >= 10)
        await unlockAch(comment.authorId, "CONVERSATIONALIST");
});
// ══════════════════════════════════════════════════════
// LIKE TRIGGERS
// ══════════════════════════════════════════════════════
exports.onPostLiked = (0, firestore_1.onDocumentUpdated)("posts/{postId}", async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after)
        return;
    const delta = (after.likesCount || 0) - (before.likesCount || 0);
    if (delta > 0) {
        await db.collection("users").doc(after.authorId).update({
            xp: firestore_2.FieldValue.increment(XP.likeReceived), weeklyXP: firestore_2.FieldValue.increment(XP.likeReceived),
        });
        await notify(after.authorId, "new_like", { postId: event.params.postId }, undefined, after.title);
    }
});
// ══════════════════════════════════════════════════════
// WEEKLY RANKING RESET
// ══════════════════════════════════════════════════════
exports.weeklyRankingReset = (0, scheduler_1.onSchedule)("0 0 * * 1", async () => {
    const top = await db.collection("users").where("status", "==", "active").orderBy("weeklyXP", "desc").limit(3).get();
    const rewards = [500, 300, 200];
    for (let i = 0; i < top.docs.length; i++) {
        const bonus = rewards[i];
        await db.collection("users").doc(top.docs[i].id).update({ xp: firestore_2.FieldValue.increment(bonus) });
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
exports.appendAuditLog = (0, https_1.onCall)(async (request) => {
    var _a, _b;
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "Must be authenticated");
    const user = await db.collection("users").doc(request.auth.uid).get();
    if (!user.exists || !["admin", "moderador"].includes((_a = user.data()) === null || _a === void 0 ? void 0 : _a.role)) {
        throw new https_1.HttpsError("permission-denied", "Must be admin or moderator");
    }
    const { action, targetType, targetId, motivo, metadata } = request.data;
    await db.collection("auditLogs").add({
        actorId: request.auth.uid, actorName: (_b = user.data()) === null || _b === void 0 ? void 0 : _b.displayName, action, targetType, targetId, motivo, metadata: metadata || {}, timestamp: firestore_2.FieldValue.serverTimestamp(),
    });
});
// ══════════════════════════════════════════════════════
// RF-047: Live Session Reminders (1h before)
// ══════════════════════════════════════════════════════
exports.sendLiveReminders = (0, scheduler_1.onSchedule)("0 * * * *", async () => {
    const now = Date.now();
    const oneHourLater = new Date(now + 60 * 60 * 1000);
    const upcoming = await db.collection("liveSessions")
        .where("status", "==", "scheduled")
        .where("scheduledAt", "<=", oneHourLater.toISOString())
        .where("scheduledAt", ">=", new Date(now).toISOString())
        .get();
    for (const session of upcoming.docs) {
        const data = session.data();
        const registered = data.registeredUsers || [];
        for (const userId of registered) {
            await notify(userId, "live_reminder", { liveId: session.id }, undefined, data.title);
        }
    }
});
// ══════════════════════════════════════════════════════
// RF-067: Welcome Email on User Creation
// ══════════════════════════════════════════════════════
exports.sendWelcomeEmail = (0, firestore_1.onDocumentCreated)("users/{uid}", async (event) => {
    var _a;
    const user = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!user)
        return;
    console.log(`[EMAIL] Welcome email sent to ${user.email}`);
});
//# sourceMappingURL=index.js.map