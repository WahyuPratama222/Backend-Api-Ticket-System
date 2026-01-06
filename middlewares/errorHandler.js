// middlewares/errorHandler.js

const logError = (err) => {
  // Log error untuk debugging
  console.error("=== ERROR HANDLER ===");
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("Code:", err.code);
  console.error("=====================");
};

export const errorHandler = (err, req, res, next) => {
  // Log Error (Debugging)
  logError(err);

  // ===== ZOD VALIDATION ERROR =====
  if (err.name === "ZodError") {
    return res.status(400).json({
      status: "fail",
      message: "Validation error",
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
      message: `${friendlyField}  is already in use`,
    });
  }

  // P2025: Record not found
  if (err.code === "P2025") {
    return res.status(404).json({
      status: "fail",
      message: "Data not found",
    });
  }

  // P2003: Foreign key constraint failed
  if (err.code === "P2003") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid data reference",
    });
  }

  // P2014: Invalid ID (relation violation)
  if (err.code === "P2014") {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  // Generic Prisma error
  if (err.code && err.code.startsWith("P")) {
    console.error("Unhandled Prisma Error Code:", err.code);
    return res.status(400).json({
      status: "fail",
      message: "Database operation failed",
    });
  }

  // ===== CUSTOM ERROR WITH STATUS CODE ====
  const errorMap = {
    //404 Errors
    "User not found": 404,
    "Event not found": 404,
    "Booking not found": 404,
    "Ticket not found": 404,

    //403 Errors
    "Not the event owner": 403,
    "Access denied": 403,

    //401 Errors
    "Invalid email or password": 401,
    "Not authenticated, token not found": 401,
    "Not authenticated, invalid token": 401,
    "Not authenticated, user not found": 401,
    "Token has expired, please log in again": 401,

    //400 Errors
    "Event not available": 400,
    "Not enough seats available": 400,
    "Ticket has already been used": 400,
    "Capacity cannot be less than": 400, // Partial match

    //403 Role-based
    "Access denied, user role does not match": 403,
  };

  //Check for exact match or partial match
  for (const [errorMsg, statusCode] of Object.entries(errorMap)) {
    if (err.message === errorMsg || err.message.includes(errorMsg)) {
      return res.status(statusCode).json({
        status: "fail",
        message: err.message,
      });
    }
  }

  // ===== JWT ERRORS =====
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "fail",
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "fail",
      message: "Token has expired",
    });
  }

  // ===== FALLBACK: INTERNAL SERVER ERROR =====
  return res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
