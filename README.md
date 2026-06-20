# Events Platform

A full-stack events management platform for showcasing events, managing ticket sales, sponsorships, and attendee registration — with cross-platform auto-registration to **studentalumni.ai**.

---

## Tech Stack

| Layer                               | Technology                                         | Why                                                                               |
| ----------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Frontend**                        | Next.js 14 (App Router) + TypeScript               | SSR, SEO, API routes in same codebase, React Server Components                    |
| **Styling**                         | TailwindCSS + shadcn/ui                            | Utility-first, accessible components, rapid UI                                    |
| **Animations**                      | Framer Motion                                      | Smooth, performant animations                                                     |
| **Admin Dashboard**                 | Same Next.js app (`/admin/*`) with RBAC middleware | Single codebase, shared types, less overhead                                      |
| **Database**                        | PostgreSQL (via Supabase)                          | Managed, real-time, row-level security, backups                                   |
| **ORM**                             | Prisma                                             | Type-safe queries, migrations, great DX                                           |
| **Auth (Google, GitHub)**           | Firebase Auth SDK                                  | User-specified requirement                                                        |
| **Auth (LinkedIn, Email/Password)** | NextAuth.js (Auth.js v5)                           | First-class Next.js integration, OAuth 2.0                                        |
| **Payments**                        | Razorpay Payment Gateway + Webhooks                | India's leading payment gateway, supports UPI, cards, netbanking, wallets         |
| **Email**                           | Mailtrap + React Email                             | Email testing & delivery, React Email templates, sandbox for dev                  |
| **Barcode Generation**              | jsbarcode (server-side) + `react-barcode`          | Unique per-ticket barcodes (Code-128)                                             |
| **PDF Tickets**                     | `@react-pdf/renderer`                              | Server-side PDF ticket generation                                                 |
| **QR Codes**                        | `react-qr-code`                                    | QR for quick mobile scan                                                          |
| **File Storage**                    | Supabase Storage / Cloudinary                      | Images, PDFs, sponsor logos                                                       |
| **Validation**                      | Zod                                                | Request/response validation, form schemas                                         |
| **Rate Limiting**                   | Upstash Ratelimit                                  | API abuse prevention                                                              |
| **Background Jobs**                 | Inngest / QStash                                   | Email delivery, cross-site registration                                           |
| **Monitoring**                      | Sentry + Axiom                                     | Error tracking, logs                                                              |
| **CI/CD**                           | GitHub Actions                                     | Lint, type-check, build, deploy                                                   |
| **Hosting**                         | VPS (Dockerfly)                                    | Full control, Docker containerization, Nginx reverse proxy, SSL via Let's Encrypt |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                 Nginx Reverse Proxy (VPS)                 │
│                 + Let's Encrypt SSL                       │
├─────────────┬───────────────────────┬────────────────────┤
│  Public Site │   Admin Dashboard    │   API Routes       │
│  (SSR/SSG)   │   (/admin/*)         │   (/api/*)         │
├─────────────┴───────────────────────┴────────────────────┤
│           Next.js 14 (Docker Container)                   │
├─────────────┬───────────────────────┬────────────────────┤
│  Prisma ORM │   NextAuth.js         │   Firebase Auth    │
├─────────────┴───────────────────────┴────────────────────┤
│              PostgreSQL (Supabase)                        │
├──────────────────────────────────────────────────────────┤
│  Razorpay   │  Mailtrap  │ Inngest  │ Firebase Storage    │
│  (Payments) │  (Emails)  │ (Jobs)   │ (Uploads)           │
└──────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Clone
git clone <repo-url>
cd events

# Install
pnpm install

# Environment variables
cp .env.example .env.local
# Fill in required values in .env.local

# Database
pnpm prisma migrate dev
pnpm prisma db seed

# Dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Folder Structure

```
src/
├── app/
│   ├── (public)/           # Public facing pages
│   │   ├── page.tsx        # Homepage
│   │   ├── events/         # Event listing & detail
│   │   ├── tickets/        # Ticket purchase
│   │   └── sponsors/       # Sponsor showcase
│   ├── (auth)/             # Login/Register pages
│   │   ├── login/
│   │   ├── register/
│   │   └── verify/
│   ├── (dashboard)/        # User dashboard
│   │   ├── my-tickets/
│   │   └── profile/
│   ├── admin/              # Admin dashboard
│   │   ├── events/
│   │   ├── tickets/
│   │   ├── sponsors/
│   │   ├── payments/
│   │   ├── users/
│   │   └── scan/           # Ticket scan/verify
│   └── api/
│       ├── auth/           # NextAuth + Firebase
│       ├── events/         # CRUD
│       ├── tickets/        # Purchase, verify
│       ├── payments/       # Razorpay webhooks
│       ├── sponsors/       # CRUD
│       ├── users/          # Profile, team
│       └── webhooks/       # studentalumni.ai sync
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Header, Footer, Nav
│   ├── tickets/            # TicketCard, Barcode, Cart
│   ├── events/             # EventCard, Schedule
│   ├── auth/               # Login buttons, forms
│   └── admin/              # Admin tables, forms
├── lib/
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # NextAuth config
│   ├── firebase.ts         # Firebase config
│   ├── razorpay.ts         # Razorpay client
│   ├── email.ts            # Mailtrap client
│   ├── barcode.ts          # Barcode generator
│   └── validations.ts      # Zod schemas
├── emails/                 # React Email templates
├── hooks/                  # Custom React hooks
├── types/                  # Shared TypeScript types
└── middleware.ts           # Auth middleware + RBAC
```

---

## Features Checklist

### Phase 1 — Foundation (Week 1-2)

- [x] Project scaffold, ESLint, Prettier, TypeScript strict
- [ ] Database schema + Prisma migrations
- [ ] Auth system (Google, GitHub via Firebase + LinkedIn, Email via NextAuth)
- [ ] Role-based access (USER, ADMIN, SUPER_ADMIN, SCANNER)
- [ ] Admin dashboard shell with sidebar navigation
- [ ] CI/CD pipeline (GitHub Actions → Dockerfly VPS)

### Phase 2 — Core Features (Week 3-5)

- [ ] Event CRUD (admin)
- [ ] Event public pages (list, detail)
- [ ] Ticket type management (price, quantity, perks)
- [ ] Shopping cart (client state → server sync)
- [ ] Razorpay Payment integration
- [ ] Payment webhook → ticket generation (Razorpay webhooks)
- [ ] Digital ticket PDF generation with barcode
- [ ] Email confirmation with ticket attachment
- [ ] My Tickets page (user dashboard)

### Phase 3 — Advanced (Week 6-8)

- [ ] Sponsor showcase + admin CRUD
- [ ] Team/Group pass purchase flow
- [ ] QR/Barcode scan + verify (admin scanner view)
- [ ] studentalumni.ai auto-registration webhook
- [ ] Email notifications (reminders, updates)
- [ ] Analytics dashboard (sales, attendance, conversion)

### Phase 4 — Polish (Week 9-10)

- [ ] SEO optimization (meta, OG, sitemap)
- [ ] Performance audit (Lighthouse 95+)
- [ ] Security audit (OWASP top 10)
- [ ] Load testing (k6)
- [ ] Documentation
- [ ] Deployment checklist

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Events Platform

# Database
DATABASE_URL=postgresql://...

# Firebase (Google & GitHub Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_SERVICE_ACCOUNT_KEY=

# NextAuth
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_LINKEDIN_ID=
AUTH_LINKEDIN_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

# Mailtrap (Email)
MAILTRAP_API_KEY=
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=
MAILTRAP_PASS=
EMAIL_FROM=events@yourdomain.com

# StudentAlumni.ai
STUDENTALUMNI_API_URL=
STUDENTALUMNI_API_KEY=
STUDENTALUMNI_WEBHOOK_SECRET=

# Upstash (Rate Limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Supabase Storage
SUPABASE_STORAGE_URL=
SUPABASE_STORAGE_KEY=

# Sentry
SENTRY_DSN=
```

# Test Login details:

- Admin: admin@eventsplatform.com / admin123
- User: john@example.com / user1234
- Event "AI Summit 2026" with tickets, speakers, schedule, sponsors, FAQs
