import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';

  icon?: LucideIcon;

  children: React.ReactNode;

  onClick?: () => void;

  disabled?: boolean;

  size?: 'sm' | 'md' | 'lg';
  }
  
  export function Button({ 
    children, 
    variant = 'primary', 
    icon: Icon,
    className = '', 
    ...props 
  }: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50';
    
// Update the button styles in src/components/ui/Button.tsx
const variants = {
  primary: 'bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600 disabled:hover:bg-green-600 dark:disabled:hover:bg-green-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white disabled:hover:bg-gray-100 dark:disabled:hover:bg-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600 disabled:hover:bg-red-600 dark:disabled:hover:bg-red-500'
};  
    return (
      <button 
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4 mr-2" />}
        {children}
      </button>
    );
  }