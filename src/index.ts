import express, { type Request, type Response } from "express";

const app = express();
const port: number = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Halo! Ini server Express menggunakan TypeScript");
});

app.listen(port, () => {
  console.log(`⚡️ Server berjalan di http://localhost:${port}`);
});
