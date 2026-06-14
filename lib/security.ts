import { NextRequest } from "next/server";

const rateLimitStore = new Map<string, number[]>();

export type RateLimitResult = { allowed: boolean; retryAfter?: number };

export function getClientIp(req: Request | NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (forwarded) return forwarded;
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

export function buildRateLimitKey(req: Request | NextRequest, route: string) {
  return `${route}:${getClientIp(req)}`;
}

export function enforceRateLimit(
  req: Request | NextRequest,
  route: string,
  maxRequests = 20,
  windowMs = 60_000
): RateLimitResult {
  const key = buildRateLimitKey(req, route);
  const now = Date.now();
  const windowStart = now - windowMs;
  const timestamps = (rateLimitStore.get(key) ?? []).filter((ts) => ts > windowStart);

  if (timestamps.length >= maxRequests) {
    const retryAfter = Math.ceil((timestamps[0] + windowMs - now) / 1000);
    return { allowed: false, retryAfter: Math.max(1, retryAfter) };
  }

  timestamps.push(now);
  rateLimitStore.set(key, timestamps);
  return { allowed: true };
}

export function sanitizeText(value: unknown, maxLength = 2000): string {
  const text = value == null ? "" : String(value);
  const cleaned = text
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/&[#A-Za-z0-9]+;/g, " ")
    .replace(/[\u0000-\u001f\u007f-\u009f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, maxLength);
}

export function sanitizeLangCode(value: unknown, allowed: string[], fallback = allowed[0]) {
  const normalized = String(value ?? "").toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

export function sanitizeChatMessages(messages: unknown) {
  if (!Array.isArray(messages)) return [];

  return messages
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const typedItem = item as { role?: unknown; content?: unknown };
      const role = String(typedItem.role ?? "user").toLowerCase();
      const safeRole = role === "assistant" ? "assistant" : "user";
      const content = sanitizeText(typedItem.content, 2000);
      if (!content) return null;
      return { role: safeRole as "user" | "assistant", content };
    })
    .filter((item): item is { role: "user" | "assistant"; content: string } => Boolean(item));
}

export function isValidEmail(value: unknown) {
  const email = String(value ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
