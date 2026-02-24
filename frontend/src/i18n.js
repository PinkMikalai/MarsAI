import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import fr from './locales/fr.json';
import en from './locales/en.json';

const STORAGE_KEY = 'marsai_lang';
// lire la langue stockée dans le localStorage _________________
function getStoredLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch (_) {}
  return undefined;
}
function setStoredLanguage(lng) {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch (_) {}
}

const saved = getStoredLanguage();

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: saved || 'fr',
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => setStoredLanguage(lng));

export default i18n;
    