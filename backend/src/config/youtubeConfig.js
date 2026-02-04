const { google } = require('googleapis'); 

// extraction des variables  
const clientId = process.env.YOUTUBE_CLIENT_I; 
const clientSecret = process.env.YOUTUBE_CLIENT_SECRET; 
const redirectUri = process.env.YOUTUBE_REDIRECT_URI; 
const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN?.trim(); 

// vérification de présence des variables d'env (gestion d'erreurs préventive)
if (!clientId || ! clientSecret || !refreshToken) {
    throw new Error("Variables YOUTUBE manquantes dans le .env");
}

// configuration du client OAuth2
const oauth2Client = new google.auth.oauth2Client(
    clientId,
    clientSecret,
    redirectUri 
)
// injection du refresh token pour l'autonomie du client 
oauth2Client.setCredentials({
    refres_token: refreshToken
}); 

module.exports = oauth2Client;