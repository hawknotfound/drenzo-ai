import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { HeroState } from './components/HeroState';
import { ChatTimeline } from './components/ChatTimeline';
import { SearchModal } from './components/SearchModal';
import { SettingsModal } from './components/SettingsModal';
import { FilesModal } from './components/FilesModal';
import { AILibraryModal } from './components/AILibraryModal';
import { ImagesGalleryModal } from './components/ImagesGalleryModal';
import { AI_MODELS, INITIAL_CONVERSATIONS } from './data/initialData';
import { AIModel, CapabilityId, Conversation, Message } from './types';

export default function App() {
  // App state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('history');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Prompt input and capabilities
  const [inputText, setInputText] = useState('');
  const [selectedCapabilities, setSelectedCapabilities] = useState<CapabilityId[]>(['web-search']);
  const [isStreaming, setIsStreaming] = useState(false);

  // Modal open states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isImagesOpen, setIsImagesOpen] = useState(false);

  // Get current active conversation
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Capability toggle handler
  const handleToggleCapability = (capId: CapabilityId) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capId) ? prev.filter((id) => id !== capId) : [...prev, capId]
    );
  };

  // Start new chat (reset to HeroState)
  const handleNewChat = () => {
    setActiveConversationId(null);
    setInputText('');
  };

  // Submit prompt from Hero or prompt chip
  const handleSendMessage = (textToSend?: string) => {
    const promptText = (textToSend || inputText).trim();
    if (!promptText || isStreaming) return;

    const userMessage: Message = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let targetConvId = activeConversationId;

    if (!targetConvId) {
      // Create new conversation
      const newConv: Conversation = {
        id: `conv-${Date.now()}`,
        title: promptText.length > 32 ? `${promptText.substring(0, 32)}...` : promptText,
        lastUpdated: 'Just now',
        messages: [userMessage],
        capabilityFlags: [...selectedCapabilities]
      };

      setConversations([newConv, ...conversations]);
      setActiveConversationId(newConv.id);
      targetConvId = newConv.id;
    } else {
      // Append user message to existing conversation
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? { ...c, messages: [...c.messages, userMessage], lastUpdated: 'Just now' }
            : c
        )
      );
    }

    // Reset input
    setInputText('');

    // Simulate AI Streaming Response
    simulateAiResponse(targetConvId, promptText);
  };

  // Simulate AI Streaming Response with realistic code generation
  const simulateAiResponse = (convId: string, query: string) => {
    setIsStreaming(true);

    const isCodeQuery = query.toLowerCase().includes('code') || query.toLowerCase().includes('react') || query.toLowerCase().includes('website') || query.toLowerCase().includes('debug');
    const isDeepThinking = selectedCapabilities.includes('deep-thinking');

    setTimeout(() => {
      let aiText = `I analyzed your request: "${query}". Here is the recommended architecture and solution tailored with ${selectedModel.name}:`;
      let codeSnippets;

      if (isCodeQuery) {
        aiText += `\n\nI have structured a high-performance React component with Framer Motion spring physics, tailored negative spacing, and full TypeScript type definitions:`;
        codeSnippets = [
          {
            title: 'DrenzoStudioCard.tsx',
            language: 'tsx',
            code: `import React from 'react';
import { motion } from 'motion/react';

export function DrenzoStudioCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl hover:border-blue-500/50 transition-colors"
    >
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-zinc-400 mt-1">{subtitle}</p>
    </motion.div>
  );
}`
          }
        ];
      } else {
        aiText += `\n\n1. **High Efficiency Execution**: Powered by ${selectedModel.name} for sub-millisecond turnarounds.\n2. **Context Synthesis**: Multi-turn history preserved with active parameters.\n3. **Visual Precision**: Optimized for modern dark luxury interfaces and 60fps animations.`;
      }

      const aiMessage: Message = {
        id: `m-ai-${Date.now()}`,
        sender: 'ai',
        modelUsed: selectedModel.name,
        thoughtProcess: isDeepThinking
          ? 'Mapped mathematical corner radii, verified WCAG AA contrast ratios, optimized state update batching.'
          : undefined,
        text: aiText,
        codeSnippets,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: false
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: [...c.messages, aiMessage] } : c
        )
      );

      setIsStreaming(false);
    }, 1200);
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Dynamic Cosmic 3D Background */}
      <BackgroundOrbs />

      {/* Main Glass Workspace Container matching reference image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-[1400px] h-[92vh] rounded-[28px] bg-[#0c0f17]/85 border border-white/10 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Collapsible Left Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onNewChat={handleNewChat}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={(id) => {
            setActiveConversationId(id);
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenFiles={() => setIsFilesOpen(true)}
          onOpenImages={() => setIsImagesOpen(true)}
          onOpenLibrary={() => setIsLibraryOpen(true)}
        />

        {/* Right Main Content Panel */}
        <div className="flex flex-col flex-1 h-full min-w-0 bg-gradient-to-b from-transparent via-blue-950/5 to-transparent overflow-hidden">
          {/* Top Bar Navigation */}
          <TopBar
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Main Workspace Area (Hero vs Active Chat Timeline) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            <AnimatePresence mode="wait">
              {!activeConversation ? (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <HeroState
                    inputText={inputText}
                    setInputText={setInputText}
                    onSubmit={() => handleSendMessage()}
                    selectedCapabilities={selectedCapabilities}
                    onToggleCapability={handleToggleCapability}
                    onSelectPromptSuggestion={(prompt) => handleSendMessage(prompt)}
                    onAttachFileClick={() => setIsFilesOpen(true)}
                    isDeepThinkingActive={selectedCapabilities.includes('deep-thinking')}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full"
                >
                  <ChatTimeline
                    messages={activeConversation.messages}
                    selectedModel={selectedModel}
                    onSendMessage={(text) => handleSendMessage(text)}
                    onRegenerate={() => {
                      if (activeConversation.messages.length > 0) {
                        const lastUserMsg = [...activeConversation.messages].reverse().find((m) => m.sender === 'user');
                        if (lastUserMsg) {
                          simulateAiResponse(activeConversation.id, lastUserMsg.text);
                        }
                      }
                    }}
                    onNewChat={handleNewChat}
                    isStreaming={isStreaming}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Interactive Sub Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        conversations={conversations}
        onSelectConversation={(id) => setActiveConversationId(id)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <FilesModal
        isOpen={isFilesOpen}
        onClose={() => setIsFilesOpen(false)}
      />

      <AILibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTemplate={(prompt) => handleSendMessage(prompt)}
      />

      <ImagesGalleryModal
        isOpen={isImagesOpen}
        onClose={() => setIsImagesOpen(false)}
      />
    </div>
  );
}
