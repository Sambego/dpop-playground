"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  mounted: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to get initial theme from localStorage or default
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    try {
      const storedTheme = localStorage.getItem('dpop-theme') as Theme;
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system')) {
        return storedTheme;
      }
    } catch {
      // localStorage not available
    }
  }
  return 'dark'; // Default theme
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Always start with 'dark' for SSR consistency
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Function to get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
  };

  // Function to resolve theme (handle system option)
  const resolveTheme = useCallback((currentTheme: Theme): ResolvedTheme => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  }, []);

  // Initialize resolved theme and mark as mounted
  useEffect(() => {
    // Load theme from localStorage after mount to avoid hydration mismatch
    const storedTheme = getInitialTheme();
    setTheme(storedTheme);
    
    // Set initial resolved theme based on stored theme
    setResolvedTheme(resolveTheme(storedTheme));
    
    // Apply initial theme to document
    const resolved = resolveTheme(storedTheme);
    if (resolved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    setMounted(true);
  }, [resolveTheme]);

  // Listen for system theme changes when using system theme
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply theme to document and save to localStorage
  useEffect(() => {
    if (!mounted) return; // Don't apply theme until component is mounted
    
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    
    if (resolved === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    try {
      localStorage.setItem('dpop-theme', theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }, [theme, mounted, resolveTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'dark') return 'light';
      if (prevTheme === 'light') return 'system';
      return 'dark'; // system -> dark
    });
  };

  const value = {
    theme,
    resolvedTheme,
    mounted,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}