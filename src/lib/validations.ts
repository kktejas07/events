import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  timezone: z.string().default("Asia/Kolkata"),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"]).default("DRAFT"),
  isFeatured: z.boolean().default(false),
});

export const ticketTypeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0),
  currency: z.string().default("INR"),
  quantityLimit: z.number().int().min(1),
  maxPerOrder: z.number().int().min(1).default(10),
  isTeamPass: z.boolean().default(false),
  teamSizeMin: z.number().int().optional(),
  teamSizeMax: z.number().int().optional(),
  perks: z.array(z.string()).default([]),
  color: z.string().optional(),
  sortOrder: z.number().int().default(0),
  saleStartAt: z.string().optional(),
  saleEndAt: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  college: z.string().optional(),
  graduationYear: z.coerce.number().int().min(1900).max(2100).optional(),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  organizationId: z.string().optional(),
});

export const orderCreateSchema = z.object({
  eventId: z.string(),
  items: z.array(
    z.object({
      ticketTypeId: z.string(),
      quantity: z.number().int().min(1),
    })
  ),
  promoCode: z.string().optional(),
  attendeeDetails: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    specialRequirements: z.string().optional(),
  }),
});

export const ticketVerifySchema = z.object({
  barcode: z.string().min(1),
  eventId: z.string(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const sponsorSchema = z.object({
  name: z.string().min(1),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  websiteUrl: z.string().optional(),
  tier: z.enum(["PLATINUM", "GOLD", "SILVER", "BRONZE"]).default("BRONZE"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type EventInput = z.infer<typeof eventSchema>;
export type TicketTypeInput = z.infer<typeof ticketTypeSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OrderCreateInput = z.infer<typeof orderCreateSchema>;
export type TicketVerifyInput = z.infer<typeof ticketVerifySchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type SponsorInput = z.infer<typeof sponsorSchema>;
