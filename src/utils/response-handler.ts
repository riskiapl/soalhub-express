import type { Response } from 'express';
import { Prisma } from '@/generated/prisma/client';

export const catchErrorResponse = (error: unknown, res: Response) => {
  // 1. Tangani error spesifik dari Prisma (Known Request Errors)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        return res.status(409).json({
          message: 'Data sudah ada (duplikat).',
          target: error.meta?.target, // Opsional: memberi tahu field mana yang bentrok
        });
      case 'P2025': // Record not found
        return res.status(404).json({
          message: 'Data tidak ditemukan.',
        });
      case 'P2003': // Foreign key constraint failed
        return res.status(400).json({
          message:
            'Gagal menghapus atau mengubah data karena relasi data lain.',
        });
      default:
        // Kode error Prisma lainnya
        return res.status(400).json({
          message: `Database error: ${error.code}`,
        });
    }
  }

  // 2. Tangani error validasi Prisma (misal: salah tipe data)
  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      message: 'Data yang dikirim tidak valid.',
    });
  }

  // 3. Fallback untuk Error umum atau Internal Server Error
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';

  console.error('Unhandled Error:', error); // Tetap log ke server untuk debugging

  res.status(500).json({
    message: 'Terjadi kesalahan internal pada server.',
    // Hanya tampilkan detail error jika di lingkungan development
    ...(isDevelopment && { debug_error: errorMessage }),
  });
};
