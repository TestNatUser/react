import React from 'react';
import { useTranslations } from 'next-intl';
import { useTheme } from '../../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const t = useTranslations();
  const { theme, toggleTheme } = useTheme();

  const label = theme === 'light' 
    ? t('theme.toggle.dark')
    : t('theme.toggle.light');

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
