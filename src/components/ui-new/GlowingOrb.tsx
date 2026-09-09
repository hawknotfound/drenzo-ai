import { useState } from 'react';

interface GlowingOrbProps {
  size?: number;
  onClick?: () => void;
}

export function GlowingOrb({ size = 68, onClick }: GlowingOrbProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 2000);
    if (onClick) onClick();
  };

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none group"
      style={{ width: size * 2.2, height: size * 2.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Interactive AI Orb"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
    >
      {/* Outer ambient cosmic halo */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-[2000ms] ease-out"
        style={{
          width: size * 1.8,
          height: size * 1.8,
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(147, 51, 234, 0.25) 45%, rgba(88, 28, 135, 0.05) 70%, transparent 85%)',
          filter: isHovered ? 'blur(28px)' : 'blur(22px)',
          transform: isHovered ? 'scale(1.2)' : isPulsing ? 'scale(1.35)' : 'scale(1)',
          opacity: isPulsing ? 1 : 0.85
        }}
      />

      {/* Secondary colored pulse ring on click */}
      {isPulsing && (
        <div
          className="absolute rounded-full border border-purple-400/60 pointer-events-none animate-ping"
          style={{ width: size, height: size }}
        />
      )}

      {/* Floating 3D Orb container */}
      <div
        className={`relative transition-transform duration-[1500ms] ease-out ${
          isHovered ? 'scale-105' : ''
        }`}
        style={{ width: size, height: size }}
      >
        {/* Core sphere with rich 3D shading */}
        <div
          className="w-full h-full rounded-full shadow-[0_10px_25px_rgba(88,28,135,0.6),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-8px_16px_rgba(10,5,20,0.85)] relative overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #e9d5ff 0%, #c084fc 20%, #9333ea 48%, #6b21a8 70%, #2e1065 95%)',
          }}
        >
          {/* Internal celestial swirls & cloud texture */}
          <div
            className="absolute inset-0 opacity-70 mix-blend-overlay animate-orb-swirl"
            style={{
              background: 'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.8) 0%, rgba(216,180,254,0.4) 30%, transparent 65%), conic-gradient(from 45deg at 50% 50%, #9333ea, #ec4899, #7e22ce, #c084fc, #9333ea)',
            }}
          />

          {/* Top-left specular crescent highlight */}
          <div
            className="absolute rounded-full"
            style={{
              top: '12%',
              left: '18%',
              width: '42%',
              height: '24%',
              background: 'radial-gradient(ellipse at 50% 30%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
              transform: 'rotate(-25deg)',
              filter: 'blur(0.8px)',
            }}
          />

          {/* Secondary subtle rim highlight on bottom edge */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              boxShadow: 'inset 0 -3px 8px rgba(192, 132, 252, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.7)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
