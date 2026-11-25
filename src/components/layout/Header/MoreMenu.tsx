"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Bell, TrendingUp, HelpCircle, Smartphone } from "lucide-react";

interface MoreMenuProps {
  className?: string;
}

export function MoreMenu({ className = "" }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-[14px] font-semibold text-white hover:text-yellow-200 py-1 transition-colors select-none"
      >
        <span>More</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-sm shadow-xl border border-gray-100 py-2 text-gray-800 text-xs z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          <Link
            href="/orders"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Notification Preferences</span>
          </Link>

          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 text-blue-700 font-bold"
            onClick={() => setIsOpen(false)}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Marketplace Admin</span>
          </Link>

          <div className="border-t border-gray-100 my-1" />

          <a
            href="#footer-help"
            className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
            onClick={() => setIsOpen(false)}
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>24x7 Customer Care</span>
          </a>

          <div className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-500 text-[11px]">
            <Smartphone className="w-4 h-4 text-green-600" />
            <span>Download App (Free)</span>
          </div>
        </div>
      )}
    </div>
  );
}
