"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, ProductVariant } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { AssuredBadge } from "../ui/AssuredBadge";
import { useCart } from "@/context/CartContext";
import {
  Tag,
  MapPin,
  CheckCircle2,
  Shield,
  RotateCcw,
  Truck,
  Award,
  ChevronRight,
  ShoppingCart,
  Zap,
  Check,
  Layers,
  Sparkles,
} from "lucide-react";

interface ProductInformationProps {
  product: Product;
}

export function ProductInformation({ product }: ProductInformationProps) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();

  const [pincode, setPincode] = useState("560001");
  const [deliveryInfo, setDeliveryInfo] = useState<any>({
    city: "Bengaluru",
    estimatedDeliveryDate: "Tomorrow, by 9 PM",
    freeDelivery: true,
    codAvailable: true,
  });
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // Variant state management
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  // Distinct variant attributes
  const availableColors = Array.from(
    new Set(product.variants?.map((v) => v.color).filter(Boolean))
  ) as string[];

  const availableStorages = Array.from(
    new Set(product.variants?.map((v) => v.storage).filter(Boolean))
  ) as string[];

  const availableSizes = Array.from(
    new Set(product.variants?.map((v) => v.size).filter(Boolean))
  ) as string[];

  // Dynamic pricing based on active variant
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant
    ? selectedVariant.originalPrice
    : product.originalPrice;
  const currentDiscount =
    currentOriginalPrice > currentPrice
      ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
      : product.discountPercentage;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stockCount;

  // Cart status for this product
  const isInCart = cartItems.some((item) => item.productId === product.id);

  // Record product in recently viewed localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("bharatkart_recently_viewed");
      const list: string[] = raw ? JSON.parse(raw) : [];
      const updated = [product.id, ...list.filter((id) => id !== product.id)].slice(0, 15);
      localStorage.setItem("bharatkart_recently_viewed", JSON.stringify(updated));
    } catch {
      // Ignore if localStorage unavailable
    }
  }, [product.id]);

  const handleColorChange = (color: string) => {
    if (!product.variants) return;
    const match =
      product.variants.find(
        (v) =>
          v.color === color &&
          (selectedVariant?.storage ? v.storage === selectedVariant.storage : true) &&
          (selectedVariant?.size ? v.size === selectedVariant.size : true)
      ) || product.variants.find((v) => v.color === color);

    if (match) setSelectedVariant(match);
  };

  const handleStorageChange = (storage: string) => {
    if (!product.variants) return;
    const match =
      product.variants.find(
        (v) =>
          v.storage === storage &&
          (selectedVariant?.color ? v.color === selectedVariant.color : true)
      ) || product.variants.find((v) => v.storage === storage);

    if (match) setSelectedVariant(match);
  };

  const handleSizeChange = (size: string) => {
    if (!product.variants) return;
    const match =
      product.variants.find(
        (v) =>
          v.size === size &&
          (selectedVariant?.color ? v.color === selectedVariant.color : true)
      ) || product.variants.find((v) => v.size === size);

    if (match) setSelectedVariant(match);
  };

  const handleAddToCart = () => {
    if (isInCart) {
      router.push("/cart");
    } else {
      addToCart(product, 1);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/checkout");
  };

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
      <nav className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href={`/category/${product.category}`} className="hover:text-blue-600 capitalize">
          {product.category.replace("-", " ")}
        </Link>
        {product.subCategory && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link
              href={`/search?category=${product.category}&subCategory=${product.subCategory}`}
              className="hover:text-blue-600 capitalize"
            >
              {product.subCategory.replace("-", " ")}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-gray-400" />
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
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {formatINR(currentPrice)}
          </span>
          {currentOriginalPrice > currentPrice && (
            <>
              <span className="text-base text-gray-400 line-through">
                {formatINR(currentOriginalPrice)}
              </span>
              <span className="text-base font-bold text-[#388e3c]">
                {currentDiscount}% off
              </span>
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>

        {/* Stock Alert */}
        <div className="mt-2 text-xs font-semibold">
          {currentStock > 0 ? (
            <span className="text-emerald-700">
              In Stock {currentStock <= 10 && `(Only ${currentStock} units left - order soon)`}
            </span>
          ) : (
            <span className="text-red-600">Currently Out of Stock</span>
          )}
        </div>
      </div>

      {/* Interactive Product Variants Section */}
      {product.variants && product.variants.length > 0 && (
        <div className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100/60">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              Available Product Variants
            </span>
            {selectedVariant && (
              <span className="text-[11px] font-mono text-gray-500">
                SKU: {selectedVariant.sku}
              </span>
            )}
          </div>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs text-gray-700 font-semibold">
                Color:{" "}
                <strong className="text-gray-900">
                  {selectedVariant?.color || availableColors[0]}
                </strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {availableColors.map((color) => {
                  const active = selectedVariant?.color === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorChange(color)}
                      className={`text-xs px-3 py-1.5 rounded border transition-all font-medium ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-xs font-bold"
                          : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Storage Selection (for Phones/Laptops) */}
          {availableStorages.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs text-gray-700 font-semibold">
                Storage:{" "}
                <strong className="text-gray-900">
                  {selectedVariant?.storage || availableStorages[0]}
                </strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {availableStorages.map((storage) => {
                  const active = selectedVariant?.storage === storage;
                  return (
                    <button
                      key={storage}
                      type="button"
                      onClick={() => handleStorageChange(storage)}
                      className={`text-xs px-3.5 py-1.5 rounded border transition-all font-medium ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-xs font-bold"
                          : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
                      }`}
                    >
                      {storage}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection (for Footwear/Fashion/TVs) */}
          {availableSizes.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs text-gray-700 font-semibold">
                Size / Dimension:{" "}
                <strong className="text-gray-900">
                  {selectedVariant?.size || availableSizes[0]}
                </strong>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {availableSizes.map((size) => {
                  const active = selectedVariant?.size === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`text-xs px-3.5 py-1.5 rounded border transition-all font-medium ${
                        active
                          ? "border-blue-600 bg-blue-600 text-white shadow-xs font-bold"
                          : "border-gray-300 bg-white text-gray-800 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

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
