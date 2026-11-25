import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInformation } from "@/components/product/ProductInformation";
import { ReviewSection } from "@/components/product/ReviewSection";
import { ProductSection } from "@/components/home/ProductSection";

interface ProductPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = db.getProductById(params.id);

  if (!product) {
    notFound();
  }

  // Similar products in same category
  const similarProducts = db
    .getAllProducts()
    .filter((p) => p.category === product.category && p.id !== product.id);

  return (
    <div className="space-y-6">
      {/* Top Main Section: Dual Column Layout */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery & Action Buttons */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-20 z-10">
            <ProductGallery product={product} />
          </div>

          {/* Right Column: Title, Prices, Specs, Delivery */}
          <div className="lg:col-span-7">
            <ProductInformation product={product} />
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
