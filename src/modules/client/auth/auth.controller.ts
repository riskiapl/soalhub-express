import { addMinutes, isAfter } from 'date-fns';
import type { Request, Response } from 'express';
import { comparePassword } from '@/utils/hash';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { catchErrorResponse } from '@/utils/response-handler';
import * as userService from '../users/user.service';
import * as authService from './auth.service';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, Email, and Password are required' });
    }

    if (password.length < 8 || password.length > 30) {
      return res
        .status(400)
        .json({ message: 'Password must be between 8 and 30 characters' });
    }

    // Buat User
    const user = await userService.createUser(name, email, password);

    // Buat OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = addMinutes(new Date(), 5);
    await authService.createOtp(email, otp, Number(user.id), expiresAt);

    res.status(201).json({
      message: 'User successfully registered',
      data: user,
    });
  } catch (error) {
    catchErrorResponse(error, res);
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: 'Email is required for OTP verification' });
    }

    // Menggunakan fungsi khusus yang mengizinkan user belum aktif (isActive: false)
    const user = await userService.getAnyUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = addMinutes(new Date(), 5);
    await authService.createOtp(email, otp, Number(user.id), expiresAt);

    res.status(200).json({
      message: 'OTP successfully resent',
      data: { email, expiresAt },
    });
  } catch (error) {
    catchErrorResponse(error, res);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: 'Email and OTP code are required' });
    }

    const otpRecord = await authService.getOtpByEmail(email);

    if (!otpRecord || otpRecord.code !== code) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (isAfter(new Date(), otpRecord.expiresAt)) {
      return res.status(400).json({ message: 'OTP code has expired' });
    }

    // Update status user menjadi aktif
    const updatedUser = await userService.updateUser(Number(otpRecord.userId), {
      isActive: true,
    });

    res.status(200).json({
      message: 'OTP verification successful',
      data: updatedUser,
    });
  } catch (error) {
    catchErrorResponse(error, res);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    // Cari user (hanya user yang sudah aktif/terverifikasi)
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials or account not active' });
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate Tokens
    const accessToken = generateAccessToken(Number(user.id));
    const refreshToken = generateRefreshToken(Number(user.id));

    res.status(200).json({
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  } catch (error) {
    catchErrorResponse(error, res);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verifikasi validitas Refresh Token
    const decoded = verifyRefreshToken(refreshToken);

    // Keamanan Tambahan: Pastikan user masih ada & aktif di database
    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ message: 'User no longer exists or is disabled' });
    }

    // Generate Access Token BARU
    const newAccessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      message: 'Token successfully refreshed',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (_error) {
    // Jika JWT expired atau invalid, akan masuk ke catch ini
    return res.status(401).json({
      message: 'Invalid or expired refresh token. Please login again.',
    });
  }
};
