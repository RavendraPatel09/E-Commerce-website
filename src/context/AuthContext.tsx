"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Address } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phoneOrEmail: string, role?: "customer" | "seller" | "admin") => void;
  logout: () => void;
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => Address;
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE_KEY = "bharatkart_user";
const ADDR_STORAGE_KEY = "bharatkart_addresses";

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-home-1",
    fullName: "Rahul Sharma",
    phone: "9876543210",
    pincode: "560001",
    locality: "Indiranagar, 100 Feet Road",
    addressLine: "Flat 402, Skyline Residency, 12th Cross",
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Near BDA Complex & Metro",
    type: "HOME",
    isDefault: true,
  },
  {
    id: "addr-work-2",
    fullName: "Rahul Sharma",
    phone: "9876543210",
    pincode: "560103",
    locality: "Outer Ring Road, Bellandur",
    addressLine: "Tower B, EcoSpace Business Park, 4th Floor",
    city: "Bengaluru",
    state: "Karnataka",
    landmark: "Opposite Central Mall",
    type: "WORK",
    isDefault: false,
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    role: "customer",
    createdAt: new Date().toISOString(),
  });
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(DEFAULT_ADDRESSES[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));
      const storedAddr = localStorage.getItem(ADDR_STORAGE_KEY);
      if (storedAddr) {
        const parsed = JSON.parse(storedAddr);
        setAddresses(parsed);
        const def = parsed.find((a: Address) => a.isDefault) || parsed[0];
        setSelectedAddress(def);
      }
    } catch (e) {
      console.error("Failed to load user auth data", e);
    }
  }, []);

  const login = (phoneOrEmail: string, role: "customer" | "seller" | "admin" = "customer") => {
    const isEmail = phoneOrEmail.includes("@");
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: isEmail ? phoneOrEmail.split("@")[0] : `Customer (+91 ${phoneOrEmail.slice(-4)})`,
      email: isEmail ? phoneOrEmail : `${phoneOrEmail}@customer.bharatkart.com`,
      phone: isEmail ? "+91 98765 43210" : phoneOrEmail,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const addAddress = (addressData: Omit<Address, "id">): Address => {
    const newAddr: Address = {
      ...addressData,
      id: `addr-${Date.now()}`,
    };
    const updated = [newAddr, ...addresses];
    setAddresses(updated);
    setSelectedAddress(newAddr);
    localStorage.setItem(ADDR_STORAGE_KEY, JSON.stringify(updated));
    return newAddr;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        addresses,
        addAddress,
        selectedAddress,
        setSelectedAddress,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
