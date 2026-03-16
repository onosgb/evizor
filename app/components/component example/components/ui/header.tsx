"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { userStore } from "@/store/user.store";
import { merchantStore } from "@/store/merchant.store";
import { Store, TrendingUp } from "lucide-react";

export default function Header() {
  const { data: user } = userStore();
  const { profile, fetchProfile } = merchantStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering client-side content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load profile for all authenticated users to get cashback balance
  useEffect(() => {
    if (mounted && user) {
      fetchProfile();
    }
  }, [mounted, user, fetchProfile]);

  return (
    <>
      <header className="bg-white shadow py-4 px-4 fixed w-full z-50 top-0">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/img/logo.png"
                alt="Logo"
                className="h-12 w-12"
                width={48}
                height={48}
              />
              {/* Site Title - hidden on mobile */}
              <span className="hidden md:block font-semibold text-green-600 text-lg">
                InstantPower
              </span>
            </Link>
            {/* Navigation menus - only show when user is NOT logged in */}
            {mounted && !user && (
              <>
                {/* Mobile View Receipt */}
                <Link
                  href="/receipt"
                  className="md:hidden text-gray-700 hover:text-green-600 font-medium transition-colors text-sm"
                >
                  View Receipt
                </Link>
                {/* Desktop nav */}
                <nav className="hidden md:flex gap-4 items-center">
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/receipt"
                    className="text-gray-700 hover:text-green-600 font-medium transition-colors"
                  >
                    View Receipt
                  </Link>
                </nav>
              </>
            )}
          </div>
          {/* Login/Signup buttons or Merchant Banner */}
          <div className="flex gap-2 items-center">
            {mounted && !user && (
              <>
                <Link href="/login">
                  <button className="border border-green-500 text-green-600 px-3 md:px-4 py-1.5 md:py-2 rounded hover:bg-green-50 transition-colors text-sm md:text-base">
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="bg-green-500 text-white px-3 md:px-4 py-1.5 md:py-2 rounded hover:bg-green-600 transition-colors text-sm md:text-base">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
            {/* Merchant Upgrade Banner - for users only */}
            {mounted && user && user.role === "User" && (
              <Link href="/merchant/convert">
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg px-3 py-2 cursor-pointer hover:shadow-md transition-all">
                  <Store className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-semibold text-gray-900">
                    Upgrade to Merchant
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                {/* Mobile version */}
                <div className="md:hidden bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-2 cursor-pointer hover:shadow-md transition-all">
                  <Store className="w-4 h-4 text-green-600" />
                </div>
              </Link>
            )}
            {/* Cashback Balance - for all users */}
            {mounted && user && profile && (
              <Link href="/cashback/history">
                <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 cursor-pointer hover:shadow-md transition-all">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">Cashback</span>
                    <span className="text-sm font-bold text-green-600">
                      ₦{profile.cashbackBalance.toLocaleString("en-NG", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
                {/* Mobile version */}
                <div className="md:hidden bg-green-50 border border-green-200 rounded-lg p-2 cursor-pointer hover:shadow-md transition-all">
                  <Store className="w-4 h-4 text-green-600" />
                </div>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
