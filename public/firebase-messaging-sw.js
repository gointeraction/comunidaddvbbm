// Firebase Cloud Messaging Service Worker
// This service worker handles push notifications from Firebase FCM.
// It is intentionally minimal to avoid caching app assets.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Firebase config — must match src/lib/firebase.ts
firebase.initializeApp({
  apiKey: "AIzaSyD4uLwlcwt2JENrN9sTgApMSJZwHpRud5k",
  authDomain: "bbmdevcomunidad.firebaseapp.com",
  projectId: "bbmdevcomunidad",
  storageBucket: "bbmdevcomunidad.firebasestorage.app",
  messagingSenderId: "628294517431",
  appId: "1:628294517431:web:cc3d1fc2439ba2e3018332",
  measurementId: "G-BWM8G384VC"
});


const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || 'BBMDev', {
    body: body || '',
    icon: icon || '/logo.svg',
  });
});

// IMPORTANT: Do NOT intercept fetch events here.
// This prevents the service worker from caching app assets,
// which would block hot updates from reaching the browser.
