// Affiche sur l'accueil les phases actives autorisées par l'admin

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import cmsService from "../../service/cmsService";
import FilmsCompetition from "./FilmsCompetition";
import AwardsWinners from "./AwardsWinners";
import OnboardingModal from "../ui/modal/OnboardingModal";
import { useAuth } from "../../context/AuthContext";
import { useLightbox } from "../../hooks/useLightbox";
import Lightbox from "../ui/display/Lightbox";
import Reveal from "../ui/common/Reveal";
import { getIllustrationUrl, parseComponents, getCountdown } from "../../utils/cmsUtils";
import { fadeUp } from "../../utils/animations";

// ── Thème visuel par type de composant principal ──────────────
const THEMES = {
    participation: {
        gradient: 'linear-gradient(135deg, #2B7FFF 0%, #9810FA 100%)',
        glow: 'rgba(43, 127, 255, 0.22)',
        border: 'rgba(43, 127, 255, 0.35)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
        ),
    },
    gallery: {
        gradient: 'linear-gradient(135deg, #9810FA 0%, #AD46FF 100%)',
        glow: 'rgba(152, 16, 250, 0.22)',
        border: 'rgba(152, 16, 250, 0.35)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    awards: {
        gradient: 'linear-gradient(135deg, #f7c948 0%, #f4a100 100%)',
        glow: 'rgba(247, 201, 72, 0.22)',
        border: 'rgba(247, 201, 72, 0.3)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.82 21L12 17.27L18.18 21L17 13.97L22 9.24L14.81 8.63L12 2Z"
                    stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
        ),
    },
    default: {
        gradient: 'linear-gradient(135deg, #51A2FF 0%, #AD46FF 100%)',
        glow: 'rgba(81, 162, 255, 0.2)',
        border: 'rgba(81, 162, 255, 0.3)',
        icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

// ── Formatte l'identifiant element en label lisible ───────────
const formatElement = (element) =>
    element.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ─────────────────────────────────────────────────────────────
const CmsPhases = () => {
    const { i18n } = useTranslation();
    const { isAdmin, isSuperAdmin, isSelector } = useAuth();
    const isPrivileged = isAdmin || isSuperAdmin || isSelector;

    const [phases,          setPhases]          = useState([]);
    const [galleryPublic,   setGalleryPublic]   = useState(false);
    const [isLoading,       setIsLoading]       = useState(true);
    const [showOnboarding,  setShowOnboarding]  = useState(false);
    const { lightboxProps, openLightbox } = useLightbox();

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

    // Sépare les phases "informatives" des sections pleine largeur à afficher après
    const fullWidthSections = [];

    return (
        <>
            {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
            <Lightbox {...lightboxProps} />

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

                    <Reveal stagger as="div" className={`home-cms-phases__grid home-cms-phases__grid--${Math.min(phases.length, 3)}`}>
                        {phases.map((phase, index) => {
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

                            // Enregistre les sections full-width à afficher après la grille
                            if (hasGallery && (galleryPublic || isPrivileged)) {
                                if (!fullWidthSections.includes('gallery')) fullWidthSections.push('gallery');
                            }
                            if (hasAwards) {
                                if (!fullWidthSections.includes('awards')) fullWidthSections.push('awards');
                            }

                            return (
                                <motion.article
                                    key={phase.id}
                                    className="home-cms-card"
                                    variants={fadeUp}
                                    style={{ '--card-glow': theme.glow, '--card-border': theme.border }}
                                >
                                    {/* Top : index + icône */}
                                    <div className="home-cms-card__top">
                                        <span className="home-cms-card__rank">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <div
                                            className="home-cms-card__icon"
                                            style={{ color: 'white', background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }}
                                        >
                                            {theme.icon}
                                        </div>
                                    </div>

                                    {/* Label coloré */}
                                    <div className="home-cms-card__label-wrap" style={{ background: theme.gradient }}>
                                        <span className="home-cms-card__label">{label}</span>
                                    </div>

                                    {/* Description */}
                                    {description && (
                                        <p className="home-cms-card__desc">{description}</p>
                                    )}

                                    {/* Countdown */}
                                    {countdown && (
                                        <div className={`cms-timer cms-timer--${countdown.type}`}>
                                            <svg className="cms-timer__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                                                <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                            </svg>
                                            {countdown.type === 'upcoming' && (
                                                <span className="cms-timer__prefix">
                                                    {countdown.isFr ? 'Dans' : 'In'}
                                                </span>
                                            )}
                                            {countdown.days > 0 && (
                                                <span className="cms-timer__unit">
                                                    <strong>{countdown.days}</strong>
                                                    {countdown.isFr ? ' J' : ' D'}
                                                </span>
                                            )}
                                            <span className="cms-timer__sep">·</span>
                                            <span className="cms-timer__unit">
                                                <strong>{countdown.hours}</strong>
                                                {' H'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Illustration */}
                                    {illustrationUrl && (
                                        <div className="home-cms-card__illustration">
                                            <img
                                                src={illustrationUrl}
                                                alt={description}
                                                className="home-cms-card__illustration-img"
                                                onClick={() => openLightbox([illustrationUrl], 0)}
                                            />
                                        </div>
                                    )}

                                    {/* CTA participation */}
                                    {hasParticipation && (
                                        <div className="home-cms-card__actions">
                                            <button
                                                className="home-cms-card__cta"
                                                style={{ background: theme.gradient }}
                                                onClick={() => setShowOnboarding(true)}
                                            >
                                                {isFr ? 'Participer' : 'Participate'}
                                            </button>
                                        </div>
                                    )}

                                    {/* Halo de fond au hover */}
                                    <div
                                        className="home-cms-card__glow"
                                        style={{ background: `radial-gradient(ellipse at top, ${theme.glow}, transparent 70%)` }}
                                        aria-hidden
                                    />
                                </motion.article>
                            );
                        })}
                    </Reveal>
                </div>
            </section>

            {/* Sections pleine largeur après la grille */}
            {fullWidthSections.includes('gallery') && <FilmsCompetition />}
            {fullWidthSections.includes('awards')  && <AwardsWinners />}
        </>
    );
};

export default CmsPhases;
