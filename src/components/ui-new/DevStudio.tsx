import { useState, useRef, useEffect } from 'react';
import { Code2, ArrowLeft, Play, Copy, Check, RefreshCw, Terminal } from 'lucide-react';

interface DevStudioProps {
  onBack: () => void;
}

const INITIAL_SNIPPETS: Record<string, string> = {
  typescript: `/**
 * Async Debounced Task with AbortController
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  delayMs: number = 300
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timer: NodeJS.Timeout | null = null;
  let abortController: AbortController | null = null;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    if (timer) clearTimeout(timer);
    if (abortController) abortController.abort();

    abortController = new AbortController();
    const signal = abortController.signal;

    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
          const result = await fn(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delayMs);
    });
  };
}`,
  react: `import React, { useState, useEffect } from 'react';

export const AnimatedCounter: React.FC<{ title: string; value: number }> = ({ title, value }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const step = Math.ceil(value / 30);
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + step >= value ? value : prev + step));
    }, 20);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className="p-4 rounded-2xl bg-[#151024] border border-[#2B1F45] text-white">
      <span className="text-xs text-purple-300 font-mono">{title}</span>
      <div className="text-2xl font-bold mt-1 tracking-tight">{current.toLocaleString()}</div>
    </div>
  );
};`,
  python: `import asyncio
from typing import AsyncGenerator

async def stream_agent_reasoning(task: str) -> AsyncGenerator[str, None]:
    """Generates continuous reasoning tokens for complex query execution."""
    stages = [
        "Synthesizing knowledge graph...",
        "Validating heuristic constraints...",
        "Executing sandboxed runtime test...",
        "Convergence achieved with 99.8% confidence."
    ]
    for stage in stages:
        await asyncio.sleep(0.35)
        yield f"[{task}] -> {stage}"`,
  sql: `-- Distributed workspace query with composite indexing
SELECT
    w.id AS workspace_id,
    w.name,
    COUNT(m.id) AS total_messages,
    MAX(m.created_at) AS last_active
FROM workspaces w
LEFT JOIN chat_messages m ON m.workspace_id = w.id
WHERE w.archived = FALSE
GROUP BY w.id, w.name
ORDER BY last_active DESC NULLS LAST
LIMIT 20;`
};

const TABS = ['typescript', 'react', 'python', 'sql'] as const;

export function DevStudio({ onBack }: DevStudioProps) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('typescript');
  const [snippets, setSnippets] = useState(INITIAL_SNIPPETS);
  const [copied, setCopied] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<string | null>(null);
  const [modified, setModified] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentCode = snippets[activeTab];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentCode]);

  const handleCodeChange = (value: string) => {
    setSnippets(prev => ({ ...prev, [activeTab]: value }));
    setModified(true);
  };

  const handleTabChange = (tab: typeof TABS[number]) => {
    setActiveTab(tab);
    setConsoleOutput(null);
    setModified(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setConsoleOutput('⚡ Code execution coming soon — edit your code and copy it to use in chat.');
    setTimeout(() => setConsoleOutput(null), 3000);
  };

  const handleReset = () => {
    setSnippets(prev => ({ ...prev, [activeTab]: INITIAL_SNIPPETS[activeTab] }));
    setModified(false);
    showToast('Snippet reset to default');
  };

  const showToast = (msg: string) => {
    setConsoleOutput(`ℹ ${msg}`);
    setTimeout(() => setConsoleOutput(null), 2000);
  };

  const lineCount = currentCode.split('\n').length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Drenzo Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-purple-400" /><span>Dev Studio</span>
          {modified && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 ml-1" title="Modified" />}
        </span>
      </div>

      <div className="rounded-3xl bg-[#0F0B18] border border-[#2A1F42] overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#161024] border-b border-[#241A38]">
          <div className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => handleTabChange(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all ${activeTab === tab ? 'bg-[#291C43] text-purple-200 border border-purple-500/40 font-semibold' : 'text-[#877E9E] hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {modified && (
              <button onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#221838] hover:bg-[#2F214C] border border-[#352752] text-xs font-medium text-[#877E9E] hover:text-white transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
            <button onClick={handleRun}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-semibold text-emerald-300 transition-colors shadow-sm">
              <Play className="w-3.5 h-3.5" />
              <span>Run</span>
            </button>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#221838] hover:bg-[#2F214C] border border-[#352752] text-xs font-medium text-white transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="flex bg-[#0A0712] overflow-x-auto">
          <div className="flex flex-col items-end pt-4 pb-4 pl-4 pr-2 select-none shrink-0">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="text-[11px] font-mono text-[#3a3252] leading-relaxed text-right min-w-[2ch]">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={currentCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
            className="flex-1 p-4 bg-transparent text-xs font-mono text-[#D8D0EA] leading-relaxed resize-none outline-none border-none min-h-[300px] w-full"
            style={{ tabSize: 2 }}
          />
        </div>

        {consoleOutput && (
          <div className="p-3.5 bg-[#0F0A1C] border-t border-[#261B3B] font-mono text-xs text-emerald-300 flex items-start gap-2.5">
            <Terminal className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <pre className="whitespace-pre-wrap">{consoleOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
