export default function VinylDecoration() {
    return (
        <div className="relative w-[420px] h-[420px] flex items-center justify-center">
            {/* Vinyl record - spinning */}
            <div
                className="w-full h-full rounded-full bg-[#0d0d0d] shadow-2xl"
                style={{
                    animation: "spin 8s linear infinite",
                    backgroundImage: `
            repeating-radial-gradient(
              circle at 50%,
              transparent 0px,
              transparent 6px,
              rgba(255,255,255,0.025) 6px,
              rgba(255,255,255,0.025) 7px
            )
          `,
                }}
            >
                {/* Label center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-28 h-28 rounded-full bg-[#d6d0c4] flex flex-col items-center justify-center shadow-inner relative">
                        {/* Label text */}
                        <span
                            className="text-[8px] font-bold tracking-[0.3em] text-zinc-600 uppercase"
                            style={{ writingMode: "vertical-rl" }}
                        >
                            STEREO
                        </span>
                        {/* Center hole */}
                        <div className="absolute w-3 h-3 rounded-full bg-black" />
                    </div>
                </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.04), transparent 60%)",
                }}
            />

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}