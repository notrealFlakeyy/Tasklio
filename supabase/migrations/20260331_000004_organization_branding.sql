alter table public.organizations
  add column if not exists brand_logo_url text,
  add column if not exists brand_primary_color text not null default '#443730',
  add column if not exists brand_accent_color text not null default '#786452',
  add column if not exists brand_surface_color text not null default '#eaf7cf',
  add column if not exists brand_alt_color text not null default '#e6fdff',
  add column if not exists public_tagline text,
  add column if not exists public_headline text,
  add column if not exists public_description text;

update public.organizations
set
  brand_primary_color = coalesce(nullif(trim(brand_primary_color), ''), '#443730'),
  brand_accent_color = coalesce(nullif(trim(brand_accent_color), ''), '#786452'),
  brand_surface_color = coalesce(nullif(trim(brand_surface_color), ''), '#eaf7cf'),
  brand_alt_color = coalesce(nullif(trim(brand_alt_color), ''), '#e6fdff');
