"use client";
// app/api-docs/page.tsx

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          padding: "24px 32px",
          borderBottom: "3px solid #e74c3c",
        }}
      >
        <h1
          style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 700,
            fontFamily: "Georgia, serif",
            margin: 0,
            letterSpacing: "0.5px",
          }}
        >
          📋 Task API — Documentation
        </h1>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "13px",
            margin: "6px 0 0 0",
            fontFamily: "monospace",
          }}
        >
          OpenAPI 3.0 &nbsp;|&nbsp; Base URL:{" "}
          <code style={{ color: "#68d391" }}>/api</code>
          &nbsp;|&nbsp; Use &ldquo;Try it out&rdquo; to test each endpoint live
        </p>
      </div>

      {/* Swagger UI */}
      <SwaggerUI
        url="/api/swagger"
        tryItOutEnabled={true}
        displayRequestDuration={true}
        defaultModelsExpandDepth={-1}
      />
    </div>
  );
}