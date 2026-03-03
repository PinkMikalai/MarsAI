<<<<<<< HEAD
// On importe la liste dynamique depuis shared
import { COUNTRIES_ISO3166, PHONE_PREFIX_OPTIONS } from '@shared/constants/countries.js';

=======
// liste des langues
import ISO6391 from 'iso-639-1';

// On importe la liste dynamique depuis shared
import { COUNTRIES_ISO3166, PHONE_PREFIX_OPTIONS } from '@shared/constants/countries.js';

>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
// APRÈS (tu importes ET tu ré-exportes pour que InscriptionStep puisse le voir)
export { COUNTRIES_ISO3166, PHONE_PREFIX_OPTIONS } from '@shared/constants/countries.js';

export const CIVILITY_OPTIONS = [
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Mr', label: 'Mr' },
  { value: 'Other', label: 'Other' },
];

/** Emoji drapeau à partir du code ISO 3166-1 alpha-2 (2 lettres). */
export const getCountryFlag = (code) => {
  if (!code || code.length !== 2 || code === 'OTHER') return '';
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
};


<<<<<<< HEAD
=======

/** Langues ISO 639-1 pour le sélecteur (libellés en écriture native) + option muet. */
const _raw = ISO6391.getAllCodes().map((code) => ({
  value: code,
  label: ISO6391.getNativeName(code) || code,
}));
// Dédupliquer par value (certains codes peuvent être dupliqués)
const _byValue = new Map();
_raw.forEach((o) => { if (!_byValue.has(o.value)) _byValue.set(o.value, o); });
export const LANGUAGES_ISO6391 = [
  { value: 'silent', label: '🔇 Muet / Sans parole / Pas de langue' },
  ...Array.from(_byValue.values()).sort((a, b) => a.label.localeCompare(b.label)),
];
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921


<<<<<<< HEAD

=======
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921

/** Options pour le sélecteur d’indicatif téléphonique (+33 FR, +32 BE, …). */
// export const PHONE_PREFIX_OPTIONS = COUNTRIES_ISO3166
//   .filter((c) => c.value !== 'OTHER' && COUNTRY_PHONE[c.value])
<<<<<<< HEAD
//   .map((c) => ({ value: c.value, label: `${c.value} +${COUNTRY_PHONE[c.value].code}` }));
=======
//   .map((c) => ({ value: c.value, label: ${c.value} +${COUNTRY_PHONE[c.value].code} }));
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921

/** Réseaux sociaux : plateforme au choix + lien (max 10). */
export const SOCIAL_PLATFORMS = [
  { value: '', label: '— Choisir un réseau —' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'artstation', label: 'ArtStation' },
  { value: 'behance', label: 'Behance' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'other', label: 'Autre' },
];

export const SOCIAL_LINKS_MAX = 10;

// formatBirthdateForApi , formate la date de naissance pour l'API ------------//
export const formatBirthdateForApi = (dateStr) => {
  if (!dateStr) return '';

  if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${y}-${m}-${day}`;
};

// formatPhoneE164 , formate le téléphone au format E.164 ------------//
export const formatPhoneE164 = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('33') && digits.length >= 11) return `+${digits}`;
  if (digits.startsWith('0') && digits.length >= 10) return `+33${digits.slice(1)}`;
  if (digits.length >= 10) return `+${digits}`;
  return raw.startsWith('+') ? raw : `+${digits}`;
};



export const VIDEO_MAX_SIZE_MB = 100;
export const COVER_MAX_SIZE_MB = 5;
export const SUBTITLES_MAX_SIZE_MB = 1;
export const STILLS_MAX_SIZE_MB = 5;
export const STILLS_MAX_COUNT = 3;
export const DURATION_MIN = 30;
export const DURATION_MAX = 120;