import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "dpop.info - Interactive DPoP (Demonstrating Proof-of-Possesion) Playground",
  description:
    "Learn DPoP with this interactive demo. A step-by-step DPoP token binding flow, real-time  - cryptographic key generation and JWT visualization.",
  keywords: [
    "DPoP",
    "OAuth2",
    "OIDC",
    "JWT",
    "Proof of Possession",
    "Token Binding",
    "Cryptography",
    "Web Security",
    "PKCE",
    "RFC 9449",
    "Interactive Demo",
    "Playground",
  ],
  authors: [{ name: "Sam Bellen" }],
  creator: "Sam Bellen",
  publisher: "dpop.info",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dpop.info"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dpop.info",
    title:
      "dpop.info - Interactive DPoP (Demonstrating Proof-of-Possesion) Playground",
    description:
      "Learn DPoP with this interactive demo. A step-by-step DPoP token binding flow, real-time  - cryptographic key generation and JWT visualization.",
    siteName: "dpop.info",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "dpop.info - Interactive DPoP (Demonstrating Proof-of-Possesion) Playground",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "dpop.info - Interactive DPoP (Demonstrating Proof-of-Possesion) Playground",
    description:
      "Learn DPoP with this interactive demo. A step-by-step DPoP token binding flow, real-time  - cryptographic key generation and JWT visualization.",
    creator: "@sambego",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; connect-src 'self' https://*; img-src 'self' data: blob:; media-src 'self'; object-src 'none'; frame-src 'none'; worker-src 'self'; manifest-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self';"
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta
          httpEquiv="Referrer-Policy"
          content="strict-origin-when-cross-origin"
        />
        <link rel="canonical" href="https://dpop.info" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta
          name="theme-color"
          content="#10b981"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#1e1e23"
          media="(prefers-color-scheme: dark)"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="dpop.info" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "dpop.info - Interactive DPoP (Demonstrating Proof-of-Possesion) Playground",
              description:
                "Learn DPoP with this interactive demo. A step-by-step DPoP token binding flow, real-time  - cryptographic key generation and JWT visualization.",
              url: "https://dpop.info",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Person",
                name: "Sam Bellen",
                url: "https://sambego.be",
              },
              keywords:
                "DPoP, OAuth2, OIDC, JWT, Proof of Possession, Token Binding, Cryptography, Web Security, PKCE, RFC 9449",
              inLanguage: "en-US",
              browserRequirements:
                "Requires JavaScript. Modern browser with ES6+ support.",
              softwareVersion: "2.0",
              datePublished: "2024-01-01",
              dateModified: new Date().toISOString().split("T")[0],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
