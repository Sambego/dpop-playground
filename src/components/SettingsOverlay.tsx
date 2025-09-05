"use client";

import { useState, useEffect, useCallback } from "react";
import AlgorithmInfo from "./AlgorithmInfo";
import { useToast } from "@/contexts/ToastContext";
import {
  safeJsonParse,
  isDpopSettings,
  validateAuthServerUrl,
  createSecureFetchOptions,
  type DpopSettings,
} from "@/utils/security";
import { URLS, SUPPORTED_ALGORITHMS } from "@/constants/app";

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsOverlay({
  isOpen,
  onClose,
}: SettingsOverlayProps) {
  const { showSuccess, showError, showWarning } = useToast();
  const [settings, setSettings] = useState<DpopSettings>({
    algorithm: "ES256",
    accessTokenAlgorithm: "RS256",
    authServerUrl: URLS.DEFAULT_AUTH_SERVER,
    endpoints: null,
  });
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState(false);
  const [algorithmSupport, setAlgorithmSupport] = useState<
    Record<string, boolean>
  >({});
  const [isCheckingSupport, setIsCheckingSupport] = useState(false);

  // Load settings from localStorage on mount with safe parsing
  useEffect(() => {
    const stored = localStorage.getItem("dpop-settings");
    if (stored) {
      const parsedSettings = safeJsonParse(stored, isDpopSettings);
      if (parsedSettings) {
        setSettings(parsedSettings);
      } else {
        console.warn("Invalid settings format in localStorage, using defaults");
        showWarning(
          "Settings Reset",
          "Invalid stored settings were cleared and defaults restored"
        );
        // Clear invalid settings
        localStorage.removeItem("dpop-settings");
      }
    }
  }, [showWarning]);

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      localStorage.setItem("dpop-settings", JSON.stringify(settings));
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("dpop-settings-changed"));
      showSuccess(
        "Settings Saved",
        "Your DPoP configuration has been saved successfully"
      );
      onClose();
    } catch (error) {
      console.error("Save settings error:", error);
      showError("Save Failed", "Failed to save settings. Please try again.");
    }
  };

  // Safe JSON validation for OIDC config
  const validateOidcConfig = (config: unknown): boolean => {
    return (
      config !== null &&
      typeof config === "object" &&
      config !== null &&
      "authorization_endpoint" in config &&
      "token_endpoint" in config &&
      "jwks_uri" in config &&
      typeof (config as Record<string, unknown>).authorization_endpoint ===
        "string" &&
      typeof (config as Record<string, unknown>).token_endpoint === "string" &&
      typeof (config as Record<string, unknown>).jwks_uri === "string"
    );
  };

  // Discover OIDC endpoints with security validation
  const discoverEndpoints = useCallback(
    async (url?: string) => {
      const targetUrl = url || settings.authServerUrl;
      if (!targetUrl.trim()) return;

      // Validate URL before making request
      if (!validateAuthServerUrl(targetUrl)) {
        showError(
          "Invalid URL",
          "Only HTTPS URLs to public domains are allowed for security."
        );
        setSettings((prev) => ({ ...prev, endpoints: null }));
        return;
      }

      setIsDiscovering(true);

      const secureOptions = createSecureFetchOptions(20000); // Increased timeout to 20 seconds

      try {
        const wellKnownUrl = new URL(
          "/.well-known/openid-configuration",
          targetUrl
        ).toString();

        // Use simple fetch options that work
        const response = await fetch(wellKnownUrl, {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
        });

        secureOptions.cleanup();

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format - expected JSON");
        }

        const config = await response.json();

        // Validate the configuration structure
        if (!validateOidcConfig(config)) {
          throw new Error(
            "Invalid OIDC configuration format - missing required endpoints"
          );
        }

        const typedConfig = config as Record<string, unknown>;
        const endpoints = {
          authorization: (typedConfig.authorization_endpoint as string) || "",
          token: (typedConfig.token_endpoint as string) || "",
          jwks: (typedConfig.jwks_uri as string) || "",
        };

        // Update settings state and automatically save to localStorage
        const updatedSettings = { ...settings, endpoints };
        setSettings(updatedSettings);

        // Auto-save the discovered endpoints
        try {
          localStorage.setItem(
            "dpop-settings",
            JSON.stringify(updatedSettings)
          );
          // Dispatch custom event to notify other components
          window.dispatchEvent(new CustomEvent("dpop-settings-changed"));
        } catch (error) {
          console.error("Failed to auto-save discovered endpoints:", error);
        }

        showSuccess(
          "Discovery Complete",
          "OIDC endpoints discovered and saved automatically"
        );
      } catch (error) {
        secureOptions.cleanup();
        console.error("OIDC discovery error:", error);
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            showError(
              "Request Timeout",
              "Please check the server URL and try again"
            );
          } else if (error.message.includes("CORS")) {
            showError(
              "CORS Error",
              "The authorization server does not allow cross-origin requests"
            );
          } else if (error.message.includes("Failed to fetch")) {
            showError(
              "Network Error",
              "Please check the server URL and your internet connection"
            );
          } else if (error.message.includes("Invalid OIDC configuration")) {
            showError(
              "Invalid Configuration",
              "The server response is missing required OIDC endpoints"
            );
          } else {
            showError("Discovery Failed", error.message);
          }
        } else {
          showError(
            "Unexpected Error",
            "An unexpected error occurred during discovery"
          );
        }
        setSettings((prev) => ({ ...prev, endpoints: null }));
      } finally {
        setIsDiscovering(false);
      }
    },
    [settings.authServerUrl, showSuccess, showError]
  );

  // Auto-discover when URL changes (but only once per URL) - with longer debounce to avoid interfering with typing
  useEffect(() => {
    if (
      !settings.authServerUrl.trim() ||
      settings.authServerUrl === "https://auth.example.com"
    ) {
      return;
    }

    // Only reset endpoints after user stops typing for a while
    const timeoutId = setTimeout(() => {
      // Reset endpoints when URL changes (only after debounce)
      setSettings((prev) => ({ ...prev, endpoints: null }));
      discoverEndpoints(settings.authServerUrl);
    }, 2000); // Increased debounce to 2 seconds to avoid interrupting typing

    return () => clearTimeout(timeoutId);
  }, [settings.authServerUrl]); // Removed discoverEndpoints dependency to prevent retry loops

  // Test algorithm support when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const checkAllAlgorithms = async () => {
      setIsCheckingSupport(true);
      const algorithms = [
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
      const supportResults: Record<string, boolean> = {};

      for (const alg of algorithms) {
        supportResults[alg] = await testAlgorithmSupport(alg);
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      setAlgorithmSupport(supportResults);
      setIsCheckingSupport(false);
    };

    checkAllAlgorithms();
  }, [isOpen]);

  // Actually test algorithm browser support
  const testAlgorithmSupport = async (algorithm: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    try {
      if (!window.crypto || !window.crypto.subtle) return false;

      const supportedAlgorithms = {
        ES256: async () =>
          window.crypto.subtle.generateKey(
            { name: "ECDSA", namedCurve: "P-256" },
            false,
            ["sign", "verify"]
          ),
        ES384: async () =>
          window.crypto.subtle.generateKey(
            { name: "ECDSA", namedCurve: "P-384" },
            false,
            ["sign", "verify"]
          ),
        ES512: async () =>
          window.crypto.subtle.generateKey(
            { name: "ECDSA", namedCurve: "P-521" },
            false,
            ["sign", "verify"]
          ),
        RS256: async () =>
          window.crypto.subtle.generateKey(
            {
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-256",
            },
            false,
            ["sign", "verify"]
          ),
        RS384: async () =>
          window.crypto.subtle.generateKey(
            {
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-384",
            },
            false,
            ["sign", "verify"]
          ),
        RS512: async () =>
          window.crypto.subtle.generateKey(
            {
              name: "RSASSA-PKCS1-v1_5",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-512",
            },
            false,
            ["sign", "verify"]
          ),
        PS256: async () =>
          window.crypto.subtle.generateKey(
            {
              name: "RSA-PSS",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-256",
            },
            false,
            ["sign", "verify"]
          ),
        PS384: async () =>
          window.crypto.subtle.generateKey(
            {
              name: "RSA-PSS",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-384",
            },
            false,
            ["sign", "verify"]
          ),
        PS512: async () =>
          window.crypto.subtle.generateKey(
            {
              name: "RSA-PSS",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-512",
            },
            false,
            ["sign", "verify"]
          ),
        Ed25519: async () =>
          window.crypto.subtle.generateKey("Ed25519", false, [
            "sign",
            "verify",
          ]),
        Ed448: async () =>
          window.crypto.subtle.generateKey("Ed448", false, ["sign", "verify"]),
      };

      const testFunction =
        supportedAlgorithms[algorithm as keyof typeof supportedAlgorithms];
      if (!testFunction) return false;

      try {
        await testFunction();
        return true;
      } catch {
        return false;
      }
    } catch {
      return false;
    }
  };

  // Check algorithm browser support (use cached results)
  const checkAlgorithmSupport = (algorithm: string): boolean => {
    return algorithmSupport[algorithm] || false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 glass-card-dark rounded-2xl border border-border/40 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40">
          <div className="flex items-center space-x-3">
            <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
              <svg
                className="w-5 h-5 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                DPoP Configuration
              </h2>
              <p className="text-sm text-muted">Customize your DPoP settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:glass-card rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5 text-muted hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Algorithm Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-white">
                DPoP Algorithm
                <span className="text-muted text-xs ml-2">
                  {isCheckingSupport
                    ? "Testing browser support..."
                    : "Signature algorithm for DPoP proofs"}
                </span>
              </label>
              <button
                onClick={() => setShowAlgorithmInfo(true)}
                className="p-2 glass-button rounded-lg group flex items-center justify-center"
                title="View algorithm information"
              >
                <svg
                  className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="relative">
              <select
                value={settings.algorithm}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    algorithm: e.target.value,
                  }))
                }
                className="w-full p-3 pr-12 glass-input rounded-lg text-white transition-all duration-200"
                disabled={isCheckingSupport}
              >
                <option
                  value="ES256"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("ES256")
                  }
                >
                  ES256 (Elliptic Curve P-256){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("ES256")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="ES384"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("ES384")
                  }
                >
                  ES384 (Elliptic Curve P-384){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("ES384")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="ES512"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("ES512")
                  }
                >
                  ES512 (Elliptic Curve P-521){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("ES512")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="RS256"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("RS256")
                  }
                >
                  RS256 (RSA with SHA-256){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("RS256")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="RS384"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("RS384")
                  }
                >
                  RS384 (RSA with SHA-384){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("RS384")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="RS512"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("RS512")
                  }
                >
                  RS512 (RSA with SHA-512){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("RS512")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="PS256"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("PS256")
                  }
                >
                  PS256 (RSA-PSS with SHA-256){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("PS256")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="PS384"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("PS384")
                  }
                >
                  PS384 (RSA-PSS with SHA-384){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("PS384")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="PS512"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("PS512")
                  }
                >
                  PS512 (RSA-PSS with SHA-512){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("PS512")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="Ed25519"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("Ed25519")
                  }
                >
                  Ed25519 (Edwards Curve 25519){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("Ed25519")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="Ed448"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("Ed448")
                  }
                >
                  Ed448 (Edwards Curve 448){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("Ed448")
                    ? "- Not Supported"
                    : ""}
                </option>
              </select>
              {isCheckingSupport && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-accent animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Access Token Algorithm Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-white">
                Access Token Signing Algorithm
                <span className="text-muted text-xs ml-2">
                  {isCheckingSupport
                    ? "Testing browser support..."
                    : "Algorithm used by auth server to sign access tokens"}
                </span>
              </label>
              <button
                onClick={() => setShowAlgorithmInfo(true)}
                className="p-2 glass-button rounded-lg group flex items-center justify-center"
                title="View algorithm information"
              >
                <svg
                  className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            </div>
            <div className="relative">
              <select
                value={settings.accessTokenAlgorithm}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    accessTokenAlgorithm: e.target.value,
                  }))
                }
                className="w-full p-3 pr-12 glass-input rounded-lg text-white transition-all duration-200"
                disabled={isCheckingSupport}
              >
                <option
                  value="ES256"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("ES256")
                  }
                >
                  ES256 (Elliptic Curve P-256){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("ES256")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="ES384"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("ES384")
                  }
                >
                  ES384 (Elliptic Curve P-384){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("ES384")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="ES512"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("ES512")
                  }
                >
                  ES512 (Elliptic Curve P-521){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("ES512")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="RS256"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("RS256")
                  }
                >
                  RS256 (RSA with SHA-256){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("RS256")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="RS384"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("RS384")
                  }
                >
                  RS384 (RSA with SHA-384){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("RS384")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="RS512"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("RS512")
                  }
                >
                  RS512 (RSA with SHA-512){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("RS512")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="PS256"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("PS256")
                  }
                >
                  PS256 (RSA-PSS with SHA-256){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("PS256")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="PS384"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("PS384")
                  }
                >
                  PS384 (RSA-PSS with SHA-384){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("PS384")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="PS512"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("PS512")
                  }
                >
                  PS512 (RSA-PSS with SHA-512){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("PS512")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="Ed25519"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("Ed25519")
                  }
                >
                  Ed25519 (Edwards Curve 25519){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("Ed25519")
                    ? "- Not Supported"
                    : ""}
                </option>
                <option
                  value="Ed448"
                  disabled={
                    !isCheckingSupport && !checkAlgorithmSupport("Ed448")
                  }
                >
                  Ed448 (Edwards Curve 448){" "}
                  {isCheckingSupport
                    ? ""
                    : !checkAlgorithmSupport("Ed448")
                    ? "- Not Supported"
                    : ""}
                </option>
              </select>
              {isCheckingSupport && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-accent animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Authorization Server URL */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-white">
                Authorization Server URL
                <span className="text-muted text-xs ml-2">
                  Base URL of your OpenID Connect / OAuth 2.0 authorization
                  server
                </span>
              </label>
              <button
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    authServerUrl: "https://auth.example.com",
                    endpoints: null,
                  }))
                }
                className="p-2 glass-button rounded-lg group flex items-center justify-center"
                title="Reset to default"
                disabled={settings.authServerUrl === "https://auth.example.com"}
              >
                <svg
                  className="w-4 h-4 text-muted group-hover:text-accent transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="relative">
              <input
                type="url"
                value={settings.authServerUrl}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    authServerUrl: e.target.value,
                  }))
                }
                placeholder="https://auth.example.com"
                className="w-full p-3 pr-12 glass-input rounded-lg text-white placeholder-muted transition-all duration-200"
              />
              {isDiscovering && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-accent animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-light mt-2">
              💡 Will automatically fetch OIDC/OAuth endpoints from OIDC
              discovery document when available
            </div>
          </div>

          {/* Discovered Endpoints */}
          {settings.endpoints && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-white">
                Discovered Endpoints
                <span className="text-accent text-xs ml-2">
                  ✓ Auto-discovered from OIDC configuration
                </span>
              </label>
              <div className="space-y-2">
                <div className="p-3 glass-card rounded-lg border border-accent/20">
                  <div className="text-xs text-muted uppercase tracking-wider mb-1">
                    Authorization Endpoint
                  </div>
                  <div className="text-sm text-muted-light font-mono">
                    {settings.endpoints.authorization}
                  </div>
                </div>
                <div className="p-3 glass-card rounded-lg border border-accent/20">
                  <div className="text-xs text-muted uppercase tracking-wider mb-1">
                    Token Endpoint
                  </div>
                  <div className="text-sm text-muted-light font-mono">
                    {settings.endpoints.token}
                  </div>
                </div>
                <div className="p-3 glass-card rounded-lg border border-accent/20">
                  <div className="text-xs text-muted uppercase tracking-wider mb-1">
                    JWKS Endpoint
                  </div>
                  <div className="text-sm text-muted-light font-mono">
                    {settings.endpoints.jwks}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border/40 bg-background-secondary/30">
          <button
            onClick={onClose}
            className="glass-button-secondary px-6 py-2 text-sm font-medium text-muted-light hover:text-white rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            className="glass-button-primary px-6 py-2 text-white text-sm font-semibold rounded-lg"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Algorithm Information Modal */}
      <AlgorithmInfo
        isOpen={showAlgorithmInfo}
        onClose={() => setShowAlgorithmInfo(false)}
      />
    </div>
  );
}
