'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface JsonWithTooltipsProps {
  jsonString: string;
  className?: string;
}

// JWT and DPoP specification descriptions
const keyDescriptions: Record<string, string> = {
  // JWT Standard Claims (RFC 7519)
  "iss": "Issuer - The principal that issued the JWT",
  "sub": "Subject - The principal that is the subject of the JWT", 
  "aud": "Audience - The recipients that the JWT is intended for",
  "exp": "Expiration Time - The time after which the JWT expires",
  "nbf": "Not Before - The time before which the JWT must not be accepted",
  "iat": "Issued At - The time at which the JWT was issued",
  "jti": "JWT ID - Unique identifier for the JWT",
  
  // JWT Header Claims
  "typ": "Type - The media type of the JWT",
  "alg": "Algorithm - The cryptographic algorithm used to secure the JWT",
  "kid": "Key ID - Identifier for the key used to sign the JWT",
  "jwk": "JSON Web Key - The public key used to verify the JWT signature",
  
  // DPoP Specific Claims (RFC 9449)
  "htm": "HTTP Method - The HTTP method for the request this DPoP JWT is attached to",
  "htu": "HTTP URI - The HTTP URI for the request this DPoP JWT is attached to",
  "cnf": "Confirmation - Method to confirm possession of a cryptographic key",
  "jkt": "JWK Thumbprint - SHA-256 thumbprint of the JWK used in the DPoP proof",
  
  // JWK Claims (RFC 7517)
  "kty": "Key Type - The cryptographic algorithm family used with the key",
  "crv": "Curve - The subtype of the elliptic curve key",
  "x": "X Coordinate - The x coordinate for the elliptic curve point",
  "y": "Y Coordinate - The y coordinate for the elliptic curve point",
  "n": "Modulus - The modulus value for the RSA public key",
  "e": "Exponent - The exponent value for the RSA public key",
  "ext": "Extractable - Whether the key can be exported from the cryptographic module",
  "key_ops": "Key Operations - The operations for which the key is intended to be used",
  
  // OAuth/OIDC Claims
  "scope": "Scope - The scope of access granted by the access token",
  "client_id": "Client ID - The identifier of the OAuth client"
};

export default function JsonWithTooltips({ jsonString, className = '' }: JsonWithTooltipsProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (key: string, event: React.MouseEvent) => {
    if (keyDescriptions[key]) {
      setHoveredKey(key);
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredKey(null);
  };

  // Function to render JSON with interactive keys
  const renderJsonWithTooltips = (json: string) => {
    const elements: React.ReactNode[] = [];
    let currentIndex = 0;
    
    // Find all JSON key patterns
    const keyPattern = /"([^"]+)":/g;
    let match;
    
    while ((match = keyPattern.exec(json)) !== null) {
      const beforeKey = json.slice(currentIndex, match.index);
      const fullMatch = match[0]; // "key":
      const key = match[1]; // just the key without quotes
      
      // Add text before the key
      if (beforeKey) {
        elements.push(<span key={`before-${currentIndex}`}>{beforeKey}</span>);
      }
      
      // Add the key with or without tooltip
      if (keyDescriptions[key]) {
        elements.push(
          <span
            key={`key-${match.index}`}
            className="cursor-help text-accent hover:text-accent-light transition-colors"
            onMouseEnter={(e) => handleMouseEnter(key, e)}
            onMouseLeave={handleMouseLeave}
          >
            {fullMatch}
          </span>
        );
      } else {
        elements.push(
          <span key={`key-${match.index}`} className="text-accent">
            {fullMatch}
          </span>
        );
      }
      
      currentIndex = match.index + fullMatch.length;
    }
    
    // Add remaining text after the last key
    const remaining = json.slice(currentIndex);
    if (remaining) {
      elements.push(<span key="remaining">{remaining}</span>);
    }
    
    return elements;
  };

  // Render tooltip as a portal to document.body
  const renderTooltip = () => {
    if (!mounted || !hoveredKey || !keyDescriptions[hoveredKey]) return null;
    
    return createPortal(
      <div
        className="fixed z-[9999] px-3 py-2 text-xs tooltip-bg tooltip-text rounded-lg border border-accent/30 shadow-xl max-w-xs pointer-events-none"
        style={{
          left: tooltipPosition.x,
          top: tooltipPosition.y - 10,
          transform: 'translate(-50%, -100%)'
        }}
      >
        <div className="font-semibold text-accent mb-1">{hoveredKey}</div>
        <div>{keyDescriptions[hoveredKey]}</div>
      </div>,
      document.body
    );
  };

  return (
    <div className={`relative ${className}`}>
      <pre className="text-gray-300">
        {renderJsonWithTooltips(jsonString)}
      </pre>
      
      {/* Tooltip rendered as portal */}
      {renderTooltip()}
    </div>
  );
}