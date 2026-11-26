"use client";

import React, { useState } from "react";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { AccountMenu } from "./AccountMenu";
import { SellerLink } from "./SellerLink";
import { MoreMenu } from "./MoreMenu";
import { CartButton } from "./CartButton";
import { Menu, X } from "lucide-react";
import { MobileDrawer } from "../Navigation/MobileNavigation";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#2874f0] shadow-md w-full">
        <div className="max-w-[1360px] mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white p-1.5 hover:bg-white/10 rounded focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Logo />
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:block">
            <Logo />
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 min-w-[80px] sm:min-w-[140px] max-w-[620px] mx-1 sm:mx-2">
            <SearchBar />
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-7 shrink-0 text-white">
            <AccountMenu />
            <SellerLink className="hidden lg:flex" />
            <MoreMenu className="hidden md:block" />
            <CartButton />
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
