"use client";

import React from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { PriceDetailsCard } from "@/components/cart/PriceDetailsCard";
import { ShieldCheck, Lock } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="space-y-4">
      {/* Top Security Banner */}
      <div className="flex items-center justify-between py-1 text-xs text-gray-500 border-b border-gray-200 mb-2">
        <div className="flex items-center gap-1.5 font-bold text-gray-800">
          <Lock className="w-3.5 h-3.5 text-green-600" />
          <span>BharatKart 100% Safe & Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1 text-green-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Merchant</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column: 4-Step Checkout Accordion */}
        <div className="lg:col-span-8">
          <CheckoutForm />
        </div>

        {/* Right Column: Price Details */}
        <div className="lg:col-span-4 sticky top-16">
          <PriceDetailsCard />
        </div>
      </div>
    </div>
  );
}
