import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP dalam 15 menit
  standardHeaders: true, // Mengirimkan header `RateLimit-*` standar IETF
  legacyHeaders: false, // Mematikan header lawas `X-RateLimit-*`
  message: {
    message:
      'Too many requests from this IP, please try again after 15 minutes',
  },
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit (lebih toleran terhadap kesalahan ketik user)
  max: 10, // Maksimal 10 request per IP dalam 5 menit
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Terlalu banyak percobaan, silakan coba lagi dalam 5 menit',
  },
});
