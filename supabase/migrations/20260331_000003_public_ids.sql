create or replace function public.generate_public_id(prefix text)
returns text
language sql
volatile
as $$
  select lower(prefix) || '_' || substr(md5(random()::text || clock_timestamp()::text || prefix), 1, 12);
$$;

alter table public.organizations
  add column if not exists public_id text;

alter table public.services
  add column if not exists public_id text;

alter table public.customers
  add column if not exists public_id text;

alter table public.bookings
  add column if not exists public_id text;

update public.organizations
set public_id = public.generate_public_id('org')
where public_id is null;

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

create unique index if not exists organizations_public_id_key on public.organizations (public_id);
create unique index if not exists services_public_id_key on public.services (public_id);
create unique index if not exists customers_public_id_key on public.customers (public_id);
create unique index if not exists bookings_public_id_key on public.bookings (public_id);
