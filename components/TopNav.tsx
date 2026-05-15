"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { Bell, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TopNav() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            L
          </span>
          <span>Linguiny</span>
        </Link>
        <div className="flex-1 max-w-xl">
          <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search lessons, flashcards, or vocabulary" />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="rounded-full p-2">
            <Bell size={18} aria-hidden="true" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full p-2">
            <UserCircle size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}