import React from "react";
import { db } from "@/lib/db";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { ProductSection } from "@/components/home/ProductSection";
import { FeaturedBrands } from "@/components/home/FeaturedBrands";
import { DealCard } from "@/components/home/DealCard";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import { Sparkles, Zap, Flame, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const banners = db.getAllBanners();
  const allProducts = db.getAllProducts();
  const sections = db.getAllSections();

  // Featured deal cards
  const deals = [
    {
      title: "Smartphones & Foldables",
      discountText: "From ₹14,999",
      category: "Mobiles",
      imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=400&q=80",
      href: "/search?category=mobiles",
    },
    {
      title: "Active Noise Cancelling",
      discountText: "Min 25% Off",
      category: "Audio",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80",
      href: "/search?category=electronics&subCategory=audio",
    },
    {
      title: "OLED & QLED 4K TVs",
      discountText: "Up to 36% Off",
      category: "Appliances",
      imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80",
      href: "/search?category=appliances&subCategory=televisions",
    },
    {
      title: "Retro High Sneakers",
      discountText: "Exclusive Drops",
      category: "Fashion",
      imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80",
      href: "/search?category=fashion&subCategory=footwear",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 1. Hero Promotional Banner Carousel */}
      <BannerCarousel banners={banners} />

      {/* 2. Bank Instant Discount Bar */}
      <PromotionalBanner />

      {/* 3. Top Deal Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {deals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>

      {/* 4. Dynamic Product Sections (Best of Electronics, Top Offers, Fashion Deals) */}
      {sections.map((sec) => {
        const secProducts = sec.productIds
          .map((id) => allProducts.find((p) => p.id === id))
          .filter(Boolean) as any[];

        return (
          <ProductSection
            key={sec.id}
            title={sec.title}
            subtitle={sec.subtitle}
            dealTag={sec.dealTag}
            viewAllLink={sec.viewAllLink}
            products={secProducts}
            timerEndTime={sec.timerEndTime}
          />
        );
      })}

      {/* 5. Featured Brand Stores */}
      <FeaturedBrands />

      {/* 6. Recommended For You Grid */}
      <div className="w-full bg-white shadow-sm border border-gray-100 rounded-sm p-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h3 className="text-base md:text-lg font-extrabold text-gray-900">
              Trending Deals Recommended For You
            </h3>
          </div>
          <Link
            href="/search"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Explore All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {allProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} layout="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}
