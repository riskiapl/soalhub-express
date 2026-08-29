import { prisma } from '@/config/db';

export const createOtp = async (
  email: string,
  code: string,
  userId: number,
  expiresAt: Date,
) => {
  return await prisma.otp.upsert({
    where: { email },
    update: { code, userId, expiresAt },
    create: { email, code, userId, expiresAt },
  });
};

export const getOtpByEmail = async (email: string) => {
  return await prisma.otp.findUnique({
    where: { email },
  });
};