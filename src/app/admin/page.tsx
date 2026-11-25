"use client";

import React, { useState, useEffect } from "react";
import { Product, PromotionalBanner, HomepageSection, Order } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import {
  TrendingUp,
  Package,
  Layers,
  Image as ImageIcon,
  Users,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"metrics" | "products" | "banners" | "sections" | "orders">("metrics");
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Banner modal
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    ctaText: "Shop Deals",
    ctaLink: "/search",
    imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=85",
    badge: "FESTIVE SALE",
  });

  // Section modal
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [newSection, setNewSection] = useState({
    title: "",
    subtitle: "",
    dealTag: "From ₹4,999",
    viewAllLink: "/search",
    productIds: "",
    type: "carousel" as const,
  });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [prodRes, bannerRes, sectionRes, orderRes] = await Promise.all([
        fetch("/api/products?limit=100"),
        fetch("/api/banners?admin=true"),
        fetch("/api/sections?admin=true"),
        fetch("/api/orders"),
      ]);

      const prodData = await prodRes.json();
      const bannerData = await bannerRes.json();
      const sectionData = await sectionRes.json();
      const orderData = await orderRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (bannerData.success) setBanners(bannerData.banners);
      if (sectionData.success) setSections(sectionData.sections);
      if (orderData.success) setOrders(orderData.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData();
      }
    } catch (e) {
      alert("Failed to update order");
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBanner),
      });
      const data = await res.json();
      if (data.success) {
        setShowBannerModal(false);
        setNewBanner({
          title: "",
          subtitle: "",
          ctaText: "Shop Deals",
          ctaLink: "/search",
          imageUrl: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=85",
          badge: "FESTIVE SALE",
        });
        loadAdminData();
      }
    } catch (e) {
      alert("Failed to create banner");
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    const pids = newSection.productIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSection.title,
          subtitle: newSection.subtitle,
          dealTag: newSection.dealTag,
          viewAllLink: newSection.viewAllLink,
          productIds: pids.length > 0 ? pids : products.slice(0, 4).map((p) => p.id),
          type: newSection.type,
          order: sections.length + 1,
          active: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSectionModal(false);
        setNewSection({
          title: "",
          subtitle: "",
          dealTag: "From ₹4,999",
          viewAllLink: "/search",
          productIds: "",
          type: "carousel",
        });
        loadAdminData();
      }
    } catch (e) {
      alert("Failed to create section");
    }
  };

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommission = Math.round(totalGMV * 0.1);
  const lowStockItems = products.filter((p) => p.stockCount <= 20);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-[#2874f0] text-[10px] font-black uppercase px-2 py-0.5 rounded">
              BHARATKART MASTER ADMIN
            </span>
            <span className="bg-emerald-100 text-[#388e3c] text-[10px] font-bold px-2 py-0.5 rounded">
              Live APIs Connected
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
            Marketplace Operations & Catalog Control
          </h1>
          <p className="text-xs text-gray-500">
            Edit homepage sections and banners live without touching code
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none border-b border-gray-200 pb-2 text-xs font-bold">
        {[
          { id: "metrics", label: "Overview Analytics", icon: TrendingUp },
          { id: "products", label: `Catalog & Inventory (${products.length})`, icon: Package },
          { id: "banners", label: `Homepage Banners (${banners.length})`, icon: ImageIcon },
          { id: "sections", label: `Homepage Sections (${sections.length})`, icon: Layers },
          { id: "orders", label: `Platform Orders (${orders.length})`, icon: ShoppingBag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-sm whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: METRICS */}
      {activeTab === "metrics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Marketplace GMV
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">{formatINR(totalGMV)}</p>
              <span className="text-[11px] text-green-600 font-semibold block mt-1">
                From {orders.length} orders
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Platform Commission Earned
              </span>
              <p className="text-2xl font-black text-[#2874f0] mt-1">{formatINR(totalCommission)}</p>
              <span className="text-[11px] text-gray-400 font-medium block mt-1">
                10% net take rate
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Active Catalog Units
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">{products.length} Products</p>
              <span className="text-[11px] text-gray-400 font-medium block mt-1">
                4 Verified Sellers
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Low Stock Alerts
              </span>
              <p className="text-2xl font-black text-amber-600 mt-1">{lowStockItems.length} SKUs</p>
              <span className="text-[11px] text-amber-700 font-medium block mt-1">
                Replenishment advised
              </span>
            </div>
          </div>

          {/* Low Stock Alerts Table */}
          {lowStockItems.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Urgent Stock Alerts (Remaining units &le; 20)
                </h3>
              </div>
              <div className="divide-y divide-gray-100 text-xs">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.title} className="w-8 h-8 object-contain" />
                      <span className="font-bold text-gray-800">{item.title}</span>
                    </div>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      Only {item.stockCount} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: PRODUCTS */}
      {activeTab === "products" && (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Product Catalog ({products.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
                <tr>
                  <th className="p-3 pl-4">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Assured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3 pl-4 flex items-center gap-3">
                      <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-contain border p-1 rounded" />
                      <div className="truncate max-w-xs">
                        <p className="font-bold text-gray-900 truncate">{p.title}</p>
                        <span className="text-[11px] text-gray-400">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-3 capitalize text-gray-600 font-medium">{p.category}</td>
                    <td className="p-3 font-extrabold text-gray-900">{formatINR(p.price)}</td>
                    <td className="p-3 font-bold text-[#388e3c]">{p.discountPercentage}% off</td>
                    <td className="p-3 font-bold text-gray-800">{p.stockCount} units</td>
                    <td className="p-3 font-bold text-amber-600">{p.rating} ★</td>
                    <td className="p-3">
                      {p.isAssured ? (
                        <span className="text-blue-600 font-bold text-[10px] bg-blue-50 px-1.5 py-0.5 rounded">
                          Plus Assured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-[10px]">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: BANNERS (Editable without code changes) */}
      {activeTab === "banners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Homepage Hero Banners ({banners.length})
              </h3>
              <p className="text-xs text-gray-500">Add or edit promotional slider banners live on the homepage</p>
            </div>
            <button
              onClick={() => setShowBannerModal(true)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Promotional Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm flex flex-col justify-between">
                <div className="relative w-full h-36 bg-gray-900">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#ffe11b] text-gray-950 font-black text-[10px] px-1.5 py-0.5 rounded">
                    {b.badge}
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{b.title}</h4>
                  <p className="text-gray-500 line-clamp-2">{b.subtitle}</p>
                  <p className="text-blue-600 font-semibold pt-1">Links to: {b.ctaLink}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for new banner */}
          {showBannerModal && (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
              <div onClick={() => setShowBannerModal(false)} className="absolute inset-0 bg-black/50" />
              <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl p-6 z-10 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-gray-900">Create Live Homepage Banner</h3>
                <form onSubmit={handleAddBanner} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Banner Headline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MEGA SAVINGS FESTIVAL"
                      value={newBanner.title}
                      onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Up to 70% off on premium audio & laptops"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">CTA Link</label>
                    <input
                      type="text"
                      required
                      placeholder="/search?category=electronics"
                      value={newBanner.ctaLink}
                      onChange={(e) => setNewBanner({ ...newBanner, ctaLink: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Image URL</label>
                    <input
                      type="text"
                      required
                      value={newBanner.imageUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowBannerModal(false)} className="px-3 py-1.5 text-gray-500 font-bold hover:underline">
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#2874f0] text-white font-bold px-5 py-2 rounded-sm shadow-sm">
                      Publish Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: HOMEPAGE SECTIONS (Editable without code changes) */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Dynamic Homepage Product Sections ({sections.length})
              </h3>
              <p className="text-xs text-gray-500">Configure promotional carousels that appear on the homepage</p>
            </div>
            <button
              onClick={() => setShowSectionModal(true)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Homepage Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec) => (
              <div key={sec.id} className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 text-sm">{sec.title}</h4>
                    {sec.dealTag && (
                      <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {sec.dealTag}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{sec.subtitle}</p>
                  <p className="text-gray-400 mt-1">
                    {sec.productIds.length} Products configured • View all link: {sec.viewAllLink}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 font-bold text-[10px] px-2 py-0.5 rounded uppercase">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for new section */}
          {showSectionModal && (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
              <div onClick={() => setShowSectionModal(false)} className="absolute inset-0 bg-black/50" />
              <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl p-6 z-10 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-gray-900">Create Live Homepage Section</h3>
                <form onSubmit={handleAddSection} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Section Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Trending Smartwatches & Audio"
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Subtitle</label>
                    <input
                      type="text"
                      placeholder="e.g. Extra 10% off with bank cards"
                      value={newSection.subtitle}
                      onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Deal Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Min 30% Off"
                      value={newSection.dealTag}
                      onChange={(e) => setNewSection({ ...newSection, dealTag: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">View All Target Link</label>
                    <input
                      type="text"
                      placeholder="/search?category=electronics"
                      value={newSection.viewAllLink}
                      onChange={(e) => setNewSection({ ...newSection, viewAllLink: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowSectionModal(false)} className="px-3 py-1.5 text-gray-500 font-bold hover:underline">
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#2874f0] text-white font-bold px-5 py-2 rounded-sm shadow-sm">
                      Create Section
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Manage All Marketplace Orders ({orders.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
                <tr>
                  <th className="p-3 pl-4">Order ID & Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items Count</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Tracking Status</th>
                  <th className="p-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-3 pl-4">
                      <strong className="font-mono text-blue-600">{o.id}</strong>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-bold text-gray-900">{o.customerName}</p>
                      <p className="text-gray-400 text-[11px]">{o.shippingAddress.city}, {o.shippingAddress.state}</p>
                    </td>
                    <td className="p-3 font-semibold text-gray-700">{o.items.length} item(s)</td>
                    <td className="p-3 font-extrabold text-gray-900">{formatINR(o.totalAmount)}</td>
                    <td className="p-3">
                      <span className="font-bold text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-blue-700">{o.currentStatus}</td>
                    <td className="p-3">
                      <select
                        value={o.currentStatus}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="p-1 border border-gray-300 rounded text-xs font-semibold focus:outline-none focus:border-blue-600"
                      >
                        <option value="Ordered">Ordered</option>
                        <option value="Order Confirmed">Order Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out For Delivery">Out For Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
