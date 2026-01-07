import { z } from "zod";

const envSchema = z.object({
  SERVER_PORT: z
    .string()
    .optional()
    .transform((rawPort) => {
      if (rawPort === undefined || rawPort.trim() === "") return undefined;
      const port = Number(rawPort);
      if (!Number.isInteger(port) || port <= 0) {
        throw new Error("SERVER_PORT harus integer positif");
      }
      return port;
    })
    .default(5000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi").url(),
  JWT_SECRET: z.string().min(10, "JWT_SECRET minimal 10 karakter"),
});

export const env = envSchema.parse(process.env);
