"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function ImageGallery({ images }: { images: string[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  const visibleCount = 3;

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  const thumbPrev = () => setThumbStart((s) => Math.max(0, s - 1));
  const thumbNext = () => setThumbStart((s) => Math.min(images.length - visibleCount, s + 1));

  return (
    <div className="mb-8">
      <div className="relative rounded-2xl overflow-hidden mb-4 h-56 sm:h-80 md:h-105 bg-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx} src={images[activeIdx]} alt={`Apartment view ${activeIdx + 1}`}
            className="w-full h-full object-cover" initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:hidden flex items-center justify-center rounded-full bg-white/80 text-gray-700 shadow"
          >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:hidden flex items-center justify-center rounded-full bg-white/80 text-gray-700 shadow"
          >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={thumbPrev}
          disabled={thumbStart === 0}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-blue-400 hover:text-[#0057FF] disabled:opacity-30 transition-colors"
          >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className="flex gap-3 flex-1 overflow-hidden">
          {images.slice(thumbStart, thumbStart + visibleCount).map((img, i) => {
          const realIdx = thumbStart + i;
            return (
              <button
                key={realIdx}
                onClick={() => setActiveIdx(realIdx)}
                className={`flex-1 h-24 sm:h-30 rounded-xl overflow-hidden border-2 transition-all ${
                activeIdx === realIdx ? "border-[#0057FF] opacity-100" : "border-transparent opacity-70 hover:opacity-90"
                }`}
                >
                <img src={img} alt={`Thumb ${realIdx + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
        <button
          onClick={thumbNext}
          disabled={thumbStart + visibleCount >= images.length}
          className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 transition-colors"
          >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div className="flex sm:hidden justify-center gap-1.5 mt-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-300 ${i === activeIdx ? "w-4 h-1.5 bg-[#0057FF]" : "w-1.5 h-1.5 bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
}