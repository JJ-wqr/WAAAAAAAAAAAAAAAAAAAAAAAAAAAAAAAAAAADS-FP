import SwaggerUIWrapper from "./SwaggerUI";

export const metadata = {
  title: "API Docs – Linguiny",
  description: "Linguiny REST API documentation",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: "#4a7cf7" }}>
          Linguiny API Documentation
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          Interactive API reference for the Linguiny platform.
        </p>
      </div>
      <SwaggerUIWrapper url="/api/docs" />
    </main>
  );
}
