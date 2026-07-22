import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Copy, Check, RotateCw, User, Brain
} from 'lucide-react';
import type { ChatMessage } from '@/types/chat';

interface ChatTimelineProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
  onNewChat: () => void;
  isStreaming: boolean;
}

export function ChatTimeline({
  messages, onSendMessage, onRegenerate, onNewChat, isStreaming
}: ChatTimelineProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        onSendMessage(inputText.trim());
        setInputText('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-4 select-none">
      <div className="flex-1 overflow-y-auto space-y-6 py-6 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center gap-2.5">
                {msg.role === 'user' ? (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-300" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <span className="text-xs font-semibold text-white">
                  {msg.role === 'user' ? 'You' : 'Drenzo AI'}
                </span>
                <span className="text-[11px] text-zinc-500 ml-auto">{msg.created_at}</span>
              </div>

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-zinc-100 ml-auto max-w-[85%]'
                    : 'bg-[#151924]/80 border border-white/10 text-zinc-200 w-full backdrop-blur-md shadow-xl'
                }`}
              >
                {msg.role === 'assistant' && !msg.content && isStreaming ? (
                  <div className="flex items-center gap-3 py-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Brain className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <div className="flex items-center gap-1">
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      />
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      />
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      />
                    </div>
                    <span className="text-xs text-zinc-400">Thinking</span>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.content}
                    {msg.role === 'assistant' && isStreaming && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        className="inline-block w-0.5 h-4 bg-blue-400 ml-0.5 align-text-bottom"
                      />
                    )}
                  </div>
                )}

                {msg.role === 'assistant' && !isStreaming && msg.content && (
                  <div className="flex items-center gap-3 pt-3 mt-2 border-t border-white/5 text-zinc-400 text-xs">
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={onRegenerate} className="flex items-center gap-1 hover:text-white transition-colors">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="pt-2 pb-4 shrink-0">
        <div className="relative flex items-center rounded-2xl bg-[#161a25]/90 border border-white/10 focus-within:border-blue-500/50 backdrop-blur-2xl shadow-xl">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a follow-up message..."
            rows={1}
            className="w-full py-3.5 px-4 bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none resize-none custom-scrollbar"
          />
          <button
            onClick={() => {
              if (inputText.trim() && !isStreaming) {
                onSendMessage(inputText.trim());
                setInputText('');
              }
            }}
            disabled={!inputText.trim() || isStreaming}
            className={`mr-2 p-2 rounded-xl transition-all ${
              inputText.trim() && !isStreaming
                ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-95'
                : 'bg-white/5 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
