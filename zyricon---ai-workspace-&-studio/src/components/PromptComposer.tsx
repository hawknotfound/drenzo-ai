import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Paperclip,
  Sliders,
  LayoutGrid,
  Mic,
  MicOff,
  ArrowUp,
  X,
  FileIcon,
  Globe,
  Code,
  BrainCircuit,
  Check
} from 'lucide-react';
import { AttachedFile, FeatureOptions } from '../types';

interface PromptComposerProps {
  prompt: string;
  onChangePrompt: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  attachedFile: AttachedFile | null;
  onAttachFile: (file: AttachedFile | null) => void;
  featureOptions: FeatureOptions;
  onChangeFeatureOptions: (options: FeatureOptions) => void;
  onShowToast: (title: string, desc?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenSettingsModal: () => void;
}

export const PromptComposer: React.FC<PromptComposerProps> = ({
  prompt,
  onChangePrompt,
  onSubmit,
  isLoading,
  attachedFile,
  onAttachFile,
  featureOptions,
  onChangeFeatureOptions,
  onShowToast,
  onOpenSettingsModal,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [promptTone, setPromptTone] = useState<'balanced' | 'creative' | 'precise'>('balanced');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setIsOptionsOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsQuickSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      onShowToast('File too large', 'Max supported attachment size is 15MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onAttachFile({
        id: `att-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        dataUrl: typeof reader.result === 'string' ? reader.result : undefined
      });
      onShowToast('Attachment added', file.name, 'success');
    };
    reader.readAsDataURL(file);

    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Web Speech API for voice dictation
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onShowToast(
        'Speech Recognition Unavailable',
        'Your browser does not support the Web Speech API. You can type in the composer.',
        'info'
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      onShowToast('Voice Input Stopped', undefined, 'info');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onShowToast('Listening...', 'Speak clearly into your microphone', 'info');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onChangePrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          onShowToast('Microphone Permission Denied', 'Please enable mic access in your browser settings.', 'warning');
        } else {
          onShowToast('Voice input ended', event.error || 'Check microphone connection', 'info');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      onShowToast('Voice Error', 'Could not initialize speech recognition', 'error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if ((prompt.trim() || attachedFile) && !isLoading) {
        onSubmit();
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,.pdf,.txt,.md,.json,.js,.ts,.py,.csv"
      />

      {/* Main Composer Box */}
      <div className="relative rounded-2xl bg-[#120E1E]/95 border border-[#271E3A] hover:border-[#3E3059] focus-within:border-[#8B5CF6]/70 focus-within:shadow-[0_0_24px_rgba(139,92,246,0.18)] transition-all duration-200 p-3.5 shadow-xl">
        {/* Top prompt input area */}
        <div className="flex items-start gap-3">
          {/* Glowing Purple Sparkle Icon */}
          <div className="mt-1 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#A855F7] animate-pulse" />
          </div>

          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              rows={1}
              value={prompt}
              onChange={(e) => onChangePrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Anything..."
              disabled={isLoading}
              className="w-full bg-transparent resize-none outline-none text-sm text-white placeholder-[#786F8A] font-normal leading-relaxed overflow-y-auto"
              style={{ maxHeight: '180px' }}
            />

            {/* Attached file chip */}
            {attachedFile && (
              <div className="inline-flex items-center gap-2 mt-2 px-2.5 py-1 rounded-lg bg-[#201833] border border-purple-500/30 text-xs text-purple-200">
                <FileIcon className="w-3.5 h-3.5 text-purple-400" />
                <span className="truncate max-w-[200px] font-medium">{attachedFile.name}</span>
                <span className="text-[10px] text-purple-300/70">({formatFileSize(attachedFile.size)})</span>
                <button
                  onClick={() => onAttachFile(null)}
                  className="p-0.5 hover:text-white text-purple-300/80 rounded"
                  title="Remove attachment"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom controls row */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1C152B]">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Attach button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#938BA7] hover:text-white hover:bg-[#1C162E] transition-colors"
              title="Attach documents, images, or code"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach</span>
            </button>

            {/* Settings button */}
            <div className="relative" ref={settingsRef}>
              <button
                onClick={() => setIsQuickSettingsOpen(!isQuickSettingsOpen)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                  ${isQuickSettingsOpen ? 'bg-[#221a36] text-white' : 'text-[#938BA7] hover:text-white hover:bg-[#1C162E]'}
                `}
                title="Quick Prompt Settings"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>

              {/* Quick Settings Dropdown */}
              {isQuickSettingsOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 rounded-xl bg-[#140F23] border border-[#2D2244] shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-semibold text-[#736A87] uppercase tracking-wider mb-2 px-1">
                    Response Tone
                  </div>
                  <div className="space-y-1">
                    {(['balanced', 'creative', 'precise'] as const).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => {
                          setPromptTone(tone);
                          setIsQuickSettingsOpen(false);
                          onShowToast('Tone Updated', `Response style set to ${tone}`, 'info');
                        }}
                        className={`
                          w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs capitalize transition-colors
                          ${promptTone === tone ? 'bg-[#241A3B] text-white font-medium' : 'text-[#9C92B0] hover:text-white hover:bg-[#1B152B]'}
                        `}
                      >
                        <span>{tone}</span>
                        {promptTone === tone && <Check className="w-3 h-3 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-[#231A35] my-2" />
                  <button
                    onClick={() => {
                      setIsQuickSettingsOpen(false);
                      onOpenSettingsModal();
                    }}
                    className="w-full text-left px-2.5 py-1 text-[11px] text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    All Model Parameters →
                  </button>
                </div>
              )}
            </div>

            {/* Options button */}
            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                  ${isOptionsOpen ? 'bg-[#221a36] text-white' : 'text-[#938BA7] hover:text-white hover:bg-[#1C162E]'}
                `}
                title="Model Capabilities & Tools"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Options</span>
              </button>

              {/* Options Popover */}
              {isOptionsOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-64 rounded-xl bg-[#140F23] border border-[#2D2244] shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-semibold text-[#736A87] uppercase tracking-wider mb-2 px-1">
                    AI Capabilities
                  </div>
                  <div className="space-y-1.5">
                    {/* Web Search Toggle */}
                    <button
                      onClick={() =>
                        onChangeFeatureOptions({
                          ...featureOptions,
                          webSearch: !featureOptions.webSearch
                        })
                      }
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left hover:bg-[#1A142B] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-white">Web Browsing</span>
                      </div>
                      <div
                        className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                          featureOptions.webSearch ? 'bg-purple-600' : 'bg-[#281F38]'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            featureOptions.webSearch ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>

                    {/* Code Interpreter */}
                    <button
                      onClick={() =>
                        onChangeFeatureOptions({
                          ...featureOptions,
                          codeInterpreter: !featureOptions.codeInterpreter
                        })
                      }
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left hover:bg-[#1A142B] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Code className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-white">Code Interpreter</span>
                      </div>
                      <div
                        className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                          featureOptions.codeInterpreter ? 'bg-purple-600' : 'bg-[#281F38]'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            featureOptions.codeInterpreter ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>

                    {/* Deep Reasoning */}
                    <button
                      onClick={() =>
                        onChangeFeatureOptions({
                          ...featureOptions,
                          deepReasoning: !featureOptions.deepReasoning
                        })
                      }
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left hover:bg-[#1A142B] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-white">Deep Reasoning</span>
                      </div>
                      <div
                        className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                          featureOptions.deepReasoning ? 'bg-purple-600' : 'bg-[#281F38]'
                        }`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full bg-white transition-transform ${
                            featureOptions.deepReasoning ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons: Voice and Send */}
          <div className="flex items-center gap-2">
            {/* Voice Dictation Button */}
            <button
              onClick={handleToggleVoice}
              className={`
                w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer
                ${
                  isListening
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : 'bg-[#1C152E] hover:bg-[#281F3E] text-[#938BA7] hover:text-white'
                }
              `}
              title={isListening ? 'Stop recording voice' : 'Dictate message with voice'}
              aria-label="Voice input"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            {/* Send Button */}
            <button
              onClick={onSubmit}
              disabled={(!prompt.trim() && !attachedFile) || isLoading}
              className={`
                w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md
                ${
                  (prompt.trim() || attachedFile) && !isLoading
                    ? 'bg-[#9333EA] hover:bg-[#A855F7] text-white shadow-[0_0_12px_rgba(147,51,234,0.5)] active:scale-90'
                    : 'bg-[#211933] text-[#69617A] cursor-not-allowed opacity-60'
                }
              `}
              title="Send message (Enter)"
              aria-label="Send prompt"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowUp className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
