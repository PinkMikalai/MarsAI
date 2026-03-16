// Hero , section hero de la page d'accueil MarsAI avec vidéo ou FX en boucle ------------//

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '../layout/Navbar';
import OnboardingModal from '../ui/modal/OnboardingModal';
import heroVideo from '../../assets/videos/videoloop3.mp4';
import { fadeUp, staggerContainer } from '../../utils/animations';
import cmsService from '../../service/cmsService';
import { parseComponents, getCountdown } from '../../utils/cmsUtils';

const USE_VIDEO_BACKGROUND = true;
const PARALLAX_FACTOR = 0.25;

const Hero = () => {
  const { t, i18n } = useTranslation();
  const videoHome = useRef(null);
  const [scrollY,       setScrollY]       = useState(0);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [phaseInfo,     setPhaseInfo]     = useState(null); // { description, countdown }

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    cmsService.getAllCms()
      .then((data) => {
        const all    = (data.result ?? []).filter(
          (e) => Number(e.is_active) === 1 && e.element !== 'gallery_visibility'
        );
        const comps  = all.flatMap((e) => parseComponents(e.components));
        const unique = [...new Set(comps)];
        setShowLearnMore(unique.includes('learn_more'));

        // Première phase active avec une description ou un timer
        const lang = i18n.language;
        const isFr = lang?.startsWith('fr');
        const firstPhase = all.find((e) => e.french_content || e.english_content || e.start_date || e.end_date);
        if (firstPhase) {
          const description = isFr
            ? (firstPhase.french_content  || firstPhase.english_content || '')
            : (firstPhase.english_content || firstPhase.french_content  || '');
          const countdown = getCountdown(firstPhase, lang);
          setPhaseInfo({ description, countdown });
        }
      })
      .catch(() => {});
  }, [i18n.language]);

  useEffect(() => {
    if (!USE_VIDEO_BACKGROUND) return;
    const video = videoHome.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" aria-label={t('hero.ariaLabel')}>
      {USE_VIDEO_BACKGROUND ? (
        <div
          className="hero-video-wrap"
          style={{ transform: `translate3d(0, ${scrollY * PARALLAX_FACTOR}px, 0)` }}
        >
          <video
            ref={videoHome}
            className="hero-video"
            src={heroVideo}
            autoPlay muted loop playsInline
            aria-hidden
          />
          <div className="hero-video-overlay" aria-hidden />
        </div>
      ) : (
        <div className="hero-fx-wrap" aria-hidden>
          <div className="hero-fx-base" />
          <div className="hero-fx-orb hero-fx-orb--1" />
          <div className="hero-fx-orb hero-fx-orb--2" />
          <div className="hero-fx-orb hero-fx-orb--3" />
          <div className="hero-fx-overlay" aria-hidden />
        </div>
      )}

      <div className="hero-navbar">
        <Navbar />
      </div>

      <motion.div
        className="hero-content"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={fadeUp}>
          <span className="hero-title-mars">MARS.</span>
          <span className="hero-title-ai">A.I</span>
        </motion.h1>
        <motion.p className="hero-tagline" variants={fadeUp}>
          {t('hero.tagline')}
        </motion.p>
        {/* ── Phase active : description + timer ── */}
        {phaseInfo && (
          <motion.div
            className="hero-phase-info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {phaseInfo.countdown && (
              <div className={`cms-timer cms-timer--${phaseInfo.countdown.type}`}>
                <svg className="cms-timer__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {phaseInfo.countdown.type === 'upcoming' && (
                  <span className="cms-timer__prefix">
                    {phaseInfo.countdown.isFr ? 'Dans' : 'In'}
                  </span>
                )}
                {phaseInfo.countdown.days > 0 && (
                  <span className="cms-timer__unit">
                    <strong>{phaseInfo.countdown.days}</strong>
                    {phaseInfo.countdown.isFr ? ' J' : ' D'}
                  </span>
                )}
                <span className="cms-timer__sep">·</span>
                <span className="cms-timer__unit">
                  <strong>{phaseInfo.countdown.hours}</strong>
                  {' H'}
                </span>
              </div>
            )}
            {phaseInfo.description && (
              <p className="hero-phase-desc">{phaseInfo.description}</p>
            )}
          </motion.div>
        )}

        {showLearnMore && (
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <button type="button" className="hero-btn hero-btn-secondary" onClick={openModal}>
              {t('hero.ctaLearnMore')}
            </button>
          </motion.div>
        )}
      </motion.div>

      {modalOpen && <OnboardingModal onClose={closeModal} />}
    </section>
  );
};

export default Hero;
