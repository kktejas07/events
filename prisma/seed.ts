import { PrismaClient, Role, SponsorTier, OrderStatus, TicketStatus } from "@prisma/client";
import type { Organization } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { hyderabadColleges } from "../src/lib/hyderabad-colleges";
import { defaultContent } from "../src/lib/landing-defaults";
import { landingSectionKeys } from "../src/lib/site-content";

const prisma = new PrismaClient();

const SEED_IMAGES = {
  eventCovers: [
    "/assets/img/events/event-1.jpg",
    "/assets/img/events/event-2.jpg",
    "/assets/img/events/event-3.jpg",
    "/assets/img/home-1/event/event-1.png",
  ],
  speakerPhotos: [
    "/assets/img/home-3/speaker/speaker-1.jpg",
    "/assets/img/home-3/speaker/speaker-2.jpg",
    "/assets/img/home-3/speaker/speaker-3.jpg",
    "/assets/img/home-3/speaker/speaker-4.jpg",
    "/assets/img/home-3/speaker/speaker-5.jpg",
    "/assets/img/speakers/speaker-1.jpg",
  ],
  blogCovers: [
    "/assets/img/news/news-1.jpg",
    "/assets/img/news/news-2.jpg",
    "/assets/img/news/news-3.jpg",
    "/assets/img/news/news-4.jpg",
  ],
};

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
  await prisma.organizationMember.deleteMany();
  await prisma.event.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminHash = await bcrypt.hash("Omsairam@4522!!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "events@forgetechno.com" },
    update: {},
    create: {
      email: "events@forgetechno.com",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "User",
      role: Role.ADMIN,
    },
  });
  console.log("Created admin:", admin.email);

  // Create organizations
  const orgs = await Promise.all([
    prisma.organization.create({
      data: {
        name: "MIT - Massachusetts Institute of Technology",
        slug: "mit",
        description: "World-renowned research university in Cambridge, Massachusetts",
        email: "events@mit.edu",
        website: "https://web.mit.edu",
        city: "Cambridge",
        state: "MA",
        country: "USA",
        brandColor: "#8B5CF6",
        commissionRate: 5,
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Stanford University",
        slug: "stanford",
        description: "Leading private research university in Silicon Valley",
        email: "events@stanford.edu",
        website: "https://www.stanford.edu",
        city: "Stanford",
        state: "CA",
        country: "USA",
        brandColor: "#8B5CF6",
        commissionRate: 5,
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        name: "IIT Bombay",
        slug: "iit-bombay",
        description: "Indian Institute of Technology Bombay — premier engineering institute",
        email: "events@iitb.ac.in",
        website: "https://www.iitb.ac.in",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        brandColor: "#8B5CF6",
        commissionRate: 3,
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Harvard University",
        slug: "harvard",
        description: "Ivy League research university in Cambridge, Massachusetts",
        email: "events@harvard.edu",
        website: "https://www.harvard.edu",
        city: "Cambridge",
        state: "MA",
        country: "USA",
        brandColor: "#8B5CF6",
        commissionRate: 5,
        verified: true,
      },
    }),
    prisma.organization.create({
      data: {
        name: "Unverified College",
        slug: "unverified-college",
        description: "A college pending verification",
        email: "contact@unverified.edu",
        website: "https://unverified.edu",
        city: "Somewhere",
        state: "CA",
        country: "USA",
        brandColor: "#8B5CF6",
        commissionRate: 0,
        verified: false,
      },
    }),
  ]);
  console.log(`Created ${orgs.length} organizations`);

  // Create organization admin users and assign them to orgs
  type OrgSeed = { email: string; name: string; orgIdx: number };
  const orgAdmins: OrgSeed[] = [
    { email: "mit-admin@example.com", name: "MIT Events", orgIdx: 0 },
    { email: "stanford-admin@example.com", name: "Stanford Events", orgIdx: 1 },
    { email: "iitb-admin@example.com", name: "IITB Events", orgIdx: 2 },
    { email: "harvard-admin@example.com", name: "Harvard Events", orgIdx: 3 },
    { email: "unverified-admin@example.com", name: "Unverified Events", orgIdx: 4 },
  ];

  for (const oa of orgAdmins) {
    const u = await prisma.user.upsert({
      where: { email: oa.email },
      update: {},
      create: {
        email: oa.email,
        passwordHash: await bcrypt.hash("orgadmin123", 12),
        firstName: oa.name.split(" ")[0],
        lastName: oa.name.split(" ").slice(1).join(" "),
        role: Role.ORGANIZATION_ADMIN,
        organizationId: orgs[oa.orgIdx].id,
      },
    });
    await prisma.organizationMember.create({
      data: {
        organizationId: orgs[oa.orgIdx].id,
        userId: u.id,
        role: Role.ORGANIZATION_ADMIN,
        designation: "Event Coordinator",
      },
    });
  }
  console.log(`Created ${orgAdmins.length} organization admins`);

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

  // Create event (linked to MIT organization)
  const event = await prisma.event.create({
    data: {
      title: "AI Summit 2026",
      slug: "ai-summit-2026",
      organizationId: orgs[0].id,
      description:
        "Join thought leaders, developers, researchers, and founders as we explore how artificial intelligence is reshaping industries, creativity, and the future of work. 5 days of keynotes, workshops, and networking with 50 world-class speakers.",
      shortDescription: "A global gathering of AI innovators",
      startDate: new Date("2026-10-01T10:00:00Z"),
      endDate: new Date("2026-10-05T18:00:00Z"),
      timezone: "America/Los_Angeles",
      venueId: venue.id,
      category: "Technology",
      coverImage: SEED_IMAGES.eventCovers[0],
      status: "PUBLISHED",
      isFeatured: true,
    },
  });
  console.log("Created event:", event.title);

  // Create a second event for Stanford
  const stanfordVenue = await prisma.venue.create({
    data: {
      name: "Stanford Memorial Auditorium",
      address: "551 Serra Mall",
      city: "Stanford",
      state: "CA",
      country: "USA",
      zipCode: "94305",
    },
  });

  const stanfordEvent = await prisma.event.create({
    data: {
      title: "Design Engineering Summit 2026",
      slug: "design-engineering-summit-2026",
      organizationId: orgs[1].id,
      description:
        "Explore the intersection of design thinking and engineering innovation at Stanford. Workshops, keynotes, and hands-on labs.",
      shortDescription: "Design meets engineering at Stanford",
      coverImage: SEED_IMAGES.eventCovers[1],
      startDate: new Date("2026-11-15T09:00:00Z"),
      endDate: new Date("2026-11-17T17:00:00Z"),
      timezone: "America/Los_Angeles",
      venueId: stanfordVenue.id,
      category: "Design",
      status: "PUBLISHED",
      isFeatured: true,
    },
  });
  console.log("Created stanford event:", stanfordEvent.title);

  // Create ticket types for AI Summit
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
  console.log(`Created ${ticketTypes.length} ticket types for AI Summit`);

  const stanfordTickets = await Promise.all([
    prisma.ticketType.create({
      data: {
        eventId: stanfordEvent.id,
        name: "Standard",
        price: 249,
        quantityLimit: 400,
        perks: ["Keynotes & workshops", "Networking sessions", "Digital materials"],
        color: "#6C5CE7",
        sortOrder: 1,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: stanfordEvent.id,
        name: "VIP",
        price: 599,
        quantityLimit: 150,
        perks: ["All Standard benefits", "VIP lounge", "Front-row seating"],
        color: "#00CEC9",
        sortOrder: 2,
      },
    }),
    prisma.ticketType.create({
      data: {
        eventId: stanfordEvent.id,
        name: "Student",
        price: 99,
        quantityLimit: 200,
        perks: ["Workshop access", "Student networking", "Certificate"],
        color: "#00B894",
        sortOrder: 3,
      },
    }),
  ]);
  console.log(`Created ${stanfordTickets.length} ticket types for Design Engineering Summit`);

  // Create speakers
  const speakers = await Promise.all([
    prisma.speaker.create({
      data: {
        firstName: "Joshua",
        lastName: "Henry",
        title: "Chief AI Scientist",
        company: "OpenAI",
        bio: "Leading AI researcher with over 15 years of experience in machine learning and deep neural networks.",
        photoUrl: SEED_IMAGES.speakerPhotos[0],
        twitterUrl: "https://twitter.com",
        linkedinUrl: "https://linkedin.com",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Leila",
        lastName: "Zhang",
        title: "VP of Machine Learning",
        company: "Google",
        bio: "Expert in building human-centered AI products and scalable ML infrastructure.",
        photoUrl: SEED_IMAGES.speakerPhotos[1],
        twitterUrl: "https://twitter.com",
        linkedinUrl: "https://linkedin.com",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Carlos",
        lastName: "Rivera",
        title: "Founder & CEO",
        company: "NeuralCore",
        bio: "Serial entrepreneur focused on AI policy, regulation, and ethical deployment.",
        photoUrl: SEED_IMAGES.speakerPhotos[2],
        twitterUrl: "https://twitter.com",
        linkedinUrl: "https://linkedin.com",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Aisha",
        lastName: "Mensah",
        title: "AI Ethics Researcher",
        company: "DeepMind",
        bio: "Leading voice in AI ethics, fairness, and responsible deployment of machine learning systems.",
        photoUrl: SEED_IMAGES.speakerPhotos[3],
        twitterUrl: "https://twitter.com",
        linkedinUrl: "https://linkedin.com",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Leo",
        lastName: "Tanaka",
        title: "Director of Engineering",
        company: "NVIDIA",
        bio: "Expert in GPU computing, deep learning infrastructure, and large-scale AI model training.",
        photoUrl: SEED_IMAGES.speakerPhotos[4],
        twitterUrl: "https://twitter.com",
        linkedinUrl: "https://linkedin.com",
      },
    }),
    prisma.speaker.create({
      data: {
        firstName: "Sophia",
        lastName: "Romero",
        title: "Head of AI Research",
        company: "Meta AI",
        bio: "Pioneer in transformer architectures, NLP, and multimodal AI systems.",
        photoUrl: SEED_IMAGES.speakerPhotos[5],
        twitterUrl: "https://twitter.com",
        linkedinUrl: "https://linkedin.com",
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

  // Create sponsors — Hyderabad colleges & universities
  const sponsors = await Promise.all(
    hyderabadColleges.map((college, i) =>
      prisma.sponsor.create({
        data: {
          name: college.name,
          logoUrl: college.logo,
          websiteUrl: college.website,
          tier: (college.tier as SponsorTier) || SponsorTier.GOLD,
          sortOrder: i + 1,
        },
      })
    )
  );
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

  // Create blog posts
  await Promise.all([
    prisma.blogPost.create({
      data: {
        title: "The Future of Artificial Intelligence in 2026",
        slug: "future-of-ai-2026",
        excerpt: "Explore how AI is transforming industries from healthcare to finance, and what the next decade holds for machine learning and deep learning technologies.",
        content: "<p>Artificial intelligence is rapidly evolving, reshaping industries and creating new opportunities across every sector. From healthcare diagnostics to autonomous vehicles, AI systems are becoming increasingly sophisticated and integrated into our daily lives.</p><p>In 2026, we're seeing unprecedented advances in large language models, computer vision, and reinforcement learning. These technologies are not just academic curiosities anymore — they're driving real business value and solving complex problems at scale.</p><p>The key trends to watch include multimodal AI systems that can understand text, images, and audio simultaneously; AI agents that can autonomously complete complex tasks; and the growing importance of AI safety and alignment research.</p>",
        author: "Admin User",
        category: "Technology",
        tags: ["AI", "Machine Learning", "Technology"],
        coverImage: SEED_IMAGES.blogCovers[0],
        published: true,
        featured: true,
        publishedAt: new Date("2025-11-15"),
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "How to Choose the Right Conference for Your Career",
        slug: "choose-right-conference",
        excerpt: "Not all conferences are created equal. Learn how to evaluate events based on your career goals, networking opportunities, and learning objectives.",
        content: "<p>Attending the right conference can be a career-defining decision. Whether you're a developer looking to learn new skills, a founder seeking investors, or a researcher wanting to share your work, choosing the right event matters.</p><p>Consider factors like the speaker lineup, the attendee profile, workshop quality, and networking opportunities. Look for events that align with your specific interests and career stage.</p>",
        author: "Sarah Johnson",
        category: "Career",
        tags: ["Career", "Events", "Networking"],
        coverImage: SEED_IMAGES.blogCovers[1],
        published: true,
        publishedAt: new Date("2025-12-01"),
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "5 Key Takeaways from the AI Summit 2025",
        slug: "ai-summit-2025-takeaways",
        excerpt: "Last year's AI Summit brought together over 5,000 attendees. Here are the most important insights and announcements that shaped the AI landscape.",
        content: "<p>The AI Summit 2025 was a landmark event that brought together the brightest minds in artificial intelligence. From groundbreaking research presentations to product launches, the conference delivered insights that will shape the industry for years to come.</p>",
        author: "Mike Chen",
        category: "Technology",
        tags: ["AI", "Conference", "Summary"],
        coverImage: SEED_IMAGES.blogCovers[2],
        published: true,
        publishedAt: new Date("2025-10-10"),
      },
    }),
    prisma.blogPost.create({
      data: {
        title: "Networking Tips for Tech Conference Attendees",
        slug: "tech-conference-networking",
        excerpt: "Make the most of your conference experience with these proven networking strategies that will help you build meaningful professional connections.",
        content: "<p>Networking at tech conferences can be intimidating, but it's one of the most valuable aspects of attending. Here are strategies to help you connect authentically with fellow attendees, speakers, and sponsors.</p>",
        author: "Priya Sharma",
        category: "Career",
        tags: ["Networking", "Career", "Events"],
        coverImage: SEED_IMAGES.blogCovers[3],
        published: true,
        publishedAt: new Date("2025-12-20"),
      },
    }),
  ]);
  console.log("Created blog posts");

  // Seed landing page CMS content (matches index-3 defaults)
  await prisma.siteContent.deleteMany();
  for (const section of landingSectionKeys) {
    const data = defaultContent[section];
    if (data !== undefined) {
      await prisma.siteContent.create({
        data: { section, data: data as object },
      });
    }
  }
  console.log("Seeded site content sections:", landingSectionKeys.length);

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
