import { getMostUsedTagsModel, createTagModel, normalizeTags } from "../../models/video/tagModel.js";

async function getMostUsedTags(req, res) {
    try {
        const tags = await getMostUsedTagsModel();
        if (!tags || tags.length === 0) {
            return res.status(404).json({
                message: "Aucun tag existe",
                status: false
            });
        }
        console.log(tags);
        res.status(200).json({
            message: "Tags les plus utilises",
            tags: tags,
            status: true
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Erreur lors de la recuperation des tags les plus utilises",
            status: false
        });
    }
}

export { getMostUsedTags };
