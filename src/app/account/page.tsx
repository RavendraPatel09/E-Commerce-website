"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  LogOut,
  Plus,
  Shield,
  Edit2,
} from "lucide-react";

export default function AccountPage() {
  const { user, addresses, addAddress, logout, setIsLoginModalOpen } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "Rahul Sharma");
  const [emailInput, setEmailInput] = useState(user?.email || "rahul.sharma@example.com");

  if (!user) {
    return (
      <div className="bg-white border border-gray-200 rounded-sm p-12 text-center my-6 shadow-sm max-w-lg mx-auto">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Please Sign In</h2>
        <p className="text-xs text-gray-500 mb-6">Sign in to view your profile, manage addresses, and check orders.</p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="bg-[#2874f0] hover:bg-blue-600 text-white font-bold text-xs py-2.5 px-8 rounded-sm uppercase tracking-wide shadow-sm"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      {/* Left Sidebar */}
      <div className="md:col-span-4 space-y-4">
        {/* User Card */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 flex items-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-xs truncate">
            <span className="text-gray-400 uppercase text-[10px] font-bold">Hello,</span>
            <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm divide-y divide-gray-100 text-xs">
          <div className="p-2 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-left transition-colors ${
                activeTab === "profile" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-left transition-colors ${
                activeTab === "addresses" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Manage Addresses</span>
            </button>
          </div>

          <div className="p-2 space-y-1">
            <Link
              href="/orders"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Package className="w-4 h-4 text-blue-600" />
              <span>My Orders</span>
            </Link>

            <Link
              href="/wishlist"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>My Wishlist</span>
            </Link>
          </div>

          <div className="p-2">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded font-semibold text-red-600 hover:bg-red-50 text-left transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="md:col-span-8 bg-white border border-gray-200 rounded-sm p-6 shadow-sm text-xs text-gray-800">
        {activeTab === "profile" ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Personal Information</h2>
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{isEditingProfile ? "Done" : "Edit"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-xs disabled:bg-gray-50 disabled:text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled={!isEditingProfile}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-xs disabled:bg-gray-50 disabled:text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  disabled
                  value={user.phone}
                  className="w-full p-2 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">
                  Account Type
                </label>
                <span className="inline-block bg-blue-100 text-blue-800 font-bold text-xs px-3 py-1.5 rounded uppercase mt-0.5">
                  {user.role}
                </span>
              </div>
            </div>

            {/* FAQs */}
            <div className="pt-6 border-t border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">FAQs</h3>
              <div className="space-y-2 text-gray-600 text-xs">
                <p><strong>What happens when I update my email address?</strong></p>
                <p className="text-gray-500">Your login email ID changes. All order receipts and invoices will be sent to the updated address.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">Manage Saved Addresses</h2>
            </div>

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 border border-gray-200 rounded-sm relative">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                      {addr.type}
                    </span>
                    <strong className="text-sm font-bold text-gray-900">{addr.fullName}</strong>
                    <span className="font-bold text-gray-700 ml-2">{addr.phone}</span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {addr.addressLine}, {addr.locality}, {addr.city}, {addr.state} -{" "}
                    <strong>{addr.pincode}</strong>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
