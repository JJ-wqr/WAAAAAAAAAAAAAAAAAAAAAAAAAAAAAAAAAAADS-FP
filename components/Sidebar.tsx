"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";
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
  Bell,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
} from "lucide-react";
import { useLang } from "@/components/languageprovider";
import { LANGUAGES } from "@/lib/languages";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/lessons", label: "Lessons", icon: GraduationCap },
  { href: "/dashboard/vocabulary", label: "Vocabulary", icon: BookOpen },
  { href: "/dashboard/flashcards", label: "Flashcards", icon: FlipHorizontal2 },
  { href: "/dashboard/conversation", label: "Conversation", icon: MessageCircle },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const selectedThemeOption = THEME_OPTIONS.find((o) => o.value === theme) ?? THEME_OPTIONS[1];
  const SelectedThemeIcon = selectedThemeOption.icon;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-blue-600 text-white shadow-lg"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed inset-y-0 left-0 flex flex-col transform transition-all duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed && !isHovered ? "w-16 lg:w-16" : "w-64 lg:w-64"} ${(!collapsed || isHovered) ? "shadow-2xl" : ""}`}
        style={{ background: "var(--bg-sidebar)" }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          onClick={closeMobileMenu}
          className="px-4 py-4 flex items-center gap-3 border-b border-white/10 justify-between cursor-pointer hover:opacity-90"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <Image
                src="/logo-symbol.png"
                alt="Linguiny Logo"
                width={36}
                height={36}
              />
            </div>
            {(!collapsed || isHovered) && (
              <span className="text-white font-bold text-xl tracking-tight">Linguiny</span>
            )}
          </div>
          {/* collapse toggle removed per design request */}
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-2 py-5 space-y-1 overflow-hidden" role="navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isRootDashboard = href === "/dashboard";
            const active = isRootDashboard
              ? pathname === href
              : pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "text-white"
                    : "text-blue-200/70 hover:text-white hover:bg-white/5"
                }`}
                style={active ? { background: "#4a7cf7" } : {}}
                aria-current={active ? "page" : undefined}
                title={collapsed && !isHovered ? label : undefined}
              >
                <div className="w-6 flex items-center justify-center">
                  <Icon size={18} aria-hidden="true" />
                </div>
                {(!collapsed || isHovered) && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle */}
        <div className="px-3 pb-4">
          <p className={`text-xs text-blue-200/40 px-1 mb-1.5 font-medium ${collapsed && !isHovered ? "hidden" : "block"}`}>Theme</p>
          {(!collapsed || isHovered) ? (
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
                  aria-label={`Switch to ${label.toLowerCase()} theme`}
                  aria-pressed={theme === value}
                >
                  <Icon size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-2 rounded-xl bg-white/5 mx-2">
              <SelectedThemeIcon size={16} className="text-blue-200" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Language Selector */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          {(!collapsed || isHovered) ? (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5">
              <Globe size={15} className="text-blue-300 shrink-0" aria-hidden="true" />
              <select
                className="text-sm font-medium text-gray-700 bg-transparent border-none outline-none cursor-pointer"
                value={lang}
                onChange={(e) => setLang(e.target.value as import("@/lib/languages").LangCode)}
                aria-label="Select language"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center justify-center p-2.5 rounded-xl bg-white/5 mx-1 hover:bg-white/10 transition-colors cursor-pointer" title="Select language">
              <Globe size={18} className="text-blue-300" aria-hidden="true" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
