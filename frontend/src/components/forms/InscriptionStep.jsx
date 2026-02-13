import React, { useState, useRef, useEffect } from 'react';
import FormCard from './FormCard';
import Icons from '../ui/common/Icons';
import { useDepositForm } from '../../context/DepositFormContext';
import { CIVILITY_OPTIONS, COUNTRIES_ISO3166, COUNTRY_PHONE, PHONE_PREFIX_OPTIONS, SOCIAL_PLATFORMS, SOCIAL_LINKS_MAX } from '../../constants/submitForm';
import { SiYoutube, SiInstagram, SiFacebook, SiLinkedin, SiX, SiArtstation, SiBehance, SiVimeo, SiTiktok } from 'react-icons/si';
import { FiLink } from 'react-icons/fi';

const SOCIAL_ICONS = {
  youtube: SiYoutube,
  instagram: SiInstagram,
  facebook: SiFacebook,
  linkedin: SiLinkedin,
  x: SiX,
  artstation: SiArtstation,
  behance: SiBehance,
  vimeo: SiVimeo,
  tiktok: SiTiktok,
  other: FiLink,
};

const InscriptionStep = () => {
  const { form, setParticipant } = useDepositForm();
  const p = form.participant;
  const [countryOpen, setCountryOpen] = useState(false);
  const countryRef = useRef(null);
  const [platformOpenIndex, setPlatformOpenIndex] = useState(null);
  const platformRowRefs = useRef([]);

  useEffect(() => {
    const close = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) setCountryOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (platformOpenIndex == null) return;
    const close = (e) => {
      if (platformRowRefs.current[platformOpenIndex] && !platformRowRefs.current[platformOpenIndex].contains(e.target)) {
        setPlatformOpenIndex(null);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [platformOpenIndex]);

  const handleBirthdateChange = (e) => {
    setParticipant('birthdate', e.target.value);
  };

  const phoneCountry = p.phone_country || p.country;
  const landlineCountry = p.phone_landline_country || p.country;
  const phoneConfig = phoneCountry && phoneCountry !== 'OTHER' ? COUNTRY_PHONE[phoneCountry] : null;
  const landlineConfig = landlineCountry && landlineCountry !== 'OTHER' ? COUNTRY_PHONE[landlineCountry] : null;

  const getNationalPhone = () => {
    const raw = (p.phone || '').replace(/\D/g, '');
    if (!raw) return '';
    if (phoneConfig && raw.startsWith(phoneConfig.code)) return raw.slice(phoneConfig.code.length);
    if (phoneConfig) return raw;
    return raw;
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (phoneConfig) {
      const limited = raw.slice(0, phoneConfig.maxLength);
      setParticipant('phone', limited ? `+${phoneConfig.code}${limited}` : '');
    } else {
      const plus = (p.phone || '').trimStart().startsWith('+') ? '+' : '';
      setParticipant('phone', plus + raw);
    }
  };

  const getNationalLandline = () => {
    const raw = (p.phone_landline || '').replace(/\D/g, '');
    if (!raw) return '';
    if (landlineConfig && raw.startsWith(landlineConfig.code)) return raw.slice(landlineConfig.code.length);
    return raw;
  };

  const handleLandlineChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (landlineConfig) {
      const limited = raw.slice(0, landlineConfig.maxLength);
      setParticipant('phone_landline', limited ? `+${landlineConfig.code}${limited}` : '');
    } else {
      const plus = (p.phone_landline || '').trimStart().startsWith('+') ? '+' : '';
      setParticipant('phone_landline', plus + raw);
    }
  };

  return (
    <FormCard number="02" title="Inscription">
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          Renseignez vos informations personnelles. Tous les champs marqués d&apos;une étoile (*) sont obligatoires.
        </p>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Civilité *</label>
          <div className="deposit-field-wrap">
            <select
              className="deposit-input"
              value={p.civility}
              onChange={(e) => setParticipant('civility', e.target.value)}
            >
              {CIVILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Prénom *</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="Jean"
              value={p.firstname}
              onChange={(e) => setParticipant('firstname', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Nom *</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              placeholder="Dupont"
              value={p.lastname}
              onChange={(e) => setParticipant('lastname', e.target.value)}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Email *</label>
          <div className="deposit-field-wrap">
            <input
              type="email"
              className="deposit-input"
              placeholder="jean.dupont@example.com"
              value={p.email}
              onChange={(e) => setParticipant('email', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Date de naissance *</label>
          <div className="deposit-field-wrap">
            <input
              type="date"
              className="deposit-input"
              placeholder="JJ/MM/AAAA"
              value={p.birthdate || ''}
              onChange={handleBirthdateChange}
              max={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">Pays / Nationalité *</label>
          <div className="deposit-field-wrap deposit-field-wrap--with-flag deposit-country-select" ref={countryRef}>
            {p.country && p.country !== 'OTHER' && (
              <span
                className={`deposit-country-flag fi fi-${p.country.toLowerCase()}`}
                aria-hidden
                title={COUNTRIES_ISO3166.find((c) => c.value === p.country)?.label}
              />
            )}
            <button
              type="button"
              className="deposit-input deposit-input--with-flag deposit-country-trigger"
              onClick={() => setCountryOpen((o) => !o)}
              aria-expanded={countryOpen}
              aria-haspopup="listbox"
              aria-label="Choisir un pays"
            >
              {p.country ? (COUNTRIES_ISO3166.find((c) => c.value === p.country)?.label ?? p.country) : 'Sélectionner…'}
            </button>
            {countryOpen && (
              <ul
                className="deposit-country-list"
                role="listbox"
                aria-label="Pays"
              >
                {COUNTRIES_ISO3166.map((opt) => (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={p.country === opt.value}
                    className={`deposit-country-option ${p.country === opt.value ? 'deposit-country-option--selected' : ''}`}
                    onClick={() => {
                      setParticipant('country', opt.value);
                      setCountryOpen(false);
                    }}
                  >
                    {opt.value !== 'OTHER' && (
                      <span className={`deposit-country-flag deposit-country-flag--option fi fi-${opt.value.toLowerCase()}`} aria-hidden />
                    )}
                    <span className="deposit-country-option-label">{opt.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">
            Téléphone * {phoneConfig ? `(chiffres uniquement, ex. ${phoneConfig.placeholder})` : '(ex. +33 6 12 34 56 78)'}
          </label>
          <div className={`deposit-field-wrap ${phoneConfig ? 'deposit-field-wrap--phone-prefix' : ''}`}>
            {phoneConfig ? (
              <select
                className="deposit-phone-prefix-select"
                value={phoneCountry}
                onChange={(e) => setParticipant('phone_country', e.target.value)}
                aria-label="Indicatif téléphonique"
              >
                {PHONE_PREFIX_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : null}
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              className="deposit-input deposit-input--phone"
              placeholder={phoneConfig ? phoneConfig.placeholder : '0612345678 ou +33612345678'}
              value={phoneConfig ? getNationalPhone() : (p.phone || '')}
              onChange={handlePhoneChange}
              maxLength={phoneConfig ? phoneConfig.maxLength : undefined}
            />
          </div>
        </div>
        <div className="deposit-field-group">
          <label className="deposit-field-label deposit-field-label--jakarta">
            Téléphone fixe (optionnel) {landlineConfig ? `(ex. ${landlineConfig.placeholder})` : ''}
          </label>
          <div className={`deposit-field-wrap ${landlineConfig ? 'deposit-field-wrap--phone-prefix' : ''}`}>
            {landlineConfig ? (
              <select
                className="deposit-phone-prefix-select"
                value={landlineCountry}
                onChange={(e) => setParticipant('phone_landline_country', e.target.value)}
                aria-label="Indicatif téléphonique fixe"
              >
                {PHONE_PREFIX_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : null}
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              className="deposit-input deposit-input--phone"
              placeholder={landlineConfig ? landlineConfig.placeholder : '01 23 45 67 89'}
              value={landlineConfig ? getNationalLandline() : (p.phone_landline || '')}
              onChange={handleLandlineChange}
              maxLength={landlineConfig ? landlineConfig.maxLength : undefined}
            />
          </div>
        </div>
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label deposit-field-label--jakarta">Adresse *</label>
        <div className="deposit-field-wrap">
          <input
            type="text"
            className="deposit-input"
            placeholder="123 rue de la République, 75001 Paris"
            value={p.address}
            onChange={(e) => setParticipant('address', e.target.value)}
          />
        </div>
      </div>

      <div className="deposit-field-group">
        <label className="deposit-field-label deposit-field-label--jakarta deposit-social-links-label">Réseaux sociaux (max {SOCIAL_LINKS_MAX})</label>
        <div className="deposit-social-links">
          {(p.social_links || []).map((row, i) => {
            const selectedPlatform = SOCIAL_PLATFORMS.find((opt) => opt.value === (row.platform || ''));
            const IconComponent = row.platform ? (SOCIAL_ICONS[row.platform] || FiLink) : null;
            return (
              <div
                key={i}
                className="deposit-social-link-row deposit-platform-select-wrap"
                ref={(el) => { platformRowRefs.current[i] = el; }}
              >
                <div className="deposit-platform-select">
                  <button
                    type="button"
                    className="deposit-input deposit-input--social-platform deposit-platform-trigger"
                    onClick={() => setPlatformOpenIndex(platformOpenIndex === i ? null : i)}
                    aria-expanded={platformOpenIndex === i}
                    aria-haspopup="listbox"
                    aria-label="Choisir un réseau"
                  >
                    {IconComponent && <IconComponent className="deposit-social-platform-icon" aria-hidden />}
                    <span>{selectedPlatform ? selectedPlatform.label : '— Choisir un réseau —'}</span>
                  </button>
                  {platformOpenIndex === i && (
                    <ul className="deposit-platform-list" role="listbox" aria-label="Réseau">
                      {SOCIAL_PLATFORMS.map((opt) => {
                        const OptIcon = opt.value ? (SOCIAL_ICONS[opt.value] || FiLink) : null;
                        return (
                          <li
                            key={opt.value || 'none'}
                            role="option"
                            aria-selected={row.platform === opt.value}
                            className={`deposit-platform-option ${row.platform === opt.value ? 'deposit-platform-option--selected' : ''}`}
                            onClick={() => {
                              const next = [...(p.social_links || [])];
                              next[i] = { ...next[i], platform: opt.value };
                              setParticipant('social_links', next);
                              setPlatformOpenIndex(null);
                            }}
                          >
                            {OptIcon && <OptIcon className="deposit-social-platform-icon" aria-hidden />}
                            <span>{opt.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <input
                  type="url"
                  className="deposit-input deposit-input--social-url"
                  placeholder="https://..."
                  value={row.url || ''}
                  onChange={(e) => {
                    const next = [...(p.social_links || [])];
                    next[i] = { ...next[i], url: e.target.value };
                    setParticipant('social_links', next);
                  }}
                />
                <button
                  type="button"
                  className="deposit-social-link-remove"
                  onClick={() => setParticipant('social_links', (p.social_links || []).filter((_, j) => j !== i))}
                  aria-label="Retirer ce lien"
                >
                  ×
                </button>
              </div>
            );
          })}
          <button
            type="button"
            className="deposit-social-link-add"
            onClick={() => setParticipant('social_links', [...(p.social_links || []), { platform: '', url: '' }])}
            disabled={(p.social_links || []).length >= SOCIAL_LINKS_MAX}
            aria-label="Ajouter un lien"
          >
            +
          </button>
        </div>
      </div>
    </FormCard>
  );
};

export default InscriptionStep;
