"use client";
import { useState, useEffect } from "react";
import {
  User, Globe, Bell, Shield, Palette, ChevronRight,
  Flame, Zap, BookOpen, CheckCircle2, X, Save, AlertCircle
} from "lucide-react";
import { useAuth } from "@/components/authprovider";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  signOut, updatePassword, EmailAuthProvider,
  reauthenticateWithCredential, updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useLang } from "@/components/languageprovider";
import { LANGUAGES } from "@/lib/languages";
import { toast } from "sonner";

/* ── HARD FIX: prevents hanging forever ── */
function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms)
    ),
  ]);
}

/* ── Modal ── */
function Modal({ title, onClose, children }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer text-gray-400"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ── Input ── */
function ModalInput({ label, type = "text", value, onChange, disabled }: any) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e: any) => onChange(e.target.value) : undefined}
        disabled={disabled}
        className="mt-1.5 w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50
                   text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

/* ── Save Button (FIXED STATE HANDLING) ── */
function SaveBtn({ onClick, loading, disabled, label = "Save Changes" }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full py-3 rounded-xl text-white text-sm font-semibold
                 flex items-center justify-center gap-2 transition
                 disabled:opacity-50 cursor-pointer"
      style={{ background: "#4a7cf7" }}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save size={15} />
          {label}
        </>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════ */
export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLang();

  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* Sync display name */
  useEffect(() => {
    if (user?.displayName) setDisplayName(user.displayName);
  }, [user]);

  /* SAFE RESET */
  const closeModal = () => {
    setActiveModal(null);
    setSaving(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  /* ✅ FIXED PROFILE SAVE */
  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) return;

    setSaving(true);

    try {
      await withTimeout(
        Promise.all([
          updateProfile(user, { displayName: displayName.trim() }),
          updateDoc(doc(db, "users", user.uid), {
            name: displayName.trim(),
          }),
        ])
      );

      toast.success("Username updated successfully!");
      closeModal(); // ensures loading resets
    } catch (err: any) {
      toast.error(err.message || "Failed to update username.");
    } finally {
      setSaving(false); // 🔥 GUARANTEED FIX
    }
  };

  /* ✅ FIXED PASSWORD CHANGE */
  const handleChangePassword = async () => {
    if (!user) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const cred = EmailAuthProvider.credential(user.email!, currentPassword);

      await withTimeout(reauthenticateWithCredential(user, cred));
      await withTimeout(updatePassword(user, newPassword));

      toast.success("Password changed!");
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Failed to change password.");
    } finally {
      setSaving(false); // 🔥 FIX
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  /* ═════════ UI ═════════ */
  return (
    <div className="p-8">

      <button
        onClick={() => setActiveModal("edit")}
        className="px-4 py-2 rounded-xl text-white"
        style={{ background: "#4a7cf7" }}
      >
        Edit Username
      </button>

      <button
        onClick={() => setActiveModal("password")}
        className="ml-3 px-4 py-2 rounded-xl text-white"
        style={{ background: "#4a7cf7" }}
      >
        Change Password
      </button>

      {/* EDIT PROFILE */}
      {activeModal === "edit" && (
        <Modal title="Edit Username" onClose={closeModal}>
          <div className="space-y-4">
            <ModalInput
              label="Username"
              value={displayName}
              onChange={setDisplayName}
            />
            <SaveBtn
              onClick={handleSaveProfile}
              loading={saving}
              disabled={!displayName.trim()}
            />
          </div>
        </Modal>
      )}

      {/* PASSWORD */}
      {activeModal === "password" && (
        <Modal title="Change Password" onClose={closeModal}>
          <div className="space-y-4">
            <ModalInput
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <ModalInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <ModalInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
            <SaveBtn
              onClick={handleChangePassword}
              loading={saving}
            />
          </div>
        </Modal>
      )}

    </div>
  );
}