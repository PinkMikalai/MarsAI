import { createTagModel, normalizeTags, linkTagsToVideo, unlinkTagsFromVideo, getTagsByVideoId } from "../../models/video/tagModel.js";

// =====================================================
// TAG - SERVICE
// =====================================================


// creer des tags
async function createTagsService(rawTags) {
    if (!rawTags || !Array.isArray(rawTags) || rawTags.length === 0) {
        return [];
    }
    
    const cleanTags = normalizeTags(rawTags);
    
    if (cleanTags.length === 0) {
        return [];
    }
    
    const tags = await createTagModel(cleanTags);
    
    return tags;
}

// creer des tags et les lier a une video
async function createAndLinkTagsService(videoId, rawTags) {
    
    const tags = await createTagsService(rawTags);
    
    if (tags.length === 0) {
        return [];
    }
    
    const tagIds = tags.map(t => t.id);
    await linkTagsToVideo(videoId, tagIds);
    
    return tags;
}

// mettre a jour les tags d une video (supprimer les anciens et ajouter les nouveaux)
async function updateTagsService(videoId, rawTags) {
    
    //supprimer tous les anciens tags
    await unlinkTagsFromVideo(videoId);
    
    //ajouter les nouveaux tags
    if (!rawTags || !Array.isArray(rawTags) || rawTags.length === 0) {
        return [];
    }
    
    const tags = await createAndLinkTagsService(videoId, rawTags);
    
    return tags;
}

// recuperer les tags d une video
async function getVideoTagsService(videoId) {
    const tags = await getTagsByVideoId(videoId);
    return tags;
}

export { createTagsService, createAndLinkTagsService, updateTagsService, getVideoTagsService };
