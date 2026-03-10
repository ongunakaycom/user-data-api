import { Router } from 'express';
import { deleteCache, cacheStatus } from '../controllers/cacheController';

const router = Router();

router.delete('/', deleteCache);
router.get('/status', cacheStatus);

export default router;