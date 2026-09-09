import { useState } from 'react';
import { Archive, Search, Trash2, RotateCcw, ArrowLeft } from 'lucide-react';

interface ArchivedViewProps {
  onBack: () => void;
}

const SAMPLE_ARCHIVES = [
  { id: '1', title: 'API Rate Limiting Strategy', model: 'deepseek-v4', date: '2 days ago', messageCount: 12, preview: 'Discussed token bucket vs sliding window approaches for rate limiting...' },
  { id: '2', title: 'React Component Patterns', model: 'mimo-v2.5', date: '5 days ago', messageCount: 8, preview: 'Compound components vs render props for flexible UI APIs...' },
  { id: '3', title: 'Database Schema Design', model: 'deepseek-v4', date: '1 week ago', messageCount: 15, preview: 'Normalized vs denormalized schemas for real-time chat applications...' },
  { id: '4', title: 'Deployment Pipeline Review', model: 'mimo-v2.5', date: '2 weeks ago', messageCount: 6, preview: 'CI/CD best practices for Vercel + Supabase stack...' },
];

export function ArchivedView({ onBack }: ArchivedViewProps) {
  const [archives, setArchives] = useState(SAMPLE_ARCHIVES);
  const [search, setSearch] = useState('');

  const filtered = archives.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.preview.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setArchives(archives.filter(a => a.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Drenzo Hub</span>
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#8A81A1] flex items-center gap-1.5">
          <Archive className="w-3.5 h-3.5 text-purple-400" /><span>Archived Sessions</span>
        </span>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-[#7A718F] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search archived conversations..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#130E20] border border-[#2A1E3E] text-xs text-white placeholder-[#716885] focus:border-purple-500 outline-none" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs text-[#7B7291]">No archived sessions match your search.</div>
        ) : filtered.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-[#130E20] border border-[#271D3A] hover:border-[#4B376E] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 font-medium">{item.model}</span>
              </div>
              <p className="text-[11px] text-[#847C9A] line-clamp-1">{item.preview}</p>
              <div className="flex items-center gap-3 mt-2 text-[10px] text-[#69607D]">
                <span>{item.date}</span><span>•</span><span>{item.messageCount} messages</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#231A38] hover:bg-[#31244E] text-purple-300 hover:text-white text-xs font-medium transition-colors" title="Restore">
                <RotateCcw className="w-3 h-3" /><span>Restore</span>
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 rounded-xl text-[#756C8A] hover:text-red-400 hover:bg-red-950/30 transition-colors" title="Delete permanently">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
