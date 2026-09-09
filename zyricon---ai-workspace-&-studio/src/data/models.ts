import { ModelOption, WorkspaceFolder, ArchiveItem, LibraryTemplate } from '../types';

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'chatgpt-v4',
    name: 'ChatGPT v4.0',
    version: '4.0 Turbo',
    provider: 'OpenAI',
    description: 'High intelligence flagship model for creative, reasoning, and multimodal tasks.',
    badge: 'Default',
    contextWindow: '128k',
    speed: 'Balanced'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    version: 'Omni 2024',
    provider: 'OpenAI',
    description: 'Omni-model supporting text, code, audio, and visual intelligence with ultra-low latency.',
    badge: 'Popular',
    contextWindow: '128k',
    speed: 'Ultra-Fast'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    version: '3.5',
    provider: 'Anthropic',
    description: 'Industry-leading benchmark for coding, nuanced technical writing, and workflow execution.',
    badge: 'Smartest',
    contextWindow: '200k',
    speed: 'Fast'
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    version: '2.0',
    provider: 'Google',
    description: 'Next-generation multimodal speed demon with immense throughput and real-time reasoning.',
    badge: 'Fastest',
    contextWindow: '1M',
    speed: 'Ultra-Fast'
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    version: 'R1 Distill',
    provider: 'DeepSeek',
    description: 'Open-weights reasoning engine specializing in rigorous mathematics, logic, and algorithms.',
    badge: 'Reasoning',
    contextWindow: '64k',
    speed: 'Balanced'
  }
];

export const INITIAL_WORKSPACES: WorkspaceFolder[] = [
  { id: 'ws-new', name: 'New Project', iconType: 'code', itemCount: 0 },
  { id: 'ws-img-1', name: 'Image', iconType: 'image', itemCount: 12, description: 'Visual concept renders and branding assets' },
  { id: 'ws-pres', name: 'Presentation', iconType: 'presentation', itemCount: 5, description: 'Investor pitch decks and product roadmaps' },
  { id: 'ws-riset', name: 'Riset', iconType: 'riset', itemCount: 8, description: 'Academic papers, market research, and competitive analysis' },
  { id: 'ws-img-2', name: 'Image', iconType: 'image', itemCount: 18, description: 'UI mockups and 3D product renders' }
];

export const INITIAL_ARCHIVES: ArchiveItem[] = [
  {
    id: 'arch-1',
    title: 'Autonomous Multi-Agent Architecture',
    preview: 'Detailed design specification for coordinating 5 autonomous micro-agents with shared memory bus...',
    date: 'Yesterday at 4:18 PM',
    model: 'ChatGPT v4.0',
    messageCount: 14
  },
  {
    id: 'arch-2',
    title: 'Series A Pitch Deck Strategy',
    preview: 'Structure outline for a 12-slide investor deck focusing on enterprise ARR and defensible moats...',
    date: '3 days ago',
    model: 'Claude 3.5 Sonnet',
    messageCount: 8
  },
  {
    id: 'arch-3',
    title: 'Shader GLSL Orb Generation',
    preview: 'Raymarched volumetric purple glowing sphere with specular iridescent highlights in WebGL...',
    date: 'Last week',
    model: 'GPT-4o',
    messageCount: 22
  },
  {
    id: 'arch-4',
    title: 'Market Research: Southeast Asia FinTech',
    preview: 'Comparative analysis of QRIS adoption, micro-lending regulations, and digital wallet consolidation...',
    date: 'Sep 02, 2026',
    model: 'DeepSeek R1',
    messageCount: 19
  }
];

export const INITIAL_TEMPLATES: LibraryTemplate[] = [
  {
    id: 'tmpl-1',
    title: 'Interactive React Component Generator',
    category: 'Coding',
    description: 'Generates polished, fully typed modern React components with Tailwind CSS and motion animations.',
    prompt: 'Create a production-ready React component with TypeScript, Tailwind CSS, accessibility aria labels, and smooth motion animations for: [Feature Name]',
    tags: ['React', 'TypeScript', 'Tailwind']
  },
  {
    id: 'tmpl-2',
    title: 'Cinematic Visual Art Prompting',
    category: 'Creative',
    description: 'Constructs an ultra-detailed prompt optimized for hyper-realistic Midjourney or Imagen renderers.',
    prompt: 'Generate an artistic high-definition render of [Subject], cinematic volumetric lighting, 8k resolution, octane render aesthetic, subtle ambient violet mist.',
    tags: ['Image', 'Midjourney', 'Aesthetic']
  },
  {
    id: 'tmpl-3',
    title: 'Executive Pitch Deck Narrative',
    category: 'Productivity',
    description: 'Drafts a compelling 10-slide narrative flow with Problem, Solution, Market Size, Product, and Financials.',
    prompt: 'Outline a compelling 10-slide startup pitch deck for [Industry/Idea] including punchy slide titles, key bullets, and visual slide suggestions.',
    tags: ['Pitch', 'Slides', 'Business']
  },
  {
    id: 'tmpl-4',
    title: 'Deep Research Synthesis & Fact-Check',
    category: 'Research',
    description: 'Summarizes complex multidisciplinary topics with structured pros/cons, verified citations, and counterarguments.',
    prompt: 'Conduct an in-depth research summary on [Topic], breaking down current consensus, unresolved debates, methodology limitations, and next steps.',
    tags: ['Research', 'Analysis', 'Synthesis']
  }
];
