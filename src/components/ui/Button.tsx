import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary';
type Size = 'md' | 'sm';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

/**
 * The app's single button primitive. Variants and sizes map to CSS module
 * classes so callers never reach for raw styling.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...rest
}: Props) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...rest} />;
}
