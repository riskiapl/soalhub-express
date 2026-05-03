import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getUser,
  registerUser,
  resendOtp,
  updateUser,
} from '../../controllers/user/user.controller';

const router = Router();

// Rate limit for user registration
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  message:
    'Too many registration attempts from this IP, please try again after 15 minutes',
});

// Rate limit for update user
const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message:
    'Too many update attempts from this IP, please try again after 15 minutes',
});

router.get('/:id', getUser);
router.post('/', registerLimiter, registerUser);
router.post('/resend-otp', resendOtp);
router.put('/:id', updateLimiter, updateUser);

export default router;
