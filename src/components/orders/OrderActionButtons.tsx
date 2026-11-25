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
    alert(`Downloading official GST Tax Invoice for order ${orderId}`);
    setTimeout(() => setDownloaded(false), 3000);
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
