import Sidebar from "@/components/Sidebar";

import { AuthProvider } from "@/components/authprovider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
