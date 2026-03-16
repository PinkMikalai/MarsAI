// Affiche sur l'accueil les phases actives autorisées par l'admin

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import cmsService from "../../service/cmsService";
import FilmsCompetition from "./FilmsCompetition";
import AwardsWinners from "./AwardsWinners";
import OnboardingModal from "../ui/modal/OnboardingModal";
import { useAuth } from "../../context/AuthContext";
import { useLightbox } from "../../hooks/useLightbox";
import Lightbox from "../ui/display/Lightbox";
import { getIllustrationUrl, parseComponents } from "../../utils/cmsUtils";

const getCountdown = (phase) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = phase.start_date ? new Date(phase.start_date) : null;
    const end   = phase.end_date   ? new Date(phase.end_date)   : null;

    const diffDays = (a, b) => Math.round((a - b) / (1000 * 60 * 60 * 24));

    if (start && today < start) {
        const days = diffDays(start, today);
        return { label: `Commence dans ${days} jour${days > 1 ? 's' : ''}`, type: 'upcoming' };
    }
    if (end && today <= end) {
        const days = diffDays(end, today);
        if (days === 0) return { label: 'Dernière journée !', type: 'urgent' };
        if (days <= 3)  return { label: `Plus que ${days} jour${days > 1 ? 's' : ''} !`, type: 'urgent' };
        return { label: `${days} jour${days > 1 ? 's' : ''} restants`, type: 'active' };
    }
    return null;
};

const CmsPhases = () => {
    const { i18n, t } = useTranslation();
    const { isAdmin, isSuperAdmin, isSelector } = useAuth();
    const isPrivileged = isAdmin || isSuperAdmin || isSelector;

    const [phases, setPhases]               = useState([]);
    const [galleryPublic, setGalleryPublic] = useState(false);
    const [isLoading, setIsLoading]         = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const { lightboxProps, openLightbox }   = useLightbox();

    useEffect(() => {
        const fetchPhases = async () => {
            try {
                const data = await cmsService.getAllCms();
                const all = data.result ?? [];
                const galleryEntry = all.find((e) => e.element === 'gallery_visibility');
                setGalleryPublic(galleryEntry?.is_active === 1);
                const active = all.filter(
                    (e) => e.is_active === 1 && (e.start_date || e.end_date) && e.element !== 'gallery_visibility'
                );
                setPhases(active);
            } catch (err) {
                console.error('CmsPhases fetch error:', err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPhases();
    }, []);

    if (isLoading || phases.length === 0) return null;

    return (
        <>
            {showOnboarding && (
                <OnboardingModal onClose={() => setShowOnboarding(false)} />
            )}
            <Lightbox {...lightboxProps} />
            {phases.map((phase) => {
                const components       = parseComponents(phase.components);
                const hasParticipation = components.includes('participation');
                const hasGallery       = components.includes('gallery');
                const hasAwards        = components.includes('awards');
                const countdown        = getCountdown(phase);
                const isFr            = i18n.language?.startsWith('fr');
                const content         = isFr
                    ? (phase.french_content  || phase.english_content || phase.element.replace(/_/g, ' '))
                    : (phase.english_content || phase.french_content  || phase.element.replace(/_/g, ' '));
                const illustrationUrl  = getIllustrationUrl(phase.illustration);

                return (
                    <React.Fragment key={phase.id}>

                        {/* ── En-tête de la phase ── */}
                        <section className="home-section home-cms-phases">
                            <div className="home-container">
                                <div className="home-cms-phase-header">
                                    <h2 className="home-section-title">{content}</h2>
                                    {countdown && (
                                        <span className={`home-cms-countdown home-cms-countdown--${countdown.type}`}>
                                            {countdown.label}
                                        </span>
                                    )}
                                </div>

                                {/* ── Illustration ── */}
                                {illustrationUrl && (
                                    <div className="home-cms-illustration">
                                        <img
                                            src={illustrationUrl}
                                            alt={content}
                                            className="home-cms-illustration-media"
                                            onClick={() => openLightbox([illustrationUrl], 0)}
                                        />
                                    </div>
                                )}

                                {hasParticipation && (
                                    <div className="home-cms-actions">
                                        <button
                                            className="home-btn-gradient"
                                            onClick={() => setShowOnboarding(true)}
                                        >
                                            {isFr ? 'Participer' : 'Participate'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ── Sections pleine largeur (ont leur propre container) ── */}
                        {hasGallery && (galleryPublic || isPrivileged) && <FilmsCompetition />}
                        {hasAwards  && <AwardsWinners />}

                    </React.Fragment>
                );
            })}
        </>
    );
};

export default CmsPhases;
