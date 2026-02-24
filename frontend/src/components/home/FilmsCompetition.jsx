import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

const FilmsCompetition = () => {
  const { t } = useTranslation();

  const FILMS = useMemo(() => [
    { id: '1', titleKey: 'home.films.film1Title', descKey: 'home.films.film1Desc' },
    { id: '2', titleKey: 'home.films.film2Title', descKey: 'home.films.film2Desc' },
    { id: '3', titleKey: 'home.films.film3Title', descKey: 'home.films.film3Desc' },
  ], []);

  const filmsToShow = useMemo(() => {
    const shuffled = [...FILMS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, [FILMS]);

  return (
    <section className="home-section home-films" aria-label="Films en compétition">
      <div className="home-container">
        <h2 className="home-section-title">
          {t('home.films.sectionTitle')} <span className="home-section-title-accent">{t('home.films.sectionAccent')}</span>
        </h2>
        <p className="home-section-desc">{t('home.films.desc')}</p>
        <Link to={ROUTES.GALLERY_FILMS} className="home-section-link">{t('home.films.seeAll')}</Link>
        <div className="home-films-grid">
          {filmsToShow.map((film) => (
            <Link
              key={film.id}
              to={ROUTES.WATCH_FILM.replace(':videoId', film.id)}
              className="home-film-card-link"
            >
              <article className="home-film-card">
                <div className="home-film-card-image" />
                <h3 className="home-film-card-title">{t(film.titleKey)}</h3>
                <p className="home-film-card-desc">{t(film.descKey)}</p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilmsCompetition;
