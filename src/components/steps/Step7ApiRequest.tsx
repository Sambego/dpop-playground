"use client";

import { useState, useEffect } from "react";
import Section from "@/components/Section";
import CopyButton from "@/components/ui/CopyButton";
import GlassButton from "@/components/ui/GlassButton";
import JwtIoButton from "@/components/ui/JwtIoButton";
import JsonWithTooltips from "@/components/ui/JsonWithTooltips";
import { type GeneratedKeyPair, signJwt } from "@/utils/cryptoUtils";

interface Step7ApiRequestProps {
  authServerUrl: string;
  dpopAccessToken: string;
  userEmail?: string;
  jwkThumbprint?: string;
  generatedKeys?: GeneratedKeyPair | null;
  algorithm?: string;
  onScrollToSection?: (sectionId: string) => void;
}

export default function Step7ApiRequest({
  dpopAccessToken,
  generatedKeys,
  algorithm = "ES256",
  onScrollToSection,
}: Step7ApiRequestProps) {
  const [realDpopJwt, setRealDpopJwt] = useState<string>("");
  const [isSigningDpop, setIsSigningDpop] = useState(false);

  // Mock hash for now since we can't use async in render
  const mockAccessTokenHash = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

  // Generate real DPoP JWT when keys are available
  useEffect(() => {
    const generateRealDpopJwt = async () => {
      if (generatedKeys && !isSigningDpop) {
        setIsSigningDpop(true);
        try {
          const payload = {
            jti: "d2f05d8-8713-11eb-a935-0242ac110003",
            htm: "GET",
            htu: "https://api.example.com/profile",
            iat: Math.floor(Date.now() / 1000),
            ath: mockAccessTokenHash,
          };

          const signedJwt = await signJwt(
            payload,
            generatedKeys.privateKey,
            algorithm,
            generatedKeys.jwk
          );

          setRealDpopJwt(signedJwt);
        } catch (error) {
          console.error("Failed to sign DPoP JWT:", error);
          // Fall back to mock signature if signing fails
          setRealDpopJwt("");
        } finally {
          setIsSigningDpop(false);
        }
      }
    };

    generateRealDpopJwt();
  }, [generatedKeys, algorithm, mockAccessTokenHash, isSigningDpop]);

  // Get JWK from generated keys or fallback
  const getJwkForDisplay = () => {
    if (generatedKeys) {
      return generatedKeys.jwk;
    }
    // Fallback mock JWK for display when keys aren't generated yet
    return {
      kty: "EC",
      crv: "P-256",
      x: "WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGHwHitJBcKWPiLcn8_jHXy9u4gp",
      y: "y77as5WYULGjrLUKV_D8XmcMDdCyEFBCZVgZKVEjNfU_qgRZUgLUV5wQVBa",
      alg: "ES256",
    };
  };

  // DPoP JWT payload for API request (includes ath claim)
  const apiDpopJwtPayload = `{
  "jti": "d2f05d8-8713-11eb-a935-0242ac110003",
  "htm": "GET", 
  "htu": "https://api.example.com/profile",
  "iat": ${Math.floor(Date.now() / 1000)},
  "ath": "${mockAccessTokenHash}"
}`;

  // Generate base64url encoded JWT parts
  const generateApiJwtParts = () => {
    const header = {
      typ: "dpop+jwt",
      alg: "ES256",
      jwk: getJwkForDisplay(),
    };
    const headerB64 = btoa(JSON.stringify(header))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const payload = {
      jti: "d2f05d8-8713-11eb-a935-0242ac110003",
      htm: "GET",
      htu: "https://api.example.com/profile",
      iat: Math.floor(Date.now() / 1000),
      ath: mockAccessTokenHash,
    };
    const payloadB64 = btoa(JSON.stringify(payload))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    const signature = "api_signature_example_here";

    return { header: headerB64, payload: payloadB64, signature };
  };

  // Use real DPoP JWT if available, otherwise fallback to generated parts
  const apiDpopJwtComplete =
    realDpopJwt ||
    (() => {
      const apiJwtParts = generateApiJwtParts();
      return `${apiJwtParts.header}.${apiJwtParts.payload}.${apiJwtParts.signature}`;
    })();

  // API request with DPoP
  const apiRequest = `GET /profile HTTP/1.1
Host: api.example.com
Authorization: DPoP ${dpopAccessToken}
DPoP: ${apiDpopJwtComplete}
Accept: application/json`;

  // Format API request with highlighting
  const formatApiRequest = () => {
    const lines = [
      `GET /profile HTTP/1.1`,
      `Host: api.example.com`,
      `Authorization: DPoP ${dpopAccessToken}`,
      `DPoP: ${apiDpopJwtComplete}`,
      `Accept: application/json`,
    ];
    return lines;
  };

  const apiRequestLines = formatApiRequest();
  const apiRequestString = apiRequest;

  return (
    <Section id="step7" className="bg-section-light">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[60vh]">
          {/* Left Column - Explanation */}
          <div className="space-y-6">
            <div className="border-l-4 border-accent pl-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Step 7: Request Protected API
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Make authenticated requests to protected endpoints using the
                DPoP-bound access token.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  DPoP Authentication Scheme
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To make a request to a protected API endpoint using our DPoP
                  protected Access token, we can attach it to the Authorization
                  header, using the DPoP authentication scheme.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Access Token Hash (ath) Claim
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  The request should also contain the DPoP header with a new
                  DPoP proof. This DPoP proof must include an Access Token Hash
                  (ath) claim with a valid hash of the associated Access Token.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Compatibility with Bearer Authentication
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Protected resources simultaneously supporting both the DPoP
                  and Bearer schemes need to update how evaluation of bearer
                  tokens is performed to prevent downgraded usage of a
                  DPoP-bound access token.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Specifically, such a protected resource MUST reject a
                  DPoP-bound access token received as a bearer token.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <div className="glass-card rounded-lg p-6 bg-green-500/10 border-green-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-400">
                    DPoP Implementation Complete!
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You've successfully implemented the complete DPoP flow! The
                  access token is cryptographically bound to your key pair and
                  can be used securely for API requests with proof of
                  possession.
                </p>
                {onScrollToSection && (
                  <div className="mt-4">
                    <GlassButton
                      onClick={() => onScrollToSection("step8")}
                      className="w-full"
                    >
                      See Security Benefits →
                    </GlassButton>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Code Example */}
          <div className="space-y-6">
            {/* API Request */}
            <div className="glass-card rounded-lg overflow-hidden hover-glow transform rotate-1 transition-transform duration-200 group">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  Protected API Request with DPoP
                </h3>
                <CopyButton content={apiRequestString} />
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {apiRequestLines.map((line, index) => {
                      if (index === 0) {
                        // GET line
                        return (
                          <div key={index} className="flex">
                            <div className="text-green-400">GET</div>
                            <div className="text-gray-300 ml-1">
                              /profile{" "}
                              <span className="text-gray-500">HTTP/1.1</span>
                            </div>
                          </div>
                        );
                      } else if (index === 1) {
                        // Host line
                        return (
                          <div key={index} className="flex">
                            <div className="text-green-400">Host: </div>
                            <div className="text-gray-300">api.example.com</div>
                          </div>
                        );
                      } else if (index === 2) {
                        // Authorization line with interactive access token
                        return (
                          <div key={index} className="relative group">
                            <div className="flex flex-wrap items-center">
                              <div className="text-green-400">
                                Authorization:{" "}
                              </div>
                              <div className="text-green-200">DPoP </div>
                              <div className="text-gray-300 break-all">
                                {dpopAccessToken}
                              </div>
                            </div>
                            <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 px-2 py-1 rounded-md border border-gray-700">
                              <JwtIoButton jwt={dpopAccessToken} />
                              <CopyButton content={dpopAccessToken} />
                            </div>
                          </div>
                        );
                      } else if (index === 3) {
                        // DPoP line with interactive proof
                        return (
                          <div key={index} className="relative group">
                            <div className="flex flex-wrap">
                              <div className="text-green-400">DPoP: </div>
                              <div className="text-gray-300 break-all">
                                {apiDpopJwtComplete}
                              </div>
                            </div>
                            <div className="absolute -top-2 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 px-2 py-1 rounded-md border border-gray-700 z-10">
                              <JwtIoButton jwt={apiDpopJwtComplete} />
                              <CopyButton content={apiDpopJwtComplete} />
                            </div>
                          </div>
                        );
                      } else {
                        // Accept line
                        return (
                          <div key={index} className="flex">
                            <div className="text-green-400">Accept: </div>
                            <div className="text-gray-300">
                              application/json
                            </div>
                          </div>
                        );
                      }
                    })}
                  </pre>
                </div>
              </div>
            </div>

            {/* DPoP Proof Payload for API */}
            <div className="glass-card rounded-lg overflow-hidden hover-glow transform -rotate-1 transition-transform duration-200 group">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  DPoP Proof Payload (with ath claim)
                </h3>
                <CopyButton content={apiDpopJwtPayload} />
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <JsonWithTooltips jsonString={apiDpopJwtPayload} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Note the <code className="text-accent">ath</code> claim
                  containing the SHA-256 hash of the access token
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
