import Sidebar from "@/components/Sidebar";
import { LanguageProvider } from "@/components/languageprovider";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { Footer } from "@/components/Footer";
import { TopNav } from "@/components/TopNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
        <Sidebar />
        <div className="flex flex-1 flex-col lg:ml-64">
          <TopNav />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">{children}</div>
          </main>
          <Footer />
          <ScrollToTopButton />
        </div>
      </div>
    </LanguageProvider>
  );
}
