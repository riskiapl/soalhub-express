import "dotenv/config";
import express, { type Request, type Response } from "express";
import { PrismaClient } from "./generated/prisma/client.ts";
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
const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Halo! Ini server Express menggunakan TypeScript");
});

app.get("/db", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error mengakses database");
  }
});

app.listen(port, () => {
  console.log(`⚡️ Server berjalan di http://localhost:${port}`);
});
