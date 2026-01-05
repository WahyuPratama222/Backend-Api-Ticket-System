import { z } from "zod";

const envSchema = z.object ({
  SERVER_PORT: z.coerce.number().default("5000"),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10),
});

export const env = envSchema.parse(process.env);
