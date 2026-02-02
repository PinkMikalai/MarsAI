// import du packet express
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const router = require("./routes");
const error = require("./middlewares/errorMiddleware");

// creation de l application express
const app = express();

// configuration de l application
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// configuration de la route
app.use("/marsai", router);
//test

module.exports = app;