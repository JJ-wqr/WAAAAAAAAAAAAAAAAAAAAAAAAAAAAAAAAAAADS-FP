"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerUIWrapper({ url }: { url: string }) {
  return <SwaggerUI url={url} />;
}
