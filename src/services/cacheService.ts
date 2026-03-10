import LRU from 'lru-cache';
import { User } from '../types/user';

interface CacheStats {
  hits: number;
  misses: number;
}

const options = {
  max: 100, // max items
  ttl: 1000 * 60 // 60 seconds
};

const cache = new LRU<string, User>(options);
const stats: CacheStats = { hits: 0, misses: 0 };

// Auto cleanup (optional, LRU does it internally)
setInterval(() => {
  cache.purgeStale();
}, 1000 * 10);

export const getCache = (id: string): User | undefined => {
  const data = cache.get(id);
  if (data) stats.hits++;
  else stats.misses++;
  return data;
};

export const setCache = (id: string, user: User) => {
  if (!cache.has(id)) cache.set(id, user);
};

export const clearCache = () => cache.clear();
export const getCacheStats = () => ({
  hits: stats.hits,
  misses: stats.misses,
  size: cache.size
});