"use client";

import React, { useState, useRef } from "react";
import { SEED_CATEGORIES } from "@/lib/db";
import { CategoryItem } from "./CategoryItem";
import { CategoryDropdown } from "./CategoryDropdown";

interface CategoryNavigationProps {
  className?: string;
}

export function CategoryNavigation({ className = "" }: CategoryNavigationProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [leftOffset, setLeftOffset] = useState<number>(0);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterItem = (catId: string, event: React.MouseEvent<HTMLDivElement>) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    const cat = SEED_CATEGORIES.find((c) => c.id === catId);
    if (!cat?.subcategories || cat.subcategories.length === 0) {
      setActiveCategoryId(null);
      return;
    }

    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const itemRect = event.currentTarget.getBoundingClientRect();
      const calculatedLeft = itemRect.left - navRect.left;
      setLeftOffset(calculatedLeft);
    }
    setActiveCategoryId(catId);
  };

  const handleMouseLeaveItem = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategoryId(null);
    }, 180);
  };

  const handleMouseEnterDropdown = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleMouseLeaveDropdown = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveCategoryId(null);
    }, 180);
  };

  const activeCategory = SEED_CATEGORIES.find((c) => c.id === activeCategoryId);

  return (
    <nav
      ref={navRef}
      className={`w-full bg-white shadow-sm border-b border-gray-200 relative z-30 ${className}`}
      aria-label="Category Navigation"
    >
      <div className="max-w-[1360px] mx-auto px-2 sm:px-4">
        {/* Horizontal scrollable category list */}
        <div className="flex items-center justify-between overflow-x-auto py-2 scrollbar-none gap-1 sm:gap-2">
          {SEED_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative"
              onMouseEnter={(e) => handleMouseEnterItem(cat.id, e)}
              onMouseLeave={handleMouseLeaveItem}
            >
              <CategoryItem
                category={cat}
                isActive={activeCategoryId === cat.id}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mega-Dropdown rendered outside overflow-x-auto to eliminate vertical clipping */}
      {activeCategory && (
        <div className="max-w-[1360px] mx-auto relative px-2 sm:px-4">
          <CategoryDropdown
            category={activeCategory}
            isOpen={!!activeCategoryId}
            leftOffset={leftOffset}
            onMouseEnter={handleMouseEnterDropdown}
            onMouseLeave={handleMouseLeaveDropdown}
            onClose={() => setActiveCategoryId(null)}
          />
        </div>
      )}
    </nav>
  );
}
