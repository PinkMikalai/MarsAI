

export const CIVILITY_OPTIONS = [
  { value: 'M.', label: 'M.' },
  { value: 'Mme', label: 'Mme' },
  { value: 'Autre', label: 'Autre' },
];

export const LANGUAGES_ISO6391 = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
  { value: 'ar', label: 'العربية' },
  { value: 'ru', label: 'Русский' },
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

export const COUNTRIES_ISO3166 = [
  { value: 'FR', label: 'France' },
  { value: 'BE', label: 'Belgique' },
  { value: 'CH', label: 'Suisse' },
  { value: 'CA', label: 'Canada' },
  { value: 'US', label: 'États-Unis' },
  { value: 'GB', label: 'Royaume-Uni' },
  { value: 'DE', label: 'Allemagne' },
  { value: 'ES', label: 'Espagne' },
  { value: 'IT', label: 'Italie' },
  { value: 'MA', label: 'Maroc' },
  { value: 'TN', label: 'Tunisie' },
  { value: 'DZ', label: 'Algérie' },
  { value: 'SN', label: 'Sénégal' },
  { value: 'JP', label: 'Japon' },
  { value: 'CN', label: 'Chine' },
  { value: 'BR', label: 'Brésil' },
  { value: 'OTHER', label: 'Autre' },
];

/** Indicatif téléphonique (sans +) et infos pour le champ selon le pays. */
export const COUNTRY_PHONE = {
  FR: { code: '33', placeholder: '6 12 34 56 78', maxLength: 9 },
  BE: { code: '32', placeholder: '4 12 34 56 78', maxLength: 9 },
  CH: { code: '41', placeholder: '78 123 45 67', maxLength: 9 },
  CA: { code: '1', placeholder: '514 555 1234', maxLength: 10 },
  US: { code: '1', placeholder: '555 123 4567', maxLength: 10 },
  GB: { code: '44', placeholder: '7700 900123', maxLength: 10 },
  DE: { code: '49', placeholder: '151 12345678', maxLength: 11 },
  ES: { code: '34', placeholder: '612 34 56 78', maxLength: 9 },
  IT: { code: '39', placeholder: '312 345 6789', maxLength: 10 },
  MA: { code: '212', placeholder: '612 345 678', maxLength: 9 },
  TN: { code: '216', placeholder: '12 345 678', maxLength: 8 },
  DZ: { code: '213', placeholder: '551 23 45 67', maxLength: 9 },
  SN: { code: '221', placeholder: '70 123 45 67', maxLength: 9 },
  JP: { code: '81', placeholder: '90 1234 5678', maxLength: 10 },
  CN: { code: '86', placeholder: '138 1234 5678', maxLength: 11 },
  BR: { code: '55', placeholder: '11 91234 5678', maxLength: 11 },
};

/** Options pour le sélecteur d’indicatif téléphonique (+33 FR, +32 BE, …). */
export const PHONE_PREFIX_OPTIONS = COUNTRIES_ISO3166
  .filter((c) => c.value !== 'OTHER' && COUNTRY_PHONE[c.value])
  .map((c) => ({ value: c.value, label: `+${COUNTRY_PHONE[c.value].code} ${c.value}` }));

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
