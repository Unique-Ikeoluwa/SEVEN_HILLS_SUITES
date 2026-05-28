"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants2, cardVariants2 } from "@/animations/amenityVariants";
import { apartments } from "@/data/apartments";
import { ApartmentType } from "@/types/apartment";
import { FaArrowRight } from "react-icons/fa6";
export default function Apartments() {
  const router = useRouter();
  const handleCardClick = (type: ApartmentType) => {
    router.push(`/apartments?type=${encodeURIComponent(type)}`);
  };
  return (
    <section className="bg-[#F1F2F3] py-15 overflow-hidden">
      <motion.div
        className="text-center p-6 mb-6"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="text-[#0057FF] font-semibold text-base mb-3 tracking-wide">Our Apartments</p>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#101828] tracking-tight">
          Find Your Perfect Stay
        </h2>
        <p className="text-[#475467] mt-4 font-normal text-lg md:text-[21px] max-w-3xl mx-auto leading-relaxed">
          From cozy studios to spacious furnished apartments, every unit is designed with your comfort in mind.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 px-6 max-w-7xl mx-auto overflow-x-auto pb-2"
        variants={containerVariants2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.div
          variants={cardVariants2}
          onClick={() => router.push("/apartments")}
          className="shrink-0 w-full sm:w-74.25 bg-[#0057FF] rounded-[20px] py-8 px-10 flex flex-col justify-between min-h-40 sm:min-h-55.75 cursor-pointer hover:bg-[#0f53db] transition-colors"
        >
          <div className="w-8 h-0.5 bg-[#E2E4E0] mb-4" />
          <div>
            <h3 className="text-white text-2xl font-extrabold leading-tight mb-6">
              Our<br />Apartments
            </h3>
            <div className="flex items-start gap-6 text-white/80 text-xs border-t border-white/20 pt-4">
              <div>
                <p className="font-semibold text-white text-[10px]">Furnished &</p>
                <p className="font-semibold text-white text-[10px]">Serviced</p>
              </div>
              <div className="w-px h-8 bg-white/30 shrink-0" />
              <div>
                <p className="text-[10px] text-white font-semibold leading-snug">Makurdi, Nigeria</p>
                <p className="text-[10px] font-semibold text-white leading-snug">Kampala, Uganda</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 flex-1">
          {apartments.map(({ label, type, image }) => (
            <motion.div
              key={label}
              variants={cardVariants2}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => handleCardClick(type)}
              className="relative flex-1 min-w-0 rounded-2xl overflow-hidden cursor-pointer group min-h-50"
            >
              <img src={image} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-5 left-0 right-0 px-4 py-2 flex items-end justify-between">
                <p className="text-white font-extrabold text-lg md:text-[24px] leading-snug">{label}</p>
                <div className="w-8 h-8 bg-white/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center shrink-0 group-hover:bg-white/40 transition-colors">
                  <FaArrowRight />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}