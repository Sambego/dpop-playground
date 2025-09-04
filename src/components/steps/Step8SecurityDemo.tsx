"use client";

import Section from "@/components/Section";
import SplitCodeEditor from "@/components/ui/SplitCodeEditor";

interface Step8SecurityDemoProps {
  dpopAccessToken: string;
}

export default function Step8SecurityDemo({
  dpopAccessToken,
}: Step8SecurityDemoProps) {
  // Example of malicious bearer token attempt
  const maliciousBearerRequest = `GET /profile HTTP/1.1
Host: api.example.com
Authorization: Bearer ${dpopAccessToken}
Accept: application/json`;

  // Example of malicious DPoP attempt with wrong key
  const maliciousJwk = {
    kty: "EC",
    crv: "P-256",
    x: "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
    y: "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
    alg: "ES256",
  };

  const maliciousDpopHeader = {
    typ: "dpop+jwt",
    alg: "ES256",
    jwk: maliciousJwk,
  };

  const maliciousDpopPayload = {
    jti: "malicious-attempt-123",
    htm: "GET",
    htu: "https://api.example.com/profile",
    iat: Math.floor(Date.now() / 1000),
    ath: "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk",
  };

  // Generate fake malicious DPoP JWT
  const maliciousHeaderB64 = btoa(JSON.stringify(maliciousDpopHeader))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const maliciousPayloadB64 = btoa(JSON.stringify(maliciousDpopPayload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  const maliciousSignature = "FAKE_MALICIOUS_SIGNATURE_WILL_NOT_VERIFY";
  const maliciousDpopJwt = `${maliciousHeaderB64}.${maliciousPayloadB64}.${maliciousSignature}`;

  const maliciousDpopRequest = `GET /profile HTTP/1.1
Host: api.example.com
Authorization: DPoP ${dpopAccessToken}
DPoP: ${maliciousDpopJwt}
Accept: application/json`;

  // API rejection responses
  const bearerRejectionResponse = `HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "invalid_token",
  "error_description": "DPoP-bound access token cannot be used with Bearer authentication scheme"
}`;

  const dpopRejectionResponse = `HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "invalid_dpop_proof", 
  "error_description": "DPoP proof signature verification failed - public key mismatch"
}`;

  return (
    <Section id="step8" className="bg-section-warning relative">
      <div className="w-full max-w-7xl mx-auto">
        <div className="absolute top-0 left-0 h-[20px] w-[100%] bg-[repeating-linear-gradient(-45deg,theme(colors.yellow.400),theme(colors.yellow.400)_15px,theme(colors.gray.900)_15px,theme(colors.gray.900)_30px)]"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start min-h-[60vh]">
          {/* Left Column - Attack Demonstrations */}
          <div className="space-y-6">
            {/* Attack 1: Bearer Token Downgrade - Split View */}
            <SplitCodeEditor
              title="Attack 1: Bearer Token Downgrade"
              requestTitle="Malicious Request"
              responseTitle="Server Response"
              requestContent={maliciousBearerRequest}
              responseContent={bearerRejectionResponse}
              rotation="rotate-1"
              tokens={{
                accessToken: dpopAccessToken,
              }}
              responseType="json"
            />

            {/* Attack 2: Forged DPoP Proof - Split View */}
            <SplitCodeEditor
              title="Attack 2: Forged DPoP Proof"
              requestTitle="Malicious Request"
              responseTitle="Server Response"
              requestContent={maliciousDpopRequest}
              responseContent={dpopRejectionResponse}
              rotation="-rotate-1"
              tokens={{
                accessToken: dpopAccessToken,
                dpopProof: maliciousDpopJwt,
              }}
              responseType="json"
            />
          </div>

          {/* Right Column - Explanation */}
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                DPoP Security Benefits
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                See how DPoP protects against common attack scenarios where
                malicious actors attempt to misuse stolen access tokens.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Attack 1: Bearer Token Downgrade
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  A malicious actor attempts to use the DPoP-bound access token
                  as a regular Bearer token. The API server detects this
                  downgrade attack and rejects the request.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Attack 2: Forged DPoP Proof
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  An attacker tries to create their own DPoP proof using a
                  different key pair. The API server validates the proof
                  signature against the bound key and rejects the mismatched
                  proof.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  DPoP Protection
                </h3>
                <ul className="text-gray-400 space-y-2">
                  <li>• Prevents token theft and replay attacks</li>
                  <li>• Cryptographically binds tokens to key pairs</li>
                  <li>• Detects downgrade to Bearer authentication</li>
                  <li>• Validates proof signatures on every request</li>
                </ul>
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
                    DPoP Successfully Prevents Both Attacks!
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Your access token is cryptographically bound to your private
                  key, making it useless to attackers who don't possess the
                  corresponding private key used during token issuance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[20px] w-[100%] bg-[repeating-linear-gradient(-45deg,theme(colors.yellow.400),theme(colors.yellow.400)_15px,theme(colors.gray.900)_15px,theme(colors.gray.900)_30px)]"></div>
    </Section>
  );
}
