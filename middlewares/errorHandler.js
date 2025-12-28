// middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  // Log error untuk debugging
  console.error("=== ERROR HANDLER ===");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("Code:", err.code);
  console.error("=====================");

  // ===== ZOD VALIDATION ERROR =====
  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      message: "Kesalahan validasi",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  // ===== PRISMA ERRORS =====

  // P2002: Unique constraint violation
  if (err.code === "P2002" && err.meta?.target) {
    const field = Array.isArray(err.meta.target)
      ? err.meta.target.join(", ")
      : err.meta.target;

    // Ubah nama field dari 'user_email_key' jadi 'email'
    const friendlyField = field.replace(/^user_|_key$/g, "");

    return res.status(400).json({
      status: "fail",
      message: `${friendlyField} sudah digunakan`,
    });
  }

  // P2025: Record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      status: "fail",
      message: "Data tidak ditemukan",
    });
  }

  // P2003: Foreign key constraint failed
  if (err.code === "P2003") {
    return res.status(400).json({
      status: "fail",
      message: "Referensi data tidak valid",
    });
  }

  // P2014: Invalid ID (relation violation)
  if (err.code === "P2014") {
    return res.status(400).json({
      status: "fail",
      message: "ID tidak valid",
    });
  }

  // Generic Prisma error
  if (err.code && err.code.startsWith("P")) {
    console.error("Unhandled Prisma Error Code:", err.code);
    return res.status(400).json({
      status: "fail",
      message: "Oprasi database gagal",
      code: err.code,
    });
  }

  // ===== CUSTOM NOT FOUND ERRORS =====
  const notFoundErrors = [
    "User tidak ditemukan",
    "Event tidak ditemukan",
    "Booking tidak ditemukan",
    "Ticket tidak ditemukan",
  ];

  if (notFoundErrors.includes(err.message)) {
    return res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }

  // ===== BUSINESS LOGIC / CUSTOM ERRORS =====
  const customErrors = {
    "Bukan pemilik event": 403,
    "Event tidak tersedia": 400,
    "Kursi tidak cukup": 400,
    "User ID tidak valid": 400,
    "Event ID tidak valid": 400,
    "Booking ID tidak valid": 400,
    "Ticket ID tidak valid": 400,
    "Email atau password salah": 401,
  };

  if (customErrors[err.message]) {
    return res.status(customErrors[err.message]).json({
      status: "fail",
      message: err.message,
    });
  }

  // ===== AUTH / PROTECT ERRORS =====
  const authErrors = [
    "Tidak terautentikasi, token tidak ditemukan",
    "Tidak terautentikasi, token tidak valid",
    "Tidak terautentikasi, user tidak ditemukan",
    "Token sudah kadaluarsa, silakan login kembali",
  ];

  if (authErrors.includes(err.message)) {
    return res.status(401).json({
      status: "fail",
      message: err.message,
    });
  }

  // ===== ROLE-BASED ERRORS =====
  if (err.message === "Akses ditolak, role user tidak sesuai") {
    return res.status(403).json({
      status: "fail",
      message: err.message,
    });
  }

  // ===== JWT ERRORS =====
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Token tidak valid",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token sudah kadaluarsa",
    });
  }

  // ===== FALLBACK: INTERNAL SERVER ERROR =====
  return res.status(500).json({
    status: "error",
    message: "Kesalahan server internal",
    ...(process.env.NODE_ENV === "development" && {
      error: err.message,
      stack: err.stack,
    }),
  });
};
