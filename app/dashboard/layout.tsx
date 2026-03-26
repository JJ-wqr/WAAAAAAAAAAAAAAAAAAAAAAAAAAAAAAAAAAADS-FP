import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/components/languageprovider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen" style={{ background: "#f0f2f8" }}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </LanguageProvider>
  );
}
