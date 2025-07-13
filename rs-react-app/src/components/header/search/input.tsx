import { Component } from 'react';
import type { InputProps } from '../../../interfaces/interface';

class Input extends Component<InputProps> {
  render() {
    const { value, onChange, placeholder } = this.props;
    return (
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Search seasons...'}
      />
    );
  }
}

export default Input;
