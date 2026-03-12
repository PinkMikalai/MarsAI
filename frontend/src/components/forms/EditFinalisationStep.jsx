import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from './FormCard';
import Icons from '../ui/common/Icons';
import { useDepositForm } from '../../context/DepositFormContext';
import api from '../../service/api';
import ErrorMessage from '../ui/feedback/ErrorMessage.jsx';

const EditFinalisationStep = ({ token, onSuccess, onError }) => {
  const { t } = useTranslation();
  const { form, addCollaborator, updateCollaborator, removeCollaborator, setFilm } = useDepositForm();
  const [submitting, setSubmitting] = useState(false);
  const [acquisitionSources, setAcquisitionSources] = useState([]);
  const [acquisitionError, setAcquisitionError] = useState(null);

  useEffect(() => {
    const loadSources = async () => {
      try {
        const data = await api('/acquisition-sources');
        const list = data?.sources || data || [];
        setAcquisitionSources(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Erreur chargement acquisition sources:', err);
        setAcquisitionSources([]);
      }
    };
    loadSources();
  }, []);

  const handleSubmit = async () => {
    if (!form.film.acquisition_source_id) {
      setAcquisitionError('err_acquisition_source_required');
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    fd.append('token', token);

    const p = form.participant;
    fd.append('realisator_civility', p.realisator_civility || '');
    fd.append('realisator_firstname', p.realisator_firstname || '');
    fd.append('realisator_lastname', p.realisator_lastname || '');
    fd.append('email', p.email || '');
    fd.append('birthdate', p.birthdate || '');
    fd.append('country', p.country || '');
    fd.append('mobile_number', p.mobile_number || '');
    fd.append('phone_number', p.phone_number || '');
    fd.append('address', p.address || '');
    fd.append('social_media_links_json', JSON.stringify(p.social_links || []));

    const f = form.film;
    fd.append('title', f.title || '');
    fd.append('title_en', f.title_en || '');
    fd.append('synopsis', f.description || '');
    fd.append('synopsis_en', f.synopsis_en || '');
    fd.append('tech_resume', f.tech_resume || '');
    fd.append('creative_resume', f.creative_resume || '');
    fd.append('language', (f.language || '').toLowerCase());
    fd.append('classification', f.classification || '');
    fd.append('acquisition_source_id', f.acquisition_source_id || '');

    fd.append('tag', JSON.stringify((form.tags || []).map(name => ({ name }))));

    const validContributors = (form.collaborators || [])
      .filter(c => c.firstname && c.lastname && c.profession)
      .map(c => ({
        firstname: c.firstname,
        last_name: c.lastname,
        email: c.email || '',
        production_role: c.profession,
      }));
    fd.append('contributor', JSON.stringify(validContributors));

    if (form.files.cover instanceof File) {
      fd.append('cover', form.files.cover, form.files.cover.name);
    }
    if (form.files.subtitles instanceof File) {
      fd.append('srt_file_name', form.files.subtitles, form.files.subtitles.name);
    }

    try {
      await api('/participation/edit', { method: 'PUT', body: fd, checkAuth: false });
      onSuccess?.();
    } catch (err) {
      onError?.(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormCard number="03" title={t('deposit.finalisationTitle')}>
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          Vérifiez vos collaborateurs et validez les modifications.
        </p>
      </div>

      {form.collaborators.map((col, index) => (
        <div key={index} className="deposit-collab-row">
          <div className="deposit-grid-2 deposit-collab-grid">
            <div className="deposit-field-group deposit-field-group--no-margin">
              <label className="deposit-field-label deposit-field-label--jakarta">{t('deposit.collabFirstname')}</label>
              <div className="deposit-field-wrap">
                <input
                  type="text"
                  className="deposit-input"
                  placeholder="Marie"
                  value={col.firstname ?? ''}
                  onChange={(e) => updateCollaborator(index, 'firstname', e.target.value)}
                />
              </div>
            </div>
            <div className="deposit-field-group deposit-field-group--no-margin">
              <label className="deposit-field-label deposit-field-label--jakarta">{t('deposit.collabLastname')}</label>
              <div className="deposit-field-wrap">
                <input
                  type="text"
                  className="deposit-input"
                  placeholder="Martin"
                  value={col.lastname ?? ''}
                  onChange={(e) => updateCollaborator(index, 'lastname', e.target.value)}
                />
              </div>
            </div>
            <div className="deposit-field-group deposit-field-group--no-margin">
              <label className="deposit-field-label deposit-field-label--jakarta">{t('deposit.collabEmail')}</label>
              <div className="deposit-field-wrap">
                <input
                  type="email"
                  className="deposit-input"
                  placeholder="marie@example.com"
                  value={col.email ?? ''}
                  onChange={(e) => updateCollaborator(index, 'email', e.target.value)}
                />
              </div>
            </div>
            <div className="deposit-field-group deposit-field-group--no-margin">
              <label className="deposit-field-label deposit-field-label--jakarta">{t('deposit.collabRole')}</label>
              <div className="deposit-field-wrap">
                <input
                  type="text"
                  className="deposit-input"
                  placeholder="Sound Designer"
                  value={col.profession ?? ''}
                  onChange={(e) => updateCollaborator(index, 'profession', e.target.value)}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            className="deposit-btn-collab deposit-btn-collab--remove"
            onClick={() => removeCollaborator(index)}
          >
            {t('deposit.collabRemove')}
          </button>
        </div>
      ))}

      <button type="button" className="deposit-btn-collab" onClick={addCollaborator}>
        {t('deposit.addCollaborator')}
      </button>

      <div className="deposit-field-group" style={{ marginTop: '2rem' }}>
        <label className="deposit-field-label">
          {t('deposit.acquisitionSource', { defaultValue: 'Comment avez-vous connu le festival ?' })} *
        </label>
        <div className="deposit-field-wrap">
          <select
            className={`deposit-input ${acquisitionError ? 'is-invalid' : ''}`}
            value={form.film.acquisition_source_id ?? ''}
            onChange={(e) => {
              setFilm('acquisition_source_id', e.target.value);
              if (e.target.value) setAcquisitionError(null);
            }}
            onBlur={(e) => {
              if (!e.target.value) setAcquisitionError('err_acquisition_source_required');
            }}
          >
            <option value="">{t('deposit.selectPlaceholder', { defaultValue: 'Sélectionner…' })}</option>
            {acquisitionSources.map((src) => (
              <option key={src.id} value={String(src.id)}>{src.name}</option>
            ))}
          </select>
          <ErrorMessage error={acquisitionError} />
        </div>
      </div>

      <div className="deposit-certificate deposit-certificate--spaced">
        <div className="deposit-certificate-icon" aria-hidden><Icons.Lock /></div>
        <h3 className="deposit-certificate-title">{t('deposit.certificateTitle')}</h3>
        <p className="deposit-certificate-text">
          {t('deposit.certificateText')}
        </p>
      </div>

      <button
        type="button"
        className="deposit-btn-submit deposit-btn-submit-wrap"
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
      </button>
    </FormCard>
  );
};

export default EditFinalisationStep;
