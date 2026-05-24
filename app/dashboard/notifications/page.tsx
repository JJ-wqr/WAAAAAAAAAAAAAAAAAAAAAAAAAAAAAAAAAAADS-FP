"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle2, Clock2, ArrowRight, ChevronLeft } from "lucide-react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useAuth } from "@/components/authprovider";
import { db } from "@/lib/firebase";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read?: boolean;
  xp?: string;
  lang?: string;
};

type UserDoc = {
  notifications?: {
    enabled?: boolean;
    items?: NotificationItem[];
  };
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as UserDoc;
        const items = data.notifications?.items ?? [];
        setNotifications(
          [...items].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        );
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const readItems = notifications.map((item) => ({ ...item, read: true }));
      await updateDoc(doc(db, "users", user.uid), {
        "notifications.items": readItems,
      });
    } catch (error) {
      console.error("Failed to mark notifications as read", error);
    } finally {
      setSaving(false);
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            <Bell size={16} /> Notifications
          </div>
          <p className="mt-3 text-sm text-gray-500">
            View your app events and recent updates. Mark all notifications as read to clear the badge.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={markAllRead}
            disabled={saving || unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={16} /> Mark all read
          </button>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <ChevronLeft size={16} /> Back to overview
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Unread</p>
          <p className="text-3xl font-bold text-gray-900">{unreadCount}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total notifications</p>
          <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">Loading notifications…</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm border border-gray-100">
            <p className="text-lg font-semibold text-gray-900">No notifications yet</p>
            <p className="mt-2 text-sm text-gray-500">Complete lessons or flashcard sets to receive updates here.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-3xl bg-white p-6 shadow-sm border ${notification.read ? "border-gray-100" : "border-blue-100 bg-blue-50"}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                    <Clock2 size={18} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
                      {!notification.read && (
                        <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">New</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{notification.body}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{notification.xp ?? ""}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(notification.time).toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
