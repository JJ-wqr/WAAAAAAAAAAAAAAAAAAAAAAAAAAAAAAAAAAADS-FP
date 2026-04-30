"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FlipHorizontal2,
  Trophy,
  GraduationCap,
  User,
  LogOut,
  Globe,
  MessageCircle,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { LANGUAGES } from "@/lib/languages";
import { useTheme } from "next-themes";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/lessons", label: "Lessons", icon: GraduationCap },
  { href: "/dashboard/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: FlipHorizontal2 },
  { href: "/dashboard/conversation", label: "Conversation", icon: MessageCircle },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const THEME_OPTIONS = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "system", icon: Monitor, label: "Auto" },
  { value: "dark", icon: Moon, label: "Dark" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: "var(--bg-sidebar)" }}>
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ background: "#4a7cf7" }}>
          <Globe size={20} />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Linguiny</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "text-white"
                  : "text-blue-200/70 hover:text-white hover:bg-white/5"
              }`}
              style={active ? { background: "#4a7cf7" } : {}}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className="px-3 pb-2">
        <p className="text-xs text-blue-200/40 px-1 mb-1.5 font-medium">Theme</p>
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5">
          {THEME_OPTIONS.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              title={label}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${
                theme === value
                  ? "bg-white/20 text-white"
                  : "text-blue-200/50 hover:text-blue-200 hover:bg-white/10"
              }`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector */}
      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5">
          <Globe size={15} className="text-blue-300 shrink-0" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="flex-1 bg-transparent text-blue-200/90 text-xs font-medium border-none outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code} className="text-gray-800 bg-white">
                {l.flag} {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Logout */}
      <div className="px-3 pb-6">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-blue-200/70 hover:text-white hover:bg-white/5 transition-all"
        >
          <LogOut size={18} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
