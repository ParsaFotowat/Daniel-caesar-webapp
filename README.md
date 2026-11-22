# Daniel Caesar web app

Bilingual (English / Persian) showroom and QR digital-warranty system for Daniel Caesar watches.
Live at https://www.daniel-caesar.com.

- **Stack:** TanStack Start (React, Vite), Tailwind CSS, Supabase (database + staff login), hosted on Vercel.
- **Email:** warranty confirmations are sent through Resend.

## Run locally

```bash
cp .env.example .env   # then fill in the keys
npm install
npm run dev            # http://localhost:3000
```

## Deploy

Pushing to `main` deploys to Vercel. Environment variables (see `.env.example`) live in
Vercel → Settings → Environment Variables. Database setup and staff access: [`supabase/README.md`](supabase/README.md).

## Where things are

| Path | What |
| --- | --- |
| `src/lib/catalog.ts` | Showroom watches and retailers (English and Persian) |
| `src/routes/warranty.*` | Customer warranty activation and certificate |
| `src/routes/admin.tsx` | Staff panel: generate codes, print QR labels, search, void |
| `src/lib/warranty*.ts` | Code format, activation server function, confirmation email |
| `supabase/` | Database schema and setup |
