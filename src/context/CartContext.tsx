"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product, CartItem, Coupon } from "@/lib/types";

interface CartContextType {
  cartItems: CartItem[];
  savedForLater: CartItem[];
  appliedCoupon: { code: string; discount: number; description: string } | null;
  addToCart: (product: Product, quantity?: number, variantId?: string, variantName?: string, price?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  saveForLater: (productId: string, variantId?: string) => void;
  moveToCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message?: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  totalItems: number;
  subtotal: number;
  originalTotal: number;
  totalDiscount: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bharatkart_cart_items";
const SAVED_STORAGE_KEY = "bharatkart_saved_items";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedForLaterItems, setSavedForLaterItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) setCartItems(JSON.parse(storedCart));
      const storedSaved = localStorage.getItem(SAVED_STORAGE_KEY);
      if (storedSaved) setSavedForLaterItems(JSON.parse(storedSaved));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedForLaterItems));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cartItems, savedForLaterItems, isLoaded]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variantId?: string,
    variantName?: string,
    price?: number
  ) => {
    const selectedPrice = price || product.price;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === product.id && item.variantId === variantId
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            product,
            variantId,
            variantName,
            quantity,
            selectedPrice,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    // Also remove from saved for later if present
    setSavedForLaterItems((prev) =>
      prev.filter((item) => !(item.productId === product.id && item.variantId === variantId))
    );
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const updateQuantity = (productId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const saveForLater = (productId: string, variantId?: string) => {
    const itemToSave = cartItems.find(
      (item) => item.productId === productId && item.variantId === variantId
    );
    if (!itemToSave) return;

    removeFromCart(productId, variantId);
    setSavedForLaterItems((prev) => [...prev, itemToSave]);
  };

  const moveToCart = (productId: string, variantId?: string) => {
    const itemToMove = savedForLaterItems.find(
      (item) => item.productId === productId && item.variantId === variantId
    );
    if (!itemToMove) return;

    setSavedForLaterItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
    addToCart(itemToMove.product, itemToMove.quantity, itemToMove.variantId, itemToMove.variantName, itemToMove.selectedPrice);
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, orderTotal: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          description: data.description,
        });
        return { success: true };
      } else {
        return { success: false, message: data.error };
      }
    } catch (e: any) {
      return { success: false, message: "Error applying coupon" };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.selectedPrice * item.quantity, 0);
  const originalTotal = cartItems.reduce((sum, item) => {
    const itemOriginalPrice =
      (item.variantId && item.product.variants?.find((v) => v.id === item.variantId)?.originalPrice) ||
      item.product.originalPrice ||
      item.selectedPrice;
    return sum + itemOriginalPrice * item.quantity;
  }, 0);
  const totalDiscount = Math.max(0, originalTotal - subtotal);
  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalTotal = Math.max(0, subtotal - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater: savedForLaterItems,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        saveForLater,
        moveToCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        totalItems,
        subtotal,
        originalTotal,
        totalDiscount,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
