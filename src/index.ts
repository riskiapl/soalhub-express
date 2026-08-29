import express from 'express';
import 'dotenv/config';
import v1Router from './routes/v1';

// Pastikan DATABASE_URL sudah diatur di file .env
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

const app = express();
const port: number = Number(process.env.PORT) || 3000;

// Middleware Global
app.use(express.json());

// Health Check Endpoint
app.get('/health', (_req, res) => res.status(200).json({ status: 'OK' }));

// Trust Proxy (untuk mendukung rate limiting di belakang reverse proxy)
app.set('trust proxy', 1);

// API Versioning
app.use('/api/v1', v1Router);

// Start the server
app.listen(port, () => {
  console.log(`⚡️ Server berjalan di http://localhost:${port}`);
});
