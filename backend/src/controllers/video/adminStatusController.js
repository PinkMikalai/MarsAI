import { getAllAdminStatusModel } from "../../models/video/adminStatusModel.js";

async function getAllAdminStatus(req, res) {
    try {
        const statuses = await getAllAdminStatusModel();
        res.status(200).json({
            message: "Statuts admin récupérés avec succès",
            statuses,
            status: true,
        });
    } catch (error) {
        console.error("erreur getAllAdminStatus:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des statuts admin",
            status: false,
            error: error.message,
        });
    }
}

export { getAllAdminStatus };
