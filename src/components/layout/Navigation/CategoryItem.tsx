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
  ShoppingBasket: <ShoppingBasket className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 group-hover:scale-105 transition-transform duration-200" />,
  Smartphone: <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 group-hover:scale-105 transition-transform duration-200" />,
  Shirt: <Shirt className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 group-hover:scale-105 transition-transform duration-200" />,
  Laptop: <Laptop className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 group-hover:scale-105 transition-transform duration-200" />,
  Armchair: <Armchair className="w-6 h-6 sm:w-7 sm:h-7 text-amber-700 group-hover:scale-105 transition-transform duration-200" />,
  Tv: <Tv className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 group-hover:scale-105 transition-transform duration-200" />,
  Plane: <Plane className="w-6 h-6 sm:w-7 sm:h-7 text-sky-500 group-hover:scale-105 transition-transform duration-200" />,
  Sparkles: <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500 group-hover:scale-105 transition-transform duration-200" />,
  Bike: <Bike className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 group-hover:scale-105 transition-transform duration-200" />,
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
        href={`/category/${category.slug}`}
        className="flex flex-col items-center justify-center px-2 sm:px-3 py-1 group-hover:text-[#2874f0] transition-colors select-none"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-1.5 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-200 shadow-xs">
          {CATEGORY_ICON_MAP[category.icon] || <ShoppingBasket className="w-6 h-6 text-blue-600" />}
        </div>

        <div className="flex items-center gap-0.5">
          <span className="text-xs sm:text-[13px] font-bold text-gray-800 group-hover:text-[#2874f0] whitespace-nowrap">
            {category.name}
          </span>
          {hasSub && (
            <ChevronDown
              className={`w-3 h-3 text-gray-400 group-hover:text-[#2874f0] transition-transform duration-150 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </Link>
    </div>
  );
}
