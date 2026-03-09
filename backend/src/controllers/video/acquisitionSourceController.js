import { getAllAcquisitionSourcesModel } from "../../models/video/acquisitionSourceModel.js";

async function getAllAcquisitionSources(req, res) {
    try {
        const sources = await getAllAcquisitionSourcesModel();
        res.status(200).json({ sources, status: true });
    } catch (error) {
        console.error("erreur getAllAcquisitionSources:", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des sources d'acquisition",
            status: false,
            error: error.message,
        });
    }
}

export { getAllAcquisitionSources };
