// Affiche sur l'accueil les phases actives autorisées par l'admin

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import cmsService from "../../service/cmsService";
import FilmsCompetition from "./FilmsCompetition";
import OnboardingModal from "../ui/modal/OnboardingModal";
import Reveal from "../ui/common/Reveal";
import { getIllustrationUrl, parseComponents, getCountdown } from "../../utils/cmsUtils";
import { fadeUp } from "../../utils/animations";
import { ROUTES } from "../../constants/routes";
import { videoApi, getCoverUrl } from "../../service/galleryService";

// ── Thème visuel par type de composant principal ──────────────
const THEMES = {
    participation: {
        gradient: 'linear-gradient(135deg, #2B7FFF 0%, #9810FA 100%)',
        overlay: 'linear-gradient(100deg, rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.78) 45%, rgba(4,6,20,0.38) 100%)',
        accent: '#2B7FFF',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
    gallery: {
        gradient: 'linear-gradient(135deg, #9810FA 0%, #AD46FF 100%)',
        overlay: 'linear-gradient(100deg, rgba(8,4,20,0.92) 0%, rgba(8,4,20,0.78) 45%, rgba(8,4,20,0.38) 100%)',
        accent: '#AD46FF',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        ),
    },
    awards: {
        gradient: 'linear-gradient(135deg, #f7c948 0%, #f4a100 100%)',
        overlay: 'linear-gradient(100deg, rgba(12,8,2,0.92) 0%, rgba(12,8,2,0.78) 45%, rgba(12,8,2,0.35) 100%)',
        accent: '#f7c948',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.82 21L12 17.27L18.18 21L17 13.97L22 9.24L14.81 8.63L12 2Z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
        ),
    },
    default: {
        gradient: 'linear-gradient(135deg, #51A2FF 0%, #AD46FF 100%)',
        overlay: 'linear-gradient(100deg, rgba(4,6,20,0.92) 0%, rgba(4,6,20,0.78) 45%, rgba(4,6,20,0.38) 100%)',
        accent: '#51A2FF',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
        ),
    },
};

const getTheme = (components) => {
    if (components.includes('awards'))        return THEMES.awards;
    if (components.includes('gallery'))       return THEMES.gallery;
    if (components.includes('participation')) return THEMES.participation;
    return THEMES.default;
};

const formatElement = (element) =>
    element.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ── Timer inline ──────────────────────────────────────────────
const PhaseTimer = ({ countdown }) => {
    if (!countdown) return null;
    return (
        <div className={`cms-timer cms-timer--${countdown.type}`}>
            <svg className="cms-timer__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            {countdown.type === 'upcoming' && (
                <span className="cms-timer__prefix">{countdown.isFr ? 'Dans' : 'In'}</span>
            )}
            {countdown.days > 0 && (
                <span className="cms-timer__unit">
                    <strong>{countdown.days}</strong>{countdown.isFr ? ' J' : ' D'}
                </span>
            )}
            <span className="cms-timer__sep">·</span>
            <span className="cms-timer__unit">
                <strong>{countdown.hours}</strong>{' H'}
            </span>
        </div>
    );
};

// ── Gagnants compacts dans la bannière awards ─────────────────
const RANK_LABEL = { 1: '🥇', 2: '🥈', 3: '🥉' };

const WinnersInline = ({ isFr }) => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        videoApi.getWinners()
            .then((res) => { if (!cancelled) setWinners(res?.data ?? []); })
            .catch(() => { if (!cancelled) setWinners([]); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, []);

    if (loading) return (
        <div className="cms-winners-loading">
            <span /><span /><span />
        </div>
    );
    if (winners.length === 0) return null;

    return (
        <div className="cms-winners-inline">
            <p className="cms-winners-inline__label">
                {isFr ? 'Gagnants' : 'Winners'}
            </p>
            <div className="cms-winners-inline__grid">
                {winners.slice(0, 4).map((film) => {
                    const coverUrl = getCoverUrl(film.cover);
                    const topAward = [...(film.awards ?? [])]
                        .sort((a, b) => a.award_rank - b.award_rank)[0];
                    return (
                        <Link
                            key={film.id}
                            to={ROUTES.WATCH_FILM.replace(':videoId', film.id)}
                            className="cms-winner-card"
                        >
                            <div className="cms-winner-card__thumb">
                                {coverUrl
                                    ? <img src={coverUrl} alt={film.title} loading="lazy" decoding="async" />
                                    : <div className="cms-winner-card__thumb-fallback" />
                                }
                                {topAward && (
                                    <span className="cms-winner-card__rank">
                                        {RANK_LABEL[topAward.award_rank] ?? ''}
                                    </span>
                                )}
                            </div>
                            <div className="cms-winner-card__info">
                                <span className="cms-winner-card__title">{film.title}</span>
                                {topAward && (
                                    <span className="cms-winner-card__award">{topAward.title}</span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
const CmsPhases = () => {
    const { i18n } = useTranslation();

    const [phases,         setPhases]         = useState([]);
    const [galleryPublic,  setGalleryPublic]  = useState(false);
    const [isLoading,      setIsLoading]      = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const fetchPhases = async () => {
            try {
                const data = await cmsService.getAllCms();
                const all  = data.result ?? [];
                const galleryEntry = all.find((e) => e.element === 'gallery_visibility');
                setGalleryPublic(galleryEntry?.is_active === 1);
                setPhases(all.filter((e) => e.is_active === 1 && e.element !== 'gallery_visibility'));
            } catch (err) {
                console.error('CmsPhases fetch error:', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPhases();
    }, []);

    if (isLoading || phases.length === 0) return null;

    const isFr = i18n.language?.startsWith('fr');
    const fullWidthSections = [];

    return (
        <>
            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

            <section className="home-section home-cms-phases" aria-label="Phases du festival">
                <div className="home-container">

                    <Reveal as="div" className="home-cms-phases__header">
                        <p className="home-section-subtitle">
                            {isFr ? 'Festival MarsAI' : 'MarsAI Festival'}
                        </p>
                        <h2 className="home-section-title">
                            {isFr ? 'Phases ' : 'Current '}
                            <span className="home-section-title-accent">
                                {isFr ? 'en cours' : 'Phases'}
                            </span>
                        </h2>
                    </Reveal>

                    <div className="home-cms-phases__list">
                        {phases.map((phase) => {
                            const components       = parseComponents(phase.components);
                            const hasParticipation = components.includes('participation');
                            const hasGallery       = components.includes('gallery');
                            const hasAwards        = components.includes('awards');
                            const theme            = getTheme(components);
                            const countdown        = getCountdown(phase, i18n.language);
                            const description      = isFr
                                ? (phase.french_content  || phase.english_content || formatElement(phase.element))
                                : (phase.english_content || phase.french_content  || formatElement(phase.element));
                            const illustrationUrl  = getIllustrationUrl(phase.illustration);
                            const label            = formatElement(phase.element);

                            if (hasGallery && galleryPublic && !fullWidthSections.includes('gallery'))
                                fullWidthSections.push('gallery');

                            // Label et action du bouton CTA gauche
                            let ctaLabel  = null;
                            let ctaAction = null;
                            let ctaLink   = null;

                            if (hasParticipation) {
                                ctaLabel  = isFr ? 'Participer' : 'Participate';
                                ctaAction = () => setShowOnboarding(true);
                            } else if (hasGallery) {
                                ctaLabel = isFr ? 'Voir la galerie' : 'See the gallery';
                                ctaLink  = ROUTES.GALLERY_FILMS;
                            } else if (hasAwards) {
                                ctaLabel = isFr ? 'Découvrir les gagnants' : 'Discover the winners';
                            } else {
                                ctaLabel = label;
                            }

                            return (
                                <motion.article
                                    key={phase.id}
                                    className={`home-cms-banner${hasAwards ? ' home-cms-banner--awards' : ''}`}
                                    variants={fadeUp}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    {/* Fond : illustration uniquement — sans image, fond body */}
                                    {illustrationUrl && (
                                        <div
                                            className="home-cms-banner__bg"
                                            style={{ backgroundImage: `url(${illustrationUrl})` }}
                                        />
                                    )}
                                    {/* Overlay gradient uniquement si image présente */}
                                    {illustrationUrl && (
                                        <div className="home-cms-banner__overlay" aria-hidden />
                                    )}

                                    {/* Contenu */}
                                    <div className="home-cms-banner__content">

                                        {/* ── Colonne gauche : CTA + timer (+ description si awards) ── */}
                                        <div className="home-cms-banner__left">
                                            {ctaLabel && (
                                                ctaLink ? (
                                                    <Link to={ctaLink} className="home-cms-banner__cta">
                                                        <span>{ctaLabel.toUpperCase()}</span>
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="home-cms-banner__cta"
                                                        onClick={ctaAction || undefined}
                                                    >
                                                        <span>{ctaLabel.toUpperCase()}</span>
                                                    </button>
                                                )
                                            )}
                                            <PhaseTimer countdown={countdown} />
                                            {hasAwards && description && (
                                                <p className="home-cms-banner__desc home-cms-banner__desc--left">
                                                    {description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Séparateur vertical */}
                                        <div className="home-cms-banner__sep" aria-hidden />

                                        {/* ── Colonne droite : description OU gagnants ── */}
                                        <div className="home-cms-banner__right">
                                            {hasAwards
                                                ? <WinnersInline isFr={isFr} />
                                                : description && (
                                                    <p className="home-cms-banner__desc">{description}</p>
                                                )
                                            }
                                        </div>
                                    </div>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            </section>

            {fullWidthSections.includes('gallery') && <FilmsCompetition />}
        </>
    );
};

export default CmsPhases;
