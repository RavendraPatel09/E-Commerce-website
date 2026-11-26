"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { RolePersonaBar } from "@/components/common/RolePersonaBar";
import {
  Store,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  Landmark,
  MapPin,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function BecomeSellerPage() {
  const router = useRouter();
  const { switchPersona } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSeller, setSubmittedSeller] = useState<any>(null);

  // Form State with prefilled demo credentials for quick onboarding & compliance
  const [formData, setFormData] = useState({
    name: "Zenith Tech Retail",
    email: "contact@zenithtech.in",
    phone: "9811223344",
    category: "electronics",
    gstin: "29AAACZ9999P1Z2",
    pan: "AAACZ9999P",
    // Bank Details
    accountHolder: "Zenith Tech Retail LLP",
    bankName: "HDFC Bank",
    accountNumber: "912345678901",
    confirmAccountNumber: "912345678901",
    ifsc: "HDFC0001234",
    // Pickup Address
    addressLine: "Unit 5, Electronic City Hub Phase 1",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560100",
  });

  const [error, setError] = useState("");

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required business contact details.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.accountNumber || !formData.ifsc || !formData.accountHolder) {
      setError("Please enter your complete bank account credentials.");
      return;
    }
    if (formData.confirmAccountNumber && formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account numbers do not match.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/sellers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          gstin: formData.gstin || "29AABCR1234F1Z5",
          pan: formData.pan || "AABCR1234F",
          bankDetails: {
            accountNumber: formData.accountNumber,
            ifsc: formData.ifsc,
            bankName: formData.bankName,
            accountHolder: formData.accountHolder,
          },
          pickupAddress: {
            addressLine: formData.addressLine,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          city: formData.city,
          state: formData.state,
        }),
      });

      const data = await res.json();
      if (data.success && data.seller) {
        setSubmittedSeller(data.seller);
        setStep(4);
      } else {
        setError(data.error || "Failed to submit seller registration");
      }
    } catch (err: any) {
      setError(err.message || "Network error submitting registration");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <RolePersonaBar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2874f0] via-blue-700 to-indigo-900 text-white rounded-sm p-6 md:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-[#ffe11b] text-gray-950 text-xs font-black uppercase px-2.5 py-1 rounded-[2px]">
            <Store className="w-3.5 h-3.5" />
            <span>BHARATKART SELLER ONBOARDING</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            Grow Your Business With India's Leading Marketplace
          </h1>
          <p className="text-xs md:text-sm text-blue-100 leading-relaxed">
            Sell to 50 Crore+ verified customers across 19,000+ Indian pincodes. Experience 7-day payment settlement cycles, transparent category commission rates, and pan-India fulfillment.
          </p>
        </div>

        {/* Wizard Form Card */}
        <div className="w-full md:w-[480px] bg-white text-gray-800 rounded-sm p-6 shadow-xl border border-blue-100 shrink-0">
          {step < 4 && (
            <div className="mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-2">
                <span className={step >= 1 ? "text-[#2874f0]" : ""}>1. Business</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className={step >= 2 ? "text-[#2874f0]" : ""}>2. Bank Details</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className={step >= 3 ? "text-[#2874f0]" : ""}>3. Pickup Address</span>
              </div>
              <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#2874f0] h-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
              {error}
            </div>
          )}

          {/* STEP 1: BUSINESS PROFILE */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" /> Business Details
              </h3>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Store / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Electronics Retail"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="orders@apexretail.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Primary Selling Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="electronics">Electronics & Audio (8% commission)</option>
                  <option value="mobiles">Mobiles & Accessories (7% commission)</option>
                  <option value="fashion">Fashion & Footwear (15% commission)</option>
                  <option value="home-furniture">Home & Furniture (12% commission)</option>
                  <option value="appliances">TVs & Appliances (10% commission)</option>
                  <option value="grocery">Grocery & Staples (5% commission)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    GSTIN (Tax ID)
                  </label>
                  <input
                    type="text"
                    placeholder="29AABCR1234F1Z5"
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                    className="w-full p-2 border border-gray-300 rounded uppercase font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    placeholder="AABCR1234F"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                    className="w-full p-2 border border-gray-300 rounded uppercase font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs py-3 rounded-sm uppercase tracking-wide shadow-md transition-colors mt-2"
              >
                Proceed to Bank Details
              </button>
            </form>
          )}

          {/* STEP 2: BANK SETTLEMENT DETAILS */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-blue-600" /> Bank Settlement Account
              </h3>
              <p className="text-[11px] text-gray-500">
                All order proceeds will be automatically credited to this verified account every 7 days.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Account Beneficiary Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Apex Retail Technologies Pvt Ltd"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Bank Name
                  </label>
                  <select
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="State Bank of India">State Bank of India</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="HDFC0001234"
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 border border-gray-300 rounded uppercase font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Bank Account Number *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter 9 to 18-digit account number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Re-enter Account Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Re-confirm account number"
                  value={formData.confirmAccountNumber}
                  onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-sm uppercase tracking-wide"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold py-2.5 rounded-sm uppercase tracking-wide shadow"
                >
                  Proceed to Pickup Address
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PICKUP ADDRESS */}
          {step === 3 && (
            <form onSubmit={handleSubmitApplication} className="space-y-3 text-xs">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Warehouse & Pickup Address
              </h3>
              <p className="text-[11px] text-gray-500">
                Our logistics partners (BlueDart, Delhivery, Ekart) will pick up packaged orders directly from this address.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Warehouse / Shop Address *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Building No, Street Name, Industrial Area / Landmark"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>BharatKart Seller Guarantee</span>
                </div>
                <p>
                  Zero registration fees. 100% genuine seller protection against transit damage and false returns.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2.5 rounded-sm uppercase tracking-wide"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-2/3 bg-[#fb641b] hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold py-2.5 rounded-sm uppercase tracking-wide shadow"
                >
                  {submitting ? "Submitting Application..." : "Submit Application"}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: CONFIRMATION & VERIFICATION STATUS */}
          {step === 4 && submittedSeller && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>

              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  APPLICATION SUBMITTED
                </span>
                <h3 className="text-xl font-black text-gray-900 mt-2">
                  Seller Application Under Verification
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Thank you for applying to sell on BharatKart! Our seller onboarding team will verify your GSTIN and bank account.
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Seller ID:</span>
                  <strong className="font-mono text-gray-900">{submittedSeller.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Store Name:</span>
                  <strong className="text-gray-900">{submittedSeller.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <strong className="capitalize text-gray-900">{submittedSeller.category}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Verification Status:</span>
                  <span className="text-amber-700 font-extrabold uppercase">
                    {submittedSeller.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/seller/dashboard"
                  onClick={() => switchPersona("seller", submittedSeller.id)}
                  className="w-full bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs py-2.5 rounded-sm uppercase tracking-wide shadow flex items-center justify-center gap-1.5"
                >
                  <Store className="w-4 h-4" />
                  <span>Preview Seller Hub</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => switchPersona("admin")}
                  className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs py-2 rounded-sm uppercase tracking-wide flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Switch to Admin to Verify This Seller</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            icon: Users,
            title: "50 Crore+ Shoppers",
            desc: "Reach every corner of India with our verified consumer base.",
          },
          {
            icon: DollarSign,
            title: "7-Day Payment Cycle",
            desc: "Automated settlements direct to your bank account with zero delays.",
          },
          {
            icon: TrendingUp,
            title: "Lowest Commission Rates",
            desc: "Starting as low as 5% for grocery and 7% for electronics.",
          },
          {
            icon: ShieldCheck,
            title: "Seller Protection Fund",
            desc: "100% transit compensation and protection against fraudulent returns.",
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-sm p-5 shadow-sm space-y-2 hover:border-blue-400 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-50 text-[#2874f0] rounded flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
