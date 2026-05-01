"use client";

export function ProfileStats({ displayLanguages }: { displayLanguages: Array<any> }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-5">Language Progress</h3>
        <div className="space-y-5">
          {displayLanguages.map((lang) => (
            <div key={lang.name} className="flex items-center gap-4">
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{lang.name}</span>
                  <span className="text-gray-400 text-xs">{lang.level} · {lang.xp.toLocaleString()} XP</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((lang.xp / 1000) * 100, 100)}%`, background: "#4a7cf7" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-5">Weekly Activity</h3>
        <div className="flex items-end justify-between gap-1 h-24">
          {[40, 70, 55, 90, 65, 80, 45].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-sm"
                style={{ height: `${h}%`, background: i === 6 ? "#e5e7eb" : "#4a7cf7", opacity: i === 6 ? 0.5 : 1 }}
              />
              <span className="text-xs text-gray-400">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
