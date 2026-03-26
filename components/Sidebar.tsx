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
} from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { LANGUAGES } from "@/lib/languages";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/lessons", label: "Lessons", icon: GraduationCap },
  { href: "/dashboard/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: FlipHorizontal2 },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { lang, setLang } = useLang();

  return (
    <aside className="w-64 min-h-screen flex flex-col" style={{ background: "#1a2744" }}>
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
