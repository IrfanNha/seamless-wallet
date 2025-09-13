export interface Wallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  txid: string;
  walletId: string;
  type: 'sent' | 'received';
  amount: number;
  fee: number;
  confirmations: number;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  blockHeight?: number;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
}

export interface TransactionInput {
  address: string;
  value: number;
  prevTxid: string;
  prevVout: number;
}

export interface TransactionOutput {
  address: string;
  value: number;
  scriptPubKey: string;
}

export interface MempoolTransaction {
  txid: string;
  fee: number;
  weight: number;
  status: {
    confirmed: boolean;
    block_height?: number;
    block_hash?: string;
    block_time?: number;
  };
  vin: Array<{
    txid: string;
    vout: number;
    prevout: {
      scriptpubkey: string;
      scriptpubkey_asm: string;
      scriptpubkey_type: string;
      scriptpubkey_address: string;
      value: number;
    };
  }>;
  vout: Array<{
    scriptpubkey: string;
    scriptpubkey_asm: string;
    scriptpubkey_type: string;
    scriptpubkey_address: string;
    value: number;
  }>;
}

export interface MempoolStats {
  funded_txo_count: number;
  funded_txo_sum: number;
  spent_txo_count: number;
  spent_txo_sum: number;
  tx_count: number;
}

export interface WalletState {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  transactions: Transaction[];
  mempoolTransactions: MempoolTransaction[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}
