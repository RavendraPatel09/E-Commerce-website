"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { AccountMenu } from "./AccountMenu";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingCart,
  ChevronDown,
  Store,
  HelpCircle,
  Bell,
  Smartphone,
  TrendingUp,
} from "lucide-react";

export function Header() {
  const { totalItems, setIsCartDrawerOpen } = useCart();
  const { user, setIsLoginModalOpen } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#2874f0] shadow-md w-full">
      <div className="max-w-[1360px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex flex-col shrink-0">
          <Link href="/" className="leading-tight group">
            <span className="text-xl md:text-2xl font-black italic tracking-wide text-white flex items-center gap-1">
              BharatKart
              <span className="w-2 h-2 rounded-full bg-[#ffe11b]" />
            </span>
            <div className="flex items-center gap-1 -mt-1 text-[11px] text-gray-200 group-hover:text-white transition-colors">
              <span className="italic">Explore</span>
              <span className="font-bold text-[#ffe11b] italic flex items-center gap-0.5">
                Plus
                <svg className="w-2.5 h-2.5 fill-[#ffe11b]" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-[620px] mx-2">
          <SearchBar />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-7 shrink-0 text-white">
          {/* Login / Account Button with Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            {user ? (
              <button
                onClick={() => setIsAccountOpen((prev) => !prev)}
                className="flex items-center gap-1 text-[15px] font-semibold text-white hover:text-yellow-200 py-1"
              >
                <span className="max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-white text-[#2874f0] font-bold text-sm px-7 py-1 rounded-sm shadow-sm hover:bg-gray-50 transition-colors"
              >
                Login
              </button>
            )}

            <AccountMenu
              isOpen={isAccountOpen}
              onClose={() => setIsAccountOpen(false)}
            />
          </div>

          {/* Become a Seller */}
          <Link
            href="/seller"
            className="hidden lg:flex items-center gap-1 text-[14px] font-semibold text-white hover:text-yellow-200 transition-colors"
          >
            <Store className="w-4 h-4 text-[#ffe11b]" />
            <span>Become a Seller</span>
          </Link>

          {/* More Options Dropdown */}
          <div
            className="relative hidden md:block"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={() => setIsMoreOpen(false)}
          >
            <button className="flex items-center gap-1 text-[14px] font-semibold text-white hover:text-yellow-200 py-1">
              <span>More</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? "rotate-180" : ""}`} />
            </button>

            {isMoreOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-sm shadow-xl border border-gray-100 py-2 text-gray-800 text-sm z-50">
                <Link
                  href="/orders"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                  onClick={() => setIsMoreOpen(false)}
                >
                  <Bell className="w-4 h-4 text-blue-600" />
                  <span>Notification Preferences</span>
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-blue-700 font-semibold"
                  onClick={() => setIsMoreOpen(false)}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Marketplace Admin</span>
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <a
                  href="#footer-help"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                  onClick={() => setIsMoreOpen(false)}
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>24x7 Customer Care</span>
                </a>
                <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-500 text-xs">
                  <Smartphone className="w-4 h-4 text-green-600" />
                  <span>Download App (Free)</span>
                </div>
              </div>
            )}
          </div>

          {/* Cart Button */}
          <Link
            href="/cart"
            className="flex items-center gap-2 text-[14px] font-semibold text-white hover:text-yellow-200 transition-colors relative"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#2874f0]">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
