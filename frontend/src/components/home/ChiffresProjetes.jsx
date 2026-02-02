import React from 'react';

const ChiffresProjetes = () => {
  return (
    <section className="home-section home-chiffres" aria-label="Chiffres projetés">
      <div className="home-container">
        <h2 className="home-section-title">
          CHIFFRES <span className="home-section-title-pink">PROJETÉS</span>
        </h2>
        <div className="home-chiffres-grid">
          <article className="home-chiffre-card">
            <span className="home-chiffre-value">+120</span>
            <p className="home-card-desc">Participants attendus</p>
          </article>
          <article className="home-chiffre-card">
            <span className="home-chiffre-value">+600</span>
            <p className="home-card-desc">Visiteurs sur les deux jours</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ChiffresProjetes;
