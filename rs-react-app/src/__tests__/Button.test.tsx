import { render, fireEvent, screen } from '../__tests__/test-utils';
import Button from '../components/header/search/Button';

describe('Button Component', () => {
  const defaultProps = {
    onClick: jest.fn(),
    children: 'Search'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders button element', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeTruthy();
    });

    test('displays children content', () => {
      render(<Button {...defaultProps}>Search Now</Button>);
      
      const button = screen.getByRole('button');
      expect(button.textContent).toBe('Search Now');
    });

    test('applies custom className when provided', () => {
      const customClass = 'custom-search-btn';
      render(<Button {...defaultProps} className={customClass} />);
      
      const button = screen.getByRole('button');
      expect(button.classList.contains(customClass)).toBe(true);
    });

    test('renders without className when not provided', () => {
      render(<Button onClick={jest.fn()}>Search</Button>);
      
      const button = screen.getByRole('button');
      expect(button.className).toBe('');
    });

    test('handles various children types', () => {
      const { rerender } = render(<Button {...defaultProps}>Text Content</Button>);
      
      let button = screen.getByRole('button');
      expect(button.textContent).toBe('Text Content');

      // Test with number
      rerender(<Button {...defaultProps}>{123}</Button>);
      button = screen.getByRole('button');
      expect(button.textContent).toBe('123');
    });
  });

  describe('User Interaction Tests', () => {
    test('calls onClick when clicked', () => {
      const mockOnClick = jest.fn();
      render(<Button {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('calls onClick multiple times on multiple clicks', () => {
      const mockOnClick = jest.fn();
      render(<Button {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(3);
    });

    test('handles rapid clicks', () => {
      const mockOnClick = jest.fn();
      render(<Button {...defaultProps} onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      
      // Simulate rapid clicking
      for (let i = 0; i < 5; i++) {
        fireEvent.click(button);
      }
      
      expect(mockOnClick).toHaveBeenCalledTimes(5);
    });
  });

  describe('Accessibility Tests', () => {
    test('button is focusable', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test('has correct button role', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('Accessibility Tests', () => {
    test('button is focusable', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });

    test('has correct button role', () => {
      render(<Button {...defaultProps} />);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });
});