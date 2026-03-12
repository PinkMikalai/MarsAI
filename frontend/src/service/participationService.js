import api from './api.js';

export const participationService = {
    // Récupérer les données d'une participation via token (GET)
    getParticipationByToken: (token) =>
        api(`/participation/details/${token}`, { checkAuth: false }),

    // Soumettre les modifications d'une participation (PUT)
    updateParticipation: (formData) =>
        api('/participation/edit', {
            method: 'PUT',
            body: formData,
            checkAuth: false,
        }),

    // Admin : récupérer toutes les participations (GET)
    getAllParticipations: async () => {
        const res = await api('/videos', { method: 'GET' });
        return res?.data ?? res;
    },

    // Admin : envoyer une invitation d'édition pour une vidéo (POST)
    sendEditInvitation: (videoId) =>
        api(`/participation/${videoId}/send-edit-invitation`, { method: 'POST' }),

    // Super admin : supprimer une participation (DELETE)
    deleteParticipation: (videoId) =>
        api(`/videos/${videoId}`, { method: 'DELETE' }),
};
