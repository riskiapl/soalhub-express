import { Router } from 'express';
import { verifyAdmin } from '@/middlewares/admin.middleware';
import { authenticateUser } from '@/middlewares/auth.middleware';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from './user.controller';

const router = Router();

router.use(authenticateUser, verifyAdmin);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
