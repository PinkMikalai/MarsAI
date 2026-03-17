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
  const [activePhase,   setActivePhase]   = useState(null); // phase brute du CMS
  const [phaseInfo,     setPhaseInfo]     = useState(null); // { countdown } recalculé

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  // Chargement unique des données CMS
  useEffect(() => {
    cmsService.getAllCms()
      .then((data) => {
        const all    = (data.result ?? []).filter(
          (e) => Number(e.is_active) === 1 && e.element !== 'gallery_visibility'
        );
        const comps  = all.flatMap((e) => parseComponents(e.components));
        const unique = [...new Set(comps)];
        setShowLearnMore(unique.includes('learn_more'));

        const firstPhase = all.find((e) => {
          const comps = parseComponents(e.components);
          return comps.includes('participation') && (e.start_date || e.end_date);
        });
        if (firstPhase) setActivePhase(firstPhase);
        else setActivePhase(null);
      })
      .catch(() => {});
  }, []);

  // Recalcul du countdown chaque minute
  useEffect(() => {
    if (!activePhase) {
      setPhaseInfo(null);
      return;
    }
    const compute = () => {
      const countdown = getCountdown(activePhase, i18n.language);
      setPhaseInfo(countdown ? { countdown } : null);
    };
    compute();
    const id = setInterval(compute, 30_000);
    return () => clearInterval(id);
  }, [activePhase, i18n.language]);

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
        <motion.p className="hero-subtitle" variants={fadeUp}>
          Festival de l'IA 2026 · Marseille
        </motion.p>
        {/* ── Phase active : timer inline ── */}
        {phaseInfo?.countdown && (
          <motion.div
            className="hero-phase-info"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="hero-timer-sentence">
              <span className="hero-timer-label">Il vous reste</span>
              <div className={`cms-timer cms-timer--${phaseInfo.countdown.type}`}>
                <svg className="cms-timer__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                  <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {phaseInfo.countdown.days > 0 && (
                  <span className="cms-timer__unit">
                    <strong>{phaseInfo.countdown.days}</strong>
                    {' J'}
                  </span>
                )}
                <span className="cms-timer__sep">·</span>
                <span className="cms-timer__unit">
                  <strong>{phaseInfo.countdown.hours}</strong>
                  {' H'}
                </span>
                <span className="cms-timer__sep">·</span>
                <span className="cms-timer__unit">
                  <strong>{String(phaseInfo.countdown.minutes).padStart(2, '0')}</strong>
                  {' MIN'}
                </span>
              </div>
              <span className="hero-timer-label">pour participer</span>
            </div>
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
