'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { Transaction } from '@/types';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  isLoading = false,
  onTransactionClick,
}) => {
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }).format(amount);
  };

  const formatTxId = (txid: string) => {
    return `${txid.slice(0, 8)}...${txid.slice(-8)}`;
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollReveal direction="up" delay={200}>
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center justify-between">
            Recent Transactions
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              {transactions.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    className={`
                      p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      hover:shadow-md hover:shadow-slate-200 dark:hover:shadow-slate-800
                      border-slate-200 dark:border-slate-700
                      bg-slate-50/50 dark:bg-slate-800/50
                      hover:bg-slate-100/50 dark:hover:bg-slate-700/50
                    `}
                    onClick={() => setExpandedTx(expandedTx === transaction.id ? null : transaction.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg
                          ${transaction.type === 'received' 
                            ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' 
                            : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                          }
                        `}>
                          {transaction.type === 'received' ? (
                            <ArrowDownLeft className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {transaction.type === 'received' ? 'Received' : 'Sent'}
                            </span>
                            {getStatusIcon(transaction.status)}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {transaction.timestamp.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`
                          font-semibold
                          ${transaction.type === 'received' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                          }
                        `}>
                          {transaction.type === 'received' ? '+' : '-'}{formatAmount(transaction.amount)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {transaction.confirmations} confirmations
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        {transaction.fee > 0 && (
                          <Badge variant="outline" className="text-slate-600 dark:text-slate-400">
                            Fee: {formatAmount(transaction.fee)}
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTransactionClick?.(transaction);
                        }}
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>

                    <AnimatePresence>
                      {expandedTx === transaction.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"
                        >
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Transaction ID
                              </div>
                              <code className="text-sm font-mono text-slate-700 dark:text-slate-300 break-all">
                                {transaction.txid}
                              </code>
                            </div>
                            
                            {transaction.blockHeight && (
                              <div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                                  Block Height
                                </div>
                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                  {transaction.blockHeight}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                  Inputs ({transaction.inputs.length})
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {transaction.inputs.map((input, i) => (
                                    <div key={i} className="text-xs font-mono text-slate-600 dark:text-slate-400">
                                      {formatTxId(input.prevTxid)}:{input.prevVout} - {formatAmount(input.value)} BTC
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                                  Outputs ({transaction.outputs.length})
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                  {transaction.outputs.map((output, i) => (
                                    <div key={i} className="text-xs font-mono text-slate-600 dark:text-slate-400">
                                      {output.address.slice(0, 20)}... - {formatAmount(output.value)} BTC
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </ScrollReveal>
  );
};
