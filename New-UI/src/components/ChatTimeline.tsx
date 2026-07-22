import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Paperclip,
  Sparkles,
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Code,
  Download,
  Brain,
  ChevronDown,
  ChevronUp,
  User,
  Zap,
  Mic
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Message, AIModel } from '../types';

interface ChatTimelineProps {
  messages: Message[];
  selectedModel: AIModel;
  onSendMessage: (text: string) => void;
  onRegenerate: () => void;
  onNewChat: () => void;
  isStreaming: boolean;
}

export const ChatTimeline: React.FC<ChatTimelineProps> = ({
  messages,
  selectedModel,
  onSendMessage,
  onRegenerate,
  onNewChat,
  isStreaming
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});

  // Trigger copy code confetti & toast
  const handleCopy = (codeText: string, id: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedId(id);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd']
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Text to speech handling
  const handleReadAloud = (text: string, msgId: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMessageId === msgId) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      setSpeakingMessageId(msgId);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleThought = (msgId: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
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
    <div className="flex flex-col h-[calc(100vh-80px)] w-full max-w-4xl mx-auto px-4 select-none">
      {/* Messages Scroll Area */}
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
              {/* Message Header */}
              <div className="flex items-center gap-2.5">
                {msg.sender === 'user' ? (
                  <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-blue-300" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <span className="text-xs font-semibold text-white">
                  {msg.sender === 'user' ? 'You' : 'Drenzo AI'}
                </span>

                {msg.sender === 'ai' && (
                  <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5" />
                    {msg.modelUsed || selectedModel.name}
                  </span>
                )}

                <span className="text-[11px] text-zinc-500 ml-auto">{msg.timestamp}</span>
              </div>

              {/* Deep Thinking Accordion Drawer if thoughtProcess present */}
              {msg.sender === 'ai' && msg.thoughtProcess && (
                <div className="rounded-xl bg-[#131722]/80 border border-purple-500/20 overflow-hidden">
                  <button
                    onClick={() => toggleThought(msg.id)}
                    className="flex items-center justify-between w-full px-3.5 py-2 text-xs font-medium text-purple-300 hover:bg-purple-500/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Brain className="w-3.5 h-3.5 text-purple-400" />
                      <span>Deep Thinking Process (2.4s reasoning)</span>
                    </div>
                    {expandedThoughts[msg.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedThoughts[msg.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 py-3 bg-[#0d1018] text-xs text-zinc-400 font-mono space-y-1.5 border-t border-purple-500/15"
                      >
                        <p>• Analyzing query context and intent parameters...</p>
                        <p>• Synthesizing high-performance TypeScript components...</p>
                        <p>• Checking optical margin nesting & 60fps spring transitions...</p>
                        <p className="text-purple-300">• {msg.thoughtProcess}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Message Content Container */}
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/30 text-zinc-100 ml-auto max-w-[85%]'
                    : 'bg-[#151924]/80 border border-white/10 text-zinc-200 w-full backdrop-blur-md shadow-xl'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Code Snippets Render */}
                {msg.codeSnippets?.map((snippet, idx) => (
                  <div
                    key={idx}
                    className="mt-4 rounded-xl bg-[#0b0e14] border border-white/10 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-2 bg-[#121622] border-b border-white/5 text-xs text-zinc-400 font-mono">
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-blue-400" />
                        <span>{snippet.title || snippet.language}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(snippet.code, `${msg.id}-${idx}`)}
                          className="flex items-center gap-1 hover:text-white transition-colors"
                        >
                          {copiedId === `${msg.id}-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <pre className="p-4 text-xs font-mono text-blue-200/90 overflow-x-auto custom-scrollbar">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}

                {/* Streaming Indicator */}
                {msg.isStreaming && (
                  <div className="flex items-center gap-1.5 mt-3 text-blue-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>Drenzo AI is thinking and writing...</span>
                  </div>
                )}
              </div>

              {/* Response Quick Action Bar for AI */}
              {msg.sender === 'ai' && !msg.isStreaming && (
                <div className="flex items-center gap-3 pt-1 text-zinc-400 text-xs">
                  <button
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    title="Regenerate response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleReadAloud(msg.text, msg.id)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                    title="Read Aloud"
                  >
                    {speakingMessageId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <div className="h-3 w-[1px] bg-white/10 mx-1" />

                  <button className="hover:text-emerald-400 transition-colors" title="Helpful">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button className="hover:text-rose-400 transition-colors" title="Not Helpful">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom Input Area for Ongoing Chat */}
      <div className="pt-2 pb-4">
        <div className="relative flex items-center rounded-2xl bg-[#161a25]/90 border border-white/10 focus-within:border-blue-500/50 backdrop-blur-2xl shadow-xl">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputText.trim()) {
                onSendMessage(inputText.trim());
                setInputText('');
              }
            }}
            placeholder="Send a follow-up message..."
            className="w-full py-3.5 px-4 bg-transparent text-white placeholder-zinc-500 text-sm focus:outline-none"
          />
          <button
            onClick={() => {
              if (inputText.trim()) {
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
};
