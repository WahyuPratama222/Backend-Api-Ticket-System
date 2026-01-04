import { prisma } from "../prisma/client.js";

const ticketSelect = {
  id: true,
  bookingId: true,
  holderName: true,
  ticketCode: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

// ===== Get All Ticket =====
const getAllTicketService = async () => {
  const tickets = await prisma.ticket.findMany({
    select: ticketSelect,
  });
  return tickets;
};

// ===== Get Ticket By ID =====
const getTicketByIdService = async (id) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    select: ticketSelect,
  });
  if (!ticket) throw new Error("Ticket not found");
  return ticket;
};

// ===== Use Ticket =====
const markTicketUsedService = async (id) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
  });
  if (!ticket) throw new Error("Ticket not found");
  if (ticket.status === "used") throw new Error("Ticket has already been used");

  const updatedTicket = await prisma.ticket.update({
    where: { id },
    data: { status: "used" },
    select: ticketSelect,
  });

  return updatedTicket;
};

export { getAllTicketService, getTicketByIdService, markTicketUsedService };
