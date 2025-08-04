# Testing Documentation

This document outlines the comprehensive testing strategy implemented for this React application.

## Test Structure

### Test Organization
```
src/
  __tests__/
    mocks/
      api.ts           # API mocking utilities
    setup.ts           # Global test setup
    test-utils.tsx     # Custom render utilities and common mocks
  components/
    header/
      search/
        Input.test.tsx
        Button.test.tsx
      Header.test.tsx
    layout/
      AppContainer.test.tsx  # (to be created)
    main/
      ResultsContainer.test.tsx
      ResultsHeader.test.tsx # (to be created)
    loader/
      Loader.test.tsx
    error/
      ErrorButton.test.tsx
      Error.test.tsx
  services/
    LocalStorageService.test.ts
  App.test.tsx
```

## Test Coverage Goals

**Target: 80% statement coverage**

### Coverage Areas
- ✅ **Search Components**: Input validation, user interactions, accessibility
- ✅ **Results Display**: Data rendering, loading states, error handling
- ✅ **Loading Components**: Visual indicators, performance
- ✅ **Error Handling**: Error boundaries, user feedback, recovery
- ✅ **API Integration**: Mocked requests, success/error scenarios
- ✅ **LocalStorage**: Data persistence, error handling
- ✅ **Main App**: State management, lifecycle, integration

## Test Categories

### 1. Component Tests
**Individual component functionality and rendering**

- **Input/Button Components**: User interactions, prop handling
- **Header Component**: Search functionality integration
- **Results Components**: Data display, empty states
- **Loader Component**: Visual feedback
- **Error Components**: Error boundaries and error buttons

### 2. Integration Tests
**Component interactions and data flow**

- **Search Workflow**: Input → API call → Results display
- **LocalStorage Integration**: Save/retrieve search terms
- **Error Recovery**: Graceful error handling throughout app

### 3. API Tests
**Network requests and responses**

- **Success Scenarios**: Data fetching and parsing
- **Error Scenarios**: Network failures, server errors
- **Loading States**: Progress indicators

### 4. Accessibility Tests
**WCAG compliance and keyboard navigation**

- **Focus Management**: Tab order, focus indicators
- **Screen Reader Support**: ARIA labels, semantic HTML
- **Keyboard Navigation**: Enter/Space key handling

### 5. Performance Tests
**Rendering speed and efficiency**

- **Initial Load**: Component mount time
- **User Interactions**: Response time to user input
- **Large Datasets**: Handling many results

## Key Testing Patterns

### Custom Test Utilities
```typescript
// src/__tests__/test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';

// Mock localStorage, API calls, and common test data
export const mockLocalStorage = { /* ... */ };
export const mockApiResponses = { /* ... */ };
```

### API Mocking
```typescript
// src/__tests__/mocks/api.ts
export const mockApiSuccess = (data: any) => { /* ... */ };
export const mockApiError = (status: number) => { /* ... */ };
```

### Test Organization
Each test file follows this structure:
- **Rendering Tests**: Basic component rendering
- **User Interaction Tests**: Click, type, keyboard events
- **Data Display Tests**: Content validation
- **Error Handling Tests**: Graceful failures
- **Accessibility Tests**: WCAG compliance
- **Performance Tests**: Speed and efficiency

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch

# Run specific test file
npm run test -- Input.test.tsx
```

### Test Configuration
- **Framework**: Jest + React Testing Library
- **Environment**: jsdom for DOM simulation
- **Mocking**: Custom mocks for API and localStorage
- **Coverage**: Statement, branch, function, and line coverage

## Test Data Management

### Mock Data Structure
```typescript
const mockApiResponses = {
  successResponse: [
    {
      uid: '1',
      title: 'Test Season 1',
      numberOfEpisodes: 10,
      series: { uid: 'series-1', title: 'Test Series 1' }
    }
  ],
  emptyResponse: [],
  errorResponse: new Error('API Error')
};
```

### LocalStorage Mocking
```typescript
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
```

## Testing Best Practices

### 1. Test Isolation
- Each test is independent
- Mocks are reset between tests
- No shared state between test cases

### 2. Realistic Testing
- Test user interactions, not implementation details
- Use realistic data and scenarios
- Test error conditions and edge cases

### 3. Accessibility Focus
- Test keyboard navigation
- Verify ARIA labels and roles
- Ensure focus management

### 4. Performance Awareness
- Monitor render times
- Test with large datasets
- Verify efficient re-renders

## Continuous Integration

### Test Automation
```yaml
# Example CI configuration
- name: Run Tests
  run: |
    npm test -- --coverage --watchAll=false
    npm run test -- --passWithNoTests
```

### Coverage Requirements
- Minimum 80% statement coverage
- All critical user flows covered
- Error scenarios tested

## Debugging Tests

### Common Issues
1. **Mock Setup**: Ensure mocks are properly configured
2. **Async Operations**: Use `waitFor` for async assertions
3. **DOM Queries**: Use appropriate testing library queries
4. **Type Errors**: Ensure TypeScript types are correct

### Debugging Tools
```bash
# Debug specific test
npm run test -- --verbose Input.test.tsx

# Debug with coverage
npm run test -- --coverage --verbose

# Debug in browser (if configured)
npm run test -- --debug
```

## Future Enhancements

### Potential Additions
- **Visual Regression Testing**: Screenshot comparisons
- **E2E Testing**: Full user journey testing
- **Performance Benchmarking**: Automated performance testing
- **Accessibility Automation**: Automated WCAG validation

### Maintenance
- Regular test review and updates
- Coverage monitoring
- Performance regression detection
- Accessibility compliance verification 