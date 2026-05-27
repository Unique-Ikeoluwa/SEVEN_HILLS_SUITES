"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { amenities, extraAmenities } from "@/data/amenities";
import AmenityCard from "@/components/ui/AmenityCard";
import { containerVariants, expandVariants, extraCardVariants } from "@/animations/amenityVariants";

export default function Whats() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <span className="inline-block border border-gray-300 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full mb-5">
            What&apos;s Included
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Everything You Need, Already Here
            </h2>
            <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto leading-relaxed">
            Every Seven Hills Suites apartment comes fully equipped. No extra charges, no chasing
            landlords. Just move in and live.
            </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div className="rounded-2xl overflow-hidden shadow-lg mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}>
            <Image
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop"
                alt="Seven Hills Suites property"
                width={1200}
                height={800}
                className="w-full h-120 object-cover"
            />
        </motion.div>

        {/* Base Amenities Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
            {amenities.map((amenity) => (
            <AmenityCard key={amenity.title} {...amenity} />
            ))}
        </motion.div>

        {/* Extra Amenities — animated expand */}
        <AnimatePresence>
          {expanded && (
            <motion.div key="extra-amenities" variants={expandVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5" variants={containerVariants}>
                    {extraAmenities.map((amenity) => (
                        <motion.div key={amenity.title} variants={extraCardVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="rounded-2xl p-7 text-center flex flex-col gap-3 cursor-default bg-white border border-gray-100 shadow-sm">
                            <h3 className="text-[17px] font-bold text-blue-500">{amenity.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-500">{amenity.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
            <motion.button onClick={() => setExpanded((prev) => !prev)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="text-gray-900 font-semibold text-[15px] inline-flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors">
            {expanded ? "Show less" : "View all amenities"}
                <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
                    <polyline points="6 9 12 15 18 9" />
                    <polyline points="6 15 12 21 18 15" />
                </motion.svg>
            </motion.button>
        </motion.div>
      </div>
    </section>
  );
}