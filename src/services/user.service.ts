import { prisma } from '../config/db';
import { hashPassword } from '../utils/hash';

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: { deletedAt: null, isActive: true },
    take: 10,
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id, deletedAt: null, isActive: true },
  });
};

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email, deletedAt: null, isActive: true },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  // Hash password sebelum disimpan ke database
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

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id, deletedAt: null, isActive: true },
  });
};

export const craeteOtp = async (
  email: string,
  code: string,
  expiresAt: Date,
) => {
  return await prisma.otp.upsert({
    where: { email },
    update: { code, expiresAt },
    create: { email, code, expiresAt },
  });
};

export const getOtpByEmail = async (email: string) => {
  return await prisma.otp.findUnique({
    where: { email },
  });
};
