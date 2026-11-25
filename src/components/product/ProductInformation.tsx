"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { AssuredBadge } from "../ui/AssuredBadge";
import {
  Tag,
  MapPin,
  CheckCircle2,
  Shield,
  RotateCcw,
  Truck,
  Award,
  ChevronRight,
} from "lucide-react";

interface ProductInformationProps {
  product: Product;
}

export function ProductInformation({ product }: ProductInformationProps) {
  const [pincode, setPincode] = useState("560001");
  const [deliveryInfo, setDeliveryInfo] = useState<any>({
    city: "Bengaluru",
    estimatedDeliveryDate: "Tomorrow, by 9 PM",
    freeDelivery: true,
    codAvailable: true,
  });
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError("");
    setCheckingPincode(true);

    try {
      const res = await fetch(`/api/pincode?code=${encodeURIComponent(pincode.trim())}`);
      const data = await res.json();
      if (data.success) {
        setDeliveryInfo(data);
      } else {
        setPincodeError(data.error || "Delivery not available for this PIN code");
      }
    } catch (err) {
      setPincodeError("Unable to verify PIN code");
    } finally {
      setCheckingPincode(false);
    }
  };

  return (
    <div className="w-full text-gray-800 space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/search?category=${product.category}`} className="hover:text-blue-600 capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600 font-medium truncate max-w-[200px]">{product.brand}</span>
      </nav>

      {/* Title */}
      <h1 className="text-lg md:text-xl font-medium text-gray-900 leading-snug">
        {product.title}
      </h1>

      {/* Ratings & Assured */}
      <div className="flex items-center gap-3">
        <RatingStars
          rating={product.rating}
          count={product.ratingCount}
          reviewCount={product.reviewCount}
          size="md"
        />
        {product.isAssured && <AssuredBadge className="text-xs" />}
      </div>

      {/* Price Block */}
      <div className="pt-2 pb-3 border-b border-gray-100">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {formatINR(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <>
              <span className="text-base text-gray-400 line-through">
                {formatINR(product.originalPrice)}
              </span>
              <span className="text-base font-bold text-[#388e3c]">
                {product.discountPercentage}% off
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
      </div>

      {/* Available Bank Offers */}
      {product.bankOffers && product.bankOffers.length > 0 && (
        <div className="space-y-2 pt-1 pb-3 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#388e3c]" /> Available Offers
          </h3>
          <ul className="space-y-1.5">
            {product.bankOffers.map((offer, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                <Tag className="w-3.5 h-3.5 text-[#388e3c] shrink-0 mt-0.5" />
                <span>{offer}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pincode & Delivery Availability Checker */}
      <div className="pt-1 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Check Delivery & Availability
          </span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex items-center gap-2 max-w-sm">
          <input
            type="text"
            value={pincode}
            maxLength={6}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Delivery Pincode"
            className="w-full border-b-2 border-gray-300 py-1.5 text-sm font-semibold tracking-wide focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            disabled={checkingPincode}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase shrink-0"
          >
            {checkingPincode ? "Checking..." : "Check"}
          </button>
        </form>

        {pincodeError && (
          <p className="text-xs text-red-600 mt-1 font-medium">{pincodeError}</p>
        )}

        {deliveryInfo && !pincodeError && (
          <div className="mt-2 text-xs space-y-1">
            <div className="flex items-center gap-2 text-gray-800">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Delivery to <strong className="font-bold">{deliveryInfo.city}</strong> by{" "}
                <strong className="font-bold text-green-700">{deliveryInfo.estimatedDeliveryDate}</strong>
              </span>
              <span className="text-green-700 font-bold ml-1">| Free ₹40</span>
            </div>
            {deliveryInfo.codAvailable && (
              <p className="text-[11px] text-gray-500 pl-6">Cash on Delivery available</p>
            )}
          </div>
        )}
      </div>

      {/* Highlights */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="pt-1 pb-3 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
            Highlights
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 list-disc list-inside text-xs text-gray-700">
            {product.highlights.map((h, i) => (
              <li key={i} className="leading-relaxed">
                {h}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="pt-1 pb-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
            Specifications
          </h3>
          <div className="border border-gray-200 rounded-sm divide-y divide-gray-200">
            {product.specifications.map((specGroup, gIdx) => (
              <div key={gIdx} className="p-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  {specGroup.category}
                </h4>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {specGroup.items.map((item, iIdx) => (
                    <React.Fragment key={iIdx}>
                      <dt className="text-gray-400 font-medium sm:col-span-1">{item.key}</dt>
                      <dd className="text-gray-800 font-medium sm:col-span-2 mb-1">{item.value}</dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller Box */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Sold By
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-sm font-bold text-blue-600">{product.seller.name}</span>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {product.seller.rating} ★
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {product.seller.city}, {product.seller.state} • {product.seller.badge}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0 sm:pl-4">
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <span>7 Days Replacement</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Warranty Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
