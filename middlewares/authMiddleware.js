// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { prisma } from "../prisma/client.js";

// ===== Protect Middleware =====
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Extract token dari Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Check if token exists
  if (!token) {
    throw new Error("Tidak terautentikasi, token tidak ditemukan");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("Tidak terautentikasi, user tidak ditemukan");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle JWT specific errors
    if (error.name === "JsonWebTokenError") {
      throw new Error("Tidak terautentikasi, token tidak valid");
    }
    if (error.name === "TokenExpiredError") {
      throw new Error("Token sudah kadaluarsa, silakan login kembali");
    }

    // Re-throw other errors
    throw error;
  }
});

// ===== Role-based Authorization Middleware =====
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be attached by protect middleware)
    if (!req.user) {
      throw new Error("Tidak terautentikasi");
    }

    // Check if user role is allowed
    if (!roles.includes(req.user.role)) {
      throw new Error("Akses ditolak, role user tidak sesuai");
    }

    next();
  };
};

// ===== Optional Auth Middleware (tidak wajib login) =====
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If no token, just continue (user tetap undefined)
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Silently fail, just continue without user
  }

  next();
});
