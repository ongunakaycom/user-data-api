import { RateLimitInfo } from '../types/user';

class RateLimiter {
  private requests: Map<string, RateLimitInfo>;
  private readonly maxRequests: number;
  private readonly maxBurst: number;
  private readonly windowMs: number;
  private readonly burstWindowMs: number;

  constructor() {
    this.requests = new Map();
    this.maxRequests = 10; // 10 requests per minute
    this.maxBurst = 5; // 5 requests burst
    this.windowMs = 60 * 1000; // 1 minute
    this.burstWindowMs = 10 * 1000; // 10 seconds
  }

  isRateLimited(ip: string): boolean {
    const now = Date.now();
    const info = this.requests.get(ip) || {
      count: 0,
      burstCount: 0,
      resetTime: now + this.windowMs,
      burstResetTime: now + this.burstWindowMs
    };

    // Reset if window has passed
    if (now > info.resetTime) {
      info.count = 0;
      info.resetTime = now + this.windowMs;
    }

    // Reset burst if window has passed
    if (now > info.burstResetTime) {
      info.burstCount = 0;
      info.burstResetTime = now + this.burstWindowMs;
    }

    // Check limits
    if (info.count >= this.maxRequests || info.burstCount >= this.maxBurst) {
      return true;
    }

    // Update counters
    info.count++;
    info.burstCount++;
    this.requests.set(ip, info);

    return false;
  }

  getRemainingRequests(ip: string): { remaining: number; burstRemaining: number } {
    const info = this.requests.get(ip);
    if (!info) {
      return { remaining: this.maxRequests, burstRemaining: this.maxBurst };
    }

    const now = Date.now();
    const remaining = now > info.resetTime ? this.maxRequests : this.maxRequests - info.count;
    const burstRemaining = now > info.burstResetTime ? this.maxBurst : this.maxBurst - info.burstCount;

    return { remaining, burstRemaining };
  }
}

export default new RateLimiter();