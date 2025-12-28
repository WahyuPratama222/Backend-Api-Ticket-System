export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log setelah response selesai
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const statusColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m";
    const resetColor = "\x1b[0m";

    console.log(
      `${statusColor}${req.method}${resetColor} ${req.originalUrl} - ${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
    );
  });

  next();
};
