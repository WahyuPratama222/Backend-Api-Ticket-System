// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ===== Clear existing data =====
  console.log("🗑️  Cleaning up existing data...");
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Cleanup completed");

  // ===== Hash password =====
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ===== Create Users =====
  console.log("👤 Creating users...");

  await prisma.user.createMany({
    data: [
      // Customers
      {
        name: "John Doe",
        email: "john@customer.com",
        password: hashedPassword,
        role: "customer",
      },
      {
        name: "Jane Smith",
        email: "jane@customer.com",
        password: hashedPassword,
        role: "customer",
      },
      {
        name: "Alice Wonder",
        email: "alice@customer.com",
        password: hashedPassword,
        role: "customer",
      },
      // Organizers
      {
        name: "Event Organizer Pro",
        email: "organizer@events.com",
        password: hashedPassword,
        role: "organizer",
      },
      {
        name: "Concert Master",
        email: "concert@events.com",
        password: hashedPassword,
        role: "organizer",
      },
    ],
  });

  // Get organizer IDs untuk create events
  const organizers = await prisma.user.findMany({
    where: { role: "organizer" },
  });

  const userCount = await prisma.user.count();
  console.log(`✅ Created ${userCount} users`);

  // ===== Create Events =====
  console.log("🎉 Creating events...");

  await prisma.event.createMany({
    data: [
      {
        organizerId: organizers[0].id,
        title: "Rock Concert 2025",
        location: "Jakarta International Stadium",
        capacity: 5000,
        availableSeat: 5000,
        price: 500000,
        status: "available",
        date: new Date("2025-12-31T19:00:00Z"),
      },
      {
        organizerId: organizers[1].id,
        title: "Tech Conference 2025",
        location: "Bali Convention Center",
        capacity: 1000,
        availableSeat: 1000,
        price: 1500000,
        status: "available",
        date: new Date("2025-11-15T09:00:00Z"),
      },
    ],
  });

  const eventCount = await prisma.event.count();
  console.log(`✅ Created ${eventCount} events`);

  // ===== Summary =====
  console.log("\n📊 Seeding Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`👥 Users: ${await prisma.user.count()}`);
  console.log(`   - Customers: 3`);
  console.log(`   - Organizers: 2`);
  console.log(`🎉 Events: ${eventCount}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n✅ Database seeding completed!");
  console.log("\n🔑 Test Credentials (All passwords: password123):");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n👥 Customers:");
  console.log("  • john@customer.com");
  console.log("  • jane@customer.com");
  console.log("  • alice@customer.com");
  console.log("\n🎤 Organizers:");
  console.log("  • organizer@events.com");
  console.log("  • concert@events.com");
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
