"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { amenities, extraAmenities } from "@/data/amenities";
import AmenityCard from "@/components/ui/AmenityCard";
import { containerVariants, expandVariants, extraCardVariants } from "@/animations/amenityVariants";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

export default function Whats() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut" }}>
          <span className="inline-block bg-[#0057ff]/10 border border-[#0057ff] text-[#0057ff] text-base font-medium px-3 py-1 rounded-full mb-5">
            What&apos;s Included
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            Everything You Need, Already Here
          </h2>
          <p className="text-[#475467] mt-4 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Every Seven Hills Suites apartment comes fully equipped. No extra charges, no chasing
            landlords. Just move in and live.
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden mb-16 relative rounded-[20px] md:rounded-[30px]"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}>
          <Image src="/seven1.png" alt="Seven Hills Suites property"
            width={1280} height={800} className="w-full rounded-[20px] md:rounded-[30px] h-56 sm:h-80 md:h-152 object-cover"
          />
          <div className="absolute inset-0 rounded-[20px] md:rounded-[30px] bg-[#003499]/35 pointer-events-none" />
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-15 px-0 md:px-10" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}>
          {amenities.map((amenity) => (
            <AmenityCard key={amenity.title} {...amenity} />
          ))}
        </motion.div>

        <AnimatePresence>
          {expanded && (
            <motion.div key="extra-amenities" variants={expandVariants} initial="hidden" animate="visible" exit="exit" className="overflow-hidden">
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-15 mt-10 md:mt-15 px-0 md:px-10" variants={containerVariants}>
                {extraAmenities.map((amenity) => (
                  <motion.div key={amenity.title} variants={extraCardVariants} whileHover={{ y: -3, transition: { duration: 0.2 } }} className="rounded-[20px] py-6 px-5 text-center flex flex-col gap-5 cursor-default bg-white border-4 border-[#f2f4f7] shadow-sm">
                    <h3 className="text-[20px] font-semibold text-[#0057ff]">{amenity.title}</h3>
                    <p className="text-base font-normal leading-relaxed text-[#475467]">{amenity.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="text-center mt-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
          <motion.button onClick={() => setExpanded((prev) => !prev)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="text-black font-medium text-[20px] inline-flex items-center gap-2 cursor-pointer hover:text-[#0057ff] transition-colors">
            {expanded ? "Show less" : "View all amenities"}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3, ease: "easeInOut" }}>
              <MdKeyboardDoubleArrowDown />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}