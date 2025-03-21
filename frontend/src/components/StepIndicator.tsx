

import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep, 
  className 
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  index < currentStep 
                    ? 'bg-ghana-green border-ghana-green text-white' 
                    : index === currentStep 
                    ? 'border-ghana-gold bg-ghana-gold text-black' 
                    : 'border-gray-300 bg-white text-gray-300'
                }`}
              >
                {index < currentStep ? (
                  <CheckIcon size={18} />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span 
                className={`mt-2 text-xs font-medium transition-all duration-300 ${
                  index <= currentStep ? 'text-black' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${
                  index < currentStep ? 'bg-ghana-green' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;