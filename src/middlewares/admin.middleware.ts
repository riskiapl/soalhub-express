import type { NextFunction, Request, Response } from 'express';
import { prisma } from '@/config/db';

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Cek role user langsung ke database untuk keamanan real-time
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }, // Ambil role saja agar query lebih cepat
    });

    if (!user || user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Forbidden: Administrator access required' });
    }

    next();
  } catch (_error) {
    return res
      .status(500)
      .json({ message: 'Internal server error during role verification' });
  }
};
