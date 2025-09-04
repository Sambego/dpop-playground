'use client';

interface ConceptsPageProps {
  isVisible: boolean;
}

export default function ConceptsPage({ isVisible }: ConceptsPageProps) {
  if (!isVisible) return null;

  return (
    <section id="concepts" className="min-h-screen py-20 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 glass-card-accent rounded-xl border border-accent/20">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white text-glow">DPoP Concepts</h2>
          <p className="text-xl text-muted-light max-w-3xl mx-auto leading-relaxed">
            Understanding the core concepts behind Demonstration of Proof-of-Possession for OAuth 2.0 security
          </p>
        </div>

        {/* Core Concept Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* What is DPoP */}
          <div className="glass-card p-8 rounded-2xl border border-border/40 hover-glow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">What is DPoP?</h3>
            </div>
            <div className="space-y-4 text-muted-light">
              <p>
                <strong className="text-white">DPoP (Demonstration of Proof-of-Possession)</strong> is an application-level mechanism for sender-constraining OAuth access and refresh tokens.
              </p>
              <p>
                It enables clients to prove possession of a public/private key pair by including a <strong className="text-accent">DPoP header</strong> in HTTP requests, making tokens unusable by unauthorized parties.
              </p>
              <div className="p-4 glass-card border border-accent/10 rounded-lg mt-4">
                <p className="text-sm font-medium text-accent mb-2">Key Benefits:</p>
                <ul className="text-sm space-y-1 text-muted-light">
                  <li>• Cryptographically binds tokens to specific clients</li>
                  <li>• Prevents token theft and replay attacks</li>
                  <li>• Works with public clients (SPAs, mobile apps)</li>
                  <li>• No need for mutual TLS certificates</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Security Benefits */}
          <div className="glass-card p-8 rounded-2xl border border-border/40 hover-glow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Security Enhancement</h3>
            </div>
            <div className="space-y-4 text-muted-light">
              <p>
                DPoP addresses the fundamental vulnerability of <strong className="text-white">bearer tokens</strong> - that anyone who possesses the token can use it.
              </p>
              <div className="space-y-3">
                <div className="p-3 glass-card border border-red-500/20 rounded-lg">
                  <p className="text-sm font-medium text-red-400 mb-1">❌ Bearer Token Problem:</p>
                  <p className="text-sm text-muted-light">If stolen, can be used by anyone without restrictions</p>
                </div>
                <div className="p-3 glass-card border border-accent/20 rounded-lg">
                  <p className="text-sm font-medium text-accent mb-1">✅ DPoP Solution:</p>
                  <p className="text-sm text-muted-light">Tokens are cryptographically bound to the legitimate client</p>
                </div>
              </div>
              <p className="text-sm">
                Even if an access token is intercepted, attackers cannot use it without possessing the corresponding private key.
              </p>
            </div>
          </div>
        </div>

        {/* How DPoP Works */}
        <div className="glass-card p-8 rounded-2xl border border-border/40">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white">How DPoP Works</h3>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Step 1 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
                <h4 className="text-lg font-semibold text-white">Key Generation</h4>
              </div>
              <div className="p-4 glass-card border border-accent/10 rounded-lg">
                <p className="text-sm text-muted-light">
                  Client generates a public/private key pair and creates a <strong className="text-accent">DPoP Proof JWT</strong> signed with the private key.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
                <h4 className="text-lg font-semibold text-white">Token Binding</h4>
              </div>
              <div className="p-4 glass-card border border-accent/10 rounded-lg">
                <p className="text-sm text-muted-light">
                  Authorization server includes the public key thumbprint in the access token's <strong className="text-accent">jkt claim</strong>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
                <h4 className="text-lg font-semibold text-white">Verification</h4>
              </div>
              <div className="p-4 glass-card border border-accent/10 rounded-lg">
                <p className="text-sm text-muted-light">
                  Resource server verifies the DPoP proof signature and matches the key thumbprint with the access token.
                </p>
              </div>
            </div>
          </div>

          {/* DPoP Proof Structure */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-white">DPoP Proof JWT Structure</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h5 className="text-lg font-medium text-accent mb-3">Header</h5>
                <div className="glass-card border border-accent/10 rounded-lg p-4">
                  <pre className="text-sm text-muted-light overflow-x-auto">
{`{
  "typ": "dpop+jwt",
  "alg": "ES256",
  "jwk": {
    "kty": "EC",
    "crv": "P-256",
    "x": "WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGHwHitJBcBmXQ",
    "y": "y77As5vbZdIh6AzjmpUiEoC7loYxBBgOqoml2xx2L1o"
  }
}`}
                  </pre>
                </div>
              </div>
              <div>
                <h5 className="text-lg font-medium text-accent mb-3">Payload</h5>
                <div className="glass-card border border-accent/10 rounded-lg p-4">
                  <pre className="text-sm text-muted-light overflow-x-auto">
{`{
  "jti": "e1j3V_bX9gGOLHn1",
  "htm": "POST",
  "htu": "https://api.example.com/resource",
  "iat": 1562262616,
  "exp": 1562263216
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Process */}
          <div className="glass-card p-8 rounded-2xl border border-border/40 hover-glow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Verification Process</h3>
            </div>
            <div className="space-y-4">
              <p className="text-muted-light">Resource servers must verify several aspects of the DPoP proof:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-light">Verify JWT signature using the public key in the header</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-light">Check that HTTP method (htm) and URI (htu) match the request</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-light">Validate token expiration and uniqueness (jti claim)</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-light">Match public key thumbprint with access token's jkt claim</p>
                </div>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="glass-card p-8 rounded-2xl border border-border/40 hover-glow">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Use Cases</h3>
            </div>
            <div className="space-y-4">
              <p className="text-muted-light">DPoP is particularly valuable for:</p>
              <div className="space-y-4">
                <div className="p-4 glass-card border border-accent/10 rounded-lg">
                  <h4 className="text-accent font-medium mb-2">Public Clients</h4>
                  <p className="text-sm text-muted-light">Single Page Applications (SPAs) and mobile apps that cannot securely store secrets</p>
                </div>
                <div className="p-4 glass-card border border-accent/10 rounded-lg">
                  <h4 className="text-accent font-medium mb-2">Financial APIs</h4>
                  <p className="text-sm text-muted-light">FAPI 2.0 compliance for high-security financial applications</p>
                </div>
                <div className="p-4 glass-card border border-accent/10 rounded-lg">
                  <h4 className="text-accent font-medium mb-2">Zero Trust Security</h4>
                  <p className="text-sm text-muted-light">Environments where token binding is critical for security</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Claims */}
        <div className="glass-card p-8 rounded-2xl border border-border/40">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-white">DPoP JWT Claims Reference</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Required Claims</h4>
              <div className="space-y-3">
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">jti</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">String</span>
                  </div>
                  <p className="text-xs text-muted-light">Unique identifier to prevent replay attacks</p>
                </div>
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">htm</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">String</span>
                  </div>
                  <p className="text-xs text-muted-light">HTTP method of the request (GET, POST, etc.)</p>
                </div>
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">htu</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">String</span>
                  </div>
                  <p className="text-xs text-muted-light">HTTP URI of the request (without query/fragment)</p>
                </div>
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">iat</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">Number</span>
                  </div>
                  <p className="text-xs text-muted-light">Token issued at timestamp</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-white mb-4">Optional Claims</h4>
              <div className="space-y-3">
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">exp</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">Number</span>
                  </div>
                  <p className="text-xs text-muted-light">Token expiration timestamp</p>
                </div>
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">nbf</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">Number</span>
                  </div>
                  <p className="text-xs text-muted-light">Token not valid before timestamp</p>
                </div>
                <div className="p-3 glass-card border border-accent/10 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <code className="text-accent font-mono text-sm">ath</code>
                    <span className="text-xs text-muted px-2 py-1 glass-card rounded">String</span>
                  </div>
                  <p className="text-xs text-muted-light">Base64url-encoded SHA-256 hash of access token</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Standards & Compliance */}
        <div className="glass-card p-8 rounded-2xl border border-border/40">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 glass-card-accent rounded-lg border border-accent/20">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white">Standards & Specifications</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 glass-card border border-accent/10 rounded-lg">
              <h4 className="text-accent font-medium mb-2">RFC 9449</h4>
              <p className="text-sm text-muted-light">Official IETF specification for OAuth 2.0 DPoP</p>
            </div>
            <div className="p-4 glass-card border border-accent/10 rounded-lg">
              <h4 className="text-accent font-medium mb-2">FAPI 2.0</h4>
              <p className="text-sm text-muted-light">Financial-grade API security profile compliance</p>
            </div>
            <div className="p-4 glass-card border border-accent/10 rounded-lg">
              <h4 className="text-accent font-medium mb-2">RFC 7519</h4>
              <p className="text-sm text-muted-light">JSON Web Token (JWT) standard for DPoP proofs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}