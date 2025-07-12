import { Component } from 'react';
import Input from './search/input';
import Button from './search/button';
import './header.css';
import type { HeaderProps } from '../../interfaces/interface';

class Header extends Component<HeaderProps> {
  render() {
    const { query, onInputChange, onSearch } = this.props;
    return (
      <div className="search-header">
        <Input
          value={query}
          onChange={onInputChange}
          placeholder="Search seasons..."
        />
        <Button onClick={onSearch}>Search</Button>
      </div>
    );
  }
}

export default Header;
