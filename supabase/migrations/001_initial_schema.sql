-- =============================================================
-- ClearIntake — Full Database Schema
-- Run this entire file in: Supabase → SQL Editor → New Query
-- =============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- =============================================================
-- FIRMS
-- One row per law firm customer. The slug drives the public
-- intake URL: /intake/[slug]
-- =============================================================
create table firms (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text unique not null,
  contact_email       text,
  plan                text not null default 'trial',
  stripe_customer_id  text,
  stripe_sub_id       text,
  active              boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- =============================================================
-- USERS
-- Extends Supabase auth.users. One profile row per staff member.
-- =============================================================
create table users (
  id          uuid primary key references auth.users(id) on delete cascade,
  firm_id     uuid not null references firms(id) on delete cascade,
  full_name   text not null,
  role        text not null default 'staff',  -- 'admin' | 'staff'
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- =============================================================
-- LEADS
-- One row per public intake submission.
-- =============================================================
create table leads (
  id                  uuid primary key default uuid_generate_v4(),
  firm_id             uuid not null references firms(id) on delete cascade,
  full_name           text not null,
  email               text not null,
  phone               text,
  area_of_law         text not null,
  urgency             text not null,
  issue_description   text not null,
  opposing_party      text,
  relevant_dates      text,
  budget_preference   text,
  has_documents       boolean not null default false,
  status              text not null default 'new',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- =============================================================
-- INTAKE_RESPONSES
-- Conditional area-specific answers stored as JSON.
-- One row per lead (1-to-1).
-- =============================================================
create table intake_responses (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid unique not null references leads(id) on delete cascade,
  responses   jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

-- =============================================================
-- AI_SUMMARIES
-- OpenAI triage output. Stored separately so it can be
-- regenerated independently of the lead record.
-- =============================================================
create table ai_summaries (
  id                  uuid primary key default uuid_generate_v4(),
  lead_id             uuid unique not null references leads(id) on delete cascade,
  case_synopsis       text,
  key_facts           jsonb not null default '[]',
  triage_label        text,
  triage_reason       text,
  next_step           text,
  next_step_rationale text,
  flags               jsonb not null default '[]',
  model_used          text,
  generated_at        timestamptz not null default now()
);

-- =============================================================
-- LEAD_NOTES
-- Internal staff notes attached to a lead.
-- =============================================================
create table lead_notes (
  id          uuid primary key default uuid_generate_v4(),
  lead_id     uuid not null references leads(id) on delete cascade,
  user_id     uuid not null references users(id) on delete cascade,
  note        text not null,
  created_at  timestamptz not null default now()
);

-- =============================================================
-- SUBSCRIPTIONS (billing-ready, not active in v1)
-- =============================================================
create table subscriptions (
  id                  uuid primary key default uuid_generate_v4(),
  firm_id             uuid not null references firms(id) on delete cascade,
  stripe_sub_id       text unique,
  plan                text,
  status              text,
  current_period_end  timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- =============================================================
-- UPDATED_AT TRIGGER
-- =============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger firms_updated_at
  before update on firms for each row execute function handle_updated_at();
create trigger users_updated_at
  before update on users for each row execute function handle_updated_at();
create trigger leads_updated_at
  before update on leads for each row execute function handle_updated_at();
create trigger subscriptions_updated_at
  before update on subscriptions for each row execute function handle_updated_at();

-- =============================================================
-- ROW LEVEL SECURITY
-- =============================================================
alter table firms            enable row level security;
alter table users            enable row level security;
alter table leads            enable row level security;
alter table intake_responses enable row level security;
alter table ai_summaries     enable row level security;
alter table lead_notes       enable row level security;
alter table subscriptions    enable row level security;

-- Helper: returns the firm_id of the currently logged-in user
create or replace function get_user_firm_id()
returns uuid language sql security definer as $$
  select firm_id from users where id = auth.uid()
$$;

-- FIRMS
create policy "users see own firm"
  on firms for select using (id = get_user_firm_id());
create policy "users update own firm"
  on firms for update using (id = get_user_firm_id());

-- USERS
create policy "users see firm colleagues"
  on users for select using (firm_id = get_user_firm_id());
create policy "users update own profile"
  on users for update using (id = auth.uid());

-- LEADS (read + update by firm users; insert via service role from server action)
create policy "firm sees own leads"
  on leads for select using (firm_id = get_user_firm_id());
create policy "firm updates own leads"
  on leads for update using (firm_id = get_user_firm_id());

-- INTAKE_RESPONSES
create policy "firm sees own responses"
  on intake_responses for select using (
    lead_id in (select id from leads where firm_id = get_user_firm_id())
  );

-- AI_SUMMARIES
create policy "firm sees own summaries"
  on ai_summaries for select using (
    lead_id in (select id from leads where firm_id = get_user_firm_id())
  );

-- LEAD_NOTES
create policy "firm sees own notes"
  on lead_notes for select using (
    lead_id in (select id from leads where firm_id = get_user_firm_id())
  );
create policy "firm users insert notes"
  on lead_notes for insert with check (
    lead_id in (select id from leads where firm_id = get_user_firm_id())
    and user_id = auth.uid()
  );

-- SUBSCRIPTIONS
create policy "firm sees own subscription"
  on subscriptions for select using (firm_id = get_user_firm_id());

-- =============================================================
-- SEED: Demo firm for local development
-- After running this, create a Supabase Auth user manually,
-- then run the INSERT into users shown below.
-- =============================================================
insert into firms (name, slug, contact_email, plan)
values ('Demo Law Firm', 'demo', 'admin@demolawfirm.co.uk', 'trial');

-- After creating your auth user in Supabase → Authentication → Users:
-- replace <YOUR_AUTH_USER_UUID> with your actual UUID, then run:
--
-- insert into users (id, firm_id, full_name, role)
-- values (
--   '<YOUR_AUTH_USER_UUID>',
--   (select id from firms where slug = 'demo'),
--   'Demo Admin',
--   'admin'
-- );
