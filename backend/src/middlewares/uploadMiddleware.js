// =====================================================
// UPLOAD - MIDDLEWARE
// =====================================================

const multer = require('multer'); 
const path = require('paht'); 

// configuration du stockage 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';


    }
})

