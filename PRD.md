# Product Requirements Document (PRD)

## Events Platform — Full-Stack Event Management System

**Document Version:** 1.1  
**Status:** Updated — Razorpay (Payments), Mailtrap (Email), Dockerfly VPS (Hosting)  
**Author:** Full-Stack Engineering Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [System Architecture](#6-system-architecture)
7. [Data Models & Database Schema](#7-data-models--database-schema)
8. [API Design](#8-api-design)
9. [Authentication & Authorization](#9-authentication--authorization)
10. [Payment Flow](#10-payment-flow)
11. [Ticket Design & Barcode System](#11-ticket-design--barcode-system)
12. [Team Pass System](#12-team-pass-system)
13. [Cross-Platform Registration (studentalumni.ai)](#13-cross-platform-registration-studentalumniai)
14. [Email Communication](#14-email-communication)
15. [Admin Dashboard](#15-admin-dashboard)
16. [Security Architecture](#16-security-architecture)
17. [Implementation Phases](#17-implementation-phases)
18. [Testing Strategy](#18-testing-strategy)
19. [Deployment & DevOps](#19-deployment--devops)
20. [Additional Feature Suggestions](#20-additional-feature-suggestions)
21. [Risk & Mitigation](#21-risk--mitigation)
22. [Success Metrics](#22-success-metrics)

---

## 1. Executive Summary

The Events Platform is a comprehensive, full-stack event management system designed to streamline the entire lifecycle of events — from showcasing and registration, through ticket sales and payment processing, to post-event engagement. The platform features a modern, responsive public-facing website inspired by the **AIvent** design template, a powerful admin dashboard for complete operational control, and seamless integration with **studentalumni.ai** for automatic cross-platform user registration.

**Key capabilities:**

- Multi-event showcase with rich detail pages
- Multi-tier ticketing with Razorpay payment processing
- Unique barcode-based digital tickets (individual & team)
- Social auth (Google, GitHub, LinkedIn) + traditional email/password
- Admin dashboard for full CRUD operations
- Automated email confirmations with PDF tickets
- Cross-platform user sync with studentalumni.ai
- Real-time ticket scanning and verification

---

## 2. Product Vision & Goals

### Vision

"To be the most seamless, secure, and professional event registration platform — where every attendee experience, from discovery to digital ticket, is frictionless and delightful."

### Goals

| Goal                       | KPI                             | Target      |
| -------------------------- | ------------------------------- | ----------- |
| Ticket Purchase Conversion | Visitors → Purchasers           | > 12%       |
| Payment Success Rate       | Successful / Total Transactions | > 98%       |
| Email Delivery Rate        | Delivered / Sent                | > 99%       |
| Cross-Registration Success | Synced / Registered Users       | 100%        |
| Admin Task Efficiency      | Time to create event            | < 5 minutes |
| Page Load Performance      | Lighthouse Score                | > 95        |
| Uptime                     | Availability                    | 99.9%       |

---

## 3. User Personas

### 3.1 Attendee (End User)

- **Goals:** Discover events, purchase tickets, receive digital ticket, attend event.
- **Pain Points:** Complicated checkout, no digital ticket, can't manage team registrations.
- **Tech Level:** Varies (must work for non-technical users).

### 3.2 Event Team Member / Group Lead

- **Goals:** Purchase team passes, manage team members, ensure everyone gets tickets.
- **Pain Points:** Buying individual tickets for teams is tedious, no group management.

### 3.3 Admin / Event Manager

- **Goals:** Create/manage events, set ticket types/prices, view sales analytics, manage sponsors, verify tickets at door.
- **Pain Points:** Switching between tools, manual entry, no real-time data.

### 3.4 Scanner (Door Staff)

- **Goals:** Quickly scan tickets, verify validity, prevent duplicate entries.
- **Tech Level:** Low (needs simple mobile-friendly scanner UI).

### 3.5 Super Admin

- **Goals:** Full platform control, manage admins, view all data, audit logs.
- **Pain Points:** Security, access control, data integrity.

---

## 4. Functional Requirements

### 4.1 Public Website

#### FR-01: Homepage

- Hero section with event countdown, CTA buttons
- Featured events carousel
- Statistics counter (attendees, speakers, sessions)
- Sponsor logos marquee strip

#### FR-02: Events Listing & Detail

- Grid/list view of all events with filters (date, category, location)
- Event detail page: description, schedule timeline, speakers, venue map, sponsor section, ticket types
- Social sharing buttons
- Related events

#### FR-03: Speaker Profiles

- Speaker cards with photo, name, title, company, bio
- Link to session details
- Social links

#### FR-04: Schedule Timeline

- Tabbed day-by-day schedule
- Session cards with time, speaker, room, description
- "Add to Calendar" buttons (Google, iCal, Outlook)

#### FR-05: Venue Information

- Google Maps embed
- Address, directions, parking info
- Nearby hotels/restaurants (optional)
- Photo gallery

#### FR-06: FAQ Section

- Accordion-style expandable questions
- Categorized by topic (Tickets, Venue, Schedule, etc.)

#### FR-07: Sponsor Showcase

- Tiered sponsor display (Platinum, Gold, Silver)
- Sponsor detail pages
- CTA to become a sponsor

### 4.2 Ticketing System

#### FR-08: Ticket Types

- Multiple ticket tiers per event (Standard, VIP, Full Access, Student, Virtual, Team)
- Each tier has: name, price, quantity limit, perks list, color theme
- Dynamic pricing support (early bird deadlines, promo codes)
- Sold-out indicators

#### FR-09: Shopping Cart

- Add/remove ticket types with quantity controls
- Real-time price calculation
- Cart persistence (localStorage + server sync for logged-in users)
- Cart expiration (15-minute reservation on inventory)
- Promo code / discount code input
- Clear cart breakdown: subtotal, fees, tax, total

#### FR-10: Checkout Flow

- **Step 1:** Cart review → "Proceed to Checkout"
- **Step 2:** Registration/Login (or guest checkout)
  - Google, GitHub, LinkedIn OAuth buttons prominently displayed
  - Email + password form below
  - "Continue as Guest" option (registers temp account)
- **Step 3:** Attendee details form
  - Full name, email, phone, company/org, job title
  - For team passes: ability to add team member details (name + email per member) with dynamic add/remove rows
  - Special requirements / accessibility needs textarea
  - Terms & Conditions checkbox
- **Step 4:** Payment (Razorpay Checkout — embedded popup)
  - Credit/debit card, UPI, Netbanking, Wallets, EMI
  - Razorpay's hosted checkout (PCI-DSS compliant)
- **Step 5:** Confirmation
  - Success page with order summary
  - Digital ticket preview with barcode
  - "Download Ticket" and "Email Ticket" buttons
  - Redirect CTA to studentalumni.ai profile

#### FR-11: Order Confirmation & Digital Ticket

- Order confirmation page immediately after payment
- Auto-generated PDF digital ticket with:
  - Event name, date, time, venue
  - Attendee name
  - Ticket type/tier and price
  - **Unique barcode (Code-128)** containing encrypted ticket ID
  - Barcode number printed below
  - Event logo + branding
  - QR code alternative for mobile scanning
- Ticket stored in user account → "My Tickets" page
- Email sent with PDF ticket attached + inline preview

#### FR-12: Ticket Verification (At-Door Scanning)

- Admin/Scanner dashboard view → "Scan Tickets" page
- Uses device camera to scan barcodes/QR codes
- Instant feedback: ✅ Valid (shows name, ticket type) or ❌ Invalid/Already Used/Duplicate
- Scan history log
- Manual entry by ticket ID as fallback
- Multi-device sync (two scanners don't admit same ticket twice)

### 4.3 Team Pass System

#### FR-13: Team Pass Purchase

- Event creator defines team pass: "up to N members, $X price"
- Purchaser (Team Lead) buys the team pass
- Team Lead receives a unique **Team Code** via email
- Team Lead adds members via:
  - Manual form entry (name + email)
  - Shareable invite link with team code
- Each team member gets their own:
  - Individual unique barcode
  - Individual digital ticket PDF
  - Registration confirmation email
- Admin scan view: when any team member is scanned, show:
  - That member's individual details
  - Team name / Team Lead name
  - All team members list
  - How many team members have checked in / total

#### FR-14: Team Member Management

- Team Lead dashboard → "My Team" page
- Add/remove members (until event date or max reached)
- Resend invitation to unregistered members
- View check-in status of all members
- Transfer team lead role (if lead cannot attend)

### 4.4 Authentication System

#### FR-15: Multi-Provider Auth (see Section 9 for detail)

| Provider       | Method      | Implementation             |
| -------------- | ----------- | -------------------------- |
| Google         | OAuth 2.0   | Firebase Auth SDK          |
| GitHub         | OAuth 2.0   | Firebase Auth SDK          |
| LinkedIn       | OAuth 2.0   | NextAuth.js (direct OAuth) |
| Email/Password | Credentials | NextAuth.js + bcrypt       |

- Unified user record regardless of login method
- Account linking: if user logs in with Google (same email as existing email/password account), accounts merge
- Session management with JWT (NextAuth) + Firebase token
- "Remember Me" option (persistent sessions)
- Password reset flow
- Email verification for email/password signups

### 4.5 User Dashboard

#### FR-16: User Profile

- View/edit personal information
- Linked social accounts display
- Order history
- Active tickets
- Team memberships

#### FR-17: My Tickets

- Card-based grid view showing all purchased tickets
- Each ticket card shows:
  - Event name, date, ticket type
  - Barcode preview (click to expand full ticket)
  - Download PDF button
  - Email ticket button
  - QR code for scanning
- Filter by: Upcoming / Past events
- Ticket transfer feature (transfer to another email — generates new barcode, invalidates old)

### 4.6 Cross-Platform Registration

#### FR-18: studentalumni.ai Auto-Registration

- After successful ticket purchase + user registration:
  1. System sends webhook to studentalumni.ai API
  2. Payload: `{ firstName, lastName, email, phone, source: "events_platform", eventId, ticketType }`
  3. studentalumni.ai creates user account (or links if email exists)
  4. Returns `{ studentalumniUserId, profileUrl }`
  5. Confirmation page shows: "You're also now registered on studentalumni.ai! [View Profile →]"
- Retry mechanism with exponential backoff (3 attempts)
- Failure logging and admin alert if sync failures exceed threshold
- Webhook secret for request signing (HMAC-SHA256)

### 4.7 Admin Dashboard

#### FR-19: Event Management

- CRUD for events
- Fields: title, slug, description, date range, time, venue, location, map URL, cover image, gallery images, category, status (draft/published/cancelled/completed)
- Rich text editor for description (TipTap)
- Image upload with drag-and-drop (Supabase Storage)
- Schedule builder: add sessions with speaker, time, room, description
- Preview before publishing

#### FR-20: Ticket Management (Per Event)

- Create/edit/delete ticket tiers
- Set: name, price, quantity available, perks list, color, sale start/end dates
- View: sold / available / reserved counts in real-time
- Bulk discount codes: create codes with % or $ off, usage limits, expiry
- Manual ticket creation (for on-site sales or comps)

#### FR-21: Sponsor Management

- CRUD for sponsors
- Fields: name, logo, description, website URL, tier (Platinum/Gold/Silver/Bronze), display order
- Assign sponsors to events

#### FR-22: Order & Payment Management

- View all orders with filters (event, date, status, ticket type)
- Order detail: items, amounts, payment status, attendee info
- Refund processing (via Razorpay)
- Export orders to CSV
- Revenue dashboard: charts (daily, per-event, per-ticket-type)

#### FR-23: User Management

- View/search all registered users
- View user's order history, tickets
- Ban/suspend users
- Manual user creation
- Role assignment (USER, ADMIN, SUPER_ADMIN, SCANNER)

#### FR-24: Scanner / Door Check

- Scanner-only login (limited permissions — only scan tickets)
- Fullscreen camera scanner view (mobile-optimized)
- Scan result modal: green ✅ / red ❌
- Scan history per event
- Manual ticket ID lookup
- Check-in statistics (real-time counter)

#### FR-25: Analytics Dashboard

- Overview cards: Total Revenue, Tickets Sold, Active Events, Registered Users
- Sales chart (daily/weekly/monthly)
- Ticket type distribution (pie chart)
- Check-in rate (% of sold tickets scanned)
- Top events by revenue
- Export reports as PDF/CSV

#### FR-26: Settings & Configuration

- Platform settings (site name, logo, favicon, colors)
- Email template customization
- studentalumni.ai integration toggle + config
- Razorpay webhook health check
- Audit logs (who did what, when)

### 4.8 Email System

#### FR-27: Transactional Emails

| Email               | Trigger                      | Content                                                     |
| ------------------- | ---------------------------- | ----------------------------------------------------------- |
| Order Confirmation  | After payment success        | Order summary + PDF ticket attached + studentalumni.ai link |
| Ticket (Individual) | Per-team-member registration | Individual ticket PDF                                       |
| Team Invitation     | Team lead adds member        | Invite link to claim ticket + register                      |
| Event Reminder      | 24h before / 1h before event | Event details, ticket barcode, venue info                   |
| Password Reset      | User requests                | Reset link (expires 1h)                                     |
| Email Verification  | Email/password signup        | Verification link                                           |
| Receipt             | After payment                | Detailed invoice                                            |

#### FR-28: Email Templates

- Built with React Email (`@react-email/components`)
- Responsive, branded design
- Preview in dev mode
- Unsubscribe link in all marketing emails (if newsletter added)

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Lighthouse score: Performance > 95, Accessibility > 95, Best Practices > 90, SEO > 95
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- API response time < 200ms (p95)
- Image optimization: next/image, WebP/AVIF, lazy loading

### 5.2 Scalability

- Stateless API (horizontal scaling ready)
- Database connection pooling (Prisma + PgBouncer)
- CDN for static assets (Cloudflare CDN or Nginx cache)
- Razorpay handles payment scale automatically

### 5.3 Security

- **Authentication:** Multi-provider with secure token storage
- **Authorization:** RBAC middleware on all admin routes
- **CSRF Protection:** NextAuth built-in + SameSite cookies
- **Rate Limiting:** Upstash Ratelimit (100 req/min per IP for public APIs, 20 req/min for auth endpoints)
- **Input Validation:** Zod schemas on every API route
- **SQL Injection:** Prisma parameterized queries (safe by default)
- **XSS:** React default escaping, CSP headers via middleware
- **Secrets:** All in environment variables, never exposed to client
- **HTTPS Only:** Enforced via Nginx + Let's Encrypt SSL
- **Razorpay:** PCI-DSS compliance handled by Razorpay (we never touch raw card data)
- **Webhook Signing:** Razorpay signature verification (X-Razorpay-Signature header), studentalumni.ai HMAC signing
- **Audit Logging:** All admin actions logged with user ID, IP, timestamp, action

### 5.4 Reliability

- Uptime: 99.9% (VPS with monitoring + auto-restart)
- Database backups: daily (Supabase managed)
- Graceful error handling with user-friendly error pages
- Razorpay webhook idempotency (prevent duplicate processing)
- Retry logic for email delivery (Mailtrap + custom retry)

### 5.5 Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Color contrast ratios > 4.5:1
- Focus indicators

### 5.6 Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile browsers: iOS Safari, Chrome Android

---

## 6. System Architecture

### 6.1 High-Level Architecture Diagram

```
                          ┌──────────────────┐
                          │  Nginx Reverse    │
                          │  Proxy + SSL      │
                          └────────┬─────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │  Next.js 14 (Docker Container) │
                    │                              │
                    │  ┌────────┐  ┌──────────┐   │
                    │  │ Public  │  │  Admin   │   │
                    │  │  Pages  │  │ Dashboard│   │
                    │  └────┬───┘  └────┬─────┘   │
                    │       │           │          │
                    │  ┌────┴───────────┴─────┐   │
                    │  │   API Routes (REST)   │   │
                    │  │   + Middleware (RBAC) │   │
                    │  └──────────┬───────────┘   │
                    └─────────────┼───────────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
    ┌──────▼──────┐    ┌─────────▼────────┐    ┌────────▼───────┐
    │  PostgreSQL  │    │  External APIs    │    │  Edge Services  │
    │  (Supabase)  │    │                   │    │                 │
    └──────────────┘    │ • Firebase Auth   │    │ • Rate Limiting │
                        │ • Razorpay        │    │   (Upstash)     │
                        │ • Mailtrap (Email)│    │ • Background    │
                        │ • studentalumni.ai│    │   Jobs (Inngest)│
                        │ • Supabase Storage│    └─────────────────┘
                        └───────────────────┘
```

### 6.2 Request Flow: Ticket Purchase

```
1. User browses events → SSR page renders event data from DB
2. User selects tickets → Cart state (localStorage + server)
3. User clicks "Checkout" → Redirected to /checkout
4. Auth check:
   ├── Logged in → continue
   └── Guest → Login/Register modal → JWT issued
5. Attendee details form submitted → Validated (Zod)
6. API: POST /api/orders/create
   ├── Check inventory (transaction with row lock)
   ├── Create Order record (status: PENDING)
   ├── Create Razorpay Order via API
   │   { amount, currency: "INR", receipt: order.id, notes: {...} }
   └── Return { orderId, razorpayOrderId, amount, keyId }
7. Client opens Razorpay Checkout popup (embedded, no redirect)
   ├── razorpay.open() with order details
   ├── User selects payment method (UPI, card, netbanking, wallet)
   └── User completes payment
8. Razorpay triggers webhook: POST /api/webhooks/razorpay
   ├── Verify Razorpay signature (X-Razorpay-Signature header)
   ├── Update Order status → PAID
   ├── Generate unique barcodes (one per ticket)
   ├── Create Ticket records in DB
   ├── Generate PDF ticket(s)
   ├── Send confirmation email with PDF (Mailtrap)
   ├── If team pass: create team, send invites
   ├── POST /api/webhooks/studentalumni → register user
   └── Return 200 to Razorpay
9. Client receives payment success callback → redirect to confirmation page
10. User sees confirmation page with ticket preview
```

### 6.3 Request Flow: Ticket Scanning

```
1. Scanner opens /admin/scan on mobile/tablet
2. Camera permission requested (getUserMedia API)
3. Scanner points camera at barcode/QR code
4. Barcode decoded client-side (zxing-js/library)
5. API: POST /api/tickets/verify
   ├── Input: { ticketId: "decoded-barcode-value", eventId }
   ├── Lookup ticket in DB
   ├── Check: exists? not cancelled? not already scanned?
   ├── Update: ticket.scanned = true, ticket.scannedAt = now()
   ├── Return: { valid: true, attendee: {...}, ticketType, teamInfo? }
   └── Or: { valid: false, reason: "..." }
6. Scanner UI shows result modal with attendee details
7. If team pass: show all team members + check-in status
```

---

## 7. Data Models & Database Schema

### 7.1 Entity Relationship Diagram (Simplified)

```
User ──┬── Order ──┬── OrderItem
       │            │
       │            └── Ticket ─── Barcode
       │                 │
       │                 └── ScanLog
       │
       ├── TeamMembership ─── Team ─── Event
       │
       └── Session (NextAuth)

Event ──┬── TicketType
        ├── ScheduleSession ─── Speaker
        ├── Sponsor (many-to-many)
        ├── Venue
        └── FAQ
```

### 7.2 Prisma Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  passwordHash  String?                       // null for OAuth users
  firstName     String?
  lastName      String?
  phone         String?
  company       String?
  jobTitle      String?
  avatarUrl     String?
  role          Role      @default(USER)
  banned        Boolean   @default(false)

  // Relations
  accounts      Account[]
  sessions      Session[]
  orders        Order[]
  tickets       Ticket[]
  teamMemberships TeamMember[]
  teamsLed      Team[]                        @relation("TeamLead")

  // studentalumni.ai
  studentalumniUserId String?
  studentalumniSynced Boolean @default(false)

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
  SCANNER
}

// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

model Event {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String    @db.Text
  shortDescription String?
  startDate   DateTime
  endDate     DateTime
  timezone    String    @default("America/New_York")
  venue       Venue?
  venueId     String?
  category    String?
  coverImage  String?
  gallery     String[]                      // Array of image URLs
  status      EventStatus @default(DRAFT)
  isFeatured  Boolean   @default(false)

  ticketTypes    TicketType[]
  sessions       ScheduleSession[]
  sponsors       EventSponsor[]
  faqs           FAQ[]
  orders         Order[]
  teams          Team[]
  tickets        Ticket[]
  discountCodes  DiscountCode[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

model Venue {
  id        String   @id @default(cuid())
  name      String
  address   String
  city      String
  state     String?
  country   String
  zipCode   String?
  mapUrl    String?
  latitude  Float?
  longitude Float?

  events    Event[]

  createdAt DateTime @default(now())
}

model TicketType {
  id              String    @id @default(cuid())
  eventId         String
  name            String                           // "Standard", "VIP", "Full Access"
  description     String?
  price           Decimal   @db.Decimal(10, 2)
  currency        String    @default("INR")
  quantityLimit   Int                              // Max number available
  quantitySold    Int       @default(0)
  quantityReserved Int      @default(0)            // In carts, not yet paid
  maxPerOrder     Int       @default(10)
  isTeamPass      Boolean   @default(false)
  teamSizeMin     Int?                             // Min team members
  teamSizeMax     Int?                             // Max team members
  perks           String[]                         // ["Front-row seating", "VIP lounge"]
  color           String?                          // Hex color for ticket card
  sortOrder       Int       @default(0)
  saleStartAt     DateTime?
  saleEndAt       DateTime?
  isActive        Boolean   @default(true)

  event           Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)
  orderItems      OrderItem[]

  createdAt       DateTime  @default(now())
}

model Order {
  id            String    @id @default(cuid())
  userId        String
  eventId       String
  razorpayOrderId String?
  razorpayPaymentId String?
  subtotal      Decimal   @db.Decimal(10, 2)
  discount      Decimal   @default(0) @db.Decimal(10, 2)
  tax           Decimal   @default(0) @db.Decimal(10, 2)
  total         Decimal   @db.Decimal(10, 2)
  currency      String    @default("INR")
  status        OrderStatus @default(PENDING)
  promoCode     String?
  notes         String?

  user          User      @relation(fields: [userId], references: [id])
  event         Event     @relation(fields: [eventId], references: [id])
  items         OrderItem[]
  tickets       Ticket[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum OrderStatus {
  PENDING
  PROCESSING
  PAID
  FAILED
  REFUNDED
  CANCELLED
}

model OrderItem {
  id            String    @id @default(cuid())
  orderId       String
  ticketTypeId  String
  quantity      Int
  unitPrice     Decimal   @db.Decimal(10, 2)
  totalPrice    Decimal   @db.Decimal(10, 2)

  order         Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  ticketType    TicketType @relation(fields: [ticketTypeId], references: [id])

  createdAt     DateTime  @default(now())
}

model Ticket {
  id            String    @id @default(cuid())
  orderId       String
  eventId       String
  ticketTypeId  String
  userId        String
  attendeeName  String
  attendeeEmail String
  barcode       String    @unique
  barcodeImageUrl String?                          // URL to generated barcode image
  pdfUrl        String?                            // URL to generated ticket PDF
  isTeamMember  Boolean   @default(false)
  teamId        String?
  scanned       Boolean   @default(false)
  scannedAt     DateTime?
  scannedBy     String?                            // Admin/Scanner user ID
  status        TicketStatus @default(ACTIVE)
  checkedIn     Boolean   @default(false)

  order         Order     @relation(fields: [orderId], references: [id])
  event         Event     @relation(fields: [eventId], references: [id])
  ticketType    TicketType @relation(fields: [ticketTypeId], references: [id])
  user          User      @relation(fields: [userId], references: [id])
  team          Team?     @relation(fields: [teamId], references: [id])
  scanLogs      ScanLog[]

  createdAt     DateTime  @default(now())
}

enum TicketStatus {
  ACTIVE
  CANCELLED
  TRANSFERRED
  REFUNDED
}

model ScanLog {
  id            String    @id @default(cuid())
  ticketId      String
  scannedBy     String
  eventId       String
  success       Boolean
  result        String?                            // "Valid entry", "Already scanned", "Invalid barcode"
  deviceInfo    String?                            // Browser/device info
  ipAddress     String?

  ticket        Ticket    @relation(fields: [ticketId], references: [id])

  createdAt     DateTime  @default(now())
}

model Team {
  id            String    @id @default(cuid())
  eventId       String
  name          String?
  leadUserId    String
  inviteCode    String    @unique
  maxMembers    Int
  currentMembers Int      @default(1)              // Starts at 1 (the lead)

  lead          User      @relation("TeamLead", fields: [leadUserId], references: [id])
  event         Event     @relation(fields: [eventId], references: [id])
  members       TeamMember[]
  tickets       Ticket[]

  createdAt     DateTime  @default(now())
}

model TeamMember {
  id            String    @id @default(cuid())
  teamId        String
  userId        String?
  email         String
  name          String?
  status        TeamMemberStatus @default(PENDING)

  team          Team      @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user          User?     @relation(fields: [userId], references: [id])

  createdAt     DateTime  @default(now())
}

enum TeamMemberStatus {
  PENDING        // Invited, not yet registered
  REGISTERED     // Claimed ticket and registered
  DECLINED
}

model ScheduleSession {
  id            String    @id @default(cuid())
  eventId       String
  title         String
  description   String?
  startTime     DateTime
  endTime       DateTime
  room          String?
  day           Int                               // Day number (1, 2, 3...)

  speaker       Speaker?  @relation(fields: [speakerId], references: [id])
  speakerId     String?
  event         Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())
}

model Speaker {
  id            String    @id @default(cuid())
  firstName     String
  lastName      String
  title         String?                            // "Chief AI Scientist"
  company       String?                            // "OpenAI"
  bio           String?
  photoUrl      String?
  twitterUrl    String?
  linkedinUrl   String?
  websiteUrl    String?

  sessions      ScheduleSession[]

  createdAt     DateTime  @default(now())
}

model Sponsor {
  id            String    @id @default(cuid())
  name          String
  logoUrl       String
  description   String?
  websiteUrl    String?
  tier          SponsorTier @default(BRONZE)
  isActive      Boolean   @default(true)
  sortOrder     Int       @default(0)

  events        EventSponsor[]

  createdAt     DateTime  @default(now())
}

enum SponsorTier {
  PLATINUM
  GOLD
  SILVER
  BRONZE
}

model EventSponsor {
  id        String @id @default(cuid())
  eventId   String
  sponsorId String

  event     Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  sponsor   Sponsor @relation(fields: [sponsorId], references: [id], onDelete: Cascade)

  @@unique([eventId, sponsorId])
}

model FAQ {
  id        String  @id @default(cuid())
  eventId   String
  question  String
  answer    String  @db.Text
  category  String?
  sortOrder Int     @default(0)

  event     Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
}

model DiscountCode {
  id            String    @id @default(cuid())
  eventId       String
  code          String    @unique
  discountType  DiscountType
  discountValue Decimal   @db.Decimal(10, 2)       // Percentage or flat amount
  maxUses       Int?
  currentUses   Int       @default(0)
  minOrderAmount Decimal? @db.Decimal(10, 2)
  validFrom     DateTime?
  validUntil    DateTime?
  isActive      Boolean   @default(true)

  event         Event     @relation(fields: [eventId], references: [id], onDelete: Cascade)

  createdAt     DateTime  @default(now())
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}

model AuditLog {
  id            String    @id @default(cuid())
  userId        String?
  action        String                             // "event.create", "ticket.scan", "user.ban"
  entityType    String?                            // "Event", "Ticket", "User"
  entityId      String?
  details       Json?                              // Changed fields, metadata
  ipAddress     String?
  userAgent     String?

  createdAt     DateTime  @default(now())
}
```

---

## 8. API Design

### 8.1 REST API Endpoints

All API routes prefixed with `/api`. Authenticated routes require `Authorization: Bearer <token>` header.

#### Auth

| Method | Endpoint                           | Auth | Description                    |
| ------ | ---------------------------------- | ---- | ------------------------------ |
| POST   | `/api/auth/register`               | No   | Email/password registration    |
| POST   | `/api/auth/login`                  | No   | Email/password login           |
| POST   | `/api/auth/logout`                 | Yes  | Logout, invalidate session     |
| POST   | `/api/auth/verify-email`           | No   | Verify email token             |
| POST   | `/api/auth/reset-password`         | No   | Request password reset         |
| POST   | `/api/auth/reset-password/confirm` | No   | Confirm password reset         |
| POST   | `/api/auth/link-account`           | Yes  | Link additional OAuth provider |
| GET    | `/api/auth/session`                | Yes  | Get current session            |

#### Events

| Method | Endpoint            | Auth  | Description                                   |
| ------ | ------------------- | ----- | --------------------------------------------- |
| GET    | `/api/events`       | No    | List published events (paginated, filterable) |
| GET    | `/api/events/:slug` | No    | Get event by slug                             |
| POST   | `/api/events`       | Admin | Create event                                  |
| PUT    | `/api/events/:id`   | Admin | Update event                                  |
| DELETE | `/api/events/:id`   | Admin | Delete event                                  |

#### Ticket Types

| Method | Endpoint                       | Auth  | Description                 |
| ------ | ------------------------------ | ----- | --------------------------- |
| GET    | `/api/events/:id/ticket-types` | No    | List ticket types for event |
| POST   | `/api/events/:id/ticket-types` | Admin | Create ticket type          |
| PUT    | `/api/ticket-types/:id`        | Admin | Update ticket type          |
| DELETE | `/api/ticket-types/:id`        | Admin | Delete ticket type          |

#### Orders & Checkout

| Method | Endpoint                     | Auth | Description                           |
| ------ | ---------------------------- | ---- | ------------------------------------- |
| POST   | `/api/orders/create`         | Yes  | Create order + Razorpay order         |
| GET    | `/api/orders`                | Yes  | User's order history                  |
| GET    | `/api/orders/:id`            | Yes  | Order detail                          |
| POST   | `/api/orders/validate-promo` | Yes  | Validate discount code                |
| POST   | `/api/webhooks/razorpay`     | No\* | Razorpay webhook (signature verified) |

#### Tickets

| Method | Endpoint                | Auth    | Description                      |
| ------ | ----------------------- | ------- | -------------------------------- |
| GET    | `/api/tickets`          | Yes     | User's tickets                   |
| GET    | `/api/tickets/:id`      | Yes     | Ticket detail + barcode          |
| GET    | `/api/tickets/:id/pdf`  | Yes     | Download ticket PDF              |
| POST   | `/api/tickets/verify`   | Scanner | Scan/verify ticket               |
| POST   | `/api/tickets/transfer` | Yes     | Transfer ticket to another email |

#### Teams

| Method | Endpoint                           | Auth | Description                        |
| ------ | ---------------------------------- | ---- | ---------------------------------- |
| POST   | `/api/teams`                       | Yes  | Create team (from team pass order) |
| GET    | `/api/teams/:id`                   | Yes  | Team detail + members              |
| POST   | `/api/teams/:id/members`           | Yes  | Add team member                    |
| DELETE | `/api/teams/:id/members/:memberId` | Yes  | Remove team member                 |
| POST   | `/api/teams/:id/resend-invite`     | Yes  | Resend invite to member            |
| POST   | `/api/teams/join`                  | No   | Join team via invite code          |

#### Admin

| Method | Endpoint                       | Auth  | Description            |
| ------ | ------------------------------ | ----- | ---------------------- |
| GET    | `/api/admin/stats`             | Admin | Dashboard statistics   |
| GET    | `/api/admin/orders`            | Admin | All orders (filtered)  |
| POST   | `/api/admin/orders/:id/refund` | Admin | Process refund         |
| GET    | `/api/admin/users`             | Admin | User management        |
| PUT    | `/api/admin/users/:id/role`    | Admin | Change user role       |
| POST   | `/api/admin/users/:id/ban`     | Admin | Ban/unban user         |
| GET    | `/api/admin/audit-logs`        | Admin | View audit logs        |
| GET    | `/api/admin/export/:type`      | Admin | Export CSV/PDF reports |

#### Cross-Platform

| Method | Endpoint                                 | Auth     | Description                   |
| ------ | ---------------------------------------- | -------- | ----------------------------- |
| POST   | `/api/webhooks/studentalumni`            | Internal | Sync user to studentalumni.ai |
| GET    | `/api/integrations/studentalumni/status` | Admin    | Check integration health      |

### 8.2 API Response Format

```typescript
// Success
{
  "success": true,
  "data": { ... },
  "meta": {                    // Pagination metadata
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "TICKET_SOLD_OUT",
    "message": "This ticket type is no longer available.",
    "details": { ... }        // Optional validation errors
  }
}
```

### 8.3 Rate Limiting Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1689000000
```

---

## 9. Authentication & Authorization

### 9.1 Authentication Flow

```
                    ┌─────────────────────────┐
                    │   User visits /login     │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐
     │  Google Button   │ │GitHub Button│ │ LinkedIn Button │
     │ (Firebase Auth)  │ │(Firebase)   │ │ (NextAuth OAuth)│
     └────────┬────────┘ └──────┬──────┘ └────────┬────────┘
              │                  │                  │
              │    ┌─────────────┼──────────────────┘
              │    │             │
     ┌────────▼────▼─────────────▼────────┐
     │    Firebase Auth / NextAuth         │
     │    • Verify ID token               │
     │    • Extract: email, name, avatar   │
     └────────────────┬───────────────────┘
                      │
     ┌────────────────▼───────────────────┐
     │  Find or Create User in Database    │
     │  • Match by email                  │
     │  • If new: create User record       │
     │  • If exists: link new auth method  │
     └────────────────┬───────────────────┘
                      │
     ┌────────────────▼───────────────────┐
     │  Issue NextAuth JWT Session          │
     │  • Set HTTP-only secure cookie      │
     │  • Store session in DB              │
     └────────────────┬───────────────────┘
                      │
     ┌────────────────▼───────────────────┐
     │  Redirect to intended page          │
     │  /checkout or /dashboard            │
     └────────────────────────────────────┘
```

### 9.2 Firebase Auth Configuration (Google & GitHub)

```typescript
// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
```

Firebase handles the OAuth popup/redirect. On successful sign-in, the Firebase ID token is sent to our backend, verified with Firebase Admin SDK, and used to create/link the user in our database. A NextAuth session is then created.

### 9.3 LinkedIn OAuth (NextAuth)

```typescript
// auth.ts — NextAuth config
import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
    // Additional custom provider for Firebase-backed Google/GitHub
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Upsert user in our database
      return true;
    },
    async session({ session, token }) {
      // Enrich session with DB user data (role, etc.)
      return session;
    },
  },
});
```

### 9.4 Email/Password (NextAuth Credentials)

```typescript
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });
    if (!user || !user.passwordHash) return null;
    const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
    return isValid ? user : null;
  },
});
```

### 9.5 Authorization (RBAC Middleware)

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // Admin routes
    if (pathname.startsWith("/admin")) {
      if (!["ADMIN", "SUPER_ADMIN", "SCANNER"].includes(role as string)) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Scanner-only routes
    if (
      pathname.startsWith("/admin/scan") &&
      role !== "SCANNER" &&
      role !== "ADMIN" &&
      role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: { authorized: ({ token }) => !!token },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/checkout"],
};
```

---

## 10. Payment Flow

### 10.1 Razorpay Integration Flow

```
1. Client: User fills cart → clicks "Pay Now"
2. Client: POST /api/orders/create { items: [...], promoCode?, attendeeDetails }
3. Server:
   a. Validate inventory (SELECT ... FOR UPDATE — row lock)
   b. Calculate totals (subtotal, discount, tax, final) in INR (paise)
   c. Reserve inventory (increment quantityReserved)
   d. Create Order (status: PENDING) + OrderItems in DB
   e. Create Razorpay Order via API:
      POST https://api.razorpay.com/v1/orders
      {
        amount: totalInPaise,              // e.g. ₹299 = 29900 paise
        currency: "INR",
        receipt: order.id,
        notes: { orderId: order.id, userId: user.id }
      }
   f. Return { orderId, razorpayOrderId, amount, currency, keyId }
4. Client opens Razorpay Checkout (embedded popup — no redirect):
   const options = {
     key: RAZORPAY_KEY_ID,
     amount: orderAmount,
     currency: "INR",
     order_id: razorpayOrderId,
     name: "Events Platform",
     prefill: { name, email, contact },
     handler: function (response) {
       // razorpay_payment_id, razorpay_order_id, razorpay_signature
       // POST to /api/orders/verify-payment
     }
   };
   const rzp = new Razorpay(options);
   rzp.open();
5. User selects payment method (UPI, Card, Netbanking, Wallet) and completes
6. Razorpay triggers webhook: POST /api/webhooks/razorpay
   (event: payment.captured)
7. Server (webhook handler):
   a. Verify Razorpay signature (HMAC-SHA256 of payload + webhook_secret)
      Compare with X-Razorpay-Signature header
   b. Extract orderId from payload.notes
   c. Update Order → PAID, store razorpayPaymentId
   d. Decrement quantityReserved, increment quantitySold
   e. Generate barcodes (one per ticket)
   f. Create Ticket records
   g. Generate PDF tickets → upload to Supabase Storage
   h. Send confirmation email with PDF (Mailtrap)
   i. If team pass: create Team, generate inviteCode, send team lead email
   j. Trigger studentalumni.ai sync (Inngest background job)
   k. Return 200 to Razorpay
8. Client handler receives success → verify payment on server → redirect to confirmation
9. User sees confirmation page with ticket preview
```

### 10.2 Razorpay Webhook Events Handled

| Event              | Action                                               |
| ------------------ | ---------------------------------------------------- |
| `payment.captured` | Fulfill order (create tickets, send email)           |
| `payment.failed`   | Log failure, notify user, release reserved inventory |
| `order.paid`       | Alternative payment confirmation                     |
| `refund.created`   | Update order status to REFUNDED, cancel tickets      |

### 10.3 Idempotency

All webhook handlers are idempotent. We use the Razorpay payment ID + event ID as a deduplication key — if we've already processed this event, return 200 immediately.

### 10.4 Razorpay Client Setup

```typescript
// lib/razorpay.ts
import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Verify webhook signature
export function verifyRazorpayWebhook(payload: string, signature: string, secret: string): boolean {
  const crypto = require("crypto");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return expected === signature;
}
```

---

## 11. Ticket Design & Barcode System

### 11.1 Ticket Card Design (Inspired by AIvent)

```
┌──────────────────────────────────────────────┐
│  ┌──────────┐                    ┌──────────┐ │
│  │  LOGO     │    EVENT NAME     │  LOGO     │ │
│  │  (small)  │    AI Summit 2026 │ (watermark)│ │
│  └──────────┘                    └──────────┘ │
│                                              │
│   ───────────────────────────────────────    │
│                                              │
│            STANDARD PASS                     │
│              ₹299                            │
│         October 1–5, 2026                    │
│         10:00 AM — 6:00 PM                   │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │  █▀▀▀▀▀█  █▀▀▀ █ ▀█▀ █▀▀▀ ▀▀█▀▀   │   │
│   │  █ ███ █  █▄▄█ ██▀▄▀ ██▀█ ▀▀ █ ▄▀  │   │
│   │  █▄▄▄▄▄█  █▄█▄ ████▀▄▄ ▄█▄ ███▀█▀  │   │
│   │   (Code-128 Barcode — Unique)        │   │
│   │   TKT-7XK9M2P-A4                      │   │
│   └──────────────────────────────────────┘   │
│                                              │
│  • Access to all keynotes and sessions       │
│  • Admission to exhibitions and demos        │
│  • Networking opportunities                  │
│                                              │
│  ───────────────────────────────────────    │
│  Attendee: John Doe                          │
│  Order #: ORD-20261001-7XK9                  │
│  ┌──────────────────────────────────────┐    │
│  │  [QR Code for mobile scanning]       │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

### 11.2 Barcode Specification

- **Format:** Code-128 (widely supported, compact, high density)
- **Content:** Encrypted ticket ID + HMAC signature
  - Format: `base64(ticketId + "." + hmac_sha256(ticketId, SECRET))`
  - This prevents barcode forgery
  - Example: `ZXlKMGVYQWlPaUpLV...`
- **Generation:** Server-side using `jsbarcode` (Node canvas) → uploaded to Supabase Storage
- **Verification:** Decrypt server-side, validate HMAC, check ticket status
- **Uniqueness:** One barcode per ticket, globally unique, never reused

### 11.3 PDF Ticket Generation

```typescript
// Using @react-pdf/renderer
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const TicketPDF = ({ ticket, event, user }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        <Image src={event.logoUrl} style={styles.logo} />
        <Text style={styles.eventName}>{event.title}</Text>
        <Text style={styles.ticketType}>{ticket.ticketType.name}</Text>
        <Text style={styles.price}>₹{ticket.ticketType.price}</Text>
        <Text style={styles.date}>{formatDate(event.startDate)}</Text>
        <Image src={ticket.barcodeImageUrl} style={styles.barcode} />
        <Text style={styles.barcodeText}>{ticket.barcode}</Text>
        <Text style={styles.attendee}>{ticket.attendeeName}</Text>
      </View>
    </Page>
  </Document>
);
```

---

## 12. Team Pass System

### 12.1 Team Pass Lifecycle

```
1. Admin creates TicketType with isTeamPass=true, teamSizeMin=2, teamSizeMax=10
2. User purchases team pass (e.g., "Team Pass — up to 5 members, $999")
3. Razorpay webhook: payment confirmed
4. System creates:
   - Team record (leadUserId, maxMembers, inviteCode)
   - 1 Ticket for the Team Lead (isTeamMember=true)
   - N-1 pending TeamMember records (status: PENDING)
5. Team Lead receives email:
   - Their own ticket PDF
   - Team management link
   - Invite code/link to share with team
6. Team Lead adds members:
   - Via dashboard → "Add Member" (name + email)
   - Each invitee gets email: "You've been invited to join [Team] for [Event]"
7. Invitee clicks link → registers/creates account → claims their ticket
   - TeamMember status → REGISTERED
   - New Ticket created with their unique barcode
   - Confirmation email sent to invitee with their ticket PDF
8. At event: scanner scans any team member's barcode
   - Shows: member name, team name, "3 of 5 checked in"
   - Admin can see full team roster with check-in status
```

### 12.2 Team Management UI (Team Lead)

- "My Teams" tab in dashboard
- For each team:
  - Event name, date
  - Member list with status badges (✅ Checked in / 🟡 Registered / ⚪ Pending)
  - "Add Member" button (modal with name + email)
  - "Resend Invite" for pending members
  - "Remove" for members who haven't yet claimed
  - "Transfer Lead" (if lead cannot attend)

---

## 13. Cross-Platform Registration (studentalumni.ai)

### 13.1 Integration Architecture

```
Events Platform                              studentalumni.ai
───────────────                              ────────────────

1. User registers + buys ticket
2. Order fulfilled (PAID)
3. Inngest background job triggered
4. POST /api/webhooks/studentalumni
   │
   ├─ Prepare payload:
   │  {
   │    event: "user.registered",
   │    data: {
   │      email, firstName, lastName,
   │      phone, source: "events_platform",
   │      eventId, ticketType
   │    },
   │    timestamp,
   │    signature: HMAC(payload, secret)
   │  }
   │
   └─────────────────────────────────────►  POST /api/v1/users/sync
                                                    │
                                                    ├─ Find user by email
                                                    │  ├─ Exists → update + link
                                                    │  └─ New → create
                                                    │
                  ◄───────────────────────────  {
                                                    success: true,
                                                    userId: "sa_xyz",
                                                    profileUrl: "..."
                                                  }
   │
   ├─ Update User record:
   │  studentalumniUserId = "sa_xyz"
   │  studentalumniSynced = true
   │
   └─ Include studentalumni.ai link
      in confirmation page
```

### 13.2 Error Handling & Retries

| Attempt          | Delay      | Strategy                              |
| ---------------- | ---------- | ------------------------------------- |
| 1st              | Immediate  | Initial try                           |
| 2nd              | 30 seconds | Retry                                 |
| 3rd              | 5 minutes  | Final retry                           |
| After 3 failures | —          | Log to dead-letter queue, alert admin |

### 13.3 Admin Configuration

In admin settings, the Super Admin can:

- Enable/disable studentalumni.ai integration
- Configure API URL and API key
- View sync status dashboard
- Manually retry failed syncs
- Download sync error log

---

## 14. Email Communication

### 14.1 Email Service: Mailtrap

- **Why Mailtrap:** Email testing sandbox for development, reliable SMTP/API for production delivery, built-in spam analysis, team inbox for collaboration
- **Template Engine:** `@react-email/components` — write emails as React components
- **Delivery:** Nodemailer with Mailtrap SMTP (dev: sandbox, prod: sending API)
- **Sandbox:** All dev emails go to Mailtrap inbox (never send to real addresses in dev)

### 14.2 Mailtrap Setup

```typescript
// lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST!,
  port: Number(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER!,
    pass: process.env.MAILTRAP_PASS!,
  },
});

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    ...options,
  });
}
```

### 14.3 Email Template List

```typescript
// emails/order-confirmation.tsx
export const OrderConfirmationEmail = ({ order, tickets, event }) => (
  <Html>
    <Head />
    <Preview>Your tickets for {event.title} are confirmed!</Preview>
    <Body style={main}>
      <Container>
        <Section>
          <Img src={event.logoUrl} width="120" />
          <Heading>Order Confirmed!</Heading>
          <Text>Thank you for purchasing tickets to {event.title}.</Text>
        </Section>

        <Section>
          <Hr />
          {tickets.map(ticket => (
            <TicketPreview ticket={ticket} />
          ))}
        </Section>

        <Section>
          <Text>Download your tickets or view them in your account.</Text>
          <Button href={`${APP_URL}/dashboard/tickets`}>View My Tickets</Button>
        </Section>

        {!user.studentalumniSynced && (
          <Section>
            <Text>You're also registered on StudentAlumni.ai!</Text>
            <Button href={`https://studentalumni.ai/profile`}>
              View StudentAlumni Profile
            </Button>
          </Section>
        )}

        <Section>
          <Hr />
          <Text style={footer}>Need help? Contact support@eventsplatform.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
```

---

## 15. Admin Dashboard

### 15.1 Layout

```
┌──────────────────────────────────────────────────────┐
│  ┌──────────┐                                        │
│  │  Logo     │  🔍 Search  │  🔔  │  👤 Admin ▼     │
│  └──────────┘                                        │
├────────┬─────────────────────────────────────────────┤
│        │                                             │
│  ────  │  Dashboard / Events / Tickets / Orders ...  │
│  Sidebar│                                             │
│        │  ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  📊 Dash │  │ Revenue  │ │ Tickets │ │  Users  │       │
│  📅 Events│  │  ₹45,230  │ │  1,204  │ │  3,450  │       │
│  🎫 Tickets│ └─────────┘ └─────────┘ └─────────┘       │
│  💰 Orders │                                             │
│  🤝 Sponsors│  ┌─────────────────────────────┐         │
│  👥 Users  │  │   Revenue Chart (30 days)    │         │
│  📋 Audit  │  │   📈 Line chart              │         │
│  ⚙️ Settings│ └─────────────────────────────┘         │
│        │                                             │
│  ────  │                                             │
│        │                                             │
└────────┴─────────────────────────────────────────────┘
```

### 15.2 Key Admin Pages

| Page         | Route               | Description                                          |
| ------------ | ------------------- | ---------------------------------------------------- |
| Dashboard    | `/admin`            | Overview cards, charts, recent orders                |
| Events       | `/admin/events`     | Table view, create/edit/delete                       |
| Event Detail | `/admin/events/:id` | Edit event + manage ticket types, sessions, sponsors |
| Tickets      | `/admin/tickets`    | Search, filter, view, cancel tickets                 |
| Orders       | `/admin/orders`     | Order table, filter by status/event/date             |
| Sponsors     | `/admin/sponsors`   | CRUD sponsor records                                 |
| Users        | `/admin/users`      | User table, roles, ban                               |
| Scan         | `/admin/scan`       | Camera scanner for door check-in                     |
| Audit Logs   | `/admin/audit`      | Filterable audit trail                               |
| Settings     | `/admin/settings`   | Platform config, integrations                        |

### 15.3 Admin Components (shadcn/ui based)

- **Data Table:** TanStack Table (React Table v8) with sorting, filtering, pagination
- **Forms:** React Hook Form + Zod validation + shadcn/ui form components
- **Charts:** Recharts / Tremor for dashboard analytics
- **Rich Text Editor:** TipTap for event descriptions
- **Image Upload:** react-dropzone → Supabase Storage
- **Date Picker:** shadcn/ui Calendar (react-day-picker)
- **Modals:** shadcn/ui Dialog
- **Toasts:** Sonner (toast notifications)

---

## 16. Security Architecture

### 16.1 Security Layers

```
Layer 1: Network
├── HTTPS enforced (Nginx + Let's Encrypt SSL on VPS)
├── CSP headers (Content-Security-Policy)
├── HSTS (Strict-Transport-Security)
├── X-Frame-Options: DENY
├── X-Content-Type-Options: nosniff
└── Firewall (UFW) + fail2ban for brute-force protection

Layer 2: Application
├── Input validation (Zod on all endpoints)
├── Parameterized queries (Prisma)
├── CSRF tokens (NextAuth built-in)
├── Rate limiting (Upstash)
└── Helmet.js security headers

Layer 3: Authentication
├── Multi-provider OAuth (standards-compliant)
├── bcrypt for password hashing (cost factor 12)
├── JWT sessions with short expiry (24h) + refresh
├── Firebase token verification on backend
└── Account linking with email verification

Layer 4: Authorization
├── RBAC middleware on all routes
├── Route-level role checks
├── Resource-level ownership checks
└── API key for cross-service calls

Layer 5: Data
├── Sensitive fields encrypted at rest (if needed)
├── Database access restricted (VPC / IP allowlist)
├── Row-Level Security (Supabase — optional extra)
├── Automatic backups (Supabase daily)
└── Audit logging for all admin actions

Layer 6: Payments
├── Razorpay handles all card/UPI data (PCI-DSS compliant)
├── Webhook signature verification (HMAC-SHA256)
├── Idempotency keys prevent duplicate processing
└── Never log raw card/UPI data
```

### 16.2 Barcode Security

```
Barcode Content = Base64(JSON({
  ticketId: "tk_xyz",
  timestamp: 1689000000,
  signature: HMAC-SHA256(ticketId + timestamp, BARCODE_SECRET)
}))

Verification:
1. Decode barcode
2. Verify signature matches
3. Check timestamp not expired
4. Lookup ticket in DB
5. Check ticket.status === ACTIVE
6. Check ticket.scanned === false (or within re-entry window)
7. Mark ticket.scanned = true
```

### 16.3 Admin Security Measures

- Admin sessions expire after 8 hours (forced re-auth)
- 2FA option for admin accounts (TOTP via authenticator app)
- Suspicious activity detection (multiple failed logins → lockout)
- IP allowlisting option for admin access
- All admin actions logged to AuditLog
- Sensitive actions (refund, delete event) require confirmation

---

## 17. Implementation Phases

### Phase 1: Foundation (Weeks 1-2) — "The Scaffold"

| #    | Task                                                                 | Priority | Est. | Dependencies |
| ---- | -------------------------------------------------------------------- | -------- | ---- | ------------ |
| 1.1  | Initialize Next.js 14 project with TypeScript, Tailwind, shadcn/ui   | P0       | 4h   | —            |
| 1.2  | Setup ESLint, Prettier, Husky pre-commit hooks                       | P0       | 2h   | 1.1          |
| 1.3  | Configure Prisma + PostgreSQL (Supabase)                             | P0       | 3h   | —            |
| 1.4  | Design & create full database schema, run migrations                 | P0       | 6h   | 1.3          |
| 1.5  | Implement NextAuth with LinkedIn + Credentials provider              | P0       | 8h   | 1.4          |
| 1.6  | Integrate Firebase Auth SDK for Google + GitHub                      | P0       | 6h   | 1.4          |
| 1.7  | Unify auth: Firebase → NextAuth session bridge                       | P0       | 4h   | 1.5, 1.6     |
| 1.8  | Build middleware + RBAC logic                                        | P0       | 4h   | 1.5          |
| 1.9  | Create base layouts (public, admin, dashboard)                       | P0       | 4h   | 1.1          |
| 1.10 | Setup Razorpay SDK + webhook handler skeleton                        | P1       | 4h   | —            |
| 1.11 | Setup Mailtrap + Nodemailer + React Email preview                    | P1       | 2h   | —            |
| 1.12 | Setup Sentry, Axiom for error tracking                               | P1       | 2h   | —            |
| 1.13 | GitHub Actions CI/CD pipeline (lint, type-check, build, Docker push) | P0       | 4h   | 1.1          |
| 1.14 | Docker setup (Dockerfile, docker-compose.yml, Nginx config)          | P0       | 4h   | 1.1          |

**Checkpoint:** Dev can sign in with all 4 methods. Admin middleware works. DB migrated.

### Phase 2: Core Event & Ticket (Weeks 3-5) — "The Engine"

| #    | Task                                                         | Priority | Est. | Dependencies |
| ---- | ------------------------------------------------------------ | -------- | ---- | ------------ |
| 2.1  | Admin: Event CRUD (create, edit, delete, list)               | P0       | 8h   | 1.9          |
| 2.2  | Admin: Ticket Type CRUD (per event)                          | P0       | 6h   | 2.1          |
| 2.3  | Public event listing page (grid + filters)                   | P0       | 6h   | 2.1          |
| 2.4  | Public event detail page (all sections)                      | P0       | 10h  | 2.1, 2.2     |
| 2.5  | Ticket card component (looks like AIvent reference)          | P0       | 6h   | 2.2          |
| 2.6  | Shopping cart (client state + localStorage)                  | P0       | 6h   | 2.5          |
| 2.7  | Checkout flow (multi-step form with auth gate)               | P0       | 8h   | 2.6, 1.7     |
| 2.8  | Razorpay Checkout integration (create order, embedded popup) | P0       | 6h   | 2.7, 1.10    |
| 2.9  | Razorpay webhook: fulfillment (create tickets, update order) | P0       | 8h   | 2.8          |
| 2.10 | Barcode generation (server-side, jsbarcode) + upload         | P0       | 4h   | 2.9          |
| 2.11 | PDF ticket generation (@react-pdf/renderer)                  | P0       | 6h   | 2.10         |
| 2.12 | Order confirmation email with PDF attachment (Mailtrap)      | P0       | 4h   | 2.11, 1.11   |
| 2.13 | User dashboard: My Tickets page                              | P1       | 6h   | 2.9          |
| 2.14 | User dashboard: Profile page (edit details)                  | P1       | 4h   | 1.7          |
| 2.15 | Discount/Promo code system                                   | P1       | 6h   | 2.2, 2.7     |

**Checkpoint:** End-to-end flow works: browse event → add ticket to cart → checkout → pay → receive email with PDF ticket → view tickets in dashboard.

### Phase 3: Advanced Features (Weeks 6-8) — "The Extras"

| #    | Task                                                               | Priority | Est. | Dependencies |
| ---- | ------------------------------------------------------------------ | -------- | ---- | ------------ |
| 3.1  | Team pass purchase flow (add members at checkout or post-purchase) | P0       | 10h  | 2.9          |
| 3.2  | Team management dashboard (lead adds/removes members)              | P0       | 8h   | 3.1          |
| 3.3  | Team invite email + claim flow (invitee registers + gets ticket)   | P0       | 6h   | 3.2          |
| 3.4  | Scanner view: camera barcode reader (zxing-js/library)             | P0       | 8h   | 2.10         |
| 3.5  | Ticket verification API + scan log                                 | P0       | 4h   | 3.4          |
| 3.6  | Scanner result UI (modal with attendee/team details)               | P0       | 6h   | 3.4, 3.5     |
| 3.7  | studentalumni.ai webhook integration                               | P1       | 6h   | 2.9          |
| 3.8  | Inngest background job for studentalumni sync + retries            | P1       | 4h   | 3.7          |
| 3.9  | studentalumni status display on confirmation page                  | P1       | 2h   | 3.7          |
| 3.10 | Admin: Sponsor CRUD + event association                            | P1       | 6h   | 2.1          |
| 3.11 | Sponsor display on event page                                      | P1       | 4h   | 3.10         |
| 3.12 | Admin: Order management (list, filter, detail, refund)             | P0       | 6h   | 2.9          |
| 3.13 | Admin: User management (list, roles, ban)                          | P1       | 4h   | 1.4          |
| 3.14 | Admin: Analytics dashboard (charts, stats)                         | P1       | 8h   | 2.9          |

**Checkpoint:** Team passes work. Scanner works. studentalumni sync works. Admin has full control.

### Phase 4: Polish & Launch (Weeks 9-10) — "The Shine"

| #    | Task                                                 | Priority | Est. | Dependencies |
| ---- | ---------------------------------------------------- | -------- | ---- | ------------ |
| 4.1  | SEO optimization (metadata, OG, sitemap, robots.txt) | P1       | 4h   | 2.4          |
| 4.2  | Responsive design audit & fixes                      | P0       | 8h   | All          |
| 4.3  | Accessibility audit & fixes (WCAG 2.1 AA)            | P1       | 6h   | All          |
| 4.4  | Performance optimization (Lighthouse → 95+)          | P0       | 6h   | All          |
| 4.5  | Loading states + skeleton screens                    | P1       | 4h   | All          |
| 4.6  | Error boundaries + graceful error pages              | P1       | 4h   | All          |
| 4.7  | Rate limiting implementation (Upstash)               | P1       | 3h   | 1.12         |
| 4.8  | Email reminder system (24h before, 1h before event)  | P1       | 4h   | 1.11, 3.8    |
| 4.9  | Event scheduling (auto-publish, auto-complete)       | P2       | 3h   | 3.8          |
| 4.10 | Newsletter signup on homepage                        | P2       | 2h   | —            |
| 4.11 | Export reports (CSV: orders, tickets, users)         | P1       | 3h   | 3.12         |
| 4.12 | Security pen-testing checklist                       | P0       | 8h   | All          |
| 4.13 | Documentation (README, API docs, Admin guide)        | P0       | 6h   | All          |
| 4.14 | Docker container build + push to registry            | P0       | 2h   | All          |
| 4.15 | Staging deployment (Dockerfly VPS) + smoke testing   | P0       | 4h   | 4.14         |
| 4.16 | Production deployment (Dockerfly VPS)                | P0       | 2h   | 4.15         |

---

## 18. Testing Strategy

### 18.1 Testing Pyramid

```
          ╱───────╲
         ╱   E2E   ╲        Playwright — Critical user flows (5-10 tests)
        ╱───────────╲
       ╱ Integration ╲      Jest + Supertest — API endpoints, DB interactions
      ╱───────────────╲
     ╱   Unit Tests    ╲    Vitest — Utils, hooks, components, validation
    ╱───────────────────╲
```

### 18.2 Test Categories

| Category        | Tool                           | What to test                                             |
| --------------- | ------------------------------ | -------------------------------------------------------- |
| Unit            | Vitest + React Testing Library | Components, hooks, validation schemas, utility functions |
| API Integration | Jest + Supertest               | API routes: auth flows, CRUD operations, error handling  |
| Database        | Prisma test environment        | Migrations, seed data, query correctness                 |
| Payment         | Razorpay test mode             | Checkout flow, webhook handling, refunds                 |
| E2E             | Playwright                     | Critical paths: register → buy ticket → download → scan  |
| Performance     | Lighthouse CI                  | Every PR: performance, accessibility, SEO                |
| Security        | npm audit + manual review      | Dependency vulnerabilities, OWASP checks                 |

### 18.3 Critical Test Scenarios

1. **User Registration:** All 4 auth methods work; account linking works for same email
2. **Ticket Purchase:** Out of stock → can't purchase; in stock → successful purchase
3. **Cart Reservation:** 15-min reservation holds inventory; releases on expiry
4. **Payment:** Successful Razorpay payment → ticket generated; failed payment → no ticket
5. **Duplicate Payment:** Same Razorpay event twice → idempotent, no double tickets
6. **Barcode Uniqueness:** No two tickets share same barcode
7. **Scanner:** Valid ticket → ✅; already scanned → ❌; invalid barcode → ❌
8. **Team Pass:** Team lead buys → adds 4 members → 5 unique tickets generated → all scannable
9. **studentalumni Sync:** Registration → webhook succeeds → user linked; webhook fails → retried → eventually succeeds
10. **Admin RBAC:** Scanner can't access user management; User can't access admin

---

## 19. Deployment & DevOps

### 19.1 Infrastructure (Dockerfly VPS)

```
┌─────────────────────────────────────────────────────┐
│              Dockerfly VPS (Ubuntu 22.04)            │
│                                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │              Docker Compose Stack              │ │
│  │                                               │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐  │ │
│  │  │  Nginx    │  │ Next.js  │  │  Inngest    │  │ │
│  │  │  (SSL)    │  │  (App)   │  │  (Worker)   │  │ │
│  │  │  :80,443  │  │  :3000   │  │             │  │ │
│  │  └──────────┘  └──────────┘  └────────────┘  │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  Volumes: app-data, nginx-logs, letsencrypt         │
│  Auto-restart: always (unless-stopped)              │
│  Healthcheck: /api/health endpoint                  │
└─────────────────────────────────────────────────────┘
                      │
┌─────────────────────┼───────────────────────┐
│       Supabase                                │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │PostgreSQL│  │ Storage  │  │ Auth (opt.) │ │
│  └──────────┘  └──────────┘  └────────────┘ │
└──────────────────────────────────────────────┘
```

### 19.2 Docker Setup

```dockerfile
# Dockerfile
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: "3.8"
services:
  app:
    build: .
    container_name: events-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.production
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    container_name: events-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - ./certbot/www:/var/www/certbot
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

### 19.3 Nginx Configuration

```nginx
# nginx/nginx.conf
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    location /_next/static {
        proxy_pass http://app:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 19.4 CI/CD Pipeline (GitHub Actions → Dockerfly VPS)

```yaml
# .github/workflows/deploy.yml
name: CI/CD

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: events_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/events_test
      - run: pnpm test:e2e

  build-and-push:
    needs: [lint-and-typecheck, test]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t events-app:${{ github.sha }} .
      - name: Push to registry (Docker Hub / GHCR)
        run: |
          echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
          docker tag events-app:${{ github.sha }} ${{ secrets.DOCKER_USERNAME }}/events-app:${{ github.ref_name }}
          docker push ${{ secrets.DOCKER_USERNAME }}/events-app:${{ github.ref_name }}

  deploy:
    needs: [build-and-push]
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /opt/events
            docker compose pull app
            docker compose up -d --force-recreate app
            docker system prune -af
```

### 19.5 SSL Setup (Let's Encrypt)

```bash
# On VPS, initial SSL setup
sudo apt install certbot -y
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Auto-renewal cron (runs daily)
echo "0 3 * * * certbot renew --quiet --post-hook 'docker compose -f /opt/events/docker-compose.yml restart nginx'" | sudo crontab -
```

### 19.6 Monitoring & Alerts

- **Error tracking:** Sentry (frontend + backend)
- **Logs:** Axiom (structured logging) + Docker logs
- **Uptime:** UptimeRobot / Better Uptime (pings /api/health every 60s)
- **Server monitoring:** htop, docker stats, Prometheus + Grafana (optional)
- **DB monitoring:** Supabase dashboard
- **Payment alerts:** Razorpay dashboard (failed payments, disputes)
- **Alert channels:** Slack + Email for critical issues

---

## 20. Additional Feature Suggestions

### 20.1 High-Impact Additions

| Feature                          | Value                                                                   | Effort | Priority |
| -------------------------------- | ----------------------------------------------------------------------- | ------ | -------- |
| **Event Livestream Integration** | Embed YouTube/Vimeo live streams for virtual tickets                    | Medium | P2       |
| **Networking Matchmaking**       | AI-powered attendee matching based on interests, job titles             | High   | P3       |
| **Interactive Floor Plan**       | SVG-based venue map with clickable rooms/sessions                       | Medium | P2       |
| **Push Notifications**           | Web push for event reminders, schedule changes                          | Medium | P2       |
| **Multi-Language Support**       | i18n (next-intl) — Spanish, French, Mandarin first                      | High   | P3       |
| **Referral Program**             | "Refer a friend, get 10% off" — unique referral links + tracking        | Medium | P2       |
| **Speaker Q&A Module**           | Attendees submit questions, upvote, speakers answer live                | High   | P3       |
| **Gamification**                 | Points for session attendance, leaderboard, prizes                      | Low    | P4       |
| **Calendar Sync**                | One-click "Add to Calendar" (Google, iCal, Outlook) for sessions        | Low    | P2       |
| **Mobile App (PWA)**             | PWA for offline ticket viewing, push notifications                      | Medium | P3       |
| **Waitlist System**              | Sold-out tickets → join waitlist → auto-purchase when available         | Medium | P2       |
| **Group Registration API**       | For companies: bulk CSV upload for employee registration                | Medium | P2       |
| **Custom Registration Forms**    | Event-specific custom fields (dietary restrictions, T-shirt size, etc.) | Medium | P2       |
| **Social Wall**                  | Live social media feed on event page (Twitter/X, Instagram hashtag)     | Low    | P3       |
| **Session Feedback**             | Post-session rating + comments (admin analytics)                        | Medium | P2       |
| **Certificate Generation**       | Auto-generate attendance certificates (PDF) after event                 | Medium | P2       |
| **Affiliate/Partner Tracking**   | UTM-based tracking for sponsor/partner ticket sales attribution         | Low    | P3       |
| **Dark Mode**                    | System-preference-aware dark mode toggle                                | Low    | P2       |

### 20.2 Monetization Ideas

1. **Featured Event Listings:** Charge organizers for premium placement on event listing page
2. **Sponsor Analytics:** Sell detailed sponsor ROI reports (impressions, clicks, leads)
3. **White-Label Platform:** License the platform to other event organizers
4. **Early-Bird Premium:** Offer premium features (resume upload, priority networking) for higher tier

---

## 21. Risk & Mitigation

| Risk                                    | Probability | Impact   | Mitigation                                                       |
| --------------------------------------- | ----------- | -------- | ---------------------------------------------------------------- |
| Razorpay outage during high-volume sale | Low         | High     | Graceful degradation UI; retry queue; manual payment fallback    |
| Barcode collision (duplicate)           | Very Low    | High     | Global uniqueness constraint; pre-generation check               |
| studentalumni.ai API downtime           | Medium      | Low      | Async with retry; non-blocking; admin alert                      |
| Firebase/NextAuth auth outage           | Low         | High     | Multiple providers — fallback if one is down                     |
| Data breach                             | Low         | Critical | Encryption at rest; minimal PII; regular audits                  |
| Ticket scalping / fraud                 | Medium      | Medium   | Rate limiting; barcode HMAC; per-email purchasing limits         |
| High traffic → DB overload              | Low         | Medium   | Connection pooling; Supabase auto-scaling; caching (Redis/Nginx) |
| Chargebacks / payment disputes          | Medium      | Low      | Clear terms; Razorpay fraud detection; refund policy             |
| Mobile scanner not working in low light | Medium      | Low      | Manual ticket ID entry fallback; QR alternative                  |
| Third-party OAuth deprecation           | Low         | Medium   | Abstracted auth layer; easy to swap providers                    |

---

## 22. Success Metrics

### 22.1 Launch Metrics (First 30 Days)

| Metric                           | Target       |
| -------------------------------- | ------------ |
| Events created                   | > 10         |
| Total ticket sales               | > ₹25,00,000 |
| Registration conversion rate     | > 15%        |
| Email delivery rate              | > 99%        |
| Page load time (p95)             | < 2s         |
| Scanner accuracy                 | > 99.5%      |
| studentalumni sync success rate  | > 99%        |
| Zero critical security incidents | 0            |
| Customer support tickets         | < 50         |

### 22.2 Ongoing Metrics (Quarterly)

- Monthly Active Users (MAU)
- Repeat purchase rate (attendees attending multiple events)
- Net Promoter Score (NPS) survey post-event
- Admin time saved vs. manual process (internal metric)
- Platform revenue vs. operational cost

---

## Appendix A: File Naming Conventions

```
# Components
TicketCard.tsx          → Ticket card component
TicketCardSkeleton.tsx  → Loading skeleton
CreateEventForm.tsx     → Admin form
EventList.tsx           → Event listing component

# API Routes (Next.js App Router)
src/app/api/events/route.ts              → GET (list), POST (create)
src/app/api/events/[id]/route.ts         → GET, PUT, DELETE (single event)
src/app/api/events/[id]/ticket-types/route.ts → Ticket types for event

# Pages
src/app/(public)/events/page.tsx         → Event listing
src/app/(public)/events/[slug]/page.tsx  → Event detail
src/app/admin/events/page.tsx            → Admin event list
src/app/admin/events/[id]/page.tsx       → Admin edit event
```

## Appendix B: Commit Convention

```
feat: add ticket barcode generation
fix: prevent duplicate razorpay webhook processing
refactor: extract auth logic to separate service
docs: update API documentation
test: add checkout flow integration tests
chore: update prisma dependencies
security: patch rate limiting bypass
```

## Appendix C: Default Color Palette

```
Primary:    #6C5CE7 (Purple)     → Buttons, links, accents
Secondary:  #00CEC9 (Teal)       → Highlights, badges
Dark:       #1A1A2E (Navy)       → Headers, footer
Light:      #F8F9FA (Off-white)  → Backgrounds
Success:    #00B894               → Valid scan, success messages
Danger:     #E17055               → Invalid scan, errors
Warning:    #FDCB6E               → Warnings, pending states
```

---

_End of PRD — Version 1.0_
