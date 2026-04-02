alter table public.organizations
  add column if not exists public_site_enabled boolean not null default true,
  add column if not exists public_about_title text,
  add column if not exists public_about_body text,
  add column if not exists public_contact_title text,
  add column if not exists public_contact_body text;

update public.organizations
set public_site_enabled = coalesce(public_site_enabled, true);
