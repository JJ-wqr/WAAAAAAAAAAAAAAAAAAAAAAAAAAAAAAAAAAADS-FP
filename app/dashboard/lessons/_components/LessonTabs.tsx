"use client";

export function LessonTabs({ tabs, activeTab, setActiveTab }: { tabs: string[]; activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === tab ? "text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
          style={activeTab === tab ? { background: "#4a7cf7" } : {}}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
