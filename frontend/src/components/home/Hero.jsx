// Hero , section hero de la page d'accueil MarsAI avec vidéo ou FX en boucle ------------//

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import Navbar from '../layout/Navbar';
import OnboardingModal from '../ui/modal/OnboardingModal';
import heroVideo from '../../assets/videos/videoloop3.mp4';
import { fadeUp, staggerContainer } from '../../utils/animations';

const USE_VIDEO_BACKGROUND = true;
const PARALLAX_FACTOR = 0.25;

const Hero = () => {
  const { t } = useTranslation();
  const videoHome = useRef(null);
  const [scrollY,   setScrollY]   = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal  = useCallback(() => setModalOpen(true),  []);
  const closeModal = useCallback(() => setModalOpen(false), []);

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

      {/* Contenu animé au montage (pas whileInView — toujours visible) */}
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
        <motion.div className="hero-cta" variants={fadeUp}>
          <button type="button" className="hero-btn hero-btn-primary" onClick={openModal}>
            {t('hero.ctaParticipate')}
          </button>
          <button type="button" className="hero-btn hero-btn-secondary" onClick={openModal}>
            {t('hero.ctaLearnMore')}
          </button>
        </motion.div>
      </motion.div>

      {modalOpen && <OnboardingModal onClose={closeModal} />}
    </section>
  );
};

export default Hero;
