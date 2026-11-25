"use client";

import React from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { SearchX, RotateCcw } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  onClearFilters?: () => void;
}

export function ProductGrid({ products, onClearFilters }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-12 text-center my-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          Sorry, no products found!
        </h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Please check the spelling or try loosening your price, brand, or discount filters.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1.5 bg-[#2874f0] text-white font-bold text-xs px-5 py-2.5 rounded-sm hover:bg-blue-600 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} layout="grid" />
      ))}
    </div>
  );
}
