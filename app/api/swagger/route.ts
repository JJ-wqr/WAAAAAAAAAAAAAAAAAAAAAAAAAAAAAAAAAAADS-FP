// app/api/swagger/route.ts
// Serves the OpenAPI JSON spec at /api/swagger

import { NextResponse } from "next/server";
import { swaggerSpec } from "@/lib/swagger";

export async function GET() {
  return NextResponse.json(swaggerSpec);
}