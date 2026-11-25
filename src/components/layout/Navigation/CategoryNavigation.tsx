"use client";

import React, { useState } from "react";
import { SEED_CATEGORIES } from "@/lib/db";
import { CategoryItem } from "./CategoryItem";
import { CategoryDropdown } from "./CategoryDropdown";

interface CategoryNavigationProps {
  className?: string;
}

export function CategoryNavigation({ className = "" }: CategoryNavigationProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const activeCategory = SEED_CATEGORIES.find((c) => c.id === activeCategoryId);

  return (
    <nav
      className={`w-full bg-white shadow-sm border-b border-gray-200 relative z-30 ${className}`}
      aria-label="Category Navigation"
    >
      <div className="max-w-[1360px] mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between overflow-x-auto py-2 scrollbar-none gap-1 sm:gap-2">
          {SEED_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={() => setActiveCategoryId(cat.id)}
              onMouseLeave={() => setActiveCategoryId(null)}
            >
              <CategoryItem
                category={cat}
                isActive={activeCategoryId === cat.id}
                onMouseEnter={() => setActiveCategoryId(cat.id)}
                onMouseLeave={() => setActiveCategoryId(null)}
              />

              {/* Mega Dropdown */}
              <CategoryDropdown
                category={cat}
                isOpen={activeCategoryId === cat.id}
                onClose={() => setActiveCategoryId(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
