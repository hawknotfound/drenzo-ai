import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Sparkles, Layout, FileSpreadsheet, GitPullRequest, Palette, Atom, Brain,
  Star, Eye, Lightbulb, Target, Users, Scale, UserCheck, Terminal,
  Code2, Globe, PenTool, Clock, MessageSquare, Monitor
} from 'lucide-react';
import type { PromptSuggestion } from '@/types/ui';
import { PROMPT_SUGGESTIONS } from '@/data/initialData';

interface HeroStateProps {
  inputText: string;
  setInputText: (val: string) => void;
  onSubmit: () => void;
  onSelectPromptSuggestion: (promptText: string) => void;
}

const THEMES: Record<string, { border: string; hoverBorder: string; bg: string; hoverBg: string; iconBg: string; iconHoverBg: string; text: string; shadow: string }> = {
  blue: {
    border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500/50',
    bg: 'bg-blue-600/10', hoverBg: 'hover:bg-blue-600/20',
    iconBg: 'bg-blue-500/15', iconHoverBg: 'group-hover:bg-blue-500/25',
    text: 'text-blue-300', shadow: 'hover:shadow-blue-500/10',
  },
  purple: {
    border: 'border-purple-500/20', hoverBorder: 'hover:border-purple-500/50',
    bg: 'bg-purple-600/10', hoverBg: 'hover:bg-purple-600/20',
    iconBg: 'bg-purple-500/15', iconHoverBg: 'group-hover:bg-purple-500/25',
    text: 'text-purple-300', shadow: 'hover:shadow-purple-500/10',
  },
  amber: {
    border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/50',
    bg: 'bg-amber-600/10', hoverBg: 'hover:bg-amber-600/20',
    iconBg: 'bg-amber-500/15', iconHoverBg: 'group-hover:bg-amber-500/25',
    text: 'text-amber-300', shadow: 'hover:shadow-amber-500/10',
  },
  emerald: {
    border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/50',
    bg: 'bg-emerald-600/10', hoverBg: 'hover:bg-emerald-600/20',
    iconBg: 'bg-emerald-500/15', iconHoverBg: 'group-hover:bg-emerald-500/25',
    text: 'text-emerald-300', shadow: 'hover:shadow-emerald-500/10',
  },
  rose: {
    border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-500/50',
    bg: 'bg-rose-600/10', hoverBg: 'hover:bg-rose-600/20',
    iconBg: 'bg-rose-500/15', iconHoverBg: 'group-hover:bg-rose-500/25',
    text: 'text-rose-300', shadow: 'hover:shadow-rose-500/10',
  },
  cyan: {
    border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50',
    bg: 'bg-cyan-600/10', hoverBg: 'hover:bg-cyan-600/20',
    iconBg: 'bg-cyan-500/15', iconHoverBg: 'group-hover:bg-cyan-500/25',
    text: 'text-cyan-300', shadow: 'hover:shadow-cyan-500/10',
  },
  violet: {
    border: 'border-violet-500/20', hoverBorder: 'hover:border-violet-500/50',
    bg: 'bg-violet-600/10', hoverBg: 'hover:bg-violet-600/20',
    iconBg: 'bg-violet-500/15', iconHoverBg: 'group-hover:bg-violet-500/25',
    text: 'text-violet-300', shadow: 'hover:shadow-violet-500/10',
  },
  orange: {
    border: 'border-orange-500/20', hoverBorder: 'hover:border-orange-500/50',
    bg: 'bg-orange-600/10', hoverBg: 'hover:bg-orange-600/20',
    iconBg: 'bg-orange-500/15', iconHoverBg: 'group-hover:bg-orange-500/25',
    text: 'text-orange-300', shadow: 'hover:shadow-orange-500/10',
  },
};

const ANIM_VARIANTS: Record<string, { initial: object; animate: object }> = {
  fadeRight: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
  fadeLeft: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
  fadeUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  scale: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } },
};

function SuggestionIcon({ iconName }: { iconName: string }) {
  const props = { className: "w-3.5 h-3.5" };
  switch (iconName) {
    case 'Layout': return <Layout {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Atom': return <Atom {...props} />;
    case 'Brain': return <Brain {...props} />;
    case 'GitPullRequest': return <GitPullRequest {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'FileSpreadsheet': return <FileSpreadsheet {...props} />;
    case 'Star': return <Star {...props} />;
    case 'Eye': return <Eye {...props} />;
    case 'Lightbulb': return <Lightbulb {...props} />;
    case 'Target': return <Target {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Scale': return <Scale {...props} />;
    case 'UserCheck': return <UserCheck {...props} />;
    case 'MonitorCode': return <Monitor {...props} />;
    case 'Terminal': return <Terminal {...props} />;
    case 'Code2': return <Code2 {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'MessageSquare': return <MessageSquare {...props} />;
    default: return <Sparkles {...props} />;
  }
}

export function HeroState({
  inputText, setInputText, onSubmit, onSelectPromptSuggestion,
}: HeroStateProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-4xl mx-auto px-4 py-8 my-auto select-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center space-y-2 mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-sm font-sans">
          Drenzo AI
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 font-normal tracking-wide">
          Think. Build. Create.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`relative w-full rounded-2xl bg-[#161a25]/80 border transition-all duration-300 backdrop-blur-2xl shadow-2xl ${
          isFocused
            ? 'border-blue-500/60 ring-4 ring-blue-500/15 shadow-[0_0_35px_rgba(59,130,246,0.2)]'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI chat..."
          rows={3}
          className="w-full p-5 bg-transparent text-white placeholder-zinc-500 text-base font-normal resize-none focus:outline-none custom-scrollbar"
        />

        <div className="flex items-center justify-end px-4 pb-4">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!inputText.trim()}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 ${
              inputText.trim()
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-100 cursor-pointer active:scale-95'
                : 'bg-blue-600/40 text-white/50 cursor-not-allowed scale-95'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-10 w-full">
        {PROMPT_SUGGESTIONS.map((sug, i) => {
          const theme = THEMES[sug.theme || 'blue'];
          const anim = ANIM_VARIANTS[sug.anim || 'fadeUp'];
          return (
            <motion.div
              key={sug.id}
              initial={anim.initial}
              animate={anim.animate}
              transition={{ duration: 0.35, delay: 0.3 + i * 0.04, ease: 'easeOut' }}
              className="w-full"
            >
              <button
                onClick={() => onSelectPromptSuggestion(sug.promptText)}
                className={`group flex items-center gap-2.5 p-3 rounded-2xl border transition-all duration-200 text-left shadow-md active:scale-98 cursor-pointer w-full ${theme.bg} ${theme.border} ${theme.hoverBg} ${theme.hoverBorder} ${theme.shadow}`}
              >
                <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${theme.iconBg} ${theme.iconHoverBg}`}>
                  <SuggestionIcon iconName={sug.icon} />
                </div>
                <span className={`text-xs font-medium truncate ${theme.text} group-hover:text-white transition-colors`}>
                  {sug.label}
                </span>
              </button>
            </motion.div>
          );
        })}
      </div>


    </div>
  );
}
