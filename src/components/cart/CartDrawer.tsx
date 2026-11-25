"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { formatINR } from "@/lib/utils";
import { X, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";

export function CartDrawer() {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cartItems,
    removeFromCart,
    finalTotal,
    totalItems,
  } = useCart();

  if (!isCartDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 transition-opacity backdrop-blur-[2px]"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 bg-[#2874f0] text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-yellow-300" />
              <h2 className="text-base font-bold">My Cart ({totalItems} items)</h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded hover:bg-white/10 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-semibold text-gray-800">Your cart is currently empty</p>
                <p className="text-xs text-gray-400 mt-1">Explore our latest deals and add your favorite items</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.productId} className="pt-3 flex gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 relative border border-gray-100 rounded p-1 shrink-0">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <p className="font-bold text-gray-800 line-clamp-1">{item.product.title}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                      <p className="font-bold text-gray-900">{formatINR(item.selectedPrice * item.quantity)}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId, item.variantId)}
                    className="text-gray-400 hover:text-red-500 p-2"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer CTA */}
          {cartItems.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-gray-900">
                <span>Subtotal</span>
                <span className="text-base text-[#2874f0]">{formatINR(finalTotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 px-3 border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 font-bold text-xs rounded-sm text-center transition-colors"
                >
                  View Full Cart
                </Link>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="py-2.5 px-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs rounded-sm text-center flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
