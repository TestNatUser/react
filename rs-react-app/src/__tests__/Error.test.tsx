import { render, screen } from '../__tests__/test-utils';
import { ErrorBoundary } from '../components/error/Error';
// Test component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error here</div>;
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to prevent error logging during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Error Catching Tests', () => {
    test('catches and handles JavaScript errors in child components', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should show error fallback UI
      expect(screen.getByText('Test error message')).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    test('displays fallback UI when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Check for error message display
      const errorMessage = document.querySelector('.error-message');
      expect(errorMessage).toBeTruthy();

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      expect(tryAgainButton).toBeTruthy();
    });

    test('logs error to console', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(consoleSpy).toHaveBeenCalled();
    });

    test('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error here')).toBeTruthy();
      expect(screen.queryByText('Try Again')).toBeFalsy();
    });
  });

  describe('Error Recovery Tests', () => {
    test('resets error state when Try Again is clicked', () => {
      const { rerender } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error should be displayed
      expect(screen.getByText('Test error message')).toBeTruthy();

      // Click Try Again button
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      tryAgainButton.click();

      // Error should be cleared (though component will still throw if re-rendered with same props)
      // This tests the resetError functionality
      rerender(
        <ErrorBoundary>
          <ThrowError shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByText('No error here')).toBeTruthy();
      expect(screen.queryByText('Test error message')).toBeFalsy();
    });
  });

  describe('Error State Management Tests', () => {
    test('maintains error state correctly', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Should be in error state
      expect(screen.getByText('Test error message')).toBeTruthy();
      expect(screen.queryByText('No error here')).toBeFalsy();
    });

    test('handles multiple different errors', () => {
      const MultiErrorComponent = ({ errorType }: { errorType: string }) => {
        if (errorType === 'type1') {
          throw new Error('First error type');
        }
        if (errorType === 'type2') {
          throw new Error('Second error type');
        }
        return <div>No error</div>;
      };

      const { rerender } = render(
        <ErrorBoundary>
          <MultiErrorComponent errorType="type1" />
        </ErrorBoundary>
      );

      expect(screen.getByText('First error type')).toBeTruthy();

      // Reset and try different error
      const tryAgainButton = screen.getByRole('button', { name: /try again/i });
      tryAgainButton.click();

      rerender(
        <ErrorBoundary>
          <MultiErrorComponent errorType="type2" />
        </ErrorBoundary>
      );

      expect(screen.getByText('Second error type')).toBeTruthy();
    });
  });

  describe('Component Lifecycle Tests', () => {
    test('componentDidCatch is called when error occurs', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // componentDidCatch should have been called
      expect(consoleSpy).toHaveBeenCalledWith(
        'Caught by ErrorBoundary:',
        expect.any(Error),
        expect.any(Object)
      );
    });

    test('getDerivedStateFromError sets error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      // Error state should be set correctly
      expect(screen.getByText('Test error message')).toBeTruthy();
    });
  });

  describe('Fallback UI Tests', () => {
    test('fallback UI has correct structure', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorContainer = document.querySelector('.error-message');
      expect(errorContainer).toBeTruthy();

      const errorText = errorContainer?.querySelector('p');
      expect(errorText?.textContent).toBe('Test error message');

      const button = errorContainer?.querySelector('button');
      expect(button?.textContent).toBe('Try Again');
    });

    test('Try Again button triggers resetError', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const tryAgainButton = screen.getByRole('button', { name: /try again/i });

      // Should not throw when clicking
      expect(() => {
        tryAgainButton.click();
      }).not.toThrow();
    });
  });

  describe('Error Message Display Tests', () => {
    test('displays custom error messages', () => {
      const CustomError = () => {
        throw new Error('Custom error message for testing');
      };

      render(
        <ErrorBoundary>
          <CustomError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Custom error message for testing')).toBeTruthy();
    });

    test('handles errors with no message', () => {
      const EmptyErrorComponent = () => {
        throw new Error('');
      };

      render(
        <ErrorBoundary>
          <EmptyErrorComponent />
        </ErrorBoundary>
      );

      // Should still render error UI even with empty message
      const errorContainer = document.querySelector('.error-message');
      expect(errorContainer).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });
  });

  describe('Accessibility Tests', () => {
    test('error message is accessible', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const errorMessage = screen.getByText('Test error message');
      expect(errorMessage).toBeTruthy();
      expect(errorMessage.tagName).toBe('P');
    });

    test('Try Again button is accessible', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      );

      const button = screen.getByRole('button', { name: /try again/i });
      expect(button).toBeTruthy();

      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Integration Tests', () => {
    test('works with complex component trees', () => {
      const ComplexComponent = () => (
        <div>
          <h1>Header</h1>
          <div>
            <ThrowError shouldThrow={true} />
          </div>
          <footer>Footer</footer>
        </div>
      );

      render(
        <ErrorBoundary>
          <ComplexComponent />
        </ErrorBoundary>
      );

      // Should catch error from nested component
      expect(screen.getByText('Test error message')).toBeTruthy();
      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    test('multiple error boundaries work independently', () => {
      render(
        <div>
          <ErrorBoundary>
            <ThrowError shouldThrow={true} />
          </ErrorBoundary>
          <ErrorBoundary>
            <ThrowError shouldThrow={false} />
          </ErrorBoundary>
        </div>
      );

      // First boundary should show error
      expect(screen.getByText('Test error message')).toBeTruthy();

      // Second boundary should show normal content
      expect(screen.getByText('No error here')).toBeTruthy();
    });
  });
});
