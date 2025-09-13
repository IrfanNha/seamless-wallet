'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { Wallet, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { APP_CONFIG, NAV_LINKS, MOTIONS } from "@/constants";
import ThemeDropdown from "../common/ThemeDropdown";

export const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      variants={MOTIONS.NAVBAR}
      initial="hidden"
      animate="visible"
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-700"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="w-7 h-7 text-orange-600 dark:text-orange-500" />
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              {APP_CONFIG.APP_NAME}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              by Irfan Works
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-3">
          {Object.values(NAV_LINKS).map((link) => (
            <Button
              key={link.name}
              asChild
              variant="ghost"
              className="text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Link href={link.href}>{link.name}</Link>
            </Button>
          ))}
          <ThemeDropdown />
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeDropdown />

          <button
            onClick={() => setOpen(!open)}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {open ? (
              <X className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <motion.div
          variants={MOTIONS.MOBILE_MENU}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
        >
          <div className="flex flex-col px-4 py-3 space-y-2">
            {Object.values(NAV_LINKS).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
