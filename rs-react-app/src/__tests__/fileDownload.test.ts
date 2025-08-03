import { downloadFile, arrayToCsv } from '../utils/fileDownload';

// Mock URL and document
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();
global.Blob = jest
  .fn()
  .mockImplementation((content, options) => ({ content, options }));

const mockClick = jest.fn();
Object.defineProperty(document, 'createElement', {
  writable: true,
  value: jest.fn().mockImplementation((tagName) => {
    if (tagName === 'a') {
      return {
        click: mockClick,
        href: '',
        download: '',
        style: {},
      };
    }
    return {};
  }),
});

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

// Mock console.error
const mockConsoleError = jest.fn();
Object.defineProperty(console, 'error', {
  writable: true,
  value: mockConsoleError,
});

describe('fileDownload utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('downloadFile', () => {
    test('should create blob and trigger download', () => {
      downloadFile({
        filename: 'test.csv',
        content: 'test,data\n1,2',
        mimeType: 'text/csv',
      });

      expect(global.Blob).toHaveBeenCalledWith(['test,data\n1,2'], {
        type: 'text/csv;charset=utf-8;',
      });
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockClick).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });

    test('should use default mime type when not provided', () => {
      downloadFile({
        filename: 'test.txt',
        content: 'test content',
      });

      expect(global.Blob).toHaveBeenCalledWith(['test content'], {
        type: 'text/plain;charset=utf-8;',
      });
    });

    test('should handle errors and fallback to window.open', () => {
      // Make createElement throw an error
      (document.createElement as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Test error');
      });

      downloadFile({
        filename: 'test.txt',
        content: 'test content',
      });

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Failed to download file:',
        expect.any(Error)
      );
      expect(window.open).toHaveBeenCalled();
    });
  });

  describe('arrayToCsv', () => {
    test('should return empty string for empty array', () => {
      const result = arrayToCsv([], ['header1', 'header2']);
      expect(result).toBe('');
    });

    test('should convert simple data to CSV', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 },
      ];
      const headers = ['Name', 'Age'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('Name,Age\nJohn,30\nJane,25');
    });

    test('should handle missing properties', () => {
      const data = [{ name: 'John' }, { name: 'Jane', age: 25 }];
      const headers = ['Name', 'Age'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('Name,Age\nJohn,\nJane,25');
    });

    test('should escape values containing commas', () => {
      const data = [{ name: 'John, Jr.', city: 'New York' }];
      const headers = ['Name', 'City'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('Name,City\n"John, Jr.",New York');
    });

    test('should escape values containing quotes', () => {
      const data = [{ name: 'John "Johnny" Doe', age: 30 }];
      const headers = ['Name', 'Age'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('Name,Age\n"John ""Johnny"" Doe",30');
    });

    test('should escape values containing newlines', () => {
      const data = [{ description: 'Line 1\nLine 2', value: 123 }];
      const headers = ['Description', 'Value'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('Description,Value\n"Line 1\nLine 2",123');
    });

    test('should handle header case normalization', () => {
      const data = [{ firstname: 'John', lastname: 'Doe' }];
      const headers = ['First Name', 'Last Name'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('First Name,Last Name\nJohn,Doe');
    });

    test('should convert non-string values to strings', () => {
      const data = [{ name: 'John', age: 30, active: true, balance: null }];
      const headers = ['Name', 'Age', 'Active', 'Balance'];

      const result = arrayToCsv(data, headers);
      expect(result).toBe('Name,Age,Active,Balance\nJohn,30,true,');
    });
  });
});
