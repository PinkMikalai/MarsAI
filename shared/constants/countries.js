import { countries, getEmojiFlag } from 'countries-list'

export const COUNTRIES_ISO3166 = [
    // Liste des pays avec emoji drapeaux pour le select 
  ...Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: `${getEmojiFlag(code)} ${country.name}`,
    name: country.name,
    phone: country.phone[0] || '', // Extraction du premier code 
    emoji: getEmojiFlag(code)
    })),
  // On ajoute l'option "Other" à la main
  { value: 'OTHER', label: '🏳️ Autre', name: 'Other', phone: '' }
].sort((a, b) => {
  // Tri alphabétique propre sur le nom
  return a.name.localeCompare(b.name);
});

// préfixe téléphonique avec drapeaux 
export const PHONE_PREFIX_OPTIONS = COUNTRIES_ISO3166
    .filter(c => c.value !== 'OTHER')
    .map(c => ({
        value: c.value, 
        label: `${c.emoji} ${c.value} +${c.phone}`,
        prefix: `+${c.phone}`
    }));

