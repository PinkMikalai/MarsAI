//importer le fichier de configuration de la base de donnees
const { testConnection } = require("./db/index.js");
//carger les varibles d eviranement d .env
require("dotenv").config();


const app = require("./app");

//recuperation de l a port
const PORT= process.env.PORT;

if (!PORT){
    console.log("Le port n est pas  retrouve, veuillez vous verifier le fichier env");

    // en cas si le port n est pas retouvee le proces d exEcution s arrete
    process.exit(1);

}

app.listen(PORT,async ()=>{
    await testConnection();
    console.log(`serveur lance sur le port ${PORT}, Allez ASMA, nous sommes les champions`);
    
});
