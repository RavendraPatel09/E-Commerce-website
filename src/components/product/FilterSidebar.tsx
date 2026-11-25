"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { RatingStars } from "./RatingStars";
import { AssuredBadge } from "../ui/AssuredBadge";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export interface FilterState {
  category?: string;
  subCategory?: string;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minDiscount?: number;
  isAssured?: boolean;
  inStockOnly?: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  availableBrands: string[];
  priceRange: { min: number; max: number };
  onClear: () => void;
}

export function FilterSidebar({
  filters,
  onChange,
  availableBrands,
  priceRange,
  onClear,
}: FilterSidebarProps) {
  const [brandSearch, setBrandSearch] = useState("");
  const [openSections, setOpenSections] = useState({
    price: true,
    brand: true,
    rating: true,
    discount: true,
    assured: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBrandToggle = (brand: string) => {
    const brandLower = brand.toLowerCase();
    const current = [...filters.brands];
    const exists = current.includes(brandLower);

    const next = exists
      ? current.filter((b) => b !== brandLower)
      : [...current, brandLower];

    onChange({ ...filters, brands: next });
  };

  const filteredBrands = availableBrands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase().trim())
  );

  return (
    <aside className="w-full bg-white border border-gray-200 rounded-sm divide-y divide-gray-100 text-gray-800 text-xs">
      {/* Header */}
      <div className="p-3.5 flex items-center justify-between">
        <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
          Filters
        </h2>
        <button
          onClick={onClear}
          className="text-[#2874f0] font-bold text-xs hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* BharatKart Plus Assured */}
      <div className="p-3.5">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.isAssured}
            onChange={(e) => onChange({ ...filters, isAssured: e.target.checked })}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <AssuredBadge />
        </label>
      </div>

      {/* Price Section */}
      <div className="p-3.5">
        <div
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between cursor-pointer font-bold text-gray-900 uppercase tracking-wider mb-2"
        >
          <span>Price</span>
          {openSections.price ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>

        {openSections.price && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-1/2 p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="w-1/2 p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            {/* Quick Price Range Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: "Under ₹5K", min: 0, max: 5000 },
                { label: "₹5K - ₹20K", min: 5000, max: 20000 },
                { label: "₹20K - ₹60K", min: 20000, max: 60000 },
                { label: "Above ₹60K", min: 60000, max: undefined },
              ].map((p, idx) => {
                const active = filters.minPrice === p.min && filters.maxPrice === p.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (active) {
                        onChange({ ...filters, minPrice: undefined, maxPrice: undefined });
                      } else {
                        onChange({ ...filters, minPrice: p.min, maxPrice: p.max });
                      }
                    }}
                    className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 font-bold"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <span>Min: {formatINR(priceRange.min || 0)}</span>
              <span>Max: {formatINR(priceRange.max || 150000)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Brand Section */}
      <div className="p-3.5">
        <div
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between cursor-pointer font-bold text-gray-900 uppercase tracking-wider mb-2"
        >
          <span>Brand</span>
          {openSections.brand ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>

        {openSections.brand && (
          <div className="space-y-2 pt-1">
            <input
              type="text"
              placeholder="Search Brand"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="w-full p-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-500 mb-2"
            />
            <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {filteredBrands.map((brand) => {
                const checked = filters.brands.includes(brand.toLowerCase());
                return (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-medium text-gray-700">{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className="p-3.5">
        <div
          onClick={() => toggleSection("rating")}
          className="flex items-center justify-between cursor-pointer font-bold text-gray-900 uppercase tracking-wider mb-2"
        >
          <span>Customer Ratings</span>
          {openSections.rating ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>

        {openSections.rating && (
          <div className="space-y-2 pt-1">
            {[4, 3, 2].map((r) => (
              <label key={r} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ratingFilter"
                  checked={filters.minRating === r}
                  onChange={() => onChange({ ...filters, minRating: filters.minRating === r ? undefined : r })}
                  onClick={() => {
                    if (filters.minRating === r) onChange({ ...filters, minRating: undefined });
                  }}
                  className="w-3.5 h-3.5 text-blue-600 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-medium">
                  {r}★ & above
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Discount Section */}
      <div className="p-3.5">
        <div
          onClick={() => toggleSection("discount")}
          className="flex items-center justify-between cursor-pointer font-bold text-gray-900 uppercase tracking-wider mb-2"
        >
          <span>Discount</span>
          {openSections.discount ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>

        {openSections.discount && (
          <div className="space-y-2 pt-1">
            {[40, 30, 20, 10].map((d) => (
              <label key={d} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="discountFilter"
                  checked={filters.minDiscount === d}
                  onChange={() => onChange({ ...filters, minDiscount: filters.minDiscount === d ? undefined : d })}
                  onClick={() => {
                    if (filters.minDiscount === d) onChange({ ...filters, minDiscount: undefined });
                  }}
                  className="w-3.5 h-3.5 text-blue-600 cursor-pointer"
                />
                <span className="font-medium text-gray-700">{d}% or more</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Availability Section */}
      <div className="p-3.5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.inStockOnly}
            onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
            className="w-3.5 h-3.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="font-medium text-gray-700">In Stock Only</span>
        </label>
      </div>
    </aside>
  );
}
