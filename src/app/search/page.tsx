"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { FilterSidebar, FilterState } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SlidersHorizontal, ChevronRight, X } from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("search") || "";
  const categoryParam = searchParams.get("category") || "";
  const subCategoryParam = searchParams.get("subCategory") || "";
  const brandParam = searchParams.get("brand") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<{ brands: string[]; priceRange: { min: number; max: number } }>({
    brands: [],
    priceRange: { min: 0, max: 200000 },
  });

  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    category: categoryParam || undefined,
    subCategory: subCategoryParam || undefined,
    brands: brandParam ? brandParam.split(",").map((b) => b.trim().toLowerCase()) : [],
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    minDiscount: undefined,
    isAssured: undefined,
    inStockOnly: undefined,
  });

  // Fetch products whenever filters or sort changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (filters.category) params.set("category", filters.category);
        if (filters.subCategory) params.set("subCategory", filters.subCategory);
        if (filters.brands.length > 0) params.set("brand", filters.brands.join(","));
        if (filters.minPrice !== undefined) params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined) params.set("maxPrice", filters.maxPrice.toString());
        if (filters.minRating !== undefined) params.set("minRating", filters.minRating.toString());
        if (filters.minDiscount !== undefined) params.set("minDiscount", filters.minDiscount.toString());
        if (filters.isAssured) params.set("isAssured", "true");
        if (filters.inStockOnly) params.set("inStockOnly", "true");
        params.set("sort", sort);
        params.set("page", page.toString());
        params.set("limit", "16");

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setTotal(data.total);
          if (data.facets) setFacets(data.facets);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, filters, sort, page]);

  const handleClearFilters = () => {
    setFilters({
      category: undefined,
      subCategory: undefined,
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      minDiscount: undefined,
      isAssured: undefined,
      inStockOnly: undefined,
    });
    setSort("relevance");
    setPage(1);
  };

  const pageTitle = searchQuery
    ? `Results for "${searchQuery}"`
    : filters.category
    ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Store`
    : "All Products";

  return (
    <div className="space-y-3">
      {/* Breadcrumbs & Mobile Filter Header */}
      <div className="flex items-center justify-between py-1 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span onClick={() => router.push("/")} className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-semibold">{pageTitle}</span>
          <span className="text-gray-400">({total} items)</span>
        </div>

        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-300 px-3 py-1.5 rounded text-xs font-bold text-gray-800 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-3 items-start">
        {/* Left: Filter Sidebar (Desktop) */}
        <div className="hidden lg:block w-[280px] shrink-0 sticky top-16">
          <FilterSidebar
            filters={filters}
            onChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1);
            }}
            availableBrands={facets.brands}
            priceRange={facets.priceRange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Mobile Filter Modal Sheet */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <div className="absolute inset-y-0 left-0 w-[300px] bg-white z-10 overflow-y-auto">
              <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                <span className="font-bold text-sm">Filters</span>
                <button onClick={() => setIsMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <FilterSidebar
                filters={filters}
                onChange={(newFilters) => {
                  setFilters(newFilters);
                  setPage(1);
                }}
                availableBrands={facets.brands}
                priceRange={facets.priceRange}
                onClear={handleClearFilters}
              />
            </div>
          </div>
        )}

        {/* Right: Products List & Sort Bar */}
        <div className="flex-1 min-w-0">
          <SortBar
            currentSort={sort}
            onSortChange={(s) => {
              setSort(s);
              setPage(1);
            }}
            totalResults={total}
          />

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded p-4 h-72 animate-pulse flex flex-col justify-between">
                  <div className="w-full h-36 bg-gray-200 rounded" />
                  <div className="space-y-2 mt-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={products} onClearFilters={handleClearFilters} />
          )}
        </div>
      </div>
    </div>
  );
}
