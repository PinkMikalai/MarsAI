// On importe la liste dynamique depuis shared
import { COUNTRIES_ISO3166, PHONE_PREFIX_OPTIONS } from '@shared/constants/countries.js';

// APRÈS (tu importes ET tu ré-exportes pour que InscriptionStep puisse le voir)
export { COUNTRIES_ISO3166, PHONE_PREFIX_OPTIONS } from '@shared/constants/countries.js';

export const CIVILITY_OPTIONS = [
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Mr', label: 'Mr' },
  { value: 'Other', label: 'Other' },
];

/** Emoji drapeau à partir du code ISO 3166-1 alpha-2 (2 lettres). */
// export const getCountryFlag = (code) => {
//   if (!code || code.length !== 2 || code === 'OTHER') return '';
//   return code
//     .toUpperCase()
//     .split('')
//     .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
//     .join('');
// };

/** Liste des pays (ISO 3166-1 alpha-2) pour sélecteur + drapeaux (flag-icons), triée par ordre alphabétique. */
// export const COUNTRIES_ISO3166 = [
//   { value: 'AF', label: 'Afghanistan' },
//   { value: 'ZA', label: 'Afrique du Sud' },
//   { value: 'AL', label: 'Albanie' },
//   { value: 'DZ', label: 'Algérie' },
//   { value: 'DE', label: 'Allemagne' },
//   { value: 'AD', label: 'Andorre' },
//   { value: 'AO', label: 'Angola' },
//   { value: 'AG', label: 'Antigua-et-Barbuda' },
//   { value: 'SA', label: 'Arabie saoudite' },
//   { value: 'AR', label: 'Argentine' },
//   { value: 'AM', label: 'Arménie' },
//   { value: 'AU', label: 'Australie' },
//   { value: 'AT', label: 'Autriche' },
//   { value: 'BS', label: 'Bahamas' },
//   { value: 'BH', label: 'Bahreïn' },
//   { value: 'BD', label: 'Bangladesh' },
//   { value: 'BB', label: 'Barbade' },
//   { value: 'BE', label: 'Belgique' },
//   { value: 'BZ', label: 'Belize' },
//   { value: 'BJ', label: 'Bénin' },
//   { value: 'BT', label: 'Bhoutan' },
//   { value: 'BY', label: 'Biélorussie' },
//   { value: 'BO', label: 'Bolivie' },
//   { value: 'BA', label: 'Bosnie-Herzégovine' },
//   { value: 'BW', label: 'Botswana' },
//   { value: 'BR', label: 'Brésil' },
//   { value: 'BN', label: 'Brunei' },
//   { value: 'BG', label: 'Bulgarie' },
//   { value: 'BF', label: 'Burkina Faso' },
//   { value: 'BI', label: 'Burundi' },
//   { value: 'KH', label: 'Cambodge' },
//   { value: 'CM', label: 'Cameroun' },
//   { value: 'CA', label: 'Canada' },
//   { value: 'CL', label: 'Chili' },
//   { value: 'CN', label: 'Chine' },
//   { value: 'CY', label: 'Chypre' },
//   { value: 'CO', label: 'Colombie' },
//   { value: 'KM', label: 'Comores' },
//   { value: 'CG', label: 'Congo' },
//   { value: 'KP', label: 'Corée du Nord' },
//   { value: 'KR', label: 'Corée du Sud' },
//   { value: 'CR', label: 'Costa Rica' },
//   { value: 'CI', label: 'Côte d\'Ivoire' },
//   { value: 'HR', label: 'Croatie' },
//   { value: 'CU', label: 'Cuba' },
//   { value: 'DK', label: 'Danemark' },
//   { value: 'DJ', label: 'Djibouti' },
//   { value: 'DM', label: 'Dominique' },
//   { value: 'EG', label: 'Égypte' },
//   { value: 'AE', label: 'Émirats arabes unis' },
//   { value: 'EC', label: 'Équateur' },
//   { value: 'ER', label: 'Érythrée' },
//   { value: 'ES', label: 'Espagne' },
//   { value: 'SZ', label: 'Eswatini' },
//   { value: 'EE', label: 'Estonie' },
//   { value: 'US', label: 'États-Unis' },
//   { value: 'ET', label: 'Éthiopie' },
//   { value: 'FJ', label: 'Fidji' },
//   { value: 'FI', label: 'Finlande' },
//   { value: 'FR', label: 'France' },
//   { value: 'GA', label: 'Gabon' },
//   { value: 'GM', label: 'Gambie' },
//   { value: 'GH', label: 'Ghana' },
//   { value: 'GR', label: 'Grèce' },
//   { value: 'GD', label: 'Grenade' },
//   { value: 'GT', label: 'Guatemala' },
//   { value: 'GN', label: 'Guinée' },
//   { value: 'GQ', label: 'Guinée équatoriale' },
//   { value: 'GW', label: 'Guinée-Bissau' },
//   { value: 'GY', label: 'Guyana' },
//   { value: 'HT', label: 'Haïti' },
//   { value: 'HN', label: 'Honduras' },
//   { value: 'HK', label: 'Hong Kong' },
//   { value: 'HU', label: 'Hongrie' },
//   { value: 'IN', label: 'Inde' },
//   { value: 'ID', label: 'Indonésie' },
//   { value: 'IQ', label: 'Irak' },
//   { value: 'IR', label: 'Iran' },
//   { value: 'IE', label: 'Irlande' },
//   { value: 'IS', label: 'Islande' },
//   { value: 'IL', label: 'Israël' },
//   { value: 'IT', label: 'Italie' },
//   { value: 'JM', label: 'Jamaïque' },
//   { value: 'JP', label: 'Japon' },
//   { value: 'JO', label: 'Jordanie' },
//   { value: 'KZ', label: 'Kazakhstan' },
//   { value: 'KE', label: 'Kenya' },
//   { value: 'KG', label: 'Kirghizistan' },
//   { value: 'KI', label: 'Kiribati' },
//   { value: 'XK', label: 'Kosovo' },
//   { value: 'KW', label: 'Koweït' },
//   { value: 'LA', label: 'Laos' },
//   { value: 'LS', label: 'Lesotho' },
//   { value: 'LV', label: 'Lettonie' },
//   { value: 'LB', label: 'Liban' },
//   { value: 'LR', label: 'Liberia' },
//   { value: 'LY', label: 'Libye' },
//   { value: 'LI', label: 'Liechtenstein' },
//   { value: 'LT', label: 'Lituanie' },
//   { value: 'LU', label: 'Luxembourg' },
//   { value: 'MO', label: 'Macao' },
//   { value: 'MK', label: 'Macédoine du Nord' },
//   { value: 'MG', label: 'Madagascar' },
//   { value: 'MY', label: 'Malaisie' },
//   { value: 'MW', label: 'Malawi' },
//   { value: 'ML', label: 'Mali' },
//   { value: 'MT', label: 'Malte' },
//   { value: 'MH', label: 'Îles Marshall' },
//   { value: 'SB', label: 'Îles Salomon' },
//   { value: 'MR', label: 'Mauritanie' },
//   { value: 'MU', label: 'Maurice' },
//   { value: 'MX', label: 'Mexique' },
//   { value: 'FM', label: 'Micronésie' },
//   { value: 'MD', label: 'Moldavie' },
//   { value: 'MC', label: 'Monaco' },
//   { value: 'MN', label: 'Mongolie' },
//   { value: 'ME', label: 'Monténégro' },
//   { value: 'MZ', label: 'Mozambique' },
//   { value: 'MM', label: 'Myanmar' },
//   { value: 'NA', label: 'Namibie' },
//   { value: 'NR', label: 'Nauru' },
//   { value: 'NP', label: 'Népal' },
//   { value: 'NI', label: 'Nicaragua' },
//   { value: 'NE', label: 'Niger' },
//   { value: 'NG', label: 'Nigeria' },
//   { value: 'NO', label: 'Norvège' },
//   { value: 'NC', label: 'Nouvelle-Calédonie' },
//   { value: 'NZ', label: 'Nouvelle-Zélande' },
//   { value: 'OM', label: 'Oman' },
//   { value: 'UG', label: 'Ouganda' },
//   { value: 'UZ', label: 'Ouzbékistan' },
//   { value: 'PK', label: 'Pakistan' },
//   { value: 'PW', label: 'Palaos' },
//   { value: 'PS', label: 'Palestine' },
//   { value: 'PA', label: 'Panama' },
//   { value: 'PG', label: 'Papouasie-Nouvelle-Guinée' },
//   { value: 'PY', label: 'Paraguay' },
//   { value: 'NL', label: 'Pays-Bas' },
//   { value: 'PE', label: 'Pérou' },
//   { value: 'PH', label: 'Philippines' },
//   { value: 'PL', label: 'Pologne' },
//   { value: 'PT', label: 'Portugal' },
//   { value: 'PR', label: 'Porto Rico' },
//   { value: 'QA', label: 'Qatar' },
//   { value: 'CF', label: 'République centrafricaine' },
//   { value: 'CD', label: 'République démocratique du Congo' },
//   { value: 'DO', label: 'République dominicaine' },
//   { value: 'CZ', label: 'République tchèque' },
//   { value: 'RO', label: 'Roumanie' },
//   { value: 'GB', label: 'Royaume-Uni' },
//   { value: 'RU', label: 'Russie' },
//   { value: 'RW', label: 'Rwanda' },
//   { value: 'LC', label: 'Sainte-Lucie' },
//   { value: 'VC', label: 'Saint-Vincent-et-les-Grenadines' },
//   { value: 'SV', label: 'Salvador' },
//   { value: 'WS', label: 'Samoa' },
//   { value: 'ST', label: 'Sao Tomé-et-Príncipe' },
//   { value: 'SN', label: 'Sénégal' },
//   { value: 'RS', label: 'Serbie' },
//   { value: 'SC', label: 'Seychelles' },
//   { value: 'SL', label: 'Sierra Leone' },
//   { value: 'SG', label: 'Singapour' },
//   { value: 'SK', label: 'Slovaquie' },
//   { value: 'SI', label: 'Slovénie' },
//   { value: 'SO', label: 'Somalie' },
//   { value: 'SD', label: 'Soudan' },
//   { value: 'SS', label: 'Soudan du Sud' },
//   { value: 'SE', label: 'Suède' },
//   { value: 'CH', label: 'Suisse' },
//   { value: 'SR', label: 'Suriname' },
//   { value: 'SY', label: 'Syrie' },
//   { value: 'TJ', label: 'Tadjikistan' },
//   { value: 'TW', label: 'Taïwan' },
//   { value: 'TZ', label: 'Tanzanie' },
//   { value: 'TD', label: 'Tchad' },
//   { value: 'TH', label: 'Thaïlande' },
//   { value: 'TL', label: 'Timor oriental' },
//   { value: 'TG', label: 'Togo' },
//   { value: 'TO', label: 'Tonga' },
//   { value: 'TT', label: 'Trinité-et-Tobago' },
//   { value: 'TM', label: 'Turkménistan' },
//   { value: 'TR', label: 'Turquie' },
//   { value: 'TV', label: 'Tuvalu' },
//   { value: 'UA', label: 'Ukraine' },
//   { value: 'VA', label: 'Vatican' },
//   { value: 'VU', label: 'Vanuatu' },
//   { value: 'VE', label: 'Venezuela' },
//   { value: 'VN', label: 'Viêt Nam' },
//   { value: 'WF', label: 'Wallis-et-Futuna' },
//   { value: 'YE', label: 'Yémen' },
//   { value: 'ZM', label: 'Zambie' },
//   { value: 'ZW', label: 'Zimbabwe' },
//   { value: 'OTHER', label: 'Autre' },
// ];

/** Même liste que les pays (libellés en français) pour le sélecteur langue. */
export const LANGUAGES_ISO6391 = COUNTRIES_ISO3166;

/** Indicatif téléphonique (sans +) et infos pour le champ selon le pays. */
// export const COUNTRY_PHONE = {
//   FR: { code: '33', placeholder: '6 12 34 56 78', maxLength: 9 },
//   BE: { code: '32', placeholder: '4 12 34 56 78', maxLength: 9 },
//   CH: { code: '41', placeholder: '78 123 45 67', maxLength: 9 },
//   CA: { code: '1', placeholder: '514 555 1234', maxLength: 10 },
//   US: { code: '1', placeholder: '555 123 4567', maxLength: 10 },
//   GB: { code: '44', placeholder: '7700 900123', maxLength: 10 },
//   DE: { code: '49', placeholder: '151 12345678', maxLength: 11 },
//   ES: { code: '34', placeholder: '612 34 56 78', maxLength: 9 },
//   IT: { code: '39', placeholder: '312 345 6789', maxLength: 10 },
//   MA: { code: '212', placeholder: '612 345 678', maxLength: 9 },
//   TN: { code: '216', placeholder: '12 345 678', maxLength: 8 },
//   DZ: { code: '213', placeholder: '551 23 45 67', maxLength: 9 },
//   SN: { code: '221', placeholder: '70 123 45 67', maxLength: 9 },
//   JP: { code: '81', placeholder: '90 1234 5678', maxLength: 10 },
//   CN: { code: '86', placeholder: '138 1234 5678', maxLength: 11 },
//   BR: { code: '55', placeholder: '11 91234 5678', maxLength: 11 },
// };

/** Options pour le sélecteur d’indicatif téléphonique (+33 FR, +32 BE, …). */
// export const PHONE_PREFIX_OPTIONS = COUNTRIES_ISO3166
//   .filter((c) => c.value !== 'OTHER' && COUNTRY_PHONE[c.value])
//   .map((c) => ({ value: c.value, label: `${c.value} +${COUNTRY_PHONE[c.value].code}` }));

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