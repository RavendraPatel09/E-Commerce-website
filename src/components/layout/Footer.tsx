import React from "react";
import Link from "next/link";
import { Store, HelpCircle, Gift, Sparkles, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#172337] text-white text-[12px] pt-10 pb-6 mt-12 border-t border-gray-800">
      <div className="max-w-[1360px] mx-auto px-4">
        {/* Main Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-10 border-b border-gray-700">
          {/* Col 1 */}
          <div>
            <h4 className="text-gray-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              About
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/" className="hover:underline">About BharatKart</Link></li>
              <li><Link href="/" className="hover:underline">Careers</Link></li>
              <li><Link href="/" className="hover:underline">Press & Media</Link></li>
              <li><Link href="/" className="hover:underline">Corporate Information</Link></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-gray-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Group Brands
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><a href="#" className="hover:underline">Myntra Fashion</a></li>
              <li><a href="#" className="hover:underline">Cleartrip Travel</a></li>
              <li><a href="#" className="hover:underline">Shopsy Hyperlocal</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div id="footer-help">
            <h4 className="text-gray-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Help & Support
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/" className="hover:underline">Payments & Refunds</Link></li>
              <li><Link href="/" className="hover:underline">Shipping & Delivery</Link></li>
              <li><Link href="/" className="hover:underline">Cancellations & Returns</Link></li>
              <li><Link href="/" className="hover:underline">FAQ & Customer Desk</Link></li>
              <li><Link href="/" className="hover:underline">Report Infringement</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-gray-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Consumer Policy
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li><Link href="/" className="hover:underline">Cancellation & Returns</Link></li>
              <li><Link href="/" className="hover:underline">Terms Of Use</Link></li>
              <li><Link href="/" className="hover:underline">Security</Link></li>
              <li><Link href="/" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:underline">Grievance Redressal</Link></li>
              <li><Link href="/" className="hover:underline">EPR Compliance</Link></li>
            </ul>
          </div>

          {/* Col 5: Mail Us */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 col-span-2 md:col-span-1">
            <h4 className="text-gray-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Mail Us:
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              BharatKart Internet Private Limited,<br />
              Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India
            </p>
          </div>

          {/* Col 6: Registered Address */}
          <div className="border-t md:border-t-0 md:border-l border-gray-700 md:pl-6 col-span-2 md:col-span-1">
            <h4 className="text-gray-400 font-semibold mb-3 tracking-wider text-[11px] uppercase">
              Registered Office:
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              BharatKart Internet Private Limited,<br />
              CIN: U51109KA2012PTC066107<br />
              Telephone: <span className="text-blue-400">044-45614700 / 044-67415800</span><br />
              100% Genuine Products Guaranteed.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Quick links & payment security */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-300 text-[11px]">
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/seller" className="flex items-center gap-1.5 text-yellow-400 hover:underline font-medium">
              <Store className="w-4 h-4" />
              <span>Become a Seller</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-yellow-400 hover:underline font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Advertise</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-yellow-400 hover:underline font-medium">
              <Gift className="w-4 h-4" />
              <span>Gift Cards</span>
            </Link>
            <Link href="/" className="flex items-center gap-1.5 text-yellow-400 hover:underline font-medium">
              <HelpCircle className="w-4 h-4" />
              <span>Help Center</span>
            </Link>
          </div>

          <div className="text-gray-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            <span>© 2007-2026 BharatKart.com. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-[10px]">
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono">VISA</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono">MasterCard</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono">RuPay</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono">UPI</span>
            <span className="bg-white/10 px-2 py-0.5 rounded font-mono">NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
