import { onDocumentUpdated, onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Sync role to Custom Claims when a user document is created
export const syncRoleOnCreate = onDocumentCreated("users/{uid}", async (event) => {
  const user = event.data?.data();
  if (!user || !user.role) return;
  
  const auth = getAuth();
  const claims: Record<string, boolean> = {};
  if (user.role === "admin") claims.admin = true;
  if (user.role === "moderador") claims.moderator = true;
  
  if (Object.keys(claims).length > 0) {
    await auth.setCustomUserClaims(event.params.uid, claims);
  }
});

// Sync role to Custom Claims when a user document is updated
export const syncRoleOnUpdate = onDocumentUpdated("users/{uid}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  
  if (!after || before?.role === after.role) return;
  
  const auth = getAuth();
  const claims: Record<string, boolean> = {};
  if (after.role === "admin") claims.admin = true;
  if (after.role === "moderador") claims.moderator = true;
  
  await auth.setCustomUserClaims(event.params.uid, claims);
});

// Callable function for Admin Panel to manually set claims (and update Firestore)
export const setCustomClaims = onCall(async (request) => {
  if (!request.auth || request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Must be an admin to assign roles.");
  }

  const { targetUid, role } = request.data;
  if (!targetUid || !["admin", "moderador", "user"].includes(role)) {
    throw new HttpsError("invalid-argument", "Invalid targetUid or role.");
  }

  const auth = getAuth();
  const claims: Record<string, boolean> = {};
  if (role === "admin") claims.admin = true;
  if (role === "moderador") claims.moderator = true;

  // Set the custom claim in Auth
  await auth.setCustomUserClaims(targetUid, claims);

  // Update the Firestore document to keep it in sync
  const db = getFirestore();
  await db.collection("users").doc(targetUid).update({ role });

  return { success: true, message: `Role ${role} assigned to ${targetUid}` };
});
