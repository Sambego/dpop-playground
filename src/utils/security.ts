// Security utility functions for safe data handling
import { STEP_IDS } from '@/constants/app';

/**
 * Safely parse JSON with validation
 */
export function safeJsonParse<T>(
  json: string,
  validator: (obj: unknown) => obj is T
): T | null {
  try {
    const parsed = JSON.parse(json);

    // Prevent prototype pollution
    if (parsed !== null && typeof parsed === "object") {
      if (
        parsed.hasOwnProperty("__proto__") ||
        parsed.hasOwnProperty("constructor") ||
        parsed.hasOwnProperty("prototype")
      ) {
        console.warn(
          "Potentially dangerous JSON detected - prototype pollution attempt"
        );
        return null;
      }
    }

    if (validator(parsed)) {
      return parsed;
    }

    console.warn("JSON validation failed");
    return null;
  } catch (error) {
    console.warn("JSON parsing failed:", error);
    return null;
  }
}

/**
 * Validate DPoP settings structure
 */
export interface DpopSettings {
  algorithm: string;
  accessTokenAlgorithm: string;
  authServerUrl: string;
  endpoints: {
    authorization: string;
    token: string;
    jwks: string;
  } | null;
}

export function isDpopSettings(obj: unknown): obj is DpopSettings {
  if (!obj || typeof obj !== "object" || obj === null) {
    return false;
  }

  const settings = obj as Record<string, unknown>;

  // Check required string properties
  if (
    typeof settings.algorithm !== "string" ||
    typeof settings.accessTokenAlgorithm !== "string" ||
    typeof settings.authServerUrl !== "string"
  ) {
    return false;
  }

  // Validate algorithms
  const validAlgorithms = [
    "ES256",
    "ES384",
    "ES512",
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "Ed25519",
    "Ed448",
  ];
  if (!validAlgorithms.includes(settings.algorithm) || 
      !validAlgorithms.includes(settings.accessTokenAlgorithm)) {
    return false;
  }

  // Validate endpoints
  if (settings.endpoints === null) {
    return true;
  }

  if (typeof settings.endpoints !== "object") {
    return false;
  }

  const endpoints = settings.endpoints as Record<string, unknown>;
  return (
    typeof endpoints.authorization === "string" &&
    typeof endpoints.token === "string" &&
    typeof endpoints.jwks === "string"
  );
}

/**
 * Validate section IDs for safe DOM manipulation
 */
const VALID_SECTION_IDS = [
  ...STEP_IDS,
  'concepts'
] as const;

export type ValidSectionId = (typeof VALID_SECTION_IDS)[number];

export function isValidSectionId(
  sectionId: string
): sectionId is ValidSectionId {
  return VALID_SECTION_IDS.includes(sectionId as ValidSectionId);
}

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and javascript: URLs
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/data:/gi, "");
}

/**
 * Validate authorization server URL for security (prevent SSRF)
 */
export function validateAuthServerUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTPS URLs for security
    if (parsedUrl.protocol !== "https:") {
      return false;
    }

    // Block private/internal networks to prevent SSRF
    const hostname = parsedUrl.hostname.toLowerCase();

    // Block localhost and loopback
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      return false;
    }

    // Block private IPv4 ranges
    if (
      hostname.match(/^10\./) ||
      hostname.match(/^192\.168\./) ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hostname.match(/^169\.254\./)
    ) {
      // Link-local
      return false;
    }

    // Block private IPv6 ranges
    if (
      hostname.match(/^fc00:/) ||
      hostname.match(/^fd00:/) ||
      hostname.match(/^fe80:/)
    ) {
      return false;
    }

    // Block other dangerous hostnames
    if (hostname.includes("metadata") || hostname.includes("169.254.169.254")) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Create secure fetch options with timeout and proper headers
 */
export function createSecureFetchOptions(timeoutMs: number = 10000): {
  signal: AbortSignal;
  headers: Record<string, string>;
  redirect: RequestRedirect;
  mode: RequestMode;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
    redirect: "follow",
    mode: "cors",
    cleanup: () => clearTimeout(timeoutId),
  };
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  // Basic email validation - more restrictive than HTML5 pattern
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  // Additional length check
  if (email.length > 254) {
    return false;
  }

  return emailRegex.test(email);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .replace(/[<>\"'&]/g, (match) => {
      const entities: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return entities[match] || match;
    })
    .trim();
}
