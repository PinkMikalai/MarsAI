import React from 'react';

const FieldInput = ({ label, placeholder = '', type = 'text', required = false }) => {
  return (
    <div className="deposit-field-group">
      <label className="deposit-field-label">
        {label}{required && ' *'}
      </label>
      <div className="deposit-field-wrap">
        <input
          type={type}
          placeholder={placeholder}
          className="deposit-input"
        />
      </div>
    </div>
  );
};

export default FieldInput;
