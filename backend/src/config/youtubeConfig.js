// bibliothèque officielle Google pour Node.js : permet d'intéragir avec les appli google. Pour nous, 
const { google } = require('googleapis'); 

// définition des permissions que l'on demande à youtube 
const SCOPES =  [
    'https://www.googleapis.com/auth/youtube.upload',  // droit d'uploader des videos 
    'https://www.googleapis.com/auth/youtube',  // gestion complète de la chaine 
    'https://www.googleapis.com/auth/youtube.force-ssl', // droit d'uploader des sous-titres 
];

//  
function getOAuth2Client() {
    // identifiants de l'application à récupérer depuis le .env 
    const clientId = process.env.YOUTUBE_CLIENT_ID; 
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET; 
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/callback';

    // vérification de présence des variables d'env, si l'une manque, on arrête 
    if (!clientId || ! clientSecret) {
        throw new Error("Variables YOUTUBE manquantes dans le .env");
    }
    // configuration du client OAuth2 : création d'une instance, c'est  cet objet qui gère les échanges avec google 
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri 
    )
    // récupération du jeton de renouvellement (refresh token)  pour l'automatisation
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN?.trim(); 
    if(refreshToken) {
        oauth2Client.setCredentials({ refresh_token: refreshToken})
    }
    return oauth2Client; 
}

// génére l'URL d'authentification Google permettant d'obtenir l'accord de l'utilisateur 
function getAuthUrl(){
    const oauth2Client = getOAuth2Client();
    return oauth2Client.generateAuthUrl({
        access_type: 'offline', // pour obtenir le refresh token même quand l'utilisateur n'est pas connecté 
        scope: SCOPES, // liste des permissions 
        prompt: 'consent', 
    });
}

// échange du code d'autorisation temp contre des jetons d'accès permanents 
async function getTokensFromCode(code) { // code : code d'autorisation renvoyé par Google après le consentement 
    const oauth2Client = getOAuth2Client(); 
    // requête asynchrone vers les serveurs google 
    const { tokens } = await oauth2Client.getToken(code); 
    return tokens; 
}

module.exports = {
    getOAuth2Client,
    getAuthUrl,
    getTokensFromCode,
    SCOPES,
}