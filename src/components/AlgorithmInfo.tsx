"use client";

import React from 'react';

interface AlgorithmInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlgorithmSupport {
  name: string;
  description: string;
  keyType: string;
  curve?: string;
  keySize?: string;
  supported: boolean;
  security: "High" | "Very High" | "Maximum";
  performance: "Fast" | "Excellent" | "Very Good" | "Good" | "Fair";
}

export default function AlgorithmInfo({ isOpen, onClose }: AlgorithmInfoProps) {
  const [algorithmSupport, setAlgorithmSupport] = React.useState<Record<string, boolean>>({});
  const [isChecking, setIsChecking] = React.useState(true);

  // Actually test browser support for algorithms
  const checkAlgorithmSupport = async (algorithm: string): Promise<boolean> => {
    if (typeof window === "undefined") return false;

    try {
      // Check if Web Crypto API is available
      if (!window.crypto || !window.crypto.subtle) return false;

      // Try to actually generate a key with the algorithm to test support
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

      const testFunction = supportedAlgorithms[algorithm as keyof typeof supportedAlgorithms];
      if (!testFunction) return false;

      try {
        await testFunction();
        return true;
      } catch (error) {
        return false;
      }
    } catch {
      return false;
    }
  };

  // Check all algorithms when component opens
  React.useEffect(() => {
    if (!isOpen) return;

    const checkAllAlgorithms = async () => {
      setIsChecking(true);
      const algorithms = ['ES256', 'ES384', 'ES512', 'RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512', 'Ed25519', 'Ed448'];
      const supportResults: Record<string, boolean> = {};

      for (const alg of algorithms) {
        supportResults[alg] = await checkAlgorithmSupport(alg);
        // Add a small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setAlgorithmSupport(supportResults);
      setIsChecking(false);
    };

    checkAllAlgorithms();
  }, [isOpen]);

  if (!isOpen) return null;
  const algorithms: AlgorithmSupport[] = [
    {
      name: "ES256",
      description: "ECDSA using P-256 curve and SHA-256 hash",
      keyType: "Elliptic Curve",
      curve: "P-256",
      supported: algorithmSupport["ES256"] || false,
      security: "High",
      performance: "Excellent",
    },
    {
      name: "ES384",
      description: "ECDSA using P-384 curve and SHA-384 hash",
      keyType: "Elliptic Curve",
      curve: "P-384",
      supported: algorithmSupport["ES384"] || false,
      security: "Very High",
      performance: "Excellent",
    },
    {
      name: "ES512",
      description: "ECDSA using P-521 curve and SHA-512 hash",
      keyType: "Elliptic Curve",
      curve: "P-521",
      supported: algorithmSupport["ES512"] || false,
      security: "Maximum",
      performance: "Excellent",
    },
    {
      name: "RS256",
      description: "RSASSA-PKCS1-v1_5 using SHA-256 hash",
      keyType: "RSA",
      keySize: "2048+ bits",
      supported: algorithmSupport["RS256"] || false,
      security: "High",
      performance: "Fair",
    },
    {
      name: "RS384",
      description: "RSASSA-PKCS1-v1_5 using SHA-384 hash",
      keyType: "RSA",
      keySize: "2048+ bits",
      supported: algorithmSupport["RS384"] || false,
      security: "Very High",
      performance: "Fair",
    },
    {
      name: "RS512",
      description: "RSASSA-PKCS1-v1_5 using SHA-512 hash",
      keyType: "RSA",
      keySize: "2048+ bits",
      supported: algorithmSupport["RS512"] || false,
      security: "Maximum",
      performance: "Fair",
    },
    {
      name: "PS256",
      description: "RSASSA-PSS using SHA-256 hash",
      keyType: "RSA",
      keySize: "2048+ bits",
      supported: algorithmSupport["PS256"] || false,
      security: "Very High",
      performance: "Fair",
    },
    {
      name: "PS384",
      description: "RSASSA-PSS using SHA-384 hash",
      keyType: "RSA",
      keySize: "2048+ bits",
      supported: algorithmSupport["PS384"] || false,
      security: "Maximum",
      performance: "Fair",
    },
    {
      name: "PS512",
      description: "RSASSA-PSS using SHA-512 hash",
      keyType: "RSA",
      keySize: "2048+ bits",
      supported: algorithmSupport["PS512"] || false,
      security: "Maximum",
      performance: "Fair",
    },
    {
      name: "Ed25519",
      description: "Edwards Curve Digital Signature Algorithm using Curve25519",
      keyType: "Edwards Curve",
      curve: "Curve25519",
      supported: algorithmSupport["Ed25519"] || false,
      security: "Very High",
      performance: "Excellent",
    },
    {
      name: "Ed448",
      description: "Edwards Curve Digital Signature Algorithm using Curve448",
      keyType: "Edwards Curve",
      curve: "Curve448",
      supported: algorithmSupport["Ed448"] || false,
      security: "Maximum",
      performance: "Excellent",
    },
  ];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass-card-dark rounded-2xl border border-border/40">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                DPoP Algorithm Support
              </h2>
              <p className="text-sm text-muted">
                Cryptographic algorithms and browser compatibility
              </p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Browser Support Notice */}
            <div className="p-4 glass-card border border-accent/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-accent mt-0.5 flex-shrink-0"
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
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">
                    Real-Time Browser Compatibility Check
                  </p>
                  <p className="text-muted-light">
                    {isChecking 
                      ? "Testing algorithm support in your current browser..." 
                      : "The results below show actual support tested in your current browser's Web Crypto API implementation."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Algorithm Grid */}
            <div className="grid gap-4">
              {algorithms.map((alg) => (
                <div
                  key={alg.name}
                  className={`p-4 rounded-lg border transition-all duration-200 relative ${
                    isChecking
                      ? "glass-card border-muted/30"
                      : alg.supported
                      ? "glass-card border-accent/20 hover:border-accent/30"
                      : "glass-card border-muted-dark/30 opacity-60"
                  }`}
                >
                  {isChecking && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg backdrop-blur-sm">
                      <svg className="w-6 h-6 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {alg.name}
                        </h3>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            isChecking
                              ? "bg-muted/20 text-muted border border-muted/30"
                              : alg.supported
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : "bg-muted-dark/20 text-muted border border-muted-dark/30"
                          }`}
                        >
                          {isChecking ? "Testing..." : alg.supported ? "Supported" : "Not Available"}
                        </div>
                      </div>

                      <p className="text-muted-light text-sm mb-3">
                        {alg.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-muted uppercase tracking-wider">
                            Key Type
                          </span>
                          <div className="text-white font-medium">
                            {alg.keyType}
                          </div>
                        </div>

                        {alg.curve && (
                          <div>
                            <span className="text-muted uppercase tracking-wider">
                              Curve
                            </span>
                            <div className="text-white font-medium">
                              {alg.curve}
                            </div>
                          </div>
                        )}

                        {alg.keySize && (
                          <div>
                            <span className="text-muted uppercase tracking-wider">
                              Key Size
                            </span>
                            <div className="text-white font-medium">
                              {alg.keySize}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-muted uppercase tracking-wider">
                            Security
                          </span>
                          <div className={`font-medium`}>{alg.security}</div>
                        </div>

                        <div>
                          <span className="text-muted uppercase tracking-wider">
                            Performance
                          </span>
                          <div className={`font-medium`}>{alg.performance}</div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                      {alg.supported ? (
                        <svg
                          className="w-6 h-6 text-accent"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-6 h-6 text-muted-dark"
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
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="p-4 glass-card border border-border/40 rounded-lg">
              <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Recommendations</span>
              </h3>
              <div className="space-y-2 text-sm text-muted-light">
                <p>
                  • <strong className="text-white">ES256</strong> is recommended
                  for most applications due to excellent browser support and
                  performance
                </p>
                <p>
                  • <strong className="text-white">ES384/ES512</strong> offer
                  higher security levels for sensitive applications
                </p>
                <p>
                  • <strong className="text-white">RS256/RS384/RS512</strong> are
                  suitable when RSASSA-PKCS1-v1_5 keys are required by your infrastructure
                </p>
                <p>
                  • <strong className="text-white">PS256/PS384/PS512</strong> are
                  recommended for RSA-PSS with enhanced security properties
                </p>
                <p>
                  • <strong className="text-white">Ed25519/Ed448</strong> are
                  emerging with excellent performance but have limited browser support currently
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-border/40 bg-background-secondary/30">
          <button
            onClick={onClose}
            className="glass-button-primary px-6 py-2 text-sm font-semibold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
