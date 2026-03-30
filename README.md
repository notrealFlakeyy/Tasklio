# Booking SaaS MVP Starter

Production-ready booking MVP scaffold built with:

- Next.js 16 App Router
- TypeScript
- Tailwind CSS v4
- Supabase SSR auth + Postgres
- Zod validation

## Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project values
3. Run the SQL migration in Supabase
4. Run the seed script
5. Install dependencies with `npm install`
6. Start the app with `npm run dev`

## Current scope

- Public booking page
- Owner sign up / sign in / sign out
- Dashboard shell
- Services CRUD
- Availability settings
- Booking list, confirm, cancel, notes
- Customer capture
- Notification outbox placeholder
- Billing plan and subscription scaffolding

## Important TODOs

- Replace the Stripe webhook stub with verified event handling
- Add background processing for `notification_outbox`
- Add tests for slot generation and booking creation race conditions
- Extend availability UI for split shifts and multiple resources
- Add plan enforcement and usage metering
