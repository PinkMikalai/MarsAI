import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiStepForm } from '../../hooks/useMultiStepForm';
import { DepositFormProvider, useDepositForm } from '../../context/DepositFormContext';
import Header from '../../components/layout/Header';
import InscriptionStep from '../../components/forms/InscriptionStep';
import UploadFilmStep from '../../components/forms/UploadFilmStep';
import EditFinalisationStep from '../../components/forms/EditFinalisationStep';
import Stepper from '../../components/ui/navigation/Stepper';
import { participantSchema, filmStepSchema } from '@shared/schemas/participationSchema.js';
import { participationService } from '../../service/participationService.js';

const UploadFilmStepNoVideo = () => <UploadFilmStep hideVideo />;

const EDIT_STEPS = [InscriptionStep, UploadFilmStepNoVideo, EditFinalisationStep];

const EditFormInner = ({ token, onSuccess, onError }) => {
  const { t } = useTranslation();
  const { form } = useDepositForm();
  const { currentStepIndex, isFirstStep, isLastStep, back, next } = useMultiStepForm(EDIT_STEPS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  const { participant: p, film } = form;

  const inscriptionComplete = participantSchema.safeParse(p).success;
  const filmDataValid = filmStepSchema.safeParse(film).success;

  const canGoNext =
    (currentStepIndex === 0 && inscriptionComplete) ||
    (currentStepIndex === 1 && filmDataValid);

  const CurrentStepComponent = EDIT_STEPS[currentStepIndex];
  const stepContent = isLastStep
    ? <EditFinalisationStep token={token} onSuccess={onSuccess} onError={onError} />
    : <CurrentStepComponent key={currentStepIndex} />;

  return (
    <div className="deposit-page">
      <div className="deposit-container">
        <Header badge="Édition" title="Modifier votre participation" />

        <div className="deposit-form-zone">
          <Stepper currentStep={currentStepIndex} totalSteps={3} />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {stepContent}
            </motion.div>
          </AnimatePresence>

          <div className="deposit-form-actions">
            {!isFirstStep && (
              <button
                type="button"
                onClick={back}
                className="deposit-btn-collab deposit-btn-collab--nav"
              >
                {t('deposit.previous')}
              </button>
            )}
            {!isLastStep && (
              <button
                type="button"
                onClick={next}
                className="deposit-btn-submit"
                disabled={!canGoNext}
              >
                {t('deposit.step')} {currentStepIndex + 2}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditParticipation = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    participationService.getParticipationByToken(token)
      .then(data => setVideoData(data.video))
      .catch(err => setError(err.message || 'Lien invalide ou expiré'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleError = (err) => {
    alert(err?.message || 'Une erreur est survenue lors de la mise à jour.');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <p>Chargement des données…</p>
      </div>
    );
  }

  if (error || !videoData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#e74c3c' }}>Lien invalide ou expiré</h2>
        <p>{error}</p>
        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Ce lien a peut-être déjà été utilisé ou a expiré (validité 7 jours).</p>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#27ae60' }}>Participation mise à jour avec succès !</h2>
        <p>Vos modifications ont bien été enregistrées. Merci pour votre participation au festival MarsAI.</p>
      </div>
    );
  }

  return (
    <DepositFormProvider initialData={videoData}>
      <EditFormInner
        token={token}
        onSuccess={() => setSuccess(true)}
        onError={handleError}
      />
    </DepositFormProvider>
  );
};

export default EditParticipation;
