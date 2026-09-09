import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppIntroProps {
  onComplete: () => void;
}

export function AppIntro({ onComplete }: AppIntroProps) {
  const [stage, setStage] = useState<'orb' | 'explosion' | 'exit'>('orb');

  useEffect(() => {
    const t1 = setTimeout(() => setStage('explosion'), 2200);
    const t2 = setTimeout(() => setStage('exit'), 4200);
    const t3 = setTimeout(() => onComplete(), 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  const [particles] = useState(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
      duration: Math.random() * 3 + 2,
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={stage === 'exit' ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] bg-[#07050E] flex items-center justify-center overflow-hidden"
    >
      {/* Background Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-purple-400/40 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Ambient center cosmic glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence>
        {stage === 'orb' && (
          <motion.div
            key="orb-container"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.1, opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="relative flex items-center justify-center"
          >
            {/* The Central Orb */}
            <motion.div
              className="w-24 h-24 rounded-full shadow-[0_0_60px_20px_rgba(168,85,247,0.4),inset_0_0_20px_rgba(255,255,255,0.6)] z-10"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #f3e8ff 0%, #d8b4fe 20%, #9333ea 50%, #4c1d95 100%)',
              }}
              animate={{ scale: [1, 1.05, 1], filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Orbiting Rings */}
            <motion.div
              className="absolute w-44 h-44 border border-purple-400/60 rounded-full"
              style={{ rotateX: 65, rotateY: 20 }}
              animate={{ rotateZ: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-48 h-48 border border-purple-300/40 rounded-full"
              style={{ rotateX: 75, rotateY: -40 }}
              animate={{ rotateZ: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-52 h-52 border border-purple-200/20 rounded-full"
              style={{ rotateX: 55, rotateY: 60 }}
              animate={{ rotateZ: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {stage === 'explosion' && (
          <motion.div
            key="explosion-container"
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* White Screen Flash */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 bg-purple-400/30 mix-blend-overlay z-20"
            />

            {/* Expanding Shockwaves */}
            <motion.div
              initial={{ scale: 0, opacity: 1, borderWidth: '40px' }}
              animate={{ scale: 12, opacity: 0, borderWidth: '1px' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="absolute w-32 h-32 border-purple-500 rounded-full shadow-[0_0_100px_#a855f7]"
            />
            <motion.div
              initial={{ scale: 0, opacity: 1, borderWidth: '20px' }}
              animate={{ scale: 15, opacity: 0, borderWidth: '0px' }}
              transition={{ duration: 2, ease: 'easeOut', delay: 0.1 }}
              className="absolute w-32 h-32 border-purple-300 rounded-full"
            />

            {/* Tech UI Background Lines */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0, 1, 0], scale: 1 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg width="100%" height="100%" className="absolute inset-0 w-full h-full opacity-30 stroke-purple-400 fill-none" strokeWidth="1">
                <line x1="50%" y1="35%" x2="50%" y2="42%" />
                <line x1="50%" y1="58%" x2="50%" y2="65%" />
                <line x1="35%" y1="50%" x2="42%" y2="50%" />
                <line x1="58%" y1="50%" x2="65%" y2="50%" />
                <path d="M 20%,20% L 25%,20% M 20%,20% L 20%,25%" />
                <path d="M 80%,20% L 75%,20% M 80%,20% L 80%,25%" />
                <path d="M 20%,80% L 25%,80% M 20%,80% L 20%,75%" />
                <path d="M 80%,80% L 75%,80% M 80%,80% L 80%,75%" />
                <circle cx="50%" cy="50%" r="25%" strokeDasharray="2 6" opacity="0.5" />
              </svg>
            </motion.div>

            {/* Brand Logo Text */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)', letterSpacing: '2px' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', letterSpacing: '12px' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
              className="text-white text-5xl md:text-7xl font-bold z-30 ml-3"
              style={{ textShadow: '0 0 30px rgba(168,85,247,0.8)' }}
            >
              DRENZO
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
