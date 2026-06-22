import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdminConfig() {
  const key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!key) return {};
  try {
    return { credential: cert(JSON.parse(key)) };
  } catch {
    console.warn("Invalid FIREBASE_SERVICE_ACCOUNT_KEY JSON, using default credentials");
    return {};
  }
}

export function getFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp(getFirebaseAdminConfig());
  }
  return getAuth();
}

export async function verifyFirebaseToken(idToken: string) {
  const auth = getFirebaseAdmin();
  return auth.verifyIdToken(idToken);
}
