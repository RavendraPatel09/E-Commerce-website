"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "@/lib/types";
import { ProductGallery } from "./ProductGallery";
import { ProductInformation } from "./ProductInformation";
import { ReviewSection } from "./ReviewSection";
import { ProductSection } from "../home/ProductSection";

interface ProductDetailClientProps {
  product: Product;
  similarProducts: Product[];
}

export function ProductDetailClient({ product, similarProducts }: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );

  return (
    <div className="space-y-6">
      {/* Top Main Section: Dual Column Layout */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Action Buttons */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-24 z-10">
            <ProductGallery product={product} selectedVariant={selectedVariant} />
          </div>

          {/* Right Column: Title, Prices, Specs, Delivery */}
          <div className="lg:col-span-7">
            <ProductInformation
              product={product}
              selectedVariant={selectedVariant}
              onVariantChange={setSelectedVariant}
            />
          </div>
        </div>
      </div>

      {/* Ratings & Reviews Section */}
      <ReviewSection
        rating={product.rating}
        ratingCount={product.ratingCount}
        reviewCount={product.reviewCount}
        reviews={product.reviews}
      />

      {/* Similar Products Carousel */}
      {similarProducts.length > 0 && (
        <ProductSection
          title="Similar Products You May Like"
          subtitle={`Top rated items in ${product.category}`}
          viewAllLink={`/search?category=${product.category}`}
          products={similarProducts}
        />
      )}
    </div>
  );
}
