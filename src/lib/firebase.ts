'use client';

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth, type UserCredential } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

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

/**
 * Intenta autenticar con Google mediante Firebase Auth popup.
 * Si falla (o si la API Key está en modo preview/desarrollo), devuelve null para permitir el modal de simulación o fallback.
 */
export async function signInWithGoogleFirebase(): Promise<{ uid: string; email: string; displayName: string; avatarUrl?: string } | null> {
  if (typeof window === 'undefined') return null;
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result: UserCredential = await signInWithPopup(auth, provider);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email || 'developer@gmail.com',
      displayName: user.displayName || 'Dev de Google',
      avatarUrl: user.photoURL || undefined,
    };
  } catch (error: any) {
    console.warn('Aviso Firebase Google Auth (usando fallback de comunidad):', error?.message || error);
    return null;
  }
}
