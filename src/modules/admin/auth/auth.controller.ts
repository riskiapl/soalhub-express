import type { Request, Response } from 'express';
import { prisma } from '@/config/db';
import { comparePassword } from '@/utils/hash';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { catchErrorResponse } from '@/utils/response-handler';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email, deletedAt: null },
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // VALIDASI KRUSIAL: Tolak jika bukan Admin
    if (user.role !== 'ADMIN') {
      return res
        .status(403)
        .json({ message: 'Access denied: Not an administrator' });
    }

    // Cek Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(Number(user.id));
    const refreshToken = generateRefreshToken(Number(user.id));

    res.status(200).json({
      message: 'Admin login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        tokens: { accessToken, refreshToken },
      },
    });
  } catch (error) {
    catchErrorResponse(error, res);
  }
};
