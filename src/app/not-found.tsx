"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ANIMATION_DURATION, NAV_LINKS } from "@/constants";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-center px-6">
      {/* Magnifier Animation */}
      <motion.div
        initial={{ y: -100, rotate: -30, opacity: 0 }}
        animate={{
          y: [0, -20, 0], // bounce effect
          rotate: [0, -15, 15, 0],
          opacity: 1,
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="mb-8"
      >
        <Search size={100} className="text-orange-500 drop-shadow-lg" />
      </motion.div>

      {/* Text */}
      <h1 className="text-6xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        404
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
        Halaman yang kamu cari tidak ditemukan.
      </p>

      {/* Navigation Links */}
      

      {/* Back Home */}
      <div className="mt-10">
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
