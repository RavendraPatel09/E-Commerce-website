import React from "react";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";

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

  return <ProductDetailClient product={product} similarProducts={similarProducts} />;
}
