// Checkbox , case à cocher réutilisable ------------//
import React from 'react';

const Checkbox = ({ id, label, checked, onChange, required = false }) => {
  return (
    <div className="deposit-checkbox-wrap">
      <input
        type="checkbox"
        id={id}
        className="deposit-checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <label htmlFor={id} className="deposit-checkbox-label">
        {label}
        {required && ' *'}
      </label>
    </div>
  );
};

export default Checkbox;
