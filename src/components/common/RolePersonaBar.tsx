"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Shield, Store, User as UserIcon, Check } from "lucide-react";

export function RolePersonaBar() {
  const { user, switchPersona } = useAuth();
  const currentRole = user?.role || "customer";

  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 font-medium">Active Persona:</span>
        <span className="font-bold text-gray-100 flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
          {currentRole === "admin" && <Shield className="w-3.5 h-3.5 text-blue-400" />}
          {currentRole === "seller" && <Store className="w-3.5 h-3.5 text-amber-400" />}
          {currentRole === "customer" && <UserIcon className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{user?.name || "Guest"}</span>
          <span
            className={`text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
              currentRole === "admin"
                ? "bg-blue-600 text-white"
                : currentRole === "seller"
                ? "bg-amber-500 text-slate-950"
                : "bg-emerald-600 text-white"
            }`}
          >
            {currentRole}
          </span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-400 hidden sm:inline">Role Switcher:</span>
        <button
          onClick={() => switchPersona("admin")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
            currentRole === "admin"
              ? "bg-blue-600 text-white ring-1 ring-blue-400"
              : "bg-slate-800 hover:bg-slate-700 text-gray-300"
          }`}
        >
          {currentRole === "admin" && <Check className="w-3 h-3" />}
          <span>Admin</span>
        </button>

        <button
          onClick={() => switchPersona("seller", "seller-retailnet")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
            currentRole === "seller"
              ? "bg-amber-500 text-slate-950 font-black ring-1 ring-amber-300"
              : "bg-slate-800 hover:bg-slate-700 text-gray-300"
          }`}
        >
          {currentRole === "seller" && <Check className="w-3 h-3" />}
          <span>Seller (RetailNet)</span>
        </button>

        <button
          onClick={() => switchPersona("customer")}
          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
            currentRole === "customer"
              ? "bg-emerald-600 text-white ring-1 ring-emerald-400"
              : "bg-slate-800 hover:bg-slate-700 text-gray-300"
          }`}
        >
          {currentRole === "customer" && <Check className="w-3 h-3" />}
          <span>Customer</span>
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1 hidden sm:block" />

        <div className="flex items-center gap-2 text-[11px]">
          <Link
            href="/admin"
            className="text-blue-400 hover:underline font-semibold"
          >
            Admin Panel
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            href="/seller/dashboard"
            className="text-amber-400 hover:underline font-semibold"
          >
            Seller Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
