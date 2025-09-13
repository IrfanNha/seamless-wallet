'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  isActive: boolean;
  updatedAt: string | Date;
}

interface DeleteWalletDialogProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (walletId: string) => void;
  isDeleting?: boolean;
}

export const DeleteWalletDialog: React.FC<DeleteWalletDialogProps> = ({
  wallet,
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
}) => {
  if (!wallet) return null;

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const handleConfirm = () => {
    onConfirm(wallet.id);
  };

  const hasBalance = wallet.balance > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="border-red-200 dark:border-red-800 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-red-800 dark:text-red-200">
                      Delete Wallet
                    </CardTitle>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                      This action cannot be undone
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Wallet Info */}
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-800 dark:text-slate-200">
                      {wallet.name}
                    </h3>
                    <Badge 
                      variant={wallet.isActive ? 'default' : 'secondary'}
                      className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {wallet.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Balance:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">
                        {formatBalance(wallet.balance)} BTC
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Address:</span>
                      <code className="text-slate-800 dark:text-slate-200">
                        {formatAddress(wallet.address)}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Warning Messages */}
                {hasBalance && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800 dark:text-yellow-200">
                          Wallet has balance!
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                          Make sure to transfer your funds before deleting this wallet.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-start space-x-2">
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Permanent deletion
                      </p>
                      <p className="text-red-700 dark:text-red-300 mt-1">
                        The wallet will be permanently removed from your app. You can still access your funds with the private key or seed phrase.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation */}
                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Are you sure you want to delete <strong>"{wallet.name}"</strong>?
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 border-slate-300 dark:border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Deleting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Wallet</span>
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};