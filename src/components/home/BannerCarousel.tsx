"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { PromotionalBanner } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BannerCarouselProps {
  banners: PromotionalBanner[];
}

export function BannerCarousel({ banners }: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full h-[240px] md:h-[320px] lg:h-[360px] overflow-hidden bg-gray-900 group shadow-sm">
      {/* Slides */}
      {banners.map((banner, index) => {
        const isActive = index === current;
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            {/* Background Image */}
            <div className="relative w-full h-full">
              <Image
                src={banner.imageUrl}
                alt={banner.title}
                fill
                priority={index === 0}
                className="object-cover object-center filter brightness-90"
              />
              {/* Luxury dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>

            {/* Banner Text Content */}
            <div className="absolute inset-0 max-w-[1360px] mx-auto px-6 md:px-12 flex flex-col justify-center text-white z-20">
              <div className="max-w-xl space-y-2">
                {banner.badge && (
                  <span className="inline-block bg-[#ffe11b] text-gray-950 text-[10px] md:text-xs font-black uppercase px-2.5 py-1 rounded-[2px] tracking-wider">
                    {banner.badge}
                  </span>
                )}
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {banner.title}
                </h2>
                <p className="text-sm md:text-base text-gray-200 line-clamp-2 max-w-lg">
                  {banner.subtitle}
                </p>
                <div className="pt-2">
                  <Link
                    href={banner.ctaLink}
                    className="inline-flex items-center gap-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs md:text-sm px-6 py-2.5 rounded-sm shadow-md transition-all active:scale-95"
                  >
                    <span>{banner.ctaText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-r shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-l shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === current ? "w-7 bg-[#ffe11b]" : "w-2 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
