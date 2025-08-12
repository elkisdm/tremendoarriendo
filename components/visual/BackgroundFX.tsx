export function BackgroundFX() {
  return (
    <>
      {/* Gradient animado principal */}
      <div 
        aria-hidden 
        className="fixed inset-0 -z-10 bg-aurora motion-safe:animate-aurora" 
      />
      
      {/* Overlay suave (vignette) */}
      <div 
        aria-hidden 
        className="fixed inset-0 -z-10 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none" 
      />
    </>
  );
}
