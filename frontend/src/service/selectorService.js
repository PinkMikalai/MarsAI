import api from './api';

export const selectorService = {
    // Créer un memo pour une vidéo (POST /videos/:id/memo)
    createMemo: (videoId, memoData) => api(`/videos/${videoId}/memo`, {
        method: 'POST',
        body: JSON.stringify(memoData),
    }),

    // Mettre à jour un memo (PUT /videos/memo/:id)
    updateMemo: (memoId, memoData) => api(`/videos/memo/${memoId}`, {
        method: 'PUT',
        body: JSON.stringify(memoData),
    }),

    // Supprimer un memo (DELETE /videos/memo/:id)
    deleteMemo: (memoId) => api(`/videos/memo/${memoId}`, {
        method: 'DELETE',
    }),

    // Récupérer un memo par son id (GET /videos/memo/:id)
    getMemoById: (memoId) => api(`/videos/memo/${memoId}`, {
        method: 'GET',
    }),

    // Récupérer tous les statuts de sélection depuis la BDD (GET /selection-status)
    getSelectionStatuses: () => api('/selection-status', {
        method: 'GET',
    }),
};
