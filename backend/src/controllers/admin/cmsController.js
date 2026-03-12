import { 
    createCmsModel, 
    getAllCmsModel, 
    getCmsByIdModel, 
    updateCmsModel, 
    deleteCmsModel 
} from "../../models/admin/cmsModel.js";


async function createCmsController(req, res, next){
    try {
        const { element, english_content, french_content, illustration, is_active, start_date, end_date, components } = req.body;
        const result = await createCmsModel({
            element,
            english_content:  english_content  ?? null,
            french_content:   french_content   ?? null,
            illustration:     illustration      ?? null,
            user_id:          req.user.id,
            is_active:        is_active         ?? 0,
            start_date:       start_date        || null,
            end_date:         end_date          || null,
            components:       components        ?? null,
        });
        res.status(200).json({
            status: "success",
            message: "CMS created successfully",
            result: result
        });
    } catch (error) {
        console.error('[CMS CREATE ERROR]', error.message);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

async function getAllCmsController(req, res, next){
    try {
        const result = await getAllCmsModel();
        res.status(200).json({
            status: "success",
            message: "CMS fetched successfully",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
}

async function getCmsByIdController(req, res, next){
    try {
        const { id } = req.params;
        const result = await getCmsByIdModel(id);
        res.status(200).json({
            status: "success",  
            message: "CMS fetched successfully",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
}

async function updateCmsController(req, res, next){
    try {   
        const { id } = req.params;
        const { element, english_content, french_content, illustration, is_active, start_date, end_date, components } = req.body;
        const result = await updateCmsModel(id, {
            element,
            english_content:  english_content  ?? null,
            french_content:   french_content   ?? null,
            illustration:     illustration      ?? null,
            user_id:          req.user.id,
            is_active:        is_active         ?? 0,
            start_date:       start_date        || null,
            end_date:         end_date          || null,
            components:       components        ?? null,
        });
        res.status(200).json({
            status: "success",
            message: "CMS updated successfully",
            result: result
        });
    } catch (error) {
        console.error('[CMS UPDATE ERROR]', error.message);
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
}

async function deleteCmsController(req, res, next){
    try {
        const { id } = req.params;
        const result = await deleteCmsModel(id);
        res.status(200).json({
            status: "success",
            message: "CMS deleted successfully",
            result: result
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Internal server error",
            error: error.message
        });
    }
}

export {
    createCmsController,
    getAllCmsController,
    getCmsByIdController,
    updateCmsController,
    deleteCmsController
}