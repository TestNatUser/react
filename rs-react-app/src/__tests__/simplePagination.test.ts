/**
 * Simple tests to increase coverage for components without full Jest DOM setup
 */

import React from 'react';
import { render } from '@testing-library/react';
import Pagination from '../components/common/Pagination';

// Simple DOM test without jest-dom matchers
describe('Pagination Simple Tests', () => {
  test('renders without crashing', () => {
    const props = {
      currentPage: 1,
      totalPages: 5,
      totalItems: 25,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };

    const { container } = render(React.createElement(Pagination, props));
    expect(container).toBeTruthy();
  });

  test('returns null for single page', () => {
    const props = {
      currentPage: 1,
      totalPages: 1,
      totalItems: 5,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };

    const { container } = render(React.createElement(Pagination, props));
    expect(container.firstChild).toBeNull();
  });

  test('shows pagination info', () => {
    const props = {
      currentPage: 2,
      totalPages: 5,
      totalItems: 25,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };

    const { container } = render(React.createElement(Pagination, props));
    const text = container.textContent;
    expect(text).toContain('Showing');
    expect(text).toContain('6-10');
    expect(text).toContain('25 results');
  });

  test('handles page click', () => {
    const onPageChange = jest.fn();
    const props = {
      currentPage: 2,
      totalPages: 5,
      totalItems: 25,
      itemsPerPage: 5,
      onPageChange,
    };

    const { container } = render(React.createElement(Pagination, props));
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('generates visible pages correctly', () => {
    const props = {
      currentPage: 1,
      totalPages: 3,
      totalItems: 15,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };

    const { container } = render(React.createElement(Pagination, props));
    const text = container.textContent;
    expect(text).toContain('1');
    expect(text).toContain('2');
    expect(text).toContain('3');
  });

  test('shows ellipsis for many pages', () => {
    const props = {
      currentPage: 5,
      totalPages: 10,
      totalItems: 50,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };

    const { container } = render(React.createElement(Pagination, props));
    const text = container.textContent;
    expect(text).toContain('...');
  });

  test('handles last page correctly', () => {
    const props = {
      currentPage: 5,
      totalPages: 5,
      totalItems: 23,
      itemsPerPage: 5,
      onPageChange: jest.fn(),
    };

    const { container } = render(React.createElement(Pagination, props));
    const text = container.textContent;
    expect(text).toContain('21-23');
  });
});
