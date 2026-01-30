const { createInvitationToken } = require('../services/authService');
const { sendInvitationEmail } = require('../services/mailService');

const inviteUser = async (req, res, next) => {
    try {
        const { email, role } = req.body;

        // Génération du token 
        const token = await createInvitationToken({ email, role });

        // 2. On passe le token au service de mail pour l'envoyer
        await sendInvitationEmail({ email, token });

        res.status(200).json({
            status: "success",
            message: `Invitation envoyée avec succès à ${email}`
        });
    } catch (error) {
        //vers le errorMiddleware
        next(error);
    }
}; 

module.exports = inviteUser;