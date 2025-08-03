import React from 'react';
import { Link } from 'react-router-dom';
import Input from './search/Input.tsx';
import Button from './search/Button.tsx';
import ThemeToggle from '../common/ThemeToggle';
import './header.css';
import type { HeaderProps } from '../../interfaces/interface';

const Header = ({ query, onInputChange, onSearch }: HeaderProps) => {
  return (
    <header className="search-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            <Link to="/" className="title-link">
              🖖 Star Trek Seasons
            </Link>
          </h1>
        </div>
        
        <div className="header-center">
          <div className="search-controls">
            <Input
              value={query}
              onChange={onInputChange}
              placeholder="Search seasons..."
            />
            <Button onClick={onSearch}>Search</Button>
          </div>
        </div>
        
        <div className="header-right">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
