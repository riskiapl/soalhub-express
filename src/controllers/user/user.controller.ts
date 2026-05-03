import { addMinutes, isAfter } from 'date-fns';
import type { Request, Response } from 'express';
import * as userService from '../../services/user/user.service';

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await userService.getUserById(Number(id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(error, 'masuk error');
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, Email, and Password is required' });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 8 characters long' });
    }

    if (password.length > 30) {
      return res
        .status(400)
        .json({ message: 'Maximum password length is 30 characters' });
    }

    const user = await userService.createUser(name, email, password);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP 6 digit
    const expiresAt = addMinutes(new Date(), 5); // OTP expires in 5 minutes
    await userService.craeteOtp(email, otp, expiresAt);

    res.status(201).json({
      message: 'User successfully registered',
      data: user,
    });
  } catch (error) {
    // Cek jika email duplikat (P2002 adalah kode error Prisma untuk unique constraint)
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, code } = req.body;

    if (code) {
      if (!email) {
        return res
          .status(400)
          .json({ message: 'Email is required for OTP verification' });
      }

      const otpRecord = await userService.getOtpByEmail(email);

      if (!otpRecord || otpRecord.code !== code) {
        return res.status(400).json({ message: 'Invalid OTP code' });
      }

      if (isAfter(new Date(), otpRecord.expiresAt)) {
        return res.status(400).json({ message: 'OTP code has expired' });
      }

      const updatedUser = await userService.updateUser(Number(id), {
        isActive: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'User successfully updated',
        data: updatedUser,
      });
    } else {
      const updatedUser = await userService.updateUser(Number(id), {
        name,
        email,
        password,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        message: 'User successfully updated',
        data: updatedUser,
      });
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage });
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

    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP 6 digit
    const expiresAt = addMinutes(new Date(), 5); // OTP expires in 5 minutes
    await userService.craeteOtp(email, otp, expiresAt);

    res.status(200).json({
      message: 'OTP successfully resent',
      data: {
        email,
        expiresAt,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: errorMessage });
  }
};
