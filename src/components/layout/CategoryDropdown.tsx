"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface CategoryDropdownProps {
  category: Category;
  isOpen: boolean;
}

export function CategoryDropdown({ category, isOpen }: CategoryDropdownProps) {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) return null;

  return (
    <div className="absolute top-full left-0 bg-white shadow-xl border border-gray-100 rounded-b-sm py-4 px-6 z-40 min-w-[340px] text-left">
      <div className="mb-2 pb-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          {category.name}
        </span>
        <Link
          href={`/search?category=${category.slug}`}
          className="text-[11px] font-semibold text-gray-500 hover:text-blue-600 flex items-center"
        >
          View All <ChevronRight className="w-3 h-3 ml-0.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {category.subcategories.map((sub, idx) => (
          <div key={idx} className="group/sub">
            <Link
              href={`/search?category=${category.slug}&subCategory=${sub.slug}`}
              className="text-xs font-bold text-gray-800 hover:text-blue-600 flex items-center justify-between"
            >
              <span>{sub.name}</span>
              <ChevronRight className="w-3 h-3 text-gray-300 group-hover/sub:text-blue-600 transition-transform group-hover/sub:translate-x-0.5" />
            </Link>

            {sub.popularItems && sub.popularItems.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                {sub.popularItems.map((item, pIdx) => (
                  <Link
                    key={pIdx}
                    href={`/search?search=${encodeURIComponent(item)}`}
                    className="text-[11px] text-gray-500 hover:text-blue-600 hover:underline"
                  >
                    {item}
                    {pIdx < sub.popularItems!.length - 1 && <span className="ml-2 text-gray-300">•</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
