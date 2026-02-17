import { createInvitationToken } from '../../services/user/authService.js';
import { sendInvitationEmail } from '../../services/admin/mailService.js';

const inviteUser = async (req, res, next) => {
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

export default inviteUser;
