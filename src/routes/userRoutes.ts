import { Router } from 'express';
import { getUser, addUser } from '../controllers/userController';

const router = Router();

router.get('/:id', getUser);
router.post('/', addUser);

export default router;