"use client";

import React, { useRef } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "../product/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Scroll Left Button */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-16 bg-white/95 hover:bg-white shadow-xl border border-gray-200 flex items-center justify-center rounded-r opacity-0 group-hover/carousel:opacity-100 transition-all text-gray-800 disabled:opacity-0"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Horizontal List */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[220px] md:w-[240px] shrink-0">
            <ProductCard product={product} layout="carousel" />
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-16 bg-white/95 hover:bg-white shadow-xl border border-gray-200 flex items-center justify-center rounded-l opacity-0 group-hover/carousel:opacity-100 transition-all text-gray-800 disabled:opacity-0"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
