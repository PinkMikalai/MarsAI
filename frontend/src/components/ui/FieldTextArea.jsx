import React, { useState } from 'react';

const FieldTextArea = ({ label, placeholder = '', maxLength = 500, required = false }) => {
  const [count, setCount] = useState(0);
  return (
    <div className="deposit-field-group">
      <label className="deposit-field-label">
        {label}{required && ' *'}
      </label>
      <div className="deposit-field-wrap">
        <textarea
          placeholder={placeholder}
          className="deposit-textarea"
          maxLength={maxLength}
          onChange={(e) => setCount(e.target.value.length)}
        />
      </div>
      <div className="deposit-char-count">{count} / {maxLength}</div>
    </div>
  );
};

export default FieldTextArea;
