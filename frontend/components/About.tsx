"use client";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiShield, FiStar, FiHome, FiUsers, FiMapPin, FiAward } from "react-icons/fi";

const stats = [
  { value: "200+", label: "Happy Guests" },
  { value: "15+", label: "Premium Suites" },
  { value: "2", label: "City Locations" },
  { value: "5.0", label: "Average Rating" },
];

const values = [
  {
    icon: <FiHome size={22} />,
    title: "Comfort First",
    description: "Every suite is thoughtfully furnished to feel like a home, not just a place to sleep. We obsess over the details so you don't have to.",
  },
  {
    icon: <FiShield size={22} />,
    title: "Trusted & Transparent",
    description: "No hidden fees, no surprises. From pricing to check-in, we keep everything clear and honest for every guest.",
  },
  {
    icon: <FiStar size={22} />,
    title: "Premium Quality",
    description: "We handpick every furnishing, amenity, and finish to ensure our suites meet a standard we'd want for ourselves.",
  },
  {
    icon: <FiUsers size={22} />,
    title: "Guest-Centered",
    description: "Our team is available around the clock. Whether it's a late check-in or a special request, we make it happen.",
  },
];

const team = [
  {
    name: "Amara Osei",
    role: "Founder & CEO",
    avatar: "/king.jpeg",
    bio: "Amara founded Seven Hills with a vision to redefine short-stay hospitality in West Africa.",
  },
  {
    name: "Chidi Nwaka",
    role: "Head of Operations",
    avatar: "/james.jpeg",
    bio: "Chidi ensures every suite is guest-ready and that our teams operate at their very best.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Guest Experience Lead",
    avatar: "/amara.jpeg",
    bio: "Fatima is dedicated to making every guest's stay memorable, personal, and seamless.",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function AboutPage() {
  return (
    <main className="bg-white">

      <section
        className="relative bg-[#F1F2F3] pt-20 pb-24 overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.p
            className="text-[#0057FF] font-semibold text-sm tracking-widest uppercase mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Story
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl md:text-[58px] font-semibold text-gray-900 leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            We Built the Stay<br className="hidden sm:block" /> We Always Wanted.
          </motion.h1>
          <motion.p
            className="text-[#475467] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Seven Hills Suites was born from a simple belief — that short-stay accommodation
            should feel luxurious, personal, and genuinely like home.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[#0057FF] font-semibold text-sm tracking-widest uppercase mb-4">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug tracking-tight mb-6">
              A hospitality company that puts guests first — every single time.
            </h2>
            <div className="space-y-4 text-[#475467] text-base leading-relaxed">
              <p>
                Founded in 2021, Seven Hills Suites operates fully-furnished, move-in-ready short-stay
                apartments across Makurdi and Kampala. We started with one suite and a relentless focus
                on quality. Today, we manage over 15 premium units and have hosted more than 200 happy guests.
              </p>
              <p>
                We believe the best hospitality is invisible — it just works. Clean spaces, fast Wi-Fi,
                responsive support, and a bed that actually feels good. No gimmicks. Just a great stay.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/apartments"
                className="flex items-center gap-2 px-5 py-3 bg-[#0057FF] text-white text-sm font-semibold rounded-xl hover:bg-[#0f53db] transition-colors"
              >
                Explore our suites <FiArrowRight size={15} />
              </Link>
              <Link
                href="/apartments"
                className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Book a stay
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <Image
              src="/seven1.png"
              alt="Seven Hills Suite interior"
              width={1200}
              height={800}
              className="w-full h-105 object-cover rounded-3xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white border border-gray-100 shadow-lg rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <FiMapPin className="text-[#0057FF]" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Locations</p>
                <p className="text-sm font-bold text-gray-900">Makurdi · Kampala</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#2B3037] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-sm text-gray-400 font-medium tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28 bg-[#F8F9FA]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[#0057FF] font-semibold text-sm tracking-widest uppercase mb-3">What Drives Us</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
              Our Core Values
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-[#0057FF] mb-4">
                  {v.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-[#475467] leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-[#0057FF] font-semibold text-sm tracking-widest uppercase mb-3">The People Behind It</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
              Meet Our Team
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                  />
                </div>
                <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-[#0057FF] font-medium mb-2">{member.role}</p>
                <p className="text-sm text-[#475467] leading-relaxed max-w-xs mx-auto">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards / Trust Strip */}
      <section className="bg-[#F1F2F3] py-10 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 text-center">
          {[
            { icon: <FiAward size={20} />, text: "Top Rated Short-Let 2024" },
            { icon: <FiShield size={20} />, text: "Verified & Insured Properties" },
            { icon: <FiStar size={20} />, text: "5.0 Stars · 200+ Reviews" },
          ].map((item, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-2 text-gray-600 font-medium text-sm"
            >
              <span className="text-[#0057FF]">{item.icon}</span>
              {item.text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-[42px] font-semibold text-gray-900 leading-snug tracking-tight mb-5">
              Ready for a Stay That<br />Feels Like Home?
            </h2>
            <p className="text-[#475467] text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Browse our available suites in Makurdi and Kampala. Move-in ready, fully furnished,
              and designed for comfort.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/apartments"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#0057FF] text-white text-base font-semibold rounded-xl hover:bg-[#0f53db] transition-colors w-full sm:w-auto justify-center"
              >
                Browse apartments <FiArrowRight size={16} />
              </Link>
              <Link
                href="/apartments"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#2B3037] text-white text-base font-semibold rounded-xl hover:bg-[#1e2329] transition-colors w-full sm:w-auto justify-center"
              >
                Book now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </main>
  );
}