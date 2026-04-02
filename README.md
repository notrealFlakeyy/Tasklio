# ClientFlow

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

## Private Beta Checklist

1. Verify `.env.local` uses Supabase keys from the same project.
2. Run the latest Supabase SQL migrations on the target project.
3. Create one real owner account through the app.
4. Add at least one service and publish weekly availability.
5. Open `/book/[slug]` and complete one real test booking.
6. Confirm and cancel bookings from the dashboard once each.
7. Review the booking details created from that booking.
8. Share the product with a small group of friendly testers before opening it wider.
