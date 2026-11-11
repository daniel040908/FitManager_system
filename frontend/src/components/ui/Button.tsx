import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & { variant?: 'primary' | 'secondary' | 'danger' };
export function Button({ children, variant = 'primary', className = '', ...props }: Props) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>;
}
