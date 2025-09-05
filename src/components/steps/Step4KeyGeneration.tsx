"use client";

import { useEffect, useState, useCallback } from "react";
import Section from "@/components/Section";
import {
  generateKeyPair,
  formatJwkForDisplay,
  type GeneratedKeyPair,
} from "@/utils/cryptoUtils";
import { useToast } from "@/contexts/ToastContext";
import JsonWithTooltips from "@/components/ui/JsonWithTooltips";
import CopyButton from "@/components/ui/CopyButton";
import GlassButton from "@/components/ui/GlassButton";

interface Step4KeyGenerationProps {
  algorithm: string;
  onScrollToSection: (sectionId: string) => void;
  onKeysGenerated: (keys: GeneratedKeyPair) => void;
  settingsLoaded: boolean;
}

export default function Step4KeyGeneration({
  algorithm,
  onScrollToSection,
  onKeysGenerated,
  settingsLoaded,
}: Step4KeyGenerationProps) {
  const [keys, setKeys] = useState<GeneratedKeyPair | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { showError, showSuccess } = useToast();

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

    const element = document.getElementById("step4");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const handleGenerateKeys = useCallback(async () => {
    setIsGenerating(true);
    try {
      const generatedKeys = await generateKeyPair(algorithm);
      setKeys(generatedKeys);
      onKeysGenerated(generatedKeys);
      showSuccess(
        "DPoP Keys Generated",
        `${algorithm} key pair generated successfully for signing DPoP proofs`
      );
    } catch (error) {
      console.error("Key generation failed:", error);
      showError(
        "Key Generation Failed",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [algorithm, onKeysGenerated, showError, showSuccess]);

  // Auto-generate keys when algorithm changes and settings are loaded
  useEffect(() => {
    if (settingsLoaded && algorithm && (!keys || keys.jwk.alg !== algorithm)) {
      handleGenerateKeys();
    }
  }, [algorithm, keys, handleGenerateKeys, settingsLoaded]);

  return (
    <Section id="step4" className="bg-section-dark">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh] lg:grid-flow-col-dense">
          {/* Right Column - Code Editors */}
          <div className="lg:col-start-2 space-y-6">
            {/* Private Key JWK */}
            <div
              className={`
                glass-card rounded-lg overflow-hidden hover-glow
                transform transition-all duration-700 ease-out
                rotate-1
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center group">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  Private Key (JWK Format)
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </h3>
                {keys && (
                  <CopyButton content={formatJwkForDisplay(keys.privateJwk)} />
                )}
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {keys ? (
                    <JsonWithTooltips
                      jsonString={formatJwkForDisplay(keys.privateJwk)}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      {isGenerating ? (
                        <div className="flex items-center space-x-3">
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
                          <span className="text-accent">
                            Generating key pair...
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">No keys generated</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Public Key JWK */}
            <div
              className={`
                glass-card rounded-lg overflow-hidden hover-glow
                transform transition-all duration-700 ease-out delay-200
                -rotate-1
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center group">
                <h3 className="text-sm font-semibold text-white">
                  Public Key (JWK Format)
                </h3>
                {keys && <CopyButton content={formatJwkForDisplay(keys.jwk)} />}
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {keys ? (
                    <JsonWithTooltips
                      jsonString={formatJwkForDisplay(keys.jwk)}
                    />
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      {isGenerating ? (
                        <div className="flex items-center space-x-3">
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
                          <span className="text-accent">
                            Generating key pair...
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">No keys generated</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* JWK Thumbprint */}
            <div
              className={`
                glass-card rounded-lg overflow-hidden hover-glow
                transform transition-all duration-700 ease-out delay-400
                rotate-2
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                }
              `}
            >
              <div className="bg-gray-900/50 px-4 py-3 border-b border-gray-700 flex justify-between items-center group">
                <h3 className="text-sm font-semibold text-white">
                  Public Key JWK Thumbprint (
                  <a
                    href="https://tools.ietf.org/rfc/rfc7638.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-light underline"
                  >
                    RFC 7638
                  </a>
                  )
                </h3>
                {keys && <CopyButton content={keys.thumbprint} />}
              </div>
              <div className="p-4">
                <div className="bg-code-editor rounded-lg p-4 font-mono text-sm text-gray-300 overflow-x-auto">
                  {keys ? (
                    <pre className="whitespace-pre-wrap break-all">
                      {keys.thumbprint}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center py-4">
                      <span className="text-gray-500">
                        Public key thumbprint will appear after key generation
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Left Column - Explanation */}
          <div className="lg:col-start-1 space-y-6">
            <div
              className={`
                transform transition-all duration-700 ease-out delay-300
                ${
                  isVisible
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-8 opacity-0"
                }
              `}
            >
              <div className="border-l-4 border-accent pl-6">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Step 4: Generate Key Pair
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Before creating DPoP proofs, we need to generate a
                  cryptographic key pair. The public key will be included in
                  DPoP JWTs, while the private key will be used for signing.
                </p>
              </div>

              <div className="my-4 space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Key Generation Process
                </h3>
                <div className="space-y-4 text-gray-400">
                  <p>
                    The client generates a key pair using the configured
                    algorithm ({algorithm}). This key pair will be used for all
                    subsequent DPoP proofs.
                  </p>
                  <p>
                    The public key is formatted as a JSON Web Key (JWK) and will
                    be included in the DPoP JWT header for server verification.
                  </p>
                </div>
              </div>

              <div className="my-4 space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Public Key JWK Thumbprint
                </h3>
                <div className="space-y-4 text-gray-400">
                  <p>
                    The public key JWK thumbprint is a SHA-256 hash of the
                    canonical public key JWK representation (
                    <a
                      href="https://tools.ietf.org/rfc/rfc7638.txt"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-light underline"
                    >
                      RFC 7638
                    </a>
                    ). It provides a stable identifier for the key pair.
                  </p>
                  <p>
                    This thumbprint can be used by authorization servers to
                    track and bind tokens to specific key pairs across multiple
                    requests without needing to store the full JWK.
                  </p>
                </div>
              </div>

              <div className="my-4 space-y-4">
                <h3 className="text-xl font-bold text-white">
                  Security Benefits
                </h3>
                <ul className="list-disc pl-4 text-gray-400 space-y-2">
                  <li>Fresh key pair generated for each session</li>
                  <li>Private key never leaves the client</li>
                  <li>Public key enables server verification</li>
                  <li>Thumbprint provides stable key identification</li>
                </ul>
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
                      Create Your First DPoP Proof
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    With your key pair generated, you're ready to create a DPoP
                    proof JWT. This proof will demonstrate possession of the
                    private key and can be used to bind tokens to your client
                    application.
                  </p>
                  <GlassButton
                    onClick={() => onScrollToSection("step5")}
                    disabled={!keys || isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
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
                        <span>Generating Keys...</span>
                      </>
                    ) : keys ? (
                      <span>Create DPoP Proof with these keys →</span>
                    ) : (
                      <span>Generate Keys First</span>
                    )}
                  </GlassButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
