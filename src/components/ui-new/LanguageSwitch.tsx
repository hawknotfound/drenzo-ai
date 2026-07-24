interface LanguageSwitchProps {
  language: 'english' | 'hinglish';
  onToggle: () => void;
}

export function LanguageSwitch({ language, onToggle }: LanguageSwitchProps) {
  return (
    <div className="flex rounded-xl bg-[#1a202c]/80 backdrop-blur-md border border-white/10 overflow-hidden">
      <button
        onClick={language === 'hinglish' ? onToggle : undefined}
        className={`px-3 py-1.5 text-[11px] font-medium transition-all ${
          language === 'english'
            ? 'bg-blue-500/20 text-blue-300 shadow-inner'
            : 'text-zinc-400 hover:text-zinc-300'
        }`}
      >
        English
      </button>
      <div className="w-px bg-white/10" />
      <button
        onClick={language === 'english' ? onToggle : undefined}
        className={`px-3 py-1.5 text-[11px] font-medium transition-all ${
          language === 'hinglish'
            ? 'bg-orange-500/20 text-orange-300 shadow-inner'
            : 'text-zinc-400 hover:text-zinc-300'
        }`}
      >
        Hinglish
      </button>
    </div>
  );
}
