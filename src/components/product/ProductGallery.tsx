"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface ProductGalleryProps {
  product: Product;
  selectedVariant?: ProductVariant | null;
}

export function ProductGallery({ product, selectedVariant }: ProductGalleryProps) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [selectedImage, setSelectedImage] = useState(
    selectedVariant?.image || product.images[0] || product.thumbnail
  );
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const isInCart = cartItems.some(
    (item) => item.productId === product.id && item.variantId === selectedVariant?.id
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    if (isInCart) {
      router.push("/cart");
    } else {
      addToCart(
        product,
        1,
        selectedVariant?.id,
        selectedVariant?.name,
        selectedVariant?.price
      );
    }
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      1,
      selectedVariant?.id,
      selectedVariant?.name,
      selectedVariant?.price
    );
    router.push("/checkout");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col md:flex-row gap-3">
        {/* Thumbnails: Left vertical on desktop, horizontal beneath image on mobile */}
        {product.images && product.images.length > 1 && (
          <div className="order-2 md:order-1 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[420px] scrollbar-none pb-2 md:pb-0 shrink-0">
            {product.images.map((img, idx) => {
              const active = img === selectedImage;
              return (
                <button
                  key={idx}
                  onMouseEnter={() => setSelectedImage(img)}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 relative border rounded-sm p-1 transition-all shrink-0 bg-white ${
                    active
                      ? "border-blue-600 shadow-sm ring-1 ring-blue-500"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image with Zoom: Top on mobile, right on desktop */}
        <div
          className="order-1 md:order-2 relative w-full h-[320px] sm:h-[380px] md:h-[460px] md:flex-1 shrink-0 border border-gray-200 rounded-sm bg-white overflow-hidden cursor-crosshair flex items-center justify-center p-4"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute top-3 right-3 z-20 bg-white/90 rounded-full shadow-sm">
            <WishlistButton product={product} />
          </div>

          <div className="relative w-full h-full min-h-[260px]">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              priority
              className="object-contain p-2"
            />
          </div>

          {/* Interactive Zoom Overlay (Desktop only) */}
          {isZoomed && (
            <div
              className="absolute inset-0 pointer-events-none z-10 hidden md:block bg-white"
              style={{
                backgroundImage: `url(${selectedImage})`,
                backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                backgroundSize: "220%",
                backgroundRepeat: "no-repeat",
              }}
            />
          )}
        </div>
      </div>

      {/* Desktop Inline Dual Action Buttons */}
      <div className="hidden md:grid w-full grid-cols-2 gap-3 mt-4">
        <button
          onClick={handleAddToCart}
          className={`py-3.5 px-4 rounded-sm text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] ${
            isInCart
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-[#ff9f00] text-white hover:bg-yellow-600"
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-5 h-5" /> Go to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="py-3.5 px-4 rounded-sm text-sm font-bold uppercase tracking-wide bg-[#fb641b] text-white hover:bg-orange-600 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Zap className="w-5 h-5 fill-white stroke-none" /> Buy Now
        </button>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Fixed above global bottom nav) */}
      <div className="md:hidden fixed bottom-[52px] left-0 right-0 z-40 bg-white border-t border-gray-200 px-3 py-2 shadow-2xl grid grid-cols-2 gap-2">
        <button
          onClick={handleAddToCart}
          className={`py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 ${
            isInCart
              ? "bg-green-600 text-white"
              : "bg-[#ff9f00] text-white"
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-4 h-4" /> Go to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          className="py-2.5 px-3 rounded-sm text-xs font-bold uppercase tracking-wider bg-[#fb641b] text-white shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4 fill-white stroke-none" /> Buy Now
        </button>
      </div>
    </div>
  );
}
