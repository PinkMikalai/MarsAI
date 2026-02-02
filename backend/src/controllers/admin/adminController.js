const { createInvitationToken } = require('../../services/user/authService');
const { sendInvitationEmail } = require('../../services/admin/mailService');

const inviteUser = async (req, res, next) => {
    try {
        const { email, role } = req.body;

        // Génération du token 
        const token = await createInvitationToken({ email, role });

        // le token est tranféré au mailService pour envoi dans le heder du message d'invitation
        await sendInvitationEmail({ email, token, role });

        res.status(200).json({
            status: "success",
            message: `Invitation send to ${email}, with success`,
            token : token
        });
    } catch (error) {
        //vers le errorMiddleware
        next(error);
    }
}; 

module.exports = inviteUser;