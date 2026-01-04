import { z } from "zod";

const createBookingValidation = z.object({
  eventId: z.coerce
    .number()
    .int()
    .positive({ message: "Event ID must be a positive integer" }),
  quantity: z.coerce
    .number()
    .int()
    .min(1, { message: "Minimum booking is 1 ticket" }),
  holders: z.array(z.string().min(1)).optional(),
});

const getBookingByIdValidation = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: "Booking ID must be a positive integer" }),
});

export { createBookingValidation, getBookingByIdValidation };
