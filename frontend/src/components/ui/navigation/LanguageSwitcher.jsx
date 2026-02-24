import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Bouton FR / EN réutilisable.
 * Ajouter className pour personnaliser l'apparence depuis le parent.
 */
const LanguageSwitcher = ({ className = 'deposit-navbar-lang' }) => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language || 'fr';

  const toggle = () => i18n.changeLanguage(current === 'fr' ? 'en' : 'fr');

  return (
    <button
      type="button"
      className={className}
      onClick={toggle}
      aria-label={current === 'fr' ? 'Switch to English' : 'Passer en français'}
    >
      {current === 'fr' ? 'EN' : 'FR'}
    </button>
  );
};

export default LanguageSwitcher;
