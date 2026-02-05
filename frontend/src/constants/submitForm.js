

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

export const VIDEO_MAX_SIZE_MB = 300;
export const COVER_MAX_SIZE_MB = 5;
export const SUBTITLES_MAX_SIZE_MB = 1;
export const STILLS_MAX_SIZE_MB = 5;
export const STILLS_MAX_COUNT = 3;
export const DURATION_MIN = 30;
export const DURATION_MAX = 120;
