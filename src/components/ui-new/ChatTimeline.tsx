import { useState, useRef, useEffect, useCallback, isValidElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Markdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Send, Sparkles, Copy, Check, RotateCw, User, Brain, Paperclip, ChevronDown, ChevronRight, Pencil, Undo2, Share2, Mail
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
    <div className="my-3 overflow-hidden rounded-xl border border-[#332452] bg-[#0E0A17]">
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
      <pre className="!m-0 !rounded-none !border-0 !bg-transparent overflow-x-auto p-3 text-xs font-mono text-[#C4BBDB]">{children}</pre>
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
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 select-none">
      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto space-y-6 py-4 pr-1 custom-scrollbar"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${
                    isUser
                      ? 'bg-[#352554] text-purple-200 border border-purple-400/40'
                      : 'bg-gradient-to-br from-[#7e22ce] to-[#3b0764] text-white shadow-[0_0_10px_rgba(147,51,234,0.4)]'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble Content */}
                <div
                  className={`flex-1 max-w-[90%] sm:max-w-[85%] rounded-2xl p-3 sm:p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#221838] border border-[#352654] text-white'
                      : 'bg-[#140E22]/90 border border-[#261C3B] text-[#E2DCF0]'
                  }`}
                >
                  {/* Header Info */}
                  <div className="flex items-center justify-between mb-1.5 text-[11px] text-[#867D9C]">
                    <span className="font-semibold text-purple-300">
                      {isUser ? (
                        <>You{isFounderProp && <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-medium">Founder</span>}</>
                      ) : 'Drenzo AI'}
                    </span>
                    <span>{relativeTime(msg.created_at)}</span>
                  </div>

                  {/* Content */}
                  {isUser ? (
                    editingId === msg.id ? (
                      <div className="space-y-2">
                        <textarea
                          ref={editRef}
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={handleEditKeyDown}
                          className="w-full bg-[#0E0A17]/80 border border-purple-500/50 rounded-lg p-3 text-white text-sm focus:outline-none resize-none custom-scrollbar"
                          rows={4}
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={revertEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151122] hover:bg-[#1e1830] text-[#867D9C] hover:text-white text-xs transition-all"
                          >
                            <Undo2 className="w-3.5 h-3.5" />
                            Revert
                          </button>
                          <button
                            onClick={saveEdit}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs transition-all active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                    )
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none [&_pre]:bg-[#0E0A17] [&_pre]:border [&_pre]:border-[#332452] [&_pre]:rounded-xl [&_code]:text-sm [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_table]:w-full [&_th]:text-left [&_th]:border-b [&_th]:border-[#332452] [&_th]:pb-2 [&_td]:py-1 [&_blockquote]:border-l-purple-500 [&_blockquote]:text-[#867D9C] [&_a]:text-purple-400 [&_a:hover]:text-purple-300 [&_hr]:border-[#271D3A] [&_img]:rounded-xl [&_ul]:list-disc [&_ol]:list-decimal [&_li]:my-0.5">
                      {editingId === msg.id ? (
                        <div className="space-y-2">
                          <textarea
                            ref={editRef}
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={handleEditKeyDown}
                            className="w-full bg-[#0E0A17]/80 border border-purple-500/50 rounded-lg p-3 text-white text-sm focus:outline-none resize-none custom-scrollbar"
                            rows={4}
                          />
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={revertEdit}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151122] hover:bg-[#1e1830] text-[#867D9C] hover:text-white text-xs transition-all"
                            >
                              <Undo2 className="w-3.5 h-3.5" />
                              Revert
                            </button>
                            <button
                              onClick={saveEdit}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs transition-all active:scale-95"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Markdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]} components={{ pre: PreBlock }}>
                            {msg.content}
                          </Markdown>
                          {isStreaming && msg.id === messages[messages.length - 1]?.id && (
                            <motion.span
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="inline-block w-0.5 h-4 bg-purple-400 ml-0.5 align-text-bottom"
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isUser && !isStreaming && msg.content && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1F1730] text-[11px] text-[#7E7494]">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <button
                        onClick={onRegenerate}
                        className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded text-purple-300"
                        title="Regenerate this response"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  )}
                  {isUser && !editingId && !isStreaming && (
                    <div className="flex items-center gap-3 pt-3 mt-2 border-t border-[#1F1730] text-[#7E7494] text-xs">
                      <button
                        onClick={() => handleCopy(msg.content, `user-${msg.id}`)}
                        className="flex items-center gap-1.5 p-1 hover:text-white active:text-emerald-400 transition-colors rounded-lg hover:bg-[#1e1730]"
                      >
                        {copiedId === `user-${msg.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => startEditing(msg)}
                        className="flex items-center gap-1.5 p-1 hover:text-white active:text-purple-400 transition-colors rounded-lg hover:bg-[#1e1730]"
                        title="Edit message"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].content && (
          <div className="flex items-start gap-3 animate-in fade-in duration-150">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7e22ce] to-[#3b0764] flex items-center justify-center text-white shadow-[0_0_12px_rgba(147,51,234,0.5)]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-[#140E22] border border-[#261C3B] text-xs text-[#9F95B5] flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Drenzo is thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Thinking Panel */}
      {thinking && (
        <div className="shrink-0 mx-1 mb-2 rounded-xl bg-[#140E22]/80 border border-[#261C3B] overflow-hidden">
          <button
            onClick={() => setShowThinking(!showThinking)}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-[#867D9C] hover:text-[#E2DCF0] transition-colors"
          >
            {showThinking ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-medium">Model thinking</span>
            {isStreaming && (
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="inline-block w-1.5 h-1.5 rounded-full bg-purple-400 ml-1"
              />
            )}
          </button>
          {showThinking && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="px-3 pb-3 text-[11px] text-[#6e6680] leading-relaxed whitespace-pre-wrap font-mono max-h-40 overflow-y-auto custom-scrollbar border-t border-[#261C3B] pt-2"
            >
              {thinking}
            </motion.div>
          )}
        </div>
      )}

      {/* Input Area */}
      <div className="pt-2 pb-3 sm:pb-4 shrink-0">
        <div className="relative flex items-center rounded-2xl bg-[#161124]/90 border border-[#2c2240] focus-within:border-purple-500/60 focus-within:ring-4 focus-within:ring-purple-500/15 backdrop-blur-2xl shadow-xl transition-all duration-300">
          <button
            onClick={handleAttach}
            className="ml-2 sm:ml-3 p-2.5 sm:p-2 rounded-lg text-[#6e6680] hover:text-[#9b92b0] hover:bg-[#1e1730] active:bg-[#251d38] transition-all"
            title="Attach a file"
          >
            <Paperclip className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a follow-up message..."
            rows={1}
            className="w-full py-4 sm:py-3.5 px-2 sm:px-3 bg-transparent text-white placeholder-[#6e6680] text-sm focus:outline-none resize-none custom-scrollbar"
          />
          <button
            onClick={() => {
              if (inputText.trim() && !isStreaming) {
                onSendMessage(inputText.trim());
                setInputText('');
              }
            }}
            disabled={!inputText.trim() || isStreaming}
            className={`mr-2 sm:mr-2 p-2.5 sm:p-2 rounded-xl transition-all ${
              inputText.trim() && !isStreaming
                ? 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white cursor-pointer active:scale-95 shadow-md shadow-purple-500/30'
                : 'bg-[#1e1730] text-[#6e6680] cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
