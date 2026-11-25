"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CartItem } from "@/components/cart/CartItem";
import { PriceDetailsCard } from "@/components/cart/PriceDetailsCard";
import { formatINR } from "@/lib/utils";
import { ShoppingBag, MapPin, ArrowRight, Bookmark } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cartItems,
    savedForLater,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    totalItems,
    finalTotal,
  } = useCart();
  const { selectedAddress } = useAuth();

  if (cartItems.length === 0 && savedForLater.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-12 text-center my-6 shadow-sm">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty!</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Explore our trending smartphones, electronics, audio, and home appliances. Great deals are waiting for you!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs px-8 py-3 rounded-sm uppercase tracking-wide shadow-sm transition-colors"
        >
          <span>Shop Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      {/* Left Column: Cart Items & Saved For Later */}
      <div className="lg:col-span-8 space-y-4">
        {/* Address Delivery Header Bar */}
        {selectedAddress && (
          <div className="bg-white border border-gray-200 rounded-sm p-3.5 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Deliver to: <strong className="font-bold text-gray-900">{selectedAddress.fullName}</strong>,{" "}
                {selectedAddress.pincode}
              </span>
              <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                {selectedAddress.type}
              </span>
            </div>
            <Link href="/checkout" className="text-blue-600 font-bold hover:underline">
              Change
            </Link>
          </div>
        )}

        {/* Cart Items List */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-base font-bold text-gray-900">
              BharatKart Bag ({totalItems} items)
            </h1>
          </div>

          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <CartItem
                key={`${item.productId}-${item.variantId || "default"}`}
                item={item}
                onUpdateQuantity={(qty) => updateQuantity(item.productId, qty, item.variantId)}
                onRemove={() => removeFromCart(item.productId, item.variantId)}
                onSaveForLater={() => saveForLater(item.productId, item.variantId)}
              />
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="p-4 bg-white border-t border-gray-200 flex items-center justify-between sticky bottom-0 shadow-lg">
            <div className="text-xs">
              <span className="text-gray-400 block">Total Payable:</span>
              <span className="text-lg font-black text-gray-900">{formatINR(finalTotal)}</span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-sm py-3 px-8 rounded-sm uppercase tracking-wide shadow-md transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>

        {/* Saved For Later Section */}
        {savedForLater.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-gray-900">
                Saved For Later ({savedForLater.length})
              </h3>
            </div>

            <div className="divide-y divide-gray-100">
              {savedForLater.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "saved"}`}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="w-16 h-16 object-contain border p-1 rounded"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-gray-800 line-clamp-1">{item.product.title}</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-0.5">
                        {formatINR(item.selectedPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => moveToCart(item.productId, item.variantId)}
                      className="text-xs font-bold text-blue-600 hover:underline uppercase"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromCart(item.productId, item.variantId)}
                      className="text-xs font-bold text-gray-400 hover:text-red-600 uppercase"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Price Details */}
      <div className="lg:col-span-4 sticky top-16">
        <PriceDetailsCard />
      </div>
    </div>
  );
}
