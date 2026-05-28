"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Gallery() {
  return (
    <section className="bg-white py-20">
      <div className="">
        <div className="md:hidden flex flex-col gap-4 px-4">
          <motion.h2
          className="text-3xl font-normal text-black text-center mb-2"
          style={{ fontFamily: "Georgia, serif" }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          >
          Thoughtfully furnished spaces where comfort meets contemporary living.
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}>
            <Image src="/seven.jpg" alt="Apartment interior" width={1200} height={800} className="w-full h-56 rounded-2xl object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}>
            <Image src="/seven.jpg" alt="Apartment interior" width={1200} height={800} className="w-full h-56 rounded-2xl object-cover" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}>
            <Image src="/seven.jpg" alt="Apartment interior" width={1200} height={800} className="w-full h-56 rounded-2xl object-cover" />
          </motion.div>
        </div>
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-5 relative min-h-275">
          <motion.div
            className="absolute top-24 left-163"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            >
            <Image
              src="/seven.jpg"
              alt="Apartment interior" width={1200} height={800}
              className="w-175 h-69.5 rounded-[20px] object-cover"
            />
          </motion.div>
          <motion.div
            className="top-107.25 absolute"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut", delay: 0.2 }}
          >
            <Image
              src="/seven.jpg"
              alt="Apartment interior" width={1200} height={800}
              className="w-102.75 h-85.75 rounded-[30px] object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute w-179 h-62.25 top-91 left-84.25 pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            >
            <h2 className="text-4xl md:text-[62px] font-normal text-black text-center"
              style={{ fontFamily: "Georgia, serif" }}>
              Thoughtfully furnished spaces where comfort meets contemporary living.
            </h2>
          </motion.div>
          <motion.div
            className="absolute top-153.25 left-163.5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            >
            <Image
              src="/seven.jpg"
              alt="Apartment interior" width={1200} height={800}
              className="w-220 h-97.75 rounded-[20px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}