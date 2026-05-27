import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export const containerVariants1: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export const containerVariants2: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const cardVariants1: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export const cardVariants2: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const expandVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08 },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.35, ease: "easeIn" },
  },
};

export const extraCardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.25 } },
};