import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, X, UploadCloud, Trash2, CheckCircle2 } from 'lucide-react';
import { AttachedFile } from '../types';
import { SAMPLE_FILES } from '../data/initialData';

interface FilesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FilesModal: React.FC<FilesModalProps> = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState<AttachedFile[]>(SAMPLE_FILES);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploaded = e.target.files[0];
      const newFile: AttachedFile = {
        id: `f-${Date.now()}`,
        name: uploaded.name,
        size: `${(uploaded.size / (1024 * 1024)).toFixed(1)} MB`,
        type: uploaded.name.endsWith('.pdf') ? 'pdf' : 'code',
        uploadedAt: 'Just now'
      };
      setFiles([newFile, ...files]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl rounded-2xl bg-[#121622] border border-white/15 shadow-2xl overflow-hidden p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">Knowledge & Document Vault</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all ${
              dragActive
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-white/15 bg-white/5 hover:border-white/30'
            }`}
          >
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-xs font-semibold text-white">Drag & drop files or browse</p>
            <p className="text-[11px] text-zinc-400 mt-1">Supports PDF, TXT, Code, Markdown, CSV up to 50MB</p>
          </div>

          {/* File list */}
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Attached Knowledge Context</p>
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-medium text-white truncate">{file.name}</span>
                    <span className="text-[10px] text-zinc-400">{file.size} • {file.uploadedAt}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
