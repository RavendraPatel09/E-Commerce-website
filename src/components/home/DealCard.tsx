import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/utils";

interface DealCardProps {
  title: string;
  discountText: string;
  category: string;
  imageUrl: string;
  href: string;
}

export function DealCard({ title, discountText, category, imageUrl, href }: DealCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-gray-100 rounded-sm p-4 text-center hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-36 mb-2 overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <p className="text-[13px] font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600">
        {title}
      </p>
      <p className="text-[12px] font-bold text-[#388e3c] mt-0.5">
        {discountText}
      </p>
      <p className="text-[11px] text-gray-400 capitalize mt-0.5">
        {category}
      </p>
    </Link>
  );
}
