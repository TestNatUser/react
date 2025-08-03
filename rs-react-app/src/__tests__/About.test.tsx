import React from 'react';
import { screen } from '@testing-library/react';
import { render } from './test-utils';
import About from '../components/pages/About';

describe('About Page', () => {
  test('renders about page content', () => {
    render(<About />);
    
    expect(screen.getByText('About Star Trek Seasons Explorer')).toBeInTheDocument();
    expect(screen.getByText('About This Application')).toBeInTheDocument();
    expect(screen.getByText('About the Author')).toBeInTheDocument();
    expect(screen.getByText('RS School React Course')).toBeInTheDocument();
  });

  test('includes link to RS School React course', () => {
    render(<About />);
    
    const rsSchoolLink = screen.getByRole('link', { name: /rs school react course/i });
    expect(rsSchoolLink).toHaveAttribute('href', 'https://rs.school/react/');
    expect(rsSchoolLink).toHaveAttribute('target', '_blank');
    expect(rsSchoolLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('includes back to search link', () => {
    render(<About />);
    
    const backLink = screen.getByRole('link', { name: /back to search/i });
    expect(backLink).toHaveAttribute('href', '/');
  });

  test('includes theme toggle', () => {
    render(<About />);
    
    const themeToggle = screen.getByRole('button', { name: /switch to.*theme/i });
    expect(themeToggle).toBeInTheDocument();
  });

  test('displays technology information', () => {
    render(<About />);
    
    expect(screen.getByText('Technologies Used')).toBeInTheDocument();
    expect(screen.getByText('React 18')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Redux Toolkit')).toBeInTheDocument();
  });

  test('includes STAPI data source link', () => {
    render(<About />);
    
    const stapiLink = screen.getByRole('link', { name: /star trek api \(stapi\)/i });
    expect(stapiLink).toHaveAttribute('href', 'https://stapi.co/');
    expect(stapiLink).toHaveAttribute('target', '_blank');
  });

  test('displays RS School logo', () => {
    render(<About />);
    
    const logoImage = screen.getByAltText('RS School Logo');
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute('src', 'https://rs.school/images/rs_school_js.svg');
  });
});