"use client";

import Link from "next/link";
import { Globe } from "lucide-react";
import { Footer } from "@/components/Footer";

interface PublicShellProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function PublicShell({ title, description, children }: PublicShellProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-base)]">
      <header className="relative overflow-hidden pb-10">
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-r from-sky-500 to-blue-600 opacity-40 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="inline-flex items-center gap-3 text-xl font-semibold text-slate-900 dark:text-white">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
                <Globe size={18} />
              </span>
              Linguiny
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-700 transition text-white">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="mt-8 rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur-xl">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title ?? "Welcome to Linguiny"}
            </h1>
            {description ? (
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">{description}</p>
            ) : (
              <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
                Learn faster with a polished study flow, smart flashcards, and interactive lessons built for real progress.
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {children}
      </main>

      <Footer />
    </div>
  );
}
