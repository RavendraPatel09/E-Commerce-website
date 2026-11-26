"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { WishlistButton } from "./WishlistButton";
import { AssuredBadge } from "../ui/AssuredBadge";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "carousel" | "compact";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();
  const isInCart = cartItems.some((item) => item.productId === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      className={`group relative bg-white border border-gray-100 rounded-sm hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.11)] hover:border-gray-200 transition-all duration-200 flex flex-col justify-between p-3.5 h-full ${
        layout === "carousel" ? "w-[240px] shrink-0" : "w-full"
      }`}
    >
      {/* Top badges: Deal tag & Wishlist */}
      <div className="flex items-center justify-between mb-1 min-h-[22px]">
        {product.featuredDeal ? (
          <span className="text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 px-1.5 py-0.5 rounded-[2px] border border-red-100">
            {product.featuredDeal}
          </span>
        ) : (
          <span />
        )}
        <WishlistButton product={product} size="sm" />
      </div>

      {/* Product Image Link */}
      <Link href={`/product/${product.id}`} className="block relative w-full pt-[85%] mb-3 overflow-hidden">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Info Body */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            {product.brand}
          </p>

          {/* Title with exact baseline uniform height */}
          <Link
            href={`/product/${product.id}`}
            className="text-[13px] font-medium text-gray-800 line-clamp-2 h-[38px] leading-[19px] overflow-hidden group-hover:text-blue-600 transition-colors mb-1.5 block"
            title={product.title}
          >
            {product.title}
          </Link>

          {/* Rating & Assured Badge */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <RatingStars rating={product.rating} count={product.ratingCount} size="sm" />
            {product.isAssured && <AssuredBadge />}
          </div>
        </div>

        {/* Pricing Block */}
        <div className="pt-2 border-t border-gray-50">
          <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5 mb-1">
            <span className="text-[16px] font-extrabold text-gray-900">
              {formatINR(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-[12px] text-gray-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
                <span className="text-[12px] font-bold text-[#388e3c]">
                  {product.discountPercentage}% off
                </span>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-gray-500 mt-1">
            <span>Free delivery</span>
            <span className="text-gray-400 text-[10px]">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Quick Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className={`w-full mt-2.5 py-1.5 px-3 rounded-sm text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              isInCart
                ? "bg-green-50 text-green-700 border border-green-300"
                : "bg-[#ff9f00] hover:bg-[#f39700] text-gray-950 shadow-sm"
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
