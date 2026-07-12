"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomClaims = exports.syncRoleOnUpdate = exports.syncRoleOnCreate = void 0;
const firestore_1 = require("firebase-functions/v2/firestore");
const https_1 = require("firebase-functions/v2/https");
const auth_1 = require("firebase-admin/auth");
const firestore_2 = require("firebase-admin/firestore");
// Sync role to Custom Claims when a user document is created
exports.syncRoleOnCreate = (0, firestore_1.onDocumentCreated)("users/{uid}", async (event) => {
    var _a;
    const user = (_a = event.data) === null || _a === void 0 ? void 0 : _a.data();
    if (!user || !user.role)
        return;
    const auth = (0, auth_1.getAuth)();
    const claims = {};
    if (user.role === "admin")
        claims.admin = true;
    if (user.role === "moderador")
        claims.moderator = true;
    if (Object.keys(claims).length > 0) {
        await auth.setCustomUserClaims(event.params.uid, claims);
    }
});
// Sync role to Custom Claims when a user document is updated
exports.syncRoleOnUpdate = (0, firestore_1.onDocumentUpdated)("users/{uid}", async (event) => {
    var _a, _b;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!after || (before === null || before === void 0 ? void 0 : before.role) === after.role)
        return;
    const auth = (0, auth_1.getAuth)();
    const claims = {};
    if (after.role === "admin")
        claims.admin = true;
    if (after.role === "moderador")
        claims.moderator = true;
    await auth.setCustomUserClaims(event.params.uid, claims);
});
// Callable function for Admin Panel to manually set claims (and update Firestore)
exports.setCustomClaims = (0, https_1.onCall)(async (request) => {
    if (!request.auth || request.auth.token.admin !== true) {
        throw new https_1.HttpsError("permission-denied", "Must be an admin to assign roles.");
    }
    const { targetUid, role } = request.data;
    if (!targetUid || !["admin", "moderador", "user"].includes(role)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid targetUid or role.");
    }
    const auth = (0, auth_1.getAuth)();
    const claims = {};
    if (role === "admin")
        claims.admin = true;
    if (role === "moderador")
        claims.moderator = true;
    // Set the custom claim in Auth
    await auth.setCustomUserClaims(targetUid, claims);
    // Update the Firestore document to keep it in sync
    const db = (0, firestore_2.getFirestore)();
    await db.collection("users").doc(targetUid).update({ role });
    return { success: true, message: `Role ${role} assigned to ${targetUid}` };
});
//# sourceMappingURL=setCustomClaims.js.map