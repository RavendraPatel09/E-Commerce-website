"use client";

import React from "react";
import Link from "next/link";
import { Store } from "lucide-react";

interface SellerLinkProps {
  className?: string;
  onClick?: () => void;
}

export function SellerLink({ className = "", onClick }: SellerLinkProps) {
  return (
    <Link
      href="/seller"
      onClick={onClick}
      className={`flex items-center gap-1.5 text-xs sm:text-[14px] font-semibold text-white hover:text-yellow-200 transition-colors select-none ${className}`}
      title="Start selling to 50 Crore+ buyers across India"
    >
      <Store className="w-4 h-4 text-[#ffe11b] shrink-0" />
      <span>Become a Seller</span>
    </Link>
  );
}
