import { useState } from 'react';
import { Library, ArrowLeft, Search, Copy, ArrowUpRight, Check } from 'lucide-react';

interface LibraryViewProps {
  onBack: () => void;
  onUseTemplate?: (prompt: string) => void;
}

const CATEGORIES = ['All', 'Coding', 'Creative', 'Productivity', 'Research'];

const TEMPLATES = [
  { id: '1', category: 'Coding', title: 'Code Review Assistant', description: 'Thorough code review with security and performance analysis', prompt: 'Review this code for security vulnerabilities, performance issues, and best practices. Provide specific line-by-line feedback.', tags: ['review', 'security'] },
  { id: '2', category: 'Coding', title: 'API Designer', description: 'Design RESTful APIs with proper error handling and documentation', prompt: 'Design a RESTful API for this use case. Include endpoints, request/response schemas, error codes, and authentication.', tags: ['api', 'rest'] },
  { id: '3', category: 'Creative', title: 'Blog Post Writer', description: 'Engaging blog posts with strong hooks and clear structure', prompt: 'Write a 1500-word blog post on this topic. Use a compelling hook, clear subheadings, and actionable takeaways.', tags: ['writing', 'blog'] },
  { id: '4', category: 'Creative', title: 'Story Generator', description: 'Creative fiction with rich characters and vivid settings', prompt: 'Write a short story with this premise. Include vivid sensory details, distinct character voices, and an unexpected twist.', tags: ['fiction', 'creative'] },
  { id: '5', category: 'Productivity', title: 'Meeting Summary', description: 'Extract key decisions and action items from meeting notes', prompt: 'Summarize these meeting notes. Extract key decisions, action items with owners, and follow-up deadlines.', tags: ['meetings', 'summary'] },
  { id: '6', category: 'Research', title: 'Research Synthesizer', description: 'Synthesize multiple sources into structured analysis', prompt: 'Synthesize these research sources. Identify themes, contradictions, gaps, and actionable insights.', tags: ['research', 'analysis'] },
];

export function LibraryView({ onBack, onUseTemplate }: LibraryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter(t => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Drenzo Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Library className="w-3.5 h-3.5 text-purple-400" /><span>Prompt Library</span>
        </span>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-[#7A718F] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#130E20] border border-[#2A1E3E] text-xs text-white placeholder-[#716885] focus:border-purple-500 outline-none" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-[#8B5CF6] text-white shadow-md' : 'bg-[#150F22] border border-[#271E3A] text-[#8E85A3] hover:text-white'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-[#130E20] border border-[#271D3A] hover:border-[#4B376E] transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/20 text-purple-300">{item.category}</span>
                <div className="flex items-center gap-1">
                  {item.tags.map((tag) => (<span key={tag} className="text-[10px] text-[#6E6582]">#{tag}</span>))}
                </div>
              </div>
              <h4 className="text-xs font-semibold text-white group-hover:text-purple-200 transition-colors">{item.title}</h4>
              <p className="text-[11px] text-[#877E9C] mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
              <div className="mt-3 p-2 rounded-xl bg-[#0F0A18] border border-[#1F172E] text-[11px] font-mono text-[#A89EC0] line-clamp-2">"{item.prompt}"</div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#1E172E]">
              <button onClick={() => handleCopy(item.id, item.prompt)}
                className="flex items-center gap-1 text-[11px] text-[#867C9D] hover:text-white transition-colors">
                {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
              </button>
              <button onClick={() => onUseTemplate?.(item.prompt)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#231A38] hover:bg-[#8B5CF6] text-purple-200 hover:text-white text-xs font-medium transition-all shadow-sm">
                <span>Use Template</span><ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
