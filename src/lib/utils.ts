import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format numbers according to the Indian numbering system (Lakhs, Crores)
 * e.g. 129999 -> "₹1,29,999"
 */
export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  const numStr = Math.round(amount).toString();
  const lastThree = numStr.substring(numStr.length - 3);
  const otherNumbers = numStr.substring(0, numStr.length - 3);
  const formatted =
    otherNumbers !== ""
      ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
      : lastThree;
  return `₹${formatted}`;
}

/**
 * Calculate percentage discount
 */
export function calculateDiscount(price: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Pincode database simulation for Indian addresses
 */
export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  deliveryDays: number;
  codAvailable: boolean;
  standardCharge: number;
  expressAvailable: boolean;
}

const PINCODE_MAP: Record<string, PincodeInfo> = {
  "560001": { pincode: "560001", city: "Bengaluru", state: "Karnataka", deliveryDays: 1, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "560068": { pincode: "560068", city: "Bengaluru", state: "Karnataka", deliveryDays: 1, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "110001": { pincode: "110001", city: "New Delhi", state: "Delhi", deliveryDays: 1, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "110020": { pincode: "110020", city: "New Delhi", state: "Delhi", deliveryDays: 1, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "400001": { pincode: "400001", city: "Mumbai", state: "Maharashtra", deliveryDays: 1, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "400050": { pincode: "400050", city: "Mumbai", state: "Maharashtra", deliveryDays: 1, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "600001": { pincode: "600001", city: "Chennai", state: "Tamil Nadu", deliveryDays: 2, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "700001": { pincode: "700001", city: "Kolkata", state: "West Bengal", deliveryDays: 2, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "500001": { pincode: "500001", city: "Hyderabad", state: "Telangana", deliveryDays: 2, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "411001": { pincode: "411001", city: "Pune", state: "Maharashtra", deliveryDays: 2, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "380001": { pincode: "380001", city: "Ahmedabad", state: "Gujarat", deliveryDays: 2, codAvailable: true, standardCharge: 0, expressAvailable: true },
  "302001": { pincode: "302001", city: "Jaipur", state: "Rajasthan", deliveryDays: 3, codAvailable: true, standardCharge: 0, expressAvailable: false },
  "226001": { pincode: "226001", city: "Lucknow", state: "Uttar Pradesh", deliveryDays: 3, codAvailable: true, standardCharge: 0, expressAvailable: false },
  "800001": { pincode: "800001", city: "Patna", state: "Bihar", deliveryDays: 3, codAvailable: true, standardCharge: 0, expressAvailable: false },
  "682001": { pincode: "682001", city: "Kochi", state: "Kerala", deliveryDays: 3, codAvailable: true, standardCharge: 0, expressAvailable: false },
  "160017": { pincode: "160017", city: "Chandigarh", state: "Punjab", deliveryDays: 2, codAvailable: true, standardCharge: 0, expressAvailable: true },
};

export function lookupPincode(pincode: string): PincodeInfo {
  const clean = pincode.trim();
  if (PINCODE_MAP[clean]) {
    return PINCODE_MAP[clean];
  }
  // Generic fallback for any valid 6-digit Indian pincode
  if (/^[1-9][0-9]{5}$/.test(clean)) {
    return {
      pincode: clean,
      city: "Delivery Hub",
      state: "India",
      deliveryDays: 4,
      codAvailable: true,
      standardCharge: 0,
      expressAvailable: false,
    };
  }
  throw new Error("Invalid Indian PIN Code. Please enter a valid 6-digit PIN code.");
}

/**
 * Format expected delivery date string e.g. "Tomorrow by 9 PM" or "Friday, 28 Nov"
 */
export function getEstimatedDeliveryDate(days: number = 2): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  
  if (days === 1) {
    return "Tomorrow, by 9 PM";
  }
  
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/**
 * Mask sensitive bank account number: e.g. "912345678901" -> "••••••••8901"
 */
export function maskBankAccount(acc?: string): string {
  if (!acc) return "••••••••••••";
  const clean = acc.trim();
  if (clean.length <= 4) return "••••" + clean;
  return "•".repeat(clean.length - 4) + clean.slice(-4);
}

/**
 * Mask PAN: e.g. "ABCDE1234F" -> "AB••••••4F"
 */
export function maskPAN(pan?: string): string {
  if (!pan) return "••••••••••";
  const clean = pan.trim();
  if (clean.length <= 4) return clean;
  return clean.slice(0, 2) + "••••••" + clean.slice(-2);
}

/**
 * Mask GSTIN: e.g. "29ABCDE1234F1Z5" -> "29••••••••••1Z5"
 */
export function maskGSTIN(gstin?: string): string {
  if (!gstin) return "•••••••••••••••";
  const clean = gstin.trim();
  if (clean.length <= 5) return clean;
  return clean.slice(0, 2) + "••••••••••" + clean.slice(-3);
}

/**
 * Mask customer phone: e.g. "+91 98765 43210" -> "+91 ••••• •3210"
 */
export function maskPhone(phone?: string): string {
  if (!phone) return "••••••••••";
  const clean = phone.trim();
  if (clean.length <= 4) return clean;
  return clean.slice(0, -4).replace(/[0-9]/g, "•") + clean.slice(-4);
}
