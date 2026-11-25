"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { RatingStars } from "@/components/product/RatingStars";
import { Heart, Trash2, ShoppingCart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-12 text-center my-6 shadow-sm">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Your Wishlist is Empty!</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
          Explore products you love and click the heart icon on any product to save it for later.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs px-8 py-3 rounded-sm uppercase tracking-wide shadow-sm transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <h1 className="text-base font-bold text-gray-900">
            My Wishlist ({wishlist.length} items)
          </h1>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs text-gray-400 hover:text-red-600 font-bold uppercase transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Link
                href={`/product/${product.id}`}
                className="w-20 h-20 relative border border-gray-100 rounded p-1 shrink-0 bg-white"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-contain"
                />
              </Link>

              <div className="text-xs space-y-1">
                <Link
                  href={`/product/${product.id}`}
                  className="font-bold text-sm text-gray-900 hover:text-blue-600 line-clamp-1"
                >
                  {product.title}
                </Link>
                <RatingStars rating={product.rating} count={product.ratingCount} size="sm" />
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="font-extrabold text-base text-gray-900">
                    {formatINR(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-gray-400 line-through text-xs">
                        {formatINR(product.originalPrice)}
                      </span>
                      <span className="text-[#388e3c] font-bold text-xs">
                        {product.discountPercentage}% off
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center">
              <button
                onClick={() => handleMoveToCart(product)}
                className="bg-[#ff9f00] hover:bg-yellow-600 text-white font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 shadow-sm transition-colors uppercase tracking-wide"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Move to Cart</span>
              </button>

              <button
                onClick={() => removeFromWishlist(product.id)}
                className="text-gray-400 hover:text-red-600 p-2"
                title="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
