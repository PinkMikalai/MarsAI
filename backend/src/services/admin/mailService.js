const nodemailer = require('nodemailer');

// console.log("DEBUG MAIL_USER:", process.env.MAIL_USER);
console.log("CONFIG TEST:", { host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT });
const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST || '127.0.0.1',
    port: Number(process.env.EMAIL_PORT) || 1025,
    secure: false, 
    ignoreTLS: true
   
});

const sendInvitationEmail = async ({ email, token ,role }) => {
    const frontendUrl = process.env.FRONT_URL || 'http://localhost:5173';
    // Le lien que l'utilisateur recevra dans sa boîte Mailtrap
    const invitationLink = `${frontendUrl}/register_user?token=${token}`;

    const mailOptions = {
        from: '"MarsAI Staff" <no-reply@marsai-festival.com>',
        to: email,
        subject: "Create your MarsAi profile and join the team | Créer votre compte et rejoignez l'équipe du festival MarsAI",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #2c3e50; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                
            <div lang="en" style="color: #7f8c8d;">
                    <h2 style="color: #2980b9;">Welcome to MarsAI!</h2>
                    <p>Hello,</p>
                    <p>You are invited to join the  MarsAI festival team as <strong>${role}</strong>.</p>
                    <p>Please click the button below to set your password and complete your profile:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${invitationLink}" 
                           style="background: #2980b9; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                           Complete my registration
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #bdc3c7;">This link expires in 48 hours.</p>
                </div>

                <div lang="fr">
                    <h2 style="color: #3498db;">Bienvenue chez MarsAI !</h2>
                    <p>Bonjour,</p>
                    <p>Vous êtes invité à rejoindre l'équipe du festival MarsAI en tant que <strong>${role}</strong>.</p>
                    <p>Veuillez cliquer sur le bouton ci-dessous pour définir votre mot de passe et finaliser votre profil :</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${invitationLink}" 
                           style="background: #3498db; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                           Finaliser mon inscription
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #95a5a6;">Ce lien expire dans 48 heures.</p>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">

                
                <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #bdc3c7;">
                    &copy; 2026 MarsAI Festival - Marseille, France
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(' Mail receptionné  ! ID:', info.messageId);
        return info;
    } catch (error) {
        console.error(" Erreur envi invit  :", error);
        throw new Error("Impossible d'envoyer l'email d'invitation.");
    }
};

module.exports = { sendInvitationEmail };