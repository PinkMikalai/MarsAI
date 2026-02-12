// import du packet express
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const router = require("./routes");

const notFound = require("./middlewares/notFound");



// creation de l application express
const app = express();

// configuration de l application
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir les fichiers statiques (images, vidéos, sous-titres)
const uploadsPath = path.join(__dirname, 'assets', 'uploads');
app.use('/assets/uploads', express.static(uploadsPath));

// configuration de la route
app.use("/marsai", router);


// configuration de la route not found
app.use(notFound);
//test
module.exports = app;
