import api from './api';

const getApi = () => import.meta.env.VITE_API_URL.replace(/\/marsai\/?$/, '');

const createCms = (data) => api('/admin/cms/create', {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
});

const getAllCms = () => api('/admin/cms/all', {
    method: 'GET',
});

const getCmsById = (id) => api(`/admin/cms/${id}`, {
    method: 'GET',
});

const updateCms = (id, data) => api(`/admin/cms/${id}`, {
    method: 'PUT',
    body: data instanceof FormData ? data : JSON.stringify(data),
});

const deleteCms = (id) => api(`/admin/cms/${id}`, {
    method: 'DELETE',
});

export default {
    createCms,
    getAllCms,
    getCmsById,
    updateCms,
    deleteCms
}