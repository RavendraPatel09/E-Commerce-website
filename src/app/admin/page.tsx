"use client";

import React, { useState, useEffect } from "react";
import {
  Product,
  PromotionalBanner,
  HomepageSection,
  Order,
  Seller,
  Payout,
  Refund,
} from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { RolePersonaBar } from "@/components/common/RolePersonaBar";
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
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Store,
  DollarSign,
  RotateCcw,
  Clock,
  Landmark,
  ShieldCheck,
  Truck,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, switchPersona } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "sellers"
    | "products"
    | "orders"
    | "payouts"
    | "refunds"
    | "banners"
    | "sections"
  >("overview");

  const [metrics, setMetrics] = useState<any>({});
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Seller Filter & Rejection Modal
  const [sellerStatusFilter, setSellerStatusFilter] = useState("all");
  const [rejectSellerModal, setRejectSellerModal] = useState<string | null>(null);
  const [sellerRejectReason, setSellerRejectReason] = useState("");

  // Product Filter & Rejection Modal
  const [productStatusFilter, setProductStatusFilter] = useState("all");
  const [rejectProductModal, setRejectProductModal] = useState<string | null>(null);
  const [productRejectReason, setProductRejectReason] = useState("");

  // Process Payout Modal
  const [processPayoutItem, setProcessPayoutItem] = useState<Payout | null>(null);
  const [payoutUtr, setPayoutUtr] = useState("");

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
      const [
        metricsRes,
        sellersRes,
        prodRes,
        orderRes,
        payoutRes,
        refundRes,
        bannerRes,
        sectionRes,
      ] = await Promise.all([
        fetch("/api/admin/metrics"),
        fetch("/api/sellers"),
        fetch("/api/products?admin=true&limit=100"),
        fetch("/api/orders"),
        fetch("/api/payouts"),
        fetch("/api/refunds"),
        fetch("/api/banners?admin=true"),
        fetch("/api/sections?admin=true"),
      ]);

      const metricsData = await metricsRes.json();
      const sellersData = await sellersRes.json();
      const prodData = await prodRes.json();
      const orderData = await orderRes.json();
      const payoutData = await payoutRes.json();
      const refundData = await refundRes.json();
      const bannerData = await bannerRes.json();
      const sectionData = await sectionRes.json();

      if (metricsData.success) setMetrics(metricsData.metrics);
      if (sellersData.success) setSellers(sellersData.sellers);
      if (prodData.success) setProducts(prodData.products);
      if (orderData.success) setOrders(orderData.orders);
      if (payoutData.success) setPayouts(payoutData.payouts);
      if (refundData.success) setRefunds(refundData.refunds);
      if (bannerData.success) setBanners(bannerData.banners);
      if (sectionData.success) setSections(sectionData.sections);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // 1. Seller Verification Actions
  const handleVerifySeller = async (sellerId: string, status: "VERIFIED" | "REJECTED", reason?: string) => {
    try {
      const res = await fetch(`/api/sellers/${sellerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: status === "VERIFIED" ? "verify" : "reject", rejectionReason: reason }),
      });
      const data = await res.json();
      if (data.success) {
        setRejectSellerModal(null);
        setSellerRejectReason("");
        loadAdminData();
      } else {
        alert(data.error || "Failed to update seller status");
      }
    } catch (e) {
      alert("Error updating seller verification");
    }
  };

  // 2. Product Moderation Actions
  const handleApproveProduct = async (productId: string, action: "approve" | "reject", reason?: string) => {
    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, action, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setRejectProductModal(null);
        setProductRejectReason("");
        loadAdminData();
      } else {
        alert(data.error || "Failed to update product approval");
      }
    } catch (e) {
      alert("Error updating product approval");
    }
  };

  // 3. Process Payout Action
  const handleConfirmPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!processPayoutItem || !payoutUtr.trim()) return;

    try {
      const res = await fetch("/api/payouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: processPayoutItem.id, utr: payoutUtr.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setProcessPayoutItem(null);
        setPayoutUtr("");
        loadAdminData();
      } else {
        alert(data.error || "Failed to process payout");
      }
    } catch (e) {
      alert("Error updating payout");
    }
  };

  // 4. Refund Moderation Action
  const handleRefundAction = async (refundId: string, status: "PROCESSED" | "REJECTED") => {
    try {
      const res = await fetch("/api/refunds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: refundId, status }),
      });
      const data = await res.json();
      if (data.success) {
        loadAdminData();
      } else {
        alert(data.error || "Failed to update refund");
      }
    } catch (e) {
      alert("Error processing refund");
    }
  };

  // 5. Update Master Order Status
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

  // 6. Banners CRUD
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

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotional banner?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (res.ok) loadAdminData();
    } catch (e) {
      alert("Failed to delete banner");
    }
  };

  const handleToggleBanner = async (banner: PromotionalBanner) => {
    try {
      const res = await fetch(`/api/banners/${banner.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !banner.active }),
      });
      if (res.ok) loadAdminData();
    } catch (e) {
      alert("Failed to toggle banner status");
    }
  };

  // 7. Sections CRUD
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

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Are you sure you want to delete this homepage section?")) return;
    try {
      const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });
      if (res.ok) loadAdminData();
    } catch (e) {
      alert("Failed to delete section");
    }
  };

  const handleToggleSection = async (section: HomepageSection) => {
    try {
      const res = await fetch(`/api/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !section.active }),
      });
      if (res.ok) loadAdminData();
    } catch (e) {
      alert("Failed to toggle section status");
    }
  };

  // Filtered Lists
  const filteredSellers = sellers.filter((s) => {
    if (sellerStatusFilter === "all") return true;
    return s.status === sellerStatusFilter;
  });

  const filteredProducts = products.filter((p) => {
    const status = p.approvalStatus || "APPROVED";
    if (productStatusFilter === "all") return true;
    return status === productStatusFilter;
  });

  const pendingSellersCount = sellers.filter((s) => s.status === "PENDING_VERIFICATION").length;
  const pendingProductsCount = products.filter((p) => p.approvalStatus === "PENDING_APPROVAL").length;
  const pendingPayoutsCount = payouts.filter((p) => p.status === "PENDING").length;
  const pendingRefundsCount = refunds.filter((r) => r.status === "REQUESTED").length;

  return (
    <div className="space-y-6">
      <RolePersonaBar />

      {/* Role Access Notice */}
      {user?.role !== "admin" && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                Restricted Access: Administrator Privileges Required
              </p>
              <p className="text-xs text-amber-700">
                You are currently viewing as <strong>{user?.name || "Customer"}</strong> ({user?.role || "customer"}). Switch to Administrator to perform master governance actions.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchPersona("admin")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-sm shrink-0 transition-colors shadow-sm"
          >
            Switch to Administrator Persona
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 md:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
              BHARATKART MASTER ADMIN
            </span>
            <span className="bg-emerald-100 text-[#388e3c] text-[10px] font-bold px-2 py-0.5 rounded">
              Multi-Vendor Marketplace Control
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 mt-1">
            Platform Operations & Multi-Vendor Governance
          </h1>
          <p className="text-xs text-gray-500">
            Verify sellers, approve product submissions, govern commissions, manage split orders & process payouts
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh All</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2 text-xs font-bold">
        {[
          { id: "overview", label: "Overview Metrics", icon: TrendingUp },
          {
            id: "sellers",
            label: `Seller Verification (${pendingSellersCount} pending)`,
            icon: Store,
            badge: pendingSellersCount > 0 ? pendingSellersCount : undefined,
          },
          {
            id: "products",
            label: `Product Approvals (${pendingProductsCount} pending)`,
            icon: Package,
            badge: pendingProductsCount > 0 ? pendingProductsCount : undefined,
          },
          { id: "orders", label: `All Orders (${orders.length})`, icon: ShoppingBag },
          {
            id: "payouts",
            label: `Payouts & Commissions (${pendingPayoutsCount} pending)`,
            icon: DollarSign,
            badge: pendingPayoutsCount > 0 ? pendingPayoutsCount : undefined,
          },
          {
            id: "refunds",
            label: `Refunds & Disputes (${pendingRefundsCount} pending)`,
            icon: RotateCcw,
            badge: pendingRefundsCount > 0 ? pendingRefundsCount : undefined,
          },
          { id: "banners", label: `Homepage Banners (${banners.length})`, icon: ImageIcon },
          { id: "sections", label: `Homepage Sections (${sections.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-sm whitespace-nowrap transition-colors relative ${
                isActive
                  ? "bg-[#2874f0] text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW METRICS ================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Total Platform GMV
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">
                {formatINR(metrics.totalRevenue || 0)}
              </p>
              <span className="text-[11px] text-green-600 font-semibold block mt-1">
                From {orders.length} platform orders
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Platform Commission Earned
              </span>
              <p className="text-2xl font-black text-[#2874f0] mt-1">
                {formatINR(metrics.marketplaceCommission || 0)}
              </p>
              <span className="text-[11px] text-gray-500 font-medium block mt-1">
                Real category take rates (5% - 15%)
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Registered Sellers
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">{sellers.length}</p>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                {sellers.filter((s) => s.status === "VERIFIED").length} Verified & Active
              </span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Catalog Inventory
              </span>
              <p className="text-2xl font-black text-gray-900 mt-1">{products.length}</p>
              <span className="text-[11px] text-blue-600 font-bold block mt-1">
                {products.filter((p) => p.approvalStatus === "APPROVED").length} Live on Storefront
              </span>
            </div>
          </div>

          {/* Pending Action Center */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-sm p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-blue-300">
              Action Required — Marketplace Queue
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div
                onClick={() => {
                  setSellerStatusFilter("PENDING_VERIFICATION");
                  setActiveTab("sellers");
                }}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-sm cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Seller Verifications</span>
                  <Store className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-amber-400 mt-2">{pendingSellersCount}</p>
                <span className="text-[11px] text-blue-300 hover:underline inline-flex items-center gap-1 mt-1">
                  Inspect Applications &rarr;
                </span>
              </div>

              <div
                onClick={() => {
                  setProductStatusFilter("PENDING_APPROVAL");
                  setActiveTab("products");
                }}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-sm cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Product Approvals</span>
                  <Package className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-2xl font-black text-purple-400 mt-2">{pendingProductsCount}</p>
                <span className="text-[11px] text-blue-300 hover:underline inline-flex items-center gap-1 mt-1">
                  Review Listings &rarr;
                </span>
              </div>

              <div
                onClick={() => setActiveTab("payouts")}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-sm cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Payout Requests</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-black text-emerald-400 mt-2">{pendingPayoutsCount}</p>
                <span className="text-[11px] text-blue-300 hover:underline inline-flex items-center gap-1 mt-1">
                  Process Transfers &rarr;
                </span>
              </div>

              <div
                onClick={() => setActiveTab("refunds")}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 p-4 rounded-sm cursor-pointer transition-all"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Disputes & Returns</span>
                  <RotateCcw className="w-4 h-4 text-red-400" />
                </div>
                <p className="text-2xl font-black text-red-400 mt-2">{pendingRefundsCount}</p>
                <span className="text-[11px] text-blue-300 hover:underline inline-flex items-center gap-1 mt-1">
                  Manage Claims &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SELLER VERIFICATION HUB ================= */}
      {activeTab === "sellers" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-gray-900">
                Seller Registration & KYC Verification Hub
              </h2>
              <p className="text-xs text-gray-500">
                Verify business tax IDs (GSTIN/PAN) and bank settlement accounts before granting selling rights
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 text-xs">
              {["all", "PENDING_VERIFICATION", "VERIFIED", "REJECTED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSellerStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                    sellerStatusFilter === st
                      ? "bg-[#2874f0] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st === "all" ? "All Sellers" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredSellers.map((seller) => (
              <div
                key={seller.id}
                className="border border-gray-200 rounded-sm p-4 text-xs space-y-3 hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold">
                      <Store className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900">{seller.name}</h3>
                      <p className="text-gray-500 text-[11px]">
                        ID: <strong className="font-mono">{seller.id}</strong> • Applied: {new Date(seller.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`font-black text-[10px] uppercase px-2.5 py-1 rounded ${
                        seller.status === "VERIFIED"
                          ? "bg-emerald-100 text-[#388e3c]"
                          : seller.status === "PENDING_VERIFICATION"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {seller.status}
                    </span>

                    {seller.status === "PENDING_VERIFICATION" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleVerifySeller(seller.id, "VERIFIED")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-sm flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve Seller
                        </button>
                        <button
                          onClick={() => setRejectSellerModal(seller.id)}
                          className="border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs px-3 py-1.5 rounded-sm flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-gray-600">
                  <div className="space-y-1 bg-gray-50 p-2.5 rounded border border-gray-100">
                    <strong className="text-gray-900 block font-bold">Business & Tax Details</strong>
                    <p>Email: {seller.email}</p>
                    <p>Phone: {seller.phone}</p>
                    <p>Category: <strong className="capitalize">{seller.category}</strong> (Commission: {((seller.commissionRate || 0.1) * 100).toFixed(0)}%)</p>
                    <p>GSTIN: <strong className="font-mono text-gray-900">{seller.gstin}</strong></p>
                    <p>PAN: <strong className="font-mono text-gray-900">{seller.pan}</strong></p>
                  </div>

                  <div className="space-y-1 bg-gray-50 p-2.5 rounded border border-gray-100">
                    <strong className="text-gray-900 block font-bold">Bank Settlement Account</strong>
                    <p>Beneficiary: <strong className="text-gray-900">{seller.bankDetails?.accountHolder}</strong></p>
                    <p>Bank: {seller.bankDetails?.bankName}</p>
                    <p>Account Number: <strong className="font-mono text-gray-900">{seller.bankDetails?.accountNumber}</strong></p>
                    <p>IFSC: <strong className="font-mono text-gray-900">{seller.bankDetails?.ifsc}</strong></p>
                  </div>

                  <div className="space-y-1 bg-gray-50 p-2.5 rounded border border-gray-100">
                    <strong className="text-gray-900 block font-bold">Warehouse & Logistics Pickup</strong>
                    <p>{seller.pickupAddress?.addressLine}</p>
                    <p>{seller.pickupAddress?.city}, {seller.pickupAddress?.state} - <strong>{seller.pickupAddress?.pincode}</strong></p>
                    <p className="text-gray-400">Coverage: All India Surface & Air Logistics</p>
                  </div>
                </div>

                {seller.rejectionReason && (
                  <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                    <strong>Rejection Reason:</strong> {seller.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: PRODUCT APPROVAL MODERATION ================= */}
      {activeTab === "products" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-gray-900">
                Seller Product Submissions & Catalog Moderation
              </h2>
              <p className="text-xs text-gray-500">
                Review submitted product listings for accurate pricing, genuine descriptions, and image quality
              </p>
            </div>

            <div className="flex gap-1.5 text-xs">
              {["all", "PENDING_APPROVAL", "APPROVED", "REJECTED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setProductStatusFilter(st)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition-colors ${
                    productStatusFilter === st
                      ? "bg-[#2874f0] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {st === "all" ? "All Listings" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredProducts.map((prod) => {
              const status = prod.approvalStatus || "APPROVED";
              return (
                <div
                  key={prod.id}
                  className="border border-gray-200 rounded-sm p-4 text-xs space-y-3 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.thumbnail}
                        alt={prod.title}
                        className="w-14 h-14 object-contain border rounded p-1 shrink-0 bg-white"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{prod.title}</h4>
                        <p className="text-gray-500">
                          Seller: <strong>{prod.seller?.name || prod.sellerId}</strong> • Category: <strong className="capitalize">{prod.category}</strong> • Brand: <strong>{prod.brand}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-black text-[10px] uppercase px-2.5 py-1 rounded ${
                          status === "APPROVED"
                            ? "bg-emerald-100 text-[#388e3c]"
                            : status === "PENDING_APPROVAL"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {status}
                      </span>

                      {status === "PENDING_APPROVAL" && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleApproveProduct(prod.id, "approve")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-1.5 rounded-sm flex items-center gap-1 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Publish Listing
                          </button>
                          <button
                            onClick={() => setRejectProductModal(prod.id)}
                            className="border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs px-3 py-1.5 rounded-sm flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-3 rounded text-[11px]">
                    <div>
                      <span className="text-gray-400 block font-bold">Selling Price</span>
                      <strong className="text-sm font-extrabold text-gray-900">{formatINR(prod.price)}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Original MRP</span>
                      <span className="text-gray-500 line-through">{formatINR(prod.originalPrice || prod.price)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Initial Stock Units</span>
                      <strong className="text-gray-900">{prod.stockCount} in stock</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-bold">Assured Partner</span>
                      <strong className="text-[#388e3c]">{prod.isAssured ? "Eligible" : "Standard"}</strong>
                    </div>
                  </div>

                  {prod.description && (
                    <p className="text-gray-600 text-[11px] line-clamp-2">{prod.description}</p>
                  )}

                  {prod.rejectionReason && (
                    <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                      <strong>Rejection Reason:</strong> {prod.rejectionReason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: ORDERS & MULTI-VENDOR TRACKING ================= */}
      {activeTab === "orders" && (
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                Multi-Vendor Platform Orders ({orders.length})
              </h3>
              <p className="text-xs text-gray-500">
                Inspect unified customer orders broken down by vendor fulfillment milestones
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b">
                <tr>
                  <th className="p-3 pl-4">Order ID & Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vendor Line Items</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Master Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50">
                    <td className="p-3 pl-4">
                      <strong className="font-mono text-blue-600 block">{o.id}</strong>
                      <span className="text-[10px] text-gray-400">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="p-3">
                      <p className="font-bold text-gray-900">{o.customerName}</p>
                      <p className="text-gray-400 text-[11px]">
                        {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}
                      </p>
                    </td>

                    <td className="p-3">
                      <div className="space-y-1">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-gray-800 line-clamp-1">
                              {item.title} (x{item.quantity})
                            </span>
                            <span className="text-gray-400">• Seller: {item.sellerName}</span>
                            <span className="bg-gray-100 text-gray-700 px-1.5 py-0.2 rounded text-[9px] font-bold">
                              {item.status || "ORDER_PLACED"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

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

      {/* ================= TAB 5: PAYOUTS & COMMISSIONS ================= */}
      {activeTab === "payouts" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">
              Seller Payout Settlement & Commission Administration
            </h2>
            <p className="text-xs text-gray-500">
              Process seller bank transfers, record bank UTR transaction references, and track net marketplace commission revenue
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">Payout ID</th>
                  <th className="py-2.5 px-3">Seller Name & ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Settlement Cycle</th>
                  <th className="py-2.5 px-3">UTR / Bank Ref</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">{p.id}</td>
                    <td className="py-3 px-3">
                      <strong className="text-gray-900 block">{p.sellerName}</strong>
                      <span className="text-[11px] text-gray-400 font-mono">{p.sellerId}</span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-gray-900">{formatINR(p.amount)}</td>
                    <td className="py-3 px-3">{p.period}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-gray-600">
                      {p.utr || "Pending Transfer"}
                    </td>
                    <td className="py-3 px-3">
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
                    <td className="py-3 px-3 text-right">
                      {p.status === "PENDING" && (
                        <button
                          onClick={() => setProcessPayoutItem(p)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-sm"
                        >
                          Process Bank Transfer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 6: REFUNDS & DISPUTES ================= */}
      {activeTab === "refunds" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-bold text-base text-gray-900">
              Customer Refunds & Dispute Governance
            </h2>
            <p className="text-xs text-gray-500">
              Review escalated refund requests, inspect seller items, and authorize instant payment reversals
            </p>
          </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <p>Customer: <strong>{ref.customerName}</strong> ({ref.customerEmail})</p>
                  <p>Seller: <strong className="font-mono">{ref.sellerId}</strong></p>
                  <p>Refund Amount: <strong className="text-gray-900 font-extrabold">{formatINR(ref.amount)}</strong></p>
                </div>

                <p className="text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                  <strong>Return Reason:</strong> {ref.reason}
                </p>

                {ref.status === "REQUESTED" && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleRefundAction(ref.id, "PROCESSED")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3 rounded-sm shadow-sm"
                    >
                      Authorize & Process Instant Refund
                    </button>
                    <button
                      onClick={() => handleRefundAction(ref.id, "REJECTED")}
                      className="border border-red-500 text-red-600 hover:bg-red-50 font-bold text-xs py-1.5 px-3 rounded-sm"
                    >
                      Reject Refund Claim
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 7: HOMEPAGE BANNERS ================= */}
      {activeTab === "banners" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-gray-900">Homepage Promotional Banners</h2>
              <p className="text-xs text-gray-500">Manage carousel banners live on the storefront</p>
            </div>
            <button
              onClick={() => setShowBannerModal(true)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs py-2 px-4 rounded-sm uppercase tracking-wide flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div key={b.id} className="border border-gray-200 rounded overflow-hidden shadow-sm space-y-2">
                <div className="relative h-40 bg-gray-100">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#ffe11b] text-gray-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    {b.badge || "SALE"}
                  </span>
                </div>
                <div className="p-3 text-xs space-y-1">
                  <h4 className="font-black text-sm text-gray-900">{b.title}</h4>
                  <p className="text-gray-600 text-[11px] line-clamp-1">{b.subtitle}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-400 font-mono text-[10px]">Target: {b.ctaLink}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleBanner(b)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          b.active ? "bg-emerald-100 text-[#388e3c]" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {b.active ? "Active" : "Inactive"}
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Modal */}
          {showBannerModal && (
            <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
              <div onClick={() => setShowBannerModal(false)} className="absolute inset-0 bg-black/50" />
              <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl p-6 z-10 space-y-3 text-xs">
                <h3 className="text-sm font-bold text-gray-900">Add Live Promotional Banner</h3>
                <form onSubmit={handleAddBanner} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Banner Title</label>
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
                      placeholder="e.g. Up to 70% Off on Top Brands"
                      value={newBanner.subtitle}
                      onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. LIMITED PERIOD"
                      value={newBanner.badge}
                      onChange={(e) => setNewBanner({ ...newBanner, badge: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Image URL</label>
                    <input
                      type="url"
                      required
                      value={newBanner.imageUrl}
                      onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Target Link</label>
                    <input
                      type="text"
                      value={newBanner.ctaLink}
                      onChange={(e) => setNewBanner({ ...newBanner, ctaLink: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setShowBannerModal(false)} className="px-3 py-1.5 text-gray-500 font-bold hover:underline">
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#2874f0] text-white font-bold px-5 py-2 rounded-sm shadow-sm">
                      Create Banner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 8: HOMEPAGE SECTIONS ================= */}
      {activeTab === "sections" && (
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="font-bold text-base text-gray-900">Homepage Product Sections</h2>
              <p className="text-xs text-gray-500">Configure carousels and product showcases on the homepage</p>
            </div>
            <button
              onClick={() => setShowSectionModal(true)}
              className="bg-[#2874f0] hover:bg-blue-600 text-white font-extrabold text-xs py-2 px-4 rounded-sm uppercase tracking-wide flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec) => (
              <div
                key={sec.id}
                className="p-4 border border-gray-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition-colors text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-gray-900">{sec.title}</h4>
                    {sec.dealTag && (
                      <span className="bg-emerald-50 text-[#388e3c] border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {sec.dealTag}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{sec.subtitle}</p>
                  <p className="text-gray-400 mt-1">
                    {sec.productIds.length} Products configured • Target: {sec.viewAllLink}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleSection(sec)}
                    className={`font-bold text-[10px] px-2 py-0.5 rounded uppercase ${
                      sec.active ? "bg-emerald-100 text-[#388e3c]" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {sec.active ? "Active" : "Inactive"}
                  </button>
                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Section Modal */}
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

      {/* REJECT SELLER MODAL */}
      {rejectSellerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-sm text-gray-900">Reject Seller Application</h3>
            <p className="text-gray-500">Provide reason for rejection (e.g. Invalid GSTIN or Bank Mismatch):</p>
            <textarea
              rows={3}
              required
              value={sellerRejectReason}
              onChange={(e) => setSellerRejectReason(e.target.value)}
              placeholder="e.g. GSTIN tax portal verification failed. Beneficiary name does not match legal entity."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectSellerModal(null)}
                className="px-3 py-1.5 border border-gray-300 rounded font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleVerifySeller(rejectSellerModal, "REJECTED", sellerRejectReason)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT PRODUCT MODAL */}
      {rejectProductModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-sm p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-sm text-gray-900">Reject Product Submission</h3>
            <p className="text-gray-500">Enter moderation feedback for seller:</p>
            <textarea
              rows={3}
              required
              value={productRejectReason}
              onChange={(e) => setProductRejectReason(e.target.value)}
              placeholder="e.g. Image resolution below 800x800 minimum requirement or brand authorization required."
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-red-600"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectProductModal(null)}
                className="px-3 py-1.5 border border-gray-300 rounded font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleApproveProduct(rejectProductModal, "reject", productRejectReason)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS PAYOUT MODAL */}
      {processPayoutItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmPayout}
            className="bg-white rounded-sm p-6 max-w-md w-full space-y-4 shadow-xl text-xs"
          >
            <h3 className="font-bold text-sm text-gray-900">Process Seller Bank Transfer</h3>
            <p className="text-gray-500">
              Transfer <strong>{formatINR(processPayoutItem.amount)}</strong> to{" "}
              <strong>{processPayoutItem.sellerName}</strong>.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                Bank UTR / NEFT Reference Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CMS982104819280"
                value={payoutUtr}
                onChange={(e) => setPayoutUtr(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded font-mono uppercase focus:outline-none focus:border-emerald-600 font-bold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setProcessPayoutItem(null)}
                className="px-3 py-1.5 border border-gray-300 rounded font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold"
              >
                Confirm & Mark Paid
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
