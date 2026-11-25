"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SEED_CATEGORIES } from "@/lib/db";
import { CategoryDropdown } from "./CategoryDropdown";
import {
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  Sparkles,
  Armchair,
  ShoppingBasket,
  ChevronDown,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-9 h-9 text-blue-600 group-hover:scale-105 transition-transform" />,
  Laptop: <Laptop className="w-9 h-9 text-indigo-600 group-hover:scale-105 transition-transform" />,
  Tv: <Tv className="w-9 h-9 text-amber-600 group-hover:scale-105 transition-transform" />,
  Shirt: <Shirt className="w-9 h-9 text-rose-500 group-hover:scale-105 transition-transform" />,
  Sparkles: <Sparkles className="w-9 h-9 text-purple-600 group-hover:scale-105 transition-transform" />,
  Armchair: <Armchair className="w-9 h-9 text-emerald-600 group-hover:scale-105 transition-transform" />,
  ShoppingBasket: <ShoppingBasket className="w-9 h-9 text-green-600 group-hover:scale-105 transition-transform" />,
};

export function CategoryBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-[1360px] mx-auto px-4">
        <div className="flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none gap-2">
          {SEED_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="relative group shrink-0"
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={`/search?category=${cat.slug}`}
                className="flex flex-col items-center justify-center px-3 py-1 group-hover:text-blue-600 transition-colors"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-1">
                  {ICON_MAP[cat.icon] || <Smartphone className="w-8 h-8 text-blue-600" />}
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-[13px] font-semibold text-gray-800 group-hover:text-blue-600 whitespace-nowrap">
                    {cat.name}
                  </span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-blue-600 group-hover:rotate-180 transition-transform" />
                  )}
                </div>
              </Link>

              <CategoryDropdown
                category={cat}
                isOpen={activeCategory === cat.id}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
