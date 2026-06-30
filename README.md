# Events Platform — Multi-Tenant College Events SaaS

A full-stack multi-tenant events management platform powered by the **ECHO** theme (Bootstrap 5 + jQuery on public pages, Tailwind + shadcn/ui on admin/auth pages). Colleges/institutions manage their own events, tickets, and attendees.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14 (App Router) + TypeScript | SSR, SEO, API routes, React Server Components |
| **Public UI** | ECHO Theme (Bootstrap 5 + jQuery + 11 plugins) | Pre-built event/music theme with Swiper, Magnific Popup, CounterUp, WOW animations |
| **Admin UI** | TailwindCSS + shadcn/ui | Dark theme, utility-first, accessible |
| **Database** | PostgreSQL (Supabase) + Prisma ORM | Type-safe queries, migrations |
| **Auth** | NextAuth.js v5 (LinkedIn, Email/Password) with JWT | 6 roles: ADMIN, ORG_ADMIN, SCANNER, USER, etc. |
| **Payments** | Razorpay + Webhooks | India's leading payment gateway |
| **Email** | Brevo / SMTP provider | Transactional emails |
| **Barcodes** | jsbarcode + react-barcode | Unique per-ticket barcodes |
| **PDF Tickets** | @react-pdf/renderer | Server-side PDF ticket generation |
| **QR Codes** | react-qr-code | QR for quick mobile scan |

---

## Quick Start

```bash
# Install
pnpm install

# Environment variables
cp .env.example .env.local
# Fill in required values

# Database (push schema, NOT migrate — no migration history)
pnpm prisma db push

# Seed data (optional)
pnpm tsx prisma/seed.ts

# Dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture: Hybrid Theming

```
Public Pages (ECHO Bootstrap + jQuery)
├── CSS: 8 theme stylesheets (Bootstrap 5, Swiper, Magnific Popup, WOW, MeanMenu, NiceSelect, main)
├── JS: 11 scripts loaded via next/script (jQuery 3.7, Bootstrap bundle, Swiper, CounterUp, etc.)
├── HTML: ECHO theme classes from index-3.html, about.html, event.html, etc.
└── Layout: Preloader + scroll-to-top + Header (jQuery-controlled toggles) + Footer

Admin Pages (Tailwind + shadcn/ui)
├── Dark theme (#050508 base, purple/indigo accents)
├── Glassmorphism cards (backdrop-blur, border-white/10)
├── Landing page CMS editor (13 sections + 3 page editors)
└── Blog, Events, Sponsors, Orders, Users, Settings CRUD
```

### Data Flow

```
DB (PostgreSQL + Prisma)
├── siteContent (JSON sections) → Landing, About, Pricing, Contact pages
├── event + ticketType + scheduleSession → Events pages
├── speaker → Speakers page
├── blogPost → Blog pages
├── sponsor → Sponsor logos on landing
├── organization → Colleges pages
├── order + ticket + ticketType → Checkout, Tickets, Scanner
└── platformSetting → Global admin settings
```

---

## Database Models (25 models)

| Model | Purpose | Managed Via |
|-------|---------|-------------|
| `BlogPost` | Blog/news articles with content, excerpt, tags, cover image | `/admin/blog` |
| `Event` | Events with dates, venue, category, gallery, featured flag | `/admin/events` |
| `TicketType` | Per-event ticket tiers (price, quantity, perks, colors) | Event editor |
| `ScheduleSession` | Per-event schedule (day, time, room, speaker) | Event editor |
| `Speaker` | Speaker profiles (name, photo, company, social links) | DB (seed or API) |
| `Sponsor` | Sponsor logos with tier, sort order, website | `/admin/sponsors` |
| `FAQ` | Per-event FAQ (question, answer, category, sort) | Event editor |
| `SiteContent` | CMS JSON sections (hero, about, stats, etc.) | `/admin/landing` |
| `Order` | Orders with Razorpay integration, items, status | `/admin/orders` |
| `Ticket` | Per-attendee tickets with barcode, scan status | `/admin/tickets` |
| `User` | Users with roles, org membership, college info | `/admin/users` |
| `Organization` | Multi-tenant orgs with branding, commission | `/admin/organizations` |
| `Venue` | Event venues (address, city, map URL, lat/lng) | Event editor |
| `DiscountCode` | Per-event discount codes (percentage or fixed) | Event editor |
| `NewsletterSubscriber` | Email subscribers from landing page | `/admin/api/newsletter` |
| `PlatformSetting` | Global settings (Razorpay, email, SMTP config) | `/admin/settings` |

---

## Public Pages (All CMS/DB-Driven)

| Route | Template | Data Source | Editable From |
|-------|----------|-------------|---------------|
| `/` (Landing) | index-3.html (Hero, About, Stats, Schedule, Speakers, Testimonials, FAQ, Tickets, Sponsors, Newsletter, CTA) | `siteContent` (13 sections) + `sponsor` + `event` (featured) | `/admin/landing` |
| `/events` | event.html (Event grid + schedule tabs) | `event` + `scheduleSession` | `/admin/events` |
| `/events/[slug]` | event-details.html (Detail, schedule, FAQ, tickets with qty) | `event` with relations | `/admin/events/[id]` |
| `/about` | about.html (About section, stats, ticket packages, testimonials) | `siteContent` ("about-page" section) | `/admin/landing` |
| `/speakers` | speaker.html (Speaker grid + latest news) | `speaker` + `blogPost` | Seed / API |
| `/pricing` | pricing.html (Ticket packages with qty selectors) | `siteContent` ("pricing-page" section) | `/admin/landing` |
| `/contact` | contact.html (Info boxes, form, Google Maps) | `siteContent` ("contact-page" section) | `/admin/landing` |
| `/blog` | news-grid.html (Blog grid + sidebar with categories/recent) | `blogPost` (published) | `/admin/blog` |
| `/blog/[slug]` | news-details.html (Full article, sidebar) | `blogPost` by slug | `/admin/blog` |
| `/colleges` | Custom (Org listing) | `organization` | N/A |
| `/colleges/[slug]` | Custom (Org detail + events) | `organization` with events | N/A |
| `/404` | 404.html (Illustration + back-home) | Static | N/A |

### ECHO Features Implemented

- [x] Preloader (spinner)
- [x] Scroll-to-top button
- [x] Mobile hamburger menu (meanmenu) — ECHO theme CSS/JS handles it
- [x] Hero countdown timer
- [x] WOW scroll animations
- [x] Swiper sliders (testimonials, sponsors, blog)
- [x] Magnific Popup (video play buttons)
- [x] CounterUp (stats animation)
- [x] NiceSelect (form selects)
- [x] Schedule tabs (Bootstrap tabs)
- [x] FAQ accordion
- [x] Google Maps embed (contact page)
- [x] Blog sidebar (search, categories, recent posts)
- [x] Marquee text
- [x] Floating shape animations

---

## Admin Dashboard (`/admin`)

| Section | Features |
|---------|----------|
| **Dashboard** | Stats (users, events, tickets, orders), recent orders table |
| **Events** | List, create, edit — with ticket types, schedule sessions, FAQ, venue |
| **Blog** | Full CRUD — title, slug, content (HTML), excerpt, category, tags, cover image, publish toggle |
| **Landing Page** | Tabbed editor for all 10 landing sections + 3 page content sections |
| **Sponsors** | CRUD with name, logo, tier, website, active toggle |
| **Tickets** | List all tickets with barcode, scan status, revoke |
| **Orders** | List, view detail, edit status (PAID/REFUNDED/CANCELLED) |
| **Users** | List, ban/unban, role management |
| **Organizations** | Verify, set commission, manage |
| **Scan Tickets** | Camera QR scanner + manual barcode verify |
| **Email Templates** | Preview built-in templates |
| **Email Provider** | SMTP / Brevo configuration |
| **Settings** | Platform settings (Razorpay, email, etc.) |

---

## Seed Data

```bash
pnpm tsx prisma/seed.ts
```

| Account | Email | Password |
|---------|-------|----------|
| Admin | events@forgetechno.com | Omsairam@4522!! |
| Sample User | john@example.com | user1234 |

---

## Roles & Access

| Role | Access |
|------|--------|
| `SUPER_ADMIN` | Everything — `/admin/*` |
| `ADMIN` | Everything — `/admin/*` |
| `ORGANIZATION_ADMIN` | Org scoped — `/org-admin/*` |
| `ORGANIZATION_SCANNER` | Org scoped scanning |
| `SCANNER` | Global scanning |
| `USER` | `/dashboard`, `/my-tickets`, `/profile` |

---

## Configuration

Key environment variables in `.env.local`:

```env
# Database
DATABASE_URL=postgresql://...

# NextAuth
AUTH_SECRET=
AUTH_LINKEDIN_ID=
AUTH_LINKEDIN_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Email (Brevo / SMTP)
BREVO_API_KEY=
EMAIL_FROM=events@yourdomain.com
```

---

## Folder Structure

```
src/
├── app/
│   ├── (public)/              # Public ECHO-themed pages
│   │   ├── page.tsx           # Landing (CMS-driven)
│   │   ├── _HomePageClient.tsx# Landing interactive components
│   │   ├── about/             # CMS-driven about page
│   │   ├── speakers/          # DB-driven speakers page
│   │   ├── pricing/           # CMS-driven pricing page
│   │   ├── contact/           # CMS-driven contact + maps
│   │   ├── blog/              # DB-driven blog + [slug]/ detail
│   │   ├── events/            # DB-driven event listing + [slug]/ detail
│   │   ├── checkout/          # Razorpay checkout
│   │   └── colleges/          # Multi-tenant org discovery
│   ├── (auth)/                # Login, Register, Forgot/Reset
│   ├── (dashboard)/           # User dashboard
│   ├── (org-admin)/           # Org admin dashboard
│   ├── (scanner)/             # Ticket scanner
│   ├── admin/                 # Super admin (11+ sections)
│   │   ├── blog/              # Blog CRUD
│   │   ├── events/            # Event CRUD
│   │   ├── landing/           # Landing page CMS editor
│   │   ├── sponsors/          # Sponsor CRUD
│   │   ├── orders/            # Order management
│   │   ├── users/             # User management
│   │   ├── organizations/     # Org management
│   │   ├── tickets/           # Ticket management
│   │   ├── settings/          # Platform settings
│   │   └── scan/              # QR scanner
│   └── api/                   # 20+ API routes
│       ├── admin/             # Admin CRUD APIs
│       ├── auth/              # NextAuth + Register
│       ├── site-content/      # Public CMS endpoint
│       ├── events/            # Public events API
│       ├── contact/           # Contact form handler
│       └── webhooks/          # Razorpay webhooks
├── components/
│   ├── layout/                # Header (jQuery toggles), Footer
│   ├── ui/                    # shadcn/ui primitives
│   └── ui/forms/              # ListEditor for CMS arrays
├── lib/
│   ├── auth.ts                # NextAuth config (6 roles)
│   ├── db.ts                  # Prisma client singleton
│   └── landing-defaults.ts    # 16-section CMS defaults
└── public/assets/             # ECHO CSS, JS, images
```
