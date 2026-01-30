import React from 'react';

const Stepper = ({ currentStep, totalSteps = 4 }) => {
  return (
    <div className="deposit-stepper">
      {[...Array(totalSteps)].map((_, i) => (
        <React.Fragment key={i}>
          <div
            className={`deposit-stepper-dot ${
              i <= currentStep ? 'deposit-stepper-dot--active' : 'deposit-stepper-dot--inactive'
            }`}
          >
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`deposit-stepper-line ${i < currentStep ? 'deposit-stepper-line--done' : ''}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
