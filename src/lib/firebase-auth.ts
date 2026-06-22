"use client";

import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { getFirebaseClientAuth } from "./firebase-client";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export async function signInWithGoogle(): Promise<string | null> {
  const auth = getFirebaseClientAuth();
  if (!auth) return null;
  const result = await signInWithPopup(auth, googleProvider);
  return result.user.getIdToken();
}

export async function signInWithGithub(): Promise<string | null> {
  const auth = getFirebaseClientAuth();
  if (!auth) return null;
  const result = await signInWithPopup(auth, githubProvider);
  return result.user.getIdToken();
}

export async function signOutFirebase() {
  const auth = getFirebaseClientAuth();
  if (auth) {
    await firebaseSignOut(auth);
  }
}
