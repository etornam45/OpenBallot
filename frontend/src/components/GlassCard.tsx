

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  onClick,
  style
}) => {
  return (
    <div 
      className={cn(
        'backdrop-blur-sm bg-white/80 dark:bg-black/80 border border-gray-200 dark:border-gray-800 rounded-lg shadow-none transition-all duration-300 hover:shadow-none',
        className
      )}
      style={style}
      onClick={() => {onClick && onClick()}}
    >
      {children}
    </div>
  );
};

export default GlassCard;