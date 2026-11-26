"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, Category } from "@/lib/types";
import { FilterSidebar, FilterState } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Pagination } from "@/components/product/Pagination";
import { ProductGridSkeleton } from "@/components/common/Skeletons";
import { ChevronRight, SlidersHorizontal, X, Layers, Sparkles } from "lucide-react";
import Link from "next/link";

function CategoryContent() {
  const params = useParams();
  const router = useRouter();
  const categorySlug = (params?.slug as string) || "";

  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [facets, setFacets] = useState<{ brands: string[]; priceRange: { min: number; max: number } }>({
    brands: [],
    priceRange: { min: 0, max: 200000 },
  });

  const [filters, setFilters] = useState<FilterState>({
    category: categorySlug,
    subCategory: undefined,
    brands: [],
    minPrice: undefined,
    maxPrice: undefined,
    minRating: undefined,
    minDiscount: undefined,
    isAssured: undefined,
    inStockOnly: undefined,
  });

  // Fetch category metadata
  useEffect(() => {
    async function loadCategoryInfo() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.categories) {
          const match = data.categories.find(
            (c: Category) =>
              c.slug.toLowerCase() === categorySlug.toLowerCase() ||
              c.id.toLowerCase() === categorySlug.toLowerCase()
          );
          if (match) {
            setCategoryInfo(match);
          }
        }
      } catch (err) {
        console.error("Failed to fetch category metadata", err);
      }
    }
    if (categorySlug) loadCategoryInfo();
  }, [categorySlug]);

  // Fetch products for category
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const urlParams = new URLSearchParams();
        urlParams.set("category", categorySlug);
        if (selectedSubCategory) urlParams.set("subCategory", selectedSubCategory);
        if (filters.brands.length > 0) urlParams.set("brand", filters.brands.join(","));
        if (filters.minPrice !== undefined) urlParams.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice !== undefined) urlParams.set("maxPrice", filters.maxPrice.toString());
        if (filters.minRating !== undefined) urlParams.set("minRating", filters.minRating.toString());
        if (filters.minDiscount !== undefined) urlParams.set("minDiscount", filters.minDiscount.toString());
        if (filters.isAssured) urlParams.set("isAssured", "true");
        if (filters.inStockOnly) urlParams.set("inStockOnly", "true");
        urlParams.set("sort", sort);
        urlParams.set("page", page.toString());
        urlParams.set("limit", "12");

        const res = await fetch(`/api/products?${urlParams.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProducts(data.products);
          setTotal(data.total);
          setTotalPages(data.totalPages || 1);
          if (data.facets) setFacets(data.facets);
        }
      } catch (err) {
        console.error("Failed to load category products", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [categorySlug, selectedSubCategory, filters, sort, page]);

  const handleClearFilters = () => {
    setSelectedSubCategory("");
    setFilters({
      category: categorySlug,
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

  const categoryTitle = categoryInfo?.name || (categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace("-", " "));

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-gray-500 py-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/search" className="hover:text-blue-600">All Categories</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-gray-900 font-bold">{categoryTitle}</span>
          <span className="text-gray-400">({total} items)</span>
        </div>

        {/* Mobile Filter Trigger */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-300 px-3 py-1.5 rounded text-xs font-bold text-gray-800 shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Category Banner & Subcategories Bar */}
      <div className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
              {categoryTitle}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Explore authentic {categoryTitle.toLowerCase()} with exclusive deals, brand warranty, and fast delivery
            </p>
          </div>
          <span className="self-start sm:self-auto text-[11px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-[2px]">
            100% Genuine Guaranteed
          </span>
        </div>

        {/* Subcategories Horizontal Scroll Chips */}
        {categoryInfo?.subcategories && categoryInfo.subcategories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-xs font-bold text-gray-600 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Subcategories:
            </span>
            <button
              onClick={() => {
                setSelectedSubCategory("");
                setPage(1);
              }}
              className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 transition-colors ${
                selectedSubCategory === ""
                  ? "bg-blue-600 text-white font-bold"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All {categoryTitle}
            </button>
            {categoryInfo.subcategories.map((sub) => {
              const active = selectedSubCategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    setSelectedSubCategory(active ? "" : sub.slug);
                    setPage(1);
                  }}
                  className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 transition-colors ${
                    active
                      ? "bg-blue-600 text-white font-bold shadow-xs"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex gap-3 items-start">
        {/* Left: Desktop Filter Sidebar */}
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
            <ProductGridSkeleton count={8} />
          ) : (
            <>
              <ProductGrid products={products} onClearFilters={handleClearFilters} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-gray-500">
          Loading Category Store...
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
