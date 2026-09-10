import { writeJSON, readJSON } from './drive'
import type { Conversation, Message } from '@/types/database'
import type { UserInstruction } from '@/types/instructions'
import type { AppSettings } from '@/types/settings'

const CONVERSATIONS_FILE = 'drenzo-ai/conversations.json'
const SETTINGS_FILE = 'drenzo-ai/settings.json'
const INSTRUCTIONS_FILE = 'drenzo-ai/instructions.json'
const USAGE_FILE = 'drenzo-ai/usage.json'

function msgFile(convId: string) {
  return `drenzo-ai/msg-${convId}.json`
}

// ─── Conversations ───────────────────────────────────

export async function loadConversations(): Promise<Conversation[]> {
  const data = await readJSON<Conversation[]>(CONVERSATIONS_FILE)
  return data ?? []
}

export async function saveConversations(list: Conversation[]): Promise<void> {
  await writeJSON(CONVERSATIONS_FILE, list)
}

export async function createConversation(title = 'New Chat'): Promise<Conversation> {
  const list = await loadConversations()
  const conv: Conversation = {
    id: crypto.randomUUID(),
    user_id: 'local',
    title,
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  list.unshift(conv)
  await saveConversations(list)
  return conv
}

export async function updateConversation(
  id: string,
  updates: Partial<Conversation>
): Promise<void> {
  const list = await loadConversations()
  const idx = list.findIndex(c => c.id === id)
  if (idx === -1) return
  list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() }
  await saveConversations(list)
}

export async function deleteConversation(id: string): Promise<void> {
  const list = await loadConversations()
  const filtered = list.filter(c => c.id !== id)
  await saveConversations(filtered)
}

// ─── Messages ────────────────────────────────────────

export async function loadMessages(convId: string): Promise<Message[]> {
  const data = await readJSON<Message[]>(msgFile(convId))
  return data ?? []
}

export async function saveMessages(convId: string, messages: Message[]): Promise<void> {
  await writeJSON(msgFile(convId), messages)
}

export async function appendMessage(convId: string, message: Message): Promise<void> {
  const messages = await loadMessages(convId)
  messages.push(message)
  await saveMessages(convId, messages)
}

export async function appendMessages(convId: string, newMessages: Message[]): Promise<void> {
  const messages = await loadMessages(convId)
  messages.push(...newMessages)
  await saveMessages(convId, messages)
}

export async function updateMessage(
  convId: string,
  messageId: string,
  content: string
): Promise<void> {
  const messages = await loadMessages(convId)
  const idx = messages.findIndex(m => m.id === messageId)
  if (idx === -1) return
  messages[idx] = { ...messages[idx], content }
  await saveMessages(convId, messages)
}

export async function deleteMessagesAfter(
  convId: string,
  messageId: string
): Promise<void> {
  const messages = await loadMessages(convId)
  const idx = messages.findIndex(m => m.id === messageId)
  if (idx === -1) return
  const kept = messages.slice(0, idx)
  await saveMessages(convId, kept)
}

// ─── Settings ────────────────────────────────────────

const DEFAULT_SETTINGS: AppSettings & { active_instruction_id?: string | null } = {
  temperature: 0.7,
  max_tokens: 4096,
  active_instruction_id: null,
}

export async function loadSettings(): Promise<AppSettings & { active_instruction_id?: string | null }> {
  const data = await readJSON<AppSettings & { active_instruction_id?: string | null }>(SETTINGS_FILE)
  return data ?? DEFAULT_SETTINGS
}

export async function saveSettings(
  settings: Partial<AppSettings & { active_instruction_id?: string | null }>
): Promise<void> {
  const current = await loadSettings()
  const merged = { ...current, ...settings }
  await writeJSON(SETTINGS_FILE, merged)
}

// ─── Instructions ────────────────────────────────────

export async function loadInstructions(): Promise<UserInstruction[]> {
  const data = await readJSON<UserInstruction[]>(INSTRUCTIONS_FILE)
  return data ?? []
}

export async function saveInstructions(list: UserInstruction[]): Promise<void> {
  await writeJSON(INSTRUCTIONS_FILE, list)
}

export async function createInstruction(
  title: string,
  content: string
): Promise<UserInstruction | null> {
  if (!title.trim() || !content.trim()) return null
  const list = await loadInstructions()
  const instruction: UserInstruction = {
    id: crypto.randomUUID(),
    user_id: 'local',
    title: title.trim(),
    content: content.trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  list.push(instruction)
  await saveInstructions(list)
  return instruction
}

export async function updateInstruction(
  id: string,
  title: string,
  content: string
): Promise<boolean> {
  const list = await loadInstructions()
  const idx = list.findIndex(i => i.id === id)
  if (idx === -1) return false
  list[idx] = {
    ...list[idx],
    title: title.trim(),
    content: content.trim(),
    updated_at: new Date().toISOString(),
  }
  await saveInstructions(list)
  return true
}

export async function deleteInstructionFromDrive(id: string): Promise<boolean> {
  const list = await loadInstructions()
  const filtered = list.filter(i => i.id !== id)
  if (filtered.length === list.length) return false
  await saveInstructions(filtered)
  return true
}

// ─── Usage ───────────────────────────────────────────

interface UsageRecord {
  model: string
  tokens_in: number
  tokens_out: number
  created_at: string
}

export async function appendUsage(record: Omit<UsageRecord, 'created_at'>): Promise<void> {
  const list = (await readJSON<UsageRecord[]>(USAGE_FILE)) ?? []
  list.push({ ...record, created_at: new Date().toISOString() })
  if (list.length > 100) list.splice(0, list.length - 100)
  await writeJSON(USAGE_FILE, list)
}

export async function loadUsage(): Promise<UsageRecord[]> {
  return (await readJSON<UsageRecord[]>(USAGE_FILE)) ?? []
}
