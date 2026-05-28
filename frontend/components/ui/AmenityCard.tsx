"use client";
import { motion } from "framer-motion";
import { Amenity } from "@/types/amenity";
import { cardVariants } from "@/animations/amenityVariants";
export default function AmenityCard({ title, description, highlight }: Amenity) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-[20px] py-6 px-5 text-center flex flex-col gap-5 cursor-default ${
        highlight
          ? "bg-[#0057FF] border-4 border-[#F2F4F7]"
          : "bg-white border-4 border-[#f2f4f7] shadow-sm"
      }`}
    >
      <h3 className={`text-[20px] font-semibold ${highlight ? "text-white" : "text-[#0057FF]"}`}>
        {title}
      </h3>
      <p className={`text-[16px] font-normal leading-relaxed ${highlight ? "text-white" : "text-[#475467]"}`}>
        {description}
      </p>
    </motion.div>
  );
}