import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Presentation, ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Plus, Download, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface PresentationStudioProps {
  onBack: () => void;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  points: string[];
  takeaway: string;
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

function EditableText({ value, onChange, className, placeholder }: {
  value: string; onChange: (v: string) => void; className?: string; placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setDraft(value); }, [value]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
    else setDraft(value);
  };

  if (!editing) {
    return (
      <div
        className={`cursor-text rounded-lg px-2 py-1 -mx-2 -my-1 hover:bg-white/[0.04] transition-colors ${className}`}
        onClick={() => setEditing(true)}
        title="Click to edit"
      >
        {value || <span className="text-white/30">{placeholder}</span>}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={`outline-none rounded-lg px-2 py-1 -mx-2 -my-1 bg-white/[0.06] ring-1 ring-purple-500/40 ${className}`}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit(); }
        if (e.key === 'Escape') { setDraft(value); setEditing(false); }
      }}
      onInput={(e) => setDraft((e.target as HTMLDivElement).textContent || '')}
      autoFocus
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}

export function PresentationStudio({ onBack }: PresentationStudioProps) {
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [current, setCurrent] = useState(0);
  const [theme, setTheme] = useState<'amethyst' | 'obsidian' | 'cyan'>('amethyst');
  const [direction, setDirection] = useState(0);
  const { showToast } = useToast();

  const slide = slides[current];

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= slides.length || idx === current) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current, slides.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).contentEditable === 'true') return;
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current, goTo]);

  const updateSlide = (patch: Partial<Omit<Slide, 'id'>>) => {
    setSlides(prev => prev.map((s, i) => i === current ? { ...s, ...patch } : s));
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(), title: 'New Slide', subtitle: 'Add a subtitle',
      points: ['First point.'], takeaway: 'Key Takeaway: '
    };
    setDirection(1);
    setSlides(prev => [...prev, newSlide]);
    setCurrent(slides.length);
    showToast('Slide added', 'success');
  };

  const deleteSlide = () => {
    if (slides.length <= 1) { showToast('Cannot delete the only slide', 'error'); return; }
    setDirection(-1);
    setSlides(prev => prev.filter((_, i) => i !== current));
    setCurrent(Math.min(current, slides.length - 2));
    showToast('Slide deleted', 'success');
  };

  const addPoint = () => {
    updateSlide({ points: [...slide.points, 'New point.'] });
  };

  const removePoint = (idx: number) => {
    if (slide.points.length <= 1) { showToast('Slide needs at least one point', 'error'); return; }
    updateSlide({ points: slide.points.filter((_, i) => i !== idx) });
  };

  const updatePoint = (idx: number, value: string) => {
    const pts = [...slide.points];
    pts[idx] = value;
    updateSlide({ points: pts });
  };

  const moveSlide = (dir: -1 | 1) => {
    const target = current + dir;
    if (target < 0 || target >= slides.length) return;
    const updated = [...slides];
    [updated[current], updated[target]] = [updated[target], updated[current]];
    setSlides(updated);
    setCurrent(target);
  };

  const exportMarkdown = () => {
    let md = '';
    slides.forEach((s, i) => {
      md += `## Slide ${i + 1}: ${s.title}\n${s.subtitle}\n\n`;
      s.points.forEach(p => { md += `- ${p}\n`; });
      md += `\n> ${s.takeaway}\n\n---\n\n`;
    });
    navigator.clipboard.writeText(md).then(() => {
      showToast('Markdown copied to clipboard', 'success');
    }).catch(() => {
      showToast('Failed to copy', 'error');
    });
  };

  const themeBg = theme === 'amethyst' ? 'from-[#1C1230] via-[#140C22] to-[#0A0612] border-[#3A2859]'
    : theme === 'obsidian' ? 'from-[#141416] via-[#0E0E10] to-[#060608] border-[#282830]'
    : 'from-[#0F1E28] via-[#0A131C] to-[#04080D] border-[#1E3B4F]';
  const orbColor = theme === 'amethyst' ? 'bg-purple-600' : theme === 'obsidian' ? 'bg-zinc-500' : 'bg-cyan-500';

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
  };

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
            <button onClick={exportMarkdown} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white shadow-md transition-all">
              <Download className="w-3.5 h-3.5" /><span>Export MD</span>
            </button>
          </div>
        </div>

        <div className={`w-full aspect-[16/9] max-h-[380px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all shadow-inner bg-gradient-to-br ${themeBg} border`}>
          <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${orbColor}`} />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col justify-between h-full"
            >
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-purple-400/90 mb-1">SLIDE {current + 1} OF {slides.length}</div>
                <EditableText value={slide.title} onChange={(v) => updateSlide({ title: v })}
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
                  placeholder="Slide title" />
                <EditableText value={slide.subtitle} onChange={(v) => updateSlide({ subtitle: v })}
                  className="text-xs sm:text-sm text-[#9F95B8] mt-1 font-medium"
                  placeholder="Subtitle" />
              </div>

              <div className="space-y-2.5 my-3 flex-1">
                {slide.points.map((pt, i) => (
                  <div key={i} className="flex items-start gap-2.5 group/point text-xs sm:text-sm text-[#DAD3EA] leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                    <EditableText value={pt} onChange={(v) => updatePoint(i, v)} className="flex-1" placeholder="Add a point" />
                    <button onClick={() => removePoint(i)}
                      className="p-0.5 rounded opacity-0 group-hover/point:opacity-100 hover:bg-red-500/20 text-red-400/60 hover:text-red-400 transition-all mt-0.5"
                      title="Remove point">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button onClick={addPoint}
                  className="flex items-center gap-2 text-[11px] text-purple-400/60 hover:text-purple-300 transition-colors mt-1 pl-4">
                  <Plus className="w-3 h-3" /> Add bullet
                </button>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A69CBE]">
                <EditableText value={slide.takeaway} onChange={(v) => updateSlide({ takeaway: v })}
                  className="font-semibold text-purple-300 flex-1 mr-4"
                  placeholder="Key takeaway" />
                <span className="opacity-60 shrink-0">Drenzo AI Slides</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => goTo(current - 1)} disabled={current === 0}
              className="p-2 rounded-xl bg-[#1C152E] hover:bg-[#281E42] disabled:opacity-40 text-white transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs text-[#8E85A3] font-medium">{current + 1} / {slides.length}</span>
            <button onClick={() => goTo(current + 1)} disabled={current === slides.length - 1}
              className="p-2 rounded-xl bg-[#1C152E] hover:bg-[#281E42] disabled:opacity-40 text-white transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => goTo(idx)}
                  className={`h-1.5 rounded-full transition-all ${current === idx ? 'w-6 bg-purple-400' : 'w-2 bg-[#2E2347] hover:bg-[#433466]'}`} />
              ))}
            </div>
            <button onClick={deleteSlide}
              className="p-1.5 rounded-lg text-[#6e6680] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Delete slide">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveSlide(-1)} disabled={current === 0}
                className="p-0.5 rounded text-[#6e6680] hover:text-white disabled:opacity-30 transition-colors"
                title="Move slide up">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => moveSlide(1)} disabled={current === slides.length - 1}
                className="p-0.5 rounded text-[#6e6680] hover:text-white disabled:opacity-30 transition-colors"
                title="Move slide down">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
