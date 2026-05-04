"use client";

import { Clock } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export function DashboardRecentActivity({ recentActivity }: { recentActivity: Array<{ action: string; lang: string; time: string; xp: string }> }) {
  return (
    <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <Clock size={18} className="text-blue-500" /> Recent Activity
        </h2>
      </div>
      <div className="space-y-3">
        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-400">No recent activity yet.</p>
        ) : (
          recentActivity.map((item, idx) => (
            <div key={`${item.action}-${idx}`} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl">
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.action}</p>
                <p className="text-xs text-gray-500">{item.lang} · {timeAgo(item.time)}</p>
              </div>
              <span className="text-sm font-semibold text-blue-600">{item.xp}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
