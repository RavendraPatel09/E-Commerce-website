"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`leading-tight group flex flex-col shrink-0 select-none ${className}`} title="BharatKart Home">
      <div className="flex items-center gap-1">
        <span className="text-xl sm:text-2xl font-black italic tracking-wide text-white">
          BharatKart
        </span>
        <span className="w-2 h-2 rounded-full bg-[#ffe11b] shadow-sm animate-pulse" />
      </div>

      <div className="flex items-center gap-1 -mt-1 text-[10px] sm:text-[11px] text-gray-200 group-hover:text-white transition-colors">
        <span className="italic">Explore</span>
        <span className="font-bold text-[#ffe11b] italic flex items-center gap-0.5">
          Plus
          <svg className="w-2.5 h-2.5 fill-[#ffe11b]" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
