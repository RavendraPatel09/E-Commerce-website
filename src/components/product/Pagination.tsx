"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageSelect = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build visible page numbers
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-sm p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm mt-4 ${className}`}
    >
      {/* Page indicator info */}
      <span className="text-gray-500 font-medium">
        Page <strong className="font-bold text-gray-900">{currentPage}</strong> of{" "}
        <strong className="font-bold text-gray-900">{totalPages}</strong>
      </span>

      {/* Page navigation buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        <button
          onClick={() => handlePageSelect(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
            currentPage <= 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-[#2874f0] hover:bg-blue-50 active:scale-95"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="uppercase">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span key={`dots-${idx}`} className="px-2 text-gray-400 select-none">
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                onClick={() => handlePageSelect(pageNum)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center ${
                  isActive
                    ? "bg-[#2874f0] text-white shadow-xs"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageSelect(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-bold transition-colors ${
            currentPage >= totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-[#2874f0] hover:bg-blue-50 active:scale-95"
          }`}
        >
          <span className="uppercase">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
