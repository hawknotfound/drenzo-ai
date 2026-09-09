import { useState } from 'react';
import { X, Share2, Copy, Download, FileCode, FileText, Check } from 'lucide-react';
import type { ChatMessage } from '@/types/chat';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
}

export function ExportModal({ isOpen, onClose, messages }: ExportModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdown = () => {
    if (messages.length === 0) {
      return `# Drenzo AI Export\n*Exported on ${new Date().toLocaleString()}*\n\n*(No conversation history recorded yet.)*`;
    }

    let md = `# Drenzo AI Export\n*Date: ${new Date().toLocaleString()}*\n\n---\n\n`;
    messages.forEach((msg) => {
      const author = msg.role === 'user' ? '**You**' : '**Drenzo AI**';
      md += `### ${author}\n\n${msg.content}\n\n---\n\n`;
    });
    return md;
  };

  const handleCopy = () => {
    const text = generateMarkdown();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = (format: 'md' | 'txt' | 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `drenzo-export-${Date.now()}.${format}`;

    if (format === 'md') {
      content = generateMarkdown();
      mimeType = 'text/markdown';
    } else if (format === 'txt') {
      content = messages.map(m => `[${m.role === 'user' ? 'You' : 'Drenzo AI'}]\n${m.content}`).join('\n\n---\n\n');
      mimeType = 'text/plain';
    } else if (format === 'json') {
      content = JSON.stringify({
        exportedAt: new Date().toISOString(),
        messages: messages
      }, null, 2);
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  const optionClass = 'w-full flex items-center justify-between p-3 rounded-xl bg-[#1B142B] hover:bg-[#231A38] border border-[#2C2142] hover:border-purple-500/40 transition-all text-left group';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-[#130E20] sm:border border-[#2F2348] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5 text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#221838]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Export Session</h3>
              <p className="text-[11px] text-[#867D9C]">Save or share your conversation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Options */}
        <div className="py-4 space-y-2.5">
          <button onClick={handleCopy} className={optionClass}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Copy as Markdown</div>
                <div className="text-[10px] text-[#837B97]">Copy formatted text to clipboard</div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-purple-300 group-hover:underline">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>

          <button onClick={() => handleDownload('md')} className={optionClass}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Download Markdown (.md)</div>
                <div className="text-[10px] text-[#837B97]">For Obsidian, Notion, or GitHub</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#7B7390] group-hover:text-purple-300 transition-colors" />
          </button>

          <button onClick={() => handleDownload('txt')} className={optionClass}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Plain Text (.txt)</div>
                <div className="text-[10px] text-[#837B97]">Clean text without markdown</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#7B7390] group-hover:text-purple-300 transition-colors" />
          </button>

          <button onClick={() => handleDownload('json')} className={optionClass}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">JSON Backup (.json)</div>
                <div className="text-[10px] text-[#837B97]">Full structured chat data</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#7B7390] group-hover:text-purple-300 transition-colors" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#221838]">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-medium text-[#A59DBA] hover:text-white hover:bg-[#1C152D] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
