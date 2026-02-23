import { countries } from 'countries-list'


export const COUNTRIES_ISO3166 = [
    // Liste des pays avec emoji drapeaux pour le select 
  ...Object.entries(countries).map(([code, country]) => ({
    value: code,
    label: country.name,
    name: country.name,
    flagClass: code.toLowerCase(),
    phone: Array.isArray(country.phone) ? country.phone[0] : country.phone,
    })),
  // On ajoute l'option "Other" à la main
  { value: 'OTHER', label: '🏳️ Autre', name: 'Other', phone: '' }
].sort((a, b) => {
  // Tri alphabétique propre sur le nom
  return a.name.localeCompare(b.name);
});

// préfixe téléphonique avec drapeaux 
export const PHONE_PREFIX_OPTIONS = COUNTRIES_ISO3166
    .filter(c => c.value !== 'OTHER' && c.phone)
    .map(c => ({
        value: c.value,
        name: c.name,
        label: `${c.phone}`,
        prefix: `${c.phone}`,
        flagClass: c.flagClass
    }));

