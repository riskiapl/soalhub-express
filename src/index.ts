import 'dotenv/config';
import express from 'express';
import userRoutes from './routes/user.route';

// Pastikan DATABASE_URL sudah diatur di file .env
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

const app = express();
const port: number = Number(process.env.PORT) || 3000;
app.use(express.json());

// Routes
app.use('/users', userRoutes);

// Health Check Endpoint
app.listen(port, () => {
  console.log(`⚡️ Server berjalan di http://localhost:${port}`);
});
