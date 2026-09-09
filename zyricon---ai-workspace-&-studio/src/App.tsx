import React, { useState, useEffect } from 'react';
import {
  ViewMode,
  ModelOption,
  ChatMessage,
  ConfigState,
  FeatureOptions,
  AttachedFile,
  WorkspaceFolder,
  ArchiveItem,
  ToastInfo
} from './types';
import { AVAILABLE_MODELS, INITIAL_WORKSPACES } from './data/models';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { EmptyState } from './components/EmptyState';
import { PromptComposer } from './components/PromptComposer';
import { FeatureCards } from './components/FeatureCards';
import { ChatStream } from './components/ChatStream';
import { ImageStudio } from './components/ImageStudio';
import { PresentationStudio } from './components/PresentationStudio';
import { DevStudio } from './components/DevStudio';
import { ArchivedView } from './components/ArchivedView';
import { LibraryView } from './components/LibraryView';
import { WorkspaceView } from './components/WorkspaceView';
import { ConfigurationModal } from './components/ConfigurationModal';
import { ExportModal } from './components/ExportModal';
import { UpgradeModal } from './components/UpgradeModal';
import { NewProjectModal } from './components/NewProjectModal';
import { SettingsModal } from './components/SettingsModal';
import { Toast } from './components/Toast';

export default function App() {
  // Navigation & View States
  const [currentView, setCurrentView] = useState<ViewMode>('chat');
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceFolder | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFramed, setIsFramed] = useState(true);

  // Model & AI Parameters State
  const [selectedModel, setSelectedModel] = useState<ModelOption>(() => {
    const saved = localStorage.getItem('zyricon_model');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = AVAILABLE_MODELS.find(m => m.id === parsed.id);
        if (found) return found;
      } catch (e) {
        // fallback
      }
    }
    return AVAILABLE_MODELS[0]; // ChatGPT v4.0 default
  });

  const [config, setConfig] = useState<ConfigState>(() => {
    const saved = localStorage.getItem('zyricon_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      temperature: 0.7,
      maxTokens: 2048,
      systemPrompt: 'You are Zyricon, an ultra-intelligent, precise, and creative AI assistant.',
      topP: 0.95,
      responseFormat: 'markdown',
      streamResponse: true
    };
  });

  const [featureOptions, setFeatureOptions] = useState<FeatureOptions>({
    webSearch: true,
    codeInterpreter: true,
    deepReasoning: false
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Workspaces list
  const [workspaces, setWorkspaces] = useState<WorkspaceFolder[]>(() => {
    const saved = localStorage.getItem('zyricon_workspaces');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_WORKSPACES;
  });

  // Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);

  // Modals state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Persist selections
  useEffect(() => {
    localStorage.setItem('zyricon_model', JSON.stringify(selectedModel));
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('zyricon_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('zyricon_workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + N for New Chat
      if (e.altKey && (e.key === 'n' || e.key === 'N')) {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // New Chat handler
  const handleNewChat = () => {
    setMessages([]);
    setPrompt('');
    setAttachedFile(null);
    setCurrentView('chat');
    setActiveWorkspace(null);
    showToast('New Chat Initialized', 'Started fresh conversation canvas', 'info');
  };

  // Workspace selection
  const handleSelectWorkspace = (ws: WorkspaceFolder) => {
    setActiveWorkspace(ws);
    setCurrentView('workspace');
  };

  // Feature Card selection
  const handleSelectFeature = (view: ViewMode, promptHint?: string) => {
    setCurrentView(view);
    if (promptHint) {
      setPrompt(promptHint);
    }
  };

  // Submit Prompt Handler
  const handleSubmitPrompt = () => {
    if (!prompt.trim() && !attachedFile) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt.trim() || `[Attached: ${attachedFile?.name}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: attachedFile || undefined
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setAttachedFile(null);
    setIsLoading(true);
    setCurrentView('chat');

    // Synthesize assistant response
    setTimeout(() => {
      const userText = userMessage.content.toLowerCase();
      let responseContent = '';
      let codeSnippet: { language: string; code: string } | undefined = undefined;

      if (userText.includes('code') || userText.includes('typescript') || userText.includes('function') || userText.includes('react')) {
        responseContent = `Here is a production-grade implementation tailored to your architecture with full type safety and modular error handling:`;
        codeSnippet = {
          language: 'typescript',
          code: `import { useState, useCallback, useTransition } from 'react';

export function useZyriconTask<T, R>(executeTask: (payload: T) => Promise<R>) {
  const [result, setResult] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const run = useCallback(async (payload: T) => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await executeTask(payload);
        setResult(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Task execution failed'));
      }
    });
  }, [executeTask]);

  return { run, result, error, isPending };
}`
        };
      } else if (userText.includes('image') || userText.includes('render') || userText.includes('visual')) {
        responseContent = `I have framed a high-fidelity visual generation pipeline for: "${userMessage.content}".\n\n- **Renderer:** Imagen 3 Neural Engine / Midjourney v6\n- **Volumetric Lighting:** Specular violet ambient aura with optical scattering\n- **Aesthetic Direction:** Hyper-detailed cinematic 8K octane render with depth-of-field blur\n\nYou can inspect this in the Image Generator studio to adjust style weights, aspect ratios, and generate seed variations.`;
      } else if (userText.includes('plan') || userText.includes('roadmap') || userText.includes('step')) {
        responseContent = `Here is a structured, execution-ready milestone roadmap based on your request:\n\n1. **Phase 1: Foundation & Boundary Isolation (Days 1–5)**\n   • Define schema definitions, security invariants, and state models.\n   • Establish deterministic mock layers with rapid hot-reload feedback.\n\n2. **Phase 2: Intelligent Core Orchestration (Days 6–12)**\n   • Integrate model endpoints with streaming fallbacks and token budgeting.\n   • Implement context caching and tool execution loops.\n\n3. **Phase 3: Production Hardening & Verification (Days 13–18)**\n   • End-to-end regression suites, latency telemetry, and WCAG AA contrast auditing.\n   • Global edge deployment and rate-limit guardrails.`;
      } else if (userText.includes('brainstorm') || userText.includes('idea')) {
        responseContent = `Here are 4 high-conviction creative concepts to explore:\n\n• **Context-Aware Semantic Workspaces**: Workspaces that automatically index linked repos, PDFs, and Figma files into a shared local memory vector.\n• **Zero-Latency Neural Canvas**: Real-time collaborative design canvas where prompts instantly update vector shapes and CSS variables.\n• **Autonomous Verification Micro-Agents**: Background agents that continuously test and stress-test code outputs before presenting them.\n• **Adaptive Voice Synthesis**: Voice dictation that automatically formats verbal brainstorming into formatted markdown tables and tickets.`;
      } else {
        responseContent = `I have analyzed your prompt with ${selectedModel.name}.\n\nZyricon is primed to assist you with deep reasoning, visual design, presentation drafting, or production code generation. Let me know if you would like me to expand on any particular component or generate actionable files for your workspace!`;
      }

      const assistantMessage: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeSnippet
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);

      if (soundEnabled) {
        // subtle audio ping
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } catch (e) {
          // ignore
        }
      }
    }, 1200);
  };

  const handleRegenerate = () => {
    if (messages.length === 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant') {
          return [
            ...prev.slice(0, prev.length - 1),
            {
              ...last,
              content: `Here is an alternative refined synthesis from ${selectedModel.name} with reinforced precision:\n\n${last.content}\n\n*Optimized with temperature ${config.temperature} and ${config.responseFormat} structure.*`
            }
          ];
        }
        return prev;
      });
      setIsLoading(false);
      showToast('Response Regenerated', `Updated using ${selectedModel.name}`, 'info');
    }, 1000);
  };

  // Restore archived chat
  const handleRestoreArchive = (item: ArchiveItem) => {
    setMessages([
      {
        id: `msg-restored-user-${Date.now()}`,
        role: 'user',
        content: `Restored Archive: ${item.title}`,
        timestamp: item.date
      },
      {
        id: `msg-restored-asst-${Date.now()}`,
        role: 'assistant',
        content: `Restored conversation session from archive:\n\n**${item.title}**\n\n${item.preview}\n\n*Original engine: ${item.model} with ${item.messageCount} saved turns.*`,
        timestamp: 'Just now'
      }
    ]);
    setCurrentView('chat');
    showToast('Session Restored', item.title, 'success');
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-all duration-300 ${
        isFramed
          ? 'bg-[#B497BD] p-2 sm:p-4 md:p-6 lg:p-8'
          : 'bg-[#0B0912] p-0'
      }`}
    >
      {/* Main Application Container matching reference image */}
      <div
        className={`
          relative flex overflow-hidden transition-all duration-300
          ${
            isFramed
              ? 'w-full max-w-[1240px] h-[92vh] max-h-[860px] min-h-[640px] rounded-3xl md:rounded-[28px] border border-[#271F38] shadow-[0_30px_90px_rgba(0,0,0,0.65)]'
              : 'w-full h-screen rounded-none border-none shadow-none'
          }
          bg-[#0B0912] text-white
        `}
      >
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            setActiveWorkspace(null);
          }}
          workspaces={workspaces}
          activeWorkspaceId={activeWorkspace?.id || null}
          onSelectWorkspace={handleSelectWorkspace}
          onNewChat={handleNewChat}
          onNewProject={() => setIsNewProjectOpen(true)}
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Right Main Content Area */}
        <main
          className="relative flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-[#0A0812]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 28%, rgba(130, 70, 205, 0.22) 0%, rgba(68, 20, 115, 0.12) 32%, rgba(10, 8, 18, 1) 72%)'
          }}
        >
          {/* Top Bar */}
          <TopBar
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            onOpenConfiguration={() => setIsConfigOpen(true)}
            onOpenExport={() => setIsExportOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isFramed={isFramed}
            onToggleFramed={() => setIsFramed(!isFramed)}
          />

          {/* Dynamic Center View Area */}
          <div className="flex-1 overflow-y-auto flex flex-col justify-between relative z-10">
            {currentView === 'chat' && messages.length === 0 && (
              <div className="flex flex-col flex-1 justify-between py-2 sm:py-4">
                {/* Centered Empty State with 3D glowing orb & headline */}
                <EmptyState
                  onSelectPrompt={(p) => setPrompt(p)}
                  onOrbClick={() => showToast('Zyricon Neural Core Active', 'Synthesizing creative prompts and multimodal workflows', 'info')}
                />

                {/* Prompt Composer in center */}
                <PromptComposer
                  prompt={prompt}
                  onChangePrompt={setPrompt}
                  onSubmit={handleSubmitPrompt}
                  isLoading={isLoading}
                  attachedFile={attachedFile}
                  onAttachFile={setAttachedFile}
                  featureOptions={featureOptions}
                  onChangeFeatureOptions={setFeatureOptions}
                  onShowToast={showToast}
                  onOpenSettingsModal={() => setIsConfigOpen(true)}
                />

                {/* Bottom 3 Feature Cards */}
                <FeatureCards
                  onSelectFeature={(view, promptHint) => {
                    handleSelectFeature(view, promptHint);
                  }}
                />
              </div>
            )}

            {currentView === 'chat' && messages.length > 0 && (
              <div className="flex flex-col flex-1 justify-between py-2">
                <ChatStream
                  messages={messages}
                  selectedModel={selectedModel}
                  isLoading={isLoading}
                  onRegenerate={handleRegenerate}
                  onShowToast={showToast}
                />

                <div className="py-2">
                  <PromptComposer
                    prompt={prompt}
                    onChangePrompt={setPrompt}
                    onSubmit={handleSubmitPrompt}
                    isLoading={isLoading}
                    attachedFile={attachedFile}
                    onAttachFile={setAttachedFile}
                    featureOptions={featureOptions}
                    onChangeFeatureOptions={setFeatureOptions}
                    onShowToast={showToast}
                    onOpenSettingsModal={() => setIsConfigOpen(true)}
                  />
                </div>
              </div>
            )}

            {currentView === 'image-generator' && (
              <ImageStudio
                onBack={() => setCurrentView('chat')}
                onShowToast={showToast}
                initialPrompt={prompt}
              />
            )}

            {currentView === 'ai-presentation' && (
              <PresentationStudio
                onBack={() => setCurrentView('chat')}
                onShowToast={showToast}
                initialTopic={prompt}
              />
            )}

            {currentView === 'dev-assistant' && (
              <DevStudio
                onBack={() => setCurrentView('chat')}
                onShowToast={showToast}
                initialPrompt={prompt}
              />
            )}

            {currentView === 'archived' && (
              <ArchivedView
                onBack={() => setCurrentView('chat')}
                onRestoreChat={handleRestoreArchive}
                onShowToast={showToast}
              />
            )}

            {currentView === 'library' && (
              <LibraryView
                onBack={() => setCurrentView('chat')}
                onUseTemplate={(t) => {
                  setPrompt(t);
                  setCurrentView('chat');
                  showToast('Template Applied', 'Prompt populated in composer', 'info');
                }}
                onShowToast={showToast}
              />
            )}

            {currentView === 'workspace' && activeWorkspace && (
              <WorkspaceView
                workspace={activeWorkspace}
                onBack={() => {
                  setCurrentView('chat');
                  setActiveWorkspace(null);
                }}
                onSelectPrompt={(p) => setPrompt(p)}
                onShowToast={showToast}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals & Slide-overs */}
      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        onShowToast={showToast}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        messages={messages}
        selectedModel={selectedModel}
        onShowToast={showToast}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onShowToast={showToast}
      />

      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={(newWs) => {
          setWorkspaces([...workspaces, newWs]);
          setActiveWorkspace(newWs);
          setCurrentView('workspace');
        }}
        onShowToast={showToast}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onShowToast={showToast}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
