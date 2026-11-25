"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { WishlistButton } from "./WishlistButton";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.images[0] || product.thumbnail);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const isInCart = cartItems.some((item) => item.productId === product.id);

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
      addToCart(product, 1);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/checkout");
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full flex flex-col-reverse md:flex-row gap-3">
        {/* Vertical Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-[420px] scrollbar-none pb-2 md:pb-0 shrink-0">
            {product.images.map((img, idx) => {
              const active = img === selectedImage;
              return (
                <button
                  key={idx}
                  onMouseEnter={() => setSelectedImage(img)}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-16 relative border rounded-sm p-1 transition-all shrink-0 ${
                    active ? "border-blue-600 shadow-sm ring-1 ring-blue-500" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <Image src={img} alt={`${product.title} ${idx + 1}`} fill className="object-contain p-1" />
                </button>
              );
            })}
          </div>
        )}

        {/* Main Image with Zoom */}
        <div
          className="relative flex-1 min-h-[320px] md:min-h-[440px] h-[360px] md:h-[460px] border border-gray-200 rounded-sm bg-white overflow-hidden cursor-crosshair flex items-center justify-center p-4"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute top-3 right-3 z-20 bg-white/90 rounded-full shadow-sm">
            <WishlistButton product={product} />
          </div>

          <div className="relative w-full h-full">
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              priority
              className="object-contain p-2"
            />
          </div>

          {/* Interactive Zoom Overlay */}
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

      {/* Dual Sticky Action Buttons */}
      <div className="w-full grid grid-cols-2 gap-3 mt-4">
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
    </div>
  );
}
