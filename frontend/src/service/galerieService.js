
import api from './api';
// cherche l'url malade ( a changer ptet )
const getApi = () => import.meta.env.VITE_API_URL.replace(/\/marsai\/?$/, '');

const buildUploadUrl = (value, folder) => {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;

  const origin = getApi();
  const cleanValue = value.replace(/^\//, '');
  const path = cleanValue.includes('assets/uploads')
    ? cleanValue
    : `assets/uploads/${folder}/${cleanValue}`;

  return `${origin}/${path}`;
};

export const videoApi = {
  getAllVideos: async () => {
    try {
      const response = await api ('/videos' , {
        method : 'GET'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des vidéos:', error);
      throw error;
    }
  },
  
  getVideoTags: async (videoId) => {
    try {
      const response = await api(`/videos/${videoId}` , {
         method : 'GET'
      });
      return response.data?.tags || [];
    } catch (error) {
      console.error(`Erreur de recup des tags ${videoId}:`, error);
      return [];
    }
  },
  
  getVideoById: async (videoId) => {
    try {
      const response = await get(`/videos/${videoId}`, {
        metthod: 'GET'
      });
      return response.data;
    } catch (error) {
      console.error(`Erreur de recup des videos ${videoId}:`, error);
      throw error;
    }
  }
};

export function getCoverUrl(cover) {
  return buildUploadUrl(cover, 'images');
}

export function getVideoUrl(videoFileName) {
  return buildUploadUrl(videoFileName, 'videos');
}