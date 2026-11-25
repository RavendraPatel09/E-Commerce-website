"use client";

import React from "react";
import Link from "next/link";
import { User, Package, Heart, Sparkles, CreditCard, Bell, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AccountMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AccountMenu({ isOpen, onClose }: AccountMenuProps) {
  const { user, logout, setIsLoginModalOpen } = useAuth();

  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full right-0 mt-1 w-64 bg-white rounded-sm shadow-2xl border border-gray-200 z-50 overflow-hidden text-gray-800 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      {/* Top Banner / User Welcome */}
      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 flex items-center justify-between">
        <div className="truncate">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Welcome</p>
          <p className="text-sm font-bold text-gray-900 truncate">
            {user ? user.name : "Sign In to Your Account"}
          </p>
        </div>
        {!user ? (
          <button
            onClick={() => {
              onClose();
              setIsLoginModalOpen(true);
            }}
            className="text-xs bg-[#2874f0] text-white px-3 py-1.5 rounded-sm font-semibold hover:bg-blue-700 shadow-sm"
          >
            Sign In
          </button>
        ) : (
          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
            VIP
          </span>
        )}
      </div>

      <div className="py-1 text-sm divide-y divide-gray-100">
        <div className="py-1">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <User className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">My Profile</span>
          </Link>

          <Link
            href="/orders"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <Package className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 font-medium">Orders</span>
          </Link>

          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Wishlist</span>
          </Link>
        </div>

        <div className="py-1">
          <Link
            href="/seller/dashboard"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2 hover:bg-yellow-50 transition-colors text-amber-700"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-xs">Seller Dashboard</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/admin"
            onClick={onClose}
            className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 transition-colors text-blue-800"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-xs">Admin Console</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {user && (
          <div className="py-1 bg-gray-50">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium text-xs">Log Out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
