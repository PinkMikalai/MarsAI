import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { videoApi, getCoverUrl } from '../../service/galleryService';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const RANK_LABEL = {
  1: '🥇 1er prix',
  2: '🥈 2ème prix',
  3: '🥉 3ème prix',
};

const AwardsWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    videoApi.getWinners()
      .then((res) => {
        if (!cancelled) setWinners(res?.data ?? []);
      })
      .catch(() => { if (!cancelled) setWinners([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (!loading && winners.length === 0) return null;

  return (
    <section className="home-section home-awards">
      <div className="home-container">
        <Reveal as="h2" className="home-section-title">
          PALMARÈS{' '}
          <span className="home-section-title-accent">DU FESTIVAL</span>
        </Reveal>

        {loading ? (
          <div className="home-films-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="home-film-card home-film-card--skeleton" />
            ))}
          </div>
        ) : (
          <Reveal stagger as="div" className="home-films-grid">
            {winners.map((film) => {
              const title    = film.title || '—';
              const director = [film.realisator_firstname, film.realisator_lastname].filter(Boolean).join(' ') || '—';
              const coverUrl = getCoverUrl(film.cover);
              const hasError = imageErrors.has(film.id);
              const topAward = [...(film.awards ?? [])].sort((a, b) => a.award_rank - b.award_rank)[0];

              return (
                <motion.div key={film.id} variants={fadeUp}>
                  <Link
                    to={ROUTES.WATCH_FILM.replace(':videoId', film.id)}
                    className="home-film-card-link"
                  >
                    <article className="home-film-card home-film-card--award">

                      {topAward && (
                        <div className="home-award-badge">
                          {RANK_LABEL[topAward.award_rank] || topAward.title}
                        </div>
                      )}

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
                        <div className="home-award-tags">
                          {(film.awards ?? []).map((award) => (
                            <span key={award.id} className="home-award-tag">
                              {award.title}
                            </span>
                          ))}
                        </div>
                      </div>

                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default AwardsWinners;
