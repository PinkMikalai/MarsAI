// Utilitaires partagés pour les composants CMS (AdminCms, CmsPhases, Hero)

export const getIllustrationUrl = (val) => {
    if (!val) return null;
    if (/^https?:\/\//.test(val)) return val;
    const base = import.meta.env.VITE_API_URL.replace(/\/marsai\/?$/, '');
    return `${base}/assets/uploads/images/${val}`;
};

export const parseComponents = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
};

/**
 * Retourne le compte à rebours précis (jours + heures) d'une phase.
 * @param {object} phase - entrée CMS avec start_date / end_date
 * @param {string} lang  - code langue (ex: 'fr', 'en')
 * @returns {{ days: number, hours: number, type: 'upcoming'|'active'|'urgent', isFr: boolean } | null}
 */
export const getCountdown = (phase, lang) => {
    const isFr = lang?.startsWith('fr');
    const now  = new Date();

    const start = phase.start_date ? new Date(phase.start_date) : null;
    const end   = phase.end_date   ? new Date(phase.end_date)   : null;

    const toDH = (ms) => {
        const totalH = Math.max(0, Math.floor(ms / (1000 * 60 * 60)));
        return { days: Math.floor(totalH / 24), hours: totalH % 24 };
    };

    if (start && now < start) {
        const { days, hours } = toDH(start - now);
        return { days, hours, type: 'upcoming', isFr };
    }
    if (end) {
        // Fin de journée = minuit du lendemain
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (now <= endOfDay) {
            const { days, hours } = toDH(endOfDay - now);
            const type = days === 0 ? 'urgent' : days <= 3 ? 'urgent' : 'active';
            return { days, hours, type, isFr };
        }
    }
    return null;
};
