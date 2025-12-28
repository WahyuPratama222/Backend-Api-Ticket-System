// routers/index.js
import express from "express";

// Import all routes
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import eventRoutes from "./eventRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import ticketRoutes from "./ticketRoutes.js";

// Import rate limiters
import { authLimiter, bookingLimiter } from "../config/rateLimit.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server berjalan dengan baik",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Selamat Datang di API Sistem Ticket",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/login",
      users: "/users",
      events: "/events",
      bookings: "/bookings",
      tickets: "/tickets",
    },
  });
});

router.use("/login", authLimiter, authRoutes); // Apply auth rate limiter
router.use("/users", userRoutes);
router.use("/events", eventRoutes);
router.use("/bookings", bookingLimiter, bookingRoutes); // Apply booking rate limiter
router.use("/tickets", ticketRoutes);

export default router;
