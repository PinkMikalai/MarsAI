import api from './api';

export const tagsService = { 
    getMostUsedTags: async () => {
        try {
            const response =await api.get('/tags/most-used');
            return response.data;
        } catch (error) {

            console.error('Erreur lors de la récupération des tags les plus utilisés:', error);
            throw error;
        }
    }
};
