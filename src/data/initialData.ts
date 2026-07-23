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
  },
  {
    id: 'p21',
    label: 'Architect my app',
    icon: 'GitPullRequest',
    category: 'code',
    theme: 'blue',
    anim: 'fadeUp',
    promptText: 'I want to build [app idea]. Walk me through the architecture — folder structure, data flow, state management, API layer, auth strategy, and deployment. Tell me where most people over-engineer this and where they under-invest.'
  },
  {
    id: 'p22',
    label: 'Refactor this code',
    icon: 'Code2',
    category: 'code',
    theme: 'orange',
    anim: 'fadeRight',
    promptText: 'Here is a piece of my code. Refactor it and explain every change — why the original was bad, what pattern you replaced it with, and what future bugs you just prevented. I want to write cleaner code, not just get a fix.'
  },
  {
    id: 'p23',
    label: 'Design my database',
    icon: 'FileSpreadsheet',
    category: 'code',
    theme: 'emerald',
    anim: 'scale',
    promptText: 'I need a database schema for [project]. Give me the tables, relationships, indexes, and queries that will hurt first at scale. Point out where denormalization makes sense and where I am over-normalizing out of theory.'
  },
  {
    id: 'p24',
    label: 'Build my startup',
    icon: 'Target',
    category: 'business',
    theme: 'violet',
    anim: 'fadeUp',
    promptText: 'I have a startup idea: [describe it]. Give me a brutal reality check — the business model, unit economics, market size, who will actually pay, and why most startups in this space fail. Tell me if I should build it or kill it.'
  },
  {
    id: 'p25',
    label: 'Write my copy',
    icon: 'PenTool',
    category: 'writing',
    theme: 'rose',
    anim: 'fadeLeft',
    promptText: 'I need copy for [product/landing page/email]. Write it sharp — no adjectives, no fluff, no "revolutionary." Hook in the first line, prove value fast, and tell them exactly what to do next. Give me 3 versions with different angles.'
  },
  {
    id: 'p26',
    label: 'Price my product',
    icon: 'Scale',
    category: 'business',
    theme: 'amber',
    anim: 'scale',
    promptText: 'I am launching [product]. Help me figure out pricing — what models work for this type of product, what psychological price anchors to use, what tier structure makes sense, and where I am leaving money on the table or pricing myself out.'
  },
  {
    id: 'p27',
    label: 'Build my resume',
    icon: 'UserCheck',
    category: 'career',
    theme: 'blue',
    anim: 'fadeRight',
    recommended: true,
    promptText: 'Here is my work history. Rewrite my resume so it actually gets past ATS filters and grabs attention in 6 seconds. Tell me what achievements I am underselling, what buzzwords to kill, and what gap I need to explain. No generic "results-oriented professional" nonsense.'
  },
  {
    id: 'p28',
    label: 'Ace the interview',
    icon: 'Brain',
    category: 'career',
    theme: 'violet',
    anim: 'fadeUp',
    promptText: 'I have an interview for [role/company]. Tell me what they actually want to hear vs what most candidates say. Give me the questions I am not expecting, the stories I should prepare, and the mistakes that will instantly disqualify me. Mock drill me if I send my answers.'
  },
  {
    id: 'p29',
    label: 'Negotiate better',
    icon: 'Users',
    category: 'career',
    theme: 'cyan',
    anim: 'fadeLeft',
    promptText: 'I need to negotiate [salary/deal/contract]. Walk me through the psychology — what leverage I actually have, what they expect me to say, and the exact script to use when they push back. Tell me where most people fold and why.'
  },
  {
    id: 'p30',
    label: 'Build a habit',
    icon: 'Clock',
    category: 'learning',
    theme: 'emerald',
    anim: 'scale',
    promptText: 'I want to build [habit]. Tell me the exact system — trigger, routine, reward, and what to do when I fail. Be specific about the common failure points and why willpower is not the answer. Design it so I cannot cheat.'
  },
  {
    id: 'p31',
    label: 'Understand my bias',
    icon: 'Eye',
    category: 'learning',
    theme: 'purple',
    anim: 'fadeRight',
    promptText: 'Tell me which cognitive biases are most likely affecting my decision in [situation]. Walk through each one — what it is, how it is distorting my thinking, and the exact technique to counter it. Be clinical — this is about pattern recognition, not feelings.'
  },
  {
    id: 'p32',
    label: 'Resolve conflict',
    icon: 'MessageSquare',
    category: 'learning',
    theme: 'rose',
    anim: 'fadeUp',
    promptText: 'I have a conflict with [person]. Describe their psychology, what they actually want vs what they are saying, and the strategy to resolve this without losing or escalating. Give me the lines to say and the traps to avoid. No "just communicate better" trash.'
  },
  {
    id: 'p33',
    label: 'Build my workflow',
    icon: 'Layout',
    category: 'productivity',
    theme: 'blue',
    anim: 'fadeLeft',
    promptText: 'I do [type of work]. Design my optimal workflow — tools, automation, daily rhythm, what to batch, what to cut. Look for the bottlenecks I have normalized and tell me why my current system is slower than I think.'
  },
  {
    id: 'p34',
    label: 'Organize my life',
    icon: 'Sparkles',
    category: 'productivity',
    theme: 'amber',
    anim: 'scale',
    promptText: 'My life is chaotic in [these areas]. Build me a system — not a schedule, not a planner app, but rules and rhythms that keep me from slipping. Cover priorities, energy management, decision fatigue, and recovery. Make it stupid-proof.'
  },
  {
    id: 'p35',
    label: 'Explain like I am smart',
    icon: 'Atom',
    category: 'learning',
    theme: 'cyan',
    anim: 'fadeRight',
    promptText: 'Explain [complex topic] to me. Skip the ELI5 — give me the actual mechanics, the key principles, the counterintuitive parts, and why most explanations of this topic are wrong or misleading. I want real understanding, not simplified metaphors.'
  },
  {
    id: 'p36',
    label: 'Write SQL for me',
    icon: 'FileSpreadsheet',
    category: 'code',
    theme: 'emerald',
    anim: 'fadeUp',
    promptText: 'I need a SQL query that does [describe requirement]. Write it, explain the joins, and tell me what will break when the data grows 100x. Include indexing strategy and the EXPLAIN plan. If there is a faster way without SQL, tell me.'
  },
  {
    id: 'p37',
    label: 'Test my strategy',
    icon: 'Target',
    category: 'business',
    theme: 'orange',
    anim: 'fadeLeft',
    promptText: 'Here is my strategy for [goal]. Tear it apart. What assumptions am I making? Where is the biggest risk? What would a competitor do to destroy this plan? What am I overconfident about? Give me the failure scenarios before I find them the hard way.'
  },
  {
    id: 'p38',
    label: 'Optimize for scale',
    icon: 'Terminal',
    category: 'code',
    theme: 'violet',
    anim: 'scale',
    promptText: 'Here is my current [infrastructure/codebase]. Tell me the top 3 bottlenecks that will kill me at 10x scale. Give me specific solutions — not "use caching" but exactly what to cache, where, and what invalidation strategy. Prioritize by impact vs effort.'
  },
  {
    id: 'p39',
    label: 'Fix my finances',
    icon: 'Scale',
    category: 'finance',
    theme: 'emerald',
    anim: 'fadeRight',
    promptText: 'Here is my financial situation — income, expenses, debts, savings. Tell me the hard truths I am avoiding, where I am bleeding money without noticing, and the 3 things I can do in the next 30 days that would change my trajectory. No "cut your coffee" advice.'
  },
  {
    id: 'p40',
    label: 'Plan my product launch',
    icon: 'Globe',
    category: 'business',
    theme: 'blue',
    anim: 'fadeUp',
    promptText: 'I am launching [product] on [date]. Give me the launch plan — pre-launch sequence, launch day tactics, post-launch follow-up, and what metric actually matters vs what is vanity. Tell me what most people get wrong about launches in my space.'
  },
  {
    id: 'p41',
    label: 'Create a character',
    icon: 'PenTool',
    category: 'creative',
    theme: 'purple',
    anim: 'fadeLeft',
    promptText: 'I need a character for [story/game]. Build them from scratch — motivation, flaw, secret, arc, voice, and the scene that reveals who they really are. Make them feel real, not assembled from a character sheet. Bonus: give me their worst possible decision.'
  },
  {
    id: 'p42',
    label: 'Build my world',
    icon: 'Layout',
    category: 'creative',
    theme: 'cyan',
    anim: 'scale',
    promptText: 'I am building a fictional world for [story/setting]. Help me design the systems — politics, economy, magic/technology, history, conflict. What makes this world unique and what cliché am I falling into? Tell me where the interesting stories actually live.'
  },
  {
    id: 'p43',
    label: 'Plan my learning',
    icon: 'Lightbulb',
    category: 'learning',
    theme: 'blue',
    anim: 'fadeRight',
    recommended: true,
    promptText: 'I want to master [topic]. Design a 90-day learning plan — what to learn each week, what to build/practice, what resources to use, and what most learners waste time on. Be honest about the prerequisites and the grind. No "anyone can learn anything" fluff.'
  },
  {
    id: 'p44',
    label: 'Analyze my data',
    icon: 'FileSpreadsheet',
    category: 'analysis',
    theme: 'emerald',
    anim: 'fadeUp',
    promptText: 'Here is my dataset [paste CSV or describe]. Tell me what patterns I should look for, what anomalies might be hiding signal, and what visualizations would expose the truth. Point out where my data is misleading me or where I have collection bias.'
  },
  {
    id: 'p45',
    label: 'Review my PRD',
    icon: 'Terminal',
    category: 'business',
    theme: 'violet',
    anim: 'fadeLeft',
    promptText: 'Here is my product requirements doc. Review it like a senior PM who has seen this fail before. What am I not defining clearly enough? Where am I solving symptoms not root causes? What edge cases will make engineering hate me? Mark it up.'
  }];
