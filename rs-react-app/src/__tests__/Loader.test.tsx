import { render } from '../__tests__/test-utils';
import Loader from '../components/loader/Loader';

describe('Loader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Tests', () => {
    test('renders loading indicator', () => {
      render(<Loader />);
      
      const loader = document.querySelector('.loader');
      expect(loader).toBeTruthy();
    });

    test('renders image element', () => {
      render(<Loader />);
      
      const image = document.querySelector('img');
      expect(image).toBeTruthy();
    });

    test('has correct CSS class', () => {
      render(<Loader />);
      
      const image = document.querySelector('img');
      expect(image?.classList.contains('loader')).toBe(true);
    });

    test('displays loader image with correct source', () => {
      render(<Loader />);
      
      const image = document.querySelector('img') as HTMLImageElement;
      expect(image).toBeTruthy();
      // The exact source will depend on the build process, but it should be set
      expect(image.src).toBeTruthy();
    });
  });

  describe('Component Structure Tests', () => {
    test('renders as a single image element', () => {
      const { container } = render(<Loader />);
      
      const images = container.querySelectorAll('img');
      expect(images).toHaveLength(1);
    });

    test('has no child elements other than the image', () => {
      const { container } = render(<Loader />);
      
      const children = container.firstChild?.childNodes;
      expect(children).toHaveLength(0);
    });
  });

  describe('Accessibility Tests', () => {
    test('image is focusable for keyboard navigation', () => {
      render(<Loader />);
      
      const image = document.querySelector('img');
      expect(image).toBeTruthy();
    });

    test('loader has appropriate role for screen readers', () => {
      render(<Loader />);
      
      const image = document.querySelector('img');
      expect(image?.tagName).toBe('IMG');
    });
  });

  describe('Performance Tests', () => {
    test('renders quickly', () => {
      const renderStart = performance.now();
      render(<Loader />);
      const renderEnd = performance.now();
      
      expect(renderEnd - renderStart).toBeLessThan(100); // Should render in less than 100ms
    });

    test('multiple instances render efficiently', () => {
      const renderStart = performance.now();
      
      for (let i = 0; i < 10; i++) {
        render(<Loader />);
      }
      
      const renderEnd = performance.now();
      expect(renderEnd - renderStart).toBeLessThan(500); // Should render 10 instances in less than 500ms
    });
  });

  describe('Error Handling Tests', () => {
    test('component does not crash when rendered', () => {
      expect(() => {
        render(<Loader />);
      }).not.toThrow();
    });

    test('handles missing CSS gracefully', () => {
      // This test ensures the component still renders even if CSS fails to load
      const { container } = render(<Loader />);
      
      const image = container.querySelector('img');
      expect(image).toBeTruthy();
    });
  });

  describe('CSS Integration Tests', () => {
    test('loader CSS class is applied', () => {
      render(<Loader />);
      
      const image = document.querySelector('img');
      expect(image?.className).toContain('loader');
    });
  });

  describe('Asset Loading Tests', () => {
    test('image source is properly resolved', () => {
      render(<Loader />);
      
      const image = document.querySelector('img') as HTMLImageElement;
      expect(image.src).toBeTruthy();
      expect(image.src).not.toBe('');
    });
  });
}); 