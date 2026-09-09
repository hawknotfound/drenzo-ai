import React, { useState } from 'react';
import { Presentation, ArrowLeft, ChevronLeft, ChevronRight, Download, Plus, Sparkles, Check, Play } from 'lucide-react';

interface PresentationStudioProps {
  onBack: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
  initialTopic?: string;
}

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  points: string[];
  takeaway: string;
}

export const PresentationStudio: React.FC<PresentationStudioProps> = ({
  onBack,
  onShowToast,
  initialTopic = ''
}) => {
  const [topic, setTopic] = useState(
    initialTopic || 'The Autonomous AI Frontier: Multi-Agent Systems & Continuous Self-Optimization'
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [theme, setTheme] = useState<'amethyst' | 'obsidian' | 'cyan'>('amethyst');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [slides, setSlides] = useState<Slide[]>([
    {
      id: 1,
      title: 'The Next Computing Paradigm',
      subtitle: 'From Static LLMs to Adaptive Multi-Agent Workflows',
      points: [
        'Single-turn prompts evolve into persistent, goal-oriented agent swarms.',
        'Continuous self-reflection loops verify factual accuracy and code safety.',
        'Autonomous orchestration reduces manual development cycles by up to 70%.'
      ],
      takeaway: 'Key Takeaway: The frontier of AI lies in autonomous synthesis, not reactive text generation.'
    },
    {
      id: 2,
      title: 'Context Windows & Shared State',
      subtitle: 'Scaling Intelligence Across Enterprise Boundaries',
      points: [
        'Million-token context buffers allow entire repos and histories in working memory.',
        'Shared memory buses synchronize decision-making across disparate agents.',
        'Real-time streaming eliminates latency barriers in collaborative environments.'
      ],
      takeaway: 'Key Takeaway: Shared working memory replaces fragile microservice handoffs.'
    },
    {
      id: 3,
      title: 'Strategic Implementation & Roadmap',
      subtitle: 'Four Pillars of Enterprise AI Sovereignty',
      points: [
        'Phase 1: Local domain grounding with deterministic guardrails.',
        'Phase 2: Fine-grained tool augmentation (Browsing, Code Exec, SQL).',
        'Phase 3: Autonomous workflow orchestration with human-in-the-loop review.',
        'Phase 4: Self-improving telemetry pipelines and localized distillation.'
      ],
      takeaway: 'Key Takeaway: Enterprise sovereignty requires grounded, auditable agent infrastructure.'
    }
  ]);

  const currentSlide = slides[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: slides.length + 1,
      title: `Slide ${slides.length + 1}: Expansion Analysis`,
      subtitle: 'Synthesizing emerging opportunities and operational metrics',
      points: [
        'Real-time validation against business KPIs and latency budgets.',
        'Automated regression suites running before model outputs reach users.',
        'Extensible plugin architecture for seamless third-party service integration.'
      ],
      takeaway: 'Key Takeaway: Rigorous evaluation benchmarks distinguish real utility from demo novelties.'
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    onShowToast('Slide Added', `Created Slide ${slides.length + 1}`, 'success');
  };

  const handleExport = () => {
    onShowToast('Exporting Deck', 'Slides exported as presentation bundle (.pdf / .pptx)', 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      {/* Top navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Zyricon Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Presentation className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Presentation Studio</span>
        </span>
      </div>

      {/* Main Slide Stage */}
      <div className="rounded-3xl bg-[#120D1E] border border-[#2B2044] p-5 shadow-2xl space-y-4">
        {/* Slide Deck Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#211836]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">Theme:</span>
            {(['amethyst', 'obsidian', 'cyan'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all ${
                  theme === t
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[#1D162E] text-[#8C83A2] hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddSlide}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#1D1530] hover:bg-[#281D42] border border-[#31254D] text-xs font-medium text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-purple-300" />
              <span>Add Slide</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white shadow-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Deck</span>
            </button>
          </div>
        </div>

        {/* Slide Canvas Viewport */}
        <div
          className={`
            w-full aspect-[16/9] max-h-[380px] rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all shadow-inner
            ${
              theme === 'amethyst'
                ? 'bg-gradient-to-br from-[#1C1230] via-[#140C22] to-[#0A0612] border border-[#3A2859]'
                : theme === 'obsidian'
                ? 'bg-gradient-to-br from-[#141416] via-[#0E0E10] to-[#060608] border border-[#282830]'
                : 'bg-gradient-to-br from-[#0F1E28] via-[#0A131C] to-[#04080D] border border-[#1E3B4F]'
            }
          `}
        >
          {/* Ambient luminous orb on slide corner */}
          <div
            className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 ${
              theme === 'amethyst' ? 'bg-purple-600' : theme === 'obsidian' ? 'bg-zinc-500' : 'bg-cyan-500'
            }`}
          />

          {/* Slide Header */}
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-purple-400/90 mb-1">
              SLIDE {currentSlideIndex + 1} OF {slides.length}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentSlide.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#9F95B8] mt-1 font-medium">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Slide Bullets */}
          <div className="space-y-2.5 my-3">
            {currentSlide.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#DAD3EA] leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <span>{pt}</span>
              </div>
            ))}
          </div>

          {/* Slide Footer Callout */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#A69CBE]">
            <span className="font-semibold text-purple-300">{currentSlide.takeaway}</span>
            <span className="opacity-60">Zyricon AI Slides</span>
          </div>
        </div>

        {/* Slide Carousel Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl bg-[#1C152E] hover:bg-[#281E42] disabled:opacity-40 text-white transition-colors"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#8E85A3] font-medium">
              Slide {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 rounded-xl bg-[#1C152E] hover:bg-[#281E42] disabled:opacity-40 text-white transition-colors"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Slide thumbnails dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlideIndex === idx ? 'w-6 bg-purple-400' : 'w-2 bg-[#2E2347] hover:bg-[#433466]'
                }`}
                title={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
