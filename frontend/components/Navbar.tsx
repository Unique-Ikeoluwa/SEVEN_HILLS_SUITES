"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      router.push("/");
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Apartments", path: "/apartments" },
    { name: "About Us", path: "/about-us" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className="bg-white/43 border border-[#C0C0C07D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex md:hidden h-9.5 w-[64.31px] items-center shrink-0">
              <Image src="/SevenHills.png" alt="SevenHills" width={80} height={50} />
            </Link>
          <div className="hidden md:flex gap-20">
            <Link href="/" className="flex h-9.5 w-[64.31px] items-center shrink-0">
              <Image src="/SevenHills.png" alt="SevenHills" width={80} height={50} />
            </Link>
            <div className="hidden justify-center md:flex items-center gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-black p-2.5 text-[15px] font-normal hover:text-[#0057FF] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 h-10 shrink-0">
            <Link href="/apartments" className="px-4 py-2 bg-[#2B3037] text-white text-base font-medium rounded-xl hover:bg-[#050505] transition-colors">
              Explore
            </Link>
            {isAuthenticated ? (
              <button onClick={handleAuthAction} className="px-4 py-2 bg-[#0057FF] text-white text-base font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-4 py-2 bg-[#0057FF] text-white text-base font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
                Login
              </Link>
            )}  
          </div>
          <button
            className="md:hidden text-gray-700 p-2"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-5 pb-5 flex flex-col gap-3">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMenuOpen(false)}
                className="text-black py-2 text-[15px] font-normal hover:text-[#0057FF] transition-colors"
              >
                {item.name}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link href="/apartments" onClick={() => setMenuOpen(false)} className="flex-1 text-center px-4 py-2 bg-[#2B3037] text-white text-base font-medium rounded-xl hover:bg-[#050505] transition-colors">
                Explore
              </Link>
              {isAuthenticated ? (
                <button onClick={handleAuthAction} className="flex-1 px-4 py-2 bg-[#0057FF] text-white text-base font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
                  Logout
                </button>
              ) : (
                <Link href="/login" className="flex-1 px-4 py-2 bg-[#0057FF] text-white text-base font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}