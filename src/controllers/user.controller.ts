import { type Request, type Response } from "express";
import * as userService from "../services/user.service";
import { addMinutes, isAfter } from "date-fns";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (id) {
      const user = await userService.getUserById(Number(id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } else {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    }
  } catch (error: any) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, Email, and Password is required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (password.length > 30) {
      return res
        .status(400)
        .json({ message: "Maximum password length is 30 characters" });
    }

    const user = await userService.createUser(name, email, password);

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP 6 digit
    const expiresAt = addMinutes(new Date(), 5); // OTP expires in 5 minutes
    await userService.craeteOtp(email, otp, expiresAt);

    res.status(201).json({
      message: "User successfully registered",
      data: user,
    });
  } catch (error: any) {
    // Cek jika email duplikat (P2002 adalah kode error Prisma untuk unique constraint)
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already registered" });
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
          .json({ message: "Email is required for OTP verification" });
      }

      const otpRecord = await userService.getOtpByEmail(email);

      if (!otpRecord || otpRecord.code !== code) {
        return res.status(400).json({ message: "Invalid OTP code" });
      }

      if (isAfter(new Date(), otpRecord.expiresAt)) {
        return res.status(400).json({ message: "OTP code has expired" });
      }

      const updatedUser = await userService.updateUser(Number(id), {
        isActive: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User successfully updated",
        data: updatedUser,
      });
    } else {
      const updatedUser = await userService.updateUser(Number(id), {
        name,
        email,
        password,
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "User successfully updated",
        data: updatedUser,
      });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(Number(id));

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User successfully deleted",
      data: deletedUser,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
