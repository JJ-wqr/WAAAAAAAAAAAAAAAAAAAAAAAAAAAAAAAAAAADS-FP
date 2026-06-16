import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Default placeholders to avoid module-time errors when imported on the server
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof initializeFirestore> | null = null;
let _googleProvider: GoogleAuthProvider | null = null;

// Initialize Firebase only on the client to avoid server-side runtime issues
if (typeof window !== "undefined") {
  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length > 0) {
    console.error(
      "Missing NEXT_PUBLIC_FIREBASE_* environment variables:",
      missing,
      " — Firebase will not be initialized on the client."
    );
  } else {
    try {
      const app = initializeApp(firebaseConfig);
      _auth = getAuth(app);
      // Enable offline persistence so writes are queued even without network
      _db = initializeFirestore(app, { localCache: persistentLocalCache() });
      // Create GoogleAuthProvider after auth is initialized
      _googleProvider = new GoogleAuthProvider();
      _googleProvider.addScope("profile");
      _googleProvider.addScope("email");
    } catch (err) {
      console.error("Failed to initialize Firebase client:", err);
    }
  }
}

// Export the initialized instances (may be null if initialization failed)
export const auth = _auth as ReturnType<typeof getAuth>;
export const db = _db as ReturnType<typeof initializeFirestore>;
export const googleProvider = _googleProvider as GoogleAuthProvider;

// Helpful runtime checks for consumers
export function ensureClientFirebase() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client should not be accessed on the server. Use server-side admin SDK instead.");
  }
  if (!auth || !db) {
    throw new Error("Firebase client not initialized. Ensure NEXT_PUBLIC_FIREBASE_* env vars are set and the app is running in browser.");
  }
}