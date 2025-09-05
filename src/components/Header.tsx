import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-muted-dark/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="p-2.5 glass-card-accent rounded-xl border border-accent/20">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12S3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z"/>
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold text-white">dpop.info</span>
            </div>
          </div>
          
          <nav className="flex space-x-4">
            <Link 
              href="https://tools.ietf.org/rfc/rfc9449.txt" 
              target="_blank"
              rel="noopener noreferrer"
              className="card-modern px-4 py-2 text-sm font-medium text-muted hover:text-white transition-all duration-200 rounded-lg hover-glow"
            >
              RFC 9449
            </Link>
            <Link 
              href="https://auth0.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="card-modern px-4 py-2 text-sm font-medium text-muted hover:text-white transition-all duration-200 rounded-lg hover-glow"
            >
              Auth0
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}