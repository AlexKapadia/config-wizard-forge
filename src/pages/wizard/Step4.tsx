
import React from 'react';
import { HierarchySelector } from '../../components/HierarchySelector';
import { StepFooter } from '../../components/StepFooter';
import { useParameterStore } from '../../store/useParameterStore';

export const Step4: React.FC = () => {
  const { hierarchy } = useParameterStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Solution Variant</h2>
        <p className="text-muted-foreground">
          Choose the specific variant that matches your implementation
        </p>
      </div>
      
      <HierarchySelector level={4} />
      
      <StepFooter
        currentStep={4}
        disableNext={!hierarchy.variantId}
      />
    </div>
  );
};
