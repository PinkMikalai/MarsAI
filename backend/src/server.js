import { testConnection } from "./db/index.js";
import 'dotenv/config';
import app from "./app.js";

const PORT = process.env.PORT;

if (!PORT) {
    process.exit(1);
}

app.listen(PORT, async () => {
    await testConnection();
});
