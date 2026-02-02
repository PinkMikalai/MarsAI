import React from 'react';
import { Link } from 'react-router-dom';
import { FILMS } from '../../constants/homeData';
import { ROUTES } from '../../constants/routes';

const FilmsCompetition = () => {
  return (
    <section className="home-section home-films" aria-label="Films en compétition">
      <div className="home-container">
        <h2 className="home-section-title">
          FILMS EN <span className="home-section-title-accent">COMPÉTITION</span>
        </h2>
        <p className="home-section-desc">
          Découvrez les films en compétition cette année et votez pour votre favori.
        </p>
        <Link to={ROUTES.GALERIE_FILMS} className="home-section-link">VOIR TOUS LES FILMS &gt;</Link>
        <div className="home-films-grid">
          {FILMS.map((film) => (
            <article key={film.id} className="home-film-card">
              <div className="home-film-card-image" />
              <h3 className="home-film-card-title">{film.title}</h3>
              <p className="home-film-card-desc">{film.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmsCompetition;
