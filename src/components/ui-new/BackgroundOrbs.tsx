export function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#090b10]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 sm:opacity-25"
        style={{ backgroundImage: `url(https://res.cloudinary.com/dcbagjtsy/image/upload/v1784818816/background_evpgb8.png)` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/60 via-[#0b0f19]/90 to-[#06080d]/95" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
