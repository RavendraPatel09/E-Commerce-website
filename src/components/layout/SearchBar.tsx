"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { SearchDropdown } from "./SearchDropdown";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions with debounce
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Suggestions error", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/search?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSelectSuggestion = (item: any) => {
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    } else {
      setQuery(item.text);
      router.push(`/search?search=${encodeURIComponent(item.text)}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[560px]">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search for products, brands and more"
          className="w-full bg-white text-gray-800 text-[14px] placeholder:text-gray-500 pl-4 pr-16 py-2 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-10 text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-blue-600 hover:text-blue-700"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      <SearchDropdown
        isOpen={isOpen}
        suggestions={suggestions}
        onSelect={handleSelectSuggestion}
      />
    </div>
  );
}
