"use client";

import { motion } from "framer-motion";
import { BookOpen, Github, User, Code2, Lock, Sparkles, NotebookPenIcon, NotebookPen } from "lucide-react";
import { CHANGELOG } from "@/constants/changelog";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 px-6 py-16 overflow-hidden">
      {/* Floating background elements */}
      <motion.div
        className="absolute top-16 left-10 w-24 h-24 rounded-full bg-orange-500/20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-24 right-12 w-32 h-32 rounded-full bg-slate-400/20"
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-orange-400/30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <BookOpen size={40} className="text-orange-500" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Documentation
          </h1>
        </div>

        {/* Main Docs container */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg bg-white dark:bg-slate-900 p-8 space-y-8">
          {/* Features */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              <Sparkles className="text-orange-500" /> Features
            </h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Bitcoin wallet with mempool integration</li>
              <li>Transaction and block explorer</li>
              <li>Responsive design with dark mode</li>
              <li>Seamless animations and floating UI elements</li>
              <li>Local browser storage for privacy</li>
            </ul>
          </div>

          {/* Author */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              <User className="text-orange-500" /> Author
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Built with ❤️ by <span className="font-semibold">Irfan Works</span>
            </p>
          </div>

          {/* Built With */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              <Code2 className="text-orange-500" /> Built With
            </h2>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-2">
              <li>Next.js + TypeScript</li>
              <li>TailwindCSS + shadcn/ui</li>
              <li>Framer Motion</li>
              <li>Lucide React Icons</li>
            </ul>
          </div>

          {/* Privacy */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-800/40">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">
              <Lock className="text-orange-500" /> Privacy
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              No personal data is stored on servers. Everything is saved locally
              in your browser for maximum privacy and control.
            </p>
          </div>
        </div>

        {/* Changelog */}
        <section className="mt-16">
        <div className="flex items-center justify-center gap-3 mb-10">
          <NotebookPen size={40} className="text-orange-500" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Changelog
          </h1>
        </div>
          <div className="relative pl-8">
            {/* Timeline line */}
            <div className="absolute top-0 left-3 bottom-0 w-1 bg-slate-200 dark:bg-slate-700 rounded-full" />

            {/* Items */}
            <div className="space-y-8">
              {CHANGELOG.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md p-6"
                >
                  {/* Dot on timeline */}
                  <div className="absolute -left-6 top-6 w-4 h-4 rounded-full bg-orange-500 border-2 border-white dark:border-slate-900 shadow" />

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-orange-500">
                      v{log.version}
                    </h3>
                    <span className="text-sm text-slate-500">{log.date}</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                    {log.changes.map((c, j) => (
                      <li key={j}>{c}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* GitHub link */}
        <div className="flex justify-center pt-14">
          <Link
            href="https://github.com/IrfanNha/seamless-wallet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors"
          >
            <Github size={20} />
            View on GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
