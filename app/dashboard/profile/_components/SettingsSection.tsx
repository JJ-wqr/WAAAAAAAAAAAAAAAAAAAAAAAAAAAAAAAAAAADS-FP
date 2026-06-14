"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { User, Mail, Shield, ChevronRight, Bell, X, Loader2, type LucideIcon } from "lucide-react";

type SettingsItem = {
  icon: LucideIcon;
  label: string;
  description?: string;
  type?: "toggle";
  modal?: "edit-profile" | "change-email" | "change-password";
};

type SettingsSectionProps = {
  userId?: string;
  notifications?: { enabled: boolean };
  handleLogout: () => Promise<void>;
};

type ModalType = "edit-profile" | "change-email" | "change-password" | null;

const settingsSections: { title: string; items: SettingsItem[] }[] = [
  {
    title: "Account",
    items: [
      { icon: User,   label: "Edit Profile",      description: "Update your name and email.",                    modal: "edit-profile" },
      { icon: Mail,   label: "Change Email",       description: "Use a different email address.",                 modal: "change-email" },
      { icon: Shield, label: "Change Password",    description: "Protect your account with a new password.",     modal: "change-password" },
      { icon: Bell,   label: "Push Notifications", description: "Receive updates when inside your browser.",     type: "toggle" },
    ],
  },
];

// ── Reusable Modal Shell ──────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Input helper ──────────────────────────────────────────────────────────────
function Field({ label, type = "text", value, onChange, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      />
    </div>
  );
}

// ── Edit Profile Modal ────────────────────────────────────────────────────────
function EditProfileModal({ onClose }: { onClose: () => void }) {
  const current = auth.currentUser;
  const [name, setName]     = useState(current?.displayName ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    if (!current) return;
    setLoading(true); setError("");
    try {
      await updateProfile(current, { displayName: name });
      if (current.uid) {
        await updateDoc(doc(db, "users", current.uid), { name });
      }
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Edit Profile" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Display Name" value={name} onChange={setName} placeholder="Your name" />
        {error   && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-500">Profile updated!</p>}
        <button
          onClick={handleSave}
          disabled={loading || !name.trim()}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition"
          style={{ background: "#4a7cf7" }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Save changes
        </button>
      </div>
    </Modal>
  );
}

// ── Change Email Modal ────────────────────────────────────────────────────────
function ChangeEmailModal({ onClose }: { onClose: () => void }) {
  const current = auth.currentUser;
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(false);

  async function handleSave() {
    if (!current || !current.email) return;
    setLoading(true); setError("");
    try {
      const credential = EmailAuthProvider.credential(current.email, password);
      await reauthenticateWithCredential(current, credential);
      await updateEmail(current, email);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Change Email" onClose={onClose}>
      <div className="space-y-4">
        <Field label="New Email"        type="email"    value={email}    onChange={setEmail}    placeholder="new@email.com" />
        <Field label="Current Password" type="password" value={password} onChange={setPassword} placeholder="Required to confirm" />
        {error   && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-500">Email updated!</p>}
        <button
          onClick={handleSave}
          disabled={loading || !email || !password}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition"
          style={{ background: "#4a7cf7" }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Update email
        </button>
      </div>
    </Modal>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const current = auth.currentUser;
  const [current_pw, setCurrentPw] = useState("");
  const [new_pw, setNewPw]         = useState("");
  const [confirm_pw, setConfirmPw] = useState("");
  const [loading, setLoading]      = useState(false);
  const [error, setError]          = useState("");
  const [success, setSuccess]      = useState(false);

  async function handleSave() {
    if (!current || !current.email) return;
    if (new_pw !== confirm_pw) { setError("Passwords do not match."); return; }
    if (new_pw.length < 6)     { setError("Password must be at least 6 characters."); return; }
    setLoading(true); setError("");
    try {
      const credential = EmailAuthProvider.credential(current.email, current_pw);
      await reauthenticateWithCredential(current, credential);
      await updatePassword(current, new_pw);
      setSuccess(true);
      setTimeout(onClose, 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Change Password" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Current Password" type="password" value={current_pw} onChange={setCurrentPw} placeholder="Current password" />
        <Field label="New Password"     type="password" value={new_pw}     onChange={setNewPw}     placeholder="Min. 6 characters" />
        <Field label="Confirm Password" type="password" value={confirm_pw} onChange={setConfirmPw} placeholder="Repeat new password" />
        {error   && <p className="text-xs text-red-500">{error}</p>}
        {success && <p className="text-xs text-green-500">Password updated!</p>}
        <button
          onClick={handleSave}
          disabled={loading || !current_pw || !new_pw || !confirm_pw}
          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition"
          style={{ background: "#4a7cf7" }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          Update password
        </button>
      </div>
    </Modal>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function SettingsSection({ userId, notifications, handleLogout }: SettingsSectionProps) {
  const notificationsEnabled = notifications?.enabled ?? false;
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const toggleNotifications = async () => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, "users", userId), { "notifications.enabled": !notificationsEnabled });
      if (!notificationsEnabled && typeof window !== "undefined" && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Notifications enabled", { body: "You'll receive in-browser updates." });
        }
      }
    } catch (e) {
      console.error("Failed to update notifications", e);
    }
  };

  return (
    <>
      {activeModal === "edit-profile"   && <EditProfileModal    onClose={() => setActiveModal(null)} />}
      {activeModal === "change-email"   && <ChangeEmailModal    onClose={() => setActiveModal(null)} />}
      {activeModal === "change-password"&& <ChangePasswordModal onClose={() => setActiveModal(null)} />}

      <div className="space-y-4 w-full max-w-full">
        {settingsSections.map(({ title, items }) => (
          <div key={title} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
            <div className="px-6 py-3 border-b border-gray-50">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
            </div>
            <div className="divide-y divide-gray-50">
              {items.map(({ icon: Icon, label, description, type, modal }) =>
                type === "toggle" ? (
                  <div key={label} className="w-full flex items-center justify-between px-6 py-4">
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
                      onClick={toggleNotifications}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${notificationsEnabled ? "bg-blue-600" : "bg-gray-200"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationsEnabled ? "translate-x-5" : "translate-x-1"}`} />
                    </button>
                  </div>
                ) : (
                  <button
                    key={label}
                    onClick={() => modal && setActiveModal(modal)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition text-left cursor-pointer"
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

        <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden w-full">
          <div className="px-6 py-3 border-b border-red-50">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">Account</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-red-50 transition text-left cursor-pointer"
          >
            <span className="text-sm font-medium text-red-500">Log Out</span>
            <ChevronRight size={16} className="text-red-400" />
          </button>
        </div>
      </div>
    </>
  );
}
