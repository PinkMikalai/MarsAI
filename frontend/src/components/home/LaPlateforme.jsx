import React from 'react';
import { FiMapPin } from 'react-icons/fi';

const LaPlateforme = () => {
  return (
    <section className="home-section home-plateforme" aria-label="La plateforme">
      <div className="home-container">
        <h2 className="home-section-title home-section-title--outline">LA PLATEFORME</h2>
        <p className="home-section-subtitle">Un lieu d&apos;échange et de découverte</p>
        <p className="home-section-desc">Marseille, France</p>
        <div className="home-plateforme-cards">
          <article className="home-card home-card--dark">
            <h3 className="home-card-title">SALLE DES ÉTOILES</h3>
            <p className="home-card-desc">Projections et cérémonie principale.</p>
          </article>
          <article className="home-card home-card--dark">
            <h3 className="home-card-title">SALLE PLÉNIÈRE</h3>
            <p className="home-card-desc">Workshops et conférences.</p>
          </article>
        </div>
        <div className="home-map-wrap">
          <div className="home-map-placeholder">
            <FiMapPin size={48} strokeWidth={1.5} aria-hidden />
            <span>Carte — Marseille</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaPlateforme;
