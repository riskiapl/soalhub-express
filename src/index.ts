import express, { Router } from 'express';
import 'dotenv/config';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';

// Pastikan DATABASE_URL sudah diatur di file .env
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

const app = express();
const port: number = Number(process.env.PORT) || 3000;
app.use(express.json());

const v1Router = Router();

// Routes
v1Router.use('/', userRoutes);
v1Router.use('/admin', adminRoutes);

app.use('/api/v1', v1Router);

// Health Check Endpoint
app.listen(port, () => {
  console.log(`⚡️ Server berjalan di http://localhost:${port}`);
});
