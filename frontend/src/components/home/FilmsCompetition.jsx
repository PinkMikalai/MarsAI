import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { videoApi, getCoverUrl } from '../../service/galleryService';

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const FilmsCompetition = () => {
  const { t } = useTranslation();
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    videoApi.getAllVideos()
      .then((res) => {
        if (cancelled) return;
        // La réponse backend a la forme { success: true, data: [...] }
        const list = (res?.success && Array.isArray(res.data)) ? res.data : [];
        setFilms(shuffle(list).slice(0, 3));
      })
      .catch(() => { if (!cancelled) setFilms([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="home-section home-films" aria-label="Films en compétition">
      <div className="home-container">
        <h2 className="home-section-title">
          {t('home.films.sectionTitle')}{' '}
          <span className="home-section-title-accent">{t('home.films.sectionAccent')}</span>
        </h2>
        <p className="home-section-desc">{t('home.films.desc')}</p>
        <Link to={ROUTES.GALLERY_FILMS} className="home-section-link">
          {t('home.films.seeAll')}
        </Link>

        {loading ? (
          <div className="home-films-loading">
            {[1, 2, 3].map((n) => (
              <div key={n} className="home-film-card home-film-card--skeleton" />
            ))}
          </div>
        ) : films.length === 0 ? (
          <p className="home-films-empty">
            {t('home.films.empty', 'Aucun film disponible pour le moment.')}
          </p>
        ) : (
          <div className="home-films-grid">
            {films.map((film) => {
              const title = film.title || film.title_en || '—';
              const director = [film.realisator_firstname, film.realisator_lastname]
                .filter(Boolean).join(' ') || '—';
              const coverUrl = getCoverUrl(film.cover);
              const hasError = imageErrors.has(film.id);

              return (
                <Link
                  key={film.id}
                  to={ROUTES.WATCH_FILM.replace(':videoId', film.id)}
                  className="home-film-card-link"
                >
                  <article className="home-film-card">
                    <div className="home-film-card-image">
                      {coverUrl && !hasError ? (
                        <img
                          src={coverUrl}
                          alt={title}
                          loading="lazy"
                          decoding="async"
                          onError={() =>
                            setImageErrors((prev) => new Set([...prev, film.id]))
                          }
                        />
                      ) : (
                        <div className="home-film-card-image-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M4 16L8.586 11.414C9.367 10.633 10.633 10.633 11.414 11.414L16 16M14 14L15.586 12.414C16.367 11.633 17.633 11.633 18.414 12.414L20 14M14 8H14.01M6 20H18C19.105 20 20 19.105 20 18V6C20 4.895 19.105 4 18 4H6C4.895 4 4 4.895 4 6V18C4 19.105 4.895 20 6 20Z"
                              stroke="currentColor" strokeWidth="2"
                              strokeLinecap="round" strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="home-film-card-body">
                      <h3 className="home-film-card-title">{title}</h3>
                      <p className="home-film-card-desc">{director}</p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FilmsCompetition;
