"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/types";
import { ProductCard } from "../product/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScrollability();
    const node = scrollRef.current;
    if (node) {
      node.addEventListener("scroll", checkScrollability, { passive: true });
      window.addEventListener("resize", checkScrollability);
      return () => {
        node.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [checkScrollability, products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollability, 350);
    }
  };

  return (
    <div className="relative group/carousel w-full">
      {/* Scroll Left Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-white/95 hover:bg-white shadow-xl border border-gray-200/80 flex items-center justify-center rounded-r-md transition-all text-gray-800 hover:text-blue-600 hover:scale-105 active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-3 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[220px] md:w-[240px] shrink-0 flex flex-col">
            <ProductCard product={product} layout="carousel" />
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-white/95 hover:bg-white shadow-xl border border-gray-200/80 flex items-center justify-center rounded-l-md transition-all text-gray-800 hover:text-blue-600 hover:scale-105 active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
