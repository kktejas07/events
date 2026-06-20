import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  credential: process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY))
    : undefined,
};

export function getFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp(firebaseAdminConfig);
  }
  return getAuth();
}

export async function verifyFirebaseToken(idToken: string) {
  const auth = getFirebaseAdmin();
  return auth.verifyIdToken(idToken);
}
