

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GhanaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'gold' | 'green' | 'black';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

const GhanaButton: React.FC<GhanaButtonProps> = ({
  variant = 'black',
  size = 'md',
  children,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const variantClasses = {
    red: 'bg-ghana-red text-white hover:bg-opacity-90',
    gold: 'bg-ghana-gold text-black hover:bg-opacity-90',
    green: 'bg-ghana-green text-white hover:bg-opacity-90',
    black: 'bg-black text-white hover:bg-gray-800',
  };

  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  return (
    <Button
      className={cn(
        'font-medium rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GhanaButton;