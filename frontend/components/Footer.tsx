"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { socialLinks } from "@/data/socialLinks";
import { navLinks } from "@/constants/navigation";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <motion.div
        className="max-w-6xl mx-auto px-6 py-16 md:py-2 md:px-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-12 md:gap-0"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="shrink-0">
          <Image
            src="/SevenHills.png"
            alt="SevenHills"
            width={435}
            height={249}
            className="object-contain"
          />
        </div>
        <div className="hidden md:block self-stretch w-px bg-gray-200 mx-12" />
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-wrap gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-700 text-[15px] font-medium hover:text-blue-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="text-[24px] font-bold tracking-widest text-gray-900 uppercase mb-4">
              Contact
            </p>
            <p className="text-base text-gray-500 mb-2">sevenhill@gmail.com</p>
            <p className="text-base text-gray-500">+234 99100099912</p>
          </div>
          <div className="flex items-center gap-5">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-400 hover:text-gray-900 transition-colors [&>svg]:w-6 [&>svg]:h-6"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-14 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-base text-gray-400">
          <p>© 2026 Seven Hills Suites. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="hover:text-gray-700 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}