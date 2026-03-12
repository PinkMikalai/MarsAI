import React, { createContext, useContext, useState, useCallback } from 'react';

const initialState = {
  participant: {
    realisator_civility: '',
    realisator_firstname: '',
    realisator_lastname: '',
    email: '',
    birthdate: '',
    country: 'FR',
    mobile_number: '',
    mobile_country: 'FR',
    phone_number: '',
    phone_country: 'FR',
    address: '',
    social_links: [],
  },
  film: {
    title: '',
    title_en: '',
    synopsis_en: '',
    synopsis: '',
    tech_resume: '',
    creative_resume: '',
    language: 'FR',
    duration: '',
    classification: 'Hybrid',
    acquisition_source_id: '',
  },
  tags: [],
  files: {
    cover: null,
    subtitles: null,
    stills: [],
  },
  collaborators: [],
};

const EditFormContext = createContext(null);

export function EditFormProvider({ children, initialData }) {
  const [form, setForm] = useState(() => {
    if (!initialData) return initialState;

    // Transformer les données de l'API vers la structure du formulaire
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
        synopsis_en: initialData.synopsis_en || '',
        synopsis: initialData.synopsis || '',
        tech_resume: initialData.tech_resume || '',
        creative_resume: initialData.creative_resume || '',
        language: initialData.language || 'FR',
        duration: initialData.duration || '',
        classification: initialData.classification || 'Hybrid',
        acquisition_source_id: initialData.acquisition_source_id || '',
      },
      tags: (initialData.tags || []).map(t => t.name || t),
      files: {
        cover: null,
        subtitles: null,
        stills: [],
      },
      collaborators: (initialData.contributors || []).map(c => ({
        firstname: c.firstname || '',
        lastname: c.last_name || '',
        email: c.email || '',
        profession: c.production_role || '',
      })),
    };
  });

  const setParticipant = useCallback((field, value) => {
    setForm(prev => ({ ...prev, participant: { ...prev.participant, [field]: value } }));
  }, []);

  const setFilm = useCallback((field, value) => {
    setForm(prev => ({ ...prev, film: { ...prev.film, [field]: value } }));
  }, []);

  const setFile = useCallback((field, value) => {
    setForm(prev => ({ ...prev, files: { ...prev.files, [field]: value } }));
  }, []);

  const setTags = useCallback((tags) => {
    setForm(prev => ({ ...prev, tags: Array.isArray(tags) ? tags : [] }));
  }, []);

  const addCollaborator = useCallback(() => {
    setForm(prev => ({
      ...prev,
      collaborators: [...prev.collaborators, { firstname: '', lastname: '', email: '', profession: '' }],
    }));
  }, []);

  const updateCollaborator = useCallback((index, field, value) => {
    setForm(prev => {
      const next = [...prev.collaborators];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, collaborators: next };
    });
  }, []);

  const removeCollaborator = useCallback((index) => {
    setForm(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter((_, i) => i !== index),
    }));
  }, []);

  const value = {
    form,
    setParticipant,
    setFilm,
    setFile,
    setTags,
    addCollaborator,
    updateCollaborator,
    removeCollaborator,
  };

  return (
    <EditFormContext.Provider value={value}>
      {children}
    </EditFormContext.Provider>
  );
}

export function useEditForm() {
  const ctx = useContext(EditFormContext);
  if (!ctx) throw new Error('useEditForm must be used within EditFormProvider');
  return ctx;
}
