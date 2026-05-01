"use client";

export function FlashcardCard({ card, langInfo, flipped, setFlipped }: any) {
  return (
    <div className="flex justify-center">
      <div
        className="w-full max-w-lg cursor-pointer select-none"
        style={{ perspective: "1000px" }}
        onClick={() => setFlipped(!flipped)}
      >
        <div
          className="relative w-full transition-all duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            height: "280px",
          }}
        >
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{langInfo.flag} {langInfo.name} → English</p>
            <p className="text-5xl font-bold text-gray-800 mb-3 text-center">{card.front}</p>
            <p className="text-lg text-gray-400">{card.hint}</p>
            <p className="text-xs text-gray-300 mt-6">Tap to reveal</p>
          </div>

          <div
            className="absolute inset-0 rounded-3xl shadow-lg flex flex-col items-center justify-center p-8 text-white"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #4a7cf7, #7c3aed)",
            }}
          >
            <p className="text-xs text-white/60 uppercase tracking-widest mb-4">Meaning</p>
            <p className="text-3xl font-bold mb-4">{card.back}</p>
            <div className="bg-white/10 rounded-xl p-4 text-center max-w-xs">
              <p className="text-sm text-white/80 whitespace-pre-line">{card.example}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
