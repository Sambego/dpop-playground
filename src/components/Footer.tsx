"use client";

import Link from "next/link";
import { URLS } from "@/constants/app";

export default function Footer() {
  const links = [
    {
      title: "Specifications",
      links: [
        {
          name: "RFC 9449 - DPoP",
          href: "https://tools.ietf.org/rfc/rfc9449.txt",
          description: "Official DPoP specification",
        },
        {
          name: "RFC 7638 - JWK Thumbprint",
          href: "https://tools.ietf.org/rfc/rfc7638.txt",
          description: "JWK thumbprint specification",
        },
        {
          name: "RFC 7517 - JSON Web Key",
          href: "https://tools.ietf.org/rfc/rfc7517.txt",
          description: "JSON Web Key specification",
        },
        {
          name: "RFC 7519 - JSON Web Token",
          href: "https://tools.ietf.org/rfc/rfc7519.txt",
          description: "JSON Web Token specification",
        },
      ],
    },
    {
      title: "Libraries & Tools",
      links: [
        {
          name: "JOSE Node Library",
          href: "https://github.com/panva/jose",
          description: "JavaScript library for Signing and Encryption",
        },
        {
          name: "DPoP Node Library",
          href: "https://github.com/panva/dpop",
          description: "JavaScript library for DPoP",
        },
        {
          name: "jwt.io",
          href: "https://jwt.io",
          description: "Easily debug your JSON Web Tokens",
        },
        {
          name: "JWKSet",
          href: "https://jwkset.com",
          description: "Generate and Inspect JWKs",
        },
      ],
    },
    {
      title: "Community",
      links: [
        {
          name: "Protect Your Access Tokens with DPoP",
          href: "https://auth0.com/blog/protect-your-access-tokens-with-dpop/",
          description: "A great DPoP explainer by Andrea Chiarelli",
        },
        {
          name: "Identity Unlocked",
          href: "https://identityunlocked.auth0.com/public/49/Identity%2C-Unlocked.--bed7fada/4d4e8add",
          description:
            "An episode of the Indetity Unlocked podcast on sender constraining",
        },
        {
          name: "Auth0 DPoP Docs",
          href: "https://auth0.com/docs/secure/sender-constraining/demonstrating-proof-of-possession-dpop",
          description: "Auth0's documentation on DPoP",
        },
      ],
    },
    {
      title: "More by Sambego",
      links: [
        {
          name: "Interactive RSA Tutorial",
          href: "https://rsa.sambego.tech",
          description: "Learn more about the inner workings of RSA",
        },
        {
          name: "No Way, JOSE!",
          href: "https://jose.sambego.tech",
          description: "A slidedeck explaining JSON Signing and Encryption",
        },
        {
          name: "Sambego.tech",
          href: "https://sambego.tech",
          description: "My personal website",
        },
      ],
    },
  ];

  return (
    <footer className="bg-theme-primary border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((section, i) => (
            <div
              key={section.title}
              className={`p-4 rounded-md ${
                i === links.length - 1 ? "bg-theme-tertiary" : ""
              }`}
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <div className="text-sm font-medium text-muted-light group-hover:text-white transition-colors duration-200">
                        {link.name}
                      </div>
                      <div className="text-xs text-muted group-hover:text-muted-light transition-colors duration-200 mt-1">
                        {link.description}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Attribution Section */}
        <div className="mt-16 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <svg
                className="w-4 h-4 text-yellow-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-sm text-yellow-300 font-medium">
                This is an interactive tutorial for educational purposes only!
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted">Made with</span>
              <span className="text-red-400 transition-colors">♥︎</span>
              <span className="text-sm text-muted">by</span>
              <a
                href={URLS.PERSONAL_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-muted-light hover:text-white transition-colors duration-200"
              >
                Sambego
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
