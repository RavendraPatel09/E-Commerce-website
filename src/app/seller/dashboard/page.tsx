"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  DollarSign,
  Package,
  Plus,
  TrendingUp,
  CheckCircle,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form
  const [newProd, setNewProd] = useState({
    title: "",
    brand: "",
    category: "electronics",
    price: "",
    originalPrice: "",
    stockCount: "25",
    thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    description: "",
  });

  const loadData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch("/api/products?limit=50"),
        fetch("/api/orders"),
      ]);
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (orderData.success) setOrders(orderData.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProd,
          price: Number(newProd.price),
          originalPrice: Number(newProd.originalPrice || newProd.price),
          stockCount: Number(newProd.stockCount),
          sellerName: "RetailNet SuperStore",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProd({
          title: "",
          brand: "",
          category: "electronics",
          price: "",
          originalPrice: "",
          stockCount: "25",
          thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
          description: "",
        });
        loadData();
      }
    } catch (e) {
      alert("Error adding product");
    }
  };

  const grossSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const commission = Math.round(grossSales * 0.1); // 10%
  const netPayout = grossSales - commission;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              VERIFIED SELLER ATELIER
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
            RetailNet SuperStore — Seller Command Center
          </h1>
          <p className="text-xs text-gray-500">Manage listings, track daily dispatches & monitor payouts</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs py-2.5 px-5 rounded-sm uppercase tracking-wide flex items-center gap-2 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Listing</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Gross Marketplace Sales
          </span>
          <p className="text-2xl font-black text-gray-900 mt-1">{formatINR(grossSales)}</p>
          <span className="text-[11px] text-[#388e3c] font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +14.8% this week
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Marketplace 10% Commission
          </span>
          <p className="text-2xl font-black text-gray-900 mt-1">{formatINR(commission)}</p>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            Includes gateway & logistics fee
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Net Available Payout
          </span>
          <p className="text-2xl font-black text-[#388e3c] mt-1">{formatINR(netPayout)}</p>
          <button
            onClick={() => alert("Payout request of " + formatINR(netPayout) + " submitted. Expected in your account within 24 hours.")}
            className="text-[11px] text-blue-600 font-bold hover:underline block mt-1"
          >
            Disburse to Bank Account →
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Active Catalog Count
          </span>
          <p className="text-2xl font-black text-gray-900 mt-1">{products.length} Items</p>
          <span className="text-[11px] text-gray-400 font-medium block mt-1">
            Across 5 major categories
          </span>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Your Active Product Inventory
          </h3>
          <span className="text-gray-400">{products.length} products total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
              <tr>
                <th className="p-3 pl-4">Product Details</th>
                <th className="p-3">Category</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">MRP</th>
                <th className="p-3">Stock Units</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="p-3 pl-4 flex items-center gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-10 h-10 object-contain border p-1 rounded shrink-0"
                    />
                    <div className="truncate max-w-xs">
                      <p className="font-bold text-gray-900 truncate">{p.title}</p>
                      <span className="text-[11px] text-gray-400">{p.brand}</span>
                    </div>
                  </td>
                  <td className="p-3 capitalize text-gray-600 font-medium">{p.category}</td>
                  <td className="p-3 font-extrabold text-gray-900">{formatINR(p.price)}</td>
                  <td className="p-3 text-gray-400 line-through">{formatINR(p.originalPrice)}</td>
                  <td className="p-3 font-bold text-gray-800">{p.stockCount} in stock</td>
                  <td className="p-3">
                    <span className="bg-emerald-50 text-[#388e3c] border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                      Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add New Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl p-6 z-10 space-y-4 text-xs">
            <h3 className="text-base font-bold text-gray-900">List New Product on BharatKart</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony WH-1000XM6 Headphones"
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sony"
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="mobiles">Mobiles</option>
                    <option value="appliances">Appliances</option>
                    <option value="fashion">Fashion</option>
                    <option value="home-furniture">Home & Furniture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="24999"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="29999"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={newProd.stockCount}
                    onChange={(e) => setNewProd({ ...newProd, stockCount: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  required
                  value={newProd.thumbnail}
                  onChange={(e) => setNewProd({ ...newProd, thumbnail: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-500 font-bold hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold px-6 py-2 rounded-sm shadow-sm"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
