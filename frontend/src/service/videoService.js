import api from './api';
import { formatPhoneE164 } from '../constants/submitForm';

const SUBMIT_URL = '/participation';

export function buildSubmitFormData(form) {
  const fd = new FormData();

  fd.append('realisator_civility', form.participant.civility === 'M.' ? 'Mr' : (form.participant.civility === 'Mme' ? 'Mrs' : 'Other'));
  fd.append('realisator_firstname', form.participant.firstname || '');
  fd.append('realisator_lastname', form.participant.lastname || '');
  fd.append('email', form.participant.email || '');
  fd.append('birthdate', form.participant.birthdate || '');
  fd.append('country', form.participant.country || 'FR');
  fd.append('mobile_number', formatPhoneE164(form.participant.phone || ''));
  fd.append('address', form.participant.address || 'Non renseigné');

  fd.append('title', form.film.title || '');
  fd.append('title_en', form.film.title || 'Titre non renseigné');
  fd.append('synopsis', '');
  fd.append('synopsis_en', form.film.description || 'Description non renseignée');
  fd.append('tech_resume', form.film.description || 'Résumé technique non renseigné');
  fd.append('creative_resume', form.film.description || 'Résumé créatif non renseigné');
  fd.append('language', form.film.language || 'FR');
  
  if (form.film.duration !== '' && form.film.duration != null) {
    fd.append('duration', String(form.film.duration));
  } else {
    fd.append('duration', '60');
  }
  
  fd.append('classification', 'Hybrid');
  fd.append('social_media_links_json', JSON.stringify({}));
  fd.append('acquisition_source_id', '1');

  if (form.tags && Array.isArray(form.tags) && form.tags.length > 0) {
    const tagObjects = form.tags.map(tagName => ({ name: tagName }));
    fd.append('tag', JSON.stringify(tagObjects));
  } else {
    fd.append('tag', JSON.stringify([{ name: 'default' }]));
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

  if (form.collaborators && form.collaborators.length > 0) {
    const contributors = form.collaborators.map(col => {
      const nameParts = (col.fullname || '').split(' ');
      const firstname = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';
      
      return {
        firstname: firstname,
        last_name: last_name,
        email: col.email || '',
        gender: 'Other',
        production_role: col.profession || ''
      };
    });
    fd.append('contributor', JSON.stringify(contributors));
  } else {
    fd.append('contributor', JSON.stringify([{
      firstname: form.participant.firstname || '',
      last_name: form.participant.lastname || '',
      email: form.participant.email || '',
      gender: form.participant.civility === 'M.' ? 'Mr' : (form.participant.civility === 'Mme' ? 'Mrs' : 'Other'),
      production_role: 'Réalisateur'
    }]));
  }

  return fd;
}

export async function submitVideo(formData, token) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const response = await api.post(SUBMIT_URL, formData, {
    headers: { ...headers },
    timeout: 300000,
  });
  return response.data;
}