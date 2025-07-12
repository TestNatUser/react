import { Component } from 'react';
import type { ButtonProps } from '../../../interfaces/interface';

class Button extends Component<ButtonProps> {
  render() {
    const { onClick, children, className } = this.props;
    return (
      <button onClick={onClick} className={className}>
        {children}
      </button>
    );
  }
}

export default Button; 