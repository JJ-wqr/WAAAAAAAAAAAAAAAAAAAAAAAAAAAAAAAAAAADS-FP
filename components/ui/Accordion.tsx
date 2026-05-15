"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  type?: "single" | "multiple";
  defaultExpanded?: string[];
  className?: string;
}

export function Accordion({
  items,
  type = "single",
  defaultExpanded = [],
  className
}: AccordionProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpanded);

  const toggleItem = (id: string) => {
    if (type === "single") {
      setExpandedItems(expandedItems.includes(id) ? [] : [id]);
    } else {
      setExpandedItems(
        expandedItems.includes(id)
          ? expandedItems.filter(item => item !== id)
          : [...expandedItems, id]
      );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const isExpanded = expandedItems.includes(item.id);

        return (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-center justify-between p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              aria-expanded={isExpanded}
              aria-controls={`accordion-content-${item.id}`}
            >
              <span className="font-medium text-gray-900 dark:text-white">
                {item.title}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  "text-gray-500 transition-transform duration-200",
                  isExpanded && "transform rotate-180"
                )}
              />
            </button>

            {isExpanded && (
              <div
                id={`accordion-content-${item.id}`}
                className="px-4 pb-4 text-gray-700 dark:text-gray-300"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}