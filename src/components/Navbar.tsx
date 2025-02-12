"use client";

import Link from "next/link";
import CartButton from "./CartButton";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-100 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">💝</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary-600">
                Sugi Creation
              </span>
              <span className="text-xs text-primary-500">
                Jewelry Collection
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/products"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              Categories
            </Link>
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center"
            >
              <input
                type="search"
                placeholder="Search products..."
                className="px-4 py-1 rounded-full bg-white border border-primary-200 text-primary-900 placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="p-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
            <CartButton />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-primary-200">
        <div className="flex justify-around py-2">
          <Link
            href="/products"
            className="flex flex-col items-center p-2 text-primary-600 hover:text-primary-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-xs mt-1">Shop</span>
          </Link>
          <Link
            href="/categories"
            className="flex flex-col items-center p-2 text-primary-600 hover:text-primary-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-xs mt-1">Categories</span>
          </Link>
          <button
            onClick={() => document.getElementById("mobileSearch")?.focus()}
            className="flex flex-col items-center p-2 text-primary-600 hover:text-primary-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs mt-1">Search</span>
          </button>
        </div>
        <form onSubmit={handleSearch} className="px-4 pb-2">
          <input
            id="mobileSearch"
            type="search"
            placeholder="Search products..."
            className="w-full px-4 py-2 rounded-full bg-white border border-primary-200 text-primary-900 placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </nav>
  );
}
