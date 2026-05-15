"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider.");
  }
  return context;
}

interface TabsProps {
  defaultTab?: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultTab = "", children, className }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      <nav className="flex space-x-8" aria-label="Tabs">
        {children}
      </nav>
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function TabsTrigger({ value, disabled = false, className, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <button
      type="button"
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(
        "whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors",
        activeTab === value
          ? "border-blue-500 text-blue-600 dark:text-blue-400"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-current={activeTab === value ? "page" : undefined}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: ReactNode;
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) {
    return null;
  }

  return <div className={cn("mt-4", className)}>{children}</div>;
}
