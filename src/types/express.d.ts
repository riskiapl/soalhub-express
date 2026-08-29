declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}

export {}; // Penting agar file ini dianggap sebagai modul oleh TypeScript
