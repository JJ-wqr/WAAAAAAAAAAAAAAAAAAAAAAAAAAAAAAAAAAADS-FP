"use client";

export function TimeFilterBar({ filters, filter, setFilter }: {
  filters: string[];
  filter: string;
  setFilter: (value: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            filter === f ? "text-white" : "bg-white text-gray-600 border border-gray-200"
          }`}
          style={filter === f ? { background: "#4a7cf7" } : {}}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
