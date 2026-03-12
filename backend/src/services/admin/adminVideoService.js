import {
    createAdminVideoModel,
    getAdminVideoByIdModel,
    getAdminVideoByUserIdAndVideoIdModel,
    getAllAdminVideoModel,
    getAdminVideoByUserIdModel,
    updateAdminVideoModel,
    deleteAdminVideoByIdModel,
    deleteVideoAdminByVideoIdModel
} from "../../models/admin/adminVideoModel";

export const adminVideoService = {
    getAll: async () => await getAllAdminVideoModel(),

    getById: async (id) => await getAdminVideoByIdModel(id),

    getByVideo: async (videoId) => await getAdminVideoByVideoIdodel(videoId),

    getByUser: async (userId) => await getAdminVideoByUserIdModel(userId),

    getByUserAndVideo: async (userId, videoId) => await getAdminVideoByUserIdAndVideoIdModel(userId, videoId),

    create: async (data) => await createAdminVideoModel(data),

    update: async (id, data) => await updateAdminVideoModel(id, data),

    delete: async (id) => await deleteAdminVideoByIdModel(id),

    deleteByVideo: async (videoId) => await deleteVideoAdminByVideoIdModel(videoId)
};