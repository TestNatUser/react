import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Test component to use the theme context
const TestComponent: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <button onClick={toggleTheme} data-testid="toggle-btn">
        Toggle Theme
      </button>
      <button onClick={() => setTheme('light')} data-testid="set-light-btn">
        Set Light
      </button>
      <button onClick={() => setTheme('dark')} data-testid="set-dark-btn">
        Set Dark
      </button>
    </div>
  );
};

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('ThemeContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);

    // Mock document.documentElement.setAttribute
    Object.defineProperty(document, 'documentElement', {
      value: {
        setAttribute: jest.fn(),
      },
      writable: true,
    });
  });

  test('provides default light theme when no saved theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('loads saved theme from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('app-theme');
  });

  test('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should fallback to light theme
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('toggles theme from light to dark', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('toggle-btn'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('toggles theme from dark to light', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    fireEvent.click(screen.getByTestId('toggle-btn'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('sets theme directly to light', () => {
    mockLocalStorage.getItem.mockReturnValue('dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');

    fireEvent.click(screen.getByTestId('set-light-btn'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  test('sets theme directly to dark', () => {
    mockLocalStorage.getItem.mockReturnValue('light');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    fireEvent.click(screen.getByTestId('set-dark-btn'));

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('applies theme to document root', () => {
    const mockSetAttribute = document.documentElement.setAttribute as jest.Mock;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'light');

    fireEvent.click(screen.getByTestId('toggle-btn'));

    expect(mockSetAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });

  test('saves theme to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    fireEvent.click(screen.getByTestId('toggle-btn'));

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('app-theme', 'dark');
  });

  test('handles localStorage setItem errors gracefully', () => {
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error');
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should not throw error when localStorage fails
    expect(() => {
      fireEvent.click(screen.getByTestId('toggle-btn'));
    }).not.toThrow();

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  test('throws error when useTheme is used outside ThemeProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  test('works in server-side rendering environment', () => {
    const originalWindow = global.window;
    delete (global as any).window;

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should default to light theme in SSR
    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');

    global.window = originalWindow;
  });
});
