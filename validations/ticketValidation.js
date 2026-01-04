import { z } from "zod";

const getTicketByIdValidation = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: "Ticket ID must be a positive integer" }),
});

const markTicketUsedValidation = z.object({
  id: z.coerce
    .number()
    .int()
    .positive({ message: "Ticket ID must be a positive integer" }),
});

export { getTicketByIdValidation, markTicketUsedValidation };
