import { webcrypto } from 'crypto';

// Browser crypto or Node.js crypto for SSR compatibility
const crypto = (typeof window !== 'undefined' ? window.crypto : webcrypto) as Crypto;

export interface GeneratedKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  jwk: JsonWebKey;
  privateJwk: JsonWebKey;
  thumbprint: string;
}

export async function generateKeyPair(algorithm: string): Promise<GeneratedKeyPair> {
  if (!crypto || !crypto.subtle) {
    throw new Error('Web Crypto API not available');
  }

  let keyPair: CryptoKeyPair;
  const exportFormat: KeyFormat = 'jwk';

  try {
    switch (algorithm) {
      case 'ES256':
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: 'P-256',
          },
          true,
          ['sign', 'verify']
        );
        break;
      
      case 'ES384':
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: 'P-384',
          },
          true,
          ['sign', 'verify']
        );
        break;
      
      case 'ES512':
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'ECDSA',
            namedCurve: 'P-521',
          },
          true,
          ['sign', 'verify']
        );
        break;
      
      case 'RS256':
      case 'RS384':
      case 'RS512':
        const rsaHash = algorithm === 'RS256' ? 'SHA-256' : algorithm === 'RS384' ? 'SHA-384' : 'SHA-512';
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSASSA-PKCS1-v1_5',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: rsaHash,
          },
          true,
          ['sign', 'verify']
        );
        break;
      
      case 'PS256':
      case 'PS384':
      case 'PS512':
        const psHash = algorithm === 'PS256' ? 'SHA-256' : algorithm === 'PS384' ? 'SHA-384' : 'SHA-512';
        keyPair = await crypto.subtle.generateKey(
          {
            name: 'RSA-PSS',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: psHash,
          },
          true,
          ['sign', 'verify']
        );
        break;
      
      case 'Ed25519':
        keyPair = await crypto.subtle.generateKey(
          'Ed25519',
          true,
          ['sign', 'verify']
        ) as CryptoKeyPair;
        break;
      
      case 'Ed448':
        keyPair = await crypto.subtle.generateKey(
          'Ed448',
          true,
          ['sign', 'verify']
        ) as CryptoKeyPair;
        break;
      
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    // Export the public key as JWK
    const jwk = await crypto.subtle.exportKey(exportFormat, keyPair.publicKey);
    
    // Export the private key as JWK
    const privateJwk = await crypto.subtle.exportKey(exportFormat, keyPair.privateKey);
    
    // Add algorithm to JWKs
    jwk.alg = algorithm;
    privateJwk.alg = algorithm;
    
    // Generate thumbprint (SHA-256 hash of canonical JWK)
    const thumbprint = await generateJwkThumbprint(jwk);

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      jwk,
      privateJwk,
      thumbprint
    };
  } catch (error) {
    console.error('Key generation failed:', error);
    throw new Error(`Failed to generate key pair for ${algorithm}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateJwkThumbprint(jwk: JsonWebKey): Promise<string> {
  // Create canonical JWK representation for thumbprint
  const canonicalJwk = createCanonicalJwk(jwk);
  
  // Convert to JSON string
  const jwkString = JSON.stringify(canonicalJwk);
  
  // Generate SHA-256 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(jwkString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to base64url
  const hashArray = new Uint8Array(hashBuffer);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(hashArray)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function createCanonicalJwk(jwk: JsonWebKey): Record<string, unknown> {
  // Create canonical JWK representation according to RFC 7638
  const canonical: Record<string, unknown> = {};
  
  if (jwk.kty === 'EC') {
    canonical.crv = jwk.crv;
    canonical.kty = jwk.kty;
    canonical.x = jwk.x;
    canonical.y = jwk.y;
  } else if (jwk.kty === 'RSA') {
    canonical.e = jwk.e;
    canonical.kty = jwk.kty;
    canonical.n = jwk.n;
  } else if (jwk.kty === 'OKP') {
    canonical.crv = jwk.crv;
    canonical.kty = jwk.kty;
    canonical.x = jwk.x;
  }
  
  return canonical;
}

export function formatJwkForDisplay(jwk: JsonWebKey): string {
  // Format JWK for nice display
  const displayJwk = { ...jwk };
  
  // Remove private key components if present
  delete displayJwk.d;
  
  return JSON.stringify(displayJwk, null, 2);
}

export async function signJwt(
  payload: Record<string, unknown>,
  privateKey: CryptoKey,
  algorithm: string,
  jwk: JsonWebKey
): Promise<string> {
  // Create JWT header
  const header = {
    typ: 'dpop+jwt',
    alg: algorithm,
    jwk: {
      kty: jwk.kty,
      crv: jwk.crv,
      x: jwk.x,
      y: jwk.y,
      ...(jwk.kty === 'RSA' && { n: jwk.n, e: jwk.e }),
      ...(jwk.kty === 'OKP' && { crv: jwk.crv }),
    }
  };

  // Base64URL encode header and payload
  const headerB64 = base64UrlEncode(JSON.stringify(header));
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  
  // Create signing input
  const signingInput = `${headerB64}.${payloadB64}`;
  
  // Sign the JWT
  const signature = await signData(signingInput, privateKey, algorithm);
  
  return `${signingInput}.${signature}`;
}

async function signData(data: string, privateKey: CryptoKey, algorithm: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  let signatureBuffer: ArrayBuffer;
  
  switch (algorithm) {
    case 'ES256':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-256' },
        privateKey,
        dataBuffer
      );
      break;
    case 'ES384':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-384' },
        privateKey,
        dataBuffer
      );
      break;
    case 'ES512':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'ECDSA', hash: 'SHA-512' },
        privateKey,
        dataBuffer
      );
      break;
    case 'RS256':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        privateKey,
        dataBuffer
      );
      break;
    case 'RS384':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        privateKey,
        dataBuffer
      );
      break;
    case 'RS512':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        privateKey,
        dataBuffer
      );
      break;
    case 'PS256':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'RSA-PSS', saltLength: 32 },
        privateKey,
        dataBuffer
      );
      break;
    case 'PS384':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'RSA-PSS', saltLength: 48 },
        privateKey,
        dataBuffer
      );
      break;
    case 'PS512':
      signatureBuffer = await crypto.subtle.sign(
        { name: 'RSA-PSS', saltLength: 64 },
        privateKey,
        dataBuffer
      );
      break;
    case 'Ed25519':
    case 'Ed448':
      signatureBuffer = await crypto.subtle.sign(
        algorithm,
        privateKey,
        dataBuffer
      );
      break;
    default:
      throw new Error(`Unsupported signing algorithm: ${algorithm}`);
  }
  
  return base64UrlEncode(signatureBuffer);
}

function base64UrlEncode(input: string | ArrayBuffer): string {
  let base64: string;
  
  if (typeof input === 'string') {
    base64 = btoa(input);
  } else {
    const bytes = new Uint8Array(input);
    base64 = btoa(String.fromCharCode.apply(null, Array.from(bytes)));
  }
  
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}