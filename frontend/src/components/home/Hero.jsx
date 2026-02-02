/* Hero.jsx - Section hero de la page d'accueil MarsAI avec vidéo ou FX en boucle */

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../layout/Navbar';

const HERO_VIDEO_SRC = '/videos/videoLoop2.mp4';
const USE_VIDEO_BACKGROUND = true; /* true = vidéo MP4, false = animation FX bleu/magenta seamless */
const PARALLAX_FACTOR = 0.25; /* 0.25 = vidéo bouge à 25% de la vitesse du scroll */

const Hero = () => {
  const videoRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (!USE_VIDEO_BACKGROUND) return;
    const video = videoRef.current;
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
    <section className="hero" aria-label="Accueil MARSAI">
      {/* Fond : vidéo OU animation FX bleu → magenta (seamless) + parallaxe */}
      {USE_VIDEO_BACKGROUND ? (
        <div
          className="hero-video-wrap"
          style={{ transform: `translate3d(0, ${scrollY * PARALLAX_FACTOR}px, 0)` }}
        >
          <video
            ref={videoRef}
            className="hero-video"
            src={HERO_VIDEO_SRC}
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
        <p className="hero-tagline">IMAGINEZ DES FUTURS SOUHAITABLES</p>
        <p className="hero-description">
          Participez au festival qui place l’humain et la créativité au cœur des futurs souhaitables.
        </p>
        <div className="hero-cta">
          <a href="#en-savoir-plus" className="hero-btn hero-btn-secondary">
            EN SAVOIR PLUS
          </a>
          <Link to="/deposer-un-film" className="hero-btn hero-btn-primary">
            S&apos;INSCRIRE
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
