'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wallet as WalletIcon, 
  Copy, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  ExternalLink, 
  Edit, 
  Trash2
} from 'lucide-react';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { FloatingElement } from '@/components/animations/FloatingElements';
import { useState, useRef, useEffect } from 'react';

// Define the Wallet type interface
interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  isActive: boolean;
  updatedAt: string | Date;
}

interface WalletCardProps {
  wallet: Wallet;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onCheckMempool?: (address: string) => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  isActive = false,
  onSelect,
  onEdit,
  onDelete,
  onCheckMempool,
}) => {
  const [showAddress, setShowAddress] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAddress = (address: string) => {
    if (!address) return 'No address';
    if (showAddress) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const formatBalance = (balance: number | undefined | null) => {
    if (balance === undefined || balance === null || isNaN(balance)) {
      return '0.00000000';
    }
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  const formatDate = (date: string | Date) => {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return 'Unknown';
    }
  };

  const handleMenuAction = (action: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setShowMenu(false);
    
    switch (action) {
      case 'edit':
        onEdit?.();
        break;
      case 'delete':
        onDelete?.();
        break;
      default:
        break;
    }
  };

  return (
    <ScrollReveal direction="up" delay={100}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative z-10"
      >
        <Card
          className={`
            relative overflow-hidden cursor-pointer transition-all duration-300 z-10
            ${isActive 
              ? 'ring-2 ring-slate-400 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900' 
              : 'hover:shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-800'
            }
            border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-900
          `}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect?.();
          }}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 to-slate-600/5 dark:from-slate-400/5 dark:to-slate-500/5 pointer-events-none" />
          
          {/* Floating particles */}
          <FloatingElement delay={0.5}>
            <div className="absolute top-4 right-4 w-2 h-2 bg-slate-400/30 rounded-full pointer-events-none" />
          </FloatingElement>

          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                  <WalletIcon className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    {wallet.name || 'Unnamed Wallet'}
                  </CardTitle>
                  <Badge 
                    variant={wallet.isActive ? 'default' : 'secondary'}
                    className="mt-1 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  >
                    {wallet.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              
              {/* Menu Dropdown */}
              <div className="relative" ref={menuRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(!showMenu);
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                    >
                      <button
                        onClick={(e) => handleMenuAction('edit', e)}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit Wallet</span>
                      </button>
                      
                      <div className="h-px bg-slate-200 dark:bg-slate-700 mx-2 my-1" />
                      
                      <button
                        onClick={(e) => handleMenuAction('delete', e)}
                        className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Wallet</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Balance */}
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {formatBalance(wallet.balance)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  BTC
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Address
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAddress(!showAddress);
                    }}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {showAddress ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                    {formatAddress(wallet.address)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard();
                    }}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    disabled={!wallet.address}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xs text-green-600 dark:text-green-400 text-center"
                  >
                    Address copied to clipboard!
                  </motion.div>
                )}
              </div>

              {/* Last updated */}
              <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                Updated {formatDate(wallet.updatedAt)}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheckMempool?.(wallet.address);
                  }}
                  className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  disabled={!wallet.address}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Check Mempool
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </ScrollReveal>
  );
};