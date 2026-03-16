import { createInvitationToken } from '../../services/user/authService.js';
import { sendInvitationEmail } from '../../services/admin/mailService.js';
import { assignVideoToUser, multipleAssignments, getAssignmentByVideo, getAssignmentByUser, updateAssignment, deleteAssignment, getSelectorVideoLoad, syncVideoAssignment, autoAssignVideos } from '../../services/admin/assignmentService.js';
import { getUsersByRoleId } from '../../models/user/userModel.js';
import { getAssignmentByVideoModel, getSelectorLoadModel } from '../../models/admin/assignementModel.js';



const inviteUserController = async (req, res, next) => {
    try {
        const { email, role } = req.body;
        const token = await createInvitationToken({ email, role });
        await sendInvitationEmail({ email, token, role });
        res.status(200).json({
            status: "success",
            message: `Invitation send to ${email}, with success`,
            token: token
        });
    } catch (error) {
        next(error);
    }
};
const createAssignmentController = async (req, res, next) => {
    try {

        const { video_id, user_id, video_ids, user_ids } = req.body;
        const admin_id = req.user.id || req.user.sub;

        const result = await syncVideoAssignment({
            video_ids: video_ids || video_id,
            user_ids: user_ids || user_id,
            admin_id
        })

        res.status(201).json({
            success: true,
            message: 'Assignment created sucessfully!',
            result: result

        })

    } catch (error) {
        next(error);

    }

}

const getAssignmentByVideoController = async (req, res, next) => {
    try {
        const { video_id } = req.params;
        const result = await getAssignmentByVideo(video_id);
        res.status(200).json({
            success: true,
            result: result
        })

    } catch (error) {
        next(error)
    }

}
const getAssignmentByUserController = async (req, res, next) => {
    try {
        const { user_id } = req.params;
        const user = req.user; 

        // Si c'est un sélectionneur (rôle 2), il ne peut connaitre que ses propres assignations
        if (user.role_id === 2 && user.id !== parseInt(user_id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: you can only view your own assignments"
            });
        }

        const result = await getAssignmentByUser(user_id);
        res.status(200).json({
            success: true,
            result: result 
        });

    } catch (error) {
        next(error);
    }
}

const updateAssignmentController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { video_id, user_id } = req.body;
        const admin_id = req.user.id || req.user.sub

        const result = await updateAssignment(id, { video_id, user_id, admin_id });

        res.status(200).json({
            success: true,
            message: "Assignment updated successfully",
            result: result
        })

    } catch (error) {
        next(error);
    }

}
const deleteAssignmentController = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await deleteAssignment(id);

        res.status(200).json({
            success: true,
            message: `Assignment ${id} deleted`,
            result: result
        })

    } catch (error) {
        next(error);
    }

}
const getSelectorVideoLoadController = async (req, res, next) => {
    try {
        const result = await getSelectorVideoLoad();
        res.status(200).json({
            success: true,
            data: result
        })

    } catch (error) {
        next(error);
    }
}

const getAssignmentDataController = async (req, res, next) => {
    try{
        const { video_id} = req.params;
        const [ allSelectors, AlreadyAssigned] = await Promise.all([
            getSelectorLoadModel(),
            getAssignmentByVideoModel(video_id)
        ]);
        res.status(200).json({
            success: true,
            data: {
                selectors : allSelectors,
                assigned : AlreadyAssigned
            }
        })
    } catch(error){
        next(error);
    }

}

const autoAssignController = async (req, res, next) => {
    try {
        // Extraction et normalisation
        const { video_ids } = req.body;
      
        const admin_id = req.user?.id || req.user?.sub;

        if (!Array.isArray(video_ids) || video_ids.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid data format." 
            });
        }

        if (!admin_id) {
            return res.status(401).json({ success: false, message: "User don't exist" });
        }

        //Appel du service
        const result = await autoAssignVideos(video_ids, admin_id);

        res.status(200).json({
            success: true,
            message: "Auto-assignment success",
            data: result
        });
    } catch (error) {
        console.error("Auto-assignment error:", error);
        next(error);
    }
};

const getAllSelectorsController = async ( req, res) => {
    try {
        const allSelectors = await getUsersByRoleId(2);
        res.status(200).json({
            success:true,
            data: allSelectors
        })
    }catch(error){
        res.status(500).json({
            error: 'An error occured during all selectors fetching'
        })

    }

}


export {
    inviteUserController,
    createAssignmentController,
    getAssignmentByVideoController,
    getAssignmentByUserController,
    updateAssignmentController,
    deleteAssignmentController,
    getSelectorVideoLoadController,
    getAssignmentDataController,
    getAllSelectorsController,
    autoAssignController

};

