import type { InputProps } from '../../../interfaces/interface';

const Input = ({ value, onChange, placeholder }: InputProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder || 'Search seasons...'}
    />
  );
};

export default Input;
