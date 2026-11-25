"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartButtonProps {
  className?: string;
}

export function CartButton({ className = "" }: CartButtonProps) {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-[14px] font-semibold text-white hover:text-yellow-200 transition-colors relative select-none ${className}`}
      title="View Shopping Cart"
    >
      <div className="relative">
        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[9px] sm:text-[10px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center border-2 border-[#2874f0] shadow-sm animate-in zoom-in-50 duration-150">
            {totalItems}
          </span>
        )}
      </div>
      <span className="hidden sm:inline">Cart</span>
    </Link>
  );
}
