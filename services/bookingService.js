import { prisma } from "../prisma/client.js";
import { generateTicketCode } from "../utils/generateTickets.js";

const bookingSelect = {
  id: true,
  eventId: true,
  quantity: true,
  totalPrice: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  tickets: {
    select: {
      id: true,
      holderName: true,
      ticketCode: true,
      status: true,
    },
  },
};

const createBookingService = async (customerId, data) => {
  const { eventId, quantity, holders } = data;

  return await prisma.$transaction(async (tx) => {
    // Lock row event
    const event = await tx.$queryRawUnsafe(
      `SELECT * FROM event WHERE id_event = ? FOR UPDATE`,
      eventId
    );

    if (!event[0]) throw new Error("Event tidak ditemukan");

    const eventRow = event[0];

    if (eventRow.status !== "available")
      throw new Error("Event tidak tersedia");
    if (eventRow.available_seat < quantity)
      throw new Error("Kursi tidak cukup");

    // Update availableSeat & status event
    await tx.event.update({
      where: { id: eventId },
      data: {
        availableSeat: eventRow.available_seat - quantity,
        status:
          eventRow.available_seat - quantity === 0
            ? "unavailable"
            : eventRow.status,
      },
    });

    // Buat booking dengan status pending
    const booking = await tx.booking.create({
      data: {
        customerId,
        eventId,
        quantity,
        totalPrice: eventRow.price * quantity,
        status: "pending",
      },
      select: bookingSelect,
    });

    // Validasi holders
    const finalHolders =
      Array.isArray(holders) && holders.length === quantity
        ? holders
        : Array.from({ length: quantity }, (_, i) => `Ticket ${i + 1}`);

    // Buat tiket
    const ticketsData = finalHolders.map((name) => ({
      bookingId: booking.id,
      holderName: name,
      ticketCode: generateTicketCode(10),
    }));
    await tx.ticket.createMany({ data: ticketsData });

    // Update status booking menjadi success setelah tiket berhasil dibuat
    const bookingUpdated = await tx.booking.update({
      where: { id: booking.id },
      data: { status: "success" },
      select: bookingSelect,
    });

    return bookingUpdated;
  });
};

// ===== Get All Bookings =====
const getAllBookingService = async () => {
  const bookings = await prisma.booking.findMany({
    select: bookingSelect,
  });
  return bookings;
};

// ===== Get Booking By ID =====
const getBookingByIdService = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    select: bookingSelect,
  });
  if (!booking) throw new Error("Booking not found");
  return booking;
};

export { createBookingService, getAllBookingService, getBookingByIdService };
