import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";

interface CategoryTile {
  name: string;
  tagline: string;
  offer: string;
  imageUrl: string;
  href: string;
  badge?: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    name: "Mobiles & Tablets",
    tagline: "Latest 5G Flagships",
    offer: "From ₹7,999",
    imageUrl: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=mobiles",
    badge: "Trending",
  },
  {
    name: "Electronics & Audio",
    tagline: "Laptops, Audio & Wearables",
    offer: "Up to 60% Off",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=electronics",
    badge: "Best Seller",
  },
  {
    name: "Fashion & Lifestyle",
    tagline: "Sneakers, Denim & Watches",
    offer: "Min 40% Off",
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=fashion",
    badge: "New Season",
  },
  {
    name: "Home & Furniture",
    tagline: "Solid Sheesham & Ortho Mattresses",
    offer: "From ₹1,499",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=home-furniture",
    badge: "Top Choice",
  },
  {
    name: "TVs & Appliances",
    tagline: "OLED Smart TVs & Refrigerators",
    offer: "Up to 45% Off",
    imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=appliances",
  },
  {
    name: "Beauty & Grooming",
    tagline: "Ayurveda, Grooming & Scents",
    offer: "From ₹399",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=beauty",
  },
  {
    name: "Grocery & Gourmet",
    tagline: "Artisan Teas, Nuts & Staples",
    offer: "Min 25% Off",
    imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=grocery",
  },
  {
    name: "Two Wheelers & EV",
    tagline: "Electric Scooters & Riding Gear",
    offer: "Special Deals",
    imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=360&q=80",
    href: "/search?category=two-wheelers",
    badge: "Hot",
  },
];

export function CategoryShowcase() {
  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-base md:text-lg font-extrabold text-gray-900">
            Shop By Popular Categories
          </h3>
        </div>
        <Link
          href="/search"
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          <span>All Categories</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of 2 cols on mobile, 4 on tablet, 8 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORY_TILES.map((tile, idx) => (
          <Link
            key={idx}
            href={tile.href}
            className="group relative flex flex-col items-center bg-gray-50/70 hover:bg-blue-50/40 border border-gray-100 hover:border-blue-300 rounded-sm p-2.5 transition-all duration-200 text-center hover:shadow-sm"
          >
            {/* Top Badge Slot (Clean non-overlapping height) */}
            <div className="h-5 mb-1.5 flex items-center justify-center">
              {tile.badge ? (
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-gray-950 px-1.5 py-0.5 rounded-[2px] shadow-2xs">
                  {tile.badge}
                </span>
              ) : (
                <span className="h-4" />
              )}
            </div>

            {/* Circular Category Thumbnail */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 overflow-hidden rounded-full border-2 border-white shadow-xs bg-gray-100">
              <Image
                src={tile.imageUrl}
                alt={tile.name}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <p className="text-[12px] font-bold text-gray-900 group-hover:text-blue-600 line-clamp-1">
              {tile.name}
            </p>
            <p className="text-[11px] font-extrabold text-[#388e3c] mt-0.5">
              {tile.offer}
            </p>
            <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5 hidden sm:block">
              {tile.tagline}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
