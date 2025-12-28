import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // max 100 requests per window per IP
  message: {
    status: "error",
    message: "Terlalu banyak request dari IP ini, coba lagi dalam 15 menit",
  },
  standardHeaders: true, // Return rate limit info di headers `RateLimit-*`
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false, // Count semua requests
});

/**
 * Auth Rate Limiter
 * More strict - untuk login/register endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // max 5 login attempts per window
  message: {
    status: "error",
    message: "Terlalu banyak percobaan login, coba lagi dalam 15 menit",
  },
  skipSuccessfulRequests: true, // Tidak count request yang berhasil (status < 400)
  standardHeaders: true,
  legacyHeaders: false,
});

export const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 menit
  max: 10, // max 10 bookings dalam 5 menit
  message: {
    status: "error",
    message: "Terlalu banyak booking, coba lagi dalam beberapa menit",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
