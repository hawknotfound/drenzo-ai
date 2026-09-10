import { useState, useRef, useEffect, useCallback, isValidElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Send, Sparkles, Copy, Check, RotateCw, User, Brain, Paperclip, ChevronDown, ChevronRight, Pencil, Undo2, Share2, Mail, Code2
} from 'lucide-react';
import type { ChatMessage } from '@/types/chat';

interface ChatTimelineProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  isStreaming: boolean;
  thinking: string;
  isFounder?: boolean;
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

function getCodeBlockInfo(child: React.ReactNode): { language: string; code: string } {
  if (!isValidElement(child)) return { language: 'code', code: '' }
  const props = child.props as { className?: string; children?: React.ReactNode }
  const language = props.className?.match(/language-([\w-]+)/)?.[1] ?? 'code'
  const code = String(props.children ?? '').replace(/\n$/, '')
  return { language, code }
}

function CodeBlock({ language, code, children }: { language: string; code: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false)
  const [shared, setShared] = useState(false)

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const shareCode = async () => {
    const text = `\`\`\`${language}\n${code}\n\`\`\``
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'Code from Drenzo AI', text })
        return
      } catch {}
    }
    await copyCode()
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const sendViaGmail = () => {
    const subject = encodeURIComponent('Code from Drenzo AI')
    const body = encodeURIComponent(`\`\`\`${language}\n${code}\n\`\`\``)
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank', 'noopener,noreferrer')
  }

  const toolBtn = 'p-1.5 rounded-md text-[#887e9e] hover:text-white hover:bg-[#251d38] active:bg-[#2e2248] transition-colors'

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#332452] bg-[#0E0A17]">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-[#171026] border-b border-[#332452]">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9D93B5] truncate">{language}</span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={copyCode} className={toolBtn} title="Copy code" aria-label="Copy code">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button onClick={shareCode} className={toolBtn} title="Share code" aria-label="Share code">
            {shared ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button onClick={sendViaGmail} className={toolBtn} title="Send via Gmail" aria-label="Send via Gmail">
            <Mail className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <pre className="!m-0 !rounded-none !border-0 !bg-transparent overflow-x-auto p-3.5 text-[13px] font-mono leading-relaxed text-[#C4BBDB]">{children}</pre>
    </div>
  )
}

function PreBlock({ children }: { children?: React.ReactNode }) {
  const { language, code } = getCodeBlockInfo(children)
  return <CodeBlock language={language} code={code}>{children}</CodeBlock>
}

export function ChatTimeline({
  messages, onSendMessage, onRegenerate, onEditMessage, isStreaming, thinking, isFounder: isFounderProp
}: ChatTimelineProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showThinking, setShowThinking] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [originalText, setOriginalText] = useState('');
  const editRef = useRef<HTMLTextAreaElement>(null);
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

  const startEditing = (msg: ChatMessage) => {
    setEditingId(msg.id);
    setEditText(msg.content);
    setOriginalText(msg.content);
    setTimeout(() => editRef.current?.focus(), 0);
  };

  const saveEdit = () => {
    if (editingId && editText.trim()) {
      onEditMessage(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
    setOriginalText('');
  };

  const cancelEdit = () => {
    if (editingId && originalText) {
      setEditText(originalText);
    }
    setEditingId(null);
    setEditText('');
    setOriginalText('');
  };

  const revertEdit = () => {
    setEditText(originalText);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === 'Escape') {
      cancelEdit();
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
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-4 sm:px-6 select-none">
      {/* Messages — minimal ChatGPT style with dividers */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.04]"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className={`group flex gap-3 sm:gap-4 py-6 ${isUser ? 'justify-end' : ''}`}
              >
                {isUser ? (
                  <>
                    {/* User: right-aligned pill bubble */}
                    <div className="flex flex-col items-end max-w-[82%] sm:max-w-[68%] gap-1.5">
                      <div className="flex items-center gap-2 text-[11px] text-[#6e6680] px-1">
                        <span>{relativeTime(msg.created_at)}</span>
                        <span className="font-medium text-[#9b92b0]">You{isFounderProp && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">Founder</span>}</span>
                      </div>
                      {editingId === msg.id ? (
                        <div className="w-full space-y-2">
                          <textarea
                            ref={editRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="w-full bg-[#0E0A17] border border-purple-500/40 rounded-xl p-3.5 text-white text-sm focus:outline-none focus:border-purple-500/60 resize-none custom-scrollbar"
                            rows={3}
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={revertEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151122] hover:bg-[#1e1830] text-[#867D9C] hover:text-white text-xs transition-all">
                              <Undo2 className="w-3.5 h-3.5" /> Revert
                            </button>
                            <button onClick={saveEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs transition-all active:scale-95">
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl rounded-br-md bg-[#1e1730] border border-[#2f2545] px-4 py-3 text-sm leading-relaxed text-white whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      )}
                      {!editingId && !isStreaming && (
                        <div className="flex items-center gap-1 pr-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button onClick={() => handleCopy(msg.content, `user-${msg.id}`)} className="p-1.5 rounded-lg text-[#635b75] hover:text-white hover:bg-[#1e1730] transition-colors" title="Copy">
                            {copiedId === `user-${msg.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => startEditing(msg)} className="p-1.5 rounded-lg text-[#635b75] hover:text-white hover:bg-[#1e1730] transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#1a1528] border border-[#2a2340] text-[#9b92b0] flex items-center justify-center shrink-0 mt-6">
                      <User className="w-4 h-4" />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Assistant: full-width prose, no bubble */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7e22ce] to-[#3b0764] flex items-center justify-center text-white shrink-0 shadow-[0_0_12px_rgba(147,51,234,0.35)]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-white tracking-tight">Drenzo AI</span>
                        <span className="text-[11px] text-[#6e6680]">{relativeTime(msg.created_at)}</span>
                      </div>
                      {editingId === msg.id ? (
                        <div className="space-y-2">
                          <textarea
                            ref={editRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="w-full bg-[#0E0A17] border border-purple-500/40 rounded-xl p-3.5 text-white text-sm focus:outline-none resize-none custom-scrollbar"
                            rows={4}
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button onClick={revertEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151122] hover:bg-[#1e1830] text-[#867D9C] hover:text-white text-xs transition-all">
                              <Undo2 className="w-3.5 h-3.5" /> Revert
                            </button>
                            <button onClick={saveEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs transition-all active:scale-95">
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-invert prose-sm max-w-none leading-relaxed [&_p]:my-2.5 [&_p:first-child]:mt-0 [&_pre]:my-4 [&_pre]:bg-[#0E0A17] [&_pre]:border [&_pre]:border-[#332452] [&_pre]:rounded-xl [&_code]:text-[13px] [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_th]:text-left [&_th]:border-b [&_th]:border-[#332452] [&_th]:pb-2 [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_td]:py-2 [&_td]:text-sm [&_blockquote]:border-l-2 [&_blockquote]:border-purple-500/40 [&_blockquote]:bg-[#140e22]/50 [&_blockquote]:rounded-r-lg [&_blockquote]:py-2 [&_blockquote]:px-3 [&_blockquote]:text-[#9b92b0] [&_a]:text-purple-400 [&_a:hover]:text-purple-300 [&_hr]:border-[#271D3A] [&_img]:rounded-xl [&_ul]:my-2 [&_ol]:my-2 [&_li]:my-1 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:text-base [&_h3]:font-semibold">
                          <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]} components={{ pre: PreBlock }}>
                            {msg.content}
                          </Markdown>
                          {isStreaming && msg.id === messages[messages.length - 1]?.id && (
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-text-bottom" />
                          )}
                        </div>
                      )}
                      {!isStreaming && msg.content && editingId !== msg.id && (
                        <div className="flex items-center gap-1 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleCopy(msg.content, msg.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#161124] hover:bg-[#1e1730] border border-[#221a33] hover:border-[#2a2050] text-xs text-[#7E7494] hover:text-white transition-all" title="Copy">
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          {isFounderProp && (
                            <button onClick={() => { const json = JSON.stringify({ id: msg.id, role: msg.role, content: msg.content, created_at: msg.created_at, metadata: msg.metadata }, null, 2); navigator.clipboard.writeText(json); }} className="p-1.5 rounded-full bg-[#161124] hover:bg-[#1e1730] border border-[#221a33] text-[#635b75] hover:text-amber-400 transition-colors" title="Copy as JSON">
                              <Code2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={onRegenerate} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#161124] hover:bg-[#1e1730] border border-[#221a33] hover:border-[#2a2050] text-xs text-[#7E7494] hover:text-white transition-all" title="Regenerate">
                            <RotateCw className="w-3.5 h-3.5" /> <span>Regenerate</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Thinking indicator when assistant empty */}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].content && (
          <div className="flex gap-4 py-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7e22ce] to-[#3b0764] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 text-sm text-[#9b92b0]">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Thinking Panel */}
      {thinking && (
        <div className="shrink-0 my-3 rounded-xl bg-[#0f0b1a] border border-[#261C3B] overflow-hidden">
          <button onClick={() => setShowThinking(!showThinking)} className="flex items-center gap-2 w-full px-3.5 py-2.5 text-xs text-[#867D9C] hover:text-[#E2DCF0] transition-colors">
            {showThinking ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-medium">Thinking</span>
            {isStreaming && <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-1" />}
          </button>
          {showThinking && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-3.5 pb-3 text-xs leading-relaxed whitespace-pre-wrap font-mono text-[#6e6680] max-h-40 overflow-y-auto custom-scrollbar border-t border-[#1e1730] pt-3">
              {thinking}
              {isFounderProp && <div className="mt-2 pt-2 border-t border-[#1e1730] text-[10px] text-amber-400/60 flex items-center gap-1.5"><Code2 className="w-3 h-3" /><span>Debug: {thinking.length} chars | streaming: {isStreaming ? 'true' : 'false'}</span></div>}
            </motion.div>
          )}
        </div>
      )}

      {/* Input — floating minimal pill */}
      <div className="pt-3 pb-4 sm:pb-6 shrink-0">
        <div className="relative flex items-end gap-2 rounded-[20px] bg-[#0f0b1a] border border-[#221a33] focus-within:border-purple-500/40 focus-within:bg-[#130e22] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-200 px-2 py-2">
          <button onClick={handleAttach} className="p-2.5 rounded-xl text-[#6e6680] hover:text-white hover:bg-white/[0.06] transition-colors shrink-0" title="Attach file">
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 max-h-32 py-3 bg-transparent text-white placeholder-[#6e6680] text-[15px] leading-relaxed focus:outline-none resize-none custom-scrollbar"
          />
          <button
            onClick={() => { if (inputText.trim() && !isStreaming) { onSendMessage(inputText.trim()); setInputText(''); } }}
            disabled={!inputText.trim() || isStreaming}
            className={`p-2.5 rounded-xl shrink-0 transition-all ${inputText.trim() && !isStreaming ? 'bg-white text-black hover:bg-zinc-100 active:scale-95 shadow-md' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[11px] text-[#3d3550] mt-2">Drenzo can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}
