"use client";

import React, { useState } from "react";
import Link from "next/link";
import { User, Package, Heart, Sparkles, CreditCard, LogOut, ChevronDown, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function AccountMenu() {
  const { user, logout, setIsLoginModalOpen } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {user ? (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 text-xs sm:text-[15px] font-semibold text-white hover:text-yellow-200 py-1 transition-colors select-none"
          title={user.name}
          aria-label="User Account Menu"
        >
          <User className="w-4 h-4 sm:hidden shrink-0" />
          <span className="hidden sm:inline max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      ) : (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-white text-[#2874f0] font-bold text-xs sm:text-sm px-4 sm:px-7 py-1 rounded-sm shadow-sm hover:bg-gray-50 transition-colors select-none"
        >
          Login
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-sm shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800 animate-in fade-in slide-in-from-top-1 duration-100">
          {/* Top User Greeting */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-between">
            <div className="truncate">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Welcome</p>
              <p className="text-sm font-bold text-gray-900 truncate">
                {user ? user.name : "Sign In to BharatKart"}
              </p>
            </div>
            {!user ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsLoginModalOpen(true);
                }}
                className="text-xs bg-[#2874f0] text-white px-3 py-1 rounded-sm font-semibold hover:bg-blue-700 shadow-sm"
              >
                Sign In
              </button>
            ) : (
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                PLUS VIP
              </span>
            )}
          </div>

          {/* Links list */}
          <div className="py-1 text-xs divide-y divide-gray-100">
            <div className="py-1">
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-medium">My Profile</span>
              </Link>

              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <Package className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 font-bold">Orders</span>
              </Link>

              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span className="text-gray-700 font-medium">Wishlist</span>
              </Link>
            </div>

            <div className="py-1">
              <Link
                href="/seller/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-2 hover:bg-yellow-50 transition-colors text-amber-800"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="font-bold">Seller Dashboard</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
              </Link>

              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 transition-colors text-blue-800"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="font-bold">Admin Console</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-blue-600" />
              </Link>
            </div>

            {user && (
              <div className="py-1 bg-gray-50">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-left transition-colors font-bold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
