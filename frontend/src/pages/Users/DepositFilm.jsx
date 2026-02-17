import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  const navigate = useNavigate();
  const { form } = useDepositForm();
  const { currentStepIndex, isFirstStep, isLastStep, back, next } =
    useMultiStepForm(STEP_COMPONENTS);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStepIndex]);
  const [successData, setSuccessData] = useState(null);

  const consentComplete = form.consent.accept_age_18 && form.consent.accept_rules && form.consent.accept_ownership;
  const canGoNext = currentStepIndex !== 0 || consentComplete;

  const [justEnabled, setJustEnabled] = useState(false);
  const prevConsentRef = React.useRef(consentComplete);
  React.useEffect(() => {
    if (currentStepIndex === 0 && consentComplete && !prevConsentRef.current) {
      setJustEnabled(true);
      const t = setTimeout(() => setJustEnabled(false), 900);
      return () => clearTimeout(t);
    }
    prevConsentRef.current = consentComplete;
  }, [consentComplete, currentStepIndex]);

  const handleSuccess = (result) => {
    console.log('🎉 Succès reçu:', result);
    
    if (result?.videoId) {
      console.log('✅ Vidéo enregistrée en base et envoyée sur YouTube, ID:', result.videoId);
      setSuccessData({
        ...result,
        message: result.message || 'Votre participation a bien été enregistrée : le film est enregistré dans notre base de données et a été envoyé sur la chaîne YouTube du festival.',
      });
      setShowSuccessModal(true);
    } else {
      console.warn('⚠️ Pas de videoId dans la réponse:', result);
      handleError({ message: 'La vidéo n\'a pas pu être enregistrée correctement. Veuillez réessayer.' });
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/');
  };
  const handleError = (err) => {
    let errorMessage = 'Erreur lors de l\'envoi.';
    
    if (err?.message) {
      errorMessage = err.message;
    }
    
    if (err?.errors && typeof err.errors === 'string') {
      errorMessage += '\n\nDétails:\n' + err.errors;
    } else if (err?.errors && Array.isArray(err.errors)) {
      errorMessage += '\n\nDétails:\n' + err.errors.map(e => `- ${e}`).join('\n');
    } else if (err?.error) {
      errorMessage += '\n\n' + err.error;
    }
    
    console.error('🔴 Erreur complète:', err);
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
        <Header badge="APPEL À PROJETS 2026" title="DÉPOSER UN FILM" />

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
                ← Précédent
              </button>
            )}
            {!isLastStep && (
              <button
                type="button"
                onClick={next}
                className={`deposit-btn-submit ${justEnabled ? 'deposit-btn-submit--just-enabled' : ''}`}
                disabled={!canGoNext}
              >
                Étape {currentStepIndex + 2}
              </button>
            )}
            <AnimatePresence mode="wait">
              {currentStepIndex === 0 && !consentComplete && (
                <motion.p
                  className="deposit-step1-hint"
                  role="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                >
                  Cochez les cases ci-dessus (âge 18 ans et acceptation des conditions) pour passer à l’étape suivante.
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
