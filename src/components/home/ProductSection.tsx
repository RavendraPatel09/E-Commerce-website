"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { ProductCarousel } from "./ProductCarousel";
import { Clock, ChevronRight } from "lucide-react";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  dealTag?: string;
  viewAllLink: string;
  products: Product[];
  timerEndTime?: string;
}

export function ProductSection({
  title,
  subtitle,
  dealTag,
  viewAllLink,
  products,
  timerEndTime,
}: ProductSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!timerEndTime) return;

    const target = new Date(timerEndTime).getTime();
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [timerEndTime]);

  if (!products || products.length === 0) return null;

  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-sm p-4 mb-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2 mb-3">
        <div className="flex items-center flex-wrap gap-3">
          <div>
            <h3 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 font-normal mt-0.5">{subtitle}</p>
            )}
          </div>

          {dealTag && (
            <span className="bg-emerald-50 text-[#388e3c] border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-[2px]">
              {dealTag}
            </span>
          )}

          {timeLeft && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-sm">
              <Clock className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span className="font-mono text-red-600">
                {String(timeLeft.hours).padStart(2, "0")}h :{" "}
                {String(timeLeft.minutes).padStart(2, "0")}m :{" "}
                {String(timeLeft.seconds).padStart(2, "0")}s Left
              </span>
            </div>
          )}
        </div>

        <Link
          href={viewAllLink}
          className="self-start sm:self-auto bg-[#2874f0] hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-sm shadow-sm transition-colors flex items-center gap-1 shrink-0"
        >
          <span>VIEW ALL</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Product Carousel */}
      <ProductCarousel products={products} />
    </div>
  );
}
