
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FormCard from './FormCard';
import { useDepositForm } from '../../context/DepositFormContext';
import Icons from '../ui/common/Icons';
import { buildSubmitFormData, submitVideoWithProgress } from '../../service/videoService';

function getUploadLabel(percent) {
  if (percent < 20)  return 'Envoi de la vidéo…';
  if (percent < 50)  return 'Envoi des images et stills…';
  if (percent < 80)  return 'Envoi des données du film…';
  return 'Finalisation de l\'envoi…';
}

function formatElapsed(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}min ${s < 10 ? '0' : ''}${s}s`;
}

const SpinnerRing = () => (
  <svg className="upload-overlay-spinner" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" stroke="rgba(81,162,255,0.15)" strokeWidth="5"/>
    <path
      d="M32 6 A26 26 0 0 1 58 32"
      stroke="url(#spinGrad)"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="spinGrad" x1="32" y1="6" x2="58" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#51A2FF"/>
        <stop offset="1" stopColor="#FF2B7F"/>
      </linearGradient>
    </defs>
  </svg>
);

// Phase 1 : envoi fichiers vers backend (barre de progression réelle)
const UploadPhaseView = ({ percent }) => (
  <>
    <h2 className="upload-overlay-title">Envoi de votre film</h2>

    <div className="upload-overlay-percent">
      <motion.span
        key={percent}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
      >
        {percent}
      </motion.span>
      <span className="upload-overlay-percent-sign">%</span>
    </div>

    <div className="upload-overlay-bar-wrap">
      <motion.div
        className="upload-overlay-bar-fill"
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>

    <p className="upload-overlay-label">{getUploadLabel(percent)}</p>
  </>
);

// Phase 2 : serveur traite (S3 + YouTube + BDD)
const ProcessingPhaseView = ({ elapsed }) => {
  const steps = [
    { label: 'Fichiers reçus par le serveur', done: true },
    { label: 'Upload S3 (stockage cloud)', done: elapsed > 5 },
    { label: 'Envoi vers YouTube', done: false, active: elapsed > 5 },
    { label: 'Enregistrement en base', done: false, active: false },
  ];

  return (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
      >
        <SpinnerRing />
      </motion.div>

      <h2 className="upload-overlay-title">Traitement en cours…</h2>

      <div className="upload-overlay-steps">
        {steps.map((step, i) => (
          <div key={i} className={`upload-overlay-step ${step.done ? 'done' : step.active ? 'active' : 'pending'}`}>
            <span className="upload-overlay-step-icon">
              {step.done ? '✓' : step.active ? '◌' : '○'}
            </span>
            <span className="upload-overlay-step-label">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="upload-overlay-timer">
        {formatElapsed(elapsed)} écoulées
      </div>

      <p className="upload-overlay-warning">
        Ne fermez pas cette page — traitement YouTube en cours, cela peut prendre quelques minutes.
      </p>
    </>
  );
};

const UploadOverlay = ({ phase, percent }) => {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'processing') {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  return (
    <motion.div
      className="upload-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="upload-overlay-card"
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence mode="wait">
          {phase === 'upload' ? (
            <motion.div key="upload" className="upload-overlay-phase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <UploadPhaseView percent={percent} />
            </motion.div>
          ) : (
            <motion.div key="processing" className="upload-overlay-phase" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ProcessingPhaseView elapsed={elapsed} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const FinalisationStep = ({ onSuccess, onError }) => {
  const { t } = useTranslation();
  const { form, addCollaborator, updateCollaborator, removeCollaborator } = useDepositForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadState, setUploadState] = useState({ phase: 'idle', percent: 0 });

  const handleSubmit = async () => {
    setSubmitting(true);
    setUploadState({ phase: 'upload', percent: 0 });

    try {
      const formData = buildSubmitFormData(form);
      const token = localStorage.getItem('token') || '';

      const result = await submitVideo(formData, token || undefined);


      const result = await submitVideoWithProgress(formData, token || undefined, ({ phase, percent }) => {
        setUploadState({ phase, percent });
      });


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

        onError?.({ message: "La vidéo n'a pas pu être enregistrée correctement." });
      }
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        const msgs = err.errors.map(e => `${e.path?.join('.')}: ${e.message}`).join('\n');
        onError?.({ message: 'Erreurs de validation', errors: msgs });

      } else {
        onError?.(err?.message ? err : { message: String(err) });
      }
    } finally {
      setSubmitting(false);
      setUploadState({ phase: 'idle', percent: 0 });
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

    <>
      <AnimatePresence>
        {submitting && (
          <UploadOverlay phase={uploadState.phase} percent={uploadState.percent} />
        )}
      </AnimatePresence>

      <FormCard number="04" title="Finalisation">
        <div className="deposit-info-box">
          <div className="deposit-info-box-icon" aria-hidden><Icons.Info /></div>
          <p className="deposit-info-box-text">
            Ajoutez les collaborateurs puis finalisez votre soumission.
          </p>
        </div>

        {form.collaborators.map((col, index) => (
          <div key={index} className="deposit-field-group deposit-collab-row">
            <div className="deposit-grid-2 deposit-collab-grid">
              <div className="deposit-field-group deposit-field-group--no-margin">
                <label className="deposit-field-label deposit-field-label--jakarta">Prénom *</label>
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
                <label className="deposit-field-label deposit-field-label--jakarta">Nom *</label>

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
                <label className="deposit-field-label deposit-field-label--jakarta">Adresse mail *</label>
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

              <button
                type="button"
                className="deposit-btn-collab deposit-btn-collab--compact"
                onClick={() => removeCollaborator(index)}
              >
                {t('deposit.collabRemove')}
              </button>

              <div className="deposit-field-group deposit-field-group--no-margin deposit-field-group--inline">
                <div className="deposit-field-group--flex-1">
                  <label className="deposit-field-label deposit-field-label--jakarta">Rôle de production *</label>
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
                  Retirer
                </button>
              </div>

            </div>
          </div>
        ))}

        <button type="button" className="deposit-btn-collab" onClick={addCollaborator}>
          + ajouter collaborateur
        </button>

        <div className="deposit-certificate deposit-certificate--spaced">
          <div className="deposit-certificate-icon" aria-hidden><Icons.Lock /></div>
          <h3 className="deposit-certificate-title">Certificat de propriété</h3>
          <p className="deposit-certificate-text">
            En soumettant ce dossier, vous certifiez sur l&apos;honneur être l&apos;auteur original de l&apos;œuvre et détenir l&apos;intégralité des droits de diffusion. Vous acceptez que MARS.A.I utilise ces éléments pour la promotion du festival.
          </p>
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


        {!form.consent.accept_age_18 && (
          <p className="deposit-age-warning" role="alert">
            Vous devez confirmer avoir 18 ans ou plus (étape Conditions) pour finaliser.
          </p>
        )}

        <button
          type="button"
          className="deposit-btn-submit deposit-btn-submit-wrap"
          disabled={submitting || !form.consent.accept_age_18}
          onClick={handleSubmit}
        >
          {submitting ? 'Envoi en cours…' : 'FINALISER MA SOUMISSION'}
        </button>
      </FormCard>
    </>

  );
};

export default FinalisationStep;
