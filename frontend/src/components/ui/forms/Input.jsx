// Input , wrapper générique pour tous les champs (label, requis, footer) ------------//
import React from 'react';


const Input = ({
  label,
  required = false,
  children,
  footer,
}) => {
  return (
    <div className="deposit-field-group">
      {label && (
        <label className="deposit-field-label">
          {label}
          {required && ' *'}
        </label>
      )}
      <div className="deposit-field-wrap">
        {children}
      </div>
      {footer && (
        <div className="deposit-field-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Input;
