import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMultiStepForm } from '../../hooks/useMultiStepForm';
import { DepositFormProvider, useDepositForm } from '../../context/DepositFormContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import ConsentStep from '../../components/forms/ConsentStep';
import InscriptionStep from '../../components/forms/InscriptionStep';
import UploadFilmStep from '../../components/forms/UploadFilmStep';
import FinalisationStep from '../../components/forms/FinalisationStep';
import Stepper from '../../components/ui/navigation/Stepper';
import SuccessModal from '../../components/ui/feedback/SuccessModal';

const STEP_COMPONENTS = [ConsentStep, InscriptionStep, UploadFilmStep, FinalisationStep];

const DepositFilmInner = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { form } = useDepositForm();
  const { currentStepIndex, isFirstStep, isLastStep, back, next } =
    useMultiStepForm(STEP_COMPONENTS);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);

  const { participant: p, film, files } = form;

  // Validation par étape
  const consentComplete =
    form.consent.accept_age_18 &&
    form.consent.accept_rules &&
    form.consent.accept_ownership;

  const inscriptionComplete =
    !!p.civility?.trim() &&
    !!p.firstname?.trim() &&
    !!p.lastname?.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email || '') &&
    !!p.birthdate &&
    !!p.country &&
    !!p.phone?.trim() &&
    !!p.address?.trim();

  const uploadComplete =
    !!files.video &&
    !!files.cover &&
    !!film.title_en?.trim() &&
    !!film.synopsis_en?.trim() &&
    !!film.tech_resume?.trim() &&
    !!film.creative_resume?.trim();

  const canGoNext =
    (currentStepIndex === 0 && consentComplete) ||
    (currentStepIndex === 1 && inscriptionComplete) ||
    (currentStepIndex === 2 && uploadComplete);

  // Animation "bouton vient de s'activer" (étape 0 seulement)
  const [justEnabled, setJustEnabled] = useState(false);
  const prevConsentRef = React.useRef(consentComplete);
  React.useEffect(() => {
    if (currentStepIndex === 0 && consentComplete && !prevConsentRef.current) {
      setJustEnabled(true);
      const timer = setTimeout(() => setJustEnabled(false), 900);
      return () => clearTimeout(timer);
    }
    prevConsentRef.current = consentComplete;
  }, [consentComplete, currentStepIndex]);

  const STEP_HINTS = [
    t('deposit.consentHint'),
    t('deposit.inscriptionHint'),
    t('deposit.uploadHint'),
  ];

  // Handlers
  const handleSuccess = (result) => {
    if (result?.videoId) {
      setSuccessData({
        ...result,
        message: result.message || t('deposit.successDefaultMsg'),
      });
      setShowSuccessModal(true);
    } else {
      handleError({ message: t('deposit.errorNotRecordedRetry') });
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };

  const handleError = (err) => {
    let errorMessage = t('deposit.errorSending');
    if (err?.message) errorMessage = err.message;
    if (err?.errors && typeof err.errors === 'string') {
      errorMessage += '\n\nDetails:\n' + err.errors;
    } else if (err?.errors && Array.isArray(err.errors)) {
      errorMessage += '\n\nDetails:\n' + err.errors.map(e => `- ${e}`).join('\n');
    } else if (err?.error) {
      errorMessage += '\n\n' + err.error;
    }
    console.error('Erreur complète :', err);
    alert(errorMessage);
  };

  const CurrentStepComponent = STEP_COMPONENTS[currentStepIndex];
  const stepContent = isLastStep
    ? <FinalisationStep onSuccess={handleSuccess} onError={handleError} />
    : <CurrentStepComponent key={currentStepIndex} />;

  return (
    <div className="deposit-page">
      <div className="deposit-container">
        <Navbar />
        <Header badge={t('deposit.badge')} title={t('deposit.title')} />

        <div className="deposit-form-zone">
          <Stepper currentStep={currentStepIndex} totalSteps={4} />
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
                className={`deposit-btn-submit ${justEnabled ? 'deposit-btn-submit--just-enabled' : ''}`}
                disabled={!canGoNext}
              >
                {t('deposit.stepBtn', { n: currentStepIndex + 2 })}
              </button>
            )}
            <AnimatePresence mode="wait">
              {!isLastStep && !canGoNext && (
                <motion.p
                  key={currentStepIndex}
                  className="deposit-step1-hint"
                  role="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  {STEP_HINTS[currentStepIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <Footer />
      </div>

      {showSuccessModal && successData?.videoId && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseSuccessModal}
          videoId={successData.videoId}
          message={successData.message}
        />
      )}
    </div>
  );
};

const DepositFilm = () => (
  <DepositFormProvider>
    <DepositFilmInner />
  </DepositFormProvider>
);

export default DepositFilm;
