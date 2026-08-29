import { Router } from 'express';
import { authLimiter } from '@/utils/rate-limit';
import {
  loginUser,
  refreshToken,
  registerUser,
  resendOtp,
  verifyOtp,
} from './auth.controller';

const router = Router();

router.post('/register', authLimiter, registerUser);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/login', authLimiter, loginUser);
router.post('/refresh-token', refreshToken);

export default router;
