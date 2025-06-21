
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StepFooterProps {
  currentStep: number;
  onNext?: () => void;
  onBack?: () => void;
  disableNext?: boolean;
}

export const StepFooter: React.FC<StepFooterProps> = ({
  currentStep,
  onNext,
  onBack,
  disableNext = false
}) => {
  const navigate = useNavigate();

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentStep < 5) {
      navigate(`/wizard/step/${currentStep + 1}`);
    } else {
      navigate('/review');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (currentStep > 1) {
      navigate(`/wizard/step/${currentStep - 1}`);
    }
  };

  return (
    <div className="flex justify-between items-center pt-6 border-t border-white/20">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 1}
      >
        Back
      </Button>
      
      <div className="text-sm text-muted-foreground">
        Step {currentStep} of 5
      </div>
      
      <Button
        onClick={handleNext}
        disabled={disableNext}
      >
        {currentStep === 5 ? 'Review Configuration' : 'Next'}
      </Button>
    </div>
  );
};
