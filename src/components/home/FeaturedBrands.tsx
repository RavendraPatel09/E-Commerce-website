import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const BRANDS = [
  { name: "Apple", offer: "Min 10% Off", logo: "🍎", link: "/search?brand=Apple" },
  { name: "Samsung", offer: "Up to 30% Off", logo: "📱", link: "/search?brand=Samsung" },
  { name: "Sony", offer: "Premium Audio Deals", logo: "🎧", link: "/search?brand=Sony" },
  { name: "LG", offer: "Up to 40% Off OLED", logo: "📺", link: "/search?brand=LG" },
  { name: "Nike", offer: "Iconic Jordan Retro", logo: "👟", link: "/search?brand=Nike" },
  { name: "Dyson", offer: "Festive Special", logo: "🌪️", link: "/search?brand=Dyson" },
  { name: "Philips", offer: "From ₹1,499", logo: "⚡", link: "/search?brand=Philips" },
  { name: "Marshall", offer: "Heavyweight Sound", logo: "📻", link: "/search?brand=Marshall" },
];

export function FeaturedBrands() {
  return (
    <div className="w-full bg-white shadow-sm border border-gray-100 rounded-sm p-4 mb-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-base md:text-lg font-extrabold text-gray-900">
            Featured Official Brand Stores
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">100% Authentic Guaranteed</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {BRANDS.map((brand, idx) => (
          <Link
            key={idx}
            href={brand.link}
            className="group block p-3 text-center border border-gray-100 rounded-sm hover:border-blue-400 hover:shadow-md transition-all bg-gray-50/50 hover:bg-white"
          >
            <div className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">
              {brand.logo}
            </div>
            <p className="text-xs font-bold text-gray-800 group-hover:text-blue-600 truncate">
              {brand.name}
            </p>
            <p className="text-[11px] font-semibold text-[#388e3c] mt-0.5 truncate">
              {brand.offer}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
