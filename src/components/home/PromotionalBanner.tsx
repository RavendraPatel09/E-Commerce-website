import React from "react";
import Link from "next/link";
import { CreditCard, Sparkles, ShieldCheck } from "lucide-react";

export function PromotionalBanner() {
  return (
    <div className="w-full bg-gradient-to-r from-blue-700 via-[#2874f0] to-indigo-800 text-white py-3 px-4 shadow-sm my-3">
      <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-[#ffe11b]" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="bg-[#ffe11b] text-gray-950 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-[2px]">
                BANK OFFER
              </span>
              <p className="text-sm font-bold tracking-tight">
                Flat 10% Instant Discount on HDFC, ICICI & Axis Bank Cards
              </p>
            </div>
            <p className="text-xs text-blue-100 hidden sm:block">
              Plus extra ₹2,500 bonus discount on orders above ₹49,999. Valid till midnight.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-yellow-200">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Buyer Protection</span>
          </div>
          <Link
            href="/search"
            className="bg-white text-[#2874f0] hover:bg-yellow-300 hover:text-gray-900 font-extrabold text-xs px-4 py-2 rounded-sm shadow transition-colors"
          >
            Claim Offers
          </Link>
        </div>
      </div>
    </div>
  );
}
