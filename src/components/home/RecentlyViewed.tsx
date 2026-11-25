"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { ProductCarousel } from "./ProductCarousel";
import { History, Trash2, Sparkles } from "lucide-react";

interface RecentlyViewedProps {
  fallbackProducts: Product[];
}

export function RecentlyViewed({ fallbackProducts }: RecentlyViewedProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [isFromHistory, setIsFromHistory] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("bharatkart_recently_viewed");
      if (raw) {
        const ids: string[] = JSON.parse(raw);
        const matched = ids
          .map((id) => fallbackProducts.find((p) => p.id === id))
          .filter(Boolean) as Product[];

        if (matched.length > 0) {
          setIsFromHistory(true);
          // If fewer than 4 items in history, supplement with fallback products not already in history
          const remaining = fallbackProducts.filter(
            (p) => !matched.some((m) => m.id === p.id)
          );
          setItems([...matched, ...remaining].slice(0, 10));
          return;
        }
      }
    } catch {
      // Ignore localStorage error
    }

    // Default to fallback products
    setItems(fallbackProducts.slice(0, 8));
  }, [fallbackProducts]);

  const clearHistory = () => {
    try {
      localStorage.removeItem("bharatkart_recently_viewed");
    } catch {
      // Ignore
    }
    setIsFromHistory(false);
    setItems(fallbackProducts.slice(0, 8));
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-sm p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div className="flex items-center gap-2">
          {isFromHistory ? (
            <History className="w-5 h-5 text-blue-600" />
          ) : (
            <Sparkles className="w-5 h-5 text-amber-500" />
          )}
          <div>
            <h3 className="text-base md:text-lg font-extrabold text-gray-900">
              {isFromHistory
                ? "Recently Viewed Items & Inspired By Your Browsing"
                : "Trending Picks & Suggested For You"}
            </h3>
            <p className="text-xs text-gray-500 font-normal">
              {isFromHistory
                ? "Based on the products you checked out recently"
                : "Handpicked selections from our top sellers"}
            </p>
          </div>
        </div>

        {isFromHistory && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded hover:bg-red-50"
            title="Clear browsing history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear History</span>
          </button>
        )}
      </div>

      {/* Reusable ProductCarousel */}
      <ProductCarousel products={items} />
    </div>
  );
}
