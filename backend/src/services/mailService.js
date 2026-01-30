const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendInvitationEmail = async ({ email, token }) => {
    const frontendUrl = process.env.FRONT_URL || 'http://localhost:5173';
    // Le lien que l'utilisateur recevra dans sa boîte Mailtrap
    const invitationLink = `${frontendUrl}/finaliser-inscription?token=${token}`;

    const mailOptions = {
        from: '"MarsAI Staff" <no-reply@marsai-festival.com>',
        to: email,
        subject: "Create your MarsAi profile and join the team",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #2c3e50;">Bienvenue !</h1>
                <p>Un administrateur vous a invité à rejoindre la plateforme du festival.</p>
                <p>Veuillez cliquer sur le bouton ci-dessous pour définir votre mot de passe et finaliser votre profil :</p>
                <div style="margin: 30px 0;">
                    <a href="${invitationLink}" 
                       style="background: #3498db; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                       Finaliser mon inscription
                    </a>
                </div>
                <p style="font-size: 12px; color: #7f8c8d;">Ce lien expire dans 48 heures.</p>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(' Mail capturé par Mailtrap ! ID:', info.messageId);
        return info;
    } catch (error) {
        console.error(" Erreur Mailtrap :", error);
        throw new Error("Impossible d'envoyer l'email d'invitation.");
    }
};

module.exports = { sendInvitationEmail };