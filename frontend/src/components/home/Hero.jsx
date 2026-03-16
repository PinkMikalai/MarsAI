// Hero , section hero de la page d'accueil MarsAI avec vidéo ou FX en boucle ------------//

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Navbar from '../layout/Navbar';
import OnboardingModal from '../ui/modal/OnboardingModal';
import heroVideo from '../../assets/videos/videoloop3.mp4';
import { fadeUp, staggerContainer } from '../../utils/animations';

const USE_VIDEO_BACKGROUND = true;
const PARALLAX_FACTOR = 0.25;
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai');

const parseComponents = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return []; }
};

const Hero = () => {
  const { t } = useTranslation();
  const videoHome = useRef(null);
  const [scrollY,       setScrollY]       = useState(0);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [showParticip,  setShowParticip]  = useState(false);
  const [showLearnMore, setShowLearnMore] = useState(false);

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    fetch(`${API_BASE}/admin/cms/all`)
      .then((r) => r.json())
      .then((data) => {
        const all    = data.result ?? [];
        const active = all.filter((e) => Number(e.is_active) === 1);
        const comps  = active.flatMap((e) => parseComponents(e.components));
        const unique = [...new Set(comps)];
        setShowParticip(unique.includes('participation'));
        setShowLearnMore(unique.includes('learn_more'));
      })
      .catch(() => {});
  }, []);

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
        <motion.p className="hero-description" variants={fadeUp}>
          {t('hero.description')}
        </motion.p>

        {(showParticip || showLearnMore) && (
          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {showParticip && (
              <button type="button" className="hero-btn hero-btn-primary" onClick={openModal}>
                {t('hero.ctaParticipate')}
              </button>
            )}
            {showLearnMore && (
              <button type="button" className="hero-btn hero-btn-secondary" onClick={openModal}>
                {t('hero.ctaLearnMore')}
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {modalOpen && <OnboardingModal onClose={closeModal} />}
    </section>
  );
};

export default Hero;
