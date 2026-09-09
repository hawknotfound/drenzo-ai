import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  FileIcon,
  Code2,
  Share2
} from 'lucide-react';
import { ChatMessage, ModelOption } from '../types';

interface ChatStreamProps {
  messages: ChatMessage[];
  selectedModel: ModelOption;
  isLoading: boolean;
  onRegenerate: () => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ChatStream: React.FC<ChatStreamProps> = ({
  messages,
  selectedModel,
  isLoading,
  onRegenerate,
  onShowToast,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    onShowToast('Copied', 'Response copied to clipboard', 'success');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    setFeedback((prev) => ({ ...prev, [id]: type }));
    onShowToast('Feedback recorded', `Thanks for rating this response!`, 'info');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 space-y-6">
      {messages.map((msg, index) => {
        const isUser = msg.role === 'user';
        const isCopied = copiedIndex === index;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 animate-in fade-in duration-200 ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
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
              className={`flex-1 max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                isUser
                  ? 'bg-[#221838] border border-[#352654] text-white'
                  : 'bg-[#140E22]/90 border border-[#261C3B] text-[#E2DCF0]'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-center justify-between mb-1.5 text-[11px] text-[#867D9C]">
                <span className="font-semibold text-purple-300">
                  {isUser ? 'You' : `Zyricon • ${selectedModel.name}`}
                </span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Attached file if present */}
              {msg.attachedFile && (
                <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-lg bg-[#181126] border border-purple-500/20 text-xs text-purple-300">
                  <FileIcon className="w-3.5 h-3.5" />
                  <span>{msg.attachedFile.name}</span>
                </div>
              )}

              {/* Message text with formatting */}
              <div className="whitespace-pre-wrap font-normal">
                {msg.content}
              </div>

              {/* Code Snippet Box if message contains code */}
              {msg.codeSnippet && (
                <div className="mt-3 rounded-xl overflow-hidden border border-[#332452] bg-[#0E0A17]">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#171026] text-[11px] font-mono text-[#9D93B5]">
                    <div className="flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{msg.codeSnippet.language}</span>
                    </div>
                    <button
                      onClick={() => handleCopyText(msg.codeSnippet!.code, index)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-3 text-xs font-mono text-[#C4BBDB] overflow-x-auto">
                    <code>{msg.codeSnippet.code}</code>
                  </pre>
                </div>
              )}

              {/* Assistant Message Actions Bar */}
              {!isUser && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#1F1730] text-[11px] text-[#7E7494]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleFeedback(msg.id, 'up')}
                      className={`p-1 rounded hover:text-white transition-colors ${
                        feedback[msg.id] === 'up' ? 'text-purple-300' : ''
                      }`}
                      title="Good response"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(msg.id, 'down')}
                      className={`p-1 rounded hover:text-white transition-colors ${
                        feedback[msg.id] === 'down' ? 'text-red-400' : ''
                      }`}
                      title="Poor response"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyText(msg.content, index)}
                      className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded"
                      title="Copy response"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    {index === messages.length - 1 && !isLoading && (
                      <button
                        onClick={onRegenerate}
                        className="flex items-center gap-1 hover:text-white transition-colors p-1 rounded text-purple-300"
                        title="Regenerate this response"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Indicator when streaming/waiting */}
      {isLoading && (
        <div className="flex items-start gap-3 animate-in fade-in duration-150">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7e22ce] to-[#3b0764] flex items-center justify-center text-white shadow-[0_0_12px_rgba(147,51,234,0.5)] animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="rounded-2xl px-4 py-3 bg-[#140E22] border border-[#261C3B] text-xs text-[#9F95B5] flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span>Zyricon is synthesizing response...</span>
          </div>
        </div>
      )}
    </div>
  );
};
