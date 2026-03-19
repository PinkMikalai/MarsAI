import { testConnection } from "./db/index.js";
import cors from 'cors';
import 'dotenv/config';
import app from "./app.js";

app.use(cors());

const PORT = process.env.PORT;

if (!PORT) {
    process.exit(1);
}

app.listen(PORT, async () => {
    await testConnection();
});

