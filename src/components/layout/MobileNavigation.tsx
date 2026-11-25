"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid, User, ShoppingCart, Store } from "lucide-react";
import { useCart } from "@/context/CartContext";

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex items-center justify-around py-2 px-1 shadow-lg">
      {links.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-[11px] relative ${
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
