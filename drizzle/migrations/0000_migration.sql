create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated; grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.warranties (
  id uuid primary key default gen_random_uuid(),
  serial text not null unique,
  model text not null,
  retailer text,
  sale_date date,
  status text not null default 'pending' check (status in ('pending','active','void')),
  owner_name text, owner_phone text, activated_at timestamptz,
  created_at timestamptz not null default now());
grant select, insert, update, delete on public.warranties to authenticated; grant all on public.warranties to service_role;
alter table public.warranties enable row level security;
create policy "admins manage warranties" on public.warranties for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null, contact text not null, topic text not null, message text not null,
  created_at timestamptz not null default now());
grant insert on public.contact_messages to anon, authenticated; grant select on public.contact_messages to authenticated; grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "anyone can send" on public.contact_messages for insert to anon, authenticated with check (length(name) between 1 and 120 and length(contact) between 3 and 160 and length(message) between 1 and 4000);
create policy "admins read messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- public lookup / activation via security definer functions (no PII returned)
create or replace function public.lookup_warranty(_serial text) returns table(serial text, model text, retailer text, sale_date date, status text, activated_at timestamptz) language sql stable security definer set search_path = public as $$
  select serial, model, retailer, sale_date, status, activated_at from public.warranties where serial = upper(trim(_serial)) $$;
create or replace function public.activate_warranty(_serial text, _name text, _phone text) returns text language plpgsql security definer set search_path = public as $$
declare s text;
begin
  if length(trim(_name)) < 2 or length(trim(_name)) > 120 or length(trim(_phone)) < 6 or length(trim(_phone)) > 30 then return 'invalid'; end if;
  select status into s from public.warranties where serial = upper(trim(_serial));
  if s is null then return 'not_found'; end if;
  if s <> 'pending' then return s; end if;
  update public.warranties set status='active', owner_name=trim(_name), owner_phone=trim(_phone), activated_at=now() where serial = upper(trim(_serial));
  return 'activated';
end $$;
grant execute on function public.lookup_warranty(text), public.activate_warranty(text,text,text) to anon, authenticated;

insert into public.warranties (serial, model, retailer, sale_date, status, activated_at) values
 ('DC-2026-0001','Meridian 41','Daniel Caesar Boutique','2026-03-12','active', now()),
 ('DC-2026-0042','Nocturne Skeleton','Isfahan Time House','2026-05-02','active', now()),
 ('DC-2026-0100','Voyager 42','Shiraz Horology',null,'pending', null);