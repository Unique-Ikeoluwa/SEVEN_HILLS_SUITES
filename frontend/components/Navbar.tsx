"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M3 18L7 6L12 14L17 9L21 18" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="5" r="2.5" fill="#ec4899" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold text-[#1a1a2e] font-serif">Seven</span>
              <span className="text-[13px] font-bold text-blue-500 font-serif">Hills</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {["Home", "Apartments", "About Us", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-gray-600 text-[15px] font-medium hover:text-blue-500 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link href="/apartments" className="px-5 py-2.5 bg-[#1a1a2e] text-white text-sm font-semibold rounded-lg hover:bg-[#2d2d4e] transition-colors">
                Explore
            </Link>
            <button className="px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
              Book now
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}     