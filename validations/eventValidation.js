import { z } from "zod";

const createEventValidation = z.object({
  title: z.string().min(1, { message: "Event title is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  capacity: z.number().int().min(5, { message: "Minimum capacity is 5" }),
  price: z.number().int().min(0, { message: "Price must be a positive number" }),
  date: z.coerce
    .date({ message: "Invalid event date" })
    .refine((d) => d.getTime() > Date.now(), {
      message: "Event date must be in the future",
    }),
});

const getEventByIdValidation = z.object({
  id: z.coerce.number().int().positive({
    message: "Event ID must be a positive integer",
  }),
});

const patchEventValidation = createEventValidation
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

export { createEventValidation, getEventByIdValidation, patchEventValidation };
