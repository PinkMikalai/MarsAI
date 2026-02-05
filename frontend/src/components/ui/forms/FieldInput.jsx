import React from 'react';
import Input from './Input';

// FieldInput , champ texte classique basé sur Input (titre, nom, email, etc.) ------------//
const FieldInput = ({ label, placeholder = '', type = 'text', required = false }) => {
  return (
    <Input label={label} required={required}>
      <input
        type={type}
        placeholder={placeholder}
        className="deposit-input"
      />
    </Input>
  );
};

export default FieldInput;
