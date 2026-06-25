import { themeAssets } from "./theme-images";

export const defaultContent: Record<string, unknown> = {
  hero: {
    badge: "digital Design",
    title: "conference",
    year: "2025",
    description:
      "Join designers, developers, and creative leaders for three days of inspiration, workshops, and networking at the premier digital design conference.",
    date: "september 25 - 10:00Am - 5:00 pm",
    location: "Hyderabad, India",
    ctaText: "get tickets",
    ctaLink: "/events",
    countdownTarget: "2025-09-25T10:00:00",
    backgroundImage: themeAssets.hero.background,
    heroImage: themeAssets.hero.shape,
  },
  stats: [
    { value: "25", label: "Our Visionary Speakers", suffix: "+" },
    { value: "897", label: "Event Participants", suffix: "+" },
    { value: "69", label: "International Sponsors", suffix: "+" },
  ],
  about: {
    badge: "About design conference",
    title: "Building The Future of digital design & Conferences",
    description:
      "Welcome to our design conference hub, where creativity meets innovation! We are a community of forward-thinking designers, industry leaders, and creative experts, united by our shared passion for digital excellence.",
    image: themeAssets.about.image,
  },
  speakers: {
    badge: "event speakers",
    title: "Meet Our Event Speaker's",
    description:
      "Welcome to our design conference hub, where innovation meets ingenuity! We are a community of forward-thinking creatives.",
    items: [
      { name: "Michael Joseph", role: "founder & CEO", photoUrl: themeAssets.speakers.photos[0] },
      { name: "Sarah Chen", role: "Design Director", photoUrl: themeAssets.speakers.photos[1] },
      { name: "James Wilson", role: "UX Lead", photoUrl: themeAssets.speakers.photos[2] },
      { name: "Emily Rodriguez", role: "Creative Director", photoUrl: themeAssets.speakers.photos[3] },
      { name: "David Park", role: "Product Designer", photoUrl: themeAssets.speakers.photos[4] },
    ],
  },
  testimonials: [
    {
      quote:
        "Attending this design conference was a game-changer. The speakers were not only knowledgeable but also made complex concepts easy to understand.",
      name: "Mark D.",
      role: "Tech Entrepreneur",
    },
    {
      quote:
        "The networking opportunities alone were worth the ticket price. I connected with designers from around the world.",
      name: "Lisa M.",
      role: "Creative Director",
    },
    {
      quote:
        "From Figma workshops to UX panels, every session delivered real value.",
      name: "Alex K.",
      role: "Product Designer",
    },
  ],
  faq: {
    badge: "why you join this events",
    title: "you will get to know",
    image: themeAssets.services.man,
    items: [
      { q: "Networking", a: "Connect with designers, developers, and creative leaders from around the world." },
      { q: "Connecting minds", a: "Collaborate in workshops and breakout sessions designed to spark new ideas." },
      { q: "Creating future", a: "Explore emerging trends in digital design shaping tomorrow." },
      { q: "Great Speakers", a: "Learn from industry pioneers who have shaped products used by millions." },
      { q: "New People", a: "Meet fellow creatives, potential collaborators, and mentors." },
      { q: "Have Fun", a: "Enjoy after-parties, gallery walks, and social events." },
    ],
  },
  tickets: {
    badge: "get your seat",
    title: "buy a ticket be the first one",
    tiers: [
      { name: "Gold package", price: "09$" },
      { name: "Diamond package", price: "09$", highlighted: true },
      { name: "platinum package", price: "09$" },
    ],
  },
  sponsors: {
    title: "apply for event sponsors",
    description:
      "Welcome to our Business & Startup hub, where innovation meets ingenuity! We are a community of forward-thinking entrepreneurs and industry leaders.",
  },
  newsletter: {
    title: "Stay in the Loop",
    description: "Get the latest event updates delivered to your inbox.",
    buttonText: "Subscribe",
    placeholder: "Your Email Address",
  },
  site: {
    headerAddress: "4233 w. 65th st. chicago il 60629",
    ticketButtonText: "get ticket",
    ticketButtonLink: "/events",
  },
  "about-page": {
    badge: "About design conference",
    title: "Building The Future of digital design & Conferences",
    image: themeAssets.about.image,
    description:
      "Welcome to our design conference hub, where innovation meets ingenuity!",
    stats: [
      { value: "25", label: "Our Visionary Speakers", suffix: "+" },
      { value: "897", label: "Event Participants", suffix: "+" },
      { value: "69", label: "International Sponsors", suffix: "+" },
    ],
    phoneNumber: "+91 3214 0203 420",
    ticketPackages: [
      { name: "Gold package", price: "09$", highlighted: false, features: ["DEFAULT (Unlimited tickets)", "Lunch & Coffee: Yes", "Certificate: Yes"] },
      { name: "Diamond package", price: "09$", highlighted: true, features: ["DEFAULT (Unlimited tickets)", "Lunch & Coffee: Yes", "Certificate: Yes"] },
      { name: "Platinum package", price: "09$", highlighted: false, features: ["DEFAULT (Unlimited tickets)", "Lunch & Coffee: Yes", "Certificate: Yes"] },
    ],
  },
  "pricing-page": {
    badge: "buy ticket",
    title: "buy a ticket be the first one",
    packages: [
      { name: "Gold package", price: "09$", highlighted: false, features: ["DEFAULT (Unlimited tickets)", "Lunch & Coffee: Yes", "Certificate: Yes"] },
      { name: "Diamond package", price: "09$", highlighted: true, features: ["DEFAULT (Unlimited tickets)", "Lunch & Coffee: Yes", "Certificate: Yes"] },
      { name: "Platinum package", price: "09$", highlighted: false, features: ["DEFAULT (Unlimited tickets)", "Lunch & Coffee: Yes", "Certificate: Yes"] },
    ],
  },
  "contact-page": {
    phones: [{ label: "+880 123 427 00" }, { label: "+000 938 809 12" }],
    address: "4233 w. 65th st. chicago il 60629",
    emails: [{ label: "supportinfo@gmail.com" }, { label: "info@echo-platform.com" }],
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.122654!2d-87.771!3d41.775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2c3cd0f4c659%3A0x6f5!2sChicago%2C%20IL!5e0!3m2!1sen!2sus!4v1",
  },
};
