"use client";

import { doc, updateDoc } from "firebase/firestore";
import { User, Mail, Shield, Globe, Bell, Palette, ChevronRight, LucideIcon } from "lucide-react";
import { db } from "@/lib/firebase";

type SettingsItem = {
  icon: LucideIcon;
  label: string;
  description?: string;
  type?: "toggle";
};

type SettingsSectionProps = {
  userId?: string;
  notifications?: { enabled: boolean };
  handleLogout: () => Promise<void>;
};

const settingsSections: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", description: "Update your name and email." },
      { icon: Mail, label: "Change Email", description: "Use a different email address." },
      { icon: Shield, label: "Change Password", description: "Protect your account with a new password." },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: Globe, label: "Interface Language", description: "Change the app language." },
      { icon: Bell, label: "Notifications", description: "Receive update alerts in your browser.", type: "toggle" },
      { icon: Palette, label: "Theme", description: "Switch between light and dark mode." },
    ],
  },
];

export function SettingsSection({ userId, notifications, handleLogout }: SettingsSectionProps) {
  const notificationsEnabled = notifications?.enabled ?? false;

  const toggleNotifications = async () => {
    if (!userId) return;
    const nextValue = !notificationsEnabled;

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { "notifications.enabled": nextValue });

      if (nextValue && typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Notifications enabled", {
            body: "You will now receive in-browser updates when you're here.",
          });
        }
      }
    } catch (error) {
      console.error("Failed to update notification settings", error);
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      {settingsSections.map(({ title, items }) => (
        <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-50">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(({ icon: Icon, label, description, type }) =>
              type === "toggle" ? (
                <div
                  key={label}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mt-1">
                      <Icon size={15} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{label}</p>
                      <p className="text-xs text-gray-400 mt-1">{description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={toggleNotifications}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      notificationsEnabled ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        notificationsEnabled ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <button
                  key={label}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Icon size={15} className="text-blue-500" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      {description && <p className="text-xs text-gray-400">{description}</p>}
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              )
            )}
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
