"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { Package, Search, ChevronRight, Truck, CheckCircle2 } from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (e) {
        console.error("Failed to load orders", e);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.currentStatus.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchId = o.id.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.title.toLowerCase().includes(q));
      return matchId || matchItem;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Orders</h1>
          <p className="text-xs text-gray-500">Track, view invoice, or request return for your orders</p>
        </div>

        {/* Search within orders */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search your orders here"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
        {[
          { id: "all", label: "All Orders" },
          { id: "ordered", label: "Processing" },
          { id: "out for delivery", label: "On The Way" },
          { id: "delivered", label: "Delivered" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
              statusFilter === tab.id
                ? "bg-[#2874f0] text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-sm p-12 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No orders found</h3>
          <p className="text-xs text-gray-500 mt-1">You haven't placed any orders matching this criteria.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const firstItem = order.items[0];
            const isDelivered = order.currentStatus === "Delivered";

            return (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-gray-100 text-xs">
                  <div>
                    <span className="text-gray-400">Order ID: </span>
                    <strong className="text-gray-900 font-mono font-bold">{order.id}</strong>
                    <span className="text-gray-400 ml-3">• Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Total:</span>
                    <strong className="text-sm font-black text-gray-900">{formatINR(order.totalAmount)}</strong>
                  </div>
                </div>

                <div className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  {/* Items summary */}
                  <div className="flex items-center gap-4">
                    <img
                      src={firstItem.thumbnail}
                      alt={firstItem.title}
                      className="w-16 h-16 object-contain border p-1 rounded shrink-0"
                    />
                    <div className="text-xs space-y-1">
                      <Link
                        href={`/orders/${order.id}`}
                        className="font-bold text-sm text-gray-900 hover:text-blue-600 line-clamp-1"
                      >
                        {firstItem.title}
                      </Link>
                      {order.items.length > 1 && (
                        <p className="text-gray-400 font-medium">
                          + {order.items.length - 1} other item{order.items.length > 2 ? "s" : ""}
                        </p>
                      )}
                      <p className="text-gray-500">Seller: {firstItem.sellerName}</p>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        isDelivered ? "bg-green-600" : "bg-blue-600 animate-ping"
                      }`}
                    />
                    <div>
                      <p className="font-bold text-gray-900">{order.currentStatus}</p>
                      <p className="text-gray-500 text-[11px]">{order.expectedDeliveryDate}</p>
                    </div>
                  </div>

                  {/* Track CTA */}
                  <Link
                    href={`/orders/${order.id}`}
                    className="self-end md:self-center border border-[#2874f0] text-[#2874f0] hover:bg-blue-50 font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1 transition-colors"
                  >
                    <span>View & Track</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
