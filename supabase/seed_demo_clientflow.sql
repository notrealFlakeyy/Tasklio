-- ClientFlow demo seed
-- Run this AFTER setup_clientflow.sql.
-- Replace the owner user id below with a real auth.users id from your Supabase project.

do $$
declare
  v_owner_user_id uuid := '00000000-0000-0000-0000-000000000000';

  v_org_id uuid := '11111111-1111-4111-8111-111111111111';
  v_member_id uuid := '11111111-1111-4111-8111-222222222222';
  v_subscription_id uuid := '11111111-1111-4111-8111-333333333333';

  v_service_consultation_id uuid := '22222222-2222-4222-8222-111111111111';
  v_service_followup_id uuid := '22222222-2222-4222-8222-222222222222';
  v_service_signature_id uuid := '22222222-2222-4222-8222-333333333333';

  v_customer_ava_id uuid := '33333333-3333-4333-8333-111111111111';
  v_customer_noah_id uuid := '33333333-3333-4333-8333-222222222222';
  v_customer_mila_id uuid := '33333333-3333-4333-8333-333333333333';

  v_booking_past_completed_1 uuid := '44444444-4444-4444-8444-111111111111';
  v_booking_past_completed_2 uuid := '44444444-4444-4444-8444-222222222222';
  v_booking_past_cancelled uuid := '44444444-4444-4444-8444-333333333333';
  v_booking_future_confirmed uuid := '44444444-4444-4444-8444-444444444444';
  v_booking_future_pending uuid := '44444444-4444-4444-8444-555555555555';

  v_past_1_start timestamptz := date_trunc('day', now()) - interval '14 days' + interval '09 hours';
  v_past_2_start timestamptz := date_trunc('day', now()) - interval '7 days' + interval '13 hours';
  v_past_cancelled_start timestamptz := date_trunc('day', now()) - interval '3 days' + interval '10 hours';
  v_future_1_start timestamptz := date_trunc('day', now()) + interval '2 days' + interval '09 hours';
  v_future_2_start timestamptz := date_trunc('day', now()) + interval '3 days' + interval '14 hours';
begin
  if not exists (
    select 1
    from auth.users
    where id = v_owner_user_id
  ) then
    raise exception
      'Replace v_owner_user_id in seed_demo_clientflow.sql with a real auth.users id before running this script.';
  end if;

  insert into public.organizations (
    id,
    public_id,
    name,
    slug,
    timezone,
    status,
    booking_notice_hours,
    slot_interval_minutes,
    default_booking_buffer_minutes,
    contact_email,
    contact_phone,
    brand_logo_url,
    brand_primary_color,
    brand_accent_color,
    brand_surface_color,
    brand_alt_color,
    public_tagline,
    public_headline,
    public_description,
    public_site_enabled,
    public_about_title,
    public_about_body,
    public_contact_title,
    public_contact_body,
    created_by
  )
  values (
    v_org_id,
    'org_clientflowdemo',
    'ClientFlow Demo Studio',
    'clientflow-demo',
    'Europe/Helsinki',
    'trialing',
    2,
    15,
    10,
    'hello@clientflow-demo.test',
    '+358401234567',
    null,
    '#443730',
    '#786452',
    '#eaf7cf',
    '#e6fdff',
    'Calm premium booking',
    'A calmer way to book with ClientFlow Demo Studio.',
    'Choose the service that fits, review live availability, and book through a page that already feels like the business behind it.',
    true,
    'A premium service experience that feels personal from the first click',
    'ClientFlow Demo Studio uses the public site as a warmer introduction before clients choose a service. It gives the business room to explain its tone, process, and care philosophy instead of dropping visitors straight into a calendar.',
    'Questions before you book?',
    'Reach out if you want help choosing the right service, want to talk through timing, or need a little guidance before you commit to an appointment.',
    v_owner_user_id
  )
  on conflict (id)
  do update
  set
    public_id = excluded.public_id,
    name = excluded.name,
    slug = excluded.slug,
    timezone = excluded.timezone,
    status = excluded.status,
    booking_notice_hours = excluded.booking_notice_hours,
    slot_interval_minutes = excluded.slot_interval_minutes,
    default_booking_buffer_minutes = excluded.default_booking_buffer_minutes,
    contact_email = excluded.contact_email,
    contact_phone = excluded.contact_phone,
    brand_logo_url = excluded.brand_logo_url,
    brand_primary_color = excluded.brand_primary_color,
    brand_accent_color = excluded.brand_accent_color,
    brand_surface_color = excluded.brand_surface_color,
    brand_alt_color = excluded.brand_alt_color,
    public_tagline = excluded.public_tagline,
    public_headline = excluded.public_headline,
    public_description = excluded.public_description,
    public_site_enabled = excluded.public_site_enabled,
    public_about_title = excluded.public_about_title,
    public_about_body = excluded.public_about_body,
    public_contact_title = excluded.public_contact_title,
    public_contact_body = excluded.public_contact_body,
    created_by = excluded.created_by,
    updated_at = timezone('utc', now());

  insert into public.organization_members (
    id,
    organization_id,
    user_id,
    role,
    is_active
  )
  values (
    v_member_id,
    v_org_id,
    v_owner_user_id,
    'owner',
    true
  )
  on conflict (organization_id, user_id)
  do update
  set
    role = excluded.role,
    is_active = excluded.is_active,
    updated_at = timezone('utc', now());

  insert into public.organization_subscriptions (
    id,
    organization_id,
    plan_id,
    status
  )
  values (
    v_subscription_id,
    v_org_id,
    'starter_pro',
    'trialing'
  )
  on conflict (organization_id)
  do update
  set
    plan_id = excluded.plan_id,
    status = excluded.status,
    updated_at = timezone('utc', now());

  insert into public.services (
    id,
    public_id,
    organization_id,
    name,
    description,
    duration_minutes,
    price_amount,
    currency,
    buffer_minutes,
    is_active
  )
  values
    (
      v_service_consultation_id,
      'srv_consultflow',
      v_org_id,
      'Initial Consultation',
      'A premium first visit focused on goals, fit, and a clear recommended next step.',
      60,
      8900,
      'EUR',
      15,
      true
    ),
    (
      v_service_followup_id,
      'srv_followflow',
      v_org_id,
      'Follow-Up Session',
      'A shorter return visit for ongoing client care, check-ins, and measured progress.',
      45,
      6900,
      'EUR',
      10,
      true
    ),
    (
      v_service_signature_id,
      'srv_signature1',
      v_org_id,
      'Signature Deep Session',
      'A longer flagship appointment designed for higher-touch premium work.',
      90,
      15900,
      'EUR',
      15,
      true
    )
  on conflict (id)
  do update
  set
    public_id = excluded.public_id,
    organization_id = excluded.organization_id,
    name = excluded.name,
    description = excluded.description,
    duration_minutes = excluded.duration_minutes,
    price_amount = excluded.price_amount,
    currency = excluded.currency,
    buffer_minutes = excluded.buffer_minutes,
    is_active = excluded.is_active,
    updated_at = timezone('utc', now());

  delete from public.availability_rules
  where organization_id = v_org_id;

  insert into public.availability_rules (
    organization_id,
    weekday,
    start_minute,
    end_minute,
    is_active
  )
  values
    (v_org_id, 1, 540, 1020, true),
    (v_org_id, 2, 540, 1020, true),
    (v_org_id, 3, 540, 1020, true),
    (v_org_id, 4, 540, 1020, true),
    (v_org_id, 5, 540, 960, true);

  delete from public.blocked_dates
  where organization_id = v_org_id;

  insert into public.blocked_dates (
    organization_id,
    blocked_on,
    reason
  )
  values (
    v_org_id,
    current_date + 10,
    'Studio reset day'
  );

  delete from public.time_off_periods
  where organization_id = v_org_id;

  insert into public.time_off_periods (
    organization_id,
    starts_at,
    ends_at,
    reason
  )
  values (
    v_org_id,
    date_trunc('day', now()) + interval '5 days' + interval '12 hours',
    date_trunc('day', now()) + interval '5 days' + interval '15 hours',
    'Workshop afternoon'
  );

  insert into public.customers (
    id,
    public_id,
    organization_id,
    full_name,
    email,
    phone,
    notes,
    status,
    tags,
    internal_notes,
    first_booked_at,
    last_booked_at
  )
  values
    (
      v_customer_ava_id,
      'cus_avaflow01',
      v_org_id,
      'Ava Lindholm',
      'ava@example.com',
      '+358401111111',
      'Prefers morning sessions and concise follow-up notes.',
      'vip',
      array['vip', 'recurring'],
      'High retention client. Offer priority openings when available.',
      v_past_1_start,
      v_future_1_start
    ),
    (
      v_customer_noah_id,
      'cus_noahflow1',
      v_org_id,
      'Noah Virtanen',
      'noah@example.com',
      '+358402222222',
      'Booked after a referral and usually confirms by email quickly.',
      'active',
      array['referral'],
      'Good candidate for a package upgrade.',
      v_past_2_start,
      v_future_2_start
    ),
    (
      v_customer_mila_id,
      'cus_milaflow1',
      v_org_id,
      'Mila Saarinen',
      'mila@example.com',
      '+358403333333',
      'Lead record created from a recent public booking.',
      'lead',
      array['new'],
      'First session still pending confirmation.',
      v_past_cancelled_start,
      v_future_2_start
    )
  on conflict (id)
  do update
  set
    public_id = excluded.public_id,
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    notes = excluded.notes,
    status = excluded.status,
    tags = excluded.tags,
    internal_notes = excluded.internal_notes,
    first_booked_at = excluded.first_booked_at,
    last_booked_at = excluded.last_booked_at,
    updated_at = timezone('utc', now());

  insert into public.bookings (
    id,
    public_id,
    organization_id,
    service_id,
    customer_id,
    created_by_member_id,
    status,
    source,
    starts_at,
    ends_at,
    buffer_minutes,
    customer_name,
    customer_email,
    customer_phone,
    customer_notes,
    internal_notes,
    service_name_snapshot,
    service_price_amount,
    service_currency,
    service_duration_minutes,
    confirmed_at,
    cancelled_at
  )
  values
    (
      v_booking_past_completed_1,
      'bok_demo00001',
      v_org_id,
      v_service_consultation_id,
      v_customer_ava_id,
      v_member_id,
      'completed',
      'dashboard',
      v_past_1_start,
      v_past_1_start + interval '60 minutes',
      15,
      'Ava Lindholm',
      'ava@example.com',
      '+358401111111',
      'Please keep the room calm and quiet.',
      'Completed smoothly. Strong upsell potential.',
      'Initial Consultation',
      8900,
      'EUR',
      60,
      v_past_1_start - interval '2 days',
      null
    ),
    (
      v_booking_past_completed_2,
      'bok_demo00002',
      v_org_id,
      v_service_followup_id,
      v_customer_noah_id,
      v_member_id,
      'completed',
      'dashboard',
      v_past_2_start,
      v_past_2_start + interval '45 minutes',
      10,
      'Noah Virtanen',
      'noah@example.com',
      '+358402222222',
      'Interested in long-term follow-up cadence.',
      'Completed and responded well to next-step recommendation.',
      'Follow-Up Session',
      6900,
      'EUR',
      45,
      v_past_2_start - interval '1 day',
      null
    ),
    (
      v_booking_past_cancelled,
      'bok_demo00003',
      v_org_id,
      v_service_followup_id,
      v_customer_mila_id,
      v_member_id,
      'cancelled',
      'public',
      v_past_cancelled_start,
      v_past_cancelled_start + interval '45 minutes',
      10,
      'Mila Saarinen',
      'mila@example.com',
      '+358403333333',
      'Needed to reschedule due to work.',
      'Cancelled by client before confirmation.',
      'Follow-Up Session',
      6900,
      'EUR',
      45,
      null,
      v_past_cancelled_start - interval '1 day'
    ),
    (
      v_booking_future_confirmed,
      'bok_demo00004',
      v_org_id,
      v_service_consultation_id,
      v_customer_ava_id,
      v_member_id,
      'confirmed',
      'dashboard',
      v_future_1_start,
      v_future_1_start + interval '60 minutes',
      15,
      'Ava Lindholm',
      'ava@example.com',
      '+358401111111',
      'Would like to review last session notes at the start.',
      'Prepare retention offer.',
      'Initial Consultation',
      8900,
      'EUR',
      60,
      now(),
      null
    ),
    (
      v_booking_future_pending,
      'bok_demo00005',
      v_org_id,
      v_service_signature_id,
      v_customer_noah_id,
      v_member_id,
      'pending',
      'public',
      v_future_2_start,
      v_future_2_start + interval '90 minutes',
      15,
      'Noah Virtanen',
      'noah@example.com',
      '+358402222222',
      'Open to trying the longer premium format.',
      'Pending confirmation. Strong package lead.',
      'Signature Deep Session',
      15900,
      'EUR',
      90,
      null,
      null
    )
  on conflict (id)
  do update
  set
    public_id = excluded.public_id,
    organization_id = excluded.organization_id,
    service_id = excluded.service_id,
    customer_id = excluded.customer_id,
    created_by_member_id = excluded.created_by_member_id,
    status = excluded.status,
    source = excluded.source,
    starts_at = excluded.starts_at,
    ends_at = excluded.ends_at,
    buffer_minutes = excluded.buffer_minutes,
    customer_name = excluded.customer_name,
    customer_email = excluded.customer_email,
    customer_phone = excluded.customer_phone,
    customer_notes = excluded.customer_notes,
    internal_notes = excluded.internal_notes,
    service_name_snapshot = excluded.service_name_snapshot,
    service_price_amount = excluded.service_price_amount,
    service_currency = excluded.service_currency,
    service_duration_minutes = excluded.service_duration_minutes,
    confirmed_at = excluded.confirmed_at,
    cancelled_at = excluded.cancelled_at,
    updated_at = timezone('utc', now());

  delete from public.notification_outbox
  where organization_id = v_org_id;

  insert into public.notification_outbox (
    organization_id,
    booking_id,
    channel,
    template_key,
    payload,
    status
  )
  values
    (
      v_org_id,
      v_booking_future_confirmed,
      'email',
      'booking.confirmed.customer',
      jsonb_build_object('booking_id', v_booking_future_confirmed, 'customer_name', 'Ava Lindholm'),
      'queued'
    ),
    (
      v_org_id,
      v_booking_future_pending,
      'email',
      'booking.created.owner',
      jsonb_build_object('booking_id', v_booking_future_pending, 'customer_name', 'Noah Virtanen'),
      'queued'
    );
end
$$;

update public.customers as c
set
  first_booked_at = booking_summary.first_booked_at,
  last_booked_at = booking_summary.last_booked_at,
  updated_at = timezone('utc', now())
from (
  select
    customer_id,
    min(starts_at) as first_booked_at,
    max(starts_at) as last_booked_at
  from public.bookings
  where customer_id is not null
    and organization_id = '11111111-1111-4111-8111-111111111111'
  group by customer_id
) as booking_summary
where c.id = booking_summary.customer_id;
