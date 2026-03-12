// HeroPhases — affiche les phases actives directement dans le Hero
// Remplace les boutons CTA du Hero

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import cmsService from '../../service/cmsService';
import CountdownClock from './CountdownClock';
import OnboardingModal from '../ui/modal/OnboardingModal';
import { fadeUp } from '../../utils/animations';

const parseComponents = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
};

const getTarget = (phase) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = phase.start_date ? new Date(phase.start_date) : null;
    const end   = phase.end_date   ? new Date(phase.end_date)   : null;

    if (start && today < start) return { date: phase.start_date, label: 'Commence dans' };
    if (end) return { date: phase.end_date, label: 'Se termine dans' };
    return null;
};

const HeroPhases = () => {
    const [phases, setPhases]             = useState([]);
    const [modalOpen, setModalOpen]       = useState(false);
    const openModal  = useCallback(() => setModalOpen(true),  []);
    const closeModal = useCallback(() => setModalOpen(false), []);

    useEffect(() => {
        cmsService.getAllCms()
            .then((data) => {
                const all = data.result ?? [];
                const active = all.filter((e) => e.is_active === 1 && (e.start_date || e.end_date));
                setPhases(active);
            })
            .catch(() => setPhases([]));
    }, []);

    if (phases.length === 0) return null;

    return (
        <>
            <motion.div className="hero-phases" variants={fadeUp}>
                {phases.map((phase) => {
                    const comps         = parseComponents(phase.components);
                    const hasParticip   = comps.includes('participation');
                    const target        = getTarget(phase);
                    const label         = phase.french_content || phase.element.replace(/_/g, ' ');

                    return (
                        <div key={phase.id} className="hero-phase-card">
                            <div className="hero-phase-card__header">
                                <span className="hero-phase-card__label">{label}</span>
                                {target && (
                                    <span className="hero-phase-card__sublabel">{target.label}</span>
                                )}
                            </div>

                            {target && (
                                <CountdownClock
                                    targetDate={target.date}
                                    showDays
                                />
                            )}

                            {hasParticip && (
                                <button
                                    type="button"
                                    className="hero-btn hero-btn-primary hero-phase-card__cta"
                                    onClick={openModal}
                                >
                                    Participer
                                </button>
                            )}
                        </div>
                    );
                })}
            </motion.div>

            {modalOpen && <OnboardingModal onClose={closeModal} />}
        </>
    );
};

export default HeroPhases;
