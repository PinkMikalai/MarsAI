import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Reveal from '../ui/common/Reveal';
import { fadeUp } from '../../utils/animations';

const PRIZES = [
    {
        rank: '01',
        labelKey: 'prizes.first.label',
        titleKey: 'prizes.first.title',
        descKey: 'prizes.first.desc',
        defaultLabel: 'Grand Prix',
        defaultTitle: 'Meilleur Film',
        defaultDesc: "Décerné au film qui s'est distingué par sa vision artistique, sa narration et son impact émotionnel sur le jury.",
        gradient: 'linear-gradient(135deg, #f7c948 0%, #f4a100 100%)',
        glow: 'rgba(247, 201, 72, 0.25)',
        border: 'rgba(247, 201, 72, 0.3)',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.82 21L12 17.27L18.18 21L17 13.97L22 9.24L14.81 8.63L12 2Z"
                    fill="url(#gold)" stroke="rgba(247,201,72,0.6)" strokeWidth="0.5" />
                <defs>
                    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f7c948" />
                        <stop offset="100%" stopColor="#f4a100" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    },
    {
        rank: '02',
        labelKey: 'prizes.second.label',
        titleKey: 'prizes.second.title',
        descKey: 'prizes.second.desc',
        defaultLabel: 'Prix du Jury',
        defaultTitle: 'Coup de Cœur',
        defaultDesc: "Attribué au film ayant suscité le plus d'enthousiasme parmi les membres du jury pour son originalité et son audace.",
        gradient: 'linear-gradient(135deg, #c0c8d8 0%, #8899b0 100%)',
        glow: 'rgba(192, 200, 216, 0.2)',
        border: 'rgba(192, 200, 216, 0.25)',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.82 21L12 17.27L18.18 21L17 13.97L22 9.24L14.81 8.63L12 2Z"
                    fill="url(#silver)" stroke="rgba(192,200,216,0.5)" strokeWidth="0.5" />
                <defs>
                    <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#c0c8d8" />
                        <stop offset="100%" stopColor="#8899b0" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    },
    {
        rank: '03',
        labelKey: 'prizes.third.label',
        titleKey: 'prizes.third.title',
        descKey: 'prizes.third.desc',
        defaultLabel: 'Prix du Public',
        defaultTitle: 'Meilleur Court-Métrage',
        defaultDesc: "Remis au film plébiscité par le public lors des projections officielles, récompensant la connexion avec le spectateur.",
        gradient: 'linear-gradient(135deg, #cd7f32 0%, #8b4513 100%)',
        glow: 'rgba(205, 127, 50, 0.2)',
        border: 'rgba(205, 127, 50, 0.25)',
        icon: (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 2L9.19 8.63L2 9.24L7 13.97L5.82 21L12 17.27L18.18 21L17 13.97L22 9.24L14.81 8.63L12 2Z"
                    fill="url(#bronze)" stroke="rgba(205,127,50,0.5)" strokeWidth="0.5" />
                <defs>
                    <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#cd7f32" />
                        <stop offset="100%" stopColor="#8b4513" />
                    </linearGradient>
                </defs>
            </svg>
        ),
    },
];

const PrixSection = () => {
    const { t } = useTranslation();

    return (
        <section className="home-section home-prix" aria-labelledby="prix-title">
            <div className="home-container">

                <Reveal as="div" className="home-prix__header">
                    <p className="home-section-subtitle">{t('prizes.kicker', { defaultValue: 'Festival MarsAI' })}</p>
                    <h2 id="prix-title" className="home-section-title">
                        {t('prizes.title', { defaultValue: 'Les' })}{' '}
                        <span className="home-section-title-accent">
                            {t('prizes.titleAccent', { defaultValue: 'Prix' })}
                        </span>
                    </h2>
                    <p className="home-section-desc">
                        {t('prizes.desc', { defaultValue: 'Trois distinctions remises aux films les plus remarquables de la compétition officielle.' })}
                    </p>
                </Reveal>

                <Reveal stagger as="div" className="home-prix__grid">
                    {PRIZES.map((prize) => (
                        <motion.article
                            key={prize.rank}
                            className="home-prix__card"
                            variants={fadeUp}
                            style={{ '--card-glow': prize.glow, '--card-border': prize.border }}
                        >
                            <div className="home-prix__card-top">
                                <span className="home-prix__rank">{prize.rank}</span>
                                <div
                                    className="home-prix__icon"
                                    style={{ background: `radial-gradient(circle, ${prize.glow} 0%, transparent 70%)` }}
                                >
                                    {prize.icon}
                                </div>
                            </div>

                            <div
                                className="home-prix__label-wrap"
                                style={{ background: prize.gradient }}
                            >
                                <span className="home-prix__label">
                                    {t(prize.labelKey, { defaultValue: prize.defaultLabel })}
                                </span>
                            </div>

                            <h3 className="home-prix__title">
                                {t(prize.titleKey, { defaultValue: prize.defaultTitle })}
                            </h3>
                            <p className="home-prix__desc">
                                {t(prize.descKey, { defaultValue: prize.defaultDesc })}
                            </p>

                            <div
                                className="home-prix__card-glow"
                                style={{ background: `radial-gradient(ellipse at top, ${prize.glow}, transparent 70%)` }}
                                aria-hidden
                            />
                        </motion.article>
                    ))}
                </Reveal>

            </div>
        </section>
    );
};

export default PrixSection;
