import { Request, Response } from 'express';
import { clearCache, getCacheStats } from '../services/cacheService';

export const deleteCache = (req: Request, res: Response) => {
  clearCache();
  res.json({ message: 'Cache cleared' });
};

export const cacheStatus = (req: Request, res: Response) => {
  res.json(getCacheStats());
};