import { useState } from 'react';

export const useMultiStepForm = (steps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex(i => (i >= steps.length - 1 ? i : i + 1));
  };

  const back = () => {
    setCurrentStepIndex(i => (i <= 0 ? i : i - 1));
  };

  const goTo = (index) => {
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    totalSteps: steps.length,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back
  };
};
