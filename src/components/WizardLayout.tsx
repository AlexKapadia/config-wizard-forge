
import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useParameterStore } from '../store/useParameterStore';

const steps = [
  { id: 1, name: 'Industry', description: 'Select your industry sector' },
  { id: 2, name: 'Technology', description: 'Choose the technology focus' },
  { id: 3, name: 'Solution', description: 'Pick the solution type' },
  { id: 4, name: 'Variant', description: 'Select solution variant' },
  { id: 5, name: 'Product', description: 'Configure parameters and calculations' }
];

export const WizardLayout: React.FC = () => {
  const navigate = useNavigate();
  const { step } = useParams();
  const currentStep = parseInt(step || '1');
  const { setCurrentStep, hierarchy } = useParameterStore();

  React.useEffect(() => {
    setCurrentStep(currentStep);
  }, [currentStep, setCurrentStep]);

  const handleStepClick = (stepId: number) => {
    // Allow navigation to current step or any previous step
    // Also allow navigation to next step if current step requirements are met
    const canNavigate = stepId <= currentStep || (stepId === currentStep + 1 && isStepComplete(currentStep));
    
    if (canNavigate) {
      navigate(`/wizard/step/${stepId}`);
    }
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return !!hierarchy.industryId;
      case 2:
        return !!hierarchy.technologyId;
      case 3:
        return !!hierarchy.solutionId;
      case 4:
        return !!hierarchy.variantId;
      case 5:
        return true; // Step 5 is always accessible once you reach it
      default:
        return false;
    }
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    if (stepId === currentStep + 1 && isStepComplete(currentStep)) return 'accessible';
    return 'locked';
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Industrial Configuration Wizard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Configure your industrial system parameters step by step
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((stepData) => {
              const status = getStepStatus(stepData.id);
              const isClickable = status === 'completed' || status === 'current' || status === 'accessible';
              
              return (
                <button
                  key={stepData.id}
                  onClick={() => handleStepClick(stepData.id)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-all ${
                    status === 'current'
                      ? 'bg-primary text-primary-foreground'
                      : status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 cursor-pointer hover:bg-green-200 dark:hover:bg-green-700'
                      : status === 'accessible'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-800'
                      : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    status === 'current'
                      ? 'bg-white text-primary'
                      : status === 'completed'
                      ? 'bg-green-500 text-white'
                      : status === 'accessible'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-300 text-slate-500'
                  }`}>
                    {status === 'completed' ? '✓' : stepData.id}
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{stepData.name}</div>
                    <div className="text-xs opacity-75">{stepData.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="backdrop-blur-md bg-white/30 dark:bg-slate-800/30 rounded-lg border border-white/20 p-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};
