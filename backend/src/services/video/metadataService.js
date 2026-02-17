import ffmpeg from 'fluent-ffmpeg'; 


const getVideoMetada = (fullPath) => {
    // Encapsulation dasn une Promise car ffprobe est un processus externe (asynchrone)
    return new Promise((resolve, reject) => {

        // ffprobe scanne le fichier complet pour extraire les métadonnées 
        ffmpeg.ffprobe(fullPath, (err, metadata) => {
            // gestion d'erreur si le fichier est corrompu ou illisible par FFmpeg
            if (err) return reject (new Error ("Analyse impossible"));
            
            // Récupération de la durée 
            const duration = Math.round(metadata.format.duration); // metadata.format contient les infos générales du conteneur (mp4, avi..)

            // Récupération des dimensions 
            // un fichier peut avoir plusieurs "flux" (pistes) : vidéo, audio, sous-titres ...
            const videoStream = metadata.streams.find(s => s.codec_type === 'video'); 

            // sécurité : si c'est un fichier audio renommé en .mp4, on rejette 
            if (!videoStream) {
                return reject(new Error("Aucun flux vidéo trouvé dans le fichier")); 
            }

            // extraction de la largeur (width) et de la hauteur (height) de la piste vidéo 
            const { width, height } = videoStream; 

            // calcul du ratio (format de l'image) : le ratio c'est la division de largeur / hauteur. Pour 16/9 - 1920/1080 
            const currentRatio = width / height; 
            const targetRatio = 16 / 9;  //soit environ 1.77777

            const is169 = Math.abs(currentRatio - targetRatio) < 0.03; 


            resolve({
                duration, 
                width, 
                height, 
                is169
            });

        })
    })
}

export { getVideoMetada };