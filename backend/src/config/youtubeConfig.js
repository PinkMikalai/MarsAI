import { google } from 'googleapis';

const SCOPES = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl',
];

function getOAuth2Client() {
    const clientId = process.env.YOUTUBE_CLIENT_ID; 
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET; 
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/callback';

    if (!clientId || !clientSecret) {
        throw new Error("Variables YOUTUBE manquantes dans le .env");
    }
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri 
    )
    const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN?.trim(); 
    if (refreshToken) {
        oauth2Client.setCredentials({ refresh_token: refreshToken })
    }
    return oauth2Client; 
}

function getAuthUrl() {
    const oauth2Client = getOAuth2Client();
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent', 
    });
}

async function getTokensFromCode(code) {
    const oauth2Client = getOAuth2Client(); 
    const { tokens } = await oauth2Client.getToken(code); 
    return tokens; 
}

export { getOAuth2Client, getAuthUrl, getTokensFromCode, SCOPES };
