# Database (Supabase)

Project: `gjighnkovapyekuxblbn` (eu-west-1). The site talks to it with the publishable key; everything
sensitive is enforced in the database (row-level security and `security definer` functions).

## First-time setup

1. Supabase → **SQL Editor** → New query → paste the whole of [`setup.sql`](./setup.sql) → **Run**.
   It creates the tables, functions, security rules and the 611 watch variants of order 2026-023A004.
2. Supabase → **Authentication → URL Configuration**: Site URL `https://www.daniel-caesar.com`;
   add `https://www.daniel-caesar.com/**` to Redirect URLs.
3. Create your staff login: open `https://www.daniel-caesar.com/admin` → *Sign up*, then confirm the email.
4. Make that login an admin (SQL Editor, replace the address):

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin' from auth.users where email = 'you@example.com'
   on conflict do nothing;
   ```

   Repeat step 3–4 for each staff member. To remove access: `delete from public.user_roles where user_id = (select id from auth.users where email = '...');`

## Later changes

Each change is a new file in [`migrations/`](./migrations), run in the SQL Editor in name order.
`setup.sql` is only for a brand-new project.
