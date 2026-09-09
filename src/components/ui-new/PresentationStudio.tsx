import { useState } from 'react';
import { Presentation, ArrowLeft, ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';

interface PresentationStudioProps {
  onBack: () => void;
  initialTopic?: string;
}

interface Slide {
  id: number; title: string; subtitle: string; points: string[]; takeaway: string;
}

const INITIAL_SLIDES: Slide[] = [
  {
    id: 1, title: 'The Next Computing Paradigm', subtitle: 'From Static LLMs to Adaptive Multi-Agent Workflows',
    points: ['Single-turn prompts evolve into persistent, goal-oriented agent swarms.', 'Continuous self-reflection loops verify factual accuracy and code safety.', 'Autonomous orchestration reduces manual development cycles by up to 70%.'],
    takeaway: 'Key Takeaway: The frontier lies in autonomous synthesis, not reactive text generation.'
  },
  {
    id: 2, title: 'Context Windows & Shared State', subtitle: 'Scaling Intelligence Across Enterprise Boundaries',
    points: ['Million-token context buffers allow entire repos in working memory.', 'Shared memory buses synchronize decision-making across agents.', 'Real-time streaming eliminates latency barriers.'],
    takeaway: 'Key Takeaway: Shared working memory replaces fragile microservice handoffs.'
  },
  {
    id: 3, title: 'Strategic Implementation & Roadmap', subtitle: 'Four Pillars of Enterprise AI Sovereignty',
    points: ['Phase 1: Local domain grounding with guardrails.', 'Phase 2: Fine-grained tool augmentation.', 'Phase 3: Autonomous orchestration with human-in-the-loop.', 'Phase 4: Self-improving telemetry pipelines.'],
    takeaway: 'Key Takeaway: Sovereignty requires grounded, auditable agent infrastructure.'
  }
];

export function PresentationStudio({ onBack }: PresentationStudioProps) {
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [current, setCurrent] = useState(0);
  const [theme, setTheme] = useState<'amethyst' | 'obsidian' | 'cyan'>('amethyst');

  const slide = slides[current];

  const addSlide = () => {
    const newSlide: Slide = {
      id: slides.length + 1, title: `Slide ${slides.length + 1}: New Analysis`, subtitle: 'Synthesizing emerging opportunities',
      points: ['Real-time validation against KPIs.', 'Automated regression suites.', 'Extensible plugin architecture.'],
      takeaway: 'Key Takeaway: Rigorous evaluation distinguishes real utility from demo novelties.'
    };
    setSlides([...slides, newSlide]);
    setCurrent(slides.length);
  };

  const themeBg = theme === 'amethyst' ? 'from-[#1C1230] via-[#140C22] to-[#0A0612] border-[#3A2859]'
    : theme === 'obsidian' ? 'from-[#141416] via-[#0E0E10] to-[#060608] border-[#282830]'
    : 'from-[#0F1E28] via-[#0A131C] to-[#04080D] border-[#1E3B4F]';
  const orbColor = theme === 'amethyst' ? 'bg-purple-600' : theme === 'obsidian' ? 'bg-zinc-500' : 'bg-cyan-500';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Drenzo Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Presentation className="w-3.5 h-3.5 text-purple-400" /><span>Presentation Studio</span>
        </span>
      </div>

      <div className="rounded-3xl bg-[#120D1E] border border-[#2B2044] p-5 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#211836]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">Theme:</span>
            {(['amethyst', 'obsidian', 'cyan'] as const).map((t) => (
              <button key={t} onClick={() => setTheme(t)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all ${theme === t ? 'bg-purple-600 text-white shadow-sm' : 'bg-[#1D162E] text-[#8C83A2] hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={addSlide} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1D1530] hover:bg-[#281D42] border border-[#31254D] text-xs font-medium text-white transition-colors">
              <Plus className="w-3.5 h-3.5 text-purple-300" /><span>Add Slide</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white shadow-md transition-all">
              <Download className="w-3.5 h-3.5" /><span>Export</span>
            </button>
          </div>
        </div>

        <div className={`w-full aspect-[16/9] max-h-[380px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all shadow-inner bg-gradient-to-br ${themeBg} border`}>
          <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${orbColor}`} />
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-purple-400/90 mb-1">SLIDE {current + 1} OF {slides.length}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">{slide.title}</h2>
            <p className="text-xs sm:text-sm text-[#9F95B8] mt-1 font-medium">{slide.subtitle}</p>
          </div>
          <div className="space-y-2.5 my-3">
            {slide.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#DAD3EA] leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" /><span>{pt}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A69CBE]">
            <span className="font-semibold text-purple-300">{slide.takeaway}</span>
            <span className="opacity-60">Drenzo AI Slides</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
              className="p-2 rounded-xl bg-[#1C152E] hover:bg-[#281E42] disabled:opacity-40 text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs text-[#8E85A3] font-medium">Slide {current + 1} / {slides.length}</span>
            <button onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))} disabled={current === slides.length - 1}
              className="p-2 rounded-xl bg-[#1C152E] hover:bg-[#281E42] disabled:opacity-40 text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button key={idx} onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all ${current === idx ? 'w-6 bg-purple-400' : 'w-2 bg-[#2E2347] hover:bg-[#433466]'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
