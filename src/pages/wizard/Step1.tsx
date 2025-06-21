
import React from 'react';
import { HierarchySelector } from '../../components/HierarchySelector';
import { StepFooter } from '../../components/StepFooter';
import { useParameterStore } from '../../store/useParameterStore';

export const Step1: React.FC = () => {
  const { hierarchy } = useParameterStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Your Industry</h2>
        <p className="text-muted-foreground">
          Choose the industry sector that best matches your application
        </p>
      </div>
      
      <HierarchySelector level={1} />
      
      <StepFooter
        currentStep={1}
        disableNext={!hierarchy.industryId}
      />
    </div>
  );
};
