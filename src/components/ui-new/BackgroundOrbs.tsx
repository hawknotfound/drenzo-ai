export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#09090f]">
      {/* Base purple dark tint gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 30% 20%, rgba(88, 28, 135, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse 70% 50% at 70% 80%, rgba(49, 46, 129, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(76, 29, 149, 0.1) 0%, transparent 60%)
          `,
        }}
      />

      {/* Animated ambient orbs — purple/violet/fuchsia */}
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-50 blur-3xl animate-drift"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/4 -right-40 w-[700px] h-[700px] rounded-full opacity-40 blur-3xl animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[550px] h-[550px] rounded-full opacity-40 blur-3xl animate-drift"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)',
          animationDelay: '-10s',
        }}
      />
      <div
        className="absolute top-2/3 right-1/3 w-[400px] h-[400px] rounded-full opacity-30 blur-3xl animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(217, 70, 239, 0.3) 0%, transparent 70%)',
          animationDelay: '-5s',
        }}
      />

      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(9,9,15,0.6)_85%)]" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
          backgroundSize: '56px 56px'
        }}
      />

      {/* Film grain noise */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
