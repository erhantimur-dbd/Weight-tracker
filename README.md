# 1 Level Up - Fitness Accountability App

Premium fitness accountability platform built for [1 Level Up](https://www.1level.co.uk) coaching business.

## Features

- **Admin/Coach Portal** — Bird's-eye view of all clients, compliance tracking, invite system, CSV data export
- **Client Portal** — Personal dashboard, weight tracker, exercise logger, food tracker with macros
- **Google & Apple SSO** — Seamless sign-in via OAuth
- **Food Search** — OpenFoodFacts API integration for nutritional data lookup
- **Configurable Notifications** — Morning/evening check-in times set during onboarding
- **PWA** — Installable on any device
- **1 Level Up Branding** — Gold (#C9A84C) on black (#0A0A0A), Playfair Display headers

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: NextAuth.js v5 (Google, Apple, Credentials)
- **Database**: PostgreSQL via Prisma ORM
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in values
3. Set up a PostgreSQL database (Vercel Postgres, Neon, or Supabase)
4. Run migrations:
   ```bash
   npx prisma db push
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables from `.env.example`
4. Vercel will auto-detect Next.js and deploy

## Making yourself an admin

After signing up, update your user role directly in the database:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```
