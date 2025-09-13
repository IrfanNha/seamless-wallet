'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'; // adjust path if needed
import { Button } from '@/components/ui/button';
import { Sun, Moon, Laptop } from 'lucide-react';

const ITEM_VARIANTS = {
  hidden: { opacity: 0, x: -8 },
  visible: (i = 0) => ({ opacity: 1, x: 0, transition: { delay: 0.04 * i } }),
};

export const ThemeDropdown: React.FC = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // avoid hydration mismatch — wait until mounted
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Theme">
        {/* skeleton placeholder */}
        <Sun className="w-4 h-4 text-slate-500" />
      </Button>
    );
  }

  const current = theme === 'system' ? systemTheme ?? 'light' : theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Change theme"
          className="border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          {/* small icon reflecting current theme */}
          {current === 'dark' ? (
            <Moon className="w-4 h-4 text-slate-200" />
          ) : (
            <Sun className="w-4 h-4 text-orange-500" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md rounded-lg p-2"
      >
        <DropdownMenuLabel className="text-xs text-slate-500 dark:text-slate-400 mb-1">
          Theme
        </DropdownMenuLabel>

        {/* Light */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={0}
          variants={ITEM_VARIANTS}
        >
          <DropdownMenuItem
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
              current === 'light'
                ? 'bg-slate-100 dark:bg-slate-800/60 font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-4 h-4 text-orange-500" />
            <span>Light</span>
          </DropdownMenuItem>
        </motion.div>

        {/* Dark */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={1}
          variants={ITEM_VARIANTS}
        >
          <DropdownMenuItem
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
              current === 'dark'
                ? 'bg-slate-100 dark:bg-slate-800/60 font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            <span>Dark</span>
          </DropdownMenuItem>
        </motion.div>

        {/* System */}
        <motion.div
          initial="hidden"
          animate="visible"
          custom={2}
          variants={ITEM_VARIANTS}
        >
          <DropdownMenuItem
            onClick={() => setTheme('system')}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${
              theme === 'system'
                ? 'bg-slate-100 dark:bg-slate-800/60 font-medium'
                : 'hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Laptop className="w-4 h-4 text-slate-500" />
            <span>System</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeDropdown;
