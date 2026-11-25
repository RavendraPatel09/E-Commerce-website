"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/lib/types";
import { ChevronRight } from "lucide-react";

interface CategoryDropdownProps {
  category: Category;
  isOpen: boolean;
  leftOffset?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
}

export function CategoryDropdown({
  category,
  isOpen,
  leftOffset = 0,
  onMouseEnter,
  onMouseLeave,
  onClose,
}: CategoryDropdownProps) {
  if (!isOpen || !category.subcategories || category.subcategories.length === 0) return null;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ left: `${Math.max(16, Math.min(leftOffset, 900))}px` }}
      className="absolute top-full bg-white shadow-2xl border border-gray-200 rounded-b-sm py-4 px-6 z-50 min-w-[340px] max-w-[420px] text-left animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="mb-3 pb-2 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-[#2874f0]">
          {category.name}
        </span>
        <Link
          href={`/search?category=${category.slug}`}
          onClick={onClose}
          className="text-[11px] font-bold text-gray-500 hover:text-blue-600 flex items-center gap-0.5"
        >
          <span>View All in {category.name}</span>
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-thin pr-1">
        {category.subcategories.map((sub, idx) => (
          <div key={idx} className="group/sub">
            <Link
              href={`/search?category=${category.slug}&subCategory=${sub.slug}`}
              onClick={onClose}
              className="text-xs font-bold text-gray-900 hover:text-blue-600 flex items-center justify-between"
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
                    onClick={onClose}
                    className="text-[11px] text-gray-500 hover:text-blue-600 hover:underline transition-colors"
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
