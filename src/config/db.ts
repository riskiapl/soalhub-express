import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";

const { Pool } = pkg;

// Pastikan DATABASE_URL sudah diatur di file .env
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env file");
}

// Inisialisasi Prisma Client dengan adapter PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Ekspor prisma client untuk digunakan di seluruh aplikasi
export const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});
