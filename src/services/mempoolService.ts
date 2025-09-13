import axios from 'axios';
import { MempoolTransaction, MempoolStats } from '@/types';
import { APP_CONFIG, API_ENDPOINTS } from '@/constants';
import { getDemoMempoolTransactions, getDemoRecommendedFees, getDemoMempoolStats } from './demoDataService';

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
      // Return mock data for demo purposes when address doesn't exist on blockchain
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
      // Return empty array for demo purposes when address doesn't exist
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
      // Return demo data when API fails
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
      // Return demo data when API fails
      return getDemoRecommendedFees();
    }
  }

  // Connect to WebSocket for real-time updates with improved error handling
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: Event) => void): void {
    // Prevent multiple connection attempts
    if (this.isConnecting || (this.wsConnection && this.wsConnection.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket connection already in progress');
      return;
    }

    // Close existing connection if any
    if (this.wsConnection) {
      this.wsConnection.close();
    }

    // Clear any pending reconnection timeouts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Don't attempt connection if we've exceeded max attempts
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
        this.reconnectAttempts = 0; // Reset attempts on successful connection
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.wsConnection.onerror = (error) => {
        console.warn('WebSocket connection failed - using demo mode for real-time updates');
        this.isConnecting = false;
        this.reconnectAttempts++;
        
        // Don't call onError to avoid showing errors to users
        // WebSocket is optional for demo purposes
      };

      this.wsConnection.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        this.isConnecting = false;
        
        // Only attempt reconnection for unexpected closures and within limit
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000); // Exponential backoff, max 30s
          console.log(`Attempting to reconnect WebSocket in ${delay}ms (attempt ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
          
          this.reconnectTimeout = setTimeout(() => {
            this.connectWebSocket(onMessage, onError);
          }, delay);
        } else {
          console.log('WebSocket reconnection disabled or max attempts reached');
        }
      };

      // Set connection timeout
      setTimeout(() => {
        if (this.wsConnection && this.wsConnection.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout - closing connection');
          this.wsConnection.close();
        }
      }, 10000); // 10 second timeout

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
    // Clear any pending reconnection
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Close connection
    if (this.wsConnection) {
      this.wsConnection.close(1000, 'User disconnected'); // Normal closure
      this.wsConnection = null;
    }

    // Reset state
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
      // Return demo data when API fails
      return 820000;
    }
  }

  // Get block information
  async getBlock(hash: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.BLOCK}/${hash}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching block:', error);
      throw new Error('Failed to fetch block information');
    }
  }

  // Force reset WebSocket connection (for manual retry)
  resetWebSocketConnection(onMessage: (data: any) => void, onError?: (error: Event) => void): void {
    this.disconnectWebSocket();
    this.reconnectAttempts = 0;
    
    // Wait a bit before reconnecting
    setTimeout(() => {
      this.connectWebSocket(onMessage, onError);
    }, 1000);
  }
}

export const mempoolService = new MempoolService();