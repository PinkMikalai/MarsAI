import api from './api';
import { formatPhoneE164 } from '../constants/submitForm';

const SUBMIT_URL = '/participation';

export function buildSubmitFormData(form) {
  const fd = new FormData();

  fd.append('realisator_civility', form.participant.realisator_civility || 'Other');
  fd.append('realisator_firstname', form.participant.realisator_firstname || '');
  fd.append('realisator_lastname', form.participant.realisator_lastname || '');
  fd.append('email', form.participant.email || '');
  fd.append('birthdate', form.participant.birthdate || '');
  fd.append('country', form.participant.country || 'FR');
  fd.append('mobile_number', form.participant.mobile_number || '');
  fd.append('phone_number', form.participant.phone_number || '');
  fd.append('address', form.participant.address || '');

  // Réseaux sociaux : form.participant.social_links = [{ platform, url }, ...]
  const socialLinksArray = form.participant.social_links || [];
  const socialPayload = {};
  const counts = {};
  socialLinksArray.forEach(({ platform, url }) => {
    const u = (url || '').trim();
    if (!u || !platform) return;
    const n = (counts[platform] || 0) + 1;
    counts[platform] = n;
    const key = n === 1 ? platform : `${platform}_${n}`;
    socialPayload[key] = u;
  });
  fd.append('social_media_links_json', JSON.stringify(socialPayload));

  fd.append('title', form.film.title || '');
  const titleEn = (form.film.title_en || form.film.title || '').trim();
  fd.append('title_en', titleEn || '—');
  fd.append('synopsis', form.film.description || '');
  const synopsisEn = (form.film.synopsis_en || form.film.description || '').trim();
  fd.append('synopsis_en', synopsisEn || '—');
  fd.append('tech_resume', (form.film.tech_resume || '').trim());
  fd.append('creative_resume', (form.film.creative_resume || '').trim());
  fd.append('language', form.film.language || 'FR');
  
  const durationVal = form.film.duration !== '' && form.film.duration != null
    ? String(form.film.duration)
    : '60';
  fd.append('duration', durationVal);
  
  const classification = form.film.classification === '100% AI' ? '100% AI' : 'Hybrid';
  fd.append('classification', classification);

  fd.append('acquisition_source_id', String(form.film.acquisition_source_id || '1'));

  if (form.tags && Array.isArray(form.tags) && form.tags.length > 0) {
    console.log("Check form.tags", form.tags);

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

  // filtration pour ne garder que les collaborateurs saisis 
  const completeCollaborators = (form.collaborators || []).filter(
    (col) => (col.firstname || '').trim() && (col.lastname || '').trim() && (col.email || '').trim() && (col.profession || '').trim()
  );
  if (completeCollaborators.length > 0) {
    const contributors = completeCollaborators.map((col) => ({
      firstname: (col.firstname || '').trim(),
      last_name: (col.lastname || '').trim(),
      email: (col.email || '').trim(),
      production_role: (col.profession || '').trim(),
      gender: col.gender || 'Other',
    }));
    fd.append('contributor', JSON.stringify(contributors));
  } else {
    fd.append('contributor', JSON.stringify([{
      firstname: form.participant.realisator_firstname || '',
      last_name: form.participant.realisator_lastname || '',
      email: form.participant.email || '',
      production_role: 'Réalisateur',
      gender: form.participant.realisator_civility === 'Mrs' ? 'Mrs' : (form.participant.realisator_civility === 'Mr' ? 'Mr' : 'Other'),
    }]));
  }

  return fd;
}

export async function submitVideo(formData, token) {
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const data = await api(SUBMIT_URL, {
    method: 'POST',
    body: formData,
    headers: { ...headers },
  });

  return data;
}

// version avec suivi de progression (XHR requis — fetch ne supporte pas upload progress)
export function submitVideoWithProgress(formData, token, onProgress) {
  const BASE_URL = import.meta.env.VITE_API_URL;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress?.({ phase: 'upload', percent });
      }
    });

    xhr.upload.addEventListener('load', () => {
      onProgress?.({ phase: 'processing', percent: 100 });
    });

    xhr.addEventListener('load', () => {
      try {
        const contentType = xhr.getResponseHeader('Content-Type') || '';
        if (contentType.includes('application/json')) {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(data);
          }
        } else {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
          } else {
            reject(new Error(xhr.responseText || 'Erreur serveur'));
          }
        }
      } catch {
        reject(new Error('Réponse invalide du serveur'));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Erreur réseau — vérifiez votre connexion.')));
    xhr.addEventListener('abort', () => reject(new Error('Envoi annulé.')));

    xhr.open('POST', `${BASE_URL}${SUBMIT_URL}`);

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  });
}

