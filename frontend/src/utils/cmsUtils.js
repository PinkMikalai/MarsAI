// Utilitaires partagés pour les composants CMS (AdminCms, CmsPhases)

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
