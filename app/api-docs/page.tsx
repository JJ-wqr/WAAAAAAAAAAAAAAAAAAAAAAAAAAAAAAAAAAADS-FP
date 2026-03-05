'use client'
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import { spec } from "@/lib/swagger-spec" // Import your spec

export default function ApiDocs() {
  return <SwaggerUI spec={spec} />
}
