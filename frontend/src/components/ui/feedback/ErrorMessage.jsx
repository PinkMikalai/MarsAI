import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorMessage = ({ error }) => {
  const { t } = useTranslation();
  console.log("Clé reçue par ErrorMessage :", error);

  // Si pas d'erreur, on ne rend rien du tout
  if (!error) return null;

  return (
    <span 
      className="deposit-error-container"
      style={{
        color: '#ff4d4d',    // Rouge/Corail style marsAI
        fontSize: '13px',
        marginTop: '6px',
        display: 'flex',     // Flexbox pour l'alignement icône/texte
        alignItems: 'center',
        gap: '6px',
        fontWeight: '400'
      }}
    >
      {/* Icône d'avertissement orange */}
      <span style={{ color: '#ff9800', fontSize: '14px' }} aria-hidden="true">
        ⚠️
      </span>
      
      {/* Traduction automatique de la clé d'erreur */}
      {t(`deposit.errors.${error}`)}
    </span>
  );
};

export default ErrorMessage;