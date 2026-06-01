"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { MdSavedSearch } from "react-icons/md";
import { FiHome, FiSearch } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);
    if (value && value !== "Apartments type") {
      router.push(`/apartments?type=${encodeURIComponent(value)}`);
    }
  };
  const handleSearch = () => {
    if (searchQuery.trim().length < 3) return;
    router.push(`/apartments?search=${encodeURIComponent(searchQuery.trim())}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };
  return (
    <>
      <section className="bg-gray-50 pt-10 md:pt-16 pb-16 md:pb-28" style={{
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.04) 2px, transparent 2px)",
        backgroundSize: "28px 28px",
      }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div className="flex flex-col gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight">
              Where Every Stay<br />Feels Like Home.
            </h1>
            <p className="text-[#475467] text-lg md:text-xl font-normal leading-relaxed max-w-md">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p>
            <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
              <motion.a href="/apartments" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 bg-[#2B3037] text-white text-lg md:text-[20px] font-medium rounded-xl w-full sm:w-64 h-14 hover:bg-[#2d2d4e] transition-colors cursor-pointer">
                Explore accomodations
              </motion.a>
              <motion.a href="/apartments" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 bg-[#0057FF] text-white text-lg md:text-[20px] font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
                Book now
              </motion.a>
            </motion.div>
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <div className="flex">
                {[11, 12, 13, 14, 15].map((i, idx) => (
                  <Image key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt="reviewer" width={1200} height={800}
                    className={`w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ${idx !== 0 ? "-ml-2" : ""}`}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex h-5 items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#FEC84B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-base font-semibold text-[#344054]">5.0</span>
                </div>
                <p className="text-sm font-medium text-[#475467]">from 200+ reviews</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div className="relative hidden lg:block" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <Image src="/seven.jpg" alt="Luxury apartment interior" width={1200} height={800} className="w-148 min-w-120 h-160 object-cover" />
            <motion.div className="absolute -left-43.5 top-3.5 bg-white/43 border border-white rounded-4xl p-3 flex-col gap-2.5 max-w-82.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}>
              <div className="flex gap-3 py-2 items-center">
                <MdSavedSearch size={30} />
                <p className="text-[12px] font-bold text-black leading-snug">Find Homes Without the Runaround.</p>
              </div>
              <p className="text-[12px] font-light text-black mt-1 leading-relaxed">Browse updated listings from real landlords and agents near you. No fake ads. No endless calls.</p>
            </motion.div>
            <motion.div className="absolute left-px top-36 bg-white/43 border border-white rounded-4xl p-3 flex-col gap-2.5 max-w-82.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}>
              <div className="flex gap-3 py-2 items-center">
                <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <p className="text-[12px] font-bold text-black leading-snug">List Properties. Get Seen. Fill Faster.</p>
              </div>
              <p className="text-[12px] font-light text-black mt-1 leading-relaxed">Post your spaces in minutes and connect directly with serious renters—no middlemen, no delays.</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div className="max-w-xl mx-auto mt-10 md:mt-14 px-4 md:px-0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}>
          <div className="bg-white border border-[#D9D9D9] rounded-[10px] flex items-center px-3 md:px-7.5 py-3 shadow-md gap-2">
            <div className="flex items-center gap-2 shrink-0">
              <FiHome className="text-[#050810] shrink-0" />
              <select value={selectedType} onChange={handleSelectChange} className="border-none outline-none text-sm md:text-base text-[#737579] bg-transparent font-medium cursor-pointer w-auto">
                <option value="">Apartments type</option>
                <option value="Studio">Studio</option>
                <option value="1 Bedroom">1 Bedroom</option>
                <option value="2 Bedrooms">2 Bedrooms</option>
                <option value="Furnished and serviced">Furnished &amp; Serviced</option>
              </select>
            </div>
            <div className="w-px h-7 bg-gray-200 shrink-0" />
            <input type="text" placeholder="Search apartments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} className="text-sm md:text-base text-[#737579] flex-1 outline-none bg-transparent placeholder-[#737579] min-w-0 w-0" />
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleSearch}
              disabled={searchQuery.trim().length > 0 && searchQuery.trim().length < 3}
              className="flex items-center gap-1.5 px-3 md:px-4 py-2 bg-[#0057FF] text-white text-base md:text-[20px] font-medium rounded-xl hover:bg-[#0f53db] transition-colors shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSearch />
              <span className="hidden sm:inline">Search</span>
            </motion.button>
          </div>
          {searchQuery.length > 0 && searchQuery.length < 3 && (
            <p className="text-xs text-gray-400 mt-2 text-center">Type at least 3 characters to search</p>
          )}
        </motion.div>
      </section>
    </>
  );
}