import { z } from "zod";

const createUserValidation = z.object({
  name: z
    .string("Name is required")
    .min(1, { message: "Name must be at least 1 character long" }),
  email: z.email({ message: "Invalid email format" }),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  role: z.enum(["customer", "organizer"], {
    message: "Invalid role. Must be 'customer' or 'organizer'",
  }),
});

const getUserByIdValidation = z.object({
  id: z.coerce.number().int().positive({
    message: "User ID must be a positive integer",
  }),
});

const patchUserValidation = createUserValidation
  .omit({ role: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

export { createUserValidation, getUserByIdValidation, patchUserValidation };
