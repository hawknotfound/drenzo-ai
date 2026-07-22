import type { AIModel, PromptSuggestion } from '@/types/ui';

export const AI_MODELS: AIModel[] = [
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek V4 Flash Free',
    provider: 'DeepSeek',
    badge: 'FREE',
    description: 'High-speed reasoning model optimized for code and quick chat',
    speed: 'Ultra Fast',
    contextWindow: '128k'
  }
];

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    id: 'p1',
    label: 'Roast my life',
    icon: 'Sparkles',
    category: 'learning',
    theme: 'rose',
    anim: 'fadeUp',
    recommended: true,
    promptText: 'I want a full brutal honest roast of my current life situation. Tell me what I am doing wrong, where I am coping instead of fixing, what excuses I am hiding behind, and what I would tell myself if I had zero filter. Be savage but useful — I want to feel it.'
  },
  {
    id: 'p2',
    label: 'Read my chart',
    icon: 'Star',
    category: 'learning',
    theme: 'violet',
    anim: 'fadeRight',
    recommended: true,
    promptText: 'I want to understand astrology deeply. Explain how my Sun, Moon, and rising signs interact. Cover houses, aspects, and what transits I should watch for. Be specific, practical — no generic horoscope nonsense.'
  },
  {
    id: 'p3',
    label: 'Dark psychology',
    icon: 'Brain',
    category: 'learning',
    theme: 'purple',
    anim: 'fadeUp',
    recommended: true,
    promptText: 'Explain dark psychology tactics someone might be using on me. Cover gaslighting, manipulation patterns, love bombing, and how to detect them early. Give me defense strategies — boundaries, red flags, and recovery steps. Do not sugarcoat — I need to see it clearly.'
  },
  {
    id: 'p4',
    label: 'Expose my blindspots',
    icon: 'Eye',
    category: 'learning',
    theme: 'amber',
    anim: 'fadeLeft',
    recommended: true,
    promptText: 'I am going to describe myself — my habits, my patterns, my insecurities, my goals. Then I want you to tell me what I am blind to. Where am I lying to myself? What am I avoiding? What pattern will I repeat next if I do not change? Be brutal. I can handle it.'
  },
  {
    id: 'p5',
    label: 'Fix my mindset',
    icon: 'Lightbulb',
    category: 'learning',
    theme: 'orange',
    anim: 'scale',
    promptText: 'I have been stuck in [describe your situation]. Tell me exactly what mental block is holding me back, why it exists, and what I need to hear to break out of it. No "you can do it" — tell me what I am afraid of and why that fear is pathetic compared to what I could be.'
  },
  {
    id: 'p6',
    label: 'Reality check',
    icon: 'Target',
    category: 'learning',
    theme: 'amber',
    anim: 'fadeRight',
    recommended: true,
    promptText: 'I am going to tell you about a goal or dream I have. I want you to give me a brutal reality check — the hard truth about whether I am actually working towards it or just fantasizing. Tell me exactly what I would need to do, what it would cost me, and whether I have what it takes. If I do not, tell me why.'
  },
  {
    id: 'p7',
    label: 'Truth about someone',
    icon: 'Users',
    category: 'writing',
    theme: 'cyan',
    anim: 'fadeUp',
    promptText: 'I am going to describe a person in my life — how they treat me, their patterns, what they say vs what they do. I want you to tell me the truth about who they really are, what their intentions might be, and whether I am being naive. Do not be polite. I need to see reality.'
  },
  {
    id: 'p8',
    label: 'Judge my decision',
    icon: 'Scale',
    category: 'learning',
    theme: 'blue',
    anim: 'fadeLeft',
    promptText: 'I am deciding between [option A] and [option B]. Tell me which one I should pick and why the other one is probably the wrong choice. Point out where I am being emotional, where I am scared, and what I would tell a friend in the same situation. No fence-sitting.'
  },
  {
    id: 'p9',
    label: 'Analyze personality',
    icon: 'UserCheck',
    category: 'learning',
    theme: 'emerald',
    anim: 'scale',
    promptText: 'I will describe someone — their traits, reactions, fears, and what drives them. Tell me their personality type, core motivations, hidden insecurities, and exactly how to handle them. Be clinical, not nice.'
  },
  {
    id: 'p10',
    label: 'AI explained',
    icon: 'MonitorCode',
    category: 'learning',
    theme: 'cyan',
    anim: 'fadeRight',
    promptText: 'Explain [AI concept] to me like I am smart but not an expert. Cover how it actually works under the hood, what it is good for, where it fails, and whether the hype is real. No hand-wavy explanations, no buzzword salad.'
  },
  {
    id: 'p11',
    label: 'Fix my prompt',
    icon: 'Terminal',
    category: 'code',
    theme: 'blue',
    anim: 'fadeUp',
    promptText: 'Here is a prompt I wrote for an AI. Tell me why it is weak, what it is missing, and how to rewrite it for actual results. Be specific — show me the before and after. No "add more context" generic advice.'
  },
  {
    id: 'p12',
    label: 'Debug my code',
    icon: 'Code2',
    category: 'code',
    theme: 'orange',
    anim: 'fadeLeft',
    promptText: 'Here is my code — tell me what is wrong with it, why it is wrong, and how to fix it. Do not just give me the answer. Tell me what bad habit caused this bug so I stop making it.'
  },
  {
    id: 'p13',
    label: 'System design',
    icon: 'GitPullRequest',
    category: 'code',
    theme: 'emerald',
    anim: 'scale',
    promptText: 'Walk me through the system design for [your project]. Cover architecture, tradeoffs, scaling bottlenecks, and what will break first under load. Be honest about where my design is over-engineered or under-engineered.'
  },
  {
    id: 'p14',
    label: 'Brand me',
    icon: 'Globe',
    category: 'design',
    theme: 'violet',
    anim: 'fadeRight',
    promptText: 'Help me figure out my personal or product brand. Tell me what vibe I am giving off vs what I think I am giving off. Cover positioning, audience, visual direction, and messaging. Be brutally honest about what is not working.'
  },
  {
    id: 'p15',
    label: 'Rate my writing',
    icon: 'PenTool',
    category: 'writing',
    theme: 'rose',
    anim: 'fadeUp',
    promptText: 'Here is something I wrote. Tell me what is weak about it — where it drags, where it is unclear, where I am being redundant or trying too hard. Mark it up like a strict editor who does not care about my feelings.'
  },
  {
    id: 'p16',
    label: 'UI/UX critique',
    icon: 'Palette',
    category: 'design',
    theme: 'purple',
    anim: 'fadeLeft',
    promptText: 'I will describe a UI or share what I am building. Tell me what sucks about it — the UX flows that will confuse people, the visual choices that are ugly, the patterns that clash. Give me specific, actionable fixes, not "looks great!"'
  },
  {
    id: 'p17',
    label: 'Stop wasting time',
    icon: 'Clock',
    category: 'learning',
    theme: 'orange',
    anim: 'scale',
    promptText: 'I will describe my daily routine. Tell me exactly where I am wasting time, what I am avoiding, and what I would get done if I stopped lying to myself about being busy. Give me a stripped-down routine — no productivity porn.'
  },
  {
    id: 'p18',
    label: 'Learn this fast',
    icon: 'Lightbulb',
    category: 'learning',
    theme: 'emerald',
    anim: 'fadeRight',
    promptText: 'I want to learn [topic]. Tell me the fastest real path — not a course, not a roadmap with 50 steps. The shortest path from where I am to actually being able to do something useful with it. Be honest about how long it will really take.'
  },
  {
    id: 'p19',
    label: 'Say this better',
    icon: 'MessageSquare',
    category: 'writing',
    theme: 'blue',
    anim: 'fadeUp',
    promptText: 'I need to communicate something difficult — a confrontation, a boundary, feedback, or an apology. Tell me exactly what to say, what to avoid saying, and the psychology behind why my instinctive approach would backfire.'
  },
  {
    id: 'p20',
    label: 'Research this',
    icon: 'FileSpreadsheet',
    category: 'writing',
    theme: 'violet',
    anim: 'fadeLeft',
    promptText: 'I need deep research on [topic]. Give me the key frameworks, the contradicting viewpoints, the actual evidence (not just popular opinion), and what experts actually disagree on. Cut through the noise — I want signal, not citations.'
  }
];
