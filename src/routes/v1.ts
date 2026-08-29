import { Router } from 'express';
import adminUserRoutes from '@/modules/admin/users/user.route';
import clientUserRoutes from '@/modules/client/users/user.route';

const v1Router = Router();

// Client Routes
v1Router.use('/users', clientUserRoutes);

// Admin Routes
v1Router.use('/admin/users', adminUserRoutes);

export default v1Router;
