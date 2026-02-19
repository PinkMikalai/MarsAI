import { getAllSelectionStatusModel } from "../models/selectionStatusModel.js";

async function getAllSelectionStatus(req, res) {
    try {
        const statuses = await getAllSelectionStatusModel();
        console.log("statuts recuperes:", statuses);

        res.status(200).json({
            message: "Statuts recuperes avec succes",
            statuses: statuses,
            status: true
        });
    } catch (error) {
        console.error("erreur getAllSelectionStatus:", error);
        res.status(500).json({
            message: "Erreur lors de la recuperation des statuts",
            status: false,
            error: error.message
        });
    }
}

export { getAllSelectionStatus };
