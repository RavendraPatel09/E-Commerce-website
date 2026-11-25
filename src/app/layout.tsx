import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { Header } from "@/components/layout/Header";
import { CategoryBar } from "@/components/layout/CategoryBar";
import { Footer } from "@/components/layout/Footer";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { LoginModal } from "@/components/layout/LoginModal";

export const metadata: Metadata = {
  title: "BharatKart | Online Shopping India - Best Deals on Mobiles, Electronics, Fashion",
  description: "Shop online for smartphones, laptops, audio, smart TVs, home appliances, fashion, footwear and more on BharatKart. Enjoy Best Prices, Instant Bank Discounts & Fast Delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between bg-[#f1f3f6] antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <CategoryBar />
                <main className="flex-1 max-w-[1360px] w-full mx-auto px-2 sm:px-4 py-3 pb-16 md:pb-6">
                  {children}
                </main>
                <Footer />
                <MobileNavigation />
                <CartDrawer />
                <LoginModal />
              </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
