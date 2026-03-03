import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FiFilm, FiZap, FiX, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { ROUTES } from '../../../constants/routes';

const STEPS_COUNT = 2;
const STEP_ICONS  = [FiFilm, FiZap];
const STEP_COLORS = ['purple', 'blue'];

const OnboardingModal = ({ onClose }) => {
  const { t }    = useTranslation();
  const navigate = useNavigate();

  const [step,    setStep]    = useState(0);
  const [animDir, setAnimDir] = useState('forward');

  /* Fermer sur Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  /* Bloquer le scroll du body */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const goNext = useCallback(() => {
    if (step < STEPS_COUNT - 1) { setAnimDir('forward');  setStep(s => s + 1); }
  }, [step]);

  const goPrev = useCallback(() => {
    if (step > 0) { setAnimDir('backward'); setStep(s => s - 1); }
  }, [step]);

  const goToStep = useCallback((i) => {
    setAnimDir(i > step ? 'forward' : 'backward');
    setStep(i);
  }, [step]);

  const handleParticipate = useCallback(() => {
    onClose();
    navigate(ROUTES.PARTICIPATE);
  }, [onClose, navigate]);

  const Icon   = STEP_ICONS[step];
  const isLast = step === STEPS_COUNT - 1;

  /* Items de chaque étape */
  const stepItems = [
    ['step1Item1', 'step1Item2', 'step1Item3', 'step1Item4'],
    [],
  ];

  return (
    <div
      className="onboarding-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t(`onboarding.step${step + 1}Title`)}
    >
      <div className="onboarding-card" onClick={(e) => e.stopPropagation()}>

        {/* ── Header : dots + fermer ── */}
        <div className="onboarding-header">
          <div className="onboarding-dots">
            {Array.from({ length: STEPS_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={`onboarding-dot${i === step ? ' onboarding-dot--active' : ''}${i < step ? ' onboarding-dot--done' : ''}`}
                onClick={() => goToStep(i)}
                aria-label={`Étape ${i + 1}`}
              />
            ))}
          </div>
          <span className="onboarding-step-counter">
            {t('onboarding.stepOf', { current: step + 1, total: STEPS_COUNT })}
          </span>
          <button
            type="button"
            className="onboarding-close"
            onClick={onClose}
            aria-label={t('onboarding.close')}
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ── Contenu de l'étape (key force remount = re-animation) ── */}
        <div key={step} className={`onboarding-step onboarding-step--${animDir}`}>
          <div className={`onboarding-icon-wrap onboarding-icon-wrap--${STEP_COLORS[step]}`}>
            <Icon size={28} strokeWidth={1.5} aria-hidden />
          </div>
          <h2 className="onboarding-step-title">{t(`onboarding.step${step + 1}Title`)}</h2>
          <p className="onboarding-step-desc">{t(`onboarding.step${step + 1}Desc`)}</p>
          {stepItems[step].length > 0 && (
            <ul className="onboarding-step-items">
              {stepItems[step].map((key) => (
                <li key={key} className="onboarding-step-item">
                  <span className="onboarding-step-item-bullet" aria-hidden />
                  {t(`onboarding.${key}`)}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer : navigation ── */}
        <div className="onboarding-footer">
          <button
            type="button"
            className={`onboarding-btn-prev${step === 0 ? ' onboarding-btn-prev--hidden' : ''}`}
            onClick={goPrev}
            disabled={step === 0}
          >
            <FiArrowLeft size={15} aria-hidden />
            {t('onboarding.prev')}
          </button>

          {isLast ? (
            <button type="button" className="onboarding-btn-cta" onClick={handleParticipate}>
              {t('onboarding.cta')}
              <FiArrowRight size={15} aria-hidden />
            </button>
          ) : (
            <button type="button" className="onboarding-btn-next" onClick={goNext}>
              {t('onboarding.next')}
              <FiArrowRight size={15} aria-hidden />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
