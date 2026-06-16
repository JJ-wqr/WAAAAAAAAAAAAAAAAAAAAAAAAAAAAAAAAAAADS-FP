"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Bell, BookOpen, Layers, BookMarked, ChevronDown, ChevronUp, Pencil, User, LogOut, Volume2 } from "lucide-react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { signOut, updateProfile } from "firebase/auth";
import { useAuth } from "@/components/authprovider";
import { useLang } from "@/components/languageprovider";
import { db, auth } from "@/lib/firebase";
import { unitData } from "@/lib/lessonData";
import { flashcardDecks } from "@/lib/flashcardData";
import { vocabularyData } from "@/lib/vocabularyData";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type SearchResult = {
  type: "lesson" | "flashcard" | "vocabulary";
  title: string;
  subtitle: string;
  href: string;
};

type Notification = {
  id: string;
  stateKey: string;
  icon: string;
  title: string;
  body: string;
  unread: boolean;
};

function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
}

const TS_KEY = "linguiny_notif_ts";
function loadTimestamps(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(TS_KEY) ?? "{}"); } catch { return {}; }
}
function saveTimestamps(ts: Record<string, number>) {
  localStorage.setItem(TS_KEY, JSON.stringify(ts));
}

function buildNotifications(stats: Record<string, number> | null): Notification[] {
  if (!stats) return [{ id: "welcome", stateKey: "0", icon: "👋", title: "Welcome to Linguiny!", body: "Start your first lesson to begin your journey.", unread: true }];
  const notes: Notification[] = [];
  if ((stats.streak ?? 0) > 0) {
    notes.push({ id: "streak", stateKey: String(stats.streak), icon: "🔥", title: `${stats.streak}-day streak!`, body: "You're on a roll! Keep practicing daily.", unread: true });
  } else {
    notes.push({ id: "reminder", stateKey: "0", icon: "⏰", title: "Daily reminder", body: "Don't forget to practice today!", unread: false });
  }
  if ((stats.xp ?? 0) > 0) {
    const remaining = 5000 - (stats.xp ?? 0);
    notes.push({ id: "xp", stateKey: String(stats.xp), icon: "⚡", title: `${stats.xp} XP earned`, body: remaining <= 0 ? "Achievement unlocked: XP Machine! 🏆" : `${remaining} XP to go for the XP Machine badge.`, unread: remaining <= 500 && remaining > 0 });
  }
  if ((stats.lessonsCompleted ?? 0) > 0) {
    const remaining = 10 - (stats.lessonsCompleted ?? 0);
    notes.push({ id: "lessons", stateKey: String(stats.lessonsCompleted), icon: "🎯", title: `${stats.lessonsCompleted} lesson${stats.lessonsCompleted !== 1 ? "s" : ""} completed`, body: remaining <= 0 ? "Achievement unlocked: Lesson Master! 🏆" : `${remaining} more to unlock Lesson Master.`, unread: remaining <= 0 });
  }
  if (notes.length === 1) notes.push({ id: "start", stateKey: "0", icon: "📚", title: "Ready to learn?", body: "Complete your first lesson and earn XP!", unread: true });
  return notes;
}

const TYPE_ICON = {
  lesson: <BookOpen size={14} className="text-blue-500" />,
  flashcard: <Layers size={14} className="text-purple-500" />,
  vocabulary: <BookMarked size={14} className="text-green-500" />,
};

export function TopNav() {
  const { user } = useAuth();
  const { lang } = useLang();
  const router = useRouter();

  const [query, setQuery]         = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [stats, setStats]           = useState<Record<string, number> | null>(null);
  const [, setTick]                 = useState(0);

  // Inline name edit state
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue]     = useState("");
  const [nameSaving, setNameSaving]   = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef  = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (snap.exists()) setStats(snap.data() as Record<string, number>);
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  setNotifOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) { setAvatarOpen(false); setEditingName(false); }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const notifications = useMemo(() => buildNotifications(stats), [stats]);

  useEffect(() => {
    const stored = loadTimestamps();
    const now = Date.now();
    let changed = false;
    const currentKeys = new Set(notifications.map(n => `${n.id}:${n.stateKey}`));
    for (const key of Object.keys(stored)) {
      const id = key.split(":")[0];
      if (!notifications.some(n => n.id === id)) { delete stored[key]; changed = true; }
    }
    for (const n of notifications) {
      const key = `${n.id}:${n.stateKey}`;
      if (!currentKeys.has(key) || stored[key] === undefined) { stored[key] = now; changed = true; }
      for (const existing of Object.keys(stored)) {
        if (existing.startsWith(`${n.id}:`) && existing !== key) { delete stored[existing]; changed = true; }
      }
    }
    if (changed) saveTimestamps(stored);
  }, [notifications]);

  const timestamps = useMemo(() => {
    const stored = loadTimestamps();
    const out: Record<string, number> = {};
    for (const n of notifications) { out[n.id] = stored[`${n.id}:${n.stateKey}`] ?? Date.now(); }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const results: SearchResult[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: SearchResult[] = [];
    outer: for (const unit of unitData[lang] ?? []) {
      for (const lesson of unit.lessons) {
        if (lesson.title.toLowerCase().includes(q)) {
          out.push({ type: "lesson", title: lesson.title, subtitle: `Unit ${unit.unit}: ${unit.title}`, href: "/dashboard/lessons" });
          if (out.filter(r => r.type === "lesson").length >= 3) break outer;
        }
      }
    }
    let fc = 0;
    for (const card of flashcardDecks[lang] ?? []) {
      if (card.back.toLowerCase().includes(q) || card.hint.toLowerCase().includes(q)) {
        out.push({ type: "flashcard", title: card.back, subtitle: card.hint, href: "/dashboard/flashcards" });
        if (++fc >= 3) break;
      }
    }
    let vc = 0;
    for (const word of vocabularyData[lang] ?? []) {
      if (word.meaning.toLowerCase().includes(q) || word.word.toLowerCase().includes(q) || word.romaji.toLowerCase().includes(q)) {
        out.push({ type: "vocabulary", title: word.meaning, subtitle: word.romaji || word.word, href: "/dashboard/vocabulary" });
        if (++vc >= 3) break;
      }
    }
    return out;
  }, [query, lang]);

  const unreadCount = notifications.filter(n => n.unread).length;
  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : (user?.email?.[0].toUpperCase() ?? "?");

  async function handleSaveName() {
    if (!user || !nameValue.trim()) return;
    setNameSaving(true);
    try {
      await updateProfile(user, { displayName: nameValue.trim() });
      await updateDoc(doc(db, "users", user.uid), { name: nameValue.trim() });
      setEditingName(false);
    } catch (e) {
      console.error(e);
    } finally {
      setNameSaving(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    router.push("/");
  }

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Search */}
        <div ref={searchRef} className="flex-1 max-w-xl relative">
          <div className="relative">
            <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${searchOpen && query ? "text-blue-500" : "text-gray-400"}`} />
            <Input
              type="text"
              placeholder="Search lessons, flashcards, or vocabulary"
              value={query}
              onChange={e => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={e => e.key === "Escape" && setSearchOpen(false)}
              className="pl-10 pr-10"
            />
            {query && (
              <button onClick={() => { setQuery(""); setSearchOpen(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors" aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>
          {searchOpen && query.trim().length >= 2 && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
              {results.length > 0 ? results.map((r, i) => (
                <button key={i} onClick={() => { router.push(r.href); setSearchOpen(false); setQuery(""); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors">
                  <span className="shrink-0">{TYPE_ICON[r.type]}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{r.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.subtitle}</p>
                  </div>
                </button>
              )) : (
                <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No results for &quot;{query}&quot;</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto">

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <Button variant="outline" size="icon" className="rounded-full p-2 relative" onClick={() => setNotifOpen(o => !o)} aria-label="Notifications">
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">{unreadCount}</span>
              )}
            </Button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                  {unreadCount > 0 && <span className="text-xs text-blue-500 font-medium">{unreadCount} new</span>}
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-80 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.unread ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
                      <span className="text-xl shrink-0 mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{timeAgo(timestamps[n.id] ?? Date.now())}</p>
                      </div>
                      {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Avatar + dropdown */}
          <div ref={avatarRef} className="relative flex items-center gap-1">
            <button
              onClick={() => { setAvatarOpen(o => !o); setEditingName(false); }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors overflow-hidden shrink-0 cursor-pointer"
              aria-label="Account menu"
            >
              {user?.photoURL
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.photoURL} alt="avatar" className="h-full w-full object-cover" />
                : initials
              }
            </button>
            <button
              onClick={() => { setAvatarOpen(o => !o); setEditingName(false); }}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Toggle account menu"
            >
              {avatarOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* Dropdown */}
            {avatarOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">

                {/* Name row */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        autoFocus
                        value={nameValue}
                        onChange={e => setNameValue(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                        className="w-0 flex-1 min-w-0 text-sm px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button onClick={handleSaveName} disabled={nameSaving} className="shrink-0 text-xs text-blue-500 font-semibold hover:text-blue-700 cursor-pointer disabled:opacity-50 px-1">
                        {nameSaving ? "…" : "Save"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.displayName ?? "User"}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { setNameValue(user?.displayName ?? ""); setEditingName(true); }}
                        className="shrink-0 text-blue-400 hover:text-blue-600 active:text-blue-800 transition cursor-pointer"
                        title="Edit name"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Audio placeholder — will be wired up later */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Volume2 size={15} className="text-gray-400" />
                    <span>Audio</span>
                  </div>
                  <span className="text-xs text-gray-400 italic">coming soon</span>
                </div>

                {/* Profile link */}
                <button
                  onClick={() => { setAvatarOpen(false); router.push("/dashboard/profile"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
                >
                  <User size={15} className="text-gray-400" />
                  View full profile
                </button>

                {/* Log out */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer border-t border-gray-100 dark:border-gray-800"
                >
                  <LogOut size={15} />
                  Log out
                </button>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
  