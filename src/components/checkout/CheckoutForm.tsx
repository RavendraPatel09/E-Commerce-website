"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR, getEstimatedDeliveryDate } from "@/lib/utils";
import { PaymentMethods } from "./PaymentMethods";
import { Address } from "@/lib/types";
import confetti from "canvas-confetti";
import {
  Check,
  Plus,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowRight,
  User,
  ShoppingBag,
} from "lucide-react";

export function CheckoutForm() {
  const router = useRouter();
  const { cartItems, appliedCoupon, finalTotal, subtotal, totalDiscount, clearCart } = useCart();
  const { user, addresses, addAddress, selectedAddress, setSelectedAddress } = useAuth();

  const [activeStep, setActiveStep] = useState<number>(2); // 1 = Login, 2 = Address, 3 = Summary, 4 = Payment
  const [isAddingNewAddr, setIsAddingNewAddr] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  // New Address Form State
  const [newAddrForm, setNewAddrForm] = useState({
    fullName: user?.name || "",
    phone: "9876543210",
    pincode: "560001",
    locality: "Indiranagar, 100ft Road",
    addressLine: "Flat 402, Skyline Residency",
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Near Metro",
    type: "HOME" as "HOME" | "WORK",
  });

  const handleCreateNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addAddress({
      ...newAddrForm,
      isDefault: true,
    });
    setSelectedAddress(created);
    setIsAddingNewAddr(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsProcessingOrder(true);

    try {
      const orderPayload = {
        userId: user?.id || "user-1",
        customerName: selectedAddress.fullName,
        customerEmail: user?.email || "customer@bharatkart.com",
        customerPhone: selectedAddress.phone,
        items: cartItems.map((item) => ({
          productId: item.productId,
          title: item.product.title,
          brand: item.product.brand,
          thumbnail: item.product.thumbnail,
          variantName: item.variantName,
          quantity: item.quantity,
          price: item.selectedPrice,
        })),
        shippingAddress: selectedAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (data.success && data.order) {
        // Trigger celebratory confetti!
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}

        clearCart();
        router.push(`/order-success/${data.order.id}`);
      } else {
        alert(data.error || "Order placement failed. Please try again.");
      }
    } catch (err: any) {
      alert("Network error while placing order.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ================= STEP 1: LOGIN ================= */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="p-4 flex items-center justify-between bg-white border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 bg-[#2874f0] text-white rounded-sm text-xs font-bold flex items-center justify-center">
              1
            </span>
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                LOGIN
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {user ? `${user.name} (${user.phone})` : "Guest Checkout"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveStep(1)}
            className="text-xs font-bold text-[#2874f0] uppercase hover:underline"
          >
            Change
          </button>
        </div>
      </div>

      {/* ================= STEP 2: DELIVERY ADDRESS ================= */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div
          onClick={() => setActiveStep(2)}
          className={`p-4 flex items-center justify-between cursor-pointer ${
            activeStep === 2 ? "bg-[#2874f0] text-white" : "bg-white text-gray-900 border-b border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${
                activeStep === 2 ? "bg-white text-[#2874f0]" : "bg-gray-100 text-gray-700"
              }`}
            >
              2
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">
              DELIVERY ADDRESS
            </span>
          </div>

          {activeStep !== 2 && selectedAddress && (
            <span className="text-xs text-gray-500 font-medium truncate max-w-xs">
              {selectedAddress.fullName}, {selectedAddress.pincode}
            </span>
          )}
        </div>

        {activeStep === 2 && (
          <div className="p-4 space-y-4 text-xs">
            {/* List saved addresses */}
            <div className="space-y-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 border rounded-sm cursor-pointer transition-all ${
                      isSelected ? "border-blue-600 bg-blue-50/20" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="addressRadio"
                          checked={isSelected}
                          onChange={() => setSelectedAddress(addr)}
                          className="w-4 h-4 text-blue-600 cursor-pointer"
                        />
                        <span className="font-bold text-sm text-gray-900">{addr.fullName}</span>
                        <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                          {addr.type}
                        </span>
                        <span className="font-bold text-gray-800 ml-2">{addr.phone}</span>
                      </div>
                    </div>

                    <div className="pl-6 pt-1 text-gray-600 leading-relaxed">
                      <p>{addr.addressLine}, {addr.locality}</p>
                      <p>{addr.city}, {addr.state} - <strong className="text-gray-900">{addr.pincode}</strong></p>
                      {addr.landmark && <p className="text-gray-400">Landmark: {addr.landmark}</p>}
                    </div>

                    {isSelected && (
                      <div className="pl-6 pt-3">
                        <button
                          onClick={() => setActiveStep(3)}
                          className="bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs py-2 px-6 rounded-sm uppercase tracking-wide shadow-sm"
                        >
                          Deliver Here
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Address Button & Form */}
            {!isAddingNewAddr ? (
              <button
                onClick={() => setIsAddingNewAddr(true)}
                className="w-full py-3 border border-dashed border-blue-500 rounded text-blue-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add a New Delivery Address</span>
              </button>
            ) : (
              <form onSubmit={handleCreateNewAddress} className="p-4 border border-blue-200 bg-gray-50 rounded-sm space-y-3">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
                  Enter New Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newAddrForm.fullName}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, fullName: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">10-Digit Mobile Number</label>
                    <input
                      type="text"
                      required
                      value={newAddrForm.phone}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newAddrForm.pincode}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, pincode: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Locality</label>
                    <input
                      type="text"
                      required
                      value={newAddrForm.locality}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, locality: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Address (Area and Street)</label>
                  <textarea
                    required
                    rows={2}
                    value={newAddrForm.addressLine}
                    onChange={(e) => setNewAddrForm({ ...newAddrForm, addressLine: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">City / District</label>
                    <input
                      type="text"
                      required
                      value={newAddrForm.city}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={newAddrForm.state}
                      onChange={(e) => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="submit"
                    className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2 px-5 rounded-sm uppercase tracking-wide"
                  >
                    Save & Deliver Here
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddr(false)}
                    className="text-gray-500 font-bold text-xs hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ================= STEP 3: ORDER SUMMARY ================= */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div
          onClick={() => setActiveStep(3)}
          className={`p-4 flex items-center justify-between cursor-pointer ${
            activeStep === 3 ? "bg-[#2874f0] text-white" : "bg-white text-gray-900 border-b border-gray-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${
                activeStep === 3 ? "bg-white text-[#2874f0]" : "bg-gray-100 text-gray-700"
              }`}
            >
              3
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">
              ORDER SUMMARY
            </span>
          </div>

          {activeStep !== 3 && (
            <span className="text-xs text-gray-500 font-medium">
              {cartItems.length} items
            </span>
          )}
        </div>

        {activeStep === 3 && (
          <div className="p-4 space-y-4 text-xs">
            <div className="divide-y divide-gray-100">
              {cartItems.map((item) => (
                <div key={item.productId} className="py-3 flex gap-4 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <div className="w-16 h-16 relative border border-gray-100 rounded p-1 shrink-0">
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{item.product.title}</h4>
                      <p className="text-gray-500">Seller: {item.product.seller?.name || "RetailNet"}</p>
                      <p className="font-extrabold text-sm text-gray-900 mt-1">
                        {formatINR(item.selectedPrice * item.quantity)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <p className="text-gray-600">
                      Delivery by {getEstimatedDeliveryDate(item.product.fastestDeliveryDays || 2)}
                    </p>
                    <span className="text-green-700 font-bold">FREE Delivery</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
              <span className="text-gray-500">
                Order confirmation email will be sent to <strong>{user?.email || "customer@bharatkart.com"}</strong>
              </span>
              <button
                onClick={() => setActiveStep(4)}
                className="bg-[#fb641b] hover:bg-orange-600 text-white font-extrabold text-xs py-3 px-8 rounded-sm uppercase tracking-wide shadow-sm"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= STEP 4: PAYMENT OPTIONS ================= */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div
          onClick={() => setActiveStep(4)}
          className={`p-4 flex items-center justify-between cursor-pointer ${
            activeStep === 4 ? "bg-[#2874f0] text-white" : "bg-white text-gray-900"
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-6 h-6 rounded-sm text-xs font-bold flex items-center justify-center ${
                activeStep === 4 ? "bg-white text-[#2874f0]" : "bg-gray-100 text-gray-700"
              }`}
            >
              4
            </span>
            <span className="text-sm font-bold uppercase tracking-wider">
              PAYMENT OPTIONS
            </span>
          </div>
        </div>

        {activeStep === 4 && (
          <div className="p-4">
            <PaymentMethods
              totalAmount={finalTotal}
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessingOrder}
            />
          </div>
        )}
      </div>
    </div>
  );
}
