import { testConnection } from "./db/index.js";
import 'dotenv/config';
import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
    console.log("Le port n est pas retrouve, veuillez vous verifier le fichier env");
    process.exit(1);
}

app.listen(PORT, async () => {
    await testConnection();
    console.log(`serveur lance sur le port ${PORT}, Allez ASMA, nous sommes les champions`);
});
