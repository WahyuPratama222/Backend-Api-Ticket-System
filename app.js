// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// ===== Configuration Imports =====
import { corsOptions } from "./config/cors.js";
import { globalLimiter } from "./config/rateLimit.js";
import {
  helmetOptions,
  jsonParserOptions,
  urlEncodedOptions,
} from "./config/security.js";

// ===== Middleware Imports =====
import { errorHandler } from "./middlewares/errorHandler.js";
import { requestLogger } from "./middlewares/requestLogger.js";

// ===== Routes Import =====
import apiRoutes from "./routers/index.js";

// ===== Initialize Express App =====
const app = express();

// ===== Trust Proxy =====
// Enable jika pakai reverse proxy (nginx, load balancer, dll)
app.set("trust proxy", 1);

// ===== Security Middleware =====
app.use(helmet(helmetOptions)); // Security headers
app.use(cors(corsOptions)); // CORS configuration
app.use(globalLimiter); // Rate limiting

// ===== Body Parsers =====
app.use(express.json(jsonParserOptions));
app.use(express.urlencoded(urlEncodedOptions));

// ===== Compression =====
app.use(compression()); // Gzip compression

// ===== Request Logging =====
// Only in development mode
if (process.env.NODE_ENV !== "production") {
  app.use(requestLogger);
}

// ===== API Routes =====
// All routes mounted under root
app.use("/", apiRoutes);

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===== Error Handler =====
// Must be the last middleware
app.use(errorHandler);

export default app;
