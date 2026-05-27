"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { socialLinks } from "@/data/socialLinks";
import { navLinks } from "@/constants/navigation";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <motion.div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-start justify-between gap-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="shrink-0">
          <div className="flex items-end gap-3">
            <div className="relative w-32 h-20">
              <div className="absolute bottom-0 left-0 w-14 h-16 bg-pink-500 rounded-tr-3xl rounded-br-sm" style={{ clipPath: "polygon(0 100%, 100% 60%, 100% 100%)" }} />
              <div className="absolute bottom-0 left-4 w-14 h-20 bg-blue-400 rounded-t-2xl" style={{ clipPath: "polygon(30% 0%, 100% 30%, 100% 100%, 0% 100%)" }} />
              <div className="absolute bottom-1 left-2 text-white font-black text-4xl leading-none z-10 select-none">7</div>
            </div>
            <div className="mb-1">
              <p className="text-3xl font-bold text-blue-500 leading-none font-serif">Seven</p>
              <p className="text-3xl font-bold text-pink-500 leading-none font-serif">Hills</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-400 tracking-widest">Suites</p>
                <div className="flex-1 h-px bg-gray-300 w-16" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-600 text-sm font-medium hover:text-blue-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-3">Contact</p>
            <p className="text-sm text-gray-500 mb-1">sevenhill@gmail.com</p>
            <p className="text-sm text-gray-500">+234 99100099912</p>
          </div>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© 2026 Seven Hills Suites. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {["Terms", "Privacy", "Cookies"].map((item) => (
              <Link key={item} href="#" className="hover:text-gray-700 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}