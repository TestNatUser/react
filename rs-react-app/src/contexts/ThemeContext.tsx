'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Theme,
  ThemeContextType,
  ThemeProviderProps,
} from '../interfaces/interface';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Start with default theme to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme from localStorage after hydration
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('app-theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        setThemeState(savedTheme);
      }
    } catch {
      // Fallback to light theme if localStorage is unavailable or throws
      console.warn('Failed to load theme from localStorage');
    }
  }, []);

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    // Also save to localStorage (with error handling)
    try {
      localStorage.setItem('app-theme', theme);
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
