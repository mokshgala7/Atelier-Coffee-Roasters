import { useEffect, useRef } from 'react';

export default function PageTransition({ active, message = 'Atelier Coffee Roasters' }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (active && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback (silent catch)
      });
    }
  }, [active]);

  return (
    <div
      aria-hidden={!active}
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-500 ease-in-out ${
        active
          ? 'opacity-100 pointer-events-auto backdrop-blur-md bg-[#140c08]/80'
          : 'opacity-0 pointer-events-none backdrop-blur-none bg-transparent'
      }`}
    >
      <div
        className={`relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl bg-[#1f1510]/95 border border-[#e8ba99]/20 shadow-[0_25px_60px_rgba(0,0,0,0.65)] max-w-[320px] w-[90%] transform transition-all duration-500 ${
          active ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'
        }`}
      >
        {/* Subtle Ambient Glow behind video */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#d97736]/10 to-transparent pointer-events-none" />

        {/* Compact Luxury Video Player */}
        <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl border border-[#e8ba99]/15 bg-[#120a06] flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/atelier-transition.webm" type="video/webm" />
            <source src="/transition.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Dynamic Transition Status Text */}
        <div className="mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[#d97736]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d97736] animate-ping" />
            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-[10px] uppercase font-bold tracking-[0.25em] text-[#e8ba99]">
              {message}
            </span>
          </div>

          <p className="font-['Playfair_Display',serif] text-sm text-[#f5ebe4] font-medium tracking-wide">
            Pouring Excellence
          </p>

          {/* Micro Progress Bar */}
          <div className="w-36 h-1 bg-[#2c1c14] rounded-full overflow-hidden mx-auto mt-2.5">
            <div className="h-full bg-gradient-to-r from-[#b05325] via-[#e59d5c] to-[#ebdcd5] rounded-full animate-[transitionProgress_1.4s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
