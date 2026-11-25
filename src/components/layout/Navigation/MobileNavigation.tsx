"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SEED_CATEGORIES } from "@/lib/db";
import { CATEGORY_ICON_MAP } from "./CategoryItem";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Grid,
  User,
  ShoppingCart,
  Store,
  X,
  ChevronRight,
  Package,
  Heart,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

/**
 * Mobile Side Drawer opened via Hamburger Menu on the Header
 */
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const { user, setIsLoginModalOpen } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-[300px] bg-white shadow-2xl flex flex-col justify-between overflow-y-auto">
          {/* Header */}
          <div className="bg-[#2874f0] p-4 text-white flex items-center justify-between shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
                {user ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5 text-white" />}
              </div>
              <div className="text-xs truncate">
                <p className="font-bold text-sm truncate">{user ? user.name : "Sign In"}</p>
                <p className="text-[11px] text-blue-100">
                  {user ? "BharatKart Plus Member" : "Explore Best Deals"}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 py-2 text-xs divide-y divide-gray-100">
            {/* Quick Actions */}
            <div className="py-2 px-3 space-y-1">
              {!user ? (
                <button
                  onClick={() => {
                    onClose();
                    setIsLoginModalOpen(true);
                  }}
                  className="w-full bg-[#2874f0] text-white py-2 rounded text-xs font-bold text-center mb-2 shadow-sm"
                >
                  Login / Sign Up
                </button>
              ) : null}

              <Link
                href="/orders"
                onClick={onClose}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 text-gray-800 font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>My Orders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/wishlist"
                onClick={onClose}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-50 text-gray-800 font-semibold"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>My Wishlist</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>

              <Link
                href="/seller"
                onClick={onClose}
                className="flex items-center justify-between p-2 rounded hover:bg-yellow-50 text-amber-800 font-bold"
              >
                <div className="flex items-center gap-3">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Become a Seller</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </Link>

              <Link
                href="/admin"
                onClick={onClose}
                className="flex items-center justify-between p-2 rounded hover:bg-blue-50 text-blue-800 font-bold"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Marketplace Admin</span>
                </div>
                <ChevronRight className="w-4 h-4 text-blue-600" />
              </Link>
            </div>

            {/* Category Navigation in Drawer */}
            <div className="py-2 px-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-2">
                All Categories
              </p>
              <div className="space-y-0.5">
                {SEED_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/search?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {CATEGORY_ICON_MAP[cat.icon]}
                      </div>
                      <span className="font-semibold text-xs">{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer help */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            <Link
              href="#footer-help"
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 font-medium hover:text-blue-600"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>24x7 Customer Support Desk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile Bottom Bar fixed at screen bottom
 */
export function MobileNavigation() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const links = [
    { label: "Home", href: "/", icon: Home },
    { label: "Categories", href: "/search", icon: Grid },
    { label: "Seller", href: "/seller", icon: Store },
    { label: "Account", href: "/account", icon: User },
    { label: "Cart", href: "/cart", icon: ShoppingCart, badge: totalItems },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex items-center justify-around py-1.5 px-1 shadow-lg select-none">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[10px] relative transition-colors ${
              isActive ? "text-[#2874f0] font-bold" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-[#ff6161] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
