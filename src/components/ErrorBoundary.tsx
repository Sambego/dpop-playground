"use client";

import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging (but don't expose sensitive info to user)
    console.error('Error boundary caught an error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      componentStack: process.env.NODE_ENV === 'development' ? errorInfo.componentStack : undefined
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full glass-card-dark rounded-2xl border border-red-500/30 p-8 text-center">
            <div className="mb-6">
              <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
              <p className="text-muted-light text-sm">
                We encountered an unexpected error. Please refresh the page to try again.
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="glass-button-primary px-6 py-3 rounded-lg text-sm font-semibold w-full"
            >
              Refresh Page
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-muted cursor-pointer hover:text-white">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-xs text-red-300 bg-red-900/20 p-3 rounded overflow-auto max-h-40">
                  {this.state.error.message}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}