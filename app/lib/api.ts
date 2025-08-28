
// AiiA Frontend API Client
// Connects to FastAPI backend on port 8001

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export interface Security {
  symbol: string;
  company_name: string;
  sector: string | null;
  market_cap: string | null;
  is_active: boolean;
  market_cap_formatted: string;
  latest_score?: Score;
}

export interface Score {
  id: number;
  symbol: string;
  score_value: string;
  calculated_at: string;
  factor_breakdown_json?: FactorBreakdown;
  score_grade: string;
  recommendation: string;
}

export interface FactorBreakdown {
  fundamental?: number;
  technical?: number;
  sentiment?: number;
  momentum?: number;
  explanation?: {
    strengths: string[];
    concerns: string[];
    recommendation: string;
  };
}

export interface Watchlist {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  item_count: number;
  symbols: string[];
  items?: WatchlistItem[];
}

export interface WatchlistItem {
  id: number;
  watchlist_id: number;
  symbol: string;
  added_at: string;
  security?: Security;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // DEBUG: Log the actual URL being called
    console.log('🔍 API Request URL:', url);
    console.log('🔍 Base URL:', this.baseUrl);
    console.log('🔍 Endpoint:', endpoint);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('🔍 Response Status:', response.status);
    console.log('🔍 Response OK:', response.ok);

    if (!response.ok) {
      const error = await response.text();
      console.error('🔍 API Error:', error);
      throw new Error(`API Error (${response.status}): ${error}`);
    }

    const data = await response.json();
    console.log('🔍 Response Data (first item):', data[0] || 'No data');
    return data;
  }

  // Securities endpoints
  async getSecurities(activeOnly: boolean = true): Promise<Security[]> {
    return this.request<Security[]>(`/api/securities?active_only=${activeOnly}`);
  }

  async getSecurity(symbol: string): Promise<Security> {
    return this.request<Security>(`/api/securities/${symbol}`);
  }

  // Watchlists endpoints
  async getUserWatchlists(userId: number): Promise<Watchlist[]> {
    return this.request<Watchlist[]>(`/api/users/${userId}/watchlists`);
  }

  async createWatchlist(userId: number, name: string): Promise<Watchlist> {
    return this.request<Watchlist>(`/api/users/${userId}/watchlists`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async addToWatchlist(watchlistId: number, symbol: string): Promise<WatchlistItem> {
    return this.request<WatchlistItem>(`/api/users/watchlists/${watchlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ symbol }),
    });
  }

  async removeFromWatchlist(watchlistId: number, symbol: string): Promise<void> {
    return this.request<void>(`/api/users/watchlists/${watchlistId}/items/${symbol}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async getHealth(): Promise<{ status: string; database: string }> {
    return this.request<{ status: string; database: string }>('/health');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Hardcoded user ID for MVP
export const CURRENT_USER_ID = 1;
