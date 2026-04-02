-- ClientFlow schema reset
-- Warning: this removes ClientFlow objects and data from the public schema.
-- It does NOT delete rows from auth.users.

begin;

drop function if exists public.create_public_booking(citext, uuid, timestamptz, text, citext, text, text);
drop function if exists public.is_organization_member(uuid, public.membership_role[]);
drop function if exists public.set_updated_at();

drop table if exists public.organization_subscriptions cascade;
drop table if exists public.notification_outbox cascade;
drop table if exists public.bookings cascade;
drop table if exists public.time_off_periods cascade;
drop table if exists public.blocked_dates cascade;
drop table if exists public.availability_rules cascade;
drop table if exists public.services cascade;
drop table if exists public.customers cascade;
drop table if exists public.organization_members cascade;
drop table if exists public.billing_plans cascade;
drop table if exists public.organizations cascade;

drop type if exists public.customer_status cascade;
drop type if exists public.subscription_status cascade;
drop type if exists public.outbox_status cascade;
drop type if exists public.notification_channel cascade;
drop type if exists public.booking_status cascade;
drop type if exists public.organization_status cascade;
drop type if exists public.membership_role cascade;

commit;

-- Next:
-- 1. Run supabase/setup_clientflow.sql to recreate the schema.
-- 2. Run supabase/seed_demo_clientflow.sql if you want demo data.
