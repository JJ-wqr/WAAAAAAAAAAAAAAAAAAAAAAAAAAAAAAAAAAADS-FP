import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private key from env vars often has literal "\n" sequences that need
  // to be converted to real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment."
    );
  }

  adminApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return adminApp;
}

/**
 * Verifies a Firebase ID token and returns the decoded token (containing `uid`)
 * if valid, or `null` if missing/invalid/expired.
 */
export async function verifyIdToken(token: string | null | undefined) {
  if (!token) return null;

  try {
    const decoded = await getAuth(getAdminApp()).verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Extracts the bearer token from an Authorization header value
 * (e.g. "Bearer eyJhbGciOi...") and verifies it.
 * Returns the authenticated uid, or null if the request is unauthenticated.
 */
export async function getAuthenticatedUid(authorizationHeader: string | null): Promise<string | null> {
  if (!authorizationHeader?.startsWith("Bearer ")) return null;
  const token = authorizationHeader.slice("Bearer ".length).trim();
  const decoded = await verifyIdToken(token);
  return decoded?.uid ?? null;
}
  