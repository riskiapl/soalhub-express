import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '@/utils/jwt';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    // Pastikan header ada dan menggunakan format 'Bearer <token>'
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    // Verifikasi token (jika expired, akan otomatis melempar error ke catch)
    const decoded = verifyAccessToken(token);

    // Sisipkan userId ke dalam request agar bisa dibaca oleh controller
    req.user = {
      userId: decoded.userId,
    };

    next(); // Lanjutkan ke controller
  } catch (_error) {
    return res
      .status(401)
      .json({ message: 'Unauthorized: Invalid or expired token' });
  }
};
