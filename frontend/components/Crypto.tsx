"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { BsVectorPen } from "react-icons/bs";
import { LiaHashtagSolid } from "react-icons/lia";

export default function Crypto() {
    return (
        <section className="bg-white py-24 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div className="text-center text-black mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
                    <p className="text-base font-medium mb-3">
                        Yes, We{" "}
                        <span className="text-[#0057ff]">Accept Crypto</span>
                    </p>
                    <h2 className="text-3xl md:text-[40px] font-medium tracking-tight max-w-4xl mx-auto leading-tight">
                        We accept a range of cryptocurrencies so you can pay with what you already hold.
                    </h2>
                </motion.div>
                <div className="relative flex flex-col items-center justify-center gap-10 md:gap-0 md:min-h-130">
                    <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
                        {[380, 460, 540].map((size) => (
                        <div key={size} className="absolute rounded-full border-3 border-[#0193C8]/20" style={{ width: size, height: size }} />
                        ))}
                    </div>
                    <motion.div className="flex items-center gap-3 text-right md:absolute md:left-1/34 md:top-1/3 md:-translate-y-1/2"
                        initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        >
                        <div className="text-right">
                            <p className="text-xl font-medium text-black">Instant & Borderless</p>
                            <p className="text-base text-black/60 font-normal max-w-52.25">
                                No transfer delays, no bank fees, no stress
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-[#0057ff] rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                            <BsVectorPen className="text-white text-2xl rotate-180" />
                        </div>
                    </motion.div>
                    <motion.div className="relative z-10" initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}>
                        <div className="relative w-60 h-122.5 bg-gray-900 rounded-[44px] p-2.5 shadow-2xl ring-1 ring-gray-700">
                            <div className="w-full h-full bg-linear-to-b from-blue-50 to-white rounded-[36px] overflow-hidden flex items-center justify-center relative">
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full" />
                                <div className="flex flex-col items-center gap-1 mt-6">
                                    <div className="shadow-lg shadow-blue-100">
                                        <Image src="/SevenHills.png" alt="logo" width={220} height={160} />
                                    </div>
                                </div>
                            </div>
                            <motion.div className="absolute -right-14 top-1/3 rotate-[-15deg] flex items-center justify-center z-20"
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                                >
                                <Image src="/btc.png" alt="btc" width={130} height={130} />
                            </motion.div>
                            <motion.div className="absolute -left-15 top-1/3 rotate-15 blur-[2px] -z-2"
                                animate={{ y: [0, 6, 0] }}
                                transition={{ duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                                >
                                <Image src="/coin.png" alt="coin" width={130} height={130} />
                            </motion.div>
                        </div>
                    </motion.div>
                    <motion.div className="flex items-center gap-3 md:absolute md:right-18 md:bottom-1/6"
                        initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}>
                        <div className="w-12 h-12 bg-[#0057ff] rounded-full flex items-center justify-center shrink-0 shadow-md shadow-blue-200">
                            <LiaHashtagSolid className="text-white text-2xl"/>
                        </div>
                        <div>
                            <p className="text-xl font-medium text-black">Scale and support</p>
                            <p className="text-base text-black/60 font-normal max-w-52.25">
                                Prefer to pay traditionally? Fiat payment options are also available.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}