// Button , bouton réutilisable avec variantes (primary, outline) ------------//
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const variantClass = variant === 'outline' ? 'btn--outline' : 'btn--primary';
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variantClass}`}
    >
      {children}
    </button>
  );
};

export default Button;
