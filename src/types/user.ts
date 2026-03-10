export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  avgResponseTime: number;
}

export interface CacheEntry {
  data: User;
  timestamp: number;
}

export interface RateLimitInfo {
  count: number;
  burstCount: number;
  resetTime: number;
  burstResetTime: number;
}