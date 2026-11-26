import React from "react";

export function ProductCardSkeleton({ layout = "grid" }: { layout?: "grid" | "carousel" }) {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-sm p-3.5 flex flex-col justify-between animate-pulse ${
        layout === "carousel" ? "w-[240px] shrink-0" : "w-full"
      }`}
    >
      {/* Top tag & heart skeleton */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-16 h-3.5 bg-gray-200 rounded" />
        <div className="w-5 h-5 bg-gray-200 rounded-full" />
      </div>

      {/* Image box skeleton */}
      <div className="w-full pt-[85%] bg-gray-100 rounded mb-3 relative overflow-hidden" />

      {/* Info body */}
      <div className="space-y-2">
        <div className="w-12 h-2.5 bg-gray-200 rounded" />
        <div className="w-full h-3.5 bg-gray-200 rounded" />
        <div className="w-3/4 h-3.5 bg-gray-200 rounded" />

        {/* Rating & Assured pill */}
        <div className="flex items-center justify-between pt-1">
          <div className="w-16 h-4 bg-gray-200 rounded-sm" />
          <div className="w-12 h-3.5 bg-gray-200 rounded" />
        </div>

        {/* Price & Discount */}
        <div className="pt-2 border-t border-gray-50 flex items-baseline gap-2">
          <div className="w-20 h-5 bg-gray-300 rounded" />
          <div className="w-12 h-3.5 bg-gray-200 rounded" />
        </div>

        {/* Button */}
        <div className="w-full h-7 bg-gray-200 rounded-sm mt-2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} layout="grid" />
      ))}
    </div>
  );
}

export function BannerSkeleton() {
  return (
    <div className="w-full h-[240px] md:h-[320px] lg:h-[360px] bg-gray-200 rounded-sm animate-pulse relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-shimmer" />
    </div>
  );
}

export function CategoryBarSkeleton() {
  return (
    <div className="w-full bg-white shadow-sm border-b border-gray-200 py-3">
      <div className="max-w-[1360px] mx-auto px-4 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0 animate-pulse">
            <div className="w-12 h-12 rounded-full bg-gray-200" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
