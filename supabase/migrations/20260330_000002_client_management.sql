do $$
begin
  if not exists (select 1 from pg_type where typname = 'customer_status') then
    create type public.customer_status as enum ('lead', 'active', 'vip', 'inactive');
  end if;
end
$$;

alter table public.customers
  add column if not exists status public.customer_status not null default 'active',
  add column if not exists tags text[] not null default '{}',
  add column if not exists internal_notes text,
  add column if not exists first_booked_at timestamptz,
  add column if not exists last_booked_at timestamptz;

alter table public.bookings
  add column if not exists service_name_snapshot text,
  add column if not exists service_price_amount integer not null default 0,
  add column if not exists service_currency char(3) not null default 'EUR',
  add column if not exists service_duration_minutes integer not null default 0;

update public.bookings as b
set
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

create index if not exists customers_org_status_idx on public.customers (organization_id, status);
create index if not exists customers_tags_gin_idx on public.customers using gin (tags);
create index if not exists customers_last_booked_at_idx on public.customers (organization_id, last_booked_at desc);
create index if not exists bookings_service_snapshot_idx on public.bookings (organization_id, service_id, status);

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
    last_booked_at = greatest(coalesce(public.customers.last_booked_at, excluded.last_booked_at), excluded.last_booked_at),
    first_booked_at = least(coalesce(public.customers.first_booked_at, excluded.first_booked_at), excluded.first_booked_at),
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
