import Input from './search/Input.tsx';
import Button from './search/Button.tsx';
import './header.css';
import type { HeaderProps } from '../../interfaces/interface';

const Header = ({ query, onInputChange, onSearch }: HeaderProps) => {
  return (
    <div className="search-header">
      <div className="search-controls">
        <Input
          value={query}
          onChange={onInputChange}
          placeholder="Search seasons..."
        />
        <Button onClick={onSearch}>Search</Button>
      </div>
      <ThemeToggle />
    </div>
  );
};

export default Header;
