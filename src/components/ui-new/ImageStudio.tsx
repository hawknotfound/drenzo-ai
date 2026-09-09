import { useState } from 'react';
import { ArrowLeft, Sparkles, Wand2, Download, RefreshCw } from 'lucide-react';

interface ImageStudioProps {
  onBack: () => void;
  initialPrompt?: string;
}

const STYLES = ['Cinematic 3D', 'Photorealistic', 'Cyberpunk', 'Anime', 'Minimalist'] as const;
const RATIOS = ['1:1', '16:9', '9:16'] as const;

const SAMPLE_GALLERY = [
  {
    id: '1', title: 'Monolith in Violet Aurora', style: 'Cinematic 3D', ratio: '16:9',
    gradient: 'linear-gradient(135deg, #2e0854 0%, #7e22ce 50%, #ec4899 100%)',
    prompt: 'A mystical glowing amethyst monolith floating above an ethereal violet aurora lake'
  },
  {
    id: '2', title: 'Neon Cyberpunk Spire', style: 'Cyberpunk', ratio: '1:1',
    gradient: 'linear-gradient(135deg, #09090b 0%, #3b0764 40%, #06b6d4 100%)',
    prompt: 'Towering holographic architecture with reflective violet streets in rain'
  },
  {
    id: '3', title: 'Quantum Neural Core', style: 'Photorealistic', ratio: '16:9',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #f43f5e 100%)',
    prompt: 'Microscopic crystalline processor pulsating with optical purple light paths'
  }
];

export function ImageStudio({ onBack, initialPrompt = '' }: ImageStudioProps) {
  const [prompt, setPrompt] = useState(initialPrompt || 'A mystical glowing amethyst monolith floating above an ethereal violet aurora lake, octane 3D render, 8k resolution');
  const [style, setStyle] = useState<typeof STYLES[number]>('Cinematic 3D');
  const [ratio, setRatio] = useState<typeof RATIOS[number]>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState(SAMPLE_GALLERY);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const gradients = [
        'linear-gradient(135deg, #17072B 0%, #6B21A8 45%, #E879F9 100%)',
        'linear-gradient(135deg, #0F172A 0%, #581C87 50%, #38BDF8 100%)',
        'linear-gradient(135deg, #180828 0%, #9333EA 50%, #F472B6 100%)',
      ];
      const newImg = {
        id: String(Date.now()),
        title: prompt.slice(0, 24) + '...',
        style, ratio,
        gradient: gradients[Math.floor(Math.random() * gradients.length)],
        prompt: prompt.trim()
      };
      setGallery([newImg, ...gallery]);
      setIsGenerating(false);
    }, 1800);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Drenzo Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Image Studio</span>
        </span>
      </div>

      <div className="rounded-2xl bg-[#130E20] border border-[#2D2246] p-4 shadow-xl space-y-3">
        <div className="flex items-start gap-3">
          <Wand2 className="w-4 h-4 text-purple-400 mt-1 shrink-0" />
          <div className="flex-1">
            <label className="block text-xs font-semibold text-white mb-1">Creative Image Prompt</label>
            <textarea rows={2} value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to render..."
              className="w-full bg-[#1A1329] rounded-xl border border-[#2F234A] p-2.5 text-xs text-white placeholder-[#716885] focus:border-purple-500 outline-none resize-none leading-relaxed" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1F1730]">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-[#7A718F] mr-1">Style:</span>
            {STYLES.map((s) => (
              <button key={s} onClick={() => setStyle(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${style === s ? 'bg-purple-600 text-white shadow-sm' : 'bg-[#1C142D] text-[#9188A7] hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#7A718F] mr-1">Ratio:</span>
            {RATIOS.map((r) => (
              <button key={r} onClick={() => setRatio(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${ratio === r ? 'bg-[#2E204A] border border-purple-500/60 text-white' : 'bg-[#1C142D] border border-transparent text-[#9188A7] hover:text-white'}`}>
                {r}
              </button>
            ))}
            <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()}
              className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-semibold text-xs shadow-md active:scale-95 transition-all">
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isGenerating ? 'Rendering...' : 'Render'}</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs font-semibold text-white">Gallery</h4>
          <span className="text-[11px] text-[#786F8D]">{gallery.length} renders</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map((img) => (
            <div key={img.id} className="group rounded-2xl bg-[#130E20] border border-[#271D3A] hover:border-[#4B376E] overflow-hidden shadow-lg transition-all duration-200 hover:-translate-y-0.5">
              <div className="w-full relative flex items-center justify-center overflow-hidden" style={{ height: img.ratio === '16:9' ? '180px' : '220px', background: img.gradient }}>
                <div className="w-24 h-24 rounded-full blur-sm opacity-80 animate-pulse" style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#130E20] via-transparent to-transparent opacity-90" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">{img.style} • {img.ratio}</div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-colors" title="Download">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3.5">
                <h5 className="text-xs font-semibold text-white truncate">{img.title}</h5>
                <p className="text-[11px] text-[#867E9C] mt-1 line-clamp-2 leading-relaxed">"{img.prompt}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
