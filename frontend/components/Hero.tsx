"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gray-50 pt-16 pb-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <motion.div className="flex flex-col gap-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <h1 className="text-5xl xl:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight font-serif">
              Where Every Stay<br />Feels Like Home.
            </h1>
            <p className="text-gray-500 text-base leading-relaxed max-w-md">
              Powerful, self-serve product and growth analytics to help you convert, engage, and retain more.
            </p>
            <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="px-6 py-3.5 bg-[#1a1a2e] text-white text-[15px] font-semibold rounded-xl hover:bg-[#2d2d4e] transition-colors cursor-pointer">
                Explore accomodations
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} className="px-6 py-3.5 bg-blue-500 text-white text-[15px] font-semibold rounded-xl hover:bg-blue-600 transition-colors cursor-pointer">
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
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-sm font-bold text-gray-900 ml-1">5.0</span>
                </div>
                <p className="text-xs text-gray-500">from 200+ reviews</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right */}
          <motion.div className="relative" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
            <Image
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&auto=format&fit=crop"
              alt="Luxury apartment interior" width={1200} height={800}
              className="w-full h-125 object-cover rounded-2xl shadow-xl"
            />

            {/* Floating Card 1 */}
            <motion.div className="absolute -left-14 top-8 bg-white rounded-2xl shadow-xl p-4 flex gap-3 items-start max-w-67.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}>
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900 leading-snug">Find Homes Without the Runaround.</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Browse updated listings from real landlords and agents near you. No fake ads. No endless calls.</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div className="absolute -left-6 bottom-16 bg-white rounded-2xl shadow-xl p-4 flex gap-3 items-start max-w-67.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.7, ease: "easeOut" }}>
              <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900 leading-snug">List Properties. Get Seen. Fill Faster.</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Post your spaces in minutes and connect directly with serious renters—no middlemen, no delays.</p>
              </div>
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