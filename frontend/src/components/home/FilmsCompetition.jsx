import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FILMS } from '../../constants/homeData';
import { ROUTES } from '../../constants/routes';

const FilmsCompetition = () => {
  const filmsToShow = useMemo(() => {
    const shuffled = [...FILMS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, []);

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
          {filmsToShow.map((film) => (
            <Link
              key={film.id}
              to={ROUTES.WATCH_FILM.replace(':videoId', film.id)}
              className="home-film-card-link"
            >
              <article className="home-film-card">
                <div className="home-film-card-image">
                  {film.cover && (
                    <img
                      src={film.cover}
                      alt={film.title}
                      className="home-film-card-image-img"
                    />
                  )}
                </div>
                <h3 className="home-film-card-title">{film.title}</h3>
                <p className="home-film-card-desc">{film.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmsCompetition;
