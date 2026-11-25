"use client";

import React, { useState } from "react";
import { formatINR } from "@/lib/utils";
import { ShieldCheck, Smartphone, CreditCard, Landmark, Banknote, CheckCircle2 } from "lucide-react";

interface PaymentMethodsProps {
  totalAmount: number;
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  onPlaceOrder: () => void;
  isProcessing: boolean;
}

export function PaymentMethods({
  totalAmount,
  selectedMethod,
  onSelectMethod,
  onPlaceOrder,
  isProcessing,
}: PaymentMethodsProps) {
  // UPI state
  const [upiId, setUpiId] = useState("");
  const [upiApp, setUpiApp] = useState("gpay");

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Net banking
  const [selectedBank, setSelectedBank] = useState("sbi");

  // COD captcha
  const [captchaCode] = useState(() => Math.floor(100 + Math.random() * 900).toString());
  const [enteredCaptcha, setEnteredCaptcha] = useState("");

  return (
    <div className="space-y-4 text-xs text-gray-800">
      {/* 1. UPI */}
      <div
        className={`border rounded-sm p-4 transition-all ${
          selectedMethod === "UPI" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 bg-white"
        }`}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === "UPI"}
            onChange={() => onSelectMethod("UPI")}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-sm text-gray-900">UPI (Google Pay, PhonePe, Paytm)</span>
          </div>
        </label>

        {selectedMethod === "UPI" && (
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3 pl-7">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="upiType"
                  checked={upiApp === "gpay"}
                  onChange={() => setUpiApp("gpay")}
                  className="w-3.5 h-3.5 text-blue-600"
                />
                <span className="font-semibold text-gray-700">Google Pay / PhonePe App</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="upiType"
                  checked={upiApp === "id"}
                  onChange={() => setUpiApp("id")}
                  className="w-3.5 h-3.5 text-blue-600"
                />
                <span className="font-semibold text-gray-700">Enter UPI ID</span>
              </label>
            </div>

            {upiApp === "id" && (
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="e.g. mobile@upi or username@okaxis"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded text-xs focus:outline-none focus:border-blue-600"
                />
              </div>
            )}

            <button
              onClick={onPlaceOrder}
              disabled={isProcessing}
              className="mt-2 bg-[#fb641b] hover:bg-orange-600 disabled:opacity-60 text-white font-extrabold text-sm py-2.5 px-6 rounded-sm shadow transition-colors"
            >
              {isProcessing ? "Processing Secure Payment..." : `PAY ${formatINR(totalAmount)} VIA UPI`}
            </button>
          </div>
        )}
      </div>

      {/* 2. Credit / Debit / ATM Card */}
      <div
        className={`border rounded-sm p-4 transition-all ${
          selectedMethod === "CARD" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 bg-white"
        }`}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === "CARD"}
            onChange={() => onSelectMethod("CARD")}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-sm text-gray-900">Credit / Debit / ATM Card</span>
          </div>
        </label>

        {selectedMethod === "CARD" && (
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3 pl-7 max-w-md">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  Valid Thru (MM/YY)
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength={5}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength={3}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-xs font-mono focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <button
              onClick={onPlaceOrder}
              disabled={isProcessing}
              className="mt-2 bg-[#fb641b] hover:bg-orange-600 disabled:opacity-60 text-white font-extrabold text-sm py-2.5 px-6 rounded-sm shadow transition-colors"
            >
              {isProcessing ? "Authorizing Card..." : `PAY ${formatINR(totalAmount)}`}
            </button>
          </div>
        )}
      </div>

      {/* 3. Net Banking */}
      <div
        className={`border rounded-sm p-4 transition-all ${
          selectedMethod === "NET_BANKING" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 bg-white"
        }`}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === "NET_BANKING"}
            onChange={() => onSelectMethod("NET_BANKING")}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-purple-600" />
            <span className="font-bold text-sm text-gray-900">Net Banking</span>
          </div>
        </label>

        {selectedMethod === "NET_BANKING" && (
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3 pl-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "sbi", name: "State Bank of India" },
                { id: "hdfc", name: "HDFC Bank" },
                { id: "icici", name: "ICICI Bank" },
                { id: "axis", name: "Axis Bank" },
              ].map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-2.5 border rounded text-xs font-semibold text-center transition-colors ${
                    selectedBank === bank.id
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  {bank.name}
                </button>
              ))}
            </div>

            <button
              onClick={onPlaceOrder}
              disabled={isProcessing}
              className="mt-2 bg-[#fb641b] hover:bg-orange-600 disabled:opacity-60 text-white font-extrabold text-sm py-2.5 px-6 rounded-sm shadow transition-colors"
            >
              {isProcessing ? "Connecting to Bank Gateway..." : `PAY ${formatINR(totalAmount)}`}
            </button>
          </div>
        )}
      </div>

      {/* 4. Cash on Delivery (COD) */}
      <div
        className={`border rounded-sm p-4 transition-all ${
          selectedMethod === "COD" ? "border-blue-600 bg-blue-50/20" : "border-gray-200 bg-white"
        }`}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            checked={selectedMethod === "COD"}
            onChange={() => onSelectMethod("COD")}
            className="w-4 h-4 text-blue-600 cursor-pointer"
          />
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-sm text-gray-900">Cash on Delivery (Pay upon delivery)</span>
          </div>
        </label>

        {selectedMethod === "COD" && (
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-3 pl-7 max-w-sm">
            <p className="text-xs text-gray-500">
              Please enter the characters shown below to confirm your Cash on Delivery order:
            </p>
            <div className="flex items-center gap-3">
              <span className="bg-gray-200 text-gray-900 font-mono font-black text-lg px-4 py-1.5 rounded tracking-widest border border-gray-400 select-none">
                {captchaCode}
              </span>
              <input
                type="text"
                placeholder="Enter characters"
                value={enteredCaptcha}
                onChange={(e) => setEnteredCaptcha(e.target.value)}
                className="w-32 p-2 border border-gray-300 rounded text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-blue-600"
              />
            </div>

            <button
              onClick={onPlaceOrder}
              disabled={isProcessing || enteredCaptcha !== captchaCode}
              className="mt-2 bg-[#fb641b] hover:bg-orange-600 disabled:opacity-40 text-white font-extrabold text-sm py-2.5 px-6 rounded-sm shadow transition-colors"
            >
              {isProcessing ? "Confirming COD Order..." : "CONFIRM COD ORDER"}
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-500 text-xs pt-2">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        <span>256-Bit SSL Encrypted Payment. Your bank credentials are 100% secure.</span>
      </div>
    </div>
  );
}
