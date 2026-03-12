import React, { createContext, useContext, useState, useCallback } from 'react';

const initialState = {
  consent: {
    accept_rules: false,
    accept_ownership: false,
    accept_age_18: false,
  },
  participant: {
    realisator_civility: '',
    realisator_firstname: '',
    realisator_lastname: '',
    email: '',
    birthdate: '',
    country: 'FR',
    mobile_number: '',
    mobile_country: 'FR', // indicatif mobile (vide = pays du formulaire)
    phone_number: '',
    phone_country: 'FR', // indicatif fixe (vide = pays du formulaire)
    address: '',
    social_links: [], // { platform: string, url: string }[], max 10
  },
  subscribe_newsletter: false,
  film: {
    title: '',
    title_en: '',
    description: '',
    synopsis_en: '',
    tech_resume: '',
    creative_resume: '',
    language: 'FR',
    duration: '',
    classification: 'Hybrid',
    acquisition_source_id: '',
  },
  tags: [], // string[] - Tags normalisés (trim, lowercase) pour le film
  files: {
    video: null,   // File (nom uniquement, pas de path)
    cover: null,
    subtitles: null,
    stills: [],    // File[] max 5
  },
  collaborators: [],
};

const DepositFormContext = createContext(null);

function buildInitialState(initialData) {
  if (!initialData) return initialState;
  let socialLinks = [];
  if (initialData.social_media_links_json) {
    try {
      const parsed = typeof initialData.social_media_links_json === 'string'
        ? JSON.parse(initialData.social_media_links_json)
        : initialData.social_media_links_json;
      if (Array.isArray(parsed)) socialLinks = parsed;
      else if (parsed && typeof parsed === 'object') {
        socialLinks = Object.entries(parsed).map(([platform, url]) => ({ platform, url }));
      }
    } catch (_) {}
  }
  return {
    ...initialState,
    consent: { accept_rules: true, accept_ownership: true, accept_age_18: true },
    participant: {
      realisator_civility: initialData.realisator_civility || '',
      realisator_firstname: initialData.realisator_firstname || '',
      realisator_lastname: initialData.realisator_lastname || '',
      email: initialData.email || '',
      birthdate: initialData.birthdate ? initialData.birthdate.split('T')[0] : '',
      country: initialData.country || 'FR',
      mobile_number: initialData.mobile_number || '',
      mobile_country: initialData.country || 'FR',
      phone_number: initialData.phone_number || '',
      phone_country: initialData.country || 'FR',
      address: initialData.address || '',
      social_links: socialLinks,
    },
    film: {
      title: initialData.title || '',
      title_en: initialData.title_en || '',
      description: initialData.synopsis || '',
      synopsis_en: initialData.synopsis_en || '',
      tech_resume: initialData.tech_resume || '',
      creative_resume: initialData.creative_resume || '',
      language: (initialData.language || 'fr').toLowerCase(),
      duration: initialData.duration || '',
      classification: initialData.classification || 'Hybrid',
      acquisition_source_id: String(initialData.acquisition_source_id || ''),
    },
    tags: (initialData.tags || []).map(t => (typeof t === 'string' ? t : t.name || '')).filter(Boolean),
    files: { video: null, cover: null, subtitles: null, stills: [], existingCoverUrl: initialData.cover || null },
    collaborators: (initialData.contributors || []).map(c => ({
      firstname: c.firstname || '',
      lastname: c.last_name || '',
      email: c.email || '',
      profession: c.production_role || '',
    })),
  };
}

export function DepositFormProvider({ children, initialData }) {
  const [form, setForm] = useState(() => buildInitialState(initialData));

  const setConsent = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      consent: { ...prev.consent, [field]: value },
    }));
  }, []);

  const setParticipant = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      participant: { ...prev.participant, [field]: value },
    }));
  }, []);

  const setFilm = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      film: { ...prev.film, [field]: value },
    }));
  }, []);

  const setFile = useCallback((field, value) => {
    setForm((prev) => ({
      ...prev,
      files: { ...prev.files, [field]: value },
    }));
  }, []);

  const addCollaborator = useCallback(() => {
    setForm((prev) => ({
      ...prev,
      collaborators: [
        ...prev.collaborators,
        { firstname: '', lastname: '', email: '', profession: '' },
      ],
    }));
  }, []);

  const updateCollaborator = useCallback((index, field, value) => {
    setForm((prev) => {
      const next = [...prev.collaborators];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, collaborators: next };
    });
  }, []);

  const removeCollaborator = useCallback((index) => {
    setForm((prev) => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index),
    }));
  }, []);

  const setSubscribeNewsletter = useCallback((value) => {
    setForm((prev) => ({ ...prev, subscribe_newsletter: !!value }));
  }, []);

  const setTags = useCallback((tags) => {
    setForm((prev) => ({ ...prev, tags: Array.isArray(tags) ? tags : [] }));
  }, []);

  const value = {
    form,
    setConsent,
    setParticipant,
    setFilm,
    setFile,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
    setSubscribeNewsletter,
    setTags,
  };

  return (
    <DepositFormContext.Provider value={value}>
      {children}
    </DepositFormContext.Provider>
  );
}

export function useDepositForm() {
  const ctx = useContext(DepositFormContext);
  if (!ctx) throw new Error('useDepositForm must be used within DepositFormProvider');
  return ctx;
}
