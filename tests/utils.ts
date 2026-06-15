// Test utilities for API testing
import { NextRequest, NextResponse } from 'next/server';

export async function createMockRequest(
  method: string,
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Promise<NextRequest> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), options as ConstructorParameters<typeof NextRequest>[1]);
}

export function createMockResponse() {
  let status = 200;
  let body: unknown = null;

  return {
    setStatus: (s: number) => {
      status = s;
      return this;
    },
    json: (data: unknown) => {
      body = data;
      return NextResponse.json(data, { status });
    },
    status: (s: number) => {
      status = s;
      return {
        json: (data: unknown) => NextResponse.json(data, { status }),
      };
    },
  };
}

export function createAuthHeader(userId?: string, role?: string) {
  return {
    Authorization: `Bearer test-token-${userId || 'user123'}`,
    'X-User-ID': userId || 'user123',
    'X-User-Role': role || 'user',
  };
}

export function expectStatusCode(response: Response, expectedStatus: number) {
  if (response.status !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
  }
}

export async function expectJsonResponse(response: Response, expectedKeys: string[]) {
  const data = await response.json();
  for (const key of expectedKeys) {
    if (!(key in data)) {
      throw new Error(`Expected key "${key}" in response, got: ${JSON.stringify(data)}`);
    }
  }
  return data;
}
