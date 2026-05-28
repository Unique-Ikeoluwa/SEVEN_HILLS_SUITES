"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      {/* Navbar */}
      <nav className="bg-white/43 border border-[#C0C0C07D] h-15 sticky top-0 z-50">
        <div className="max-w-7xl justify-between mx-auto px-5 py-2.5 flex items-center shadow-black/10">
          <div className="flex items-center w-[527.3px] h-9.5 gap-21">
            <Link href="/" className="flex h-9.5 w-[64.31px] items-center">
              <Image src="/SevenHills.png" alt="SevenHills" width={80} height={50}/>
            </Link>
            <div className="hidden w-16.25 md:flex items-center gap-3 flex-1 justify-center">
              {["Home", "Apartments", "About Us", "Contact"].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase().replace(" ", "-")}`}
                  className="text-black p-2.5 text-[15px] font-normal hover:text-blue-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 h-10 w-55.5 shrink-0">
            <Link href="/apartments" className="px-4 py-2 bg-[#2B3037] text-white text-base font-medium rounded-xl hover:bg-[#050505] transition-colors">
                Explore
            </Link>
            <button className="px-4 py-2 bg-[#0057FF] text-white text-base font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
              Book now
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}     