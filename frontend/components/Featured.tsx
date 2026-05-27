"use client";

import { motion } from "framer-motion";
import { cardVariants1, containerVariants1 } from "@/animations/amenityVariants";
import { sideRooms, featuredRoom } from "@/data/featured";

export default function Featured() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Heading */}
        <motion.h2
          className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Featured Rooms
        </motion.h2>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={containerVariants1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {/* Large featured card */}
          <motion.div
            variants={cardVariants1}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
          >
            <div className="overflow-hidden">
              <img
                src={featuredRoom.image}
                alt={featuredRoom.label}
                className="w-full h-105 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="px-6 py-5">
              <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                {featuredRoom.label}
              </p>
              <p className="text-gray-400 text-sm mt-1">{featuredRoom.price}</p>
            </div>
          </motion.div>

          {/* Right column — two stacked cards */}
          <div className="flex flex-col gap-5">
            {sideRooms.map(({ label, price, image }, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants1}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
              >
                <div className="overflow-hidden">
                  <img
                    src={image}
                    alt={label}
                    className="w-full h-46.25 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-5 py-4">
                  <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase">
                    {label}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">{price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}