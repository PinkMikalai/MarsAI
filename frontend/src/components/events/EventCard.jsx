import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  ChevronDownIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

/* ─── Helpers ────────────────────────────────────────────── */
export const formatEventDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};
export const formatEventDay   = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit' }) : '—';
export const formatEventMonth = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase() : '';
export const formatEventYear  = (d) => d ? new Date(d).getFullYear() : '';
export const isUpcoming       = (d) => d && new Date(d) >= new Date();

/* ─── Panneau détails déroulant ──────────────────────────── */
const DetailsPanel = ({ event, t }) => (
  <motion.div
    className="ev-details-panel"
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="ev-details-panel__inner">
      {/* Grille de méta-données */}
      <div className="ev-details-grid">
        {event?.date && (
          <div className="ev-detail-item">
            <CalendarIcon width={16} height={16} className="ev-detail-item__icon" />
            <div>
              <span className="ev-detail-item__label">{t('eventsPage.detailDate')}</span>
              <span className="ev-detail-item__value">{formatEventDate(event.date)}</span>
            </div>
          </div>
        )}
        {event?.location && (
          <div className="ev-detail-item">
            <MapPinIcon width={16} height={16} className="ev-detail-item__icon" />
            <div>
              <span className="ev-detail-item__label">{t('eventsPage.detailLocation')}</span>
              <span className="ev-detail-item__value">{event.location}</span>
            </div>
          </div>
        )}
        {event?.duration != null && (
          <div className="ev-detail-item">
            <ClockIcon width={16} height={16} className="ev-detail-item__icon" />
            <div>
              <span className="ev-detail-item__label">{t('eventsPage.detailDuration')}</span>
              <span className="ev-detail-item__value">{event.duration} min</span>
            </div>
          </div>
        )}
        {event?.capacity != null && (
          <div className="ev-detail-item">
            <UsersIcon width={16} height={16} className="ev-detail-item__icon" />
            <div>
              <span className="ev-detail-item__label">{t('eventsPage.detailCapacity')}</span>
              <span className="ev-detail-item__value">{event.capacity} {t('eventsPage.places')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Description complète */}
      {event?.description && (
        <p className="ev-details-panel__desc">{event.description}</p>
      )}
    </div>
  </motion.div>
);

/* ─── EventCard ───────────────────────────────────────────
   variant="featured"  → grande carte horizontale (1ère)
   variant="compact"   → carte liste (les suivantes)
───────────────────────────────────────────────────────── */
const EventCard = ({ event, imageUrl, variant = 'compact', imgError, onImgError, onImageClick }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const upcoming = isUpcoming(event?.date);

  const toggle = (e) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  if (variant === 'featured') {
    return (
      <article className={`ev-featured${open ? ' ev-featured--open' : ''}`}>
        {/* Badge statut */}
        <span className={`ev-badge ${upcoming ? 'ev-badge--upcoming' : 'ev-badge--past'}`}>
          {upcoming ? t('eventsPage.badgeUpcoming') : t('eventsPage.badgePast')}
        </span>

        {/* Image */}
        <div 
          className={`ev-featured__img-wrap ${imageUrl && !imgError && onImageClick ? 'ev-featured__img-wrap--clickable' : ''}`}
          onClick={imageUrl && !imgError && onImageClick ? onImageClick : undefined}
          style={imageUrl && !imgError && onImageClick ? { cursor: 'pointer' } : {}}
        >
          {imageUrl && !imgError ? (
            <img src={imageUrl} alt={event.title} className="ev-featured__img" onError={onImgError} />
          ) : (
            <div className="ev-featured__img-placeholder">
              <CalendarIcon width={48} height={48} style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
          )}
          <div className="ev-featured__img-overlay" />
          <div className="ev-date-badge">
            <span className="ev-date-badge__day">{formatEventDay(event?.date)}</span>
            <span className="ev-date-badge__month">{formatEventMonth(event?.date)}</span>
            <span className="ev-date-badge__year">{formatEventYear(event?.date)}</span>
          </div>
        </div>

        {/* Contenu + accordion */}
        <div className="ev-featured__body">
          <p className="ev-kicker">{t('eventsPage.kicker')}</p>
          <h2 className="ev-featured__title">{event?.title}</h2>

          <div className="ev-meta">
            {event?.location && (
              <span className="ev-meta__item">
                <MapPinIcon width={14} height={14} />
                {event.location}
              </span>
            )}
            {event?.duration != null && (
              <span className="ev-meta__item">
                <ClockIcon width={14} height={14} />
                {event.duration} min
              </span>
            )}
            {event?.capacity != null && (
              <span className="ev-meta__item ev-meta__item--capacity">
                {event.capacity} {t('eventsPage.places')}
              </span>
            )}
          </div>

          {/* Aperçu description (masqué si ouvert) */}
          {!open && event?.description && (
            <p className="ev-featured__desc">{event.description}</p>
          )}

          {/* Détails déroulants */}
          <AnimatePresence>
            {open && <DetailsPanel event={event} t={t} />}
          </AnimatePresence>

          {/* Bouton accordion */}
          <button type="button" className="ev-cta ev-cta--toggle" onClick={toggle} aria-expanded={open}>
            {open ? t('eventsPage.readLess') : t('eventsPage.readMore')}
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              style={{ display: 'inline-flex' }}
            >
              <ChevronDownIcon width={15} height={15} />
            </motion.span>
          </button>
        </div>
      </article>
    );
  }

  /* ── Variant compact ── */
  return (
    <article className={`ev-card${open ? ' ev-card--open' : ''}`}>
      <div 
        className={`ev-card__img-wrap ${imageUrl && !imgError && onImageClick ? 'ev-card__img-wrap--clickable' : ''}`}
        onClick={imageUrl && !imgError && onImageClick ? onImageClick : undefined}
        style={imageUrl && !imgError && onImageClick ? { cursor: 'pointer' } : {}}
      >
        {imageUrl && !imgError ? (
          <img src={imageUrl} alt={event?.title} className="ev-card__img" onError={onImgError} loading="lazy" />
        ) : (
          <div className="ev-card__img-placeholder">
            <CalendarIcon width={28} height={28} style={{ color: 'rgba(255,255,255,0.2)' }} />
          </div>
        )}
        <div className="ev-card__img-overlay" />
        <div className="ev-date-badge ev-date-badge--sm">
          <span className="ev-date-badge__day">{formatEventDay(event?.date)}</span>
          <span className="ev-date-badge__month">{formatEventMonth(event?.date)}</span>
        </div>
        <span className={`ev-badge ev-badge--sm ${upcoming ? 'ev-badge--upcoming' : 'ev-badge--past'}`}>
          {upcoming ? t('eventsPage.badgeUpcoming') : t('eventsPage.badgePast')}
        </span>
      </div>

      <div className="ev-card__body">
        <p className="ev-kicker">{t('eventsPage.kicker')}</p>
        <h3 className="ev-card__title">{event?.title}</h3>

        <div className="ev-meta">
          {event?.location && (
            <span className="ev-meta__item">
              <MapPinIcon width={13} height={13} />
              {event.location}
            </span>
          )}
          {event?.duration != null && (
            <span className="ev-meta__item">
              <ClockIcon width={13} height={13} />
              {event.duration} min
            </span>
          )}
        </div>

        {/* Détails déroulants */}
        <AnimatePresence>
          {open && <DetailsPanel event={event} t={t} />}
        </AnimatePresence>

        {/* Bouton accordion */}
        <button type="button" className="ev-cta ev-cta--sm ev-cta--toggle" onClick={toggle} aria-expanded={open}>
          {open ? t('eventsPage.readLess') : t('eventsPage.readMore')}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: 'inline-flex' }}
          >
            <ChevronDownIcon width={13} height={13} />
          </motion.span>
        </button>
      </div>
    </article>
  );
};

export default EventCard;
