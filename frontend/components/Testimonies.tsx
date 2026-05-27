"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/data/testimonial";
import StarRating from "./ui/StarRating";

export default function Testimonies() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">

        {/* Quote */}
        <div className="min-h-30 flex items-center justify-center mb-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              &ldquo;{testimonials[active].quote}&rdquo;
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Avatar + Name + Stars */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active + "-meta"}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Image
              src={testimonials[active].avatar}
              alt={testimonials[active].name} width={56} height={56}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            <p className="text-sm font-bold text-gray-900">{testimonials[active].name}</p>
            <StarRating rating={testimonials[active].rating} />
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === active
                  ? "w-5 h-2.5 bg-blue-500"
                  : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}