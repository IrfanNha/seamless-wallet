import { Variants } from "framer-motion";

export const APP_CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Bitcoin Wallet',
  VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  MEMPOOL_API_URL: process.env.NEXT_PUBLIC_MEMPOOL_API_URL || 'https://mempool.space/api',
  MEMPOOL_WS_URL: process.env.NEXT_PUBLIC_MEMPOOL_WS_URL || 'wss://mempool.space',
  ENABLE_ANIMATIONS: process.env.NEXT_PUBLIC_ENABLE_ANIMATIONS === 'true',
  ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',
} as const;

export const NAV_LINKS = {
  HOME: { name: 'Home', href: '/' },
  DOCS: { name: 'Docs', href: '/docs' },
  SUPPORT: { name: 'Support', href: '/support' },
} as const;

export const WALLET_CONSTANTS = {
  MIN_CONFIRMATIONS: 1,
  MAX_CONFIRMATIONS: 6,
  REFRESH_INTERVAL: 30000, // 30 seconds
  MAX_TRANSACTIONS_PER_PAGE: 50,
} as const;

export const API_ENDPOINTS = {
  ADDRESS: '/address',
  TRANSACTION: '/tx',
  BLOCK: '/block',
  MEMPOOL: '/mempool',
  FEES: '/v1/fees/recommended',
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

export const MOTIONS = {
  NAVBAR: {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.35, type: "spring", stiffness: 180 },
    },
  } as Variants,
  MOBILE_MENU: {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10 },
  } as Variants,
} as const;

export const COLORS = {
  SLATE_BLUE: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  BITCOIN: {
    ORANGE: '#f7931a',
    DARK_ORANGE: '#e8821e',
  },
} as const;



export const WALLET_INFO = {
  BTC_ADDRESS: process.env.NEXT_PUBLIC_BTC_ADDRESS || "bc1qexampleyouraddress",
} as const;
