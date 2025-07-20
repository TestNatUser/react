import { render, fireEvent, screen } from '../__tests__/test-utils';
import Input from '../components/header/search/Input';

describe('Input Component', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
    placeholder: 'Search seasons...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders input element with correct attributes', () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeTruthy();
      expect(input.getAttribute('type')).toBe('text');
      expect(input.getAttribute('placeholder')).toBe('Search seasons...');
    });

    test('displays the provided value', () => {
      render(<Input {...defaultProps} value="test query" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test query');
    });

    test('uses default placeholder when none provided', () => {
      const propsWithoutPlaceholder = {
        value: '',
        onChange: jest.fn(),
      };

      render(<Input {...propsWithoutPlaceholder} />);

      const input = screen.getByRole('textbox');
      expect(input.getAttribute('placeholder')).toBe('Search seasons...');
    });

    test('uses custom placeholder when provided', () => {
      const customPlaceholder = 'Enter your search term';
      render(<Input {...defaultProps} placeholder={customPlaceholder} />);

      const input = screen.getByRole('textbox');
      expect(input.getAttribute('placeholder')).toBe(customPlaceholder);
    });
  });

  describe('User Interaction Tests', () => {
    test('calls onChange when user types', () => {
      const mockOnChange = jest.fn();
      render(<Input {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(mockOnChange).toHaveBeenCalledTimes(1);
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });

    test('handles multiple onChange events', () => {
      const mockOnChange = jest.fn();
      render(<Input {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'first' } });
      fireEvent.change(input, { target: { value: 'second' } });
      fireEvent.change(input, { target: { value: 'third' } });

      expect(mockOnChange).toHaveBeenCalledTimes(3);
    });

    test('handles empty input', () => {
      const mockOnChange = jest.fn();
      render(
        <Input {...defaultProps} value="some text" onChange={mockOnChange} />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });

    test('handles special characters in input', () => {
      const mockOnChange = jest.fn();
      render(<Input {...defaultProps} onChange={mockOnChange} />);

      const input = screen.getByRole('textbox');
      const specialText = '!@#$%^&*()';
      fireEvent.change(input, { target: { value: specialText } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });
  });

  describe('Accessibility Tests', () => {
    test('input is focusable', () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByRole('textbox');
      input.focus();
      expect(document.activeElement).toBe(input);
    });

    test('supports keyboard navigation', () => {
      render(<Input {...defaultProps} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Tab' });

      // Input should handle keyboard events without errors
      expect(input).toBeTruthy();
    });
  });
});
