
import React from 'react';
import { HierarchySelector } from '../../components/HierarchySelector';
import { StepFooter } from '../../components/StepFooter';
import { useParameterStore } from '../../store/useParameterStore';

export const Step3: React.FC = () => {
  const { hierarchy } = useParameterStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Solution Type</h2>
        <p className="text-muted-foreground">
          Choose the solution approach that fits your requirements
        </p>
      </div>
      
      <HierarchySelector level={3} />
      
      <StepFooter
        currentStep={3}
        disableNext={!hierarchy.solutionId}
      />
    </div>
  );
};
