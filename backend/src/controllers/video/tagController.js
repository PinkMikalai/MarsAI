const { getMostUsedTagsModel, createTagModel, normalizeTags } = require("../../models/video/tagModel");




// afficher les tags les plus utilises
async function getMostUsedTags(req, res) {
    try {
        const tags = await getMostUsedTagsModel();

        //console log cmder
        console.log(tags);
        res.status(200).json({
            message: "Tags les plus utilises",
            tags: tags,
            status: "success"
        });
    } catch (error) {
        res.status(500).json({ 
            message: error.message,
            status: "error"
        });
    }
}

module.exports = {
    getMostUsedTags
};