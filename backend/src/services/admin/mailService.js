import nodemailer from 'nodemailer';
const frontendUrl = process.env.FRONT_URL || 'http://localhost:5173';

// console.log("DEBUG MAIL_USER:", process.env.MAIL_USER);
console.log("CONFIG TEST:", { host: process.env.EMAIL_HOST, port: process.env.EMAIL_PORT });
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || '127.0.0.1',

    port: Number(process.env.EMAIL_PORT) || 2025,
    secure: false,
    ignoreTLS: true,
    auth: null
});

const sendInvitationEmail = async ({ email, token, role }) => {
    // const frontendUrl = process.env.FRONT_URL || 'http://localhost:5173';
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
        throw new Error("Invitation email can't be send.");
    }
};

const welcomeEmail = async (email, firstname) => {
    const loginLink = `${frontendUrl}/login`;

    const mailOptions = {
        from: '"MarsAI Staff" <no-reply@marsai-festival.com>',
        to: email,
        subject: 'Your MarsAI account is ready! | Votre compte MarsAI est prêt !',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #2c3e50; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #2980b9; margin: 0;">MarsAI Festival</h1>
                </div>

                <div lang="en" style="margin-bottom: 30px;">
                    <h2 style="color: #2980b9;">Successful registration!</h2>
                    <p>Hello ${firstname},</p>
                    <p>Your profile has been successfully created. Welcome to the team!</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Username:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Access my profile:</strong> <a href="${loginLink}" style="color: #2980b9;">Access the platform</a></p>
                    </div>
                    <div style="text-align: center;">
                        <a href="${loginLink}" style="background: #2980b9; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Log In Now</a>
                    </div>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <div lang="fr">
                    <h2 style="color: #3498db;">Inscription réussie !</h2>
                    <p>Bonjour ${firstname},</p>
                    <p>Votre profil a été créé avec succès. Bienvenue dans l'équipe !</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Identifiant:</strong> ${email}</p>
                        <p style="margin: 5px 0;"><strong>Accéder à mon profil:</strong> <a href="${loginLink}" style="color: #3498db;">Accéder à la plateforme</a></p>
                    </div>
                    <div style="text-align: center;">
                        <a href="${loginLink}" style="background: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Se connecter</a>
                    </div>
                </div>

                <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #bdc3c7;">
                    &copy; 2026 MarsAI Festival - Marseille, France
                </div>
            </div>
        `
    };

    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Confirmation email error:", error);
        throw new Error("Confirmation email could not be sent.");
    }
};

const passwordResetEmail = async (email, token, firstname = 'User') => {
    const newPasswordLink = `${frontendUrl}/reset_password?token=${token}`;

    const mailOptions = {
        from: '"MarsAI Security" <no-reply@marsai-festival.com>',
        to: email,
        subject: 'Reset your password | Réinitialisation de mot de passe',
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #2c3e50; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #e74c3c; margin: 0;">MarsAI Festival</h1>
                </div>
                <div lang="en">
                    <h2 style="color: #2c3e50;">Password Reset Request</h2>
                    <p>Hello ${firstname},</p>
                    <p>To reset your password, please click the button below. This link is valid for 1 hour.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${newPasswordLink}" style="background: #e74c3c; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <div lang="fr">
                    <h2 style="color: #2c3e50;">Demande de réinitialisation</h2>
                    <p>Bonjour ${firstname},</p>
                    <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous. Ce lien est valide pendant 1 heure.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${newPasswordLink}" style="background: #e74c3c; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
                    </div>
                </div>
                <p style="font-size: 11px; color: #95a5a6; text-align: center;">If you didn't request this, you can ignore this email.</p>
            </div>
        `

    }
    try {
        return await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Reset password email error:", error);
        throw new Error("Reset password email could not be sent.");
    }
};

const confirmParticipationEmail = async (email, { title_en, realisator_firstname, realisator_lastname }) => {

    const mailOptions = {
        from: '"MarsAI Security" <no-reply@marsai-festival.com>',
        to: email,
        subject: `Confirmation de réception : ${title_en} - MarsAI`,
        html:
            `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; color: #2c3e50; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #2980b9; margin: 0;">MarsAI Festival</h1>
                </div>

                <div lang="en" style="color: #7f8c8d; margin-bottom: 30px;">
                    <h2 style="color: #2c3e50;">Submission Received!</h2>
                    <p>Hello ${realisator_firstname} ${realisator_lastname},</p>
                    <p>We have successfully received your film: <strong>${title_en}</strong>.</p>
                    <p>Your entry is now being processed by our team. Our selectors will review it shortly. You will be notified of the official selection results by email.</p>
                    <p>Thank you for being part of the MarsAI adventure!</p>
                </div>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

                <div lang="fr">
                    <h2 style="color: #3498db;">Candidature reçue !</h2>
                    <p>Bonjour ${realisator_firstname} ${realisator_lastname},</p>
                    <p>Nous avons bien reçu votre film : <strong>${title_en}</strong>.</p>
                    <p>Votre participation est maintenant enregistrée. Nos sélectionneurs vont prochainement visionner votre œuvre. Vous serez informé des résultats de la sélection officielle par e-mail.</p>
                    <p>Merci de participer à l'aventure MarsAI !</p>
                </div>

                <div style="margin-top: 40px; text-align: center; font-size: 11px; color: #bdc3c7;">
                    &copy; 2026 MarsAI Festival - Marseille, France<br>
                    This is an automated confirmation of your submission.
                </div>
            </div>
        
        `

    }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('Confirmation participation envoyée !');
        return info;
    } catch (error) {
        console.error(":", error);
        throw new Error("");
    }
};

const sendParticipationEditEmail = async (email, token, videoTitle) => {
    const frontendUrl = process.env.FRONT_URL || 'http://localhost:5173';
    const editLink = `${frontendUrl}/participation/edit/${token}`;

    const mailOptions = {
        from: '"MarsAI Staff" <no-reply@marsai-festival.com>',
        to: email,
        subject: `Finalisez votre participation : ${videoTitle} - MarsAI`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #2c3e50; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #2980b9;">Action Requise</h2>
                <p>Bonjour, vous êtes invité à compléter les détails du film : <strong>${videoTitle}</strong>.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${editLink}" style="background: #2980b9; color: white; padding: 14px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Modifier les informations du film
                    </a>
                </div>
                <p style="font-size: 11px; color: #95a5a6;">Ce lien est valable 7 jours.</p>
            </div>
        `
    };
    return await transporter.sendMail(mailOptions);
};

export { 
    sendInvitationEmail, 
    welcomeEmail, 
    passwordResetEmail, 
    confirmParticipationEmail, 
    sendParticipationEditEmail 
};