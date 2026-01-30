/**
 * Service soumission vidéo - POST /api/videos/submit
 * multipart/form-data, Bearer token
 */

import api from './api';
import { formatPhoneE164 } from '../constants/submitForm';

const SUBMIT_URL = '/api/videos/submit';

/**
 * Construit FormData à partir du state formulaire (aligné API Mars.AI 2026)
 * - Fichiers: uniquement le File (pas de path), nom = file.name
 * - birthdate: ISO 8601 YYYY-MM-DD
 * - phone: E.164
 * - country: ISO 3166-1 alpha-2
 * - language: ISO 639-1
 */
export function buildSubmitFormData(form) {
  const fd = new FormData();

  // Participant
  fd.append('civility', form.participant.civility || '');
  fd.append('firstname', form.participant.firstname || '');
  fd.append('lastname', form.participant.lastname || '');
  fd.append('email', form.participant.email || '');
  fd.append('birthdate', form.participant.birthdate || '');
  fd.append('country', form.participant.country || '');
  fd.append('phone', formatPhoneE164(form.participant.phone || ''));
  fd.append('postal_code', form.participant.postal_code || '');

  // Film (titre, descriptif = champs texte)
  fd.append('title', form.film.title || '');
  fd.append('description', form.film.description || '');
  fd.append('language', form.film.language || '');
  if (form.film.duration !== '' && form.film.duration != null) {
    fd.append('duration', String(form.film.duration));
  }

  // Fichiers (on n'envoie que le fichier, pas de path)
  if (form.files.video instanceof File) {
    fd.append('video', form.files.video, form.files.video.name);
  }
  if (form.files.cover instanceof File) {
    fd.append('cover', form.files.cover, form.files.cover.name);
  }
  if (form.files.subtitles instanceof File) {
    fd.append('subtitles', form.files.subtitles, form.files.subtitles.name);
  }
  if (Array.isArray(form.files.stills)) {
    form.files.stills.forEach((file) => {
      if (file instanceof File) {
        fd.append('stills[]', file, file.name);
      }
    });
  }

  // Équipe
  form.collaborators.forEach((col, n) => {
    fd.append(`collaborators[${n}][civility]`, col.civility || '');
    fd.append(`collaborators[${n}][fullname]`, col.fullname || '');
    fd.append(`collaborators[${n}][profession]`, col.profession || '');
    fd.append(`collaborators[${n}][email]`, col.email || '');
  });

  // Consentements
  fd.append('accept_rules', form.consent.accept_rules ? 'true' : 'false');
  fd.append('accept_ownership', form.consent.accept_ownership ? 'true' : 'false');
  fd.append('subscribe_newsletter', form.subscribe_newsletter ? 'true' : 'false');

  return fd;
}

/**
 * Envoie la soumission vidéo (multipart/form-data)
 * @param {FormData} formData
 * @param {string} [token] - Bearer (si api déjà configurée avec intercepteur, peut être omis)
 */
export async function submitVideo(formData, token) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await api.post(SUBMIT_URL, formData, {
    headers: {
      ...headers,
      // Ne pas fixer Content-Type : axios ajoute multipart/form-data + boundary
    },
  });
  return response.data;
}
