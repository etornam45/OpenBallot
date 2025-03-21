
import React from 'react';
import OpenBallotLogo from '../OpenBallotLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title,
  subtitle
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <OpenBallotLogo size="lg" className="mb-6 animate-fadeIn" />
          <h1 className="text-2xl font-semibold text-foreground mb-2 animate-slideUp animate-delay-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-muted-foreground text-center animate-slideUp animate-delay-200">
              {subtitle}
            </p>
          )}
        </div>
        <div className="glassmorphism rounded-2xl p-8 animate-slideUp animate-delay-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;