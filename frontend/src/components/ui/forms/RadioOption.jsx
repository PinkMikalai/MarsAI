// RadioOption , option radio réutilisable ------------//
import React from 'react';

const RadioOption = ({ text, active = false, onClick }) => {
  return (
    <div className="deposit-radio-item" onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick()} role="radio" aria-checked={active} tabIndex={0}>
      <div className={`deposit-radio-circle ${active ? 'deposit-radio-circle--checked' : ''}`} />
      <span className="deposit-radio-label">{text}</span>
    </div>
  );
};

export default RadioOption;
