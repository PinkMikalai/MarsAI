import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from './FormCard';
import Icons from '../ui/common/Icons';
import { useDepositForm } from '../../context/DepositFormContext';
import { 
  CIVILITY_OPTIONS, 
  COUNTRIES_ISO3166,
  SOCIAL_PLATFORMS, 
  SOCIAL_LINKS_MAX 
} from '../../constants/submitForm';
import { SiYoutube, SiInstagram, SiFacebook, SiLinkedin, SiX, SiArtstation, SiBehance, SiVimeo, SiTiktok } from 'react-icons/si';
import { FiLink } from 'react-icons/fi'; 
import { useFormValidation } from '../../hooks/useFormValidation.js';
import ErrorMessage from '../ui/feedback/ErrorMessage.jsx';
import { participationSchema } from '@shared/schemas/participationSchema.js';
import PhoneInput from './PhoneInput';
import "flag-icons/css/flag-icons.min.css";

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
  const { t } = useTranslation();
  const { form, setParticipant } = useDepositForm();
  const { errors, validateField, clearError } = useFormValidation(participationSchema);
  const p = form.participant;
  
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const countryRef = useRef(null);
  const countryListRef = useRef(null);
  const countrySearchTimeout = useRef(null);
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
    if (countryOpen && countryListRef.current) {
      countryListRef.current.focus();
    }
  }, [countryOpen]);

  const handleCountryKeyDown = useCallback((e) => {
    const char = e.key;
    if (char === 'Escape') {
      setCountryOpen(false);
      setCountrySearch('');
      return;
    }
    if (char.length === 1 && /[a-zA-Z]/.test(char)) {
      e.preventDefault();
      setCountrySearch(prev => {
        const newSearch = prev + char.toLowerCase();
        clearTimeout(countrySearchTimeout.current);
        countrySearchTimeout.current = setTimeout(() => setCountrySearch(''), 800);
        if (!countryListRef.current) return newSearch;
        const items = countryListRef.current.querySelectorAll('[data-country-name]');
        for (const item of items) {
          const name = item.getAttribute('data-country-name').toLowerCase();
          if (name.startsWith(newSearch)) {
            item.scrollIntoView({ block: 'nearest' });
            item.classList.add('phone-input-option--highlight');
            setTimeout(() => item.classList.remove('phone-input-option--highlight'), 600);
            break;
          }
        }
        return newSearch;
      });
    }
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

  return (
    <FormCard number="02" title={t('deposit.inscriptionTitle')}>
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          {t('deposit.inscriptionInfo')}
        </p>
      </div>

      {/* CIVILITE */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.civility')}</label>
          <div className="deposit-field-wrap">
            <select
              className="deposit-input"
              value={p.civility || ''}
              onChange={(e) => {
                setParticipant('civility', e.target.value);
                clearError('realisator_civility'); 
              }}
              onBlur={(e) => validateField('realisator_civility', e.target.value)}
            >
              <option value="">{t('deposit.selectPlaceholder')}</option>
              {CIVILITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ErrorMessage error={errors.realisator_civility} />
          </div>
        </div>


        {/* PRENOM */}
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.firstname')}</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              value={p.firstname || ''}
              onChange={(e) => {
                setParticipant('firstname', e.target.value);
                clearError('realisator_firstname');
              }}
              onBlur={(e) => validateField('realisator_firstname', e.target.value)}
            />
            <ErrorMessage error={errors.realisator_firstname} />
          </div>
        </div>
      </div>


      {/* NOM */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.lastname')}</label>
          <div className="deposit-field-wrap">
            <input
              type="text"
              className="deposit-input"
              value={p.lastname || ''}
              onChange={(e) => {
                setParticipant('lastname', e.target.value);
                clearError('realisator_lastname');
              }}
              onBlur={(e) => validateField('realisator_lastname', e.target.value)}
            />
            <ErrorMessage error={errors.realisator_lastname} />
          </div>
        </div>

        {/* EMAIL */}
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.email')}</label>
          <div className="deposit-field-wrap">
            <input
              type="email"
              className="deposit-input"
              value={p.email || ''}
              onChange={(e) => {
                setParticipant('email', e.target.value);
                clearError('email');
              }}
              onBlur={(e) => validateField('email', e.target.value)}
            />
            <ErrorMessage error={errors.email} />
          </div>
        </div>
      </div>


      {/* DATE DE NAISSANCE */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.birthDate')}</label>
          <div className="deposit-field-wrap">
            <input
              type="date"
              className={`deposit-input ${errors.birthdate ? 'is-invalid' : ''}`}
              value={p.birthdate || ''}
              onChange={(e) => {
                setParticipant('birthdate', e.target.value);
                clearError('birthdate');
              }}
              onBlur={(e) => validateField('birthdate', e.target.value)}
            />
            <ErrorMessage error={errors.birthdate} />
          </div>
        </div>



        {/* PAYS */}
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.country')}</label>
          <div className="deposit-field-wrap deposit-country-select-container" ref={countryRef} style={{ position: 'relative' }}>
            <button
              type="button"
              className={`deposit-input deposit-country-trigger ${errors.country ? 'is-invalid' : ''}`}
              onClick={() => setCountryOpen(!countryOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              {p.country && p.country !== 'OTHER' && (
                <span className={`fi fi-${p.country.toLowerCase()} deposit-flag-icon`} />
              )}
              <span>
                {p.country ? (COUNTRIES_ISO3166.find((c) => c.value === p.country)?.label) : t('deposit.selectPlaceholder')}
              </span>
            </button>

            <ErrorMessage error={errors.country} />
            
            {countryOpen && (
              <ul
                ref={countryListRef}
                className="deposit-country-list"
                role="listbox"
                tabIndex={0}
                onKeyDown={handleCountryKeyDown}
                style={{ position: 'absolute', width: '100%', zIndex: 100, maxHeight: '250px', overflowY: 'auto', outline: 'none' }}
              >
                {COUNTRIES_ISO3166.map((opt) => (
                  <li
                    key={opt.value}
                    className="deposit-country-option"
                    data-country-name={opt.name || opt.label}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => {
                      setParticipant('country', opt.value);
                      validateField('country', opt.value); // validation de la nouvelle valeur 
                      clearError('country'); //efface l'erreur 
                      if (!p.phone_country) setParticipant('phone_country', opt.value);
                      if (!p.phone_landline_country) setParticipant('phone_landline_country', opt.value);
                      setCountryOpen(false);
                    }}
                  >
                    {opt.value !== 'OTHER' && (
                       <span className={`fi fi-${opt.value.toLowerCase()} deposit-flag-icon`} />
                    )}
                    <span>{opt.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>


      {/* TELEPHONE MOBILE */}
      <div className="deposit-grid-2">
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.mobilePhone')}</label>
          <PhoneInput
            value={p.phone}
            countryCode={p.phone_country || p.country}
            onPhoneChange={(val) => {
              setParticipant('phone', val);
              clearError('mobile_number');
            }}
            onCountryChange={(val) => {
              setParticipant('phone_country', val);
              validateField('mobile_number', p.phone);
            }}
            onBlur={() => validateField('mobile_number', p.phone)}
            placeholder="612345678"
          />
          <ErrorMessage error={errors.mobile_number} />
        </div>


        {/* TELEPHONE FIXE */}
        <div className="deposit-field-group">
          <label className="deposit-field-label">{t('deposit.landlinePhone')}</label>
          <PhoneInput
            value={p.phone_landline}
            countryCode={p.phone_landline_country || p.country}
            onPhoneChange={(val) => {
              setParticipant('phone_landline', val);
              clearError('phone_number');
            }}
            onCountryChange={(val) => {
              setParticipant('phone_landline_country', val);
              validateField('phone_number', p.phone_landline);
            }}
            onBlur={() => validateField('phone_number', p.phone_landline)}
            placeholder="123456789"
          />
          <ErrorMessage error={errors.phone_number} />
        </div>
      </div>


      {/* ADRESSE */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.address')}</label>
        <div className="deposit-field-wrap">
          <input
            type="text"
            className={`deposit-input ${errors.address ? 'is-invalid' : ''}`}
            placeholder={t('deposit.addressPlaceholder')}
            value={p.address || ''}
            onChange={(e) => {
              setParticipant('address', e.target.value);
              clearError('address');
            }}
            onBlur={(e) => validateField('address', e.target.value)}
          />
          <ErrorMessage error={errors.address} />
        </div>
      </div>



      {/* RESEAUX SOCIAUX
      <div className="deposit-field-group">
        <label className="deposit-field-label">{t('deposit.socialLinks', { max: SOCIAL_LINKS_MAX })}</label>
        <div className="deposit-social-links">
          {(p.social_links || []).map((row, i) => {
            const IconComponent = SOCIAL_ICONS[row.platform] || FiLink;
            return (
              <div key={i} className="deposit-social-link-row" ref={(el) => (platformRowRefs.current[i] = el)} style={{ position: 'relative' }}>
                <div className="deposit-platform-select">
                  <button
                    type="button"
                    className="deposit-input deposit-platform-trigger"
                    onClick={() => setPlatformOpenIndex(platformOpenIndex === i ? null : i)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <IconComponent className="deposit-social-platform-icon" />
                    <span>{SOCIAL_PLATFORMS.find(s => s.value === row.platform)?.label || t('footer.navigationTitle')}</span>
                  </button>
                  
                  {platformOpenIndex === i && (
                    <ul className="deposit-platform-list" style={{ position: 'absolute', zIndex: 100, width: '200px' }}>
                      {SOCIAL_PLATFORMS.map((opt) => {
                        const OptIcon = SOCIAL_ICONS[opt.value] || FiLink;
                        return (
                          <li
                            key={opt.value}
                            className="deposit-platform-option"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}
                            onClick={() => {
                              const next = [...p.social_links];
                              next[i].platform = opt.value;
                              setParticipant('social_links', next);
                              setPlatformOpenIndex(null);
                            }}
                          >
                            <OptIcon />
                            {opt.label}
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
                    const next = [...p.social_links];
                    next[i].url = e.target.value;
                    setParticipant('social_links', next);
                  }}
                />
                <button
                  type="button"
                  className="deposit-social-link-remove"
                  onClick={() => setParticipant('social_links', p.social_links.filter((_, j) => j !== i))}
                >
                  ×
                </button>
              </div>
            );
          })}
          
          <button
            type="button"
            className="deposit-social-link-add"
            disabled={(p.social_links || []).length >= SOCIAL_LINKS_MAX}
            onClick={() => setParticipant('social_links', [...(p.social_links || []), { platform: '', url: '' }])}
          >

            {t('deposit.addSocialLink')}

            + 
          </button>
        </div>
      </div> */}

      {/* RESEAUX SOCIAUX */}
      <div className="deposit-field-group">
        <label className="deposit-field-label">Réseaux sociaux (max {SOCIAL_LINKS_MAX})</label>
        <div className="deposit-social-links">
          {(p.social_links || []).map((row, i) => {
            const IconComponent = SOCIAL_ICONS[row.platform] || FiLink;
            
            // DÉFINITION DES CLÉS POUR ZOD
            const platformKey = `social_links.${i}.platform`;
            const urlKey = `social_links.${i}.url`;

            return (
              <div key={i} className="deposit-social-link-wrapper" style={{ marginBottom: '1rem' }}>
                <div 
                  className="deposit-social-link-row" 
                  ref={(el) => (platformRowRefs.current[i] = el)} 
                  style={{ position: 'relative' }}
                >
                  <div className="deposit-platform-select">
                    <button
                      type="button"
                      // Ajout de la classe d'erreur si la plateforme est manquante
                      className={`deposit-input deposit-platform-trigger ${errors[platformKey] ? 'is-invalid' : ''}`}
                      onClick={() => setPlatformOpenIndex(platformOpenIndex === i ? null : i)}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <IconComponent className="deposit-social-platform-icon" />
                      <span>{SOCIAL_PLATFORMS.find(s => s.value === row.platform)?.label || 'Réseau'}</span>
                    </button>
                    
                    {platformOpenIndex === i && (
                      <ul className="deposit-platform-list" style={{ position: 'absolute', zIndex: 100, width: '200px' }}>
                        {SOCIAL_PLATFORMS.map((opt) => (
                          <li
                            key={opt.value}
                            className="deposit-platform-option"
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', cursor: 'pointer' }}
                            onClick={() => {
                              const next = [...p.social_links];
                              next[i].platform = opt.value;
                              setParticipant('social_links', next);
                              setPlatformOpenIndex(null);
                              
                              // Nettoyage de l'erreur au choix
                              clearError(platformKey);
                              // Validation du groupe pour vérifier la cohérence
                              validateField('social_links', next);
                            }}
                          >
                            {opt.label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <input
                    type="url"
                    // Bordure rouge si l'URL est invalide selon Zod
                    className={`deposit-input deposit-input--social-url ${errors[urlKey] ? 'is-invalid' : ''}`}
                    placeholder="https://..."
                    value={row.url || ''}
                    onChange={(e) => {
                      const next = [...p.social_links];
                      next[i].url = e.target.value;
                      setParticipant('social_links', next);
                      // On efface l'erreur dès que l'utilisateur tape
                      clearError(urlKey);
                    }}
                    // Validation quand on quitte le champ
                    onBlur={() => validateField('social_links', p.social_links)}
                  />
                  
                  <button
                    type="button"
                    className="deposit-social-link-remove"
                    onClick={() => {
                      const next = p.social_links.filter((_, j) => j !== i);
                      setParticipant('social_links', next);
                      // On re-valide le tableau après suppression
                      validateField('social_links', next);
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* AFFICHAGE DES MESSAGES D'ERREURS SOUS LA LIGNE */}
                <div className="social-field-errors" style={{ marginTop: '4px' }}>
                  {errors[platformKey] && <ErrorMessage error={errors[platformKey]} />}
                  {errors[urlKey] && <ErrorMessage error={errors[urlKey]} />}
                </div>
              </div>
            );
          })}

          {/* Message d'erreur global pour le tableau social_links */}
          <ErrorMessage error={errors.social_links} />
          
          <button
            type="button"
            className="deposit-social-link-add"
            disabled={(p.social_links || []).length >= SOCIAL_LINKS_MAX}
            onClick={() => {
              const next = [...(p.social_links || []), { platform: '', url: '' }];
              setParticipant('social_links', next);
              // On ne valide pas à l'ajout pour ne pas effrayer l'utilisateur avec du rouge
            }}
          >
            + Ajouter un réseau

          </button>
        </div>
      </div>

    </FormCard>
  );
};

export default InscriptionStep;
