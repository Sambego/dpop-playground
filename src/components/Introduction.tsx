"use client";

import { RFC_URLS } from "@/constants/app";

interface IntroductionProps {
  onGetStarted: () => void;
}

export default function Introduction({ onGetStarted }: IntroductionProps) {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-left space-y-12 relative z-10">
        <div className="space-y-8">
          <div>
            <h1 className="text-7xl md:text-8xl font-bold text-white mb-4 text-glow">
              DPoP
            </h1>
            <div className="w-24 h-1 bg-accent rounded-full mb-8"></div>
          </div>

          <div className="space-y-6 text-muted-light leading-relaxed text-base max-w-3xl">
            <p>
              <strong className="text-white">
                DPoP (or Demonstration of Proof-of-Possession at the Application
                Layer)
              </strong>{" "}
              is an application-level mechanism for sender-constraining OAuth
              tokens and refresh tokens as specified in{" "}
              <strong className="text-accent">RFC 9449</strong>. A method is
              needed to prove the possession of a private/public key pair by
              including a <strong className="text-white">DPoP header</strong> on
              an HTTP request.
            </p>

            <p>
              The value of the header is a{" "}
              <strong className="text-white">DPoP Proof JWT</strong> (
              <strong className="text-accent">RFC 7519</strong>) that enables
              the authorization server or API as well clients to bind the auth
              and request flow with a client's key and some claims about the
              current HTTP request. It provides a mechanism to bind the
              authentication process into each other by linking the
              corresponding process of the DPoP proof.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              onClick={onGetStarted}
              className="glass-button-primary px-8 py-4 rounded-lg text-base font-semibold flex items-center justify-center space-x-2 z-10"
            >
              <svg
                className="w-5 h-5 z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <span>Start Interactive Tutorial</span>
            </button>

            <a
              href={RFC_URLS.DPoP}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button-secondary text-muted-light hover:text-white px-8 py-4 rounded-lg text-base font-medium flex items-center justify-center space-x-2 z-10"
            >
              <svg
                className="w-5 h-5 z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <span>Read RFC 9449</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
