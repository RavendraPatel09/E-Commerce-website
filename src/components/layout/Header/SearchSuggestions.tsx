"use client";

import React, { useEffect, useRef } from "react";
import { Search, TrendingUp, Sparkles, ShoppingBag, CornerDownLeft } from "lucide-react";

export interface SuggestionItem {
  type: "product" | "brand" | "category" | "trending";
  text: string;
  link?: string;
  category?: string;
}

interface SearchSuggestionsProps {
  suggestions: SuggestionItem[];
  isOpen: boolean;
  activeIndex: number;
  onSelect: (item: SuggestionItem) => void;
  onHover: (index: number) => void;
}

export function SearchSuggestions({
  suggestions,
  isOpen,
  activeIndex,
  onSelect,
  onHover,
}: SearchSuggestionsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeElement = listRef.current.children[activeIndex + 1] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex]);

  if (!isOpen || suggestions.length === 0) return null;

  return (
    <div
      ref={listRef}
      className="absolute left-0 right-0 top-full mt-1 bg-white rounded-sm shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800 text-sm animate-in fade-in slide-in-from-top-1 duration-100"
    >
      {/* Suggestions Header */}
      <div className="px-4 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 flex items-center justify-between border-b border-gray-100">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-600" />
          <span>Suggestions</span>
        </span>
        <span className="text-[10px] text-gray-400 font-normal">
          Use <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono text-[9px]">↑</kbd> <kbd className="px-1 py-0.5 bg-gray-200 rounded font-mono text-[9px]">↓</kbd> to navigate
        </span>
      </div>

      {/* Suggestion Rows */}
      <div className="max-h-80 overflow-y-auto scrollbar-thin">
        {suggestions.map((item, idx) => {
          const isSelected = idx === activeIndex;

          return (
            <div
              key={idx}
              onMouseEnter={() => onHover(idx)}
              onClick={() => onSelect(item)}
              className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors border-b border-gray-50 last:border-0 ${
                isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                {item.type === "trending" ? (
                  <TrendingUp className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-orange-500"}`} />
                ) : item.type === "brand" ? (
                  <ShoppingBag className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-blue-500"}`} />
                ) : (
                  <Search className={`w-4 h-4 shrink-0 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                )}

                <span className={`font-medium truncate max-w-[360px] ${isSelected ? "font-bold text-blue-700" : ""}`}>
                  {item.text}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {item.category && (
                  <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize">
                    in {item.category}
                  </span>
                )}
                {isSelected && (
                  <CornerDownLeft className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
