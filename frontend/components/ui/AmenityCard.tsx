"use client";

import { motion } from "framer-motion";
import { Amenity } from "@/types/amenity";
import { cardVariants } from "@/animations/amenityVariants";

export default function AmenityCardAmenityCard({ title, description, highlight }: Amenity) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`rounded-2xl p-7 text-center flex flex-col gap-3 cursor-default ${
        highlight
          ? "bg-blue-600 shadow-lg shadow-blue-200"
          : "bg-white border border-gray-100 shadow-sm"
      }`}
    >
      <h3 className={`text-[17px] font-bold ${highlight ? "text-white" : "text-blue-500"}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${highlight ? "text-blue-100" : "text-gray-500"}`}>
        {description}
      </p>
    </motion.div>
  );
}