import React from 'react';
import { useIntl } from 'react-intl';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const intl = useIntl();
  const { theme, toggleTheme } = useTheme();

  const label = theme === 'light' 
    ? intl.formatMessage({ id: 'theme.toggle.dark' })
    : intl.formatMessage({ id: 'theme.toggle.light' });

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
