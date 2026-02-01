import React from 'react';

const FormCard = ({ number, title, children }) => {
  return (
    <section className="deposit-step-section">
      <div className="deposit-step-title">
        <span className="deposit-step-title-icon" aria-hidden />
        <h2 className="deposit-step-title-text">{number}. {title}</h2>
      </div>
      {children}
    </section>
  );
};

export default FormCard;
