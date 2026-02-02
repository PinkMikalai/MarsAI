const { pool } = require('../../db/index.js');

async function createStillsModel(stills, videoId) {
    try {
        if (!stills || stills.length === 0)
            return;

        const query = ` INSERT INTO still (file_name, video_id) VALUES (?, ?)`; 

        
    } catch {

    }
}