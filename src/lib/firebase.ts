'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut, updateProfile, onAuthStateChanged, type Auth, type UserCredential } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import type { User } from '@/types/autodev';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD4uLwlcwt2JENrN9sTgApMSJZwHpRud5k',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'bbmdevcomunidad.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'bbmdevcomunidad',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'bbmdevcomunidad.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '628294517431',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:628294517431:web:cc3d1fc2439ba2e3018332',
  measurementId: 'G-BWM8G384VC',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

// ── Auth State Observer ──────────────────────────────
export function onAuthChange(callback: (user: import('firebase/auth').User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// ── Google Sign-In ───────────────────────────────────
export async function signInWithGoogleFirebase(): Promise<{ uid: string; email: string; displayName: string; avatarUrl?: string } | null> {
  if (typeof window === 'undefined') return null;
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result: UserCredential = await signInWithPopup(auth, provider);
    const user = result.user;

    // Create/update user doc in Firestore
    const userDoc: User = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Developer',
      avatarUrl: user.photoURL,
      interests: [],
      level: 'principiante',
      bio: '',
      role: 'member',
      status: 'active',
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

    await setDoc(doc(db, 'users', user.uid), userDoc, { merge: true });

    return {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Developer',
      avatarUrl: user.photoURL || undefined,
    };
  } catch (error: unknown) {
    console.warn('Firebase Google Auth fallback:', (error as Error)?.message || error);
    return null;
  }
}

// ── Email/Password Login ─────────────────────────────
export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  // Update lastActiveAt
  await setDoc(doc(db, 'users', credential.user.uid), {
    lastActiveAt: new Date().toISOString(),
  }, { merge: true });

  return credential.user;
}

// ── Email/Password Register ──────────────────────────
export async function registerWithEmail(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  // Update Firebase Auth profile
  await updateProfile(credential.user, { displayName });

  // Create Firestore user document
  const userDoc: User = {
    uid: credential.user.uid,
    email,
    displayName,
    avatarUrl: null,
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

  await setDoc(doc(db, 'users', credential.user.uid), userDoc);
  await sendEmailVerification(credential.user);

  return credential.user;
}

// ── Get User Profile from Firestore ──────────────────
export async function getUserProfile(uid: string): Promise<User | null> {
  const docSnap = await getDoc(doc(db, 'users', uid));
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  return null;
}

// ── Update User Profile ───────────────────────────────
export async function updateUserProfile(uid: string, data: Partial<User>) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
}

// ── Password Reset ────────────────────────────────────
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// ── Logout ────────────────────────────────────────────
export async function logoutFirebase() {
  await signOut(auth);
}
