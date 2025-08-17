'use client';

import type { ButtonProps } from '../../../interfaces/interface';

const Button = ({ onClick, children, className }: ButtonProps) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
