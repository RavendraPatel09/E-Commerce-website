"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { SearchSuggestions, SuggestionItem } from "./SearchSuggestions";

interface SearchBarProps {
  className?: string;
  onSearchSubmit?: () => void;
}

export function SearchBar({ className = "", onSearchSubmit }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch debounced suggestions
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
          setIsOpen(true);
          setActiveIndex(-1);
        }
      } catch (err) {
        console.error("Suggestions error", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) inputRef.current.blur();
    if (onSearchSubmit) onSearchSubmit();

    if (item.link) {
      router.push(item.link);
    } else {
      setQuery(item.text);
      router.push(`/search?search=${encodeURIComponent(item.text)}`);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // If an item is highlighted via keyboard navigation
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (query.trim()) {
      setIsOpen(false);
      setActiveIndex(-1);
      if (inputRef.current) inputRef.current.blur();
      if (onSearchSubmit) onSearchSubmit();
      router.push(`/search?search=${encodeURIComponent(query.trim())}`);
    }
  };

  // Keyboard navigation handler (ArrowUp, ArrowDown, Enter, Escape)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;

      case "Enter":
        e.preventDefault();
        handleSubmit();
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;

      default:
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder="Search for products, brands and more"
          className="w-full bg-white text-gray-800 text-xs sm:text-[14px] placeholder:text-gray-500 pl-3 sm:pl-4 pr-12 sm:pr-16 py-1.5 sm:py-2 rounded-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
              setActiveIndex(-1);
            }}
            className="absolute right-9 sm:right-10 text-gray-400 hover:text-gray-600 p-1"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-0 top-0 bottom-0 px-2.5 sm:px-3.5 flex items-center justify-center text-[#2874f0] hover:text-blue-700 transition-colors"
          title="Search"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>

      <SearchSuggestions
        isOpen={isOpen}
        suggestions={suggestions}
        activeIndex={activeIndex}
        onSelect={handleSelectSuggestion}
        onHover={(index) => setActiveIndex(index)}
      />
    </div>
  );
}
