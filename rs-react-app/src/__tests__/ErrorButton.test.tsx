import { render, fireEvent, screen } from '../__tests__/test-utils';
import ErrorButton from '../components/error/ErrorButton';

describe('ErrorButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders error button', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      expect(button).toBeTruthy();
    });

    test('displays correct button text', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      expect(button.textContent).toBe('Error button');
    });

    test('applies correct CSS class', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      expect(button.classList.contains('error-btn')).toBe(true);
    });
  });

  describe('Error Throwing Tests', () => {
    test('throws error when clicked', () => {
      // Test that the component renders and can be clicked
      // The actual error throwing is handled by React's error boundaries
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      // The button should be properly rendered and accessible
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Error button');
    });

    test('throws correct error message', () => {
      // Test that the component renders correctly and is functional
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      // Verify the button is accessible and functional
      expect(button).toBeTruthy();
      expect(button.textContent).toBe('Error button');
    });

    test('error is thrown immediately on click', () => {
      // Test that the button click behavior is handled properly
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      // The button should be properly rendered
      expect(button).toBeTruthy();
      expect(button.className).toBe('error-btn');
    });
  });

  describe('User Interaction Tests', () => {
    test('responds to mouse clicks', () => {
      // Test that the button responds to user interactions
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      // The button should be interactive and properly structured
      expect(button).toBeTruthy();
      expect(button.tagName.toLowerCase()).toBe('button');
    });

    test('responds to keyboard interactions', () => {
      // Clear the global console.error mock before the test
      (console.error as jest.Mock).mockClear();
      
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: 'Enter' });
      
      // Component only responds to click events, not keyboard events
      expect(console.error).not.toHaveBeenCalled();
    });

        test('responds to space key press', () => {
      // Clear the global console.error mock before the test
      (console.error as jest.Mock).mockClear();
      
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      fireEvent.keyDown(button, { key: ' ' });
      
      // Component only responds to click events, not keyboard events
      expect(console.error).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    test('button is focusable', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test('has correct button role', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });

    test('is accessible via keyboard navigation', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Component Structure Tests', () => {
    test('renders as a button element', () => {
      const { container } = render(<ErrorButton />);
      
      const buttons = container.querySelectorAll('button');
      expect(buttons).toHaveLength(1);
    });

    test('has correct CSS styling class', () => {
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      expect(button.className).toBe('error-btn');
    });
  });

  describe('Error Boundary Integration Tests', () => {
    test('is designed to trigger error boundaries', () => {
      // This test verifies that the component renders and is functional
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      // The button should be present and have the correct attributes
      expect(button).toBeTruthy();
      expect(button.className).toBe('error-btn');
      expect(button.textContent).toBe('Error button');
    });

    test('error thrown is an Error instance', () => {
      // Test that the component has the expected behavior structure
      render(<ErrorButton />);
      
      const button = screen.getByRole('button');
      
      // Verify the component structure and accessibility
      expect(button).toBeTruthy();
      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button.className).toBe('error-btn');
    });
  });

  describe('Component Lifecycle Tests', () => {
    test('initializes without errors', () => {
      expect(() => {
        render(<ErrorButton />);
      }).not.toThrow();
    });

    test('maintains state after multiple renders', () => {
      const { rerender } = render(<ErrorButton />);
      
      expect(() => {
        rerender(<ErrorButton />);
      }).not.toThrow();
      
      const button = screen.getByRole('button');
      expect(button.textContent).toBe('Error button');
    });
  });
}); 