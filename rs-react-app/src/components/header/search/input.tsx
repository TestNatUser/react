'use client';

import type { InputProps } from '../../../interfaces/interface';

const Input = ({ query, onInputChange, onSearch, placeholder }: InputProps) => {
  return (
    <input
      type="text"
      value={query}
      onChange={onInputChange}
      placeholder={placeholder || 'Search seasons...'}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSearch();
        }
      }}
    />
  );
};

export default Input;
