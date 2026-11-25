"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Smartphone, ShieldCheck, Check } from "lucide-react";

export function LoginModal() {
  const { isLoginModalOpen, setIsLoginModalOpen, login } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [role, setRole] = useState<"customer" | "seller" | "admin">("customer");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState(["1", "2", "3", "4"]);

  if (!isLoginModalOpen) return null;

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) return;
    setOtpStep(true);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    login(phoneOrEmail.trim(), role);
    setOtpStep(false);
    setPhoneOrEmail("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsLoginModalOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-[720px] bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">
        {/* Close Button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 p-1 z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Brand Blue Banner */}
        <div className="w-full md:w-[40%] bg-[#2874f0] text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black">Login</h2>
            <p className="text-sm text-blue-100 mt-2 leading-relaxed">
              Get access to your Orders, Wishlist and Personalized Recommendations.
            </p>
          </div>

          <div className="py-6 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
              <Smartphone className="w-12 h-12 text-[#ffe11b]" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-blue-100">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>100% Secure Login with OTP</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[60%] p-8 flex flex-col justify-between">
          {!otpStep ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Enter Mobile Number or Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 or user@example.com"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full border-b-2 border-gray-300 py-2 text-sm font-semibold text-gray-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Role Select for demo convenience */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Sign in As:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: "customer", label: "Customer" },
                    { id: "seller", label: "Seller" },
                    { id: "admin", label: "Admin" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`py-1.5 px-2 border rounded text-center font-bold transition-colors ${
                        role === r.id
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-normal">
                By continuing, you agree to BharatKart's{" "}
                <span className="text-blue-600 underline">Terms of Use</span> and{" "}
                <span className="text-blue-600 underline">Privacy Policy</span>.
              </p>

              <button
                type="submit"
                className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
              >
                Request OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Please enter the OTP sent to</h3>
                <p className="text-xs text-blue-600 font-semibold">{phoneOrEmail}</p>
              </div>

              <div className="flex gap-2 justify-center py-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const copy = [...otp];
                      copy[idx] = e.target.value;
                      setOtp(copy);
                    }}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded focus:border-blue-600 focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-sm py-3 rounded-sm shadow-sm transition-colors uppercase tracking-wide"
              >
                Verify & Login
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="w-full text-center text-xs font-bold text-blue-600 hover:underline"
              >
                Change Number / Email
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => {
                login("rahul.sharma@example.com", "customer");
                setIsLoginModalOpen(false);
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Demo 1-Click Customer Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
