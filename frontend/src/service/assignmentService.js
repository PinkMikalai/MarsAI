import api from "./api";

export const assignmentService = {
    // création d'une ou plusieurs assignations d'une sou plusieurs videos à un ou pliusiers selectionneurs par l'admin
    createAssignment: (data) => api('/admin/assignment', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    // récupérer toutes les assignations d'une video
    getAssignmentByVideo: (video_id) => api(`/admin/assignment/video/${video_id}`, {
        method: 'GET',
    }),
    // récupérer toutes les assignations pour un selectionneur
    getAssignmentByUser: (user_id) => api(`/admin/assignment/video/${user_id}`, {
        method: 'GET',
    }),
      // récupérer toutes la data d'une assignation 
    getAssignmentData: (video_id) => api(`/admin/assignment/data/${video_id}`, {
        method: 'GET',
    }),

    //récuperer l'assignation automatique :
    autoAssignment: (videoIdsArray) => api(`/admin/auto_assignment/`, {
        method: 'POST',
        body: JSON.stringify({ video_ids: videoIdsArray })

    }),

    //modification d'une assignation par l'admin
    updateAssignment: (id, data) => api(`/admin/assignment/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    //suppression d'une assignation par l'admin
    deleteAssignment: (id) => api(`/admin/assignment/${id}`, {
        method: 'DELETE'

    }),

}