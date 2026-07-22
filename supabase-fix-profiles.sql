-- ═══════════════════════════════════════════════
-- DRENZO AI — Fix missing profiles for existing users
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. Create profiles for any existing auth users who don't have one
insert into public.profiles (id, email, name)
select
  au.id,
  au.email,
  split_part(au.email, '@', 1)
from auth.users au
left join public.profiles p on p.id = au.id
where p.id is null
on conflict (id) do nothing;

-- 2. Create default settings for any users missing them
insert into public.user_settings (user_id)
select p.id
from public.profiles p
left join public.user_settings s on s.user_id = p.id
where s.user_id is null;

-- 3. Fix the trigger function to use proper search_path
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = 'public, pg_temp'
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, split_part(new.email, '@', 1));

  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;
