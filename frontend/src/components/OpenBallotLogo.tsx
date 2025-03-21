


interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const OpenBallotLogo: React.FC<LogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'sm' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]} aspect-square`}>
        <div className="absolute inset-0 rounded-full border-4 border-ghana-gold flex items-center justify-center overflow-hidden">
          <div className="absolute h-1/3 w-full bg-ghana-red top-0"></div>
          <div className="absolute h-1/3 w-full bg-ghana-gold top-1/3"></div>
          <div className="absolute h-1/3 w-full bg-ghana-green bottom-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-black font-bold text-${size}`}>OB</span>
          </div>
        </div>
      </div>
      {showText && (
        <span className="ml-2 font-bold text-xl tracking-tight">OpenBallot</span>
      )}
    </div>
  );
};

export default OpenBallotLogo;