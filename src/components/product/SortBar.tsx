"use client";

import React from "react";

interface SortBarProps {
  currentSort: string;
  onSortChange: (sort: string) => void;
  totalResults: number;
}

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "popularity", label: "Popularity" },
  { id: "price_asc", label: "Price -- Low to High" },
  { id: "price_desc", label: "Price -- High to Low" },
  { id: "newest", label: "Newest First" },
  { id: "discount", label: "Discount" },
];

export function SortBar({ currentSort, onSortChange, totalResults }: SortBarProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mb-3 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1 w-full sm:w-auto">
        <span className="font-bold text-gray-800 shrink-0">Sort By</span>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {SORT_OPTIONS.map((opt) => {
            const isActive = currentSort === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSortChange(opt.id)}
                className={`pb-1 font-semibold whitespace-nowrap transition-colors relative shrink-0 ${
                  isActive
                    ? "text-[#2874f0] font-bold border-b-2 border-[#2874f0]"
                    : "text-gray-600 hover:text-[#2874f0]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-gray-500 font-medium shrink-0 text-left sm:text-right">
        <span>{totalResults === 1 ? "1 item" : `${totalResults} items`}</span>
      </div>
    </div>
  );
}
