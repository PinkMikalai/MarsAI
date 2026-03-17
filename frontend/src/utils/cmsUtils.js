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
 * Retourne le compte à rebours précis (jours + heures + minutes) d'une phase.
 * @param {object} phase - entrée CMS avec start_date / end_date
 * @param {string} lang  - code langue (ex: 'fr', 'en')
 * @returns {{ days: number, hours: number, minutes: number, type: 'upcoming'|'active'|'urgent', isFr: boolean } | null}
 */
export const getCountdown = (phase, lang) => {
    const isFr = lang?.startsWith('fr');
    const now  = new Date();

    const start = phase.start_date ? new Date(phase.start_date) : null;
    const end   = phase.end_date   ? new Date(phase.end_date)   : null;

    const toDHM = (ms) => {
        const totalMs      = Math.max(0, ms);
        const totalMinutes = Math.floor(totalMs / (1000 * 60));
        const days         = Math.floor(totalMinutes / (60 * 24));
        const hours        = Math.floor((totalMinutes % (60 * 24)) / 60);
        const minutes      = totalMinutes % 60;
        return { days, hours, minutes };
    };

    if (start && now < start) {
        const { days, hours, minutes } = toDHM(start - now);
        return { days, hours, minutes, type: 'upcoming', isFr };
    }
    if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (now <= endOfDay) {
            const { days, hours, minutes } = toDHM(endOfDay - now);
            const type = days === 0 ? 'urgent' : days <= 3 ? 'urgent' : 'active';
            return { days, hours, minutes, type, isFr };
        }
    }
    return null;
};
