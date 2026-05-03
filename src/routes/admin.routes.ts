import { Router } from 'express';
import userRoutes from './admin/user.route';

const router = Router();

router.use('/user', userRoutes);

export default router;
