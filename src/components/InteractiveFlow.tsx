"use client";

import { useState, useEffect, useRef } from "react";
import Step1UserLogin from "@/components/steps/Step1UserLogin";
import Step2AuthServer from "@/components/steps/Step2AuthServer";
import Step3AuthCode from "@/components/steps/Step3AuthCode";
import Step4KeyGeneration from "@/components/steps/Step4KeyGeneration";
import Step5DpopProof from "@/components/steps/Step5DpopProof";
import Step6TokenExchange from "@/components/steps/Step6TokenExchange";
import Step7ApiRequest from "@/components/steps/Step7ApiRequest";
import Step8SecurityDemo from "@/components/steps/Step8SecurityDemo";
import { safeJsonParse, isDpopSettings } from "@/utils/security";
import { useToast } from "@/contexts/ToastContext";
import { type GeneratedKeyPair, generateKeyPair, signJwt } from "@/utils/cryptoUtils";

interface InteractiveFlowProps {
  onScrollToSection: (sectionId: string) => void;
}

export default function InteractiveFlow({
  onScrollToSection,
}: InteractiveFlowProps) {
  const { showWarning, showSuccess } = useToast();
  const [authServerUrl, setAuthServerUrl] = useState(
    "https://auth.example.com"
  );
  const [authorizationEndpoint, setAuthorizationEndpoint] = useState("");
  const [tokenEndpoint, setTokenEndpoint] = useState("");
  const [userEmail, setUserEmail] = useState("sam@example.com");
  const [algorithm, setAlgorithm] = useState("ES256");
  const [accessTokenAlgorithm, setAccessTokenAlgorithm] = useState("RS256");
  const [generatedKeys, setGeneratedKeys] = useState<GeneratedKeyPair | null>(
    null
  );
  const [accessTokenKeys, setAccessTokenKeys] = useState<GeneratedKeyPair | null>(
    null
  );
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [jwtParts, setJwtParts] = useState<{ header: string; payload: string; signature: string } | null>(null);

  // Load settings from localStorage with safe parsing
  useEffect(() => {
    const stored = localStorage.getItem("dpop-settings");
    if (stored) {
      const settings = safeJsonParse(stored, isDpopSettings);
      if (settings) {
        // Only update authServerUrl if it's actually different to avoid unnecessary re-renders
        if (settings.authServerUrl && settings.authServerUrl.trim()) {
          setAuthServerUrl(prev => prev === settings.authServerUrl ? prev : settings.authServerUrl);
        } else if (!settings.authServerUrl) {
          setAuthServerUrl(prev => prev === "https://auth.example.com" ? prev : "https://auth.example.com");
        }
        setAlgorithm(settings.algorithm || "ES256");
        setAccessTokenAlgorithm(settings.accessTokenAlgorithm || "RS256");
        if (settings.endpoints?.authorization) {
          setAuthorizationEndpoint(settings.endpoints.authorization);
        }
        if (settings.endpoints?.token) {
          setTokenEndpoint(settings.endpoints.token);
        }
        setSettingsLoaded(true);
      } else {
        console.warn("Invalid settings format in localStorage, using defaults");
        showWarning(
          "Settings Invalid",
          "Using default configuration due to invalid stored settings"
        );
      }
    } else {
      // No stored settings, use defaults
      setSettingsLoaded(true);
    }
  }, [showWarning]);

  // Listen for settings changes with safe parsing
  useEffect(() => {
    const handleSettingsChange = () => {
      const stored = localStorage.getItem("dpop-settings");
      if (stored) {
        const settings = safeJsonParse(stored, isDpopSettings);
        if (settings) {
          // Only update authServerUrl if it's actually different to avoid interfering with user input
          if (settings.authServerUrl && settings.authServerUrl.trim()) {
            setAuthServerUrl(prev => prev === settings.authServerUrl ? prev : settings.authServerUrl);
          } else if (!settings.authServerUrl) {
            setAuthServerUrl(prev => prev === "https://auth.example.com" ? prev : "https://auth.example.com");
          }
          setAlgorithm(settings.algorithm || "ES256");
          setAccessTokenAlgorithm(settings.accessTokenAlgorithm || "RS256");
          if (settings.endpoints?.authorization) {
            setAuthorizationEndpoint(settings.endpoints.authorization);
          }
          if (settings.endpoints?.token) {
            setTokenEndpoint(settings.endpoints.token);
          }
        } else {
          console.warn(
            "Invalid settings format in localStorage during change event"
          );
          showWarning(
            "Settings Changed",
            "Configuration updated but some settings were invalid"
          );
        }
      }
    };

    window.addEventListener("dpop-settings-changed", handleSettingsChange);
    window.addEventListener("storage", handleSettingsChange);

    return () => {
      window.removeEventListener("dpop-settings-changed", handleSettingsChange);
      window.removeEventListener("storage", handleSettingsChange);
    };
  }, [showWarning]);

  // Generate JWT parts with real signatures when keys or algorithm change
  useEffect(() => {
    const generateRealJwtParts = async () => {
      if (!generatedKeys) {
        // Set fallback parts when keys aren't available
        setJwtParts({
          header: "eyJ0eXAiOiJkcG9wK2p3dCIsImFsZyI6IkVTMjU2IiwiandrIjp7Im1vY2siOiJ2YWx1ZSJ9fQ",
          payload: "eyJqdGkiOiJjMWYwNWQ4LTg3MTMtMTFlYi1hOTM1LTAyNDJhYzExMDAwMiIsImh0bSI6IlBPU1QiLCJodHUiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20vb2F1dGgvdG9rZW4iLCJpYXQiOjE2NDE0MDUwMDB9",
          signature: "keys-not-generated-yet"
        });
        return;
      }

      try {
        const header = {
          typ: "dpop+jwt",
          alg: algorithm,
          jwk: generatedKeys.jwk,
        };

        const payload = {
          jti: "c1f05d8-8713-11eb-a935-0242ac110002",
          htm: "POST",
          htu: `${authServerUrl}/oauth/token`,
          iat: Math.floor(Date.now() / 1000),
        };

        // Generate real signature using the actual private key
        const fullJwt = await signJwt(payload, generatedKeys.privateKey, algorithm, generatedKeys.jwk);
        const [headerB64, payloadB64, signature] = fullJwt.split('.');

        setJwtParts({
          header: headerB64,
          payload: payloadB64,
          signature: signature
        });
      } catch (error) {
        console.error('Failed to generate JWT parts:', error);
        // Fallback to error state
        setJwtParts({
          header: "header-generation-failed",
          payload: "payload-generation-failed", 
          signature: "signature-generation-failed"
        });
      }
    };

    generateRealJwtParts();
  }, [generatedKeys, algorithm, authServerUrl]);

  // Generate access token keys when needed
  useEffect(() => {
    const generateAccessTokenKeys = async () => {
      if (!settingsLoaded || !accessTokenAlgorithm) return;
      if (accessTokenKeys && accessTokenKeys.jwk.alg === accessTokenAlgorithm) return;

      try {
        const keys = await generateKeyPair(accessTokenAlgorithm);
        setAccessTokenKeys(keys);
        
        // Show toast for all key generation (not just after initial load)
        // The user should be notified whenever keys are regenerated
        showSuccess('Access Token Keys Generated', `${accessTokenAlgorithm} key pair generated successfully for signing access tokens`);
      } catch (error) {
        console.error("Failed to generate access token keys:", error);
        setAccessTokenKeys(null);
      }
    };

    generateAccessTokenKeys();
  }, [settingsLoaded, accessTokenAlgorithm, showSuccess]);

  // Generate a complete DPoP JWT (base64url encoded header.payload.signature)
  const dpopJwtComplete = `${jwtParts?.header || "loading"}.${jwtParts?.payload || "loading"}.${jwtParts?.signature || "loading"}`;

  // Generate DPoP-protected access token for Step 6 and Step 7
  const generateDpopAccessToken = () => {
    const dpopAccessTokenHeader = {
      alg: accessTokenAlgorithm,
      typ: "at+jwt",
      kid: accessTokenKeys?.thumbprint || "auth-server-key-1",
    };

    const dpopAccessTokenPayload = {
      iss: authServerUrl,
      sub: userEmail,
      aud: "https://api.example.com",
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      cnf: {
        jkt: generatedKeys?.thumbprint || "NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs",
      },
      scope: "read write",
      email: userEmail,
      email_verified: true,
    };

    const accessTokenHeader = btoa(JSON.stringify(dpopAccessTokenHeader))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    
    const accessTokenPayload = btoa(JSON.stringify(dpopAccessTokenPayload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    // Generate a realistic signature (deterministic based on time)
    const generateRealisticSignature = () => {
      const mockSignature = btoa(
        "mock_signature_" + 
        Math.floor(Date.now() / 10000).toString(36) + // Less frequent changes
        "_" + userEmail.substring(0, 3)
      ).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      return mockSignature.substring(0, 86);
    };
    
    const accessTokenSignature = generateRealisticSignature();
    return `${accessTokenHeader}.${accessTokenPayload}.${accessTokenSignature}`;
  };

  const dpopAccessToken = generateDpopAccessToken();





  return (
    <>
      {/* Step 1: User wants to login */}
      <Step1UserLogin onScrollToSection={onScrollToSection} />

      {/* Step 2: Authorization server login */}
      <Step2AuthServer
        userEmail={userEmail}
        onEmailChange={setUserEmail}
        onScrollToSection={onScrollToSection}
        authServerUrl={authServerUrl}
        authorizationEndpoint={authorizationEndpoint}
      />

      {/* Step 3: Get Authorization Code */}
      <Step3AuthCode
        userEmail={userEmail}
        onScrollToSection={onScrollToSection}
      />

      {/* Step 4: Generate Key Pair */}
      <Step4KeyGeneration
        algorithm={algorithm}
        onScrollToSection={onScrollToSection}
        onKeysGenerated={setGeneratedKeys}
        settingsLoaded={settingsLoaded}
      />

      {/* Step 5: Create DPoP proof */}
      <Step5DpopProof
        algorithm={algorithm}
        authServerUrl={authServerUrl}
        generatedKeys={generatedKeys}
        jwtParts={jwtParts}
        onScrollToSection={onScrollToSection}
      />

      {/* Step 6: Token Exchange */}
      <Step6TokenExchange
        authServerUrl={authServerUrl}
        tokenEndpoint={tokenEndpoint}
        dpopJwt={dpopJwtComplete}
        userEmail={userEmail}
        clientId="myapp-client-id"
        authCode="SplxlOBeZQQYbYS6WxSbIA"
        jwkThumbprint={generatedKeys?.thumbprint}
        onScrollToSection={onScrollToSection}
        dpopAccessToken={dpopAccessToken}
        accessTokenAlgorithm={accessTokenAlgorithm}
        accessTokenKeys={accessTokenKeys}
      />

      {/* Step 7: API Request */}
      <Step7ApiRequest
        authServerUrl={authServerUrl}
        dpopAccessToken={dpopAccessToken}
        userEmail={userEmail}
        jwkThumbprint={generatedKeys?.thumbprint}
        generatedKeys={generatedKeys}
        algorithm={algorithm}
        onScrollToSection={onScrollToSection}
      />

      {/* Step 8: Security Demonstration */}
      <Step8SecurityDemo 
        dpopAccessToken={dpopAccessToken}
      />

    </>
  );
}
