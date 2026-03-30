insert into public.billing_plans (
  id,
  name,
  monthly_price_amount,
  booking_limit_per_month,
  service_limit,
  staff_limit
)
values
  ('starter_free', 'Starter Free', 0, 100, 10, 1),
  ('starter_pro', 'Starter Pro', 2900, 1000, 50, 5)
on conflict (id)
do update
set
  name = excluded.name,
  monthly_price_amount = excluded.monthly_price_amount,
  booking_limit_per_month = excluded.booking_limit_per_month,
  service_limit = excluded.service_limit,
  staff_limit = excluded.staff_limit;

-- TODO:
-- 1. Create a real owner account through the app or Supabase Auth first.
-- 2. If you want demo booking data, insert an organization member row for that auth user.
-- 3. Then add services, availability rules, and bookings through the dashboard UI.
