import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Send, Sparkles, Copy, Check, RotateCw, User, Brain, Download, Paperclip, ChevronDown, ChevronRight
} from 'lucide-react';
import type { ChatMessage } from '@/types/chat';

interface ChatTimelineProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
  isStreaming: boolean;
  thinking: string;
}

function relativeTime(dateStr: string | undefined): string {
  if (!dateStr) return ''
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function exportChat(messages: ChatMessage[]) {
  const text = messages
    .map(m => `[${m.role === 'user' ? 'You' : 'Drenzo AI'}]\n${m.content}`)
    .join('\n\n---\n\n')
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chat-export-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export function ChatTimeline({
  messages, onSendMessage, onRegenerate, isStreaming, thinking
}: ChatTimelineProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showThinking, setShowThinking] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const threshold = 100
    setIsAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < threshold)
  }, [])

  useEffect(() => {
    if (isAtBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

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

  const handleAttach = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.md,.js,.ts,.tsx,.jsx,.py,.html,.css,.json,.csv,.yml,.yaml,.toml,.sh,.bat,.ps1,.sql,.xml,.env'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        const content = reader.result as string
        const text = `[Attached: ${file.name}]\n\`\`\`\n${content}\n\`\`\``
        setInputText(prev => prev ? `${prev}\n\n${text}` : text)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto px-3 sm:px-4 select-none">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 py-4 sm:py-6 pr-1 sm:pr-2 custom-scrollbar"
      >
        {messages.length > 0 && (
          <div className="flex justify-end mb-2">
            <button
              onClick={() => exportChat(messages)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs transition-all"
              title="Export chat"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
        )}
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
                <span className="text-[11px] text-zinc-500 ml-auto">{relativeTime(msg.created_at)}</span>
              </div>

              <div
                className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-zinc-100 ml-auto max-w-[85%] sm:max-w-[75%]'
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
                  <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-[#0d1117] [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-lg [&_code]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_th]:text-left [&_th]:border-b [&_th]:border-white/20 [&_th]:pb-2 [&_td]:py-1 [&_blockquote]:border-l-blue-500 [&_blockquote]:text-zinc-400 [&_a]:text-blue-400 [&_a:hover]:text-blue-300 [&_hr]:border-white/10 [&_img]:rounded-lg [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-0.5">
                    {msg.role === 'assistant' ? (
                      <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </Markdown>
                    ) : (
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    )}
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

      {thinking && (
        <div className="shrink-0 mx-3 sm:mx-4 mb-2 rounded-xl bg-zinc-900/80 border border-zinc-700/30 overflow-hidden">
          <button
            onClick={() => setShowThinking(!showThinking)}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showThinking ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <Brain className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">Model thinking</span>
            {isStreaming && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400 ml-1"
              />
            )}
          </button>
          {showThinking && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-3 pb-3 text-[11px] text-zinc-500 leading-relaxed whitespace-pre-wrap font-mono max-h-40 overflow-y-auto custom-scrollbar border-t border-zinc-800/50 pt-2"
            >
              {thinking}
            </motion.div>
          )}
        </div>
      )}

      <div className="pt-2 pb-4 shrink-0">
        <div className="relative flex items-center rounded-2xl bg-[#161a25]/90 border border-white/10 focus-within:border-blue-500/50 backdrop-blur-2xl shadow-xl">
          <button
            onClick={handleAttach}
            className="ml-3 p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
            title="Attach a file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a follow-up message..."
            rows={1}
            className="w-full py-3.5 px-3 bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none resize-none custom-scrollbar"
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
