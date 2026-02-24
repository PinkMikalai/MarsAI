import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormCard from './FormCard';
import { useDepositForm } from '../../context/DepositFormContext';
import Icons from '../ui/common/Icons';
import { buildSubmitFormData, submitVideo } from '../../service/videoService';

const FinalisationStep = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const { form, addCollaborator, updateCollaborator, removeCollaborator } = useDepositForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formData = buildSubmitFormData(form);
      const token = localStorage.getItem('token') || '';
      const result = await submitVideo(formData, token || undefined);

      if (result?.videoId) {
        onSuccess?.(result);
      } else {
        onError?.({ message: t('deposit.errorNotRecorded') });
      }
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const errorMessages = errors.map(e => `${e.path?.join('.')}: ${e.message}`).join('\n');
        onError?.({
          message: t('common.error'),
          errors: errorMessages,
          details: errors
        });
      } else {
        onError?.(err.response?.data || err.message || err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormCard number="04" title={t('deposit.finalisationTitle')}>
      <div className="deposit-info-box">
        <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
        <p className="deposit-info-box-text">
          {t('deposit.finalisationInfo')}
        </p>
      </div>

      {form.collaborators.map((col, index) => (
        <div key={index} className="deposit-field-group deposit-collab-row">
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
            <div className="deposit-field-group deposit-field-group--no-margin deposit-field-group--inline">
              <div className="deposit-field-group--flex-1">
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
              <button
                type="button"
                className="deposit-btn-collab deposit-btn-collab--compact"
                onClick={() => removeCollaborator(index)}
              >
                {t('deposit.collabRemove')}
              </button>
            </div>
          </div>
        </div>
      ))}

      <button type="button" className="deposit-btn-collab" onClick={addCollaborator}>
        {t('deposit.addCollaborator')}
      </button>

      <div className="deposit-certificate deposit-certificate--spaced">
        <div className="deposit-certificate-icon" aria-hidden><Icons.Lock /></div>
        <h3 className="deposit-certificate-title">{t('deposit.certificateTitle')}</h3>
        <p className="deposit-certificate-text">
          {t('deposit.certificateText')}
        </p>
      </div>

      {!form.consent.accept_age_18 && (
        <p className="deposit-age-warning" role="alert">
          {t('deposit.ageWarning')}
        </p>
      )}
      <button
        type="button"
        className="deposit-btn-submit deposit-btn-submit-wrap"
        disabled={submitting || !form.consent.accept_age_18}
        onClick={handleSubmit}
      >
        {submitting ? t('deposit.submitting') : t('deposit.finaliseSubmission')}
      </button>
    </FormCard>
  );
};

export default FinalisationStep;
