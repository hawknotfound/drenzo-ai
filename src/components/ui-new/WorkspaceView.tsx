import { useState } from 'react';
import { Folder, ArrowLeft, Plus, FileText, Download, Trash2 } from 'lucide-react';

interface WorkspaceViewProps {
  onBack: () => void;
}

const SAMPLE_FILES = [
  { id: '1', name: 'Drenzo AI Master Plan.md', size: '24 KB', date: 'Today at 2:30 PM', type: 'doc' },
  { id: '2', name: 'UI Redesign Spec.json', size: '142 KB', date: 'Yesterday', type: 'code' },
  { id: '3', name: 'Brand Assets.png', size: '4.2 MB', date: '3 days ago', type: 'image' },
  { id: '4', name: 'API Integration Notes.txt', size: '8 KB', date: '1 week ago', type: 'doc' },
];

export function WorkspaceView({ onBack }: WorkspaceViewProps) {
  const [files, setFiles] = useState(SAMPLE_FILES);

  const handleAdd = () => {
    const newFile = {
      id: String(Date.now()),
      name: `New Note ${files.length + 1}.txt`,
      size: '2 KB',
      date: 'Just now',
      type: 'doc' as const,
    };
    setFiles([newFile, ...files]);
  };

  const handleDelete = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171126] hover:bg-[#221938] border border-[#2B2042] text-xs font-medium text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /><span>Back to Drenzo Hub</span>
        </button>
        <button onClick={handleAdd} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-xs font-semibold text-white shadow-md transition-all">
          <Plus className="w-3.5 h-3.5" /><span>Add Asset</span>
        </button>
      </div>

      <div className="p-5 rounded-3xl bg-[#130E20] border border-[#2B2045] flex items-start gap-4 shadow-xl">
        <div className="w-10 h-10 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300">
          <Folder className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Drenzo Workspace</h2>
          <p className="text-xs text-[#958CAE] mt-1">Shared files, system prompts, and creative outputs.</p>
          <div className="flex items-center gap-3 mt-3 text-[11px] text-[#786F8F]">
            <span>{files.length} Files</span><span>•</span><span>Active Sync</span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <h4 className="text-xs font-semibold text-white px-1">Workspace Assets</h4>
        {files.map((item) => (
          <div key={item.id} className="p-3.5 rounded-2xl bg-[#130E20] border border-[#251C38] hover:border-[#473468] transition-all flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#1B142B] border border-[#2D2146] flex items-center justify-center text-purple-300">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-white truncate">{item.name}</div>
                <div className="text-[10px] text-[#7D7494]">{item.size} • {item.date}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors" title="Download">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-[#7C7391] hover:text-red-400 hover:bg-red-950/30 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
