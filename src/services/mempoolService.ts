import axios from 'axios';
import { MempoolTransaction, MempoolStats } from '@/types';
import { APP_CONFIG, API_ENDPOINTS } from '@/constants';
import { getDemoMempoolTransactions, getDemoRecommendedFees } from './demoDataService';

// Tambahan: tipe WebSocket message
export interface MempoolWsMessage {
  type?: 'transaction' | 'block' | 'other' | string;
  tx?: MempoolTransaction;
  [key: string]: unknown;
}

class MempoolService {
  private baseURL: string;
  private wsConnection: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  constructor() {
    this.baseURL = APP_CONFIG.MEMPOOL_API_URL;
  }

  // Get address information and balance
  async getAddressInfo(address: string): Promise<MempoolStats> {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.ADDRESS}/${address}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching address info:', error);
      return {
        funded_txo_count: 0,
        funded_txo_sum: 0,
        spent_txo_count: 0,
        spent_txo_sum: 0,
        tx_count: 0,
      };
    }
  }

  // Get address transactions
  async getAddressTransactions(address: string, limit = 50): Promise<MempoolTransaction[]> {
    try {
      const response = await axios.get(
        `${this.baseURL}${API_ENDPOINTS.ADDRESS}/${address}/txs`,
        { params: { limit } }
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching address transactions:', error);
      return [];
    }
  }

  // Get transaction details
  async getTransaction(txid: string): Promise<MempoolTransaction> {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.TRANSACTION}/${txid}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw new Error('Failed to fetch transaction details');
    }
  }

  // Get mempool transactions
  async getMempoolTransactions(): Promise<MempoolTransaction[]> {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.MEMPOOL}`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching mempool transactions:', error);
      return getDemoMempoolTransactions();
    }
  }

  // Get recommended fees
  async getRecommendedFees(): Promise<{
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    economyFee: number;
    minimumFee: number;
  }> {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.FEES}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended fees:', error);
      return getDemoRecommendedFees();
    }
  }

  // Connect to WebSocket for real-time updates with improved error handling
  connectWebSocket(onMessage: (data: MempoolWsMessage) => void, onError?: (error: Event) => void): void {
    if (this.isConnecting || (this.wsConnection && this.wsConnection.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket connection already in progress');
      return;
    }

    if (this.wsConnection) {
      this.wsConnection.close();
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('Max WebSocket reconnection attempts reached - using demo mode permanently');
      return;
    }

    this.isConnecting = true;

    try {
      this.wsConnection = new WebSocket(APP_CONFIG.MEMPOOL_WS_URL);

      this.wsConnection.onopen = () => {
        console.log('Connected to Mempool WebSocket');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data: MempoolWsMessage = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.wsConnection.onerror = () => {
        console.warn('WebSocket connection failed - using demo mode for real-time updates');
        this.isConnecting = false;
        this.reconnectAttempts++;
      };

      this.wsConnection.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        this.isConnecting = false;

        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
          console.log(`Attempting to reconnect WebSocket in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);

          this.reconnectTimeout = setTimeout(() => {
            this.connectWebSocket(onMessage, onError);
          }, delay);
        } else {
          console.log('WebSocket reconnection disabled or max attempts reached');
        }
      };

      setTimeout(() => {
        if (this.wsConnection && this.wsConnection.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout - closing connection');
          this.wsConnection.close();
        }
      }, 10000);
    } catch (error) {
      console.warn('WebSocket not available - using demo mode', error);
      this.isConnecting = false;
      this.reconnectAttempts++;
    }
  }

  // Subscribe to address updates
  subscribeToAddress(address: string): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      try {
        this.wsConnection.send(JSON.stringify({
          action: 'want',
          data: ['blocks', 'mempool-blocks', 'addresses', 'transactions']
        }));
        console.log('Subscribed to address updates:', address);
      } catch (error) {
        console.error('Failed to subscribe to address updates:', error);
      }
    }
  }

  // Disconnect WebSocket
  disconnectWebSocket(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.wsConnection) {
      this.wsConnection.close(1000, 'User disconnected');
      this.wsConnection = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  // Get WebSocket connection status
  getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (this.isConnecting) return 'connecting';
    if (!this.wsConnection) return 'disconnected';

    switch (this.wsConnection.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return this.reconnectAttempts >= this.maxReconnectAttempts ? 'error' : 'disconnected';
      default:
        return 'disconnected';
    }
  }

  // Get current block height
  async getCurrentBlockHeight(): Promise<number> {
    try {
      const response = await axios.get(`${this.baseURL}/blocks/tip/height`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current block height:', error);
      return 820000;
    }
  }

  // Get block information
  async getBlock(hash: string): Promise<unknown> {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.BLOCK}/${hash}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching block:', error);
      throw new Error('Failed to fetch block information');
    }
  }

  // Force reset WebSocket connection
  resetWebSocketConnection(onMessage: (data: MempoolWsMessage) => void, onError?: (error: Event) => void): void {
    this.disconnectWebSocket();
    this.reconnectAttempts = 0;

    setTimeout(() => {
      this.connectWebSocket(onMessage, onError);
    }, 1000);
  }
}

export const mempoolService = new MempoolService();
