import React, { useState } from 'react';
import Input from './Input';

// FieldTextArea , zone texte multilignes avec compteur de caractères ------------//
const FieldTextArea = ({ label, placeholder = '', maxLength = 500, required = false }) => {
  const [count, setCount] = useState(0);

  return (
    <Input
      label={label}
      required={required}
      footer={<span className="deposit-char-count">{count} / {maxLength}</span>}
    >
      <textarea
        placeholder={placeholder}
        className="deposit-textarea"
        maxLength={maxLength}
        onChange={(e) => setCount(e.target.value.length)}
      />
    </Input>
  );
};

export default FieldTextArea;
