import { useEffect, useCallback } from 'react';
import { useWalletStore } from '@/stores/walletStore';
import { mempoolService } from '@/services/mempoolService';
import { Wallet, Transaction } from '@/types';
import { WALLET_CONSTANTS } from '@/constants';

export const useWallet = () => {
  const {
    wallets,
    activeWallet,
    transactions,
    mempoolTransactions,
    isLoading,
    error,
    lastUpdated,
    addWallet,
    updateWallet,
    removeWallet,
    setActiveWallet,
    setTransactions,
    setMempoolTransactions,
    addMempoolTransaction,
    setLoading,
    setError,
    setLastUpdated,
    clearError,
    getWalletById,
    getTransactionsByWallet,
    getTotalBalance,
    getPendingTransactions,
  } = useWalletStore();

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async (wallet: Wallet) => {
    try {
      const addressInfo = await mempoolService.getAddressInfo(wallet.address);
      const balance = addressInfo.funded_txo_sum - addressInfo.spent_txo_sum;

      updateWallet(wallet.id, {
        balance: balance / 100000000, // Convert satoshis to BTC
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      // Keep existing balance if fetch fails
    }
  }, [updateWallet]);

  // Fetch wallet transactions
  const fetchWalletTransactions = useCallback(async (wallet: Wallet) => {
    try {
      const mempoolTxs = await mempoolService.getAddressTransactions(
        wallet.address,
        WALLET_CONSTANTS.MAX_TRANSACTIONS_PER_PAGE
      );

      const formattedTransactions: Transaction[] = mempoolTxs.map((tx) => ({
        id: tx.txid,
        txid: tx.txid,
        walletId: wallet.id,
        type: tx.vout.some(output => output.scriptpubkey_address === wallet.address) 
          ? 'received' : 'sent',
        amount: Math.abs(
          tx.vout
            .filter(output => output.scriptpubkey_address === wallet.address)
            .reduce((sum, output) => sum + output.value, 0) -
          tx.vin
            .filter(input => input.prevout.scriptpubkey_address === wallet.address)
            .reduce((sum, input) => sum + input.prevout.value, 0)
        ) / 100000000, // Convert satoshis to BTC
        fee: tx.fee / 100000000, // Convert satoshis to BTC
        confirmations: tx.status.confirmed ? 6 : 0,
        status: tx.status.confirmed ? 'confirmed' : 'pending',
        timestamp: new Date(tx.status.block_time || Date.now()),
        blockHeight: tx.status.block_height,
        inputs: tx.vin.map(input => ({
          address: input.prevout.scriptpubkey_address,
          value: input.prevout.value / 100000000,
          prevTxid: input.txid,
          prevVout: input.vout,
        })),
        outputs: tx.vout.map(output => ({
          address: output.scriptpubkey_address,
          value: output.value / 100000000,
          scriptPubKey: output.scriptpubkey,
        })),
      }));

      const existingTransactions = transactions.filter(t => t.walletId !== wallet.id);
      setTransactions([...existingTransactions, ...formattedTransactions]);
    } catch (err) {
      console.error('Error fetching wallet transactions:', err);
    }
  }, [transactions, setTransactions]);

  // Delete wallet with cleanup
  const deleteWallet = useCallback(async (walletId: string) => {
    try {
      setLoading(true);
      clearError();

      const walletToDelete = getWalletById(walletId);
      if (!walletToDelete) throw new Error('Wallet not found');

      removeWallet(walletId);

      const filteredTransactions = transactions.filter(t => t.walletId !== walletId);
      setTransactions(filteredTransactions);

      if (activeWallet?.id === walletId) {
        const remainingWallets = wallets.filter(w => w.id !== walletId);
        setActiveWallet(remainingWallets.length > 0 ? remainingWallets[0] : null);
        mempoolService.disconnectWebSocket();
      }

      setLastUpdated(new Date());

      return {
        success: true,
        message: `Wallet "${walletToDelete.name}" has been successfully deleted.`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete wallet';
      setError(errorMessage);

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [
    wallets, activeWallet, transactions,
    getWalletById, removeWallet, setTransactions,
    setActiveWallet, setLoading, setError,
    clearError, setLastUpdated
  ]);

  // Refresh all wallet data
  const refreshWallets = useCallback(async () => {
    if (wallets.length === 0) return;

    try {
      setLoading(true);
      clearError();

      await Promise.all(
        wallets.map(async (wallet) =>
          Promise.all([
            fetchWalletBalance(wallet),
            fetchWalletTransactions(wallet),
          ])
        )
      );

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh wallets');
    } finally {
      setLoading(false);
    }
  }, [wallets, fetchWalletBalance, fetchWalletTransactions, setLoading, setError, clearError, setLastUpdated]);

  // Fetch mempool transactions
  const fetchMempoolTransactions = useCallback(async () => {
    try {
      const mempoolTxs = await mempoolService.getMempoolTransactions();
      setMempoolTransactions(Array.isArray(mempoolTxs) ? mempoolTxs.slice(0, 100) : []);
    } catch (err) {
      console.error('Error fetching mempool transactions:', err);
    }
  }, [setMempoolTransactions]);

  // Create a new wallet
  const createWallet = useCallback(async (name: string, address: string) => {
    try {
      setLoading(true);
      clearError();

      if (!name || !address) throw new Error('Name and address are required');

      const existingWallet = wallets.find(w => w.address === address);
      if (existingWallet) throw new Error('A wallet with this address already exists');

      const newWallet: Wallet = {
        id: crypto.randomUUID(),
        name,
        address,
        balance: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addWallet(newWallet);
      setLastUpdated(new Date());

      if (wallets.length === 0) setActiveWallet(newWallet);

      Promise.all([
        fetchWalletBalance(newWallet),
        fetchWalletTransactions(newWallet),
      ]).catch(err => console.error('Error fetching wallet data:', err));

      return {
        success: true,
        wallet: newWallet,
        message: `Wallet "${name}" has been successfully created.`,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create wallet';
      setError(errorMessage);

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [wallets, addWallet, setActiveWallet, setLoading, setError, clearError, setLastUpdated, fetchWalletBalance, fetchWalletTransactions]);

  // Update wallet details
  const editWallet = useCallback(async (walletId: string, updates: Partial<Pick<Wallet, 'name' | 'isActive'>>) => {
    try {
      setLoading(true);
      clearError();

      const existingWallet = getWalletById(walletId);
      if (!existingWallet) throw new Error('Wallet not found');

      if (updates.name && updates.name !== existingWallet.name) {
        const nameExists = wallets.some(w => w.id !== walletId && w.name === updates.name);
        if (nameExists) throw new Error('A wallet with this name already exists');
      }

      updateWallet(walletId, { ...updates, updatedAt: new Date() });
      setLastUpdated(new Date());

      return { success: true, message: 'Wallet has been successfully updated.' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update wallet';
      setError(errorMessage);

      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [wallets, getWalletById, updateWallet, setLoading, setError, clearError, setLastUpdated]);

  // Set active wallet with WebSocket management
  const setActiveWalletWithCleanup = useCallback((wallet: Wallet | null) => {
    if (activeWallet) mempoolService.disconnectWebSocket();

    setActiveWallet(wallet);

    if (wallet) {
      mempoolService.connectWebSocket(
        (data) => {
          if (data.type === 'transaction' && data.tx) addMempoolTransaction(data.tx);
        },
        (error) => console.error('WebSocket error:', error)
      );

      mempoolService.subscribeToAddress(wallet.address);
    }
  }, [activeWallet, setActiveWallet, addMempoolTransaction]);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (activeWallet) {
      mempoolService.connectWebSocket(
        (data) => {
          if (data.type === 'transaction' && data.tx) addMempoolTransaction(data.tx);
        },
        (error) => console.error('WebSocket error:', error)
      );

      mempoolService.subscribeToAddress(activeWallet.address);
    }

    return () => mempoolService.disconnectWebSocket();
  }, [activeWallet, addMempoolTransaction]);

  // Auto-refresh data
  useEffect(() => {
    if (wallets.length === 0) return;
  
    const interval = setInterval(() => {
      refreshWallets();
      fetchMempoolTransactions();
    }, WALLET_CONSTANTS.REFRESH_INTERVAL);
  
    return () => clearInterval(interval);
  }, [wallets, refreshWallets, fetchMempoolTransactions]);
  

  // Initial data fetch when first wallet is added
  useEffect(() => {
    if (wallets.length === 1 && !activeWallet) {
      setActiveWallet(wallets[0]);
    }
  }, [wallets.length, activeWallet, setActiveWallet]);

  return {
    wallets,
    activeWallet,
    transactions,
    mempoolTransactions,
    isLoading,
    error,
    lastUpdated,

    createWallet,
    editWallet,
    updateWallet,
    removeWallet,
    deleteWallet,
    setActiveWallet: setActiveWalletWithCleanup,
    refreshWallets,
    fetchWalletBalance,
    fetchWalletTransactions,
    fetchMempoolTransactions,
    clearError,

    getWalletById,
    getTransactionsByWallet,
    getTotalBalance,
    getPendingTransactions,
  };
};
