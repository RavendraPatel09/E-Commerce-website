"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, TrendingUp, ShieldCheck, DollarSign, Users, ArrowRight } from "lucide-react";

export default function BecomeSellerPage() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [category, setCategory] = useState("electronics");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/seller/dashboard");
  };

  return (
    <div className="space-y-8 py-4">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-[#2874f0] to-indigo-800 text-white rounded-sm p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-4">
          <span className="bg-[#ffe11b] text-gray-950 text-xs font-black uppercase px-2.5 py-1 rounded-[2px]">
            BHARATKART SELLER HUB
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Sell to 50 Crore+ Customers Across India
          </h1>
          <p className="text-sm md:text-base text-blue-100 leading-relaxed">
            Grow your business with India's most trusted e-commerce marketplace. Enjoy 7-day payment cycles, lowest commission rates, and dedicated account managers.
          </p>
        </div>

        {/* Quick Registration Form */}
        <div className="w-full md:w-96 bg-white text-gray-800 rounded-sm p-6 shadow-xl">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Register as a Verified Seller
          </h3>
          <p className="text-xs text-gray-500 mb-4">Start selling in less than 10 minutes</p>

          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Business / Store Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Apex Electronics Retail"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                GSTIN / Tax ID (Optional for books)
              </label>
              <input
                type="text"
                placeholder="29AAAAA0000A1Z5"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              >
                <option value="electronics">Electronics & Audio</option>
                <option value="mobiles">Mobiles & Accessories</option>
                <option value="appliances">TVs & Appliances</option>
                <option value="fashion">Fashion & Footwear</option>
                <option value="home-furniture">Home & Furniture</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs py-3 rounded-sm uppercase tracking-wide shadow transition-colors mt-2"
            >
              Start Selling Now
            </button>
          </form>
        </div>
      </div>

      {/* Why Sell With Us Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            title: "50 Crore+ Shoppers",
            desc: "Direct access to buyers across 19,000+ Indian PIN codes",
          },
          {
            icon: DollarSign,
            title: "7-Day Fast Payouts",
            desc: "Automated settlements directly to your bank account",
          },
          {
            icon: TrendingUp,
            title: "Lowest Return Rates",
            desc: "Advanced AI order verification to prevent false returns",
          },
          {
            icon: ShieldCheck,
            title: "Seller Protection Fund",
            desc: "Full transit insurance and seller compensation policy",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
