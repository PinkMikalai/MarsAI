import React, { createContext, useContext, useState, useCallback } from 'react';

const initialState = {
  consent: {
    accept_rules: false,
    accept_ownership: false,
    accept_age_18: false,
  },
  participant: {
    civility: 'M.',
    firstname: '',
    lastname: '',
    email: '',
    birthdate: '',
    country: 'FR',
    phone: '',
    phone_country: '', // indicatif mobile (vide = pays du formulaire)
    phone_landline: '',
    phone_landline_country: '', // indicatif fixe (vide = pays du formulaire)
    address: '',
    social_links: [], // { platform: string, url: string }[], max 10
  },
  subscribe_newsletter: false,
  film: {
    title: '',
    title_en: '',
    description: '',
    synopsis_en: '',
    language: 'FR',
    duration: '',
    classification: 'Hybrid',
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

export function DepositFormProvider({ children }) {
  const [form, setForm] = useState(initialState);

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
