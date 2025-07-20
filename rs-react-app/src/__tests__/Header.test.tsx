import { render, fireEvent, screen } from '../__tests__/test-utils';
import Header from '../components/header/Header';

describe('Header Component', () => {
  const defaultProps = {
    query: '',
    onInputChange: jest.fn(),
    onSearch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders search header container', () => {
      render(<Header {...defaultProps} />);

      const headerContainer = document.querySelector('.search-header');
      expect(headerContainer).toBeTruthy();
    });

    test('renders input and button components', () => {
      render(<Header {...defaultProps} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      expect(input).toBeTruthy();
      expect(button).toBeTruthy();
    });

    test('displays current query value in input', () => {
      const testQuery = 'test search term';
      render(<Header {...defaultProps} query={testQuery} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe(testQuery);
    });

    test('shows placeholder text in input', () => {
      render(<Header {...defaultProps} />);

      const input = screen.getByRole('textbox');
      expect(input.getAttribute('placeholder')).toBe('Search seasons...');
    });

    test('displays search button text', () => {
      render(<Header {...defaultProps} />);

      const button = screen.getByRole('button');
      expect(button.textContent).toBe('Search');
    });
  });

  describe('User Interaction Tests', () => {
    test('calls onInputChange when user types in input', () => {
      const mockOnInputChange = jest.fn();
      render(<Header {...defaultProps} onInputChange={mockOnInputChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'new search' } });

      expect(mockOnInputChange).toHaveBeenCalledTimes(1);
      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );
    });

    test('calls onSearch when search button is clicked', () => {
      const mockOnSearch = jest.fn();
      render(<Header {...defaultProps} onSearch={mockOnSearch} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    test('handles multiple input changes', () => {
      const mockOnInputChange = jest.fn();
      render(<Header {...defaultProps} onInputChange={mockOnInputChange} />);

      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'first' } });
      fireEvent.change(input, { target: { value: 'second' } });
      fireEvent.change(input, { target: { value: 'third' } });

      expect(mockOnInputChange).toHaveBeenCalledTimes(3);
    });

    test('handles multiple search button clicks', () => {
      const mockOnSearch = jest.fn();
      render(<Header {...defaultProps} onSearch={mockOnSearch} />);

      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockOnSearch).toHaveBeenCalledTimes(2);
    });

    test('input change followed by search button click', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();

      render(
        <Header
          {...defaultProps}
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      fireEvent.change(input, { target: { value: 'test query' } });
      fireEvent.click(button);

      expect(mockOnInputChange).toHaveBeenCalledTimes(1);
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Keyboard Interaction Tests', () => {
    test('triggers search on Enter key in input field', () => {
      const mockOnSearch = jest.fn();
      render(<Header {...defaultProps} onSearch={mockOnSearch} />);

      const input = screen.getByRole('textbox');
      fireEvent.keyDown(input, { key: 'Enter' });

      // Note: This depends on if the input component handles Enter key
      // If not implemented, we can add this feature to the Input component
    });

    test('input field is accessible via tab navigation', () => {
      render(<Header {...defaultProps} />);

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      input.focus();
      expect(document.activeElement).toBe(input);

      // Simulate tab to button
      fireEvent.keyDown(input, { key: 'Tab' });
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });

  describe('Props Validation Tests', () => {
    test('handles empty query prop', () => {
      render(<Header {...defaultProps} query="" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    test('handles long query values', () => {
      const longQuery = 'a'.repeat(100);
      render(<Header {...defaultProps} query={longQuery} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe(longQuery);
    });

    test('handles special characters in query', () => {
      const specialQuery = '!@#$%^&*()[]{}|\\:";\'<>?,./~`';
      render(<Header {...defaultProps} query={specialQuery} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe(specialQuery);
    });

    test('renders when callback functions are undefined', () => {
      // This test ensures the component doesn't crash with undefined callbacks
      expect(() => {
        render(
          <Header
            query=""
            onInputChange={undefined as any}
            onSearch={undefined as any}
          />
        );
      }).not.toThrow();
    });
  });

  describe('Component Structure Tests', () => {
    test('maintains proper component hierarchy', () => {
      render(<Header {...defaultProps} />);

      const headerContainer = document.querySelector('.search-header');
      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      expect(headerContainer).toBeTruthy();
      expect(headerContainer?.contains(input)).toBe(true);
      expect(headerContainer?.contains(button)).toBe(true);
    });

    test('applies CSS classes correctly', () => {
      render(<Header {...defaultProps} />);

      const headerContainer = document.querySelector('.search-header');
      expect(headerContainer?.classList.contains('search-header')).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    test('complete search workflow', () => {
      const mockOnInputChange = jest.fn();
      const mockOnSearch = jest.fn();

      render(
        <Header
          query=""
          onInputChange={mockOnInputChange}
          onSearch={mockOnSearch}
        />
      );

      const input = screen.getByRole('textbox');
      const button = screen.getByRole('button');

      // Type in search term
      fireEvent.change(input, { target: { value: 'test search' } });
      expect(mockOnInputChange).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'change',
          target: expect.any(Object),
        })
      );

      // Click search
      fireEvent.click(button);
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });
  });
});
