"use client";

import React, { useState, useEffect } from "react";
import { Product, Order, Payout, Refund, Seller } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { RolePersonaBar } from "@/components/common/RolePersonaBar";
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
  Store,
  Layers,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Send,
  RefreshCw,
  Edit,
  Save,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function SellerDashboardPage() {
  const { user, switchPersona } = useAuth();
  const currentSellerId = user?.sellerId || "seller-retailnet";

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "add-product" | "orders" | "payouts" | "returns"
  >("overview");

  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellerOrders, setSellerOrders] = useState<{ order: Order; items: any[] }[]>([]);
  const [financials, setFinancials] = useState<any>({
    grossSales: 0,
    totalCommission: 0,
    netEarnings: 0,
    paidOut: 0,
    pendingPayouts: 0,
    availableBalance: 0,
    totalItemsSold: 0,
  });
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  // Inline Stock Edit State
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<number>(0);
  const [editingPriceVal, setEditingPriceVal] = useState<number>(0);

  // Dispatch Shipment Modal
  const [dispatchItem, setDispatchItem] = useState<{ orderId: string; productId: string; title: string } | null>(null);
  const [courierPartner, setCourierPartner] = useState("BlueDart Express");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Request Payout Modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState<number>(10000);

  // New Product Form
  const [newProd, setNewProd] = useState({
    title: "",
    brand: "",
    category: "electronics",
    subCategory: "audio",
    price: "",
    originalPrice: "",
    stockCount: "25",
    thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
    description: "",
    highlights: "100% Original Brand Product\n1 Year Comprehensive Warranty\nFast Express Shipping",
    specifications: "General: Warranty : 1 Year\nGeneral: Brand : BharatKart Partner",
  });
  const [productSubmitSuccess, setProductSubmitSuccess] = useState(false);

  const loadSellerData = async () => {
    try {
      setLoading(true);

      const [sellerRes, prodRes, finRes, orderRes, refundRes] = await Promise.all([
        fetch(`/api/sellers/${currentSellerId}`),
        fetch(`/api/products?sellerId=${currentSellerId}&admin=true`),
        fetch(`/api/sellers/${currentSellerId}/financials`),
        fetch(`/api/sellers/${currentSellerId}/orders`),
        fetch(`/api/refunds?sellerId=${currentSellerId}`),
      ]);

      const sellerData = await sellerRes.json();
      const prodData = await prodRes.json();
      const finData = await finRes.json();
      const orderData = await orderRes.json();
      const refundData = await refundRes.json();

      if (sellerData.success) setSeller(sellerData.seller);
      if (prodData.success) setProducts(prodData.products);
      if (finData.success) {
        setFinancials(finData.financials);
        setPayouts(finData.payouts || []);
      }
      if (orderData.success) setSellerOrders(orderData.orders || []);
      if (refundData.success) setRefunds(refundData.refunds || []);
    } catch (e) {
      console.error("Failed to load seller hub data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, [currentSellerId]);

  // Handle Inline Stock & Price Update
  const handleSaveStockUpdate = async (productId: string) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          stockCount: editingStockVal,
          price: editingPriceVal > 0 ? editingPriceVal : undefined,
          inStock: editingStockVal > 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditingStockId(null);
        loadSellerData();
      } else {
        alert(data.error || "Failed to update stock");
      }
    } catch (e) {
      alert("Error updating inventory");
    }
  };

  // Handle Product Submission (Pending Admin Approval)
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const highlightsList = newProd.highlights.split("\n").map((h) => h.trim()).filter(Boolean);

      const specsList = newProd.specifications.split("\n").map((line) => {
        const parts = line.split(":");
        if (parts.length >= 3) {
          return { category: parts[0].trim(), items: [{ key: parts[1].trim(), value: parts[2].trim() }] };
        }
        return { category: "General", items: [{ key: "Details", value: line.trim() }] };
      });

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProd.title,
          brand: newProd.brand,
          category: newProd.category,
          subCategory: newProd.subCategory,
          price: Number(newProd.price),
          originalPrice: Number(newProd.originalPrice || newProd.price),
          stockCount: Number(newProd.stockCount),
          thumbnail: newProd.thumbnail,
          description: newProd.description || `${newProd.title} listed on BharatKart.`,
          highlights: highlightsList,
          specifications: specsList,
          sellerId: currentSellerId,
          sellerName: seller?.name || "Verified Seller",
          isSellerSubmission: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setProductSubmitSuccess(true);
        setNewProd({
          title: "",
          brand: "",
          category: "electronics",
          subCategory: "audio",
          price: "",
          originalPrice: "",
          stockCount: "25",
          thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
          description: "",
          highlights: "100% Original Brand Product\n1 Year Comprehensive Warranty\nFast Express Shipping",
          specifications: "General: Warranty : 1 Year\nGeneral: Brand : BharatKart Partner",
        });
        loadSellerData();
        setTimeout(() => setProductSubmitSuccess(false), 5000);
      } else {
        alert(data.error || "Failed to submit product");
      }
    } catch (e) {
      alert("Error submitting product for approval");
    }
  };

  // Handle Split Order Item Status Update
  const handleUpdateItemStatus = async (
    orderId: string,
    productId: string,
    status: string,
    courier?: string,
    tracking?: string
  ) => {
    try {
      const res = await fetch(`/api/sellers/${currentSellerId}/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          productId,
          status,
          courierPartner: courier,
          trackingNumber: tracking,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDispatchItem(null);
        setTrackingNumber("");
        loadSellerData();
      } else {
        alert(data.error || "Failed to update item status");
      }
    } catch (e) {
      alert("Error updating order fulfillment");
    }
  };

  // Handle Request Payout
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: currentSellerId,
          amount: Number(payoutAmount),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowPayoutModal(false);
        loadSellerData();
        alert(`Payout request of ${formatINR(payoutAmount)} submitted successfully!`);
      } else {
        alert(data.error || "Failed to request payout");
      }
    } catch (e) {
      alert("Error submitting payout request");
    }
  };

  // Handle Refund / Return Approval
  const handleRefundAction = async (refundId: string, status: "APPROVED" | "REJECTED" | "PROCESSED") => {
    try {
      const res = await fetch("/api/refunds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: refundId, status }),
      });
      const data = await res.json();
      if (data.success) {
        loadSellerData();
      } else {
        alert(data.error || "Failed to update refund");
      }
    } catch (e) {
      alert("Error updating refund status");
    }
  };

  const pendingOrdersCount = sellerOrders.reduce(
    (count, entry) =>
      count + entry.items.filter((i) => i.status !== "DELIVERED" && i.status !== "CANCELLED").length,
    0
  );

  return (
    <div className="space-y-6">
      <RolePersonaBar />

      {/* Role Access Notice */}
      {user?.role !== "seller" && (
        <div className="bg-blue-50 border-l-4 border-[#2874f0] p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-[#2874f0] shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-900">
                Seller Hub Access: Seller Verification Notice
              </p>
              <p className="text-xs text-blue-700">
                You are currently viewing as <strong>{user?.name || "Customer"}</strong> ({user?.role || "customer"}). Switch to a Verified Seller persona to manage your store catalog and fulfill orders.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchPersona("seller", "seller-retailnet")}
            className="bg-[#2874f0] hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-sm shrink-0 transition-colors shadow-sm"
          >
            Switch to Verified Seller Persona
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                seller?.status === "VERIFIED"
                  ? "bg-emerald-100 text-[#388e3c]"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {seller?.status || "VERIFIED SELLER"}
            </span>
            <span className="text-gray-400 text-xs font-mono">• Seller ID: {currentSellerId}</span>
          </div>

          <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
            {seller?.name || "Seller Hub Command Center"}
          </h1>
          <p className="text-xs text-gray-500">
            {seller?.city}, {seller?.state} • Category: <strong className="capitalize">{seller?.category || "Multi-Category"}</strong> • Commission: <strong>{((seller?.commissionRate || 0.08) * 100).toFixed(0)}%</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={loadSellerData}
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-3 rounded-sm flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setActiveTab("add-product")}
            className="bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs py-2 px-4 rounded-sm uppercase tracking-wide flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>List Product</span>
          </button>
        </div>
      </div>

      {/* Verification Notice if Pending */}
      {seller?.status === "PENDING_VERIFICATION" && (
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-xs text-amber-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong className="font-bold">Seller Verification Pending:</strong> Your GSTIN and bank details are currently being verified by BharatKart Administrators. You can list products and explore your dashboard.
            </div>
          </div>
          <button
            onClick={() => window.open("/admin", "_blank")}
            className="border border-amber-400 hover:bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1.5 rounded-sm whitespace-nowrap"
          >
            Approve in Admin Panel &rarr;
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none border-b border-gray-200 pb-2 text-xs font-bold">
        {[
          { id: "overview", label: "Overview & Analytics", icon: TrendingUp },
          { id: "products", label: `Catalog & Inventory (${products.length})`, icon: Package },
          { id: "add-product", label: "+ Add Product Listing", icon: Plus },
          { id: "orders", label: `Orders & Fulfillment (${pendingOrdersCount} pending)`, icon: Truck },
          { id: "payouts", label: `Financials & Payouts (${formatINR(financials.availableBalance)})`, icon: DollarSign },
          { id: "returns", label: `Returns & Disputes (${refunds.length})`, icon: RotateCcw },
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

      {/* ================= TAB 1: OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Gross Sales (GMV)
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {formatINR(financials.grossSales)}
              </p>
              <span className="text-[11px] text-green-600 font-semibold block mt-1">
                {financials.totalItemsSold} items fulfilled
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Platform Commission Paid
              </span>
              <p className="text-2xl font-black text-red-600 mt-1">
                - {formatINR(financials.totalCommission)}
              </p>
              <span className="text-[11px] text-gray-400 block mt-1">
                Avg. {((seller?.commissionRate || 0.08) * 100).toFixed(0)}% take rate
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Net Seller Earnings
              </span>
              <p className="text-2xl font-black text-[#2874f0] mt-1">
                {formatINR(financials.netEarnings)}
              </p>
              <span className="text-[11px] text-gray-500 block mt-1">
                Settled to verified bank account
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Available Payout Balance
              </span>
              <p className="text-2xl font-black text-emerald-600 mt-1">
                {formatINR(financials.availableBalance)}
              </p>
              <button
                onClick={() => {
                  setPayoutAmount(financials.availableBalance);
                  setShowPayoutModal(true);
                }}
                disabled={financials.availableBalance <= 0}
                className="mt-2 w-full bg-[#fb641b] hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs py-1.5 rounded-sm uppercase tracking-wider"
              >
                Request Payout
              </button>
            </div>
          </div>

          {/* Quick Action Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pending Orders Widget */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Pending Dispatches ({pendingOrdersCount})</span>
                </h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  View All &rarr;
                </button>
              </div>

              {sellerOrders.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">No orders currently pending.</p>
              ) : (
                <div className="space-y-2 text-xs">
                  {sellerOrders.slice(0, 3).map(({ order, items }) => (
                    <div key={order.id} className="p-2.5 bg-gray-50 rounded border border-gray-100 flex justify-between items-center">
                      <div>
                        <strong className="font-mono text-gray-900">{order.id}</strong>
                        <p className="text-[11px] text-gray-500">{order.shippingAddress.city} • {items.length} line item(s)</p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {order.currentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low Stock Watchlist */}
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>Low Inventory Alert</span>
                </h3>
                <button
                  onClick={() => setActiveTab("products")}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Manage Inventory &rarr;
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {products.filter((p) => p.stockCount <= 20).slice(0, 3).map((prod) => (
                  <div key={prod.id} className="p-2 bg-amber-50/50 border border-amber-200 rounded flex justify-between items-center">
                    <div className="line-clamp-1 pr-2">
                      <span className="font-bold text-gray-900">{prod.title}</span>
                    </div>
                    <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[10px] shrink-0">
                      {prod.stockCount} left in stock
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCTS & INVENTORY ================= */}
      {activeTab === "products" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-gray-900">
                Seller Product Catalog & Live Stock Control
              </h2>
              <p className="text-xs text-gray-500">
                Update prices, restock quantities, or inspect moderation approval statuses
              </p>
            </div>

            <button
              onClick={() => setActiveTab("add-product")}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs py-2 px-4 rounded-sm uppercase tracking-wide flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Listing</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Selling Price</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">Approval Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => {
                  const isEditing = editingStockId === prod.id;
                  const status = prod.approvalStatus || "APPROVED";

                  return (
                    <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.thumbnail}
                            alt={prod.title}
                            className="w-10 h-10 object-contain border rounded shrink-0 bg-white"
                          />
                          <div>
                            <span className="font-bold text-gray-900 line-clamp-1">{prod.title}</span>
                            <span className="text-[11px] text-gray-400">Brand: {prod.brand}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 capitalize text-gray-600">{prod.category}</td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingPriceVal}
                            onChange={(e) => setEditingPriceVal(Number(e.target.value))}
                            className="w-24 p-1 border border-blue-500 rounded text-xs font-bold"
                          />
                        ) : (
                          <span className="font-extrabold text-gray-900">{formatINR(prod.price)}</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editingStockVal}
                            onChange={(e) => setEditingStockVal(Number(e.target.value))}
                            className="w-20 p-1 border border-blue-500 rounded text-xs font-bold"
                          />
                        ) : (
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              prod.stockCount <= 5
                                ? "bg-red-100 text-red-800"
                                : prod.stockCount <= 20
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-[#388e3c]"
                            }`}
                          >
                            {prod.stockCount} units
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`font-black text-[10px] uppercase px-2 py-0.5 rounded ${
                            status === "APPROVED"
                              ? "bg-emerald-100 text-[#388e3c]"
                              : status === "PENDING_APPROVAL"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {status}
                        </span>
                        {prod.rejectionReason && (
                          <p className="text-[10px] text-red-600 mt-0.5">{prod.rejectionReason}</p>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        {isEditing ? (
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleSaveStockUpdate(prod.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded flex items-center gap-1"
                            >
                              <Save className="w-3 h-3" /> Save
                            </button>
                            <button
                              onClick={() => setEditingStockId(null)}
                              className="border border-gray-300 hover:bg-gray-100 text-gray-600 text-[11px] px-2 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingStockId(prod.id);
                              setEditingStockVal(prod.stockCount);
                              setEditingPriceVal(prod.price);
                            }}
                            className="text-blue-600 hover:underline font-bold text-xs inline-flex items-center gap-1"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Quick Edit</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ADD PRODUCT FORM ================= */}
      {activeTab === "add-product" && (
        <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              SELLER PRODUCT SUBMISSION
            </span>
            <h2 className="text-lg font-black text-gray-900 mt-1">
              Submit New Product For Marketplace Approval
            </h2>
            <p className="text-xs text-gray-500">
              New listings are reviewed by administrators within 2 hours before going live to customers
            </p>
          </div>

          {productSubmitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Product Submitted Successfully!</strong> Your listing is now in{" "}
                <span className="font-extrabold uppercase">Pending Approval</span> status. Switch to the Admin Persona to review and publish it.
              </div>
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sony WH-CH720N Wireless Noise Canceling Headphones"
                value={newProd.title}
                onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Brand *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sony"
                  value={newProd.brand}
                  onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  value={newProd.category}
                  onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                >
                  <option value="electronics">Electronics</option>
                  <option value="mobiles">Mobiles</option>
                  <option value="fashion">Fashion</option>
                  <option value="home-furniture">Home & Furniture</option>
                  <option value="appliances">Appliances</option>
                  <option value="grocery">Grocery</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  placeholder="e.g. audio"
                  value={newProd.subCategory}
                  onChange={(e) => setNewProd({ ...newProd, subCategory: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="9999"
                  value={newProd.price}
                  onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Original Price / MRP (₹) *
                </label>
                <input
                  type="number"
                  required
                  placeholder="14999"
                  value={newProd.originalPrice}
                  onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Initial Stock Count *
                </label>
                <input
                  type="number"
                  required
                  placeholder="25"
                  value={newProd.stockCount}
                  onChange={(e) => setNewProd({ ...newProd, stockCount: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Image URL (Thumbnail) *
              </label>
              <input
                type="url"
                required
                value={newProd.thumbnail}
                onChange={(e) => setNewProd({ ...newProd, thumbnail: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Product description and features..."
                value={newProd.description}
                onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Highlights (One per line)
                </label>
                <textarea
                  rows={3}
                  value={newProd.highlights}
                  onChange={(e) => setNewProd({ ...newProd, highlights: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Specifications (Format: Category: Key: Value)
                </label>
                <textarea
                  rows={3}
                  value={newProd.specifications}
                  onChange={(e) => setNewProd({ ...newProd, specifications: e.target.value })}
                  className="w-full p-2.5 border border-gray-300 rounded focus:outline-none focus:border-blue-600 font-mono text-[11px]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs py-3 rounded-sm uppercase tracking-wide shadow transition-colors"
            >
              Submit Listing For Approval
            </button>
          </form>
        </div>
      )}

      {/* ================= TAB 4: ORDERS & MULTI-VENDOR DISPATCH ================= */}
      {activeTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">
              Multi-Vendor Split Orders & Shipment Fulfillment
            </h2>
            <p className="text-xs text-gray-500">
              Only items sold by your store are displayed here. Update fulfillment milestones to trigger customer notifications.
            </p>
          </div>

          {sellerOrders.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">No orders placed for this seller yet.</p>
          ) : (
            <div className="space-y-4">
              {sellerOrders.map(({ order, items }) => (
                <div key={order.id} className="border border-gray-200 rounded-sm p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Order ID: </span>
                      <strong className="font-mono text-gray-900 font-bold">{order.id}</strong>
                      <span className="text-gray-400 ml-2">Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-medium">Customer: <strong>{order.customerName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.pincode})</span>
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">
                        Master Status: {order.currentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Line Items for this seller */}
                  <div className="divide-y divide-gray-100 text-xs">
                    {items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-12 h-12 object-contain border rounded p-1 shrink-0 bg-white"
                          />
                          <div>
                            <span className="font-bold text-gray-900 block">{item.title}</span>
                            <span className="text-gray-500 text-[11px]">
                              Qty: <strong>{item.quantity}</strong> • Price: <strong>{formatINR(item.price)}</strong> • Earnings: <strong className="text-emerald-700">{formatINR(item.sellerEarnings || item.price * 0.9)}</strong> (after commission)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                              item.status === "DELIVERED"
                                ? "bg-emerald-100 text-[#388e3c]"
                                : item.status === "SHIPPED"
                                ? "bg-blue-100 text-blue-800"
                                : item.status === "PACKED"
                                ? "bg-purple-100 text-purple-800"
                                : item.status === "RETURN_REQUESTED"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.status || "ORDER_PLACED"}
                          </span>

                          {/* Action Buttons */}
                          {(!item.status || item.status === "ORDER_PLACED") && (
                            <button
                              onClick={() => handleUpdateItemStatus(order.id, item.productId, "PACKED")}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] px-2.5 py-1 rounded"
                            >
                              Mark Packed
                            </button>
                          )}

                          {item.status === "PACKED" && (
                            <button
                              onClick={() => setDispatchItem({ orderId: order.id, productId: item.productId, title: item.title })}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-2.5 py-1 rounded flex items-center gap-1"
                            >
                              <Truck className="w-3 h-3" /> Dispatch & Ship
                            </button>
                          )}

                          {item.status === "SHIPPED" && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-500 font-mono">
                                {item.courierPartner}: {item.trackingNumber}
                              </span>
                              <button
                                onClick={() => handleUpdateItemStatus(order.id, item.productId, "DELIVERED")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1 rounded"
                              >
                                Mark Delivered
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 5: FINANCIALS & PAYOUTS ================= */}
      {activeTab === "payouts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Available For Payout
              </span>
              <p className="text-3xl font-black text-emerald-600 mt-1">
                {formatINR(financials.availableBalance)}
              </p>
              <button
                onClick={() => {
                  setPayoutAmount(financials.availableBalance);
                  setShowPayoutModal(true);
                }}
                disabled={financials.availableBalance <= 0}
                className="mt-3 w-full bg-[#fb641b] hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs py-2 rounded-sm uppercase tracking-wider shadow"
              >
                Request Bank Settlement
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Settled & Paid Out
              </span>
              <p className="text-3xl font-black text-gray-900 mt-1">
                {formatINR(financials.paidOut)}
              </p>
              <span className="text-xs text-gray-500 block mt-2">
                Processed directly to beneficiary {seller?.bankDetails?.bankName} (***{seller?.bankDetails?.accountNumber.slice(-4)})
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Pending Payout Requests
              </span>
              <p className="text-3xl font-black text-amber-600 mt-1">
                {formatINR(financials.pendingPayouts)}
              </p>
              <span className="text-xs text-amber-800 block mt-2">
                Awaiting bank clearing confirmation by BharatKart Admin
              </span>
            </div>
          </div>

          {/* Payout History Table */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Settlement & Payout History</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-y border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3">Payout ID</th>
                    <th className="py-2.5 px-3">Settlement Cycle</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Bank UTR / Ref</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Requested Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payouts.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-gray-900">{p.id}</td>
                      <td className="py-2.5 px-3">{p.period}</td>
                      <td className="py-2.5 px-3 font-extrabold text-gray-900">{formatINR(p.amount)}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">
                        {p.utr || "Pending Admin Transfer"}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-black text-[10px] uppercase px-2 py-0.5 rounded ${
                            p.status === "PAID"
                              ? "bg-emerald-100 text-[#388e3c]"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: RETURNS & DISPUTES ================= */}
      {activeTab === "returns" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">Customer Return Requests & Refunds</h2>
            <p className="text-xs text-gray-500">
              Review customer return requests, inspect reasons, and approve or reject claims
            </p>
          </div>

          {refunds.length === 0 ? (
            <p className="text-xs text-gray-400 py-8 text-center">No active return requests found.</p>
          ) : (
            <div className="space-y-3">
              {refunds.map((ref) => (
                <div key={ref.id} className="border border-gray-200 rounded p-4 text-xs space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <div>
                      <strong className="font-mono text-gray-900">{ref.id}</strong> • Order{" "}
                      <strong className="font-mono">{ref.orderId}</strong>
                    </div>
                    <span
                      className={`font-black text-[10px] uppercase px-2 py-0.5 rounded ${
                        ref.status === "PROCESSED"
                          ? "bg-emerald-100 text-[#388e3c]"
                          : ref.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ref.status}
                    </span>
                  </div>

                  <p className="text-gray-700">
                    <strong>Customer:</strong> {ref.customerName} ({ref.customerEmail})
                  </p>
                  <p className="text-gray-700">
                    <strong>Refund Amount:</strong> {formatINR(ref.amount)}
                  </p>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                    <strong>Reason for return:</strong> {ref.reason}
                  </p>

                  {ref.status === "REQUESTED" && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleRefundAction(ref.id, "PROCESSED")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-sm"
                      >
                        Accept Return & Authorize Refund
                      </button>
                      <button
                        onClick={() => handleRefundAction(ref.id, "REJECTED")}
                        className="border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs py-1.5 px-3 rounded-sm"
                      >
                        Reject Return Request
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DISPATCH SHIPMENT MODAL */}
      {dispatchItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 max-w-md w-full space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-gray-900">
              Dispatch Shipment — {dispatchItem.orderId}
            </h3>
            <p className="text-xs text-gray-600">{dispatchItem.title}</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Courier Partner
                </label>
                <select
                  value={courierPartner}
                  onChange={(e) => setCourierPartner(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600"
                >
                  <option value="BlueDart Express">BlueDart Express</option>
                  <option value="Delhivery Surface">Delhivery Surface</option>
                  <option value="Ekart Logistics">Ekart Logistics</option>
                  <option value="DTDC Express">DTDC Express</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Courier Tracking / AWB Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BD8291048192IN"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDispatchItem(null)}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!trackingNumber.trim()}
                onClick={() =>
                  handleUpdateItemStatus(
                    dispatchItem.orderId,
                    dispatchItem.productId,
                    "SHIPPED",
                    courierPartner,
                    trackingNumber.trim()
                  )
                }
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded text-xs font-bold"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleRequestPayout}
            className="bg-white rounded-sm p-6 max-w-sm w-full space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-sm text-gray-900">Request Bank Settlement Payout</h3>
            <p className="text-xs text-gray-500">
              Funds will be transferred to {seller?.bankDetails?.bankName} ({seller?.bankDetails?.accountHolder}).
            </p>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Settlement Amount (Max: {formatINR(financials.availableBalance)})
              </label>
              <input
                type="number"
                required
                min={100}
                max={financials.availableBalance}
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded font-bold text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
                className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#fb641b] hover:bg-orange-600 text-white rounded text-xs font-bold"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
