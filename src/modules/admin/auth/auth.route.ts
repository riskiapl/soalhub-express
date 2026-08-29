import { Router } from 'express';
import { authLimiter } from '@/utils/rate-limit';
import { loginAdmin } from './auth.controller';

const router = Router();

router.post('/login', authLimiter, loginAdmin);

export default router;
