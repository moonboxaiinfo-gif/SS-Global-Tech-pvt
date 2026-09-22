# SS Global Tech ERP — Supabase, GitHub, and Netlify deployment

## 1. Configure Supabase

Create a Supabase project and copy the **Project URL** and the browser-safe **publishable/anon key** from **Project Settings → API**. Never place the `service_role` key in this repository or in browser-exposed environment variables.

Run the migrations in `supabase/migrations/` in filename/date order. The current application expects the ERP core, CRM, inventory, payroll, project expenses, finance ledger, warranties, and employee advances migrations. The consolidated `SUPABASE_SQL_EDITOR_ALL.sql` is available when a single SQL Editor import is preferred; it is intentionally destructive and should only be used on a new or disposable project.

Create a user under **Authentication → Users**. The profile trigger creates a `profiles` row with the default `Technician` role. Change the role to `Owner`, `Manager`, `Accountant`, or `Technician` in the `profiles` table as appropriate. Confirm that the RLS policies from the migrations are enabled before adding real business data.

## 2. Local environment

Copy `.env.example` to `.env.local` and fill in the two Supabase values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_ANON_KEY
```

Then run:

```bash
npm install
npm run build:static
npm run check
npm test -- --run
```

The local `.env` files are ignored by Git. The frontend deliberately accepts only the public Supabase key. Production login fails closed when either required variable is missing.

## 3. GitHub

Commit the source repository, migrations, `netlify.toml`, `.env.example`, and this deployment guide. Do **not** commit `.env`, `.env.local`, Supabase access tokens, database passwords, or a `service_role` key.

## 4. Netlify

Import the GitHub repository into Netlify. The repository already includes `netlify.toml`, which configures:

- Build command: `npm run build:static`
- Publish directory: `dist/public`
- Node.js version: 22
- SPA fallback: every route serves `/index.html`
- Basic security headers and immutable caching for hashed assets

In **Site configuration → Environment variables**, add:

| Variable | Value | Scope |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase Project URL | Production and Deploy Previews |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable/anon key | Production and Deploy Previews |

Trigger a fresh deploy after saving variables because Vite embeds `VITE_*` values at build time. In Supabase **Authentication → URL Configuration**, add the deployed Netlify URL to **Site URL** and add the Netlify deploy/preview URLs to **Redirect URLs** if email confirmation or password recovery links are used.

## 5. Post-deploy checks

Open `/login` directly and refresh a nested route such as `/app/dashboard` to verify the SPA fallback. Sign in with a real Supabase Auth user whose `profiles` row exists. Confirm that empty tables show empty states rather than demo records, then create one test record in CRM, Employees, Projects, Inventory, and Finance and verify it persists after a hard refresh. Remove test data only after confirming the RLS policies and CRUD behavior.

The current Netlify target is the static client. The legacy Express/tRPC server remains available for local/full-stack development through `npm run dev`, but the main ERP pages use Supabase directly and therefore do not require a long-running Node server on Netlify.
