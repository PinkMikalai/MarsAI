import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import EventCard, { isUpcoming } from '../../components/events/EventCard';
import { eventService } from '../../service/eventService';
import { fadeUp, fadeIn } from '../../utils/animations';
import { useLightbox } from '../../hooks/useLightbox';
import Lightbox from '../../components/ui/display/Lightbox';

/* ─── Skeleton card ──────────────────────────────────── */
const SkeletonCard = ({ featured = false }) => (
  <div className={featured ? 'ev-featured ev-featured--skeleton' : 'ev-card ev-card--skeleton'} />
);

/* ─── FILTRE tabs ─────────────────────────────────────── */
const FILTERS = ['all', 'upcoming', 'past'];

const EventsPage = () => {
  const { t } = useTranslation();
  const [events, setEvents]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [imgErrors, setImgErrors] = useState(new Set());
  const [filter, setFilter]       = useState('upcoming');
  const { lightboxProps, openLightbox } = useLightbox();

  useEffect(() => {
    let cancelled = false;
    eventService.getAll()
      .then((data) => { if (!cancelled) setEvents(data.events || []); })
      .catch(() => { if (!cancelled) setEvents([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const addImgError = (key) => setImgErrors((p) => new Set([...p, key]));

  const handleImageClick = (eventId, allEvents) => {
    const allImages = allEvents
      .map((ev) => eventService.getEventImageUrl(ev.illustration))
      .filter(Boolean);
    
    if (allImages.length > 0) {
      const clickedIndex = allEvents.findIndex(ev => ev.id === eventId);
      openLightbox(allImages, clickedIndex >= 0 ? clickedIndex : 0);
    }
  };

  /* Tri par date décroissante (les plus récents en premier) */
  const sorted = useMemo(() => (
    [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
  ), [events]);

  /* Application du filtre */
  const filtered = useMemo(() => {
    if (filter === 'upcoming') return sorted.filter((e) => isUpcoming(e.date));
    if (filter === 'past')     return sorted.filter((e) => !isUpcoming(e.date));
    return sorted;
  }, [sorted, filter]);

  const featured  = filtered[0] || null;
  const rest      = filtered.slice(1);

  return (
    <div className="events-page">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="events-hero">
        <div className="events-hero__blur events-hero__blur--l" />
        <div className="events-hero__blur events-hero__blur--r" />
        <div className="events-hero__inner">
          <motion.p
            className="events-hero__kicker"
            variants={fadeUp} custom={0} initial="hidden" animate="visible"
          >
            {t('eventsPage.heroKicker')}
          </motion.p>
          <motion.h1
            className="events-hero__title"
            variants={fadeUp} custom={1} initial="hidden" animate="visible"
          >
            {t('eventsPage.heroTitle')}{' '}
            <span className="events-hero__accent">{t('eventsPage.heroTitleAccent')}</span>
          </motion.h1>
          <motion.p
            className="events-hero__desc"
            variants={fadeUp} custom={2} initial="hidden" animate="visible"
          >
            {t('eventsPage.heroDesc')}
          </motion.p>
        </div>
      </section>

      {/* ── SECTION EVENTS ───────────────────────────────── */}
      <section className="events-section">
        <div className="events-section__bg-blur" />
        <div className="events-section__inner">

          {/* En-tête section */}
          <div className="events-section__head">
            <div>
              <p className="events-section__kicker">{t('eventsPage.sectionKicker')}</p>
              <h2 className="events-section__title">{t('eventsPage.sectionTitle')}</h2>
            </div>

            {/* Filtres */}
            <div className="events-filters" role="tablist">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={filter === f}
                  className={`events-filter-btn${filter === f ? ' events-filter-btn--active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {t(`eventsPage.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" variants={fadeIn} initial="hidden" animate="visible" exit="exit">
                <SkeletonCard featured />
                <div className="events-list">
                  {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
                </div>
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.p
                key="empty"
                className="events-empty"
                variants={fadeIn} initial="hidden" animate="visible" exit="exit"
              >
                {t('eventsPage.noEvents')}
              </motion.p>
            ) : (
              <motion.div key={filter} variants={fadeIn} initial="hidden" animate="visible" exit="exit">

                {/* Event en vedette */}
                {featured && (
                  <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
                    <EventCard
                      event={featured}
                      imageUrl={eventService.getEventImageUrl(featured.illustration)}
                      variant="featured"
                      imgError={imgErrors.has(`feat-${featured.id}`)}
                      onImgError={() => addImgError(`feat-${featured.id}`)}
                      onImageClick={() => handleImageClick(featured.id, filtered)}
                    />
                  </motion.div>
                )}

                {/* Liste des autres events */}
                {rest.length > 0 && (
                  <div className="events-list">
                    {rest.map((ev, i) => (
                      <motion.div
                        key={ev.id}
                        variants={fadeUp} custom={i + 1}
                        initial="hidden" animate="visible"
                      >
                        <EventCard
                          event={ev}
                          imageUrl={eventService.getEventImageUrl(ev.illustration)}
                          variant="compact"
                          imgError={imgErrors.has(`c-${ev.id}`)}
                          onImgError={() => addImgError(`c-${ev.id}`)}
                          onImageClick={() => handleImageClick(ev.id, filtered)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Lightbox {...lightboxProps} />
    </div>
  );
};

export default EventsPage;
