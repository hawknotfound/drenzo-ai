import { AIModel, CapabilityOption, PromptSuggestion, Conversation, AttachedFile, PromptTemplate } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash Free',
    provider: 'DeepSeek',
    badge: 'FREE',
    description: 'High-speed reasoning model optimized for code and quick chat',
    speed: 'Ultra Fast',
    contextWindow: '128k'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 Reasoning',
    provider: 'DeepSeek',
    badge: 'REASONING',
    description: 'Specialized in multi-step chain-of-thought logic and mathematics',
    speed: 'Reasoning',
    contextWindow: '64k'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'PRO',
    description: 'Industry leading coding and nuanced prose writer',
    speed: 'Fast',
    contextWindow: '200k'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Multimodal',
    provider: 'OpenAI',
    badge: 'PRO',
    description: 'Flagship multimodal vision and general knowledge AI',
    speed: 'Fast',
    contextWindow: '128k'
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    badge: 'PRO',
    description: 'Massive 2M context window for large codebase synthesis',
    speed: 'Balanced',
    contextWindow: '2M'
  },
  {
    id: 'drenzo-custom-v2',
    name: 'Drenzo Custom Fine-Tune v2',
    provider: 'Drenzo Labs',
    badge: 'EXCLUSIVE',
    description: 'Custom frontend-optimized model with live React canvas renderer',
    speed: 'Ultra Fast',
    contextWindow: '128k'
  }
];

export const CAPABILITY_OPTIONS: CapabilityOption[] = [
  { id: 'web-search', label: 'Web Search', icon: 'Globe', activeColor: 'bg-blue-600/30 text-blue-300 border-blue-500/50' },
  { id: 'analyze-files', label: 'Analyze Files', icon: 'FileText' },
  { id: 'image-understanding', label: 'Image Understanding', icon: 'Image' },
  { id: 'brainstorm', label: 'Brainstorm', icon: 'Lightbulb' },
  { id: 'coding', label: 'Coding', icon: 'MonitorCode' },
  { id: 'writing', label: 'Writing', icon: 'PenTool' },
  { id: 'research', label: 'Research', icon: 'BarChart2' },
  { id: 'deep-thinking', label: 'Deep Thinking', icon: 'Brain', activeColor: 'bg-purple-600/30 text-purple-300 border-purple-500/50' }
];

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    id: 'p1',
    label: 'Build a website',
    icon: 'Layout',
    category: 'code',
    promptText: 'Build a sleek animated dark-mode landing page with Tailwind CSS, Framer Motion, and high-contrast typography.'
  },
  {
    id: 'p2',
    label: 'Debug my code',
    icon: 'Code2',
    category: 'code',
    promptText: 'Here is a React component with an infinite re-render loop. Can you explain the root cause and refactor it cleanly?'
  },
  {
    id: 'p3',
    label: 'Explain AI',
    icon: 'Sparkles',
    category: 'learning',
    promptText: 'Explain how Transformer Neural Networks and Self-Attention mechanisms work in simple, intuitive terms.'
  },
  {
    id: 'p4',
    label: 'Write content',
    icon: 'FileSpreadsheet',
    category: 'writing',
    promptText: 'Write a compelling product launch announcement for an AI developer platform that prioritizes speed and aesthetics.'
  },
  {
    id: 'p5',
    label: 'Summarize PDF',
    icon: 'FileUp',
    category: 'writing',
    promptText: 'Analyze the attached research paper and extract key findings, methodologies, and technical insights in bullet points.'
  },
  {
    id: 'p6',
    label: 'Generate roadmap',
    icon: 'GitPullRequest',
    category: 'learning',
    promptText: 'Create a 12-week comprehensive learning roadmap to master Full-Stack TypeScript development in 2026.'
  },
  {
    id: 'p7',
    label: 'Design UI',
    icon: 'Palette',
    category: 'design',
    promptText: 'Provide a modern visual design system guide including typographic scale, neutral palette, and elevation shadows.'
  },
  {
    id: 'p8',
    label: 'Learn React',
    icon: 'Atom',
    category: 'learning',
    promptText: 'Explain React 19 features like useActionState, Server Actions, and automatic compiler optimization with examples.'
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'React 19 Animation Architecture',
    lastUpdated: '10 mins ago',
    isPinned: true,
    messages: [
      {
        id: 'm1',
        sender: 'user',
        text: 'How can I achieve 60fps smooth spring transitions in React using motion/react?',
        timestamp: '10:14 AM'
      },
      {
        id: 'm2',
        sender: 'ai',
        modelUsed: 'DeepSeek V4 Flash Free',
        thoughtProcess: 'Analyzed Framer Motion / Motion layout animations, GPU layer promotion, layoutId, and spring physics configuration.',
        text: 'To achieve buttery-smooth 60fps animation in React, leverage the unified `motion` library with spring physics and hardware-accelerated transforms:',
        codeSnippets: [
          {
            title: 'AnimatedCard.tsx',
            language: 'tsx',
            code: `import { motion } from 'motion/react';

export function AnimatedCard({ title, isActive }: { title: string; isActive: boolean }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30,
        mass: 0.8
      }}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:border-blue-500/50 transition-colors"
    >
      <h3 className="text-white font-medium">{title}</h3>
    </motion.div>
  );
}`
          }
        ],
        timestamp: '10:14 AM'
      }
    ]
  },
  {
    id: 'conv-2',
    title: 'Design System & Spatial Math',
    lastUpdated: '1 hour ago',
    isPinned: true,
    messages: [
      {
        id: 'm3',
        sender: 'user',
        text: 'What is the exact mathematical rule for nested corner radius in glassmorphic card layouts?',
        timestamp: '09:05 AM'
      },
      {
        id: 'm4',
        sender: 'ai',
        modelUsed: 'DeepSeek V4 Flash Free',
        thoughtProcess: 'Calculated geometric concentric curve offsets for optical alignment.',
        text: 'The fundamental optical nesting formula is:\n\n`Inner Radius = Outer Radius - Padding`\n\nFor example, if your container card has `rounded-[24px]` (24px outer radius) and internal padding of `p-4` (16px padding), the child element inside should have an inner corner radius of `24px - 16px = 8px` (`rounded-lg`). This prevents optical corner distortion!',
        timestamp: '09:06 AM'
      }
    ]
  },
  {
    id: 'conv-3',
    title: 'Fullstack Next.js & Express Setup',
    lastUpdated: 'Yesterday',
    isPinned: false,
    messages: [
      {
        id: 'm5',
        sender: 'user',
        text: 'How to structure Express REST API routes with Vite server middleware?',
        timestamp: 'Yesterday'
      },
      {
        id: 'm6',
        sender: 'ai',
        modelUsed: 'DeepSeek V4 Flash Free',
        text: 'Here is the canonical fullstack Express + Vite TypeScript entrypoint server architecture.',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: 'conv-4',
    title: 'Tailwind CSS v4 Modern Theme Rules',
    lastUpdated: '2 days ago',
    isPinned: false,
    messages: [
      {
        id: 'm7',
        sender: 'user',
        text: 'Explain Tailwind v4 @import syntax and theme variables.',
        timestamp: '2 days ago'
      },
      {
        id: 'm8',
        sender: 'ai',
        modelUsed: 'DeepSeek V4 Flash Free',
        text: 'In Tailwind v4, `@import "tailwindcss";` automatically handles directive processing without require postcss.config.js.',
        timestamp: '2 days ago'
      }
    ]
  }
];

export const SAMPLE_FILES: AttachedFile[] = [
  {
    id: 'f1',
    name: 'architecture_diagram.pdf',
    size: '2.4 MB',
    type: 'pdf',
    uploadedAt: 'Today, 2:15 PM',
    contentSnippet: 'System layout detailing Cloud Run containers, Nginx reverse proxy, and Gemini API endpoints.'
  },
  {
    id: 'f2',
    name: 'schema.sql',
    size: '14 KB',
    type: 'code',
    uploadedAt: 'Yesterday',
    contentSnippet: 'CREATE TABLE users (id UUID PRIMARY KEY, email TEXT, created_at TIMESTAMPTZ);'
  },
  {
    id: 'f3',
    name: 'ui_mockup_v1.png',
    size: '1.8 MB',
    type: 'image',
    uploadedAt: '3 days ago'
  }
];

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 't1',
    title: 'Full-Stack Express + Vite Template',
    category: 'Architecture',
    description: 'Generates custom server.ts setup with Vite development middleware and Express REST proxying.',
    icon: 'Server',
    prompt: 'Create a full-stack Express server in server.ts with Vite dev middleware for React SPA fallback.'
  },
  {
    id: 't2',
    title: 'High-Contrast Dark Theme System',
    category: 'Design Systems',
    description: 'Provides tailored color tokens and WCAG AA compliant slate/zinc palette definitions.',
    icon: 'Palette',
    prompt: 'Design a dark luxury design token palette with subtle glass border highlights and zero saturated noise.'
  },
  {
    id: 't3',
    title: 'Custom React Hook for WebSockets',
    category: 'Realtime',
    description: 'Reusable type-safe WebSocket client hook with auto-reconnection and exponential backoff.',
    icon: 'Zap',
    prompt: 'Write a custom React hook `useWebSocket` supporting auto-reconnect, message queueing, and fallback.'
  }
];
