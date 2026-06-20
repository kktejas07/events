import { PrismaClient, Role, SponsorTier, OrderStatus, TicketStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function generateBarcode(): string {
  return "EVT-" + crypto.randomBytes(8).toString("hex").toUpperCase();
}

async function main() {
  console.log("Seeding database...");

  // Clear existing data in dependency order
  await prisma.scanLog.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.discountCode.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.eventSponsor.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.scheduleSession.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@eventsplatform.com" },
    update: {},
    create: {
      email: "admin@eventsplatform.com",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "User",
      role: Role.ADMIN,
    },
  });
  console.log("Created admin:", admin.email);

  // Create sample user
  const userHash = await bcrypt.hash("user1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      passwordHash: userHash,
      firstName: "John",
      lastName: "Doe",
    },
  });
  console.log("Created user:", user.email);

  // Create venue
  const venue = await prisma.venue.create({
    data: {
      name: "San Francisco Tech Pavilion",
      address: "121 AI Blvd",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      zipCode: "94107",
    },
  });

  // Create event
  const event = await prisma.event.create({
    data: {
      title: "AI Summit 2026",
      slug: "ai-summit-2026",
      description:
        "Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work. 5 days of keynotes, workshops, and networking with 50 world-class speakers.",
      shortDescription: "A global gathering of AI innovators",
      startDate: new Date("2026-10-01T10:00:00Z"),
      endDate: new Date("2026-10-05T18:00:00Z"),
      timezone: "America/Los_Angeles",
      venueId: venue.id,
      category: "Technology",
      status: "PUBLISHED",
      isFeatured: true,
    },
  });
  console.log("Created event:", event.title);

  // Create ticket types
  const ticketTypes = await Promise.all([
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Standard",
        price: 299,
        quantityLimit: 500,
        perks: [
          "Access to keynotes and sessions",
          "Admission to exhibitions and demos",
          "Networking opportunities",
          "Digital materials and session recordings",
        ],
        color: "#6C5CE7",
        sortOrder: 1,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "VIP",
        price: 699,
        quantityLimit: 200,
        perks: [
          "All Standard benefits",
          "VIP lounge access and exclusive events",
          "Front-row seating and priority workshop access",
          "VIP swag bag and exclusive content",
        ],
        color: "#00CEC9",
        sortOrder: 2,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Full Access",
        price: 1199,
        quantityLimit: 100,
        perks: [
          "All VIP benefits",
          "Access to all workshops and breakout sessions",
          "Personalized session scheduling",
          "Speaker meet-and-greet and after-party access",
        ],
        color: "#FDCB6E",
        sortOrder: 3,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Student",
        price: 149,
        quantityLimit: 300,
        perks: [
          "Access to keynotes and workshops",
          "Student-specific networking events",
          "Discounted online resources post-event",
          "Special student meetups for networking",
        ],
        color: "#00B894",
        sortOrder: 4,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: event.id,
        name: "Virtual",
        price: 99,
        quantityLimit: 1000,
        perks: [
          "Live-streamed keynotes and workshops",
          "On-demand access to recorded sessions",
          "Interactive Q&A with speakers",
          "Virtual networking and digital swag",
        ],
        color: "#E17055",
        sortOrder: 5,
      },
    }),
  ]);
  console.log(`Created ${ticketTypes.length} ticket types`);

  // Create speakers
  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        firstName: "Joshua",
        lastName: "Henry",
        title: "Chief AI Scientist",
        company: "OpenAI",
        bio: "Leading AI researcher with over 15 years of experience in machine learning and deep neural networks.",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Leila",
        lastName: "Zhang",
        title: "VP of Machine Learning",
        company: "Google",
        bio: "Expert in building human-centered AI products and scalable ML infrastructure.",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Carlos",
        lastName: "Rivera",
        title: "Founder & CEO",
        company: "NeuralCore",
        bio: "Serial entrepreneur focused on AI policy, regulation, and ethical deployment.",
      },
    }),
  ]);
  console.log(`Created ${speakers.length} speakers`);

  // Create schedule sessions
  await Promise.all([
    prisma.scheduleSession.create({
      data: {
        eventId: event.id,
        title: "Opening Keynote — The State of AI 2026",
        description:
          "Kick off the event with an insightful overview of where artificial intelligence is headed.",
        startTime: new Date("2026-10-01T08:00:00Z"),
        endTime: new Date("2026-10-01T10:00:00Z"),
        room: "Main Hall",
        day: 1,
        speakerId: speakers[0].id,
      },
    }),
    prisma.scheduleSession.create({
      data: {
        eventId: event.id,
        title: "Building Human-Centered AI Products",
        description:
          "Design AI solutions that prioritize usability, fairness, and real-world impact.",
        startTime: new Date("2026-10-01T12:00:00Z"),
        endTime: new Date("2026-10-01T14:00:00Z"),
        room: "Workshop A",
        day: 1,
        speakerId: speakers[1].id,
      },
    }),
    prisma.scheduleSession.create({
      data: {
        eventId: event.id,
        title: "AI Policy & Regulation — A Global Overview",
        description: "How nations are approaching AI governance, data privacy, and accountability.",
        startTime: new Date("2026-10-01T16:00:00Z"),
        endTime: new Date("2026-10-01T18:00:00Z"),
        room: "Panel Room",
        day: 1,
        speakerId: speakers[2].id,
      },
    }),
  ]);
  console.log("Created schedule sessions");

  // Create sponsors
  const sponsors = await Promise.all([
    prisma.sponsor.create({
      data: {
        name: "TechCorp",
        logoUrl: "",
        websiteUrl: "https://techcorp.com",
        tier: SponsorTier.PLATINUM,
        sortOrder: 1,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: "DataFlow",
        logoUrl: "",
        websiteUrl: "https://dataflow.com",
        tier: SponsorTier.GOLD,
        sortOrder: 2,
      },
    }),
    prisma.sponsor.create({
      data: {
        name: "CloudNine",
        logoUrl: "",
        websiteUrl: "https://cloudnine.com",
        tier: SponsorTier.SILVER,
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`Created ${sponsors.length} sponsors`);

  // Link sponsors to event
  for (const sponsor of sponsors) {
    await prisma.eventSponsor.create({
      data: {
        eventId: event.id,
        sponsorId: sponsor.id,
      },
    });
  }

  // Create FAQs
  await Promise.all([
    prisma.fAQ.create({
      data: {
        eventId: event.id,
        question: "What is the AI Summit 2026?",
        answer:
          "A premier event gathering leading AI experts, thought leaders, and innovators featuring keynotes, workshops, panels, and networking.",
        sortOrder: 1,
      },
    }),
    prisma.fAQ.create({
      data: {
        eventId: event.id,
        question: "How can I register for the event?",
        answer:
          "You can register through our official website. Simply choose your ticket type and fill out the registration form.",
        sortOrder: 2,
      },
    }),
    prisma.fAQ.create({
      data: {
        eventId: event.id,
        question: "Can I transfer my ticket to someone else?",
        answer:
          "Tickets are transferable up to 7 days before the event. Please contact our support team for assistance.",
        sortOrder: 3,
      },
    }),
    prisma.fAQ.create({
      data: {
        eventId: event.id,
        question: "Will there be virtual participation?",
        answer:
          "Yes! Virtual tickets are available providing access to live-streamed sessions, workshops, and networking online.",
        sortOrder: 4,
      },
    }),
  ]);
  console.log("Created FAQs");

  // Create more sample users
  const moreUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: "sarah@example.com" },
      update: {},
      create: {
        email: "sarah@example.com",
        passwordHash: await bcrypt.hash("user1234", 12),
        firstName: "Sarah",
        lastName: "Johnson",
        company: "TechCorp",
        jobTitle: "Product Manager",
      },
    }),
    prisma.user.upsert({
      where: { email: "mike@example.com" },
      update: {},
      create: {
        email: "mike@example.com",
        passwordHash: await bcrypt.hash("user1234", 12),
        firstName: "Mike",
        lastName: "Chen",
        company: "DataFlow Inc.",
        jobTitle: "Software Engineer",
      },
    }),
    prisma.user.upsert({
      where: { email: "priya@example.com" },
      update: {},
      create: {
        email: "priya@example.com",
        passwordHash: await bcrypt.hash("user1234", 12),
        firstName: "Priya",
        lastName: "Sharma",
        company: "CloudNine",
        jobTitle: "Data Scientist",
      },
    }),
    prisma.user.upsert({
      where: { email: "alex@example.com" },
      update: {},
      create: {
        email: "alex@example.com",
        passwordHash: await bcrypt.hash("user1234", 12),
        firstName: "Alex",
        lastName: "Rivera",
        role: Role.USER,
      },
    }),
  ]);
  console.log(`Created ${moreUsers.length} additional users`);

  // Create demo orders and tickets
  const allUsers = [admin, user, ...moreUsers];
  const demoOrders = [
    { user: allUsers[1], typeIndex: 0, qty: 2 }, // John - 2 Standard
    { user: allUsers[2], typeIndex: 1, qty: 1 }, // Sarah - 1 VIP
    { user: allUsers[3], typeIndex: 0, qty: 1 }, // Mike - 1 Standard
    { user: allUsers[3], typeIndex: 4, qty: 1 }, // Mike - 1 Virtual
    { user: allUsers[4], typeIndex: 3, qty: 1 }, // Priya - 1 Student
  ];

  for (const demo of demoOrders) {
    const tt = ticketTypes[demo.typeIndex];
    const total = Number(tt.price) * demo.qty;

    const order = await prisma.order.create({
      data: {
        userId: demo.user.id,
        eventId: event.id,
        subtotal: total,
        total: total,
        currency: "INR",
        status: OrderStatus.PAID,
        razorpayPaymentId: `pay_demo_${crypto.randomBytes(4).toString("hex")}`,
        items: {
          create: {
            ticketTypeId: tt.id,
            quantity: demo.qty,
            unitPrice: tt.price,
            totalPrice: total,
          },
        },
      },
    });

    for (let i = 0; i < demo.qty; i++) {
      await prisma.ticket.create({
        data: {
          orderId: order.id,
          eventId: event.id,
          ticketTypeId: tt.id,
          userId: demo.user.id,
          attendeeName: `${demo.user.firstName} ${demo.user.lastName}`,
          attendeeEmail: demo.user.email,
          barcode: generateBarcode(),
          status: TicketStatus.ACTIVE,
        },
      });
    }
  }
  console.log(`Created ${demoOrders.length} orders with tickets`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
