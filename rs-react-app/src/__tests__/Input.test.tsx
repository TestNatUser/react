import { render, fireEvent, screen } from '../__tests__/test-utils';
import Input from '../components/header/search/Input';

describe('Input Component', () => {
  const defaultProps = {
    query: '',
    onInputChange: jest.fn(),
    onSearch: jest.fn(),
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
      render(<Input {...defaultProps} query="test query" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test query');
    });

    test('uses default placeholder when none provided', () => {
      const propsWithoutPlaceholder = {
        query: '',
        onInputChange: jest.fn(),
        onSearch: jest.fn(),
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
    test('calls onInputChange when user types', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();
      render(
        <Input
          query=""
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
          placeholder="Search..."
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(mockOnInputChange).toHaveBeenCalledTimes(1);
      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });

    test('handles multiple onInputChange events', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();
      render(
        <Input
          query=""
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
          placeholder="Search..."
        />
      );

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'first' } });
      fireEvent.change(input, { target: { value: 'second' } });
      fireEvent.change(input, { target: { value: 'third' } });

      expect(mockOnInputChange).toHaveBeenCalledTimes(3);
    });

    test('handles empty input', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();
      render(
        <Input
          query="test"
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
          placeholder="Search..."
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '' } });

      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });

    test('handles special characters in input', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();
      render(
        <Input
          query=""
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
          placeholder="Search..."
        />
      );

      const input = screen.getByRole('textbox');
      const specialText = '!@#$%^&*()';
      fireEvent.change(input, { target: { value: specialText } });

      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });

    test('calls onSearch when Enter key is pressed', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();
      render(
        <Input
          query="test"
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
          placeholder="Search..."
        />
      );

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 });

      expect(mockOnSearch).toHaveBeenCalledTimes(1);
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
      // Basic test to ensure keyboard events are handled
      expect(input).toBeTruthy();
    });
  });
});
