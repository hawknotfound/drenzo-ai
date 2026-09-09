import React, { useState } from 'react';
import { X, Share2, Copy, Download, FileCode, FileText, Check } from 'lucide-react';
import { ChatMessage, ModelOption } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  selectedModel: ModelOption;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  messages,
  selectedModel,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate markdown transcript
  const generateMarkdown = () => {
    if (messages.length === 0) {
      return `# Zyricon AI Workspace Export\n*Model: ${selectedModel.name}*\n*Exported on ${new Date().toLocaleString()}*\n\n*(No conversation history recorded in this session yet.)*`;
    }

    let md = `# Zyricon AI Workspace Export\n*Model: ${selectedModel.name}*\n*Date: ${new Date().toLocaleString()}*\n\n---\n\n`;
    messages.forEach((msg) => {
      const author = msg.role === 'user' ? '👤 **User**' : `✨ **Zyricon (${selectedModel.name})**`;
      md += `### ${author} *(${msg.timestamp})*\n\n${msg.content}\n\n`;
      if (msg.attachedFile) {
        md += `*Attached File: ${msg.attachedFile.name} (${(msg.attachedFile.size / 1024).toFixed(1)} KB)*\n\n`;
      }
      md += `---\n\n`;
    });
    return md;
  };

  const handleCopy = () => {
    const text = generateMarkdown();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      onShowToast('Copied to Clipboard', 'Full session transcript copied as Markdown', 'success');
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownload = (format: 'md' | 'txt' | 'json') => {
    let content = '';
    let mimeType = 'text/plain';
    let filename = `zyricon-export-${Date.now()}.${format}`;

    if (format === 'md') {
      content = generateMarkdown();
      mimeType = 'text/markdown';
    } else if (format === 'txt') {
      content = messages.map(m => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      mimeType = 'text/plain';
    } else if (format === 'json') {
      content = JSON.stringify({
        exportedAt: new Date().toISOString(),
        model: selectedModel,
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

    onShowToast('Export Downloaded', `Saved as ${filename}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#130E20] border border-[#2F2348] shadow-2xl p-5 text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#221838]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Export Session</h3>
              <p className="text-[11px] text-[#867D9C]">Save or share your current workspace conversation</p>
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
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1B142B] hover:bg-[#231A38] border border-[#2C2142] hover:border-purple-500/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Copy as Markdown</div>
                <div className="text-[10px] text-[#837B97]">Copy formatted text directly to clipboard</div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-purple-300 group-hover:underline">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>

          <button
            onClick={() => handleDownload('md')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1B142B] hover:bg-[#231A38] border border-[#2C2142] hover:border-purple-500/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Download Markdown (.md)</div>
                <div className="text-[10px] text-[#837B97]">Formatted file for Obsidian, Notion, or GitHub</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#7B7390] group-hover:text-purple-300 transition-colors" />
          </button>

          <button
            onClick={() => handleDownload('txt')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1B142B] hover:bg-[#231A38] border border-[#2C2142] hover:border-purple-500/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Plain Text (.txt)</div>
                <div className="text-[10px] text-[#837B97]">Clean readable text without markdown syntax</div>
              </div>
            </div>
            <Download className="w-4 h-4 text-[#7B7390] group-hover:text-purple-300 transition-colors" />
          </button>

          <button
            onClick={() => handleDownload('json')}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1B142B] hover:bg-[#231A38] border border-[#2C2142] hover:border-purple-500/40 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-950/70 flex items-center justify-center text-purple-300">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">JSON State Backup (.json)</div>
                <div className="text-[10px] text-[#837B97]">Full structured chat payload with metadata</div>
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
};
