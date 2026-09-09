import React, { useState } from 'react';
import { X, FolderPlus, Folder, Image, Presentation, Code2, Sparkles } from 'lucide-react';
import { WorkspaceFolder } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: WorkspaceFolder) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info') => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  onShowToast,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'folder' | 'image' | 'presentation' | 'code' | 'riset'>('folder');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: WorkspaceFolder = {
      id: `ws-${Date.now()}`,
      name: name.trim(),
      iconType: category,
      itemCount: 0,
      description: description.trim() || 'Custom project workspace'
    };

    onCreateProject(newProject);
    onShowToast('Project Created', `Workspace "${newProject.name}" is now ready`, 'success');
    setName('');
    setDescription('');
    onClose();
  };

  const categories = [
    { id: 'folder', label: 'General', icon: Folder },
    { id: 'image', label: 'Image Design', icon: Image },
    { id: 'presentation', label: 'Presentation', icon: Presentation },
    { id: 'code', label: 'Dev / Code', icon: Code2 },
    { id: 'riset', label: 'Research (Riset)', icon: Sparkles }
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-[#130E20] border border-[#2F2348] shadow-2xl p-5 text-white animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#221838]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Create New Workspace</h3>
              <p className="text-[11px] text-[#867D9C]">Group related prompts, assets, and generations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7C7391] hover:text-white hover:bg-[#1E1730] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#D1CAE3] mb-1.5">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mobile App Redesign, Quantum Research"
              className="w-full px-3 py-2 rounded-xl bg-[#1B142B] border border-[#2D2244] text-xs text-white placeholder-[#706785] focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D1CAE3] mb-1.5">
              Workspace Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`
                      flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all
                      ${
                        isSelected
                          ? 'bg-[#291C43] border-purple-500/60 text-white'
                          : 'bg-[#181226] border-[#291E3E] text-[#938BA7] hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-purple-300' : 'text-[#7B7291]'}`} />
                    <span className="text-[11px] font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#D1CAE3] mb-1.5">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this workspace's purpose"
              className="w-full px-3 py-2 rounded-xl bg-[#1B142B] border border-[#2D2244] text-xs text-white placeholder-[#706785] focus:border-purple-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#221838]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#A59DBA] hover:text-white hover:bg-[#1C152D] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white shadow-md active:scale-95 transition-all"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
