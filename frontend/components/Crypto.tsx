"use client";

import { motion } from "framer-motion";

export default function Crypto() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <p className="text-sm mb-3">
                Yes, We{" "}
                <span className="text-blue-500 font-semibold">Accept Crypto</span>
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight max-w-2xl mx-auto leading-tight">
                We accept a range of cryptocurrencies so you can pay with what you already hold.
            </h2>
        </motion.div>
        <div className="relative flex items-center justify-center min-h-130">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[320, 440, 560].map((size) => (
                    <div key={size} className="absolute rounded-full border border-blue-100" style={{ width: size, height: size }} />
                ))}
            </div>
            <motion.div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-3 text-right"
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">Instant & Borderless</p>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-40 ml-auto">
                        No transfer delays, no bank fees, no stress
                    </p>
                </div>
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </div>
            </motion.div>
            <motion.div className="relative z-10" initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
                <div className="relative w-60 h-122.5 bg-gray-900 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-gray-700">
                    <div className="w-full h-full bg-linear-to-b from-blue-50 to-white rounded-[36px] overflow-hidden flex items-center justify-center relative">
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full" />
                        <div className="flex flex-col items-center gap-1 mt-6">
                            <div className="flex items-center gap-1">
                                <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 18L7 6L12 14L17 9L21 18" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="5" r="2.5" fill="#ec4899" />
                                    </svg>
                                </div>
                                <div className="flex flex-col leading-none ml-1">
                                    <span className="text-[11px] font-bold text-[#1a1a2e] font-serif">Seven</span>
                                    <span className="text-[11px] font-bold text-blue-500 font-serif">Hills</span>
                                    <span className="text-[9px] text-gray-400 font-serif">Suites</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <motion.div className="absolute -right-6 top-1/3 w-14 h-14 bg-linear-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-200 z-20"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <span className="text-white font-extrabold text-xl">₿</span>
                    </motion.div>
                    <motion.div className="absolute -left-5 top-1/2 w-10 h-10 bg-linear-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-200 z-20"
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                        <span className="text-white font-extrabold text-sm">Ξ</span>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div className="absolute right-0 bottom-1/3 flex items-center gap-3"
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            >
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                        <rect x="3" y="3" width="18" height="18" rx="3" />
                        <path d="M9 9h6M9 12h6M9 15h4" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900">Scale and support</p>
                    <p className="text-xs text-gray-500 mt-0.5 max-w-45">
                        Prefer to pay traditionally? Fiat payment options are also available.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}