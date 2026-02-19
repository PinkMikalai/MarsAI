import { createAssignmentModel, createMultipleAssignmentModel, updateAssignmentModel, deleteAssignmentModel } from "../../models/admin/assignementModel.js";
import { getUserByIdModel } from "../../models/user/userModel.js";
import { getVideoByIdModel } from "../../models/video/videoModel.js";

async function assignVideoToUser({ video_id, user_id, admin_id }) {

    const user = await getUserByIdModel(user_id)
    const videoData = await getVideoByIdModel(video_id)
    const videoInfo = videoData[0]?.video_json;
    console.log("vidéo récupérée :", videoInfo);
    //vérifier si le user existe 
    if (!user) {
        const error = new Error(`User n° ${user_id} doesn't exist`);

        error.status = 404;
        throw error
    }
    // verifier que l'assigné est bien un selectionneur
    if (user.role_id !== 2) {
        const error = new Error(`User n° ${user_id} is not a selector`);
        error.status = 404;
        throw error

    }
    // verifier si la video existe
    if (!videoInfo) {
        const error = new Error(`Video n° ${video_id} doesn't exist`);
        error.status = 404;
        throw error
    }

    const assignment = await createAssignmentModel({
        video_id,
        user_id,
        assigned_by: admin_id

    })
    return {
        success: true,
        message: `Video ${videoInfo.title} assigned to the selector ${user.firstname} ${user.lastname}`,
        result: assignment
    }


}

async function multipleAssignments({ video_ids, user_ids, admin_id }) {
    let assignments = [];
    // assignation d'une video à plusieurs selectionneurs
    if (Array.isArray(user_ids) && !Array.isArray(video_ids)) {
        assignments = user_ids.map(user_id => [video_ids, user_id, admin_id]);
    }
    // assignation de plusieurs vidéos à un selectionneur
    else if (Array.isArray(video_ids) && !Array.isArray(user_ids)) {
        assignments = video_ids.map(video_id =>  [video_id, user_ids, admin_id]);
    }
    // assignation de plusieurs vidéos à plusieurs selectionneurs
    else if (Array.isArray(video_ids) && Array.isArray(user_ids)) {
        user_ids.forEach(user_id => {
            video_ids.forEach(video_id => {
                assignments.push([video_id, user_id, admin_id]);

            });

        });
    }
    // assignation d'une vidéo à un selectionneur
    else if (video_ids && user_ids) {
        assignments.push([video_ids, user_ids, admin_id]);

    }
    if (assignments.length === 0){
        const error = new Error("Invalid data for multiassignments");
        error.status = 400;
        throw error;

    };

    const totalInserted = await createMultipleAssignmentModel(assignments);
      return {
        success: true,
        message: ` ${totalInserted} assignments created`,
        result: totalInserted
    };

}


async function updateAssignment(id, { video_id, user_id, admin_id }) {


    if (user_id) {
        const user = await getUserByIdModel(user_id);
        //vérifier si le user existe 
        if (!user) {
            const error = new Error(`User n° ${user_id} doesn't exist`);
            error.status = 404;
            throw error
        };
        // verifier que l'assigné est bien un selectionneur
        if (user.role_id !== 2) {
            const error = new Error(`User n° ${user_id} is not a selector`);
            error.status = 404;
            throw error

        }

    }
    if (video_id) {


        const video = await getVideoByIdModel(video_id)

        // verifier si la video existe
        if (!video) {
            const error = new Error(`Video n° ${video_id} doesn't exist`);
            error.status = 404;
            throw error
        }
    }
    const assignementUpdated = await updateAssignmentModel(id, { video_id, user_id, assigned_by: admin_id })

    if (!assignementUpdated) {
        const error = new Error(`Assignement n° ${id} can't be updated`);
        error.status = 404
        throw error
    }
    return {
        success: true,
        message: `Assignement n° ${id} updated sucessfully!`,
        result: assignementUpdated
    }

}

async function deleteAssignment(id) {
    const assignementDeleted = await deleteAssignmentModel(id);

    if (!assignementDeleted) {
        const error = new Error(`Assignment n°: ${id} can't be deleted`);
        error.status = 404;
        throw error
    }
    return {
        success: true,
        message: "Assignment deleted successfully"
    }
}

export {
    assignVideoToUser,
    multipleAssignments,
    updateAssignment,
    deleteAssignment
}