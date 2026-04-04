import "dotenv/config";
import express, { type Request, type Response } from "express";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Halo! Ini server Express menggunakan TypeScript");
});

app.get("/db", async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    res.json(result.rows[0]);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error mengakses database");
  }
});

app.listen(port, () => {
  console.log(`⚡️ Server berjalan di http://localhost:${port}`);
});
