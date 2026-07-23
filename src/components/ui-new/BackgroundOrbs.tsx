import { motion } from 'framer-motion';

export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#090b10]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/25 via-[#0b0f19] to-[#06080d]" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <motion.div
        animate={{
          x: [0, 25, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden sm:block absolute top-[18%] left-[12%] w-72 h-72 rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-500/20 to-sky-400/10 blur-3xl shadow-[0_0_120px_rgba(59,130,246,0.25)]"
      />

      <motion.div
        animate={{
          x: [0, -35, 15, 0],
          y: [0, 35, -25, 0],
          scale: [1, 1.1, 0.92, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden sm:block absolute bottom-[10%] right-[8%] w-80 h-80 rounded-full bg-gradient-to-br from-blue-500/20 via-sky-600/15 to-purple-600/10 blur-3xl shadow-[0_0_140px_rgba(147,51,234,0.18)]"
      />

      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="hidden sm:block absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-blue-500/15 via-indigo-600/10 to-transparent blur-3xl"
      />

      <div className="hidden sm:block absolute top-[12%] right-[22%] w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_12px_#38bdf8] animate-ping opacity-75" />
      <div className="absolute bottom-[28%] left-[18%] w-2 h-2 rounded-full bg-blue-200 shadow-[0_0_14px_#60a5fa] animate-pulse opacity-50 sm:opacity-80" />
      <div className="hidden sm:block absolute top-[45%] left-[6%] w-1 h-1 rounded-full bg-indigo-300 shadow-[0_0_8px_#818cf8] animate-pulse opacity-60" />
      <div className="hidden sm:block absolute bottom-[15%] left-[45%] w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8] animate-ping opacity-50" />
    </div>
  );
}
