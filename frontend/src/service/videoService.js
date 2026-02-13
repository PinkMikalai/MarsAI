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
  fd.append('phone_number', formatPhoneE164(form.participant.phone_landline || ''));
  fd.append('address', form.participant.address || 'Non renseigné');

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
  fd.append('title_en', form.film.title_en || form.film.title || '');
  fd.append('synopsis', form.film.description || '');
  fd.append('synopsis_en', form.film.synopsis_en || form.film.description || '');
  fd.append('tech_resume', form.film.description || '');
  fd.append('creative_resume', form.film.description || '');
  fd.append('language', form.film.language || 'fr');
  
  const durationVal = form.film.duration !== '' && form.film.duration != null
    ? String(form.film.duration)
    : '60';
  fd.append('duration', durationVal);
  
  const classification = form.film.classification === '100% AI' ? '100% AI' : 'Hybrid';
  fd.append('classification', classification);


  // Réseaux sociaux du réalisateur 
  const socialLinks = {}; // objet vide, accumulateur 
  if (form.socialLinks && Array.isArray(form.socialLinks)) { // form.socialLinks existe et c'est bien un tableau 
    form.socialLinks.forEach(link => {
      if (link.platform && link.url) {
        socialLinks[link.platform.trim()] = link.url.trim();
      }
    });
  }
  fd.append('social_media_links_json', JSON.stringify({socialLinks}));
  fd.append('acquisition_source_id', '1');

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

  const completeCollaborators = (form.collaborators || []).filter(
    (col) => (col.fullname || '').trim() && (col.email || '').trim() && (col.profession || '').trim()
  );
  if (completeCollaborators.length > 0) {
    const contributors = completeCollaborators.map((col) => {
      const nameParts = (col.fullname || '').trim().split(/\s+/);
      const firstname = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';
      return {
        firstname,
        last_name,
        email: (col.email || '').trim(),
        production_role: (col.profession || '').trim(),
        gender: col.gender || 'Other',
      };
    });
    fd.append('contributor', JSON.stringify(contributors));
  } else {
    fd.append('contributor', JSON.stringify([{
      firstname: form.participant.firstname || '',
      last_name: form.participant.lastname || '',
      email: form.participant.email || '',
      production_role: 'Réalisateur',
      gender: 'Other',
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

