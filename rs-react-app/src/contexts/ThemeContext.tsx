import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Theme,
  ThemeContextType,
  ThemeProviderProps,
} from '../interfaces/interface';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('app-theme') as Theme;
        return savedTheme || 'light';
      } catch {
        // Fallback to light theme if localStorage is unavailable or throws
        return 'light';
      }
    }
    return 'light';
  });

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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
