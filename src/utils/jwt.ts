import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_SECRET || 'default_access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh';

export const generateAccessToken = (userId: number) => {
  // Access Token biasanya berumur pendek (contoh: 15 menit atau 1 jam)
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: '1h' });
};

export const generateRefreshToken = (userId: number) => {
  // Refresh Token berumur lebih panjang (contoh: 7 hari atau 30 hari)
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET) as { userId: number };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET) as { userId: number };
};
