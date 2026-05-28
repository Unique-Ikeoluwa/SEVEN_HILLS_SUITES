"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MdSavedSearch } from "react-icons/md";


export default function Hero() {
  return (
    <>
      <section className="bg-gray-50 pt-16 pb-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div className="flex flex-col gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <h1 className="text-5xl xl:text-6xl font-semibold text-gray-900 leading-[1.1] tracking-tight font-serif">
              Where Every Stay<br />Feels Like Home.
            </h1>
            <p className="text-[#475467] text-xl font-normal leading-relaxed max-w-md">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p>
            <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 bg-[#2B3037] text-white text-[20px] font-medium rounded-xl w-64 h-14 hover:bg-[#2d2d4e] transition-colors cursor-pointer">
                Explore accomodations
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 bg-[#0057FF] text-white text-[20px] font-medium rounded-xl hover:bg-[#0f53db] transition-colors cursor-pointer">
                Book now
              </motion.button>
            </motion.div>
            <motion.div className="flex items-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <div className="flex">
                {[11, 12, 13, 14, 15].map((i, idx) => (
                  <Image
                    key={i}
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="reviewer" width={1200} height={800}
                    className={`w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm ${idx !== 0 ? "-ml-2" : ""}`}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex h-5 w-29 items-center gap-1">
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

          <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <Image
              src="/seven.jpg"
              alt="Luxury apartment interior" width={1200} height={800}
              className="w-148 min-w-120 h-160 object-cover"
            />

            <motion.div className="absolute -left-43.5 top-3.5 bg-white/43 border border-white rounded-4xl p-3 flex-col gap-2.5 max-w-82.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}>
              <div className="flex gap-3 py-2 items-center">
                <MdSavedSearch size={30}/>
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

        {/* Search Bar */}
        <motion.div className="max-w-xl mx-auto px-6 mt-14" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}>
          <div className="bg-white border border-gray-200 rounded-2xl flex items-center px-4 py-2 shadow-md gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <select className="border-none outline-none text-sm text-gray-700 bg-transparent font-medium cursor-pointer">
                <option>Apartments type</option>
                <option>Studio</option>
                <option>1 bedroom</option>
                <option>2 bedrooms</option>
                <option>3 bedrooms</option>
              </select>
            </div>
            <div className="w-px h-7 bg-gray-200 shrink-0" />
              <input type="text" placeholder="1 bedroom" className="text-sm text-gray-700 flex-1 outline-none bg-transparent placeholder-gray-400 min-w-0"/>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors shrink-0 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Search
              </motion.button>
          </div>
        </motion.div>
      </section>
    </>
  );
}