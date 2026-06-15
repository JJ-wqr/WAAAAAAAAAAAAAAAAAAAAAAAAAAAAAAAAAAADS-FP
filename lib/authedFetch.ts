import { auth } from "@/lib/firebase";

/**
 * Wraps `fetch` and attaches the current Firebase user's ID token as a
 * Bearer Authorization header. Throws if no user is signed in.
 */
export async function authedFetch(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not signed in");
  }

  const token = await user.getIdToken();
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...options, headers });
}
