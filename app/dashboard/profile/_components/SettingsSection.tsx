"use client";
import { User, Mail, Shield, Globe, Bell, Palette, ChevronRight } from "lucide-react";

const settingsSections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile" },
      { icon: Mail, label: "Change Email" },
      { icon: Shield, label: "Change Password" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Globe, label: "Interface Language" },
      { icon: Bell, label: "Notifications" },
      { icon: Palette, label: "Theme" },
    ],
  },
];

export function SettingsSection({ handleLogout }: { handleLogout: () => Promise<void> }) {
  return (
    <div className="space-y-4 max-w-lg">
      {settingsSections.map(({ title, items }) => (
        <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Icon size={15} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="px-6 py-3 border-b border-red-50">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Account</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition text-left"
        >
          <span className="text-sm font-medium text-red-500">Log Out</span>
          <ChevronRight size={16} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}
