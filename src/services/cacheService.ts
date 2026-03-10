import { User, CacheStats, CacheEntry } from '../types/user';

class CacheService {
  private cache: Map<number, CacheEntry>;
  private readonly ttl: number; // Time to live in milliseconds
  private hits: number;
  private misses: number;
  private totalResponseTime: number;
  private requestCount: number;
  private pendingRequests: Map<number, Promise<User>>;

  constructor(ttlSeconds: number = 60) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
    this.hits = 0;
    this.misses = 0;
    this.totalResponseTime = 0;
    this.requestCount = 0;
    this.pendingRequests = new Map();
    
    // Start background cleanup job
    this.startCleanupJob();
  }

  private startCleanupJob(): void {
    setInterval(() => {
      this.cleanupStaleEntries();
    }, 30000); // Run every 30 seconds
  }

  private cleanupStaleEntries(): void {
    const now = Date.now();
    for (const [id, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(id);
      }
    }
  }

  async getOrSet(id: number, fetchFn: () => Promise<User>): Promise<User> {
    const startTime = Date.now();
    
    try {
      // Check if there's already a pending request for this ID
      if (this.pendingRequests.has(id)) {
        return await this.pendingRequests.get(id)!;
      }

      // Check cache
      const cached = this.cache.get(id);
      if (cached && (Date.now() - cached.timestamp <= this.ttl)) {
        this.hits++;
        this.updateResponseTime(Date.now() - startTime);
        return cached.data;
      }

      this.misses++;

      // Create promise for this request
      const fetchPromise = (async () => {
        try {
          const user = await fetchFn();
          
          // Only cache if user exists
          if (user) {
            this.cache.set(id, {
              data: user,
              timestamp: Date.now()
            });
          }
          
          return user;
        } finally {
          // Clean up pending request
          this.pendingRequests.delete(id);
        }
      })();

      this.pendingRequests.set(id, fetchPromise);
      const result = await fetchPromise;
      
      this.updateResponseTime(Date.now() - startTime);
      return result;
    } catch (error) {
      this.pendingRequests.delete(id);
      throw error;
    }
  }

  private updateResponseTime(time: number): void {
    this.totalResponseTime += time;
    this.requestCount++;
  }

  getStats(): CacheStats {
    return {
      hits: this.hits,
      misses: this.misses,
      size: this.cache.size,
      avgResponseTime: this.requestCount > 0 
        ? this.totalResponseTime / this.requestCount 
        : 0
    };
  }

  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
    this.totalResponseTime = 0;
    this.requestCount = 0;
  }

  get(id: number): User | undefined {
    const entry = this.cache.get(id);
    if (entry && (Date.now() - entry.timestamp <= this.ttl)) {
      this.hits++;
      return entry.data;
    }
    this.misses++;
    return undefined;
  }

  set(id: number, user: User): void {
    this.cache.set(id, {
      data: user,
      timestamp: Date.now()
    });
  }

  delete(id: number): boolean {
    return this.cache.delete(id);
  }
}

export default new CacheService();