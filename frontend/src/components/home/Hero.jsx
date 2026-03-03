// Hero , section hero de la page d'accueil MarsAI avec vidéo ou FX en boucle ------------//

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../constants/routes';
import Navbar from '../layout/Navbar';
import OnboardingModal from '../ui/modal/OnboardingModal';
import heroVideo from '../../assets/videos/videoloop3.mp4';

const USE_VIDEO_BACKGROUND = true; /* true = vidéo MP4, false = animation FX bleu/magenta seamless */
const PARALLAX_FACTOR = 0.25; /* 0.25 = vidéo bouge à 25% de la vitesse du scroll */

const Hero = () => {
  const { t } = useTranslation();
  const videoHome = useRef(null);
  const [scrollY,       setScrollY]       = useState(0);
  const [modalOpen,     setModalOpen]     = useState(false);

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
            autoPlay
            muted
            loop
            playsInline
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

      <div className="hero-content">
        <h1 className="hero-title">
          <span className="hero-title-mars">MARS.</span>
          <span className="hero-title-ai">A.I</span>
        </h1>
        <p className="hero-tagline">{t('hero.tagline')}</p>
        <p className="hero-description">
          {t('hero.description')}
        </p>
        <div className="hero-cta">
          <button type="button" className="hero-btn hero-btn-primary" onClick={openModal}>
            {t('hero.ctaParticipate')}
          </button>
          <button type="button" className="hero-btn hero-btn-secondary" onClick={openModal}>
            {t('hero.ctaLearnMore')}
          </button>
        </div>
      </div>

      {modalOpen && <OnboardingModal onClose={closeModal} />}
    </section>
  );
};

export default Hero;
