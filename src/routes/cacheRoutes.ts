import { Router } from 'express';
import { clearCache, getCacheStatus } from '../controllers/cacheController';

const router: Router = Router(); // Add explicit type

router.delete('/', clearCache);
router.get('/status', getCacheStatus);

export default router;