import api from './api';

const getApi = () => (import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai').replace(/\/marsai\/?$/, '');

const createCms = (data) => api('/admin/cms/create', {
    method: 'POST',
    body: JSON.stringify(data),
});

const getAllCms = () => api('/admin/cms/all', {
    method: 'GET',
});

const getActiveCms = () => api('/admin/cms/active', {
    method: 'GET',
});

const getCmsById = (id) => api(`/admin/cms/${id}`, {
    method: 'GET',
});


const updateCms = (id, data) => api(`/admin/cms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
});

const deleteCms = (id) => api(`/admin/cms/${id}`, {
    method: 'DELETE',
});

export default {
    createCms,
    getAllCms,
    getActiveCms,
    getCmsById,
    updateCms,
    deleteCms
}