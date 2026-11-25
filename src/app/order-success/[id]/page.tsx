import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Sparkles } from "lucide-react";

interface OrderSuccessPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const order = db.getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-6">
      {/* Top Confirmed Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-8 text-center shadow-sm">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Thank you for shopping with BharatKart. Your order has been placed and is being packed.
        </p>

        <div className="inline-block bg-blue-50 border border-blue-200 rounded-sm px-4 py-2 mt-4 text-xs">
          <span className="text-gray-500">Order ID: </span>
          <strong className="text-[#2874f0] font-mono font-bold text-sm">{order.id}</strong>
        </div>

        {/* Expected Delivery Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-sm p-4 mt-6 flex items-center justify-center gap-3 text-xs text-emerald-900 font-medium">
          <Truck className="w-5 h-5 text-[#388e3c] shrink-0" />
          <span>
            Expected Delivery: <strong className="font-bold text-[#388e3c]">{order.expectedDeliveryDate}</strong>
          </span>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm space-y-6 text-xs text-gray-800">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
            Order Items ({order.items.length})
          </h3>
          <span className="font-bold text-base text-gray-900">
            Total Paid: {formatINR(order.totalAmount)}
          </span>
        </div>

        {/* Items List */}
        <div className="space-y-4 divide-y divide-gray-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-contain border p-1 rounded"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                  <p className="text-gray-500">Seller: {item.sellerName}</p>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-extrabold text-sm text-gray-900">
                  {formatINR(item.price * item.quantity)}
                </p>
                <span className="text-green-700 font-bold text-[11px]">Free Shipping</span>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-bold uppercase tracking-wider text-gray-500 text-[11px] mb-1">
            Shipping Address
          </h4>
          <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
          <p className="text-gray-600">
            {order.shippingAddress.addressLine}, {order.shippingAddress.locality},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
            <strong>{order.shippingAddress.pincode}</strong>
          </p>
          <p className="text-gray-500 mt-0.5">Phone: {order.shippingAddress.phone}</p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/orders/${order.id}`}
            className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-6 rounded-sm uppercase tracking-wide flex items-center gap-2 shadow-sm"
          >
            <Package className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>

          <Link
            href="/"
            className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs py-2.5 px-6 rounded-sm uppercase tracking-wide flex items-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
