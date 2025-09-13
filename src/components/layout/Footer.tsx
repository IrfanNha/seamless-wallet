'use client';

import Link from "next/link";
import { Github } from "lucide-react";
import { APP_CONFIG, NAV_LINKS } from "@/constants";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Made With <span className="text-red-500">❤️</span> By{" "}
            <span className="font-semibold">Irfan Works</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            {APP_CONFIG.APP_NAME} v{APP_CONFIG.VERSION}
          </p>
        </div>

        {/* Middle: Navigation */}
        <div className="flex flex-wrap justify-center md:justify-end gap-4">
          {Object.values(NAV_LINKS).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Github Link */}
        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/IrfanNha"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
