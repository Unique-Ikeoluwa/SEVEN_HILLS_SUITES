"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Gallery() {
  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 grid-rows-2 gap-5 relative min-h-145">

          {/* Top-right image */}
          <motion.div
            className="col-start-2 row-start-1 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop"
              alt="Apartment interior" width={1200} height={800}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Left tall image */}
          <motion.div
            className="col-start-1 row-start-1 row-span-2 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop"
              alt="Apartment interior" width={1200} height={800}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Centre text overlay — absolutely positioned over the grid */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center leading-tight max-w-sm"
              style={{ fontFamily: "Georgia, serif" }}>
              Thoughtfully furnished spaces where comfort meets contemporary living.
            </h2>
          </motion.div>

          {/* Bottom-right image */}
          <motion.div
            className="col-start-2 row-start-2 rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          >
            <Image
              src="https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&auto=format&fit=crop"
              alt="Apartment interior" width={1200} height={800}
              className="w-full h-full object-cover"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}