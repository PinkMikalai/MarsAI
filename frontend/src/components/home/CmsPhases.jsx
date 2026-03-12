// Affiche sur l'accueil les phases actives autorisées par l'admin

import React, { useEffect, useState } from "react";
import { ROUTES } from "../../constants/routes";
import cmsService from "../../service/cmsService";
import FilmsCompetition from "./FilmsCompetition";
import AwardsWinners from "./AwardsWinners";
import OnboardingModal from "../ui/modal/OnboardingModal";

const parseComponents = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
};

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
    const [phases, setPhases] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const fetchPhases = async () => {
            try {
                const data = await cmsService.getAllCms();
                const all = data.result ?? [];
                const active = all.filter((e) => e.is_active === 1 && (e.start_date || e.end_date));
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
            {phases.map((phase) => {
                const components       = parseComponents(phase.components);
                const hasParticipation = components.includes('participation');
                const hasGallery       = components.includes('gallery');
                const hasAwards        = components.includes('awards');
                const countdown        = getCountdown(phase);

                return (
                    <React.Fragment key={phase.id}>

                        {/* ── En-tête de la phase ── */}
                        <section className="home-section home-cms-phases">
                            <div className="home-container">
                                <div className="home-cms-phase-header">
                                    <h2 className="home-section-title">
                                        {phase.french_content || phase.element.replace(/_/g, ' ')}
                                    </h2>
                                    {countdown && (
                                        <span className={`home-cms-countdown home-cms-countdown--${countdown.type}`}>
                                            {countdown.label}
                                        </span>
                                    )}
                                </div>

                                {hasParticipation && (
                                    <div className="home-cms-actions">
                                        <button
                                            className="home-btn-gradient"
                                            onClick={() => setShowOnboarding(true)}
                                        >
                                            Participer
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ── Sections pleine largeur (ont leur propre container) ── */}
                        {hasGallery && <FilmsCompetition />}
                        {hasAwards  && <AwardsWinners />}

                    </React.Fragment>
                );
            })}
        </>
    );
};

export default CmsPhases;
