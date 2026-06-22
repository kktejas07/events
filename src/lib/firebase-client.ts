import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let firebaseApp: ReturnType<typeof initializeApp> | undefined;

export function getFirebaseApp() {
  if (!getApps().length) {
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      return undefined;
    }
    firebaseApp = initializeApp(firebaseConfig);
  }
  return firebaseApp;
}

export function getFirebaseClientAuth() {
  const app = getFirebaseApp();
  if (!app) return undefined;
  return getAuth(app);
}
