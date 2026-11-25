"use client";

import React from "react";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { useWishlist } from "@/context/WishlistContext";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ product, className = "", size = "md" }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`p-1.5 rounded-full transition-transform active:scale-90 hover:bg-gray-100 flex items-center justify-center ${className}`}
      title={active ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <Heart
        className={`${
          size === "sm" ? "w-4 h-4" : "w-5 h-5"
        } transition-colors ${
          active ? "fill-[#ff4343] stroke-[#ff4343]" : "text-gray-400 hover:text-gray-600 stroke-[1.8]"
        }`}
      />
    </button>
  );
}
