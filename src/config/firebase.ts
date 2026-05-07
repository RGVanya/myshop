import Constants from 'expo-constants';
import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';

const extra = Constants.expoConfig?.extra ?? {};

export function isFirebaseConfigured(): boolean {
  return Boolean(extra.firebaseApiKey && extra.firebaseProjectId && extra.firebaseAppId);
}

function webConfig() {
  const projectId = String(extra.firebaseProjectId || '');
  return {
    apiKey: String(extra.firebaseApiKey || ''),
    authDomain: String(extra.firebaseAuthDomain || (projectId ? `${projectId}.firebaseapp.com` : '')),
    projectId,
    storageBucket: String(extra.firebaseStorageBucket || ''),
    messagingSenderId: String(extra.firebaseMessagingSenderId || ''),
    appId: String(extra.firebaseAppId || ''),
  };
}

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase env is not configured (see .env.example)');
  }
  if (!app) {
    app = getApps().length > 0 ? getApps()[0]! : initializeApp(webConfig());
  }
  return app;
}
