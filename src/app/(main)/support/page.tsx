"use client";

import { motion } from "framer-motion";
import { Wallet, Bitcoin } from "lucide-react";
import Link from "next/link";
import { WALLET_INFO, COLORS } from "@/constants";

export default function SupportPage() {
  const mempoolUrl = `https://mempool.space/address/${WALLET_INFO.BTC_ADDRESS}`;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16 overflow-hidden">
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-20 h-20 rounded-full bg-orange-500/20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-16 w-32 h-32 rounded-full bg-slate-400/20"
        animate={{ y: [0, 15, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-orange-400/30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 max-w-xl text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Wallet size={40} className="text-orange-500" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Support This Project
          </h1>
        </div>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Jika kamu merasa project ini bermanfaat, kamu bisa mendukung dengan
          donasi BTC. Transparansi transaksi dapat dilihat langsung melalui
          mempool.
        </p>

        {/* BTC Address Card */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 mb-8"
        >
          <div className="flex flex-col items-center space-y-4">
            <Bitcoin size={36} className="text-orange-500" />
            <p className="text-sm text-slate-500">BTC Address</p>
            <Link
              href={mempoolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm sm:text-base break-all text-slate-900 dark:text-slate-100 hover:text-orange-500 transition-colors"
            >
              {WALLET_INFO.BTC_ADDRESS}
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            href={mempoolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors"
          >
            Donasi via Mempool
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
