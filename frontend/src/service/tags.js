import api from '../service/api';

export const tagsService = { 
    getMostUsedTags: async () => {
        try {
            const data = await api('/tags/most-used', { method: 'GET' });
            return data;
        } catch (error) {

            console.error('Erreur lors de la récupération des tags les plus utilisés:', error);
            throw error;
        }
    }
};
