import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatINR } from "@/lib/utils";
import { OrderActionButtons } from "@/components/orders/OrderActionButtons";
import {
  CheckCircle2,
  Circle,
  Truck,
  Package,
  MapPin,
  ChevronLeft,
} from "lucide-react";

interface OrderDetailPageProps {
  params: { id: string };
}

export const dynamic = "force-dynamic";

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const order = db.getOrderById(params.id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Back button */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to My Orders</span>
      </Link>

      {/* Top Banner with Tracking Progress */}
      <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2 mb-6">
          <div>
            <span className="text-xs text-gray-500">Order ID: </span>
            <strong className="text-sm font-mono text-gray-900 font-bold">{order.id}</strong>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded">
              Status: {order.currentStatus}
            </span>
          </div>
        </div>

        {/* Visual Tracking Progress Timeline */}
        <div className="py-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-6">
            Delivery Timeline
          </h3>

          <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
            {/* Step Milestones */}
            {order.trackingSteps.map((step, idx) => {
              const isLast = idx === order.trackingSteps.length - 1;
              return (
                <div key={idx} className="flex-1 flex md:flex-col items-start md:items-center relative text-left md:text-center group">
                  {/* Connector Line for Desktop */}
                  {!isLast && (
                    <div
                      className={`hidden md:block absolute top-3.5 left-1/2 w-full h-1 -z-0 ${
                        step.completed ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 mr-3 md:mr-0 md:mb-2 ${
                      step.completed
                        ? "bg-emerald-500 text-white shadow-md ring-4 ring-emerald-50"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="text-xs">
                    <p className={`font-bold ${step.completed ? "text-gray-900" : "text-gray-400"}`}>
                      {step.status}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{step.date}</p>
                    <p className="text-[10px] text-gray-400 max-w-[140px] hidden md:block mx-auto mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Order Items & Delivery Address */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Items list */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-sm p-4 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            Items in This Order ({order.items.length})
          </h3>

          <div className="space-y-4 divide-y divide-gray-100 text-xs">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-16 h-16 object-contain border p-1 rounded"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.title}</h4>
                    <p className="text-gray-500">Seller: {item.sellerName}</p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-extrabold text-sm text-gray-900">
                    {formatINR(item.price * item.quantity)}
                  </p>
                  <span className="text-green-700 font-bold text-[11px]">Free Delivery</span>
                </div>
              </div>
            ))}
          </div>

          <OrderActionButtons orderId={order.id} />
        </div>

        {/* Right: Address & Payment Summary */}
        <div className="lg:col-span-4 space-y-4">
          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm text-xs space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-gray-500 text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> Delivery Address
            </h4>
            <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600 leading-relaxed">
              {order.shippingAddress.addressLine}, {order.shippingAddress.locality},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
              <strong>{order.shippingAddress.pincode}</strong>
            </p>
            <p className="text-gray-500">Phone: {order.shippingAddress.phone}</p>
          </div>

          {/* Payment Summary */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm text-xs space-y-2.5">
            <h4 className="font-bold uppercase tracking-wider text-gray-500 text-[11px]">
              Payment Summary
            </h4>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Mode</span>
              <span className="font-bold text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.couponDiscount ? (
              <div className="flex justify-between text-green-700">
                <span>Coupon ({order.couponCode})</span>
                <span>- {formatINR(order.couponDiscount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="text-green-700 font-bold">FREE</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-sm text-gray-900">
              <span>Total Paid</span>
              <span>{formatINR(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
