"use client";

import React, { useState } from "react";
import { FileText, RotateCcw, HelpCircle, Check } from "lucide-react";

interface OrderActionButtonsProps {
  orderId: string;
}

export function OrderActionButtons({ orderId }: OrderActionButtonsProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [returned, setReturned] = useState(false);
  const [helped, setHelped] = useState(false);

  const handleDownloadInvoice = () => {
    setDownloaded(true);
    const invoiceContent = `===============================================================
              TAX INVOICE / CASH MEMO
              BHARATKART E-COMMERCE PRIVATE LIMITED
     GSTIN: 29AABCB1234F1Z6 | CIN: U51109KA2012PTC066107
===============================================================
Order Reference: ${orderId}
Invoice Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
Fulfillment Partner: BlueDart Express / Ekart Logistics

Billing & Shipping Address:
Rahul Sharma
Flat 402, Skyline Residency, 12th Cross, Indiranagar, 100 Feet Road
Bengaluru, Karnataka - 560001
Phone: +91 9876543210

Item Description:
1. Marketplace Confirmed Order Item(s)
   HSN Code: 85171300
   Taxable Subtotal: Calculated per item
   GST (IGST @ 18%): Included
   Delivery Charges: FREE

Payment Method: Cash on Delivery (COD) / Verified Payment
Status: Order Confirmed & In Transit

This is a digitally generated tax invoice authorized by BharatKart.
===============================================================`;
    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tax_Invoice_${orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloaded(false), 4000);
  };

  const handleReturn = () => {
    setReturned(true);
    alert(`Return request initiated for order ${orderId}. Pickup will be scheduled within 24-48 hours.`);
  };

  const handleNeedHelp = () => {
    setHelped(true);
    alert(`Connecting you to BharatKart 24x7 Customer Support for order ${orderId}...`);
  };

  return (
    <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3">
      <button
        onClick={handleDownloadInvoice}
        className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors"
      >
        {downloaded ? <Check className="w-4 h-4 text-green-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
        <span>{downloaded ? "Invoice Downloaded" : "Download Tax Invoice"}</span>
      </button>

      <button
        onClick={handleReturn}
        className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors"
      >
        <RotateCcw className="w-4 h-4 text-orange-500" />
        <span>{returned ? "Return Requested" : "Request Return / Exchange"}</span>
      </button>

      <button
        onClick={handleNeedHelp}
        className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors"
      >
        <HelpCircle className="w-4 h-4 text-purple-600" />
        <span>{helped ? "Connecting..." : "Need Help?"}</span>
      </button>
    </div>
  );
}
