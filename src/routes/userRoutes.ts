import { Router } from 'express';
import { 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  getAllUsers 
} from '../controllers/userController';

const router: Router = Router(); // Add explicit type

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;