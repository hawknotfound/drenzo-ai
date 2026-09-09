export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#090b10]">
      {/* Cloudinary background image, subtle */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 sm:opacity-20"
        style={{ backgroundImage: `url(https://res.cloudinary.com/dcbagjtsy/image/upload/v1784818816/background_evpgb8.png)` }}
      />

      {/* Animated ambient orbs */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl animate-drift"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full opacity-25 blur-3xl animate-drift-slow"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.35) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[450px] h-[450px] rounded-full opacity-20 blur-3xl animate-drift"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
          animationDelay: '-8s',
        }}
      />

      {/* Vignette overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(9,11,16,0.4)_80%)]" />

      {/* Grid pattern, very subtle */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Film grain noise */}
      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
