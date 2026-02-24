import { createInvitationToken } from '../../services/user/authService.js';
import { sendInvitationEmail } from '../../services/admin/mailService.js';
import { assignVideoToUser, multipleAssignments, getAssignmentByVideo, getAssignmentByUser, updateAssignment, deleteAssignment, getSelectorVideoLoad } from '../../services/admin/assignmentService.js';



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

        const result = await multipleAssignments({
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
        const result = await getAssignmentByUser(user_id);
        res.status(200).json({
            success: true,
            result: result
        })

    } catch (error) {
        next(error)
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

export {
    inviteUserController,
    createAssignmentController,
    getAssignmentByVideoController,
    getAssignmentByUserController,
    updateAssignmentController,
    deleteAssignmentController,
    getSelectorVideoLoadController

};

