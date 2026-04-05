import { type Request, type Response } from "express";
import * as userService from "../services/user.service";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ message: "Gagal mengambil data user" });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name dan Email wajib diisi" });
    }

    const user = await userService.createUser(name, email);
    res.status(201).json({
      message: "User berhasil dibuat",
      data: user,
    });
  } catch (error: any) {
    // Cek jika email duplikat (P2002 adalah kode error Prisma untuk unique constraint)
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
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
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: "User berhasil dihapus",
      data: deletedUser,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
