'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ParticleField } from '@/components/animations/FloatingElements';
import { WalletCard } from './WalletCard';
import { TransactionList } from './TransactionList';
import { CreateWalletDialog } from './CreateWalletDialog';
import { useWallet } from '@/hooks/useWallet';
import { 
  Plus, 
  RefreshCw, 
  Wallet, 
  TrendingUp, 
  Activity, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { WalletCardWithActions } from './WalletCardWithActions';

export const WalletDashboard: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const {
    wallets,
    activeWallet,
    transactions,
    mempoolTransactions,
    isLoading,
    error,
    lastUpdated,
    setActiveWallet,
    refreshWallets,
    getTotalBalance,
    getPendingTransactions,
  } = useWallet();

  const totalBalance = getTotalBalance();
  const pendingTransactions = getPendingTransactions();
  const activeTransactions = transactions.filter(t => t.status === 'confirmed').slice(0, 10);

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8,
    }).format(balance);
  };

  const formatUSD = (btcAmount: number) => {
    // This would typically come from a price API
    const btcPrice = 50000; // Placeholder price
    const usdAmount = btcAmount * btcPrice;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(usdAmount);
  };

  const handleCheckMempool = (address: string) => {
    // Open mempool.space in a new tab
    window.open(`https://mempool.space/address/${address}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background particles */}
      <ParticleField count={15} />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <ScrollReveal direction="down" delay={100}>
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center space-x-3 bg-white dark:bg-slate-800 px-6 py-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700"
            >
              <Wallet className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                Bitcoin Wallet
              </h1>
            </motion.div>
            
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Monitor your Bitcoin wallets, track transactions, and stay updated with real-time mempool data
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Cards */}
        <ScrollReveal direction="up" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Balance</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {formatBalance(totalBalance)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ≈ {formatUSD(totalBalance)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active Wallets</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {wallets.length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {wallets.filter(w => w.isActive).length} active
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pending</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {pendingTransactions.length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Mempool</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {mempoolTransactions.length}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Error Display */}
        {error && (
          <ScrollReveal direction="up" delay={100}>
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        )}

        {/* Main Content */}
        <Tabs defaultValue="wallets" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TabsTrigger 
                value="wallets" 
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
              >
                Wallets
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="mempool"
                className="data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-slate-100"
              >
                Mempool
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-3">
              {lastUpdated && (
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                </div>
              )}
              
              <Button
                onClick={refreshWallets}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button
                onClick={() => setShowCreateDialog(true)}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Wallet
              </Button>
            </div>
          </div>

          <TabsContent value="wallets" className="space-y-6">
            {wallets.length === 0 ? (
              <ScrollReveal direction="up" delay={100}>
                <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  <CardContent className="p-12 text-center">
                    <Wallet className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      No wallets yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                      Create your first Bitcoin wallet to start monitoring transactions and balances.
                    </p>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Wallet
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.map((wallet, index) => (
                  <WalletCardWithActions 
                    key={wallet.id}
                    wallet={wallet}
                    isActive={activeWallet?.id === wallet.id}
                    onSelect={() => setActiveWallet(wallet)}
                    onCheckMempool={(address) => window.open(`https://mempool.space/address/${address}`, '_blank')}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionList
              transactions={activeTransactions}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="mempool" className="space-y-6">
            <ScrollReveal direction="up" delay={100}>
              <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-slate-800 dark:text-slate-200">
                    Mempool Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                      Real-time Mempool Data
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Mempool transactions will appear here as they are detected.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </TabsContent>
        </Tabs>
      </div>

      <CreateWalletDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};