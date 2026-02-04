
import api from './api';
import { formatPhoneE164 } from '../constants/submitForm';

const SUBMIT_URL = '/api/videos';

export function buildSubmitFormData(form) {
  const fd = new FormData();

  fd.append('civility', form.participant.civility || '');
  fd.append('firstname', form.participant.firstname || '');
  fd.append('lastname', form.participant.lastname || '');
  fd.append('email', form.participant.email || '');
  fd.append('birthdate', form.participant.birthdate || '');
  fd.append('country', form.participant.country || '');
  fd.append('phone', formatPhoneE164(form.participant.phone || ''));
  fd.append('postal_code', form.participant.postal_code || '');

  fd.append('title', form.film.title || '');
  fd.append('description', form.film.description || '');
  fd.append('language', form.film.language || '');
  if (form.film.duration !== '' && form.film.duration != null) {
    fd.append('duration', String(form.film.duration));
  }

  if (form.tags && Array.isArray(form.tags) && form.tags.length > 0) {
    fd.append('tags', JSON.stringify(form.tags));
  }

  if (form.files.video instanceof File) {
    fd.append('video_file_name', form.files.video, form.files.video.name);
  }
  if (form.files.cover instanceof File) {
    fd.append('cover', form.files.cover, form.files.cover.name);
  }
  if (form.files.subtitles instanceof File) {
    fd.append('srt_file_name', form.files.subtitles, form.files.subtitles.name);
  }
  if (Array.isArray(form.files.stills)) {
    form.files.stills.forEach((file) => {
      if (file instanceof File) {
        fd.append('still', file, file.name);
      }
    });
  }

  form.collaborators.forEach((col, n) => {
    fd.append(`collaborators[${n}][fullname]`, col.fullname || '');
    fd.append(`collaborators[${n}][profession]`, col.profession || '');
    fd.append(`collaborators[${n}][email]`, col.email || '');
  });

  fd.append('accept_rules', form.consent.accept_rules ? 'true' : 'false');
  fd.append('accept_ownership', form.consent.accept_ownership ? 'true' : 'false');
  fd.append('subscribe_newsletter', form.subscribe_newsletter ? 'true' : 'false');

  return fd;
}

export async function submitVideo(formData, token) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await api.post(SUBMIT_URL, formData, {
    headers: { ...headers },
  });
  return response.data;
}