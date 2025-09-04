// App-wide constants and configuration values

// OAuth/DPoP Configuration
export const OAUTH_CONFIG = {
  CLIENT_ID: "myapp-client-id",
  RESPONSE_TYPE: "code",
  REDIRECT_URI: "https://app.example.com/callback",
  SCOPE: "openid profile email",
  CODE_CHALLENGE_METHOD: "S256",
  GRANT_TYPE: "authorization_code",
} as const;

// Sample OAuth Values (for demo purposes)
export const DEMO_VALUES = {
  STATE: "abc123xyz",
  CODE_CHALLENGE: "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  DPOP_JKT: "CNx2APrOJh-w5OoRFRSD6WoeBJJUgZ-oUr_p7SPSQgQ",
  AUTH_CODE: "SplxlOBeZQQYbYS6WxSbIA",
  ACCESS_TOKEN_SCOPE: "read write",
} as const;

// URLs and Endpoints
export const URLS = {
  DEFAULT_AUTH_SERVER: "https://auth.example.com",
  APP_DOMAIN: "https://app.example.com",
  API_DOMAIN: "https://api.example.com",
  PERSONAL_WEBSITE: "https://sambego.tech",
  TWITTER_PROFILE: "https://twitter.com/sambego",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  OAUTH_AUTHORIZE: "/oauth/authorize",
  OAUTH_TOKEN: "/oauth/token",
  API_PROFILE: "/profile",
} as const;

// RFC and Documentation URLs
export const RFC_URLS = {
  DPoP: "https://tools.ietf.org/rfc/rfc9449.txt",
  JWT: "https://tools.ietf.org/rfc/rfc7519.txt",
  JWK: "https://tools.ietf.org/rfc/rfc7517.txt",
  JWK_THUMBPRINT: "https://tools.ietf.org/rfc/rfc7638.txt",
  OAUTH_V2_1: "https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1",
  OIDC_CORE: "https://openid.net/specs/openid-connect-core-1_0.html",
  OAUTH_WG: "https://datatracker.ietf.org/wg/oauth/about/",
} as const;

// External Service URLs
export const EXTERNAL_URLS = {
  AUTH0_MAIN: "https://auth0.com",
  AUTH0_DPOP_DOCS:
    "https://auth0.com/docs/get-started/authentication-and-authorization-flow/dpop",
  MDN_WEB_CRYPTO:
    "https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API",
} as const;

// Library and Tool URLs
export const LIBRARY_URLS = {
  JOSE: "https://github.com/panva/jose",
  NODE_OIDC_PROVIDER: "https://github.com/panva/node-oidc-provider",
  AUTH0_DPOP: "https://github.com/auth0/dpop",
} as const;

// JWT Claims and Headers
export const JWT_CLAIMS = {
  TYP: "dpop+jwt",
  JTI: "jti",
  IAT: "iat",
  EXP: "exp",
  HTM: "htm",
  HTU: "htu",
  ATH: "ath",
  JKT: "jkt",
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: "application/json",
  FORM_URLENCODED: "application/x-www-form-urlencoded",
  JWT: "application/jwt",
} as const;

// DPoP Configuration
export const DPOP_CONFIG = {
  HEADER_NAME: "DPoP",
  JWT_TYPE: "dpop+jwt",
  DEFAULT_EXPIRY_SECONDS: 60,
  MAX_AGE_SECONDS: 300,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_TOKEN: "invalid_token",
  INVALID_DPOP_PROOF: "invalid_dpop_proof",
  BEARER_NOT_ALLOWED:
    "DPoP-bound access token cannot be used with Bearer authentication scheme",
  SIGNATURE_VERIFICATION_FAILED:
    "DPoP proof signature verification failed - public key mismatch",
} as const;

// Step Navigation
export const STEP_IDS = [
  "introduction",
  "step1",
  "step2",
  "step3",
  "step4",
  "step5",
  "step6",
  "step7",
  "step8",
] as const;

export const CHAPTER_TITLES: Record<number, string> = {
  0: "Introduction",
  1: "User Login",
  2: "Authorization Server",
  3: "Authorization Code",
  4: "Key Generation",
  5: "DPoP Proof Creation",
  6: "Token Exchange",
  7: "API Request",
  8: "Security Demo",
} as const;

// Animation and UI Constants
export const ANIMATION = {
  TRANSITION_DURATION: 700,
  INTERSECTION_THRESHOLD: 0.1,
  SCROLL_MARGIN: "100px 0px",
} as const;

// Crypto Algorithm Support
export const SUPPORTED_ALGORITHMS = [
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512",
  "EdDSA",
] as const;

export type SupportedAlgorithm = (typeof SUPPORTED_ALGORITHMS)[number];
export type StepId = (typeof STEP_IDS)[number];
