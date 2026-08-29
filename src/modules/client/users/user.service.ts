import { prisma } from '@/config/db';
import { hashPassword } from '@/utils/hash';

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id, deletedAt: null, isActive: true },
  });
};

// Hanya mengambil user yang sudah aktif (untuk login/profil)
export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email, deletedAt: null, isActive: true },
  });
};

// Fungsi baru: Mengambil user meskipun belum aktif (dibutuhkan oleh resend-otp)
export const getAnyUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email, deletedAt: null },
  });
};

export const createUser = async (name: string, email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  return await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
};

interface UpdateData {
  name?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
}

export const updateUser = async (id: number, data: UpdateData) => {
  const updateData: UpdateData = { ...data };
  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  return await prisma.user.update({
    where: { id },
    data: updateData,
  });
};