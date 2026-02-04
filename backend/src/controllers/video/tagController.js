const { getMostUsedTagsModel, createTagModel, normalizeTags } = require("../../models/video/tagModel");




// afficher les tags les plus utilises
async function getMostUsedTags(req, res) {
    try {
        //recuperer les tags les plus utilises
        const tags = await getMostUsedTagsModel();

        //si aucun tag trouve, afficher une erreur
        if (!tags || tags.length === 0) {
            return res.status(404).json({
                message: "Aucun tag existe",
                status: false
            });
        }

        //console log cmder
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

module.exports = {
    getMostUsedTags
};