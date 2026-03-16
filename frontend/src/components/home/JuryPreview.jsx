import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../constants/routes';
import { juryService } from '../../service/juryService';
import Reveal from '../ui/common/Reveal';
import { fadeUp, scaleIn } from '../../utils/animations';
import { useLightbox } from '../../hooks/useLightbox';
import Lightbox from '../ui/display/Lightbox';

const JuryPreview = () => {
  const { t } = useTranslation();
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [imgErrors, setImgErrors] = useState(new Set());
  const { lightboxProps, openLightbox } = useLightbox();

  useEffect(() => {
    let cancelled = false;
    juryService.getAll()
      .then((data) => { if (!cancelled) setMembers(data.jurys || []); })
      .catch(() => { if (!cancelled) setMembers([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="home-section home-jury-preview" aria-label={t('juryPage.membersTitle')}>
      <div className="home-container home-jury-preview__container">
        <Reveal as="h2" className="home-section-title home-jury-preview__title">
          {t('juryPage.previewTitle')}{' '}
          <span className="home-section-title-accent">{t('juryPage.previewTitleAccent')}</span>
        </Reveal>

        {loading ? (
          <div className="home-jury-preview__grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="home-jury-avatar home-jury-avatar--skeleton" />
            ))}
          </div>
        ) : members.length === 0 ? null : (
          <Reveal stagger as="div" className="home-jury-preview__grid">
            {members.map((m, index) => {
              const imgUrl   = juryService.getJuryImageUrl(m.illustration);
              const hasError = imgErrors.has(m.id);
              const allImages = members
                .map((member) => juryService.getJuryImageUrl(member.illustration))
                .filter(Boolean);
              
              const handleImageClick = () => {
                if (imgUrl && !hasError && allImages.length > 0) {
                  const clickedIndex = allImages.findIndex(url => url === imgUrl);
                  openLightbox(allImages, clickedIndex >= 0 ? clickedIndex : index);
                }
              };

              return (
                <motion.div key={m.id} className="home-jury-avatar" variants={scaleIn}>
                  <div 
                    className={`home-jury-avatar__img-wrap ${imgUrl && !hasError ? 'home-jury-avatar__img-wrap--clickable' : ''}`}
                    onClick={handleImageClick}
                    style={{ cursor: imgUrl && !hasError ? 'pointer' : 'default' }}
                  >
                    {imgUrl && !hasError ? (
                      <img
                        src={imgUrl}
                        alt={`${m.firstname} ${m.lastname}`}
                        className="home-jury-avatar__img"
                        loading="lazy"
                        onError={() => setImgErrors((p) => new Set([...p, m.id]))}
                      />
                    ) : (
                      <div className="home-jury-avatar__placeholder">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className="home-jury-avatar__name">{m.firstname}<br />{m.lastname}</p>
                </motion.div>
              );
            })}
          </Reveal>
        )}

        <Reveal as="span" delay={0.2}>
          <Link to={ROUTES.JURY} className="home-jury-preview__link">
            {t('juryPage.previewCta')} →
          </Link>
        </Reveal>
      </div>
      <Lightbox {...lightboxProps} />
    </section>
  );
};

export default JuryPreview;
