import path from 'path';
import fs from 'fs';
import { google } from 'googleapis';
import { getOAuth2Client } from '../../config/youtubeConfig.js';
import { UPLOAD_BASE } from '../../middlewares/uploadMiddleware.js';


async function uploadToYouTube(videoPath, title, description, coverPath = null, srtPath = null) {
  console.log("DEBUG - Chemins reçus :", { videoPath, coverPath, srtPath });
    const fullPath = path.join(UPLOAD_BASE, videoPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Fichier vidéo introuvable: ${fullPath}`);
  }

  const oauth2Client = getOAuth2Client();
  if (!oauth2Client.credentials.refresh_token) {
    throw new Error('YOUTUBE_REFRESH_TOKEN manquant. Exécutez: node scripts/get-youtube-token.js');
  }

  // Forcer le rafraîchissement du token d'accès avant l'upload
  try {
    const token = await oauth2Client.getAccessToken();
    if (!token) {
      throw new Error('Impossible d\'obtenir un token d\'accès');
    }
  } catch (err) {
    const errorMsg = err.response?.data?.error_description || err.message;
    if (err.message.includes('invalid_grant') || errorMsg.includes('invalid_grant')) {
      throw new Error(
        `Refresh token invalide (invalid_grant). Causes possibles:\n` +
        `1. Le refresh_token dans .env est incorrect ou a des espaces\n` +
        `2. Le refresh_token a été révoqué ou expiré\n` +
        `3. Le client_id/client_secret ne correspondent pas au refresh_token\n` +
        `4. Le refresh_token a été obtenu avec un autre client_id\n` +
        `Solution: Relancez "npm run youtube-token" avec le même client_id/client_secret\n` +
        `Détails: ${errorMsg}`
      );
    }
    throw new Error(`Erreur d'authentification YouTube: ${errorMsg}`);
  }

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const fileSize = fs.statSync(fullPath).size;

  console.log(`Début de l'upload : ${title}`);

  try {
    const res = await youtube.videos.insert(
      {
        part: 'id,snippet,status',
        notifySubscribers: false,
        requestBody: {
          snippet: {
            title: title,
            description: description,
            defaultLanguage: 'en',
          },
          status: {
            privacyStatus: 'private',
          },
        },
        media: {
          body: fs.createReadStream(fullPath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = evt.bytesRead ? (evt.bytesRead / fileSize) * 100 : 0;
          process.stdout.write(`\rYouTube upload: ${Math.round(progress)}%`);
        },
      }
    );

    // Log de la réponse complète de l'API YouTube
    console.log('\nRéponse YouTube API:', JSON.stringify(res.data, null, 2));

    const videoId = res.data.id;

    // Upload de la miniature (thumbnail) si un cover est fourni
    if (coverPath) {
      try {
        await uploadThumbnail(youtube, videoId, coverPath);
        console.log('Miniature uploadée');
      } catch (thumbErr) {
        // Si la miniature échoue, on continue (la vidéo est déjà uploadée)
        console.warn('Erreur upload miniature:', thumbErr.message);
      }
    }

    // Upload des sous-titres (SRT) si fournis
    if (srtPath) {
      try {
        await uploadCaption(youtube, videoId, srtPath);
        console.log('Sous-titres uploadés');
      } catch (captionErr) {
        // Si les sous-titres échouent, on continue (la vidéo est déjà uploadée)
        console.warn('Erreur upload sous-titres:', captionErr.message);
      }
    }

    return { id: videoId };
  } catch (err) {
    // Log de l'erreur complète pour diagnostic
    console.error('\nErreur YouTube API:');
    console.error('Code:', err.code);
    console.error('Message:', err.message);
    console.error('Response:', err.response?.data ? JSON.stringify(err.response.data, null, 2) : 'Pas de response.data');

    // Améliorer le message d'erreur pour diagnostiquer
    if (err.code === 401 || err.message.includes('Unauthorized')) {
      throw new Error(
        `Erreur d'autorisation YouTube (401):\n` +
        `- Vérifiez que vous vous êtes connecté avec atif.zourgani@laplateforme.io lors de l'obtention du refresh_token\n` +
        `- Vérifiez que le compte a bien une chaîne YouTube active\n` +
        `- Relancez "npm run youtube-token" et reconnectez-vous avec le bon compte\n` +
        `Détails: ${err.message}`
      );
    }
    throw err;
  }
}

/**
 * Upload une miniature (thumbnail) pour une vidéo YouTube
 * @param {object} youtube - Instance de l'API YouTube
 * @param {string} videoId - ID de la vidéo YouTube
 * @param {string} coverPath - Chemin relatif de l'image (ex: images/cover.jpg)
 * 
 * Contraintes YouTube :
 * - Formats acceptés : JPEG, PNG, GIF
 * - Taille max : 2 Mo
 * - Résolution recommandée : 1280x720 (ratio 16:9)
 */
async function uploadThumbnail(youtube, videoId, coverPath) {
  const fullPath = path.join(UPLOAD_BASE, coverPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Image cover introuvable: ${fullPath}`);
  }

  // Vérifier la taille du fichier (max 2 Mo pour YouTube)
  const fileSize = fs.statSync(fullPath).size;
  const maxSize = 2 * 1024 * 1024; // 2 Mo
  if (fileSize > maxSize) {
    throw new Error(`L'image cover est trop volumineuse (${Math.round(fileSize / 1024 / 1024)}Mo). Max: 2 Mo.`);
  }

  // Upload de la miniature via l'API YouTube
  await youtube.thumbnails.set({
    videoId: videoId,
    media: {
      mimeType: 'image/jpeg', // YouTube accepte JPEG/PNG
      body: fs.createReadStream(fullPath),
    },
  });
}

/**
 * Upload des sous-titres (captions) pour une vidéo YouTube
 * @param {object} youtube - Instance de l'API YouTube
 * @param {string} videoId - ID de la vidéo YouTube
 * @param {string} srtPath - Chemin relatif du fichier SRT (ex: srt/subtitles.srt)
 */
async function uploadCaption(youtube, videoId, srtPath) {
  const fullPath = path.join(UPLOAD_BASE, srtPath);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`Fichier SRT introuvable: ${fullPath}`);
  }

  // Vérifier la taille du fichier (max 10 Mo pour YouTube)
  const fileSize = fs.statSync(fullPath).size;
  const maxSize = 10 * 1024 * 1024; // 10 Mo
  if (fileSize > maxSize) {
    throw new Error(`Le fichier SRT est trop volumineux (${Math.round(fileSize / 1024 / 1024)}Mo). Max: 10 Mo.`);
  }

  // Upload des sous-titres via l'API YouTube
  await youtube.captions.insert({
    part: 'snippet',
    requestBody: {
      snippet: {
        videoId: videoId,
        language: 'fr', // Langue française par défaut
        name: 'Français', // Nom affiché dans le lecteur YouTube
        isDraft: false, // Publié directement (pas en brouillon)
      },
    },
    media: {
      mimeType: 'application/x-subrip', // Format SRT
      body: fs.createReadStream(fullPath),
    },
  });
}

export { uploadToYouTube };


