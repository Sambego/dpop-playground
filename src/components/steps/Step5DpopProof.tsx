"use client";

import { useEffect, useState } from "react";
import Section from "@/components/Section";
import CopyButton from "@/components/ui/CopyButton";
import GlassButton from "@/components/ui/GlassButton";
import JwtIoButton from "@/components/ui/JwtIoButton";
import JsonWithTooltips from "@/components/ui/JsonWithTooltips";
import { type GeneratedKeyPair } from "@/utils/cryptoUtils";

interface Step5DpopProofProps {
  algorithm: string;
  authServerUrl: string;
  generatedKeys: GeneratedKeyPair | null;
  jwtParts: { header: string; payload: string; signature: string } | null;
  onScrollToSection: (sectionId: string) => void;
}

export default function Step5DpopProof({
  algorithm,
  authServerUrl,
  generatedKeys,
  jwtParts,
  onScrollToSection,
}: Step5DpopProofProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('step5');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

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
      alg: algorithm,
    };
  };

  // Code examples
  const dpopJwtHeader = `{
  "typ": "dpop+jwt",
  "alg": "${algorithm}",  
  "jwk": ${JSON.stringify(getJwkForDisplay(), null, 4)
    .replace(/^/gm, "    ")
    .trim()}
}`;

  const dpopJwtPayload = `{
  "jti": "c1f05d8-8713-11eb-a935-0242ac110002",
  "htm": "POST", 
  "htu": "${authServerUrl}/oauth/token",
  "iat": ${Math.floor(Date.now() / 1000)}
}`;

  // JWT Parts for highlighting - now generated with real signatures
  const jwtHeader = jwtParts?.header || "loading";
  const jwtPayload = jwtParts?.payload || "loading";
  const jwtSignature = jwtParts?.signature || "loading";

  // Generate a complete DPoP JWT (base64url encoded header.payload.signature)
  const dpopJwtComplete = `${jwtHeader}.${jwtPayload}.${jwtSignature}`;

  return (
    <Section id="step5" className="bg-section-light">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] lg:grid-flow-col-dense">
          {/* Left Column - Explanation */}
          <div className="space-y-6">
            <div
              className={`
                transform transition-all duration-700 ease-out
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0"
                }
              `}
            >
              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Step 5: Generate DPoP Proof JWT
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Using the generated key pair from the previous step, the
                  client creates a DPoP proof JWT to demonstrate possession of
                  the private key. This JWT will be sent as a DPoP header with
                  token requests.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">How It Works</h3>
                <div className="space-y-3 text-gray-400">
                  <p>
                    The DPoP proof is a JSON Web Token (JWT) that
                    cryptographically binds the access token to a specific
                    client through public-key cryptography.
                  </p>
                  <p>
                    It consists of three Base64URL-encoded parts separated by
                    dots:
                    <code className="text-accent">
                      Header.Payload.Signature
                    </code>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">JWT Components</h3>
                <div className="space-y-3">
                  <div className="p-4 glass-card rounded-lg">
                    <h4 className="font-semibold text-accent mb-2">Header</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>
                        • <code className="text-accent">typ</code>: DPoP JWT
                        type identifier
                      </li>
                      <li>
                        • <code className="text-accent">alg</code>: {algorithm}
                        signature algorithm
                      </li>
                      <li>
                        • <code className="text-accent">jwk</code>: Public key
                        for verification
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 glass-card rounded-lg">
                    <h4 className="font-semibold text-accent mb-2">Payload</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>
                        • <code className="text-accent">jti</code>: Unique JWT
                        identifier
                      </li>
                      <li>
                        • <code className="text-accent">htm</code>: HTTP method
                        (POST)
                      </li>
                      <li>
                        • <code className="text-accent">htu</code>: Target token
                        endpoint
                      </li>
                      <li>
                        • <code className="text-accent">iat</code>: Issued at
                        timestamp
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Security Benefits
                </h3>
                <ul className="text-gray-400 space-y-2">
                  <li>
                    • Cryptographically signed with the client's private key
                  </li>
                  <li>• Bound to specific HTTP method and target URL</li>
                  <li>• Contains the public key for server verification</li>
                  <li>• Prevents token theft and replay attacks</li>
                </ul>
              </div>

              <div className="pt-6">
                <div className="glass-card rounded-lg p-6 bg-blue-500/10 border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-3">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-blue-400">DPoP Proof Ready!</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    The DPoP proof JWT is now ready to be used in the token exchange request. 
                    This proof will bind the access token to your cryptographic key pair.
                  </p>
                  <div className="mt-4">
                    <GlassButton
                      onClick={() => onScrollToSection("step6")}
                      className="w-full"
                    >
                      Exchange Code for Access Token →
                    </GlassButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Code Editors */}
          <div className="space-y-6">
            {/* Complete JWT */}
            <div
              className={`
                glass-card rounded-lg overflow-hidden hover-glow transform rotate-1 transition-all duration-700 ease-out
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  Complete DPoP Proof JWT
                </h3>
                <div className="flex items-center gap-2">
                  <JwtIoButton jwt={dpopJwtComplete} />
                  <CopyButton content={dpopJwtComplete} />
                </div>
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-all">
                    <span className="text-blue-400">{jwtHeader}</span>
                    <span className="text-white">.</span>
                    <span className="text-purple-400">{jwtPayload}</span>
                    <span className="text-white">.</span>
                    <span className="text-green-400">{jwtSignature}</span>
                  </pre>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-400">Header</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-400">Payload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-400">Signature</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  This complete JWT is sent as the{" "}
                  <code className="text-accent">DPoP</code> header value
                </p>
              </div>
            </div>

            {/* Decoded Header */}
            <div
              className={`
                glass-card rounded-lg overflow-hidden hover-glow transform -rotate-1 transition-all duration-700 ease-out delay-200
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  Decoded JWT Header
                </h3>
                <CopyButton content={dpopJwtHeader} />
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <JsonWithTooltips jsonString={dpopJwtHeader} />
                </div>
              </div>
            </div>

            {/* Decoded Payload */}
            <div
              className={`
                glass-card rounded-lg overflow-hidden hover-glow transform rotate-2 transition-all duration-700 ease-out delay-400
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-white">
                  Decoded JWT Payload
                </h3>
                <CopyButton content={dpopJwtPayload} />
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <JsonWithTooltips jsonString={dpopJwtPayload} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}