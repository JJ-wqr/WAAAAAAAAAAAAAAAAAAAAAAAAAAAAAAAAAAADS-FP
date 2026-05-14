import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/components/languageprovider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-page)" }}>
        <Sidebar />
        <main className="ml-64 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
