# ClearIntake — Setup & Deployment Guide

## What you're building

ClearIntake is an AI-powered legal intake and triage platform for UK law firms.
It gives firms a branded, guided enquiry form and an internal dashboard where
staff can review AI-triaged leads, add notes, and update statuses.

---

## Prerequisites

- Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- A free [Supabase](https://supabase.com) account
- An [OpenAI](https://platform.openai.com) account with API access
- A [Vercel](https://vercel.com) account (for deployment)
- Git installed

---

## Part 1 — Supabase Setup

### 1. Create a new Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name (e.g. `clearintake-prod`) and a strong database password
3. Select the **London** region (eu-west-2) for UK GDPR compliance
4. Wait ~2 minutes for the project to spin up

### 2. Run the database schema

1. In your Supabase project, go to **SQL Editor** → **New query**
2. Open `supabase/migrations/001_initial_schema.sql` from this repo
3. Paste the entire contents and click **Run**
4. You should see: `Success. No rows returned`

### 3. Get your API keys

Go to **Project Settings** → **API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key (keep secret) |

### 4. Create your first user

1. Go to **Authentication** → **Users** → **Invite user**
2. Enter your email address and click **Send invite**
3. Check your email and set a password via the link

### 5. Link the user to the demo firm

Back in **SQL Editor**, run this query (replace the UUID):

```sql
-- First, find your user's UUID
select id, email from auth.users;

-- Then insert your profile row
insert into users (id, firm_id, full_name, role)
values (
  '<paste-your-uuid-here>',
  (select id from firms where slug = 'demo'),
  'Your Name',
  'admin'
);
```

---

## Part 2 — OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com) → API Keys → Create new key
2. Copy the key (starts with `sk-proj-...`)
3. Make sure your account has **GPT-4o access** (requires billing set up)

> **Cost estimate:** GPT-4o costs roughly $0.005 per intake submission at typical lengths.
> A firm receiving 100 leads/month would spend ~$0.50/month on AI.

---

## Part 3 — Local Development

### 1. Clone and install

```bash
git clone <your-repo-url> clearintake
cd clearintake
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all five values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

You'll be redirected to `/login`. Sign in with the credentials you created in Supabase.

### 4. Test the intake form

Visit: [http://localhost:3000/intake/demo](http://localhost:3000/intake/demo)

This is the public intake form for the "Demo Law Firm". Fill it in and submit —
you should see the lead appear in your dashboard within a few seconds, with an
AI summary attached.

---

## Part 4 — Setting Up a Real Firm

To onboard a real law firm, add a row to the `firms` table:

```sql
insert into firms (name, slug, contact_email, plan)
values ('Smith & Jones Solicitors', 'smith-jones', 'admin@smithjones.co.uk', 'trial');
```

Then create an auth user for them and link it:

```sql
-- After creating the user in Supabase Auth:
insert into users (id, firm_id, full_name, role)
values (
  '<their-auth-user-uuid>',
  (select id from firms where slug = 'smith-jones'),
  'Jane Smith',
  'admin'
);
```

Their intake URL will be: `https://yourapp.com/intake/smith-jones`

---

## Part 5 — Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial ClearIntake build"
git remote add origin https://github.com/yourusername/clearintake.git
git push -u origin main
```

### 2. Connect Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** — the first deploy will fail because env vars aren't set yet

### 3. Add environment variables in Vercel

Go to your Vercel project → **Settings** → **Environment Variables**

Add these for **Production**, **Preview**, and **Development**:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `OPENAI_API_KEY` | Your OpenAI key |
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-domain.vercel.app` |

### 4. Redeploy

Go to **Deployments** → click the three dots on the latest deploy → **Redeploy**.

Your app is now live. The intake form for your demo firm is at:
`https://your-vercel-domain.vercel.app/intake/demo`

### 5. Set up a custom domain (optional)

In Vercel → **Settings** → **Domains**, add your domain (e.g. `app.clearintake.co.uk`).

Then update `NEXT_PUBLIC_APP_URL` to match.

---

## Part 6 — Custom Domain for Supabase Auth (optional but recommended)

By default, Supabase auth emails come from a generic address.
For a professional setup, configure a custom SMTP in **Supabase → Auth → SMTP Settings**.

---

## Folder Structure Reference

```
clearintake/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   └── leads.ts              ← Server actions (submit, update, notes)
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            ← Dashboard shell + nav
│   │   │   ├── page.tsx              ← Leads list with filters
│   │   │   ├── settings/page.tsx     ← Firm settings
│   │   │   └── leads/[id]/
│   │   │       ├── page.tsx          ← Lead detail + AI summary
│   │   │       └── not-found.tsx
│   │   ├── intake/[slug]/
│   │   │   ├── page.tsx              ← Public intake form page
│   │   │   └── thank-you/page.tsx    ← Post-submission confirmation
│   │   ├── login/page.tsx            ← Auth page
│   │   ├── layout.tsx                ← Root layout
│   │   ├── page.tsx                  ← Root redirect
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── nav.tsx               ← Sidebar + mobile nav
│   │   │   ├── status-badge.tsx      ← Reusable badges
│   │   │   ├── status-filter-bar.tsx ← Filter controls
│   │   │   ├── lead-status-updater.tsx
│   │   │   ├── lead-notes.tsx
│   │   │   └── copy-button.tsx
│   │   ├── intake/
│   │   │   ├── intake-wizard.tsx     ← Multi-step form shell
│   │   │   └── steps/
│   │   │       ├── step1-area.tsx
│   │   │       ├── step2-contact.tsx
│   │   │       ├── step3-case.tsx
│   │   │       └── step4-review.tsx
│   │   └── ui/
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── select.tsx
│   │       └── toast.tsx
│   ├── lib/
│   │   ├── ai.ts                     ← OpenAI prompt + triage logic
│   │   ├── intake-fields.ts          ← Conditional fields per area of law
│   │   ├── utils.ts                  ← Labels, colours, date helpers
│   │   └── supabase/
│   │       ├── client.ts             ← Browser client
│   │       ├── server.ts             ← Server component client
│   │       └── service.ts            ← Service role client (bypasses RLS)
│   ├── types/index.ts                ← All shared TypeScript types
│   └── middleware.ts                 ← Auth route protection
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    ← Complete DB schema + RLS
├── .env.local.example
├── .gitignore
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Adding Firms at Scale

When you have multiple firms, each gets:
- A unique `slug` → their intake URL: `/intake/[slug]`
- Their own RLS-protected row in `firms`
- Their own users linked via `users.firm_id`
- All their leads, notes, and summaries scoped by `firm_id`

The multi-tenant architecture is fully in place from day one.

---

## Troubleshooting

**"Firm not found" on intake form**
→ Check the slug in your URL matches exactly what's in the `firms` table.

**Login redirects back to login**
→ Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct.
→ Make sure you've created a `users` row linked to your auth user.

**AI summary not appearing**
→ Check `OPENAI_API_KEY` is set and your account has GPT-4o access.
→ Check Vercel function logs for errors.

**RLS errors in dashboard**
→ Make sure your `users` row has the correct `firm_id`.
→ Re-run the `get_user_firm_id()` function in SQL editor to verify it returns your firm ID.

---

## V2 Roadmap (not in MVP)

- [ ] Email notifications to firm when new lead arrives
- [ ] Stripe billing + subscription management UI
- [ ] Role-based permissions (admin vs staff)
- [ ] Document upload (Supabase Storage)
- [ ] Firm branding (logo, colours on intake page)
- [ ] Lead export to CSV
- [ ] Analytics dashboard (leads over time, conversion rates)
- [ ] AI summary regeneration button
- [ ] Webhook for CRM integrations
