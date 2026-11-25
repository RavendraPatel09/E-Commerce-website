"use client";

import React from "react";
import Link from "next/link";
import { Search, TrendingUp, Sparkles, ShoppingBag } from "lucide-react";

interface SearchSuggestion {
  type: string;
  text: string;
  link?: string;
  category?: string;
}

interface SearchDropdownProps {
  suggestions: SearchSuggestion[];
  isOpen: boolean;
  onSelect: (item: SearchSuggestion) => void;
}

export function SearchDropdown({ suggestions, isOpen, onSelect }: SearchDropdownProps) {
  if (!isOpen || suggestions.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-sm shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800 text-sm">
      <div className="py-1">
        <div className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 flex items-center justify-between">
          <span>Discover Products & Brands</span>
          <span className="text-blue-600 flex items-center gap-1 font-medium lowercase">
            <Sparkles className="w-3 h-3" /> live search
          </span>
        </div>

        {suggestions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelect(item)}
            className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between transition-colors border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              {item.type === "trending" ? (
                <TrendingUp className="w-4 h-4 text-orange-500 shrink-0" />
              ) : item.type === "brand" ? (
                <ShoppingBag className="w-4 h-4 text-blue-600 shrink-0" />
              ) : (
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
              )}
              <span className="font-medium text-gray-700 hover:text-blue-600 truncate max-w-[400px]">
                {item.text}
              </span>
            </div>
            {item.category && (
              <span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                in {item.category}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
