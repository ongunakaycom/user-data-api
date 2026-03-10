import { Request, Response } from 'express';
import cacheService from '../services/cacheService';

export const clearCache = (req: Request, res: Response): void => {
  cacheService.clear();
  res.json({ message: 'Cache cleared successfully' });
};

export const getCacheStatus = (req: Request, res: Response): void => {
  const stats = cacheService.getStats();
  res.json({
    ...stats,
    avgResponseTime: `${stats.avgResponseTime.toFixed(2)}ms`
  });
};