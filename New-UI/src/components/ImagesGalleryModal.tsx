import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, Download, Sparkles } from 'lucide-react';

interface ImagesGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImagesGalleryModal: React.FC<ImagesGalleryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sampleImages = [
    {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
      title: 'Cosmic Fluid Gradient Art',
      prompt: 'A futuristic cosmic dark interface background with glowing 3D spheres'
    },
    {
      id: 'img2',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=600',
      title: '3D Geometry Abstraction',
      prompt: 'Minimalist glassmorphism 3D geometric composition'
    },
    {
      id: 'img3',
      url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600',
      title: 'Neon Cyber Studio Concept',
      prompt: 'Electric blue obsidian dark studio wallpaper'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl rounded-2xl bg-[#121622] border border-white/15 shadow-2xl overflow-hidden p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white">AI Generated Images Gallery</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sampleImages.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-blue-500/50 transition-all"
              >
                <img src={img.url} alt={img.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3 bg-[#0e121a]">
                  <p className="text-xs font-semibold text-white truncate">{img.title}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{img.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
