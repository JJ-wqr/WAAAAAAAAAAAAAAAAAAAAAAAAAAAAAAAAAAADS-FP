import SwaggerUIWrapper from "./SwaggerUI";
import { PublicShell } from "@/components/PublicShell";

export const metadata = {
  title: "API Docs – Linguiny",
  description: "Linguiny REST API documentation",
};

export default function ApiDocsPage() {
  return (
    <PublicShell title="API documentation for Linguiny" description="Explore our interactive API endpoints for lessons, users, and learning data.">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <div className="max-w-5xl">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white" style={{ color: "#4a7cf7" }}>
            Linguiny API Documentation
          </h1>
          <p className="text-gray-500 mb-6 text-sm dark:text-slate-400">
            Interactive API reference for the Linguiny platform.
          </p>
        </div>
      </div>
      <div className="mt-6 rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-slate-900">
        <SwaggerUIWrapper url="/api/docs" />
      </div>
    </PublicShell>
  );
}
