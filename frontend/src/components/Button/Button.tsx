import React from 'react';
import './button.css';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'> {
  /**
   * Button variant type
   */
  variant?: 'primary' | 'secondary' | 'link' | 'text' | 'danger';
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Button contents
   */
  children?: React.ReactNode;
  /**
   * Button label (fallback if no children)
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Icon element
   */
  icon?: React.ReactNode;
  /**
   * Button type
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Link href (for link variant)
   */
  href?: string;
  /**
   * Danger state
   */
  danger?: boolean;
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  variant = 'secondary',
  size = 'medium',
  backgroundColor,
  children,
  label,
  icon,
  type = 'button',
  disabled = false,
  href,
  danger = false,
  className,
  onClick,
  ...props
}: ButtonProps) => {
  const baseClass = 'storybook-button';
  const variantClass = `${baseClass}--${danger ? 'danger' : variant}`;
  const sizeClass = `${baseClass}--${size}`;
  const disabledClass = disabled ? `${baseClass}--disabled` : '';

  const classes = [baseClass, sizeClass, variantClass, disabledClass, className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <span className={`${baseClass}__icon`}>{icon}</span>}
      {children || label}
    </>
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (href && variant === 'link') {
      window.location.href = href;
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      type={type}
      className={classes}
      style={{ backgroundColor }}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
};
