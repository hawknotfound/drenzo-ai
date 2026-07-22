-- ═══════════════════════════════════════════════
-- DRENZO AI — Complete Supabase Setup
-- Run this entire file in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- ═══════════════════════════════════════════════
-- 1. TABLES
-- ═══════════════════════════════════════════════

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null default 'New Chat',
  is_pinned boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_pinned on public.conversations(user_id, is_pinned);

-- Messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_created_at on public.messages(conversation_id, created_at);

-- Conversation Metadata
create table if not exists public.conversation_metadata (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(conversation_id, key)
);

-- User Settings
create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.profiles(id) on delete cascade,
  theme text default 'dark',
  model text default 'deepseek-v4-flash-free',
  temperature float default 0.7,
  max_tokens int default 4096,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Usage Tracking
create table if not exists public.usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tokens_in int not null default 0,
  tokens_out int not null default 0,
  model text not null,
  endpoint text not null,
  created_at timestamptz default now()
);
create index if not exists idx_usage_user_id on public.usage(user_id);

-- Feedback
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  message_id uuid not null references public.messages(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════
-- 2. SECURITY: BLOCK DISPOSABLE / TEMP EMAILS
-- ═══════════════════════════════════════════════

-- Known disposable email domains (extended list)
create table if not exists public.blocked_email_domains (
  domain text primary key
);

-- Insert known temp-mail domains
insert into public.blocked_email_domains (domain) values
  ('mailinator.com'), ('guerrillamail.com'), ('sharklasers.com'),
  ('grr.la'), ('guerrillamail.org'), ('guerrillamail.biz'),
  ('guerrillamail.net'), ('guerrillamail.de'), ('guerrillamail.co.uk'),
  ('tempmail.com'), ('temp-mail.org'), ('temp-mail.info'),
  ('10minutemail.com'), ('10minutemail.org'), ('10minute-mail.com'),
  ('throwaway.email'), ('throwawaymail.com'), ('trashmail.com'),
  ('trashmail.net'), ('trashmail.org'), ('trashmail.ws'),
  ('yopmail.com'), ('yopmail.fr'), ('yopmail.net'),
  ('mailnator.com'), ('mailexpire.com'), ('maildrop.cc'),
  ('mailtothis.com'), ('radioslave.com'), ('sogetthis.com'),
  ('spamgourmet.com'), ('spamfree24.org'), ('spamfree24.de'),
  ('spamfree24.com'), ('spamfree24.eu'), ('spamfree24.info'),
  ('spamfree24.net'), ('spamfree24.biz'), ('spamfree24.ru'),
  ('mailmetrash.com'), ('mytrashmail.com'), ('trash2009.com'),
  ('mt2009.com'), ('trashymail.com'), ('tyldd.com'),
  ('uggsrock.com'), ('wegwerfmail.de'), ('wegwerfmail.net'),
  ('wegwerfmail.org'), ('wh4f.org'), ('whyspam.me'),
  ('willselfdestruct.com'), ('winemaven.info'), ('wronghead.com'),
  ('wuzup.net'), ('xagloo.com'), ('xemaps.com'),
  ('xents.com'), ('xmaily.com'), ('xoxy.net'),
  ('yep.it'), ('yogamaven.com'), ('yopmail.com'),
  ('ypmail.webarnak.com'), ('zehnminutenmail.de'), ('zippymail.info'),
  ('zoaxe.com'), ('zoemail.org'), ('tempinbox.com'),
  ('tempinbox.co.uk'), ('dispostable.com'), ('mailcatch.com'),
  ('maileater.com'), ('mailnesia.com'), ('mailnull.com'),
  ('mailsiphon.com'), ('mailslapping.com'), ('mailtemp.info'),
  ('mintemail.com'), ('mytrashmail.com'), ('nepwk.com'),
  ('nincsmail.com'), ('nomail.xl.cx'), ('nospammail.net'),
  ('nowmymail.com'), ('oneoffemail.com'), ('oneoffmail.com'),
  ('paypermail.com'), ('rcpt.at'), ('recursor.net'),
  ('reliable-mail.com'), ('s33db0x.com'), ('safetymail.info'),
  ('safetypost.de'), ('sendspamhere.com'), ('sneakemail.com'),
  ('snkmail.com'), ('sofort-mail.de'), ('spam4.me'),
  ('spamail.de'), ('spamarrest.com'), ('spambeach.com'),
  ('spamcannon.com'), ('spamcannon.net'), ('spamcero.com'),
  ('spamcon.org'), ('spamday.com'), ('spamdecoy.net'),
  ('spamex.com'), ('spamfree24.com'), ('spamfree24.de'),
  ('spamfree24.eu'), ('spamfree24.info'), ('spamfree24.net'),
  ('spamfree24.org'), ('spamgoes.in'), ('spamgourmet.com'),
  ('spamgourmet.net'), ('spamgourmet.org'), ('spamhole.com'),
  ('spamify.com'), ('spaminator.de'), ('spamkill.info'),
  ('spaml.com'), ('spamnot.com'), ('spamobox.com'),
  ('spamoff.de'), ('spamslicer.com'), ('spamstack.net'),
  ('spamthis.co.uk'), ('spamtrail.com'), ('spamtrap.ro'),
  ('spamwc.de'), ('spamwc.info'), ('speed.1s.fr'),
  ('superstachel.de'), ('suremail.info'), ('tempail.com'),
  ('tempemail.biz'), ('tempemail.co.za'), ('tempemail.com'),
  ('tempemail.info'), ('tempemail.net'), ('tempemail.org'),
  ('tempinbox.co.uk'), ('tempinbox.com'), ('tempmail.co'),
  ('tempmail.de'), ('tempmail.eu'), ('tempmail.it'),
  ('tempmail.net'), ('tempmail.one'), ('tempmail.org'),
  ('tempmail.us'), ('tempmail.win'), ('tempmail.ws'),
  ('temp-mail.org'), ('temp-mail.ru'), ('temp-mails.com'),
  ('tempsky.com'), ('tempthe.net'), ('tempymail.com'),
  ('thanksnospam.info'), ('thankyou2010.com'), ('thc.st'),
  ('thecloudindex.com'), ('thembones.com.au'), ('thisisnotmyrealemail.com'),
  ('throwaway.email'), ('throwaway.mailinator.com'), ('tipent.com'),
  ('toomail.biz'), ('trash2009.com'), ('trash-2009.com'),
  ('trash-mail.com'), ('trash-me.com'), ('trashcanmail.com'),
  ('trashdevil.de'), ('trashdevil.com'), ('trashemail.de'),
  ('trashmail.com'), ('trashmail.net'), ('trashmail.org'),
  ('trashmailer.com'), ('trashmailer.net'), ('trashymail.com'),
  ('trashymail.net'), ('trayna.com'), ('trbvm.com'),
  ('trbvn.com'), ('trbvo.com'), ('tropicalbrown.com'),
  ('trunc.org'), ('turoid.com'), ('turual.com'),
  ('twit-mail.com'), ('twkly.ml'), ('twood.net'),
  ('tyldd.com'), ('uggsrock.com'), ('umail.net'),
  ('upliftnow.com'), ('uplipht.com'), ('ureach.com'),
  ('urfey.com'), ('ustymail.com'), ('utilities-online.info'),
  ('vankmail.com'), ('vcmail.com'), ('veryrealemail.com'),
  ('viditmail.com'), ('visto.com'), ('vixlet.com'),
  ('vjtimail.com'), ('vjpmo.com'), ('vjuum.com'),
  ('vnnb.com'), ('vomoto.com'), ('vp.ycare.de'),
  ('vremonte.com'), ('walala.org'), ('wantworthy.com'),
  ('warau-kadachi.com'), ('wardy.ml'), ('warnednl2.com'),
  ('watcheveryone.com'), ('watchfull.net'), ('waybuy.info'),
  ('we.qq.my'), ('webtrip.ch'), ('webuser.in'),
  ('wegwerfmail.de'), ('wegwerfmail.net'), ('wegwerfmail.org'),
  ('weg-werf-mail.de'), ('wegwerfmail.info'), ('wellhungup.com'),
  ('weprof.it'), ('werfmail.de'), ('whatiaas.com'),
  ('whatifgaudana.com'), ('whatpaas.com'), ('whatsaas.com'),
  ('wh4f.org'), ('whyspam.me'), ('wicked.cricket'),
  ('willhackforfood.biz'), ('willselfdestruct.com'), ('wimsg.com'),
  ('winemaven.info'), ('wins.com.br'), ('wlisto.com'),
  ('wlsz.net'), ('wmav.tk'), ('wmdm.tk'), ('wmrm.tk'),
  ('wokcy.com'), ('wolfsmail.tk'), ('wollan.info'),
  ('worldbreak.com'), ('worldspace.link'), ('wowmail.com'),
  ('wqie.tk'), ('wralawfirm.com'), ('writeme.com'),
  ('writeme.us'), ('wronghead.com'), ('wuon.tk'),
  ('wwjmp.com'), ('wwwnew.eu'), ('x5a5m.com'),
  ('xagloo.com'), ('xagloo.co'), ('xbaby69.top'),
  ('xcode.ro'), ('xcodes.net'), ('xdemo.tk'),
  ('xemaps.com'), ('xents.com'), ('xing886.uu.gl'),
  ('xmail.com'), ('xmaily.com'), ('xn--9kq967o.com'),
  ('xoxox.cc'), ('xoxy.net'), ('xperiae5.com'),
  ('xrho.com'), ('xwaretech.com'), ('xwaretech.info'),
  ('xwaretech.net'), ('xwaretech.tk'), ('xww.ro'),
  ('xyzfree.net'), ('xzqyw.tk'), ('yandex.com'),
  ('yapped.net'), ('ycare.de'), ('ycn.ro'),
  ('ye.vc'), ('yep.it'), ('yert.ye.vc'),
  ('yhg.biz'), ('ynmrealty.com'), ('yogamaven.com'),
  ('yomail.info'), ('yopmail.com'), ('yopmail.fr'),
  ('yopmail.net'), ('yopmail.org'), ('yopmail.pp.ua'),
  ('yordanmail.com'), ('ypmail.webarnak.com'), ('yroid.com'),
  ('yuurok.com'), ('yxzx.net'), ('z1p.biz'),
  ('z5cp.tk'), ('z7az.tk'), ('z7o.tk'),
  ('z8z.tk'), ('zahuy.site'), ('zamana.cf'),
  ('zane.rocks'), ('zeptop.net'), ('zetmail.com'),
  ('zhcne.com'), ('zhorachu.com'), ('zik style.com'),
  ('zipcad.com'), ('zippymail.info'), ('zipsendtest.com'),
  ('zoaxe.com'), ('zoemail.com'), ('zoemail.org'),
  ('zoemail.net'), ('zomg.info'), ('zumpat.com'),
  ('zxcv.com'), ('zxcvbnm.com'), ('zybermail.com'),
  ('zy9.tk'), ('zyk.tk'), ('zymuying.com'),
  ('zzi.us'), ('zzz.com'), ('zzz.pl'),
  ('fexbox.org'), ('fexbox.com'), ('fexbox.net'),
  ('fexbox.ru'), ('fexpost.com'), ('fexpost.net'),
  ('fexpost.org'), ('fexpost.ru')
on conflict (domain) do nothing;

-- Function: block disposable emails on signup
create or replace function public.block_disposable_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  email_domain text;
begin
  email_domain := split_part(new.email, '@', 2);

  if exists (select 1 from public.blocked_email_domains where domain = lower(email_domain)) then
    raise exception 'Disposable email domains are not allowed. Use a permanent email address.';
  end if;

  return new;
end;
$$;

-- Trigger: runs BEFORE insert on auth.users
drop trigger if exists on_auth_user_block_disposable on auth.users;
create trigger on_auth_user_block_disposable
  before insert on auth.users
  for each row
  execute function public.block_disposable_email();

-- ═══════════════════════════════════════════════
-- 3. SECURITY: AUTO-CREATE PROFILE + SETTINGS ON SIGNUP
-- ═══════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Create profile
  insert into public.profiles (id, email, name)
  values (new.id, new.email, split_part(new.email, '@', 1));

  -- Create default settings
  insert into public.user_settings (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ═══════════════════════════════════════════════
-- 4. SECURITY: RATE LIMITING (via Supabase built-in)
-- ═══════════════════════════════════════════════
-- Go to: Authentication → Settings → Rate Limits
-- Set these values manually in the dashboard:
--   - Sign-up: 1 request per 60 seconds per IP
--   - Sign-in: 5 requests per 60 seconds per IP
--   - Token refresh: 10 requests per 60 seconds per IP
-- ═══════════════════════════════════════════════

-- ═══════════════════════════════════════════════
-- 5. ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════
-- IMPORTANT: For INSERT policies, use WITH CHECK (not USING)
-- USING = filter existing rows (SELECT, UPDATE, DELETE)
-- WITH CHECK = validate new rows (INSERT)
-- ═══════════════════════════════════════════════

-- Profiles
alter table public.profiles enable row level security;
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Conversations
alter table public.conversations enable row level security;
drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own" on public.conversations
  for select using (auth.uid() = user_id);
drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own" on public.conversations
  for insert with check (auth.uid() = user_id);
drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own" on public.conversations
  for update using (auth.uid() = user_id);
drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_delete_own" on public.conversations
  for delete using (auth.uid() = user_id);

-- Messages
alter table public.messages enable row level security;
drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select using (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages
  for insert with check (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own" on public.messages
  for update using (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own" on public.messages
  for delete using (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );

-- Conversation Metadata
alter table public.conversation_metadata enable row level security;
drop policy if exists "meta_select_own" on public.conversation_metadata;
create policy "meta_select_own" on public.conversation_metadata
  for select using (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );
drop policy if exists "meta_insert_own" on public.conversation_metadata;
create policy "meta_insert_own" on public.conversation_metadata
  for insert with check (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );
drop policy if exists "meta_update_own" on public.conversation_metadata;
create policy "meta_update_own" on public.conversation_metadata
  for update using (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );
drop policy if exists "meta_delete_own" on public.conversation_metadata;
create policy "meta_delete_own" on public.conversation_metadata
  for delete using (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );

-- User Settings
alter table public.user_settings enable row level security;
drop policy if exists "settings_select_own" on public.user_settings;
create policy "settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);
drop policy if exists "settings_insert_own" on public.user_settings;
create policy "settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);
drop policy if exists "settings_update_own" on public.user_settings;
create policy "settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);
drop policy if exists "settings_delete_own" on public.user_settings;
create policy "settings_delete_own" on public.user_settings
  for delete using (auth.uid() = user_id);

-- Usage
alter table public.usage enable row level security;
drop policy if exists "usage_select_own" on public.usage;
create policy "usage_select_own" on public.usage
  for select using (auth.uid() = user_id);
drop policy if exists "usage_insert_all" on public.usage;
create policy "usage_insert_all" on public.usage
  for insert with check (true);

-- Feedback
alter table public.feedback enable row level security;
drop policy if exists "feedback_insert_own" on public.feedback;
create policy "feedback_insert_own" on public.feedback
  for insert with check (auth.uid() = user_id);
drop policy if exists "feedback_select_own" on public.feedback;
create policy "feedback_select_own" on public.feedback
  for select using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════
-- 6. REALTIME
-- ═══════════════════════════════════════════════

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'conversations') then
    alter publication supabase_realtime add table public.conversations;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'messages') then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;

-- ═══════════════════════════════════════════════
-- 7. UPDATED_AT AUTO-UPDATE (triggers)
-- ═══════════════════════════════════════════════

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

create trigger set_conversations_updated_at
  before update on public.conversations
  for each row execute function public.update_updated_at_column();

create trigger set_conversation_metadata_updated_at
  before update on public.conversation_metadata
  for each row execute function public.update_updated_at_column();

create trigger set_user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.update_updated_at_column();

-- ═══════════════════════════════════════════════
-- DONE
-- ═══════════════════════════════════════════════
