"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants2, cardVariants2 } from "@/animations/amenityVariants";
import { apartments } from "@/data/apartments";
import { ApartmentType } from "@/types/apartment";
import Link from "next/link";

export default function Apartments() {
  const router = useRouter();

  const handleCardClick = (type: ApartmentType) => {
    router.push(`/apartments?type=${encodeURIComponent(type)}`);
  };

  return (
    <Link href="/apartments" className="bg-gray-100 py-20 overflow-hidden">
      {/* Header */}
      <motion.div
        className="text-center mb-12 px-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-blue-500 font-semibold text-sm mb-3 tracking-wide">Our Apartments</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Find Your Perfect Stay
        </h2>
        <p className="text-gray-500 mt-4 text-base max-w-xl mx-auto leading-relaxed">
          From cozy studios to spacious furnished apartments, every unit is designed with your comfort in mind.
        </p>
      </motion.div>

      {/* Cards Row */}
      <motion.div
        className="flex gap-4 px-6 max-w-7xl mx-auto"
        variants={containerVariants2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {/* Blue info card — navigates to all apartments */}
        <motion.div
          variants={cardVariants2}
          onClick={() => router.push("/apartments")}
          className="shrink-0 w-55 bg-blue-600 rounded-2xl p-6 flex flex-col justify-between min-h-50 cursor-pointer hover:bg-blue-700 transition-colors"
        >
          <div className="w-8 h-0.5 bg-white/60 mb-4" />
          <div>
            <h3 className="text-white text-2xl font-bold leading-tight mb-6">
              Our<br />Apartments
            </h3>
            <div className="flex items-start gap-3 text-white/80 text-xs border-t border-white/20 pt-4">
              <div>
                <p className="font-semibold text-white text-[11px]">Furnished &</p>
                <p className="font-semibold text-white text-[11px]">Serviced</p>
              </div>
              <div className="w-px h-8 bg-white/30 shrink-0" />
              <div>
                <p className="text-[11px] leading-snug">Makurdi, Nigeria</p>
                <p className="text-[11px] leading-snug">Kampala, Uganda</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Apartment type cards */}
        {apartments.map(({ label, type, image }) => (
          <motion.div
            key={label}
            variants={cardVariants2}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => handleCardClick(type)}
            className="relative flex-1 min-w-0 rounded-2xl overflow-hidden cursor-pointer group min-h-50"
          >
            <img
              src={image}
              alt={label}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
              <p className="text-white font-bold text-[15px] leading-snug">{label}</p>
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </Link>
  );
}