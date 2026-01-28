require("dotenv").config();

module.exports = {
  //recupperation de nos donnees pour pouvoir se connecter a notre bd via .env
  development: { 
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectOptions: { decimalNumbers: true },
    define: { underscored: true }
  },
  // Export db config for direct use
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
};
