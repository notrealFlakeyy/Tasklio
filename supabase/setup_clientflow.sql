-- ClientFlow database bootstrap
-- Safe to run on a fresh Supabase project.
-- Mostly rerunnable as well, thanks to IF NOT EXISTS / OR REPLACE guards.

begin;

create extension if not exists pgcrypto with schema public;
create extension if not exists citext with schema public;
create extension if not exists btree_gist with schema public;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'membership_role') then
    create type public.membership_role as enum ('owner', 'admin', 'staff');
  end if;

  if not exists (select 1 from pg_type where typname = 'organization_status') then
    create type public.organization_status as enum ('active', 'trialing', 'suspended');
  end if;

  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type public.booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed', 'no_show');
  end if;

  if not exists (select 1 from pg_type where typname = 'notification_channel') then
    create type public.notification_channel as enum ('email', 'sms', 'webhook');
  end if;

  if not exists (select 1 from pg_type where typname = 'outbox_status') then
    create type public.outbox_status as enum ('queued', 'processing', 'sent', 'failed');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status') then
    create type public.subscription_status as enum ('inactive', 'trialing', 'active', 'past_due', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'customer_status') then
    create type public.customer_status as enum ('lead', 'active', 'vip', 'inactive');
  end if;
end
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.set_booking_window()
returns trigger
language plpgsql
as $$
begin
  new.booking_window := tstzrange(
    new.starts_at,
    new.ends_at + make_interval(mins => new.buffer_minutes),
    '[)'
  );
  return new;
end;
$$;

create or replace function public.generate_public_id(prefix text)
returns text
language sql
volatile
as $$
  select lower(prefix) || '_' || substr(md5(random()::text || clock_timestamp()::text || prefix), 1, 12);
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  public_id text not null default public.generate_public_id('org'),
  name text not null,
  slug citext not null unique,
  timezone text not null,
  status public.organization_status not null default 'trialing',
  booking_notice_hours integer not null default 0 check (booking_notice_hours >= 0),
  slot_interval_minutes integer not null default 15 check (slot_interval_minutes between 5 and 120),
  default_booking_buffer_minutes integer not null default 0 check (default_booking_buffer_minutes between 0 and 240),
  contact_email citext,
  contact_phone text,
  brand_logo_url text,
  brand_primary_color text not null default '#443730',
  brand_accent_color text not null default '#786452',
  brand_surface_color text not null default '#eaf7cf',
  brand_alt_color text not null default '#e6fdff',
  public_tagline text,
  public_headline text,
  public_description text,
  public_site_enabled boolean not null default true,
  public_about_title text,
  public_about_body text,
  public_contact_title text,
  public_contact_body text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.membership_role not null default 'owner',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  public_id text not null default public.generate_public_id('srv'),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes between 5 and 480),
  price_amount integer not null default 0 check (price_amount >= 0),
  currency char(3) not null default 'EUR',
  buffer_minutes integer not null default 0 check (buffer_minutes between 0 and 240),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.availability_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_minute integer not null check (start_minute between 0 and 1439),
  end_minute integer not null check (end_minute between 1 and 1440),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (end_minute > start_minute),
  unique (organization_id, weekday, start_minute, end_minute)
);

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  blocked_on date not null,
  reason text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, blocked_on)
);

create table if not exists public.time_off_periods (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_at timestamptz not null default timezone('utc', now()),
  check (ends_at > starts_at)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  public_id text not null default public.generate_public_id('cus'),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  full_name text not null,
  email citext,
  phone text,
  notes text,
  status public.customer_status not null default 'active',
  tags text[] not null default '{}',
  internal_notes text,
  first_booked_at timestamptz,
  last_booked_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, email)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  public_id text not null default public.generate_public_id('bok'),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  service_id uuid not null references public.services (id) on delete restrict,
  customer_id uuid references public.customers (id) on delete set null,
  created_by_member_id uuid references public.organization_members (id) on delete set null,
  status public.booking_status not null default 'pending',
  source text not null default 'public',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  buffer_minutes integer not null default 0 check (buffer_minutes between 0 and 240),
  booking_window tstzrange,
  customer_name text not null,
  customer_email citext,
  customer_phone text,
  customer_notes text,
  internal_notes text,
  service_name_snapshot text,
  service_price_amount integer not null default 0,
  service_currency char(3) not null default 'EUR',
  service_duration_minutes integer not null default 0,
  confirmed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at > starts_at)
);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  booking_id uuid references public.bookings (id) on delete cascade,
  channel public.notification_channel not null,
  template_key text not null,
  payload jsonb not null default '{}'::jsonb,
  status public.outbox_status not null default 'queued',
  send_after timestamptz not null default timezone('utc', now()),
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.billing_plans (
  id text primary key,
  name text not null,
  monthly_price_amount integer not null default 0 check (monthly_price_amount >= 0),
  booking_limit_per_month integer,
  service_limit integer,
  staff_limit integer,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organization_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  plan_id text not null references public.billing_plans (id) on delete restrict,
  status public.subscription_status not null default 'trialing',
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_ends_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_organization_member(
  org_id uuid,
  allowed_roles public.membership_role[] default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members as om
    where om.organization_id = org_id
      and om.user_id = auth.uid()
      and om.is_active = true
      and (allowed_roles is null or om.role = any(allowed_roles))
  );
$$;

revoke all on function public.is_organization_member(uuid, public.membership_role[]) from public;
grant execute on function public.is_organization_member(uuid, public.membership_role[]) to authenticated;

alter table public.customers
  add column if not exists public_id text,
  add column if not exists status public.customer_status not null default 'active',
  add column if not exists tags text[] not null default '{}',
  add column if not exists internal_notes text,
  add column if not exists first_booked_at timestamptz,
  add column if not exists last_booked_at timestamptz;

alter table public.bookings
  add column if not exists public_id text,
  add column if not exists booking_window tstzrange,
  add column if not exists service_name_snapshot text,
  add column if not exists service_price_amount integer not null default 0,
  add column if not exists service_currency char(3) not null default 'EUR',
  add column if not exists service_duration_minutes integer not null default 0;

alter table public.organizations
  add column if not exists public_id text,
  add column if not exists brand_logo_url text,
  add column if not exists brand_primary_color text not null default '#443730',
  add column if not exists brand_accent_color text not null default '#786452',
  add column if not exists brand_surface_color text not null default '#eaf7cf',
  add column if not exists brand_alt_color text not null default '#e6fdff',
  add column if not exists public_tagline text,
  add column if not exists public_headline text,
  add column if not exists public_description text,
  add column if not exists public_site_enabled boolean not null default true,
  add column if not exists public_about_title text,
  add column if not exists public_about_body text,
  add column if not exists public_contact_title text,
  add column if not exists public_contact_body text;

alter table public.services
  add column if not exists public_id text;

update public.organizations
set public_id = public.generate_public_id('org')
where public_id is null;

update public.organizations
set
  brand_primary_color = coalesce(nullif(trim(brand_primary_color), ''), '#443730'),
  brand_accent_color = coalesce(nullif(trim(brand_accent_color), ''), '#786452'),
  brand_surface_color = coalesce(nullif(trim(brand_surface_color), ''), '#eaf7cf'),
  brand_alt_color = coalesce(nullif(trim(brand_alt_color), ''), '#e6fdff'),
  public_site_enabled = coalesce(public_site_enabled, true);

update public.services
set public_id = public.generate_public_id('srv')
where public_id is null;

update public.customers
set public_id = public.generate_public_id('cus')
where public_id is null;

update public.bookings
set public_id = public.generate_public_id('bok')
where public_id is null;

alter table public.organizations
  alter column public_id set default public.generate_public_id('org'),
  alter column public_id set not null;

alter table public.services
  alter column public_id set default public.generate_public_id('srv'),
  alter column public_id set not null;

alter table public.customers
  alter column public_id set default public.generate_public_id('cus'),
  alter column public_id set not null;

alter table public.bookings
  alter column public_id set default public.generate_public_id('bok'),
  alter column public_id set not null;

create index if not exists organizations_status_idx on public.organizations (status);
create unique index if not exists organizations_public_id_key on public.organizations (public_id);
create index if not exists organization_members_user_id_idx on public.organization_members (user_id);
create index if not exists services_organization_id_idx on public.services (organization_id, is_active);
create unique index if not exists services_public_id_key on public.services (public_id);
create index if not exists availability_rules_org_weekday_idx on public.availability_rules (organization_id, weekday);
create index if not exists blocked_dates_org_blocked_on_idx on public.blocked_dates (organization_id, blocked_on);
create index if not exists time_off_org_period_idx on public.time_off_periods (organization_id, starts_at, ends_at);
create index if not exists customers_org_email_idx on public.customers (organization_id, email);
create unique index if not exists customers_public_id_key on public.customers (public_id);
create index if not exists customers_org_status_idx on public.customers (organization_id, status);
create index if not exists customers_tags_gin_idx on public.customers using gin (tags);
create index if not exists customers_last_booked_at_idx on public.customers (organization_id, last_booked_at desc);
create index if not exists bookings_org_starts_at_idx on public.bookings (organization_id, starts_at);
create index if not exists bookings_org_status_idx on public.bookings (organization_id, status);
create unique index if not exists bookings_public_id_key on public.bookings (public_id);
create index if not exists bookings_service_snapshot_idx on public.bookings (organization_id, service_id, status);
create index if not exists notification_outbox_status_idx on public.notification_outbox (status, send_after);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_no_overlap'
  ) then
    alter table public.bookings
      add constraint bookings_no_overlap
      exclude using gist (
        organization_id with =,
        booking_window with &&
      )
      where (status in ('pending', 'confirmed'));
  end if;
end
$$;

drop trigger if exists organizations_set_updated_at on public.organizations;
create trigger organizations_set_updated_at
before update on public.organizations
for each row
execute function public.set_updated_at();

drop trigger if exists organization_members_set_updated_at on public.organization_members;
create trigger organization_members_set_updated_at
before update on public.organization_members
for each row
execute function public.set_updated_at();

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

drop trigger if exists availability_rules_set_updated_at on public.availability_rules;
create trigger availability_rules_set_updated_at
before update on public.availability_rules
for each row
execute function public.set_updated_at();

drop trigger if exists customers_set_updated_at on public.customers;
create trigger customers_set_updated_at
before update on public.customers
for each row
execute function public.set_updated_at();

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
before update on public.bookings
for each row
execute function public.set_updated_at();

drop trigger if exists bookings_set_booking_window on public.bookings;
create trigger bookings_set_booking_window
before insert or update of starts_at, ends_at, buffer_minutes
on public.bookings
for each row
execute function public.set_booking_window();

drop trigger if exists organization_subscriptions_set_updated_at on public.organization_subscriptions;
create trigger organization_subscriptions_set_updated_at
before update on public.organization_subscriptions
for each row
execute function public.set_updated_at();

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.services enable row level security;
alter table public.availability_rules enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.time_off_periods enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.notification_outbox enable row level security;
alter table public.billing_plans enable row level security;
alter table public.organization_subscriptions enable row level security;

drop policy if exists organizations_select_members on public.organizations;
create policy organizations_select_members
on public.organizations
for select
to authenticated
using (public.is_organization_member(id));

drop policy if exists organizations_update_admins on public.organizations;
create policy organizations_update_admins
on public.organizations
for update
to authenticated
using (public.is_organization_member(id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists organization_members_select_members on public.organization_members;
create policy organization_members_select_members
on public.organization_members
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists services_select_members on public.services;
create policy services_select_members
on public.services
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists services_write_admins on public.services;
create policy services_write_admins
on public.services
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists availability_rules_select_members on public.availability_rules;
create policy availability_rules_select_members
on public.availability_rules
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists availability_rules_write_admins on public.availability_rules;
create policy availability_rules_write_admins
on public.availability_rules
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists blocked_dates_select_members on public.blocked_dates;
create policy blocked_dates_select_members
on public.blocked_dates
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists blocked_dates_write_admins on public.blocked_dates;
create policy blocked_dates_write_admins
on public.blocked_dates
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists time_off_select_members on public.time_off_periods;
create policy time_off_select_members
on public.time_off_periods
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists time_off_write_admins on public.time_off_periods;
create policy time_off_write_admins
on public.time_off_periods
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists customers_select_members on public.customers;
create policy customers_select_members
on public.customers
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists customers_write_admins on public.customers;
create policy customers_write_admins
on public.customers
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists bookings_select_members on public.bookings;
create policy bookings_select_members
on public.bookings
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists bookings_write_admins on public.bookings;
create policy bookings_write_admins
on public.bookings
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

drop policy if exists notification_outbox_select_members on public.notification_outbox;
create policy notification_outbox_select_members
on public.notification_outbox
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists billing_plans_select_authenticated on public.billing_plans;
create policy billing_plans_select_authenticated
on public.billing_plans
for select
to authenticated
using (true);

drop policy if exists organization_subscriptions_select_members on public.organization_subscriptions;
create policy organization_subscriptions_select_members
on public.organization_subscriptions
for select
to authenticated
using (public.is_organization_member(organization_id));

drop policy if exists organization_subscriptions_write_admins on public.organization_subscriptions;
create policy organization_subscriptions_write_admins
on public.organization_subscriptions
for all
to authenticated
using (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]))
with check (public.is_organization_member(organization_id, array['owner', 'admin']::public.membership_role[]));

create or replace function public.create_public_booking(
  p_organization_slug citext,
  p_service_id uuid,
  p_starts_at timestamptz,
  p_customer_name text,
  p_customer_email citext,
  p_customer_phone text default null,
  p_customer_notes text default null
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org public.organizations;
  v_service public.services;
  v_customer public.customers;
  v_booking public.bookings;
  v_ends_at timestamptz;
begin
  select *
  into v_org
  from public.organizations
  where slug = p_organization_slug
    and status in ('active', 'trialing');

  if not found then
    raise exception 'Organization not found';
  end if;

  select *
  into v_service
  from public.services
  where id = p_service_id
    and organization_id = v_org.id
    and is_active = true;

  if not found then
    raise exception 'Service not found';
  end if;

  v_ends_at := p_starts_at + make_interval(mins => v_service.duration_minutes);

  insert into public.customers (
    organization_id,
    full_name,
    email,
    phone,
    notes,
    status,
    first_booked_at,
    last_booked_at
  )
  values (
    v_org.id,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_customer_notes,
    'active',
    p_starts_at,
    p_starts_at
  )
  on conflict (organization_id, email)
  do update
  set
    full_name = excluded.full_name,
    phone = coalesce(excluded.phone, public.customers.phone),
    notes = coalesce(excluded.notes, public.customers.notes),
    last_booked_at = greatest(
      coalesce(public.customers.last_booked_at, excluded.last_booked_at),
      excluded.last_booked_at
    ),
    first_booked_at = least(
      coalesce(public.customers.first_booked_at, excluded.first_booked_at),
      excluded.first_booked_at
    ),
    updated_at = timezone('utc', now())
  returning *
  into v_customer;

  insert into public.bookings (
    organization_id,
    service_id,
    customer_id,
    status,
    source,
    starts_at,
    ends_at,
    buffer_minutes,
    customer_name,
    customer_email,
    customer_phone,
    customer_notes,
    service_name_snapshot,
    service_price_amount,
    service_currency,
    service_duration_minutes
  )
  values (
    v_org.id,
    v_service.id,
    v_customer.id,
    'pending',
    'public',
    p_starts_at,
    v_ends_at,
    v_service.buffer_minutes,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_customer_notes,
    v_service.name,
    v_service.price_amount,
    v_service.currency,
    v_service.duration_minutes
  )
  returning *
  into v_booking;

  insert into public.notification_outbox (
    organization_id,
    booking_id,
    channel,
    template_key,
    payload
  )
  values
    (
      v_org.id,
      v_booking.id,
      'email',
      'booking.created.customer',
      jsonb_build_object(
        'booking_id', v_booking.id,
        'customer_email', p_customer_email,
        'organization_name', v_org.name
      )
    ),
    (
      v_org.id,
      v_booking.id,
      'email',
      'booking.created.owner',
      jsonb_build_object(
        'booking_id', v_booking.id,
        'customer_name', p_customer_name,
        'organization_id', v_org.id
      )
    );

  return v_booking;
exception
  when exclusion_violation then
    raise exception 'Selected slot is no longer available';
end;
$$;

revoke all on function public.create_public_booking(citext, uuid, timestamptz, text, citext, text, text) from public;
grant execute on function public.create_public_booking(citext, uuid, timestamptz, text, citext, text, text) to service_role;

update public.bookings as b
set
  booking_window = tstzrange(
    b.starts_at,
    b.ends_at + make_interval(mins => b.buffer_minutes),
    '[)'
  ),
  service_name_snapshot = s.name,
  service_price_amount = s.price_amount,
  service_currency = s.currency,
  service_duration_minutes = s.duration_minutes
from public.services as s
where s.id = b.service_id
  and (
    b.service_name_snapshot is null
    or b.service_duration_minutes = 0
  );

update public.bookings
set booking_window = tstzrange(
  starts_at,
  ends_at + make_interval(mins => buffer_minutes),
  '[)'
)
where booking_window is null;

alter table public.bookings
  alter column booking_window set not null;

update public.customers as c
set
  first_booked_at = booking_summary.first_booked_at,
  last_booked_at = booking_summary.last_booked_at
from (
  select
    customer_id,
    min(starts_at) as first_booked_at,
    max(starts_at) as last_booked_at
  from public.bookings
  where customer_id is not null
  group by customer_id
) as booking_summary
where booking_summary.customer_id = c.id;

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

commit;

-- Next steps:
-- 1. Create your first auth user via ClientFlow or Supabase Auth.
-- 2. Sign in and let the app create the organization/member/subscription rows.
-- 3. Then add services, availability, and bookings through the UI.
