import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { juryService } from '../../service/juryService';
import { fadeUp, fadeIn, slideRight } from '../../utils/animations';

const CRITERIA = [
  { num: '1', key: 'criterion1', color: '#246BAD' },
  { num: '2', key: 'criterion2', color: '#246BAD' },
  { num: '3', key: 'criterion3', color: '#246BAD' },
  { num: '4', key: 'criterion4', color: '#246BAD' },
];

const Placeholder = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const JuryPage = () => {
  const { t } = useTranslation();
  const [members, setMembers]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [imgErrors, setImgErrors] = useState(new Set());
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;
    juryService.getAll()
      .then((data) => { if (!cancelled) setMembers(data.jurys || []); })
      .catch(() => { if (!cancelled) setMembers([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const featured = selectedId
    ? members.find((m) => m.id === selectedId) || members[0] || null
    : members[0] || null;

  const rest = members.filter((m) => m.id !== featured?.id);

  const getImg = (m, key) => ({
    url: juryService.getJuryImageUrl(m?.illustration),
    hasError: imgErrors.has(key),
  });

  const addImgError = (key) => setImgErrors((p) => new Set([...p, key]));

  return (
    <div className="jury-page">

      {/* ── SCROLL 1 : HERO ──────────────────────────────────── */}
      <section className="jury-hero-section">
        <div className="jury-hero-section__blur jury-hero-section__blur--l" />
        <div className="jury-hero-section__blur jury-hero-section__blur--r" />

        <div className="jury-hero-section__inner">

          {/* Colonne gauche : photo featured */}
          <div className="jury-featured">
            {loading ? (
              <div className="jury-featured__skeleton" />
            ) : (
              <AnimatePresence mode="wait">
                {featured && (() => {
                  const key = `feat-${featured.id}`;
                  const { url, hasError } = getImg(featured, key);
                  return (
                    <motion.div
                      key={key}
                      className="jury-featured__card"
                      variants={fadeIn}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      {url && !hasError ? (
                        <img
                          src={url}
                          alt={`${featured.firstname} ${featured.lastname}`}
                          className="jury-featured__img"
                          onError={() => addImgError(key)}
                        />
                      ) : (
                        <div className="jury-featured__placeholder"><Placeholder size={56} /></div>
                      )}
                      <div className="jury-featured__overlay" />
                      <div className="jury-featured__info">
                        <span className="jury-featured__role">{t('juryPage.featuredRole')}</span>
                        <span className="jury-featured__name">{featured.firstname} {featured.lastname}</span>
                      </div>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            )}
          </div>

          {/* Colonne droite : titre + bio */}
          <div className="jury-hero-details">
            <motion.p
              className="jury-hero-details__kicker"
              variants={fadeUp} custom={0}
              initial="hidden" animate="visible"
            >
              {t('juryPage.heroLabel')}
            </motion.p>

            <motion.h1
              className="jury-hero-details__title"
              variants={fadeUp} custom={1}
              initial="hidden" animate="visible"
            >
              {t('juryPage.heroTitle')}{' '}
              <span className="jury-hero-details__accent">{t('juryPage.heroTitleAccent')}</span>
            </motion.h1>

            <AnimatePresence mode="wait">
              {featured?.bio ? (
                <motion.div
                  key={`bio-${featured.id}`}
                  className="jury-hero-details__quote"
                  variants={slideRight}
                  initial="hidden" animate="visible" exit="exit"
                >
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
                    <path d="M8 20c0-4 2-7 6-8l1 2c-2 .7-3 2-3 4h3v6H8v-4zm12 0c0-4 2-7 6-8l1 2c-2 .7-3 2-3 4h3v6h-7v-4z" fill="rgba(255,255,255,0.15)" />
                  </svg>
                  <p className="jury-hero-details__bio">{featured.bio}</p>
                </motion.div>
              ) : (
                <motion.p
                  key="desc"
                  className="jury-hero-details__desc"
                  variants={fadeUp} custom={2}
                  initial="hidden" animate="visible" exit="exit"
                >
                  {t('juryPage.heroDesc')}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel des autres membres (sans doublons) */}
        {!loading && rest.length > 0 && (
          <motion.div
            className="jury-carousel"
            variants={fadeUp} custom={3}
            initial="hidden" animate="visible"
          >
            <div className="jury-carousel__track">
              {rest.map((m, i) => {
                const key = `c-${m.id}`;
                const { url, hasError } = getImg(m, key);
                const isActive = featured?.id === m.id;
                return (
                  <motion.div
                    key={key}
                    className={`jury-carousel__card${isActive ? ' jury-carousel__card--active' : ''}`}
                    onClick={() => setSelectedId(m.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedId(m.id)}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.07, duration: 0.4 } }}
                  >
                    <div className="jury-carousel__img-wrap">
                      {url && !hasError ? (
                        <img
                          src={url}
                          alt={`${m.firstname} ${m.lastname}`}
                          className="jury-carousel__img"
                          loading="lazy"
                          onError={() => addImgError(key)}
                        />
                      ) : (
                        <div className="jury-carousel__placeholder"><Placeholder size={28} /></div>
                      )}
                      <div className="jury-carousel__overlay" />
                    </div>
                    <div className="jury-carousel__info">
                      <span className="jury-carousel__role">{t('juryPage.memberRole')}</span>
                      <span className="jury-carousel__name">{m.firstname}<br />{m.lastname}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {!loading && members.length === 0 && (
          <p className="jury-empty">{t('juryPage.noMembers')}</p>
        )}
      </section>

      {/* ── SCROLL 2 : CRITÈRES ──────────────────────────────── */}
      <motion.section
        className="jury-criteria"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="jury-criteria__bg-blur" />
        <div className="jury-criteria__inner">
          <div className="jury-criteria__head">
            <div>
              <p className="jury-criteria__kicker">{t('juryPage.criteriaKicker')}</p>
              <h2 className="jury-criteria__title">{t('juryPage.criteriaTitle')}</h2>
            </div>
            <p className="jury-criteria__desc">{t('juryPage.criteriaDesc')}</p>
          </div>
          <div className="jury-criteria__grid">
            {CRITERIA.map((c, i) => (
              <motion.div
                key={c.num}
                className="jury-criterion"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
              >
                <div className="jury-criterion__badge" style={{ background: c.color }}>
                  <span>{c.num}</span>
                </div>
                <div className="jury-criterion__content">
                  <h3 className="jury-criterion__label">{t(`juryPage.${c.key}Title`)}</h3>
                  <p className="jury-criterion__text">{t(`juryPage.${c.key}Desc`)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

    </div>
  );
};

export default JuryPage;
