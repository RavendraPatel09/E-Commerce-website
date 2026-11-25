"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ShieldCheck, Tag, X } from "lucide-react";

export function PriceDetailsCard() {
  const {
    totalItems,
    subtotal,
    originalTotal,
    totalDiscount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    finalTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError("");
    setCouponSuccess("");
    setIsApplying(true);

    const res = await applyCoupon(couponInput.trim());
    setIsApplying(false);

    if (res.success) {
      setCouponSuccess(`Coupon ${couponInput.toUpperCase()} applied!`);
      setCouponInput("");
    } else {
      setCouponError(res.message || "Failed to apply coupon");
    }
  };

  const netSavings = totalDiscount + (appliedCoupon?.discount || 0);

  return (
    <div className="w-full bg-white border border-gray-200 rounded-sm overflow-hidden text-gray-800 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Price Details
        </h3>
      </div>

      <div className="p-4 space-y-3.5 text-sm">
        {/* Price row */}
        <div className="flex justify-between">
          <span className="text-gray-700">Price ({totalItems} items)</span>
          <span className="font-medium">{formatINR(originalTotal)}</span>
        </div>

        {/* Discount row */}
        <div className="flex justify-between text-[#388e3c]">
          <span>Discount</span>
          <span className="font-semibold">- {formatINR(totalDiscount)}</span>
        </div>

        {/* Coupon Discount row if applied */}
        {appliedCoupon && (
          <div className="flex justify-between items-center text-[#388e3c]">
            <div className="flex items-center gap-1.5">
              <span>Coupon ({appliedCoupon.code})</span>
              <button
                onClick={removeCoupon}
                className="text-gray-400 hover:text-red-500 p-0.5"
                title="Remove coupon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="font-semibold">- {formatINR(appliedCoupon.discount)}</span>
          </div>
        )}

        {/* Delivery Charges */}
        <div className="flex justify-between">
          <span className="text-gray-700">Delivery Charges</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 line-through">₹40</span>
            <span className="text-[#388e3c] font-bold">FREE</span>
          </div>
        </div>

        {/* Total Amount */}
        <div className="border-t border-dashed border-gray-300 pt-3 flex justify-between text-base font-extrabold text-gray-900">
          <span>Total Amount</span>
          <span>{formatINR(finalTotal)}</span>
        </div>

        {/* Total Savings Notification */}
        {netSavings > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-sm p-2 text-xs font-bold text-[#388e3c] text-center">
            You will save {formatINR(netSavings)} on this order!
          </div>
        )}
      </div>

      {/* Coupon Application Box */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          <Tag className="w-3.5 h-3.5 text-blue-600" /> Apply Coupon
        </div>

        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder="e.g. WELCOME200, FESTIVE10"
            className="flex-1 p-2 border border-gray-300 rounded text-xs font-mono font-bold uppercase focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={isApplying || !couponInput.trim()}
            className="bg-[#2874f0] hover:bg-blue-600 disabled:opacity-40 text-white font-bold text-xs px-4 py-2 rounded transition-colors"
          >
            {isApplying ? "..." : "Apply"}
          </button>
        </form>

        {couponError && <p className="text-[11px] text-red-600 mt-1.5 font-medium">{couponError}</p>}
        {couponSuccess && <p className="text-[11px] text-green-700 mt-1.5 font-bold">{couponSuccess}</p>}
      </div>

      {/* Trust & Security Badge */}
      <div className="p-3 bg-gray-100/60 border-t border-gray-200 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
        <ShieldCheck className="w-4 h-4 text-gray-400" />
        <span>Safe and Secure Payments. 100% Authentic products.</span>
      </div>
    </div>
  );
}
