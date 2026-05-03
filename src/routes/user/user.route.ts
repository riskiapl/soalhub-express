import { Router } from 'express';
import {
  getUser,
  registerUser,
  resendOtp,
  updateUser,
  verifyOtp,
} from '@/controllers/user/user.controller';
import { authLimiter } from '@/utils/rate-limit';

const router = Router();

router.get('/:id', getUser);
router.post('/', authLimiter, registerUser);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.put('/:id', authLimiter, updateUser);

export default router;
