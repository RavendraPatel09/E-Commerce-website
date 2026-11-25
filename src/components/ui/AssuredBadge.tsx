import React from "react";

export function AssuredBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 italic text-[11px] font-bold tracking-tight text-[#2874f0] ${className}`}
      title="BharatKart Assured - Quality Checked & Fastest Delivery"
    >
      <span className="font-extrabold text-[#2874f0] not-italic">BharatKart</span>
      <span className="bg-[#2874f0] text-[#ffe11b] text-[9px] font-black uppercase px-1 py-[1px] rounded-[2px] not-italic">
        Plus
      </span>
    </span>
  );
}
