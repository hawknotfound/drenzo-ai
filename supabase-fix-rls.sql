-- ═══════════════════════════════════════════════
-- DRENZO AI — RLS Fix
-- Run this in Supabase SQL Editor to fix 403 errors
-- ═══════════════════════════════════════════════

-- Drop broken policies (for all using → doesn't work for INSERT)
drop policy if exists "Users can CRUD own conversations" on public.conversations;
drop policy if exists "Users can CRUD messages in own conversations" on public.messages;
drop policy if exists "Users can CRUD metadata for own conversations" on public.conversation_metadata;
drop policy if exists "Users can CRUD own settings" on public.user_settings;
drop policy if exists "System can insert usage" on public.usage;
drop policy if exists "Users can insert own feedback" on public.feedback;
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "System can insert profiles" on public.profiles;
drop policy if exists "Users can read own usage" on public.usage;
drop policy if exists "Users can read own feedback" on public.feedback;

-- Recreate with correct policies (separate per-operation with WITH CHECK for INSERT)

-- Profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Conversations
create policy "conversations_select_own" on public.conversations
  for select using (auth.uid() = user_id);
create policy "conversations_insert_own" on public.conversations
  for insert with check (auth.uid() = user_id);
create policy "conversations_update_own" on public.conversations
  for update using (auth.uid() = user_id);
create policy "conversations_delete_own" on public.conversations
  for delete using (auth.uid() = user_id);

-- Messages
create policy "messages_select_own" on public.messages
  for select using (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
create policy "messages_insert_own" on public.messages
  for insert with check (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
create policy "messages_update_own" on public.messages
  for update using (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );
create policy "messages_delete_own" on public.messages
  for delete using (
    exists (select 1 from public.conversations c
      where c.id = messages.conversation_id and c.user_id = auth.uid())
  );

-- Conversation Metadata
create policy "meta_select_own" on public.conversation_metadata
  for select using (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );
create policy "meta_insert_own" on public.conversation_metadata
  for insert with check (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );
create policy "meta_update_own" on public.conversation_metadata
  for update using (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );
create policy "meta_delete_own" on public.conversation_metadata
  for delete using (
    exists (select 1 from public.conversations c
      where c.id = conversation_metadata.conversation_id and c.user_id = auth.uid())
  );

-- User Settings
create policy "settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);
create policy "settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);
create policy "settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);
create policy "settings_delete_own" on public.user_settings
  for delete using (auth.uid() = user_id);

-- Usage
create policy "usage_select_own" on public.usage
  for select using (auth.uid() = user_id);
create policy "usage_insert_all" on public.usage
  for insert with check (true);

-- Feedback
create policy "feedback_insert_own" on public.feedback
  for insert with check (auth.uid() = user_id);
create policy "feedback_select_own" on public.feedback
  for select using (auth.uid() = user_id);
