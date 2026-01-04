import { prisma } from "../prisma/client.js";

const eventSelect = {
  id: true,
  title: true,
  location: true,
  capacity: true,
  availableSeat: true,
  price: true,
  status: true,
  date: true,
  createdAt: true,
  updatedAt: true,
};

// ===== Create Event =====
const createEventService = async (organizerId, data) => {
  const organizer = await prisma.user.findUnique({
    where: { id: organizerId },
    select: { role: true },
  });

  if (!organizer || organizer.role !== "organizer") {
    throw new Error("Invalid user or not an organizer");
  }

  const event = await prisma.event.create({
    data: {
      organizerId,
      title: data.title,
      location: data.location,
      capacity: data.capacity,
      availableSeat: data.capacity,
      price: data.price,
      date: data.date,
      status: "available",
    },
    select: eventSelect,
  });

  return event;
};

// ===== Get All Events =====
const getAllEventService = async () => {
  const events = await prisma.event.findMany({
    select: eventSelect,
  });
  return events;
};

// ===== Get Event By ID =====
const getEventByIdService = async (id) => {
  const event = await prisma.event.findUnique({
    where: { id },
    select: eventSelect,
  });
  if (!event) throw new Error("Event not found");
  return event;
};

// ===== Update Event =====
const updateEventService = async (eventId, organizerId, data) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      bookings: { where: { status: "success" }, select: { quantity: true } },
    },
  });

  if (!event) throw new Error("Event not found");
  if (event.organizerId !== organizerId) throw new Error("Not the event owner");

  const totalBooked = event.bookings.reduce((sum, b) => sum + b.quantity, 0);

  const newCapacity = data.capacity ?? event.capacity;
  if (newCapacity < totalBooked) {
    throw new Error(`Capacity cannot be less than ${totalBooked}`);
  }

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      location: data.location,
      capacity: newCapacity,
      availableSeat: newCapacity - totalBooked,
      price: data.price,
      date: data.date,
      status: newCapacity - totalBooked === 0 ? "unavailable" : "available",
    },
    select: eventSelect,
  });

  return updatedEvent;
};

// ===== Soft Delete Event =====
const deleteEventService = async (eventId, organizerId) => {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { organizerId, status: true },
  });

  if (!event) throw new Error("Event not found");
  if (event.organizerId !== organizerId) throw new Error("Not the event owner");
  if (event.status !== "available") throw new Error("Event not available");

  await prisma.event.update({
    where: { id: eventId },
    data: { status: "unavailable" },
  });
};

export {
  createEventService,
  getAllEventService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
};
