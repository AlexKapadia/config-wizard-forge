
import React from 'react';
import { HierarchySelector } from '../../components/HierarchySelector';
import { StepFooter } from '../../components/StepFooter';
import { useParameterStore } from '../../store/useParameterStore';

export const Step2: React.FC = () => {
  const { hierarchy } = useParameterStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Technology Focus</h2>
        <p className="text-muted-foreground">
          Choose the technology area for your configuration
        </p>
      </div>
      
      <HierarchySelector level={2} />
      
      <StepFooter
        currentStep={2}
        disableNext={!hierarchy.technologyId}
      />
    </div>
  );
};
