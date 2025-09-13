import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Wallet, Transaction, MempoolTransaction, WalletState } from '@/types';

interface WalletStore extends WalletState {
  // Actions
  setWallets: (wallets: Wallet[]) => void;
  addWallet: (wallet: Wallet) => void;
  updateWallet: (id: string, updates: Partial<Wallet>) => void;
  removeWallet: (id: string) => void;
  setActiveWallet: (wallet: Wallet | null) => void;
  
  // Transactions
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  
  // Mempool
  setMempoolTransactions: (transactions: MempoolTransaction[]) => void;
  addMempoolTransaction: (transaction: MempoolTransaction) => void;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdated: (date: Date) => void;
  clearError: () => void;
  
  // Computed values
  getWalletById: (id: string) => Wallet | undefined;
  getTransactionsByWallet: (walletId: string) => Transaction[];
  getTotalBalance: () => number;
  getPendingTransactions: () => Transaction[];
}

export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        wallets: [],
        activeWallet: null,
        transactions: [],
        mempoolTransactions: [],
        isLoading: false,
        error: null,
        lastUpdated: null,

        // Wallet actions
        setWallets: (wallets) =>
          set((state) => {
            // pastikan semua balance jadi number valid
            state.wallets = wallets.map((w) => ({
              ...w,
              balance: Number(w.balance) || 0,
            }));
          }),

        addWallet: (wallet) =>
          set((state) => {
            state.wallets.push({
              ...wallet,
              balance: Number(wallet.balance) || 0,
            });
            if (!state.activeWallet) {
              state.activeWallet = {
                ...wallet,
                balance: Number(wallet.balance) || 0,
              };
            }
          }),

        updateWallet: (id, updates) =>
          set((state) => {
            const index = state.wallets.findIndex((w) => w.id === id);
            if (index !== -1) {
              Object.assign(state.wallets[index], {
                ...updates,
                balance:
                  updates.balance !== undefined
                    ? Number(updates.balance) || 0
                    : state.wallets[index].balance,
              });
              if (state.activeWallet?.id === id) {
                Object.assign(state.activeWallet, {
                  ...updates,
                  balance:
                    updates.balance !== undefined
                      ? Number(updates.balance) || 0
                      : state.activeWallet.balance,
                });
              }
            }
          }),

        removeWallet: (id) =>
          set((state) => {
            state.wallets = state.wallets.filter((w) => w.id !== id);
            if (state.activeWallet?.id === id) {
              state.activeWallet = state.wallets[0] || null;
            }
          }),

        setActiveWallet: (wallet) =>
          set((state) => {
            state.activeWallet = wallet
              ? { ...wallet, balance: Number(wallet.balance) || 0 }
              : null;
          }),

        // Transaction actions
        setTransactions: (transactions) =>
          set((state) => {
            state.transactions = transactions;
          }),

        addTransaction: (transaction) =>
          set((state) => {
            const existingIndex = state.transactions.findIndex(
              (t) => t.id === transaction.id
            );
            if (existingIndex !== -1) {
              state.transactions[existingIndex] = transaction;
            } else {
              state.transactions.unshift(transaction);
            }
          }),

        updateTransaction: (id, updates) =>
          set((state) => {
            const index = state.transactions.findIndex((t) => t.id === id);
            if (index !== -1) {
              Object.assign(state.transactions[index], updates);
            }
          }),

        // Mempool actions
        setMempoolTransactions: (transactions) =>
          set((state) => {
            state.mempoolTransactions = transactions;
          }),

        addMempoolTransaction: (transaction) =>
          set((state) => {
            const existingIndex = state.mempoolTransactions.findIndex(
              (t) => t.txid === transaction.txid
            );
            if (existingIndex !== -1) {
              state.mempoolTransactions[existingIndex] = transaction;
            } else {
              state.mempoolTransactions.unshift(transaction);
            }
          }),

        // State management
        setLoading: (loading) =>
          set((state) => {
            state.isLoading = loading;
          }),

        setError: (error) =>
          set((state) => {
            state.error = error;
          }),

        setLastUpdated: (date) =>
          set((state) => {
            state.lastUpdated = date;
          }),

        clearError: () =>
          set((state) => {
            state.error = null;
          }),

        // Computed values
        getWalletById: (id) => {
          const state = get();
          return state.wallets.find((w) => w.id === id);
        },

        getTransactionsByWallet: (walletId) => {
          const state = get();
          return state.transactions.filter((t) => t.walletId === walletId);
        },

        getTotalBalance: () => {
          const state = get();
          return state.wallets.reduce(
            (total, wallet) => total + (Number(wallet.balance) || 0),
            0
          );
        },

        getPendingTransactions: () => {
          const state = get();
          return state.transactions.filter((t) => t.status === 'pending');
        },
      })),
      {
        name: 'bitcoin-wallet-storage',
        partialize: (state) => ({
          wallets: state.wallets.map((w) => ({
            ...w,
            balance: Number(w.balance) || 0,
          })),
          activeWallet: state.activeWallet
            ? { ...state.activeWallet, balance: Number(state.activeWallet.balance) || 0 }
            : null,
          transactions: state.transactions,
        }),
      }
    ),
    {
      name: 'wallet-store',
    }
  )
);
