"use client";

import Section from "@/components/Section";
import CopyButton from "@/components/ui/CopyButton";
import GlassButton from "@/components/ui/GlassButton";
import JwtIoButton from "@/components/ui/JwtIoButton";
import JsonWithTooltips from "@/components/ui/JsonWithTooltips";
import { type GeneratedKeyPair } from "@/utils/cryptoUtils";

interface Step6TokenExchangeProps {
  authServerUrl: string;
  tokenEndpoint?: string;
  dpopJwt: string;
  authCode?: string;
  userEmail?: string;
  clientId?: string;
  jwkThumbprint?: string;
  onScrollToSection?: (sectionId: string) => void;
  dpopAccessToken?: string;
  accessTokenAlgorithm?: string;
  accessTokenKeys?: GeneratedKeyPair | null;
}

export default function Step6TokenExchange({
  authServerUrl,
  tokenEndpoint,
  dpopJwt,
  authCode = "SplxlOBeZQQYbYS6WxSbIA",
  userEmail = "sam@example.com",
  clientId = "myapp-client-id",
  jwkThumbprint,
  onScrollToSection,
  dpopAccessToken: externalDpopAccessToken,
  accessTokenAlgorithm = "RS256",
  accessTokenKeys,
}: Step6TokenExchangeProps) {
  const getTokenEndpointUrl = () => {
    if (tokenEndpoint) {
      return tokenEndpoint;
    }
    return `${authServerUrl}/token`;
  };

  const getTokenEndpointHost = () => {
    try {
      const url = new URL(getTokenEndpointUrl());
      return url.host;
    } catch {
      return "auth.example.com";
    }
  };

  const getTokenEndpointPath = () => {
    try {
      const url = new URL(getTokenEndpointUrl());
      return url.pathname;
    } catch {
      return "/token";
    }
  };

  // Generate a JWK thumbprint for the access token
  const generateJwkThumbprint = () => {
    // Use the actual thumbprint from generated keys if available
    return jwkThumbprint || "NzbLsXh8uDCcd-6MNwXF4W_7noWXFZAfHkxZsRGC9Xs";
  };

  // Token exchange request with wrapped DPoP proof and highlighted parameters
  const formatTokenRequest = () => {
    const lines = [
      `POST ${getTokenEndpointPath()} HTTP/1.1`,
      `Host: ${getTokenEndpointHost()}`,
      `Content-Type: application/x-www-form-urlencoded`,
      `DPoP: ${dpopJwt}`,
      `grant_type=authorization_code&code=${authCode}&redirect_uri=https://app.example.com/callback&client_id=${clientId}`,
    ];
    return lines;
  };

  const tokenRequestLines = formatTokenRequest();
  const tokenRequestString = `POST ${getTokenEndpointPath()} HTTP/1.1\nHost: ${getTokenEndpointHost()}\nContent-Type: application/x-www-form-urlencoded\nDPoP: ${dpopJwt}\n\ngrant_type=authorization_code&code=${authCode}&redirect_uri=https://app.example.com/callback&client_id=${clientId}`;

  // DPoP-protected access token (JWT format)
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
      jkt: generateJwkThumbprint(),
    },
    scope: "read write",
    email: userEmail,
    email_verified: true,
  };

  // Generate the complete access token
  const accessTokenHeader = btoa(JSON.stringify(dpopAccessTokenHeader))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const accessTokenPayload = btoa(JSON.stringify(dpopAccessTokenPayload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  // Generate a realistic base64url signature (mock but realistic format)
  const generateRealisticSignature = () => {
    const mockSignature = btoa(
      "mock_signature_" +
        Math.random().toString(36).substring(2) +
        "_" +
        Date.now().toString(36)
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
    return mockSignature.substring(0, 86); // Typical RS256 signature length
  };

  const accessTokenSignature = generateRealisticSignature();
  const internalDpopAccessToken = `${accessTokenHeader}.${accessTokenPayload}.${accessTokenSignature}`;

  // Use external access token if provided, otherwise use internal one
  const dpopAccessToken = externalDpopAccessToken || internalDpopAccessToken;

  // Decoded access token payload
  const decodedAccessTokenPayload = JSON.stringify(
    dpopAccessTokenPayload,
    null,
    2
  );

  return (
    <Section id="step6" className="bg-section-dark">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[60vh]">
          {/* Left Column - Code Examples */}
          <div className="space-y-6">
            {/* 1. Network Request */}
            <div className="glass-card rounded-lg overflow-hidden hover-glow transform rotate-1 transition-transform duration-200 group">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  1. Access token Request with DPoP Proof
                </h3>
                <CopyButton content={tokenRequestString} />
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
                    {tokenRequestLines.map((line, index) => {
                      if (index === 0) {
                        // POST line
                        return (
                          <div key={index} className="flex">
                            <div className="text-green-400">POST</div>
                            <div className="text-gray-300">
                              {getTokenEndpointPath()}
                            </div>
                            <div className="text-gray-500"> HTTP/1.1</div>
                          </div>
                        );
                      } else if (index === 1) {
                        // Host line
                        return (
                          <div key={index} className="flex">
                            <div className="text-green-400">Host: </div>
                            <div className="text-gray-300">
                              {getTokenEndpointHost()}
                            </div>
                          </div>
                        );
                      } else if (index === 2) {
                        // Content-Type line
                        return (
                          <div key={index} className="flex">
                            <div className="text-green-400">Content-Type: </div>
                            <div className="text-gray-300">
                              application/x-www-form-urlencoded
                            </div>
                          </div>
                        );
                      } else if (index === 3) {
                        return (
                          <div key={index} className="flex wrap-normal">
                            <div className="text-green-400">DPoP: </div>
                            <div className="text-gray-300 wrap-anywhere">
                              {dpopJwt}
                            </div>
                          </div>
                        );
                      } else {
                        // Body parameters - each parameter on a new line
                        const params = line.split("&");
                        return (
                          <div key={index}>
                            {params.map((param, paramIndex) => {
                              const [key, value] = param.split("=");
                              return (
                                <div key={paramIndex}>
                                  <span className="text-green-400">{key}</span>
                                  <span className="text-gray-300">=</span>
                                  <span className="text-gray-300">{value}</span>
                                </div>
                              );
                            })}
                          </div>
                        );
                      }
                    })}
                  </pre>
                </div>
              </div>
            </div>

            {/* 2. DPoP Protected Access Token */}
            <div className="glass-card rounded-lg overflow-hidden hover-glow transform -rotate-1 transition-transform duration-200 group">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  2. DPoP-Protected Access Token (JWT)
                </h3>
                <div className="flex items-center gap-2">
                  <JwtIoButton jwt={dpopAccessToken} />
                  <CopyButton content={dpopAccessToken} />
                </div>
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all">
                    <span className="text-blue-400">{accessTokenHeader}</span>
                    <span className="text-white">.</span>
                    <span className="text-purple-400">
                      {accessTokenPayload}
                    </span>
                    <span className="text-white">.</span>
                    <span className="text-green-400">
                      {accessTokenSignature}
                    </span>
                  </pre>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-400">Header</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-400">Payload (with jkt)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400">Signature</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Decoded Access Token Payload */}
            <div className="glass-card rounded-lg overflow-hidden hover-glow transform rotate-2 transition-transform duration-200 group">
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  3. Decoded Access Token Payload
                </h3>
                <CopyButton content={decodedAccessTokenPayload} />
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <JsonWithTooltips jsonString={decodedAccessTokenPayload} />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Note the <code className="text-accent">cnf.jkt</code> claim
                  containing the DPoP public key thumbprint
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Explanation */}
          <div className="space-y-6">
            <div className="border-l-4 border-accent pl-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Step 6: Exchange Authorization Code
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Exchange the authorization code for an access token with the
                DPoP proof.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Attach the DPoP proof to the request using the DPoP header
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  To request an access token that is bound to a public key using
                  DPoP, the client must provide a valid DPoP proof JWT in a DPoP
                  header when making an access token request to the
                  authorization server's /token endpoint. This is applicable for
                  all access token requests regardless of grant type (including,
                  for example, the common authorization_code and refresh_token
                  grant types but also extension grants such as the JWT
                  authorization grant).
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Validate DPoP proof on the Authorization server
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  The Authorization server can validate that the DPoP proof
                  found in the DPoP header has a valid signature, and is issued
                  for the correct {authServerUrl}/token URI and POST HTTP
                  method.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Add the DPoP public key thumbprint to the Access Token
                </h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  When access tokens are represented as JSON Web Tokens, the
                  DPoP proof's public key information should be represented
                  using the jkt confirmation method member in the access token's
                  header.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  To convey the hash of a public key in a JSON Web Token, the
                  specification introduces the JSON Web Key Thumbprint jkt
                  member under the confirmation cnf claim.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  With the DPoP proof's public key thumbprint available in the
                  Access Token, we can validate subsequent DPoP proofs are
                  issued by the same application that requested the Access
                  Token.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Use OAuth's introspection to confirm the Public Key's
                  thumbprint
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  If your access token is not a JSON Web Token, you can use
                  OAuth's introspection endpoint to get more metainformation
                  about the token. When you query the introspection endpoint for
                  a DPoP protected Access Token, it should also return that
                  confirmation cnf claim with the DPoP Proof's public key
                  thumbprint jkt.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <div className="glass-card rounded-lg p-6 bg-blue-500/10 border-blue-500/30">
                <div className="flex items-center space-x-3 mb-3">
                  <svg
                    className="w-6 h-6 text-blue-400"
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
                  <h3 className="text-lg font-semibold text-blue-400">
                    What's Next?
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  With the DPoP-bound access token, the client can now make
                  secure API requests. Each API call must include a new DPoP
                  proof that matches the token's bound key pair.
                </p>
                {onScrollToSection && (
                  <div className="mt-4">
                    <GlassButton
                      onClick={() => onScrollToSection("step7")}
                      className="w-full"
                    >
                      Make Protected API Request →
                    </GlassButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
