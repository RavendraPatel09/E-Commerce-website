"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/lib/types";
import { formatINR, getEstimatedDeliveryDate } from "@/lib/utils";
import { AssuredBadge } from "../ui/AssuredBadge";
import { Trash2, Bookmark } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (qty: number) => void;
  onRemove: () => void;
  onSaveForLater: () => void;
}

export function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onSaveForLater,
}: CartItemProps) {
  const { product, quantity, selectedPrice, variantName } = item;
  const originalPrice = product.originalPrice || selectedPrice;
  const deliveryDate = getEstimatedDeliveryDate(product.fastestDeliveryDays || 2);

  return (
    <div className="bg-white border-b border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between">
      {/* Left: Image & Qty */}
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-3">
          <Link
            href={`/product/${product.id}`}
            className="w-20 h-24 sm:w-28 sm:h-28 relative border border-gray-100 rounded-sm overflow-hidden shrink-0"
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-contain p-2"
            />
          </Link>

          {/* Qty controls */}
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center border border-gray-200 py-0.5 rounded text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              disabled={quantity >= (product.stockCount || 10)}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1.5 flex-1">
          <Link
            href={`/product/${product.id}`}
            className="text-sm font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 leading-snug"
          >
            {product.title}
          </Link>

          {variantName && (
            <p className="text-xs text-gray-500 font-medium">Variant: {variantName}</p>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Seller: {product.seller?.name || "RetailNet"}</span>
            {product.isAssured && <AssuredBadge className="text-[10px]" />}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-base font-extrabold text-gray-900">
              {formatINR(selectedPrice * quantity)}
            </span>
            {originalPrice > selectedPrice && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatINR(originalPrice * quantity)}
                </span>
                <span className="text-xs font-bold text-[#388e3c]">
                  {product.discountPercentage}% Off
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Delivery expectation & Action buttons */}
      <div className="flex flex-row sm:flex-col justify-between sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        <div className="text-left sm:text-right text-xs">
          <p className="text-gray-800">
            Delivery by <strong className="font-bold">{deliveryDate}</strong>
          </p>
          <p className="text-[#388e3c] font-semibold text-[11px]">Free Delivery</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-700">
          <button
            onClick={onSaveForLater}
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Save For Later</span>
          </button>
          <button
            onClick={onRemove}
            className="hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}
