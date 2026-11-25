"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";
import {
  ShoppingBasket,
  Smartphone,
  Shirt,
  Laptop,
  Armchair,
  Tv,
  Plane,
  Sparkles,
  Bike,
  ChevronDown,
} from "lucide-react";

interface CategoryItemProps {
  category: Category;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = {
  ShoppingBasket: <ShoppingBasket className="w-8 h-8 md:w-9 md:h-9 text-green-600 group-hover:scale-110 transition-transform duration-200" />,
  Smartphone: <Smartphone className="w-8 h-8 md:w-9 md:h-9 text-blue-600 group-hover:scale-110 transition-transform duration-200" />,
  Shirt: <Shirt className="w-8 h-8 md:w-9 md:h-9 text-rose-500 group-hover:scale-110 transition-transform duration-200" />,
  Laptop: <Laptop className="w-8 h-8 md:w-9 md:h-9 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />,
  Armchair: <Armchair className="w-8 h-8 md:w-9 md:h-9 text-amber-700 group-hover:scale-110 transition-transform duration-200" />,
  Tv: <Tv className="w-8 h-8 md:w-9 md:h-9 text-purple-600 group-hover:scale-110 transition-transform duration-200" />,
  Plane: <Plane className="w-8 h-8 md:w-9 md:h-9 text-sky-500 group-hover:scale-110 transition-transform duration-200" />,
  Sparkles: <Sparkles className="w-8 h-8 md:w-9 md:h-9 text-amber-500 group-hover:scale-110 transition-transform duration-200" />,
  Bike: <Bike className="w-8 h-8 md:w-9 md:h-9 text-teal-600 group-hover:scale-110 transition-transform duration-200" />,
};

export function CategoryItem({
  category,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: CategoryItemProps) {
  const hasSub = category.subcategories && category.subcategories.length > 0;

  return (
    <div
      className="relative group shrink-0"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={`/search?category=${category.slug}`}
        className="flex flex-col items-center justify-center px-2 sm:px-3 py-1 group-hover:text-blue-600 transition-colors select-none"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center mb-1">
          {CATEGORY_ICON_MAP[category.icon] || <ShoppingBasket className="w-8 h-8 text-blue-600" />}
        </div>

        <div className="flex items-center gap-0.5">
          <span className="text-xs sm:text-[13px] font-semibold text-gray-800 group-hover:text-blue-600 whitespace-nowrap">
            {category.name}
          </span>
          {hasSub && (
            <ChevronDown
              className={`w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-transform duration-150 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </Link>
    </div>
  );
}
