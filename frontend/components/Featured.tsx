"use client";
import { motion } from "framer-motion";
import { cardVariants1, containerVariants1 } from "@/animations/amenityVariants";
import { sideRooms, featuredRoom } from "@/data/featured";
import Image from "next/image";
export default function Featured() {
  return (
    <section className="bg-[#F1F2F3] py-24">
      <div className="max-w-7xl mx-auto px-8">
        <motion.h2
          className="text-3xl md:text-[40px] font-semibold text-[#121316] tracking-tight mb-8"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          >
          Featured Rooms
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-5 md:max-h-186"
          variants={containerVariants1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          >
          <motion.div
            variants={cardVariants1}
            whileHover={{ y: -4, transition: { duration: 0.25 } }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer group"
            >
            <div className="overflow-hidden">
              <Image src="/bigroom.jpg" alt={featuredRoom.label} width={856} height={98} className="h-64 md:h-161.5 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="px-4 py-6 gap-2 text-center">
              <p className="text-[16px] font-medium tracking-widest text-[#424242] uppercase">
                {featuredRoom.label}
              </p>
              <p className="text-[#757575] text-sm mt-1">{featuredRoom.price}</p>
            </div>
          </motion.div>
          <div className="flex flex-col gap-4 md:gap-11.75">
            {sideRooms.map(({ label, price }, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants1}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer group"
                >
                <div className="overflow-hidden">
                  <Image src="/room.jpg" alt={label} width={380} height={98} className="w-full h-48 md:h-62.5 object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="px-4 py-6 gap-2 text-center">
                  <p className="text-[16px] font-medium tracking-widest text-[#424242] uppercase">
                    {label}
                  </p>
                  <p className="text-[#757575] text-sm mt-1">{price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}