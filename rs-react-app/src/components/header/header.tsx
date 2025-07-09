import React from 'react';
import Input from './search/input';
import Button from './search/button';
import './header.css';

interface HeaderProps {
  query: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ query, onInputChange, onSearch }) => (
  <div className="search-header">
    <Input value={query} onChange={onInputChange} placeholder="Search seasons..." />
    <Button onClick={onSearch}>Search</Button>
  </div>
);

export default Header;