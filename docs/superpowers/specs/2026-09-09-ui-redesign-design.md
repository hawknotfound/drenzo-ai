# Drenzo AI — UI Redesign Design Spec

## Overview

Replace the current Drenzo AI UI with the Zyricon AI Workspace visual design while preserving all existing backend functionality, data flow, and features. The result: existing Drenzo AI capabilities + Zyricon's cosmic purple design language.

## Source Reference

- **Reference project:** `zyricon---ai-workspace-&-studio/` (React + Tailwind v4 + Motion)
- **Target project:** Drenzo AI (`src/`, `api/`, `electron/`)

## Design Language

### Color Palette
| Role | Value | Usage |
|---|---|---|
| Outer background | `#B497BD` | Framed mode lavender border |
| App background | `#0B0912` | Main container |
| Sidebar background | `#0C0914` | Left panel |
| Primary purple | `#8B5CF6` / `#7C3AED` | Buttons, active states |
| Purple glow | `rgba(147,51,234,0.4)` | Ambient shadows |
| Surface cards | `#130E20` | Cards, modals |
| Surface border | `#271D3A` / `#2D2246` | Card borders |
| Input background | `#1B142B` | Text inputs |
| Input border | `#2D2244` | Input borders |
| Hover surface | `#191328` | Hover states |
| Secondary button | `#151122` | Ghost/secondary buttons |
| Secondary border | `#251e36` | Secondary button borders |
| Text primary | `#E2DCF0` / white | Headings, primary text |
| Text secondary | `#9b92b0` | Descriptions |
| Text muted | `#6e6680` | Labels, metadata |
| Active accent | `purple-300` / `purple-400` | Active nav items |
| Success | `emerald-400` | Positive states |
| Error | `red-400` | Error states |
| Warning | `amber-400` | Warning states |

### Typography
- **Body:** Plus Jakarta Sans (300-700)
- **Code:** JetBrains Mono (400-600)
- **Scale:** `text-[11px]` labels, `text-xs`/`text-sm` body, `text-base`/`text-lg` headings

### Border & Shadow System
- Borders: 1px `#271D3A`, hover `#4B376F`, active `purple-500/60`
- Glow: `shadow-[0_0_12px_rgba(147,51,234,0.4)]` on interactive elements
- Cards: `shadow-xl`, app container: `shadow-[0_30px_90px_rgba(0,0,0,0.65)]`
- Modals: `shadow-[0_20px_60px_rgba(0,0,0,0.8)]`

### Rounded Corners
- Cards/buttons: `rounded-xl` (12px)
- Modals: `rounded-2xl` (16px)
- App container: `rounded-3xl` (24px)
- Pills: `rounded-full`

## Architecture Decisions

### 1. Keep Existing Routing/State Pattern
Drenzo uses conditional rendering (not React Router). Keep this. Add Zyricon's view modes as additional states in ChatPage.

### 2. Component Replacement Strategy
Replace UI components in `src/components/ui-new/` with redesigned versions matching Zyricon's visual language. Keep hook contracts identical — components consume the same props/hooks.

### 3. Layout: Framed Mode
Adopt Zyricon's "framed" layout: app sits inside a rounded container on a lavender background. Add a toggle for fullscreen mode (no frame).

### 4. Studio Views
Add ImageStudio, PresentationStudio, DevStudio as new view modes. These will be UI-only shells — no backend integration for image generation/presentation building. They connect to the existing chat system (user can ask about images/presentations/code).

### 5. Preserved Functionality
All of these continue working unchanged:
- Supabase auth (email/password, Google OAuth, guest mode)
- Chat streaming via OpenCode Zen API
- Knowledge base RAG (Cloudinary)
- Web search (Tavily/DuckDuckGo)
- Custom instructions CRUD
- Conversation management (create/rename/pin/delete)
- BYOK (user API keys)
- Settings (temperature, max tokens)
- Language modes (English/Hinglish)
- File attachments
- Code block actions (copy/share/Gmail)
- Electron desktop app
- Keyboard shortcuts

## Component Map

### Existing → New Equivalents

| Current Component | New Component | Notes |
|---|---|---|
| `BackgroundOrbs` | `BackgroundOrbs` | Redesign with purple radial gradient + grid |
| `Sidebar` | `Sidebar` | Full rebuild: Zyricon style with features, workspaces sections |
| `TopBar` | `TopBar` | Rebuild: model selector dropdown, config, export buttons |
| `HeroState` | `EmptyState` | Rebuild: GlowingOrb + headline + shortcut chips |
| `ChatTimeline` | `ChatStream` | Rebuild: Zyricon message bubbles with avatars, feedback |
| (new) | `PromptComposer` | New: Rich input with file attach, voice, options |
| (new) | `GlowingOrb` | New: CSS animated cosmic orb |
| `SettingsModal` | `SettingsModal` | Rebuild: Zyricon modal style, keep Drenzo features |
| `SearchModal` | `SearchModal` | Restyle to match Zyricon dropdown pattern |
| (new) | `ConfigurationModal` | New: AI parameter tuning (temperature, tokens, top-p, system prompt) |
| (new) | `ExportModal` | New: Export chat as Markdown/TXT/JSON |
| (new) | `ImageStudio` | New: Image generation UI shell |
| (new) | `PresentationStudio` | New: Slide deck builder shell |
| (new) | `DevStudio` | New: Code editor shell |
| (new) | `ArchivedView` | New: Archived conversations list |
| (new) | `LibraryView` | New: Prompt template library |
| (new) | `WorkspaceView` | New: Workspace file manager |
| (new) | `Toast` | New: Bottom-right toast notifications |
| `LanguageSwitch` | `LanguageSwitch` | Restyle to match Zyricon toggle pattern |

### Hooks — No Changes
All hooks remain identical:
- `useChat` — streaming, message state, limits
- `useConversations` — CRUD, realtime
- `useInstructions` — custom instructions
- `useSettings` — user preferences
- `useKnowledge` — knowledge base
- `useAuthContext` — auth state

### API Layer — No Changes
All endpoints unchanged:
- `/api/chat` — streaming
- `/api/chat/[id]` — conversation CRUD
- `/api/knowledge` — RAG
- `/api/search` — web search
- `/api/messages/[id]` — message history
- `/api/settings` — user settings
- `/api/usage` — usage tracking
- `/api/feedback` — ratings

## Implementation Phases

### Phase 1: Theme Foundation
- Replace `index.css` with Zyricon's color scheme, fonts, scrollbar styles
- Add Plus Jakarta Sans + JetBrains Mono font imports
- Define CSS custom properties for the purple color system
- Update Tailwind config if needed for v4

### Phase 2: Layout Shell
- Build framed mode container (lavender bg + rounded dark container)
- Build collapsible sidebar (240px/72px) with logo, features, workspaces
- Build top bar with model selector, config, export buttons
- Add fullscreen toggle

### Phase 3: Empty State
- Build GlowingOrb component (CSS radial gradients + keyframe animations)
- Build EmptyState with orb, headline, shortcut chips

### Phase 4: Chat Interface
- Build PromptComposer (textarea, file attach, voice, options)
- Rebuild ChatStream with Zyricon message bubbles
- Add avatars (user initials, assistant purple gradient icon)
- Add copy/feedback actions on messages
- Preserve code block rendering, thinking display, streaming cursor

### Phase 5: Modals
- Rebuild SettingsModal with Zyricon style (keep all Drenzo features)
- Add ConfigurationModal (temperature, tokens, top-p, system prompt)
- Add ExportModal (Markdown, TXT, JSON export)
- Restyle SearchModal

### Phase 6: Studio Views
- ImageStudio: prompt textarea, style pills, aspect ratio, gallery grid
- PresentationStudio: theme selector, slide canvas, carousel nav
- DevStudio: language tabs, code display, run sandbox, console

### Phase 7: Supporting Views
- ArchivedView: searchable list with restore/delete
- LibraryView: template library with categories
- WorkspaceView: file manager for workspace assets

### Phase 8: Toast System + Interactions
- Toast notifications (success/error/warning/info) bottom-right
- Button hover lifts, scale animations
- Modal zoom-in animations
- Message entrance animations

### Phase 9: Responsive Design
- Mobile: sidebar as slide-out drawer with backdrop
- Tablet: adaptive chat width
- Desktop: framed mode default
- Touch targets: minimum 44px
- No horizontal overflow at any viewport

### Phase 10: Integration Testing
- Verify all auth flows (email, Google, guest)
- Verify chat streaming works end-to-end
- Verify knowledge base loads
- Verify web search works
- Verify custom instructions CRUD
- Verify conversation management
- Verify BYOK flow
- Verify settings persist
- Verify keyboard shortcuts
- Verify responsive layouts
- Verify Electron app works

## Risk Areas

1. **Font loading** — Plus Jakarta Sans must load before first paint to avoid FOUT
2. **Framer Motion → Motion** — Drenzo uses framer-motion, reference uses motion. Both are compatible (motion is the successor). Keep framer-motion to avoid breakage.
3. **Studio views** — These are UI shells only. No real image generation/presentation features.
4. **Sidebar complexity** — Zyricon sidebar has workspaces sections. Adapt to show Drenzo's conversations instead.
