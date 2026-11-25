import React from "react";
import { db } from "@/lib/db";
import { BannerCarousel } from "@/components/home/BannerCarousel";
import { PromotionalBanner } from "@/components/home/PromotionalBanner";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProductSection } from "@/components/home/ProductSection";
import { FeaturedBrands } from "@/components/home/FeaturedBrands";
import { DealCard } from "@/components/home/DealCard";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { Flame, ChevronRight, Plane, Coins, ShieldCheck, ArrowRight } from "lucide-react";

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

  // Divide sections for interspersed layout
  const firstHalfSections = sections.slice(0, 2);
  const secondHalfSections = sections.slice(2);

  return (
    <div className="space-y-4">
      {/* 1. Hero Promotional Banner Carousel */}
      <BannerCarousel banners={banners} />

      {/* 2. Bank Instant Discount Bar */}
      <PromotionalBanner />

      {/* 3. Category Showcase Grid */}
      <CategoryShowcase />

      {/* 4. Top Quick Deal Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {deals.map((deal, idx) => (
          <DealCard key={idx} {...deal} />
        ))}
      </div>

      {/* 5. First Set of Independent Product Sections (Electronics & Fashion) */}
      {firstHalfSections.map((sec) => {
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

      {/* 6. Promotional Spotlight Dual Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Link
          href="/search?category=travel"
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-900 to-indigo-800 text-white rounded-sm shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 text-blue-100 px-2 py-0.5 rounded">
              Cleartrip Deals
            </span>
            <h4 className="text-base font-extrabold">Domestic Flights From ₹1,499</h4>
            <p className="text-xs text-blue-200">Zero Convenience Fee on First Booking</p>
          </div>
          <Plane className="w-10 h-10 text-white/40 group-hover:scale-110 group-hover:text-white transition-all shrink-0 ml-2" />
        </Link>

        <Link
          href="/account"
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white rounded-sm shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 text-yellow-100 px-2 py-0.5 rounded">
              SuperCoin Zone
            </span>
            <h4 className="text-base font-extrabold">Pay 100% via SuperCoins</h4>
            <p className="text-xs text-yellow-100">Earn 4 Coins for every ₹100 spent</p>
          </div>
          <Coins className="w-10 h-10 text-white/40 group-hover:scale-110 group-hover:text-white transition-all shrink-0 ml-2" />
        </Link>

        <Link
          href="/search?isAssured=true"
          className="group flex items-center justify-between p-4 bg-gradient-to-r from-emerald-800 to-teal-700 text-white rounded-sm shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider bg-white/20 text-emerald-100 px-2 py-0.5 rounded">
              BharatKart Assured
            </span>
            <h4 className="text-base font-extrabold">6-Level Quality Check</h4>
            <p className="text-xs text-emerald-100">Fast Delivery & Hassle-free Returns</p>
          </div>
          <ShieldCheck className="w-10 h-10 text-white/40 group-hover:scale-110 group-hover:text-white transition-all shrink-0 ml-2" />
        </Link>
      </div>

      {/* 7. Second Set of Independent Product Sections (Appliances & Home Furniture) */}
      {secondHalfSections.map((sec) => {
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

      {/* 8. Featured Brand Stores */}
      <FeaturedBrands />

      {/* 9. Recently Viewed Products (Dynamic Client History + Fallback) */}
      <RecentlyViewed fallbackProducts={allProducts} />

      {/* 10. Trending Deals Recommended For You (Dense 4-column Grid) */}
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
