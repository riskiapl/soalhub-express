import { Router } from 'express';
import { authenticateUser } from '@/middlewares/auth.middleware';
import { getUser, updateUser } from './user.controller';

const router = Router();

// Rute ini nanti terdaftar sebagai /api/v1/users/
router.get('/:id', authenticateUser, getUser);
router.put('/:id', authenticateUser, updateUser);

export default router;
