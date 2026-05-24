"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function shouldSendNotifications(uid: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return !!userDoc.exists() && !!userDoc.data()?.notifications?.enabled;
  } catch (error) {
    console.error("Unable to read notification settings", error);
    return false;
  }
}

export async function notifyBrowser(title: string, body: string) {
  if (typeof window === "undefined") return;
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(title, { body });
  } catch (error) {
    console.error("Notification failed", error);
  }
}

export async function notifyUserIfEnabled(uid: string, title: string, body: string) {
  if (await shouldSendNotifications(uid)) {
    await notifyBrowser(title, body);
  }
}
