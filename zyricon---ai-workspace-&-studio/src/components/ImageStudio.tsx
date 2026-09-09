import React, { useState } from 'react';
import { Sparkles, Download, Wand2, RefreshCw, ZoomIn, ArrowLeft, Sliders, Layers } from 'lucide-react';

interface ImageStudioProps {
  onBack: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
  initialPrompt?: string;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ onBack, onShowToast, initialPrompt = '' }) => {
  const [prompt, setPrompt] = useState(
    initialPrompt || 'A mystical glowing amethyst monolith floating above an ethereal violet aurora lake, octane 3D render, 8k resolution'
  );
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('16:9');
  const [style, setStyle] = useState<'Photorealistic' | 'Cinematic 3D' | 'Cyberpunk' | 'Anime' | 'Minimalist'>('Cinematic 3D');
  const [isGenerating, setIsGenerating] = useState(false);

  // Gallery of generated images
  const [images, setImages] = useState([
    {
      id: 'img-1',
      title: 'Monolith in Violet Aurora',
      style: 'Cinematic 3D',
      ratio: '16:9',
      gradient: 'linear-gradient(135deg, #2e0854 0%, #7e22ce 50%, #ec4899 100%)',
      glow: '#a855f7',
      prompt: 'A mystical glowing amethyst monolith floating above an ethereal violet aurora lake, octane 3D render, 8k resolution'
    },
    {
      id: 'img-2',
      title: 'Neon Cyberpunk Spire',
      style: 'Cyberpunk',
      ratio: '1:1',
      gradient: 'linear-gradient(135deg, #09090b 0%, #3b0764 40%, #06b6d4 100%)',
      glow: '#06b6d4',
      prompt: 'Towering holographic architecture with reflective violet streets in rain, volumetric fog'
    },
    {
      id: 'img-3',
      title: 'Quantum Neural Core',
      style: 'Photorealistic',
      ratio: '16:9',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #f43f5e 100%)',
      glow: '#c084fc',
      prompt: 'Microscopic crystalline processor pulsating with optical purple light paths'
    }
  ]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    onShowToast('Rendering Image...', `Synthesizing with ${style} aesthetic`, 'info');

    setTimeout(() => {
      const gradients = [
        'linear-gradient(135deg, #17072B 0%, #6B21A8 45%, #E879F9 100%)',
        'linear-gradient(135deg, #0F172A 0%, #581C87 50%, #38BDF8 100%)',
        'linear-gradient(135deg, #180828 0%, #9333EA 50%, #F472B6 100%)',
        'linear-gradient(135deg, #09090B 0%, #4C1D95 50%, #A855F7 100%)'
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

      const newImg = {
        id: `img-${Date.now()}`,
        title: prompt.slice(0, 24) + '...',
        style,
        ratio: aspectRatio,
        gradient: randomGradient,
        glow: '#a855f7',
        prompt: prompt.trim()
      };

      setImages([newImg, ...images]);
      setIsGenerating(false);
      onShowToast('Image Render Complete', 'Render added to your canvas gallery', 'success');
    }, 1800);
  };

  const handleDownload = (title: string) => {
    onShowToast('Downloading Asset', `${title}.png exported in ultra-res`, 'success');
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
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>Image Studio Mode</span>
        </span>
      </div>

      {/* Prompt creation card */}
      <div className="rounded-2xl bg-[#130E20] border border-[#2D2246] p-4 shadow-xl space-y-3">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex-shrink-0">
            <Wand2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-white mb-1">
              Creative Image Prompt
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to render in vivid detail..."
              className="w-full bg-[#1A1329] rounded-xl border border-[#2F234A] p-2.5 text-xs text-white placeholder-[#716885] focus:border-purple-500 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Style & Aspect Ratio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1F1730]">
          {/* Style pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] text-[#7A718F] mr-1">Style:</span>
            {(['Cinematic 3D', 'Photorealistic', 'Cyberpunk', 'Anime', 'Minimalist'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  style === s
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-[#1C142D] text-[#9188A7] hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Aspect Ratio pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[#7A718F] mr-1">Ratio:</span>
            {(['1:1', '16:9', '9:16'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  aspectRatio === r
                    ? 'bg-[#2E204A] border border-purple-500/60 text-white'
                    : 'bg-[#1C142D] border border-transparent text-[#9188A7] hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="ml-2 flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white font-semibold text-xs shadow-md active:scale-95 transition-all"
            >
              {isGenerating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isGenerating ? 'Rendering...' : 'Render Image'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="text-xs font-semibold text-white">Generated Canvas Gallery</h4>
          <span className="text-[11px] text-[#786F8D]">{images.length} high-definition renders</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="group rounded-2xl bg-[#130E20] border border-[#271D3A] hover:border-[#4B376E] overflow-hidden shadow-lg transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
            >
              {/* Image visual canvas render */}
              <div
                className="w-full relative flex items-center justify-center overflow-hidden"
                style={{
                  height: img.ratio === '16:9' ? '180px' : '220px',
                  background: img.gradient
                }}
              >
                {/* 3D decorative luminous art shape inside */}
                <div
                  className="w-24 h-24 rounded-full blur-sm opacity-80 animate-pulse"
                  style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#130E20] via-transparent to-transparent opacity-90" />

                {/* Floating badge */}
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-medium border border-white/10">
                  {img.style} • {img.ratio}
                </div>

                {/* Action button overlay on hover */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDownload(img.title)}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-colors"
                    title="Download 4K"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Meta */}
              <div className="p-3.5">
                <h5 className="text-xs font-semibold text-white truncate">{img.title}</h5>
                <p className="text-[11px] text-[#867E9C] mt-1 line-clamp-2 leading-relaxed">
                  "{img.prompt}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
